var warehouseoutModule = angular.module('warehouseout', ["util.pagination"]);

warehouseoutModule.controller("warehouseoutListController",
    ['$scope', '$http', '$state', '$alert', '$timeout', 'stockService',function ($scope, $http, $state, $alert, $timeout,stockService) {

        // warehouseout.html && warehouseout.view.html
        $scope.warehouseout_QueryData = {};                                         // 出库单查询字段
        $scope.warehouseout_QueryData.pagesize=10;
        $scope.warehouseout_Current = {};                                           // 当前出库单
        

        // warehouseout.add.html
        $scope.warehouse_temp = {};                                                 // 手工出库，临时出库单主单信息
        $scope.warehouse_temp.isCommitted=false;                                   //表单提交标识，默认为否
        $scope.warehouse_temp.warehouseoutlist = [];                                // 手工出库，临时出库单明细
        $scope.warehouse_temp.orders = { data: { rows: [], total: 0 } };           // 订单列表

        $scope.orders_QueryData = {};                                               // 订单出库查询字段

        $scope.modeldata = [];                                                      // 商品信息列表
    	//仓库下拉列表信息
    	$scope.stationLists = [];
    	$scope.showStationLists = [];
    	//手动开单仓库下拉列表信息
    	$scope.stationLists_hand = [];
    	$scope.showStationLists_hand = [];
    	//出库单查询时候仓库默认为空
    	$scope.warehouseout_QueryData.warehouseid = 0;
    	
		//获取登录信息
        $http({
            method : 'GET',
            url : '/jsbweb/base/getSession.do'
        }).success(function(data){
        	//订单出库单查询时候仓库默认选择为登录者所属仓库
        	$scope.orders_QueryData.warehouseid = data.stationid;
        	$scope.warehouse_temp.warehouseid = data.stationid;
        });
    	//获取所有仓库信息列表
        $http({
            method: 'POST',
            url: "/jsbweb/enterprise/stockList/getStation.do",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function (data) {
            if (data.ret == 0) {
            	//给商品分类增加一个默认分类
				$scope.newObject = {
						pstationid:0,
						stationid:0,
						stationname:'(空)'
				};
                $scope.stationLists = angular.copy(data.data.rows);
                $scope.stationLists_hand = angular.copy(data.data.rows);
                $scope.stationLists.push($scope.newObject);
                $scope.sortStation();
                $scope.sortStation_hand();
            }else if(data.ret == 10){
            	$.jBox.tip("请先登录", 'warning');
            }
        });      
    	//仓库下拉列表
        $scope.sortStation = function(){
    		var classify = stockService.arrayDataToTree($scope.stationLists,'stationid', 'pstationid', "0", 0);
    		console.info(classify);
    		var array = [];
    		function text(classify){
    			for(var i=0; i<classify.length;i++){
    				var a = classify[i];
    				array.push({stationname:getspace(a.level) + a.stationname,stationid:a.stationid});
    				if(a.nodes && a.nodes.length>0)
    				{
    					text(a.nodes);
    				};
    			}
    		}
    		function getspace(count){
    			var space = '';
    			while(count--){
    				space += '--';
    			}
    			
    			return space;
    		}
    		text(classify);
    		$scope.showStationLists  = array;
    	};
    	//手动开单-仓库下拉列表
        $scope.sortStation_hand = function(){
    		var classify = stockService.arrayDataToTree($scope.stationLists_hand,'stationid', 'pstationid', "0", 0);
    		console.info(classify);
    		var array = [];
    		function text(classify){
    			for(var i=0; i<classify.length;i++){
    				var a = classify[i];
    				array.push({stationname:getspace(a.level) + a.stationname,stationid:a.stationid});
    				if(a.nodes && a.nodes.length>0)
    				{
    					text(a.nodes);
    				};
    			}
    		}
    		function getspace(count){
    			var space = '';
    			while(count--){
    				space += '--';
    			}
    			
    			return space;
    		}
    		text(classify);
    		$scope.showStationLists_hand  = array;
    	};
        //出库状态字典
        $scope.states = [
            { id: 1, value: "待出库" },
            { id: 2, value: "已出库" },
            { id: 3, value: "已开发货单未出库" }
        ];

        //数据来源字典
        $scope.sourceflags = [
            { id: 1, value: "售货单" },
            { id: 2, value: "手工出库" },
            { id: 3, value: "发货单" },
            { id: 4, value: "移库单" }
        ];

        //审核状态字典
        $scope.auditflags = [
            { id: 1, value: "待审核" },
            { id: 2, value: "审核通过" },
            { id: 3, value: "审核不通过" }
        ];

        //数据来源字典转换
        $scope.convertsourceflagtoname = function (flag) {
            var name = "";
            for (var i = 0; i < $scope.sourceflags.length; i++) {
                if ($scope.sourceflags[i].id == flag) {
                    name = $scope.sourceflags[i].value;
                }
            }
            return name;
        };
        //审核状态字典转换
        $scope.convertauditflagtoname = function (flag) {
            var name = "";
            for (var i = 0; i < $scope.auditflags.length; i++) {
                if ($scope.auditflags[i].id == flag) {
                    name = $scope.auditflags[i].value;
                }
            }
            return name;
        };
        //出库状态字典转换
        $scope.convertstatetoname = function (flag) {
            var name = "";
            for (var i = 0; i < $scope.states.length; i++) {
                if ($scope.states[i].id == flag) {
                    name = $scope.states[i].value;
                }
            }
            return name;
        };



        // 查询出库单
        $scope.queryForm = function () {

            $scope.warehouseout_QueryData.orders = 'createdtime';
            $scope.warehouseout_QueryData.orderkey = 'desc';
            var tempdata= $scope.warehouseout_QueryData.endcreatedtime;
            if($scope.warehouseout_QueryData.endcreatedtime){
            	$scope.warehouseout_QueryData.endcreatedtime=  $scope.warehouseout_QueryData.endcreatedtime+' 23:59:59';
            }
            console.info("...");
            console.info($scope.warehouseout_QueryData);
            $http({
                method: 'POST',
                url: "/jsbweb/enterprise/com/get_warehouseout.do",
                data: $.param($scope.warehouseout_QueryData),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (data) {
                if (data.ret == 0) {
                    // 出库单列表
                    $scope.warehouseout_list = $scope.filterdata(data);
                }
            }).error(function (data) {
                //要清空旧数据
                $scope.warehouseout_list = $scope.cleanList();
            });

            $scope.warehouseout_QueryData.endcreatedtime=tempdata;
        };
        // 弹出添加库存层
        $scope.addWarehouseout = function () {
            $scope.warehouse_temp.sourceflags = 0;
            $scope.init_addform();
            $scope.init_record();
            $scope.searchOrder();

            $('#warehouseout_add_modal').modal({
                backdrop: 'static',
                keyboard: false
            });
            $state.go("addwarehouseout");
        };
        // 关闭添加库存层
        $scope.closeWarehouseout = function () {
            $scope.addWarehouseout_source(0);
            $('#warehouseout_add_modal').modal('hide');
        };
        // 查看出库单明细
        $scope.warehouseout_view = function (warehouseout) {
            $scope.warehouseout_Current = warehouseout;
            $scope.warehouseout_Details = $scope.cleanList();
            $http({
                method: 'POST',
                url: "/jsbweb/enterprise/com/get_warehouseoutlist.do",
                data: $.param({ warehouseoutid: $scope.warehouseout_Current.warehouseoutid }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (data) {
                if (data.ret == 0) {
                    $scope.warehouseout_Details = data;
                }
            }).error(function (data) {
                //要清空旧数据
                $scope.warehouseout_list = $scope.cleanList();
            });

            $('#warehouseout_view_modal').modal('show');
        };
        // 审核出库单
        $scope.warehouseout_audit = function (warehouseout, _state, _auditflag) {
            var warehouseoutid = warehouseout.warehouseoutid;
            if ($.trim(warehouseoutid).length == 0) {
                $.jBox.tip("请选择要审核的数据", 'warning');
                return;
            }

            var submit = function (v, h, f) {
                if (v == 'ok') {

                    $http({
                        method: 'POST',
                        url: "/jsbweb/enterprise/com/audit_warehouseout.do",
                        data: $.param({
                            warehouseoutid: warehouseoutid,
                            state: _state,
                            auditflag: _auditflag,
                            remark: '手工审核'
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function (data) {

                        if (data.ret == 0) {
                            $scope.queryForm();
                            $.jBox.tip('审核成功', 'success');
                        } else {
                            $.jBox.tip('审核失败' + data.message, 'warning');
                        }

                        if (data.ret == 10) {
                            $.jBox.tip("请先登录", 'warning');
                        }
                    });
                }
                return true; // close
            };

            if(_auditflag==3){
                $.jBox.confirm("确定要对出库单   " + warehouseout.warehouseoutnum + "审核不通过吗？", "温馨提示", submit);
            }else{
                $.jBox.confirm("确定要对出库单   " + warehouseout.warehouseoutnum + " 审核通过吗？", "温馨提示", submit);
            }

        };
        // 删除出库单
        $scope.warehouseout_del = function (warehouseout) {

            var warehouseoutid = warehouseout.warehouseoutid;
            var submit = function (v, h, f) {
                if (v == 'ok') {
                    $http({
                        method: 'POST',
                        url: "/jsbweb/enterprise/com/del_warehouseout.do",
                        data: $.param({ warehouseoutid: warehouseoutid }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function (data) {

                        if (data.ret == 0) {
                            $scope.queryForm();
                            $.jBox.tip('删除成功', 'success');
                        } else {
                            $.jBox.tip('删除失败', 'warning');
                        }

                        if (data.ret == 10) {
                            $.jBox.tip("请先登录", 'warning');
                        }

                    });
                }
                return true; //close
            };

            $.jBox.confirm("确定要删除入库单   " + warehouseout.warehouseoutnum + " 吗？", "温馨提示", submit);
        };



        $scope.datetimepickerInit = function () {
            $("#txt_createdtime_begin,#txt_createdtime_end").datetimepicker({
                language: 'zh-CN',
                autoclose: true,
                todayBtn: true,
                pickerPosition: "bottom-left",
                todayHighlight: true,
                startView: 2,
                minView: 2,
                format:'yyyy-mm-dd'
            });
        };
        // 添加出库单来源
        $scope.addWarehouseout_source = function (index) {
            if (index != $scope.warehouse_temp.sourceflags) {
                $scope.warehouse_temp.sourceflags = index;
                $scope.init_addform();
                $scope.init_record();
                if (index == 0) {
                    $scope.searchOrder();
                }

                // 订单出库=0
                // 手工出库=1                
                $('#addWarehouseout_tab li:eq(' + index + ') a').tab('show');
            }
        };
        // 添加临时记录
        $scope.add_record = function () {
            var temp = {
                goodsstockid:'',
                goodsname: '',
                batchcodeselect:{},
                leftgoodqty: '',
                goodssn: '',
                barcode: '',
                skuid: '',
                weight: '',
                //virtualflag: '1',
                goodsunitprice: 0.00,
                goodssoundqty: 1,
                goodsdamageqty: 0,
                discountmoney: 0.00,
                selected: {}
            };
            $timeout(function () {
                temp.virtualflag = '1';
            }, 1);
            $scope.warehouse_temp.warehouseoutlist.push(temp);
            //监听商品下拉选择
            $scope.$watch(function () {
                return temp.selected;
            }, function (newVal, oldVal) {
            	temp.goodsstockid = newVal.goodsstockid;
                temp.goodsname = newVal.goodsname;
                temp.goodsid = newVal.goodsid;
                temp.goodsunitprice = newVal.purchaseprice;
                temp.goodssn = newVal.goodssn;
                temp.barcode = newVal.barcode;
                temp.skuid = newVal.skuid;
                temp.skuname = newVal.skuname;
                temp.weight = newVal.weight;
                if (newVal.virtualflag == "0")
                    newVal.virtualflag = "1";
                temp.virtualflag = newVal.virtualflag;
                //temp.goodssoundqty = newVal.goodqty;
            });
            //监听批次号下拉选择
            $scope.$watch(function () {
                return temp.batchcodeselect;
            }, function (newVal, oldVal) {
            	if (newVal == undefined){
            		return ;
            	}else{
            		temp.batchcode = newVal.batchcode;
            		temp.leftgoodqty = newVal.leftgoodqty;
            	}
            });
        };
        // 删除临时记录
        $scope.del_record = function (index) {
            $scope.warehouse_temp.warehouseoutlist.splice(index, 1);
        };
        // 初始化临时记录
        $scope.init_record = function () {
            $scope.warehouse_temp.warehouseoutlist = [];
            $scope.cleanOrders();

            var times = 3;
            while (times != 0) {
                $scope.add_record();

                times--;
            }
        };
        // 初始化添加表单
        $scope.init_addform = function () {
            $scope.warehouse_temp.warehouseoutnum = $scope.generateNum();
            $scope.warehouse_temp.remark = '';
            $scope.warehouse_temp.autoaduitflag = 1;

            $scope.orders_QueryData.ordernum = '';
            $scope.orders_QueryData.begincreatedtime = '';
            $scope.orders_QueryData.endcreatedtime = '';
        };
        // 生成出库单号
        $scope.generateNum = function () {
        	stockService.getWarehouseout(function(ordernum){
                $scope.warehouse_temp.warehouseoutnum = ordernum + "";
                return ordernum + "";
            }, function(err){
                console.log(err)
            });
        };
        // 搜索订单
        $scope.searchOrder = function () {
            $scope.orders_QueryData.orderstate = 3;
            $scope.orders_QueryData.orders = 'createdtime';
            $scope.orders_QueryData.orderkey = 'desc';
            $scope.orders_QueryData.datatype = 3;
            var  tempTime = $scope.orders_QueryData.endcreatedtime;
            if($scope.orders_QueryData.endcreatedtime){
            	$scope.orders_QueryData.endcreatedtime = $scope.orders_QueryData.endcreatedtime + ' 23:59:59';
            }
            $http({
                method: 'POST',
                url: "/jsbweb/enterprise/orders/getsupplier_orders.do",
                data: $.param($scope.orders_QueryData),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (data) {
                if (data.ret == 0) {
                    $scope.warehouse_temp.orders = data;

                    if ($scope.warehouse_temp.orders.data.total == 0) {
                        $scope.cleanOrders();
                    }
                }
            });
            
            $scope.orders_QueryData.endcreatedtime = tempTime;
        };
        $timeout(function(){
        	$scope.searchOrder();
        },300);
        
        // 清空订单列表（并插入一条空数据）
        $scope.cleanOrders = function () {
            $scope.warehouse_temp.orders.data = {
                'total': 0,
                'rows': [{
                    orderid: '-',
                    ordernum: '-',
                    suppliername: '-',
                    buyername: '-',
                    totgoodsmoney: '-',
                    totgoodsqty: '-',
                    createdtime: '-',
                    remark: '-'
                }]
            };
        };
        // 清空列表
        $scope.cleanList = function () {
            return { 'data': { 'total': 0, 'rows': [] } };
        }
        //仓库下拉列表改变事件
        $scope.warehouseChange = function(){
        	$scope.init_record();
        };
        // 获取商品库存信息
        $scope.querygoodssku = function (item) {
            $scope.goodsskus = $scope.cleanList();

            $http({
                method: 'POST',
                url: "/jsbweb/enterprise/com/get_goodsstock.do",
                data: $.param({ goodsname: item.goodsname,warehouseid: $scope.warehouse_temp.warehouseid}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (data) {

                if (data.ret == 0) {
                    $scope.goodsskus = data;
                }
                if (data.ret == 10) {
                    $.jBox.tip(data.message, 'warning');
                }
            });
        };
        //获取批次号
        $scope.querygoodsbatchcode = function (item) {
        	$scope.goodsbatchcode = $scope.cleanList();
        	if(item.orderlistid != undefined){
        		$http({
                    method: 'POST',
                    url: "/jsbweb/enterprise/stockList/getGoodsStockListByGoods.do",
                    data: $.param({ goodsid:item.goodsid,warehouseid:$scope.orders_QueryData.warehouseid}),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (data) {
                    if (data.ret == 0) {
                    	//批次号数据源
                        $scope.goodsbatchcode = data;
                        console.log(data);
                        console.log(11000);
                    }
                    if (data.ret == 10) {
                        $.jBox.tip(data.message, 'warning');
                    }
                });
        	}else if(item.goodsstockid != undefined){
        		$http({
                    method: 'POST',
                    url: "/jsbweb/enterprise/stockList/getGoodsStockList.do",
                    data: $.param({ goodsstockid: item.goodsstockid,pagenum:1,pagesize:200}),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (data) {
                    if (data.ret == 0) {
                        $scope.goodsbatchcode = data;
                    }
                    if (data.ret == 10) {
                        $.jBox.tip(data.message, 'warning');
                    }
                });
        	}
        	    	
        };
        // 手工出库
        $scope.saveWrehouseout_byHand = function (invalid) {
            //$scope.cleanOrders();
        	//表单验证	
        	  $scope.warehouse_temp.isCommitted=true;
        	  
//              if(invalid){
//                  $.jBox.tip('请检查提交的数据是否正确!', 'warning');
//                  return;
//              }
            var temp_warehouseoutlist = [];
            for (var i = 0; i < $scope.warehouse_temp.warehouseoutlist.length; i++) {
                if ($scope.warehouse_temp.warehouseoutlist[i].goodsid > 0) {
                	console.info($scope.warehouse_temp.warehouseoutlist[i].batchcode);
                    if($scope.warehouse_temp.warehouseoutlist[i].batchcode == undefined){
                    	$.jBox.tip('批次号不能为空!', 'warning');
                    	return ;
                    }
                    if($scope.warehouse_temp.warehouseoutlist[i].goodssoundqty > $scope.warehouse_temp.warehouseoutlist[i].leftgoodqty){
                    	$.jBox.tip('出库数量不能大于库存数量!', 'warning');
                    	return ;
                    }
                    $scope.warehouse_temp.warehouseoutlist[i].warehousenum = $scope.warehouse_temp.warehouseoutnum;
                    
                    temp_warehouseoutlist.push({
                        goodsid: $scope.warehouse_temp.warehouseoutlist[i].goodsid,
                        goodsname: $scope.warehouse_temp.warehouseoutlist[i].goodsname,
                        batchcode: $scope.warehouse_temp.warehouseoutlist[i].batchcode,
                        barcode: $scope.warehouse_temp.warehouseoutlist[i].barcode,
                        goodssn: $scope.warehouse_temp.warehouseoutlist[i].goodssn,
                        skuid: $scope.warehouse_temp.warehouseoutlist[i].skuid,
                        skuname: $scope.warehouse_temp.warehouseoutlist[i].skuname,
                        weight: $scope.warehouse_temp.warehouseoutlist[i].weight,
                        virtualflag: $scope.warehouse_temp.warehouseoutlist[i].virtualflag,
                        goodsunitprice: $scope.warehouse_temp.warehouseoutlist[i].goodsunitprice,
                        goodssoundqty: $scope.warehouse_temp.warehouseoutlist[i].goodssoundqty,
                        //goodsdamageqty: $scope.warehouse_temp.warehouseoutlist[i].goodsdamageqty,
                        discountmoney: $scope.warehouse_temp.warehouseoutlist[i].discountmoney,

                        warehouseoutnum: $scope.warehouse_temp.warehouseoutlist[i].warehousenum,
                        selected: {}
                    });
                }
                
                //判断完好数量和损坏数量不能同时为0
                if($scope.warehouse_temp.warehouseoutlist[i].goodssoundqty==0 && $scope.warehouse_temp.warehouseoutlist[i].goodsdamageqty==0){
                	$.jBox.tip('完好数量和损坏数量不能同时为0!','warning');
                	return;
                }
            }
            if (temp_warehouseoutlist.length == 0) {
                $.jBox.tip('请添加出库单明细', 'warning');
                return;
            }

            $scope.handData = {
                'warehouseoutnum': $scope.warehouse_temp.warehouseoutnum,
                'remark': $scope.warehouse_temp.remark,
                'sourceflag': 2,
                'RelationID': 0,
                'RelationNum': '',
                'autoaduitflag': $scope.warehouse_temp.autoaduitflag,
                'warehouseoutlist': temp_warehouseoutlist,
                'warehouseid': $scope.warehouse_temp.warehouseid
            };
            $http({
                method: 'POST',
                url: "/jsbweb/enterprise/com/add_warehouseout.do",
                data: $.param({ data: angular.toJson($scope.handData) }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (data) {

                console.warn(data);
                console.warn($scope.warehouse_temp.warehouseoutlist);

                if (data.ret == 0) {
                    $scope.queryForm();
                    $scope.closeWarehouseout();
                    $scope.addWarehouseout_source(0);

                    $.jBox.tip('保存成功', 'success');
                } else {
                    $.jBox.tip('添加失败，' + data.message, 'warning');
                }
            });
            console.warn($scope.warehouse_temp.warehouseoutlist);
        };

        // 拣货
        $scope.showorderdetail = function (item) {
        	
        	$scope.generateNum();
            $scope.modeldata = item;

            $('#outModal').modal({
                //backdrop: 'static',
                keyboard: true
            });
            angular.forEach($scope.modeldata.orderlists, function(value, index){
            	//出库数量默认等于销售商品所买数量
            	value.goodsnumber = value.goodsqty;
            	value.batchcodeselect1 = {};
            	 $scope.$watch(function () {
                     return value.batchcodeselect1;
                 }, function (newVal, oldVal) {
                	 if (newVal == undefined || newVal == {}){
                 		return ;
                 	}else{
                 		//leftgoodqty-商品库存数量   goodsnumber-商品出库数量
                 		if(newVal.leftgoodqty < value.goodsnumber){
                 			value.goodsnumber = newVal.leftgoodqty;
                 		}
                 		value.batchcode = newVal.batchcode;
                 		value.leftgoodqty = newVal.leftgoodqty;
                 		value.goodsstocklistid = newVal.goodsstocklistid;
                 		value.goodsstockid = newVal.goodsstockid;
                 	}
                 });
                 
            });
            console.info("...");
            console.info($scope.modeldata);
        };
        // 按订单出库
        $scope.saveWrehouseout_byOrder = function (item) {
            console.info(item);
            if (item.orderlists == null || item.orderlists.length == 0) {
                $.jBox.tip('没有订单明细', 'warning');
                return;
            }
            var temp_warehouseoutlist = [];
            for (var i = 0; i < item.orderlists.length; i++) {
                if (item.orderlists[i].goodsid > 0) {
                    if(item.orderlists[i].batchcode == undefined){
                    	$.jBox.tip('批次号不能为空!', 'warning');
                    	return ;
                    }
                    var sum = item.orderlists[i].goodssoundqty + item.orderlists[i].goodsqty;
                    if(sum > item.orderlists[i].leftgoodqty){
                    	$.jBox.tip('出库数量不能大于库存数量!', 'warning');
                    	return ;
                    }
                    temp_warehouseoutlist.push({
                    	orderlistid: item.orderlists[i].orderlistid,
                    	goodsstocklistid: item.orderlists[i].goodsstocklistid,
                    	goodsqty: item.orderlists[i].goodsqty,
                    	goodssoundqty: item.orderlists[i].goodsnumber,
                    	batchcode: item.orderlists[i].batchcode,
                    });
                }
                
            }
            console.log(temp_warehouseoutlist);
            console.log(110119);
            $scope.orderData = {
                'warehouseoutnum': $scope.warehouse_temp.warehouseoutnum,
                'orderid': item.orderid,
                'ordernum': item.ordernum,
                'warehouseid':$scope.orders_QueryData.warehouseid,
                'autoaduitflag': $scope.warehouse_temp.autoaduitflag,
                'remark': $scope.warehouse_temp.remark,
                'sourceflag': 1,
                'outnumtype': 1,
                'warehouseoutlist':temp_warehouseoutlist
            };
            //return ;
            $http({
                method: 'POST',
                url: "/jsbweb/enterprise/com/addbyorders_warehouseout.do",
                data: $.param({ data: angular.toJson($scope.orderData) }),
                //data: $.param($scope.orderData),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (data) {
                console.warn(data);
                if (data.ret == 0) {
                    $.jBox.tip('出库成功', 'success');
                    $scope.warehouse_temp.warehouseoutnum = $scope.generateNum();
                    $scope.warehouse_temp.remark = '';
                    $scope.searchOrder();
                    $scope.queryForm();
                    $('#outModal').modal('hide');
                    //$scope.warehouse_temp.orders = data;

                    //if ($scope.warehouse_temp.orders.data.total == 0) {
                    //    $scope.cleanOrders();
                    //}
                }
                else {
                    $.jBox.tip(data.message, 'warning');
                }
            });
        };
        // 加载数据
        $http.get("/jsbweb/enterprise/com/get_warehouseout.do?pagesize=10&pagenum=1&orders=createdtime&orderkey=desc&orderstate=3&datatype=3&warehouseid=0")
            .success(function (data) {
                if (data.ret == 10) {
                    $.jBox.tip("请先登录", 'warning');
                    return;
                }
                if (data.ret == 0) {
                    // 出库单列表
                    $scope.warehouseout_list = $scope.filterdata(data);
                }
            });

        // 处理状态
        $scope.filterdata = function (result) {
            for (var i = 0; i < result.data.rows.length; i++) {
                result.data.rows[i].isdelete = false;
                result.data.rows[i].isview = true;
                result.data.rows[i].isaudit = false;
                result.data.rows[i].isauditfail = false;

                if ((result.data.rows[i].state == 1 && result.data.rows[i].auditflag == 1)||(result.data.rows[i].state == 3 && result.data.rows[i].auditflag == 1)) {
                    result.data.rows[i].isdelete = true;
                    result.data.rows[i].isaudit = true;
                    result.data.rows[i].isauditfail = true;
                }
            }

            return result;
        };

        $scope.queryload = function () {
            $("#txt_query_createdtime_begin,#txt__query_createdtime_end").datetimepicker({
                language: 'zh-CN',
                autoclose: true,
                todayBtn: true,
                pickerPosition: "bottom-left",
                todayHighlight: true,
                startView: 2,
                minView: 2,
                format:'yyyy-mm-dd'
            });
        };

        //添加相同的记录
        var delrecodeone = false;
        var addrecodeone = false;
        $scope.add_recordone = function (item , index) {
            var temp = {
                goodsname: item.goodsname,
                goodsspec: item.goodsspec,
                batchcode: item.batchcode,
                barcode: item.barcode,
                goodsqty: item.goodsqty,
                leftgoodqty: item.leftgoodqty,
                discount: item.discount,
                goodsstockid : item.goodsstockid,
                goodsid : item.goodsid,
                orderlistid : item.orderlistid,
                delrecodeone:true,
                addrecodeone:true
            };
            temp.batchcodeselect1 = {};
       	    $scope.$watch(function () {
                return temp.batchcodeselect1;
            }, function (newVal, oldVal) {
           	 if (newVal == undefined || newVal == {}){
            		return ;
            	}else{
            		//leftgoodqty-商品库存数量   goodsnumber-商品出库数量
            		if(newVal.leftgoodqty < temp.goodsnumber){
            			temp.goodsnumber = newVal.leftgoodqty;
            		}
            		temp.batchcode = newVal.batchcode;
            		temp.leftgoodqty = newVal.leftgoodqty;
            		temp.goodsstocklistid = newVal.goodsstocklistid;
            	}
            });
            //在数组下标第index+1的位置添加temp元素。第二个参数0代表不删除
            $scope.modeldata.orderlists.splice(index+1,0,temp);
        };
        
        // 删除临时添加的相同记录
        $scope.del_recordone = function (index) {
            $scope.modeldata.orderlists.splice(index, 1);
        };
        

    }]);
