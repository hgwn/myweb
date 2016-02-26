var warehouseinModule = angular.module('warehousein', [
    "util.pagination"
]);

warehouseinModule.controller("warehouseinListController",
    ['$scope', '$http', '$stateParams', '$state', '$location', 'stockService','$rootScope','$timeout',
    function ($scope, $http, $stateParams, $state, $location,stockService,$rootScope,$timeout) {

        //定义表单数据对象
        $scope.formData = {};
        $scope.formData.pagesize=10;
        $scope.addFormData = {};
        $scope.addFormData.warehouseinnum = '';
        $scope.addFormData.isCommitted=false;  //表单提交标识，默认为否
        $scope.addFormData.warehouseinlist = [];
        $scope.warehousein = {};
        $scope.warehouseinlists = {};
        $scope.goodsskus = {};
        $scope.isviewsave = true;
        $scope.orders_form = {};                                               // 订单出库查询字段
        $scope.addFormDataByOrder = {};
      

        $scope.states = [
            { id: 1, value: "待入库" },
            { id: 2, value: "入库" }
        ];

        $scope.sourceflags = [
            { id: 1, value: "售货单" },
            { id: 2, value: "手工入库" },
            { id: 3, value: "发货单" },
            { id: 4, value: "移库单" }
        ];

        $scope.auditflags = [
            { id: 1, value: "待审核" },
            { id: 2, value: "审核通过" },
            { id: 3, value: "审核不通过" }
        ];

        //加载数据源汇总
        $http
            .get("/jsbweb/enterprise/com/get_warehousein.do?pagesize=10&pagenum=1&orders=createdtime&orderkey=desc")
            .success(function (data) {
                $scope.warehouseins = data;
                $scope.filterdata();
                if (data.ret == 1000) {
                    $.jBox.tip("请先登录", 'warning');
                }
            });

        $http({
            method: 'POST',
            url: "/jsbweb/enterprise/com/getbycompany_goodssku.do",
            data: $.param({ goodsname: '' }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function (data) {
            if (data.ret == 0) {
                $scope.goodsskus = data;
                console.warn(data)
            }
            if (data.ret == 10) {
                $.jBox.tip("请先登录", 'warning');
            }
        });

        //查询
        $scope.queryForm = function () {
            $scope.formData.orders = 'createdtime';
            $scope.formData.orderkey = 'desc';
            $scope.formData.warehouseid = $scope.formData.stationid;
            var tempdata= $scope.formData.endcreatedtime;
            if($scope.formData.endcreatedtime){
            	$scope.formData.endcreatedtime= $scope.formData.endcreatedtime+' 23:59:59';
            }
            $http({
                method: 'POST',
                url: "/jsbweb/enterprise/com/get_warehousein.do",
                data: $.param($scope.formData),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (data) {
                $scope.warehouseins = data;
                $scope.filterdata();
            });
            
            $scope.formData.endcreatedtime=tempdata;
        };
        
        $scope.filterdata = function () {

            for (var i = 0; i < $scope.warehouseins.data.rows.length; i++) {
                var tmp = $scope.warehouseins.data.rows[i];
            	
            	if (tmp.state == 1 && tmp.auditflag == 1) {
            		tmp.isview = true;
                    tmp.isdelete = true;
                    tmp.isaudit = true;
                    tmp.isauditfail = true;
                }else{
	                tmp.isdelete = false;
	                tmp.isview = true;
	                tmp.isaudit = false;
	                tmp.isauditfail = false;
                }
                
            }
        }
        
        $scope.auditfail = function (warehousein) {

            var warehouseinid = warehousein.warehouseinid;
            var submit = function (v, h, f) {
                if (v == 'ok') {
                    $http({
                        method: 'POST',
                        url: "/jsbweb/enterprise/com/audit_warehousein.do",
                        data: $.param({ warehouseinid: warehouseinid, state: 1, auditflag: 3 }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function (data) {

                        if (data.ret == 0) {
                            $scope.queryForm();
                            $.jBox.tip('审核成功', 'success');
                        } else {
                            $.jBox.tip('审核失败', 'warning');
                        }

                        if (data.ret == 10) {
                            $.jBox.tip("请先登录", 'warning');
                        }

                    });
                }
                return true; //close
            };

            $.jBox.confirm("确定要审核入库单"+warehousein.warehouseinnum + " 为失败吗？", "温馨提示", submit);
        };

        //审核
        $scope.audit = function (warehousein) {

        	console.warn(warehousein)
            var warehouseinid = warehousein.warehouseinid;
            var warehouseid = warehousein.warehouseid;
            
            var supplierid = warehousein.supplierid;
            var batchcode = warehousein.batchcode;
            var submit = function (v, h, f) {
                if (v == 'ok') {

                    $http({
                        method: 'POST',
                        url: "/jsbweb/enterprise/com/audit_warehousein.do",
                        data: $.param({ warehouseinid: warehouseinid, state: 2, auditflag: 2, warehouseid:warehouseid, supplierid:supplierid, batchcode:batchcode }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function (data) {

                        if (data.ret == 0) {
                        	$scope.queryForm();
                            $.jBox.tip('审核成功', 'success');
                            
                        } else {
                            $.jBox.tip('审核失败', 'warning');
                        }

                        if (data.ret == 10) {
                            $.jBox.tip("请先登录", 'warning');
                        }
                       

                    });
                }
                return true; //close
            };

            $.jBox.confirm("确定要审核入库单   " + warehousein.warehouseinnum + " 成功吗？", "温馨提示", submit);
        };

        //查看
        $scope.view = function (warehousein) {

            var warehouseinid = warehousein.warehouseinid;
            $http({
                method: 'POST',
                url: "/jsbweb/enterprise/com/get_warehouseinlist.do",
                data: $.param({ warehouseinid: warehouseinid }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (data) {
                $scope.warehouseinlists = data;
            });
        };

        //删除
        $scope.deleteto = function (warehousein) {
            var warehouseinid = warehousein.warehouseinid;

            var submit = function (v, h, f) {
                if (v == 'ok') {
                    $http({
                        method: 'POST',
                        url: "/jsbweb/enterprise/com/del_warehousein.do",
                        data: $.param({ warehouseinid: warehouseinid }),
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

            $.jBox.confirm("确定要删除入库单   " + warehousein.warehouseinnum + " 吗？", "温馨提示", submit);

        };

        $scope.convertsourceflagtoname = function (flag) {
            var name = "";
            for (var i = 0; i < $scope.sourceflags.length; i++) {
                if ($scope.sourceflags[i].id == flag) {
                    name = $scope.sourceflags[i].value;
                    break;
                }
            }
            return name;
        };

        $scope.convertauditflagtoname = function (flag) {
            var name = "";
            for (var i = 0; i < $scope.auditflags.length; i++) {
                if ($scope.auditflags[i].id == flag) {
                    name = $scope.auditflags[i].value;
                    break;
                }
            }
            return name;
        };

        $scope.convertstatetoname = function (flag) {
            var name = "";
            for (var i = 0; i < $scope.states.length; i++) {
                if ($scope.states[i].id == flag) {
                    name = $scope.states[i].value;
                    break;
                }
            }
            return name;
        };
        
        $scope.showaddmodal = function () {
        	
            if ($scope.addFormData.warehouseinnum == undefined || $scope.addFormData.warehouseinnum == '' || $scope.addFormDataByOrder.warehouseinnum == '') {

                $scope.addFormDataByOrder.warehouseinnum = $scope.createwarehouseinnumber();
                $scope.isviewsave = true;
                $scope.tabindex = "byHand";
                $scope.addFormData.autoaduitflag = 1;
                $scope.addFormDataByOrder.autoaduitflag = 1;
            }

            $state.go("addwarehousein");
           
        };
        
        //获取单号
        $scope.createwarehouseinnumber = function () {
        	stockService.getWarehousein(function(ordernum){
                $scope.addFormData.warehouseinnum = ordernum + "";
                return ordernum + "";
            }, function(err){
                console.log(err)
            });
        	
        };
        
        $scope.createwarehouseinnumber();


        $scope.delrecord = function (index) {
            $scope.addFormData.warehouseinlist.splice(index, 1);
        };

        $scope.addrecord = function () {
        	var temp = {};
            temp.goodsid = 0;
            temp.goodsname = "";
            temp.goodssn = "";
            temp.barcode = "";
            temp.skuname = "";
            temp.skuid = 0;
            temp.weight = 0;
            temp.virtualflag = 1;
            temp.goodsunitprice = 0.00;
            temp.goodssoundqty = 1;
            temp.goodsdamageqty = 0;
            temp.discountmoney = 0.00;
            $scope.addFormData.warehouseinlist.push(temp);
            temp.selected = "";

            $scope.$watch(function () {
                return temp.selected;
            }, function (newVal, oldVal) {
                temp.goodsname = newVal.goodsname;
                temp.goodsid = newVal.goodsid;
                temp.goodsunitprice = newVal.price;
                temp.goodssn = newVal.goodssn;
                temp.barcode = newVal.barcode;
                temp.goodsspec = newVal.goodsspec;
                temp.skuid = newVal.skuid;
                temp.skuname = newVal.skuname;
                temp.weight = newVal.weight;
                temp.virtualflag = newVal.virtualflag;
            });
        };

       	$scope.addrecord()

        $scope.querygoodssku = function (item) {

            $http({
                method: 'POST',
                url: "/jsbweb/enterprise/com/getbycompany_goodssku.do",
                data: $.param({ goodsname: item.goodsname }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (data) {
                if (data.ret == 0) {
                    $scope.goodsskus = data;
                }
                if (data.ret == 10) {
                    $.jBox.tip("请先登录", 'warning');
                }
            });
        };

        $scope.tabindex = "";
        $scope.tabselect = function (tabindex) {
            $scope.tabindex = tabindex;
            if ($scope.tabindex == "byHand") {
                $scope.isviewsave = true;
            } else {
                $scope.isviewsave = false;
            }
            
        };

        $scope.save = function (invalid) {
            if ($scope.tabindex == "byHand") {

                $scope.addFormData.isCommitted=true;
                if($scope.addFormData.batchcode == ""){
                    $.jBox.tip("入库批次号不能为空", "warning");
                }
                if(invalid){
                    $.jBox.tip('请检查提交的数据是否正确!', 'warning');
                    return;
                }

                var tempwarehouseinlist = [];
                for (var i = 0; i < $scope.addFormData.warehouseinlist.length; i++) {
                    if ($scope.addFormData.warehouseinlist[i].goodsid > 0) {

                        $scope.addFormData.warehouseinlist[i].selected = {};
                        $scope.addFormData.warehouseinlist[i].warehousenum = $scope.addFormData.warehouseinnum;
                        $scope.addFormData.warehouseinlist[i].imeicode = "";
                        tempwarehouseinlist.push($scope.addFormData.warehouseinlist[i]);
                    }
                    //判断完好数量和损坏数量不能同时为0
                    if($scope.addFormData.warehouseinlist[i].goodssoundqty==0){
                    	$.jBox.tip('入库数量不能为0!','warning');
                    	return;
                    }
                }

                if (tempwarehouseinlist.length == 0) {
                    $.jBox.tip('请添加入库明细', 'warning');
                    return;
                }
                 
                var stationItem = $.parseJSON($scope.addFormData.item);
                
                $scope.addFormData.warehousename = stationItem.stationname;
                $scope.addFormData.warehouseid = stationItem.stationid;
                
                $scope.addFormData.warehouseinlist = tempwarehouseinlist;
                var data = { data: angular.toJson($scope.addFormData) };
                $http({
                    method: 'POST',
                    url: "/jsbweb/enterprise/com/add_warehousein.do",
                    data: $.param(data),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (data) {

                    if (data.ret == 0) {
                        $scope.queryForm();
                        $scope.addFormData.warehouseinnum = "";
                        $.jBox.tip('添加成功', 'success');
                        
                        $state.go("warehousein");
                    } else {
                        $.jBox.tip('添加失败', 'warning');
                    }

                    if (data.ret == 10) {
                        $.jBox.tip("请先登录", 'warning');
                    }
                }).error(function(data){
                    $.jBox.tip("连接服务器失败", "warning");
                });
            }
        };

        $scope.loaded = function () {
         /*   $("#txt_createdtime_begin,#txt_createdtime_end").datetimepicker({
                language: 'zh-CN',
                autoclose: true,
                todayBtn: true,
                pickerPosition: "bottom-left",
                todayHighlight: true,
                startView: 2,
                minView: 2,
                format:'yyyy-mm-dd'
            });*/
        };

        $scope.queryload = function () {
          /*  $("#txt_query_createdtime_begin,#txt__query_createdtime_end").datetimepicker({
                language: 'zh-CN',
                autoclose: true,
                todayBtn: true,
                pickerPosition: "bottom-left",
                todayHighlight: true,
                startView: 2,
                minView: 2,
                format:'yyyy-mm-dd'
            });*/
        };

        // 搜索订单
        $scope.searchOrder = function () {
            $scope.orders_form.orderstate = 5;
            $scope.orders_form.orders = 'createdtime';
            $scope.orders_form.orderkey = 'desc';
            var tempdata= $scope.orders_form.endcreatedtime;
            if($scope.orders_form.endcreatedtime){
                $scope.orders_form.endcreatedtime= $scope.orders_form.endcreatedtime+' 23:59:59';
            }
            $http({
                method: 'POST',
                url: "/jsbweb/enterprise/orders/getbuyer_orders.do",
                data: $.param($scope.orders_form),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (data) {
                $scope.warehouseinorders = data;
            });
           $scope.orders_form.endcreatedtime = tempdata;
        };

        $scope.warehouseoutbyorder = function (item) {

            $scope.addFormDataByOrder.orderid = item.orderid;
            $scope.addFormDataByOrder.ordernum = item.ordernum;
            $scope.addFormDataByOrder.orders = 'createdtime';
            $scope.addFormDataByOrder.orderkey = 'desc';

            $http({
                method: 'POST',
                url: "/jsbweb/enterprise/com/addbyorders_warehousein.do",
                data: $.param($scope.addFormDataByOrder),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (data) {

                if (data.ret == 0) {
                    $scope.searchOrder();
                    $scope.addFormDataByOrder.warehouseinnum = $scope.createwarehouseinnumber();;
                    $.jBox.tip('入库成功', 'success');
                } else {
                    $.jBox.tip('入库失败', 'warning');
                }

                if (data.ret == 10) {
                    $.jBox.tip("请先登录", 'warning');
                }
            });



        };
        
        //div打印
		$scope.printHtml = function(warehousein){
		
			$scope.warehousein.stationname = warehousein.stationname;
			$scope.warehousein.warehouseinnum = warehousein.warehouseinnum;
			$scope.warehousein.createdtime = warehousein.createdtime;
			$scope.view(warehousein);
		};
		$rootScope.myPreview = function(){	
	   		var LODOP = getLodop();  	
	   		var strBodyStyle="<style>"+document.getElementById("style1").innerHTML+"</style>";
	   		var strFormHtml=strBodyStyle+"<body>"+document.getElementById("form1").innerHTML+"</body>";
	   		LODOP.ADD_PRINT_HTM(0,0,"100%","100%",strFormHtml);
	   		LODOP.PREVIEW();
	   	};
        
        
		//查询供应商
		$http({
            method: 'POST',
            url: "/jsbweb/base/getcustomer.do?scenetypeid=2",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function (data) {
        	console.warn(data);
            if (data.ret == 0) {
                $scope.customer = data.data.rows;
            }
            if (data.ret == 10) {
                $.jBox.tip("请先登录", 'warning');
            }
        });
		
		//查询仓库
		var param = {stationname: $scope.storehouseKeyword};
		$http({
            method: 'POST',
            url: "/jsbweb/station/list.do?"+$.param(param),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function (data) {
        	console.log(data)
            if(data.data!=null){
                $scope.storehouses = data.data.rows;
                console.info(data);
            }
        });

        
        $scope.storehouseKeyword = "";
        //查询登录公司仓库信息（站点类型为3的站点信息）
        $scope.queryStorehouse = function(){
            var param = {stationname: $scope.storehouseKeyword};
            $http({
                method : 'GET',
                url : "/jsbweb/station/list.do?" +$.param(param)
            }).success(function(data) {
                console.log(data)
                if(data.data!=null){
                    $scope.storehouses = data.data.rows;
                }
            });
        }
     
}]);


