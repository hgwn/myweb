headQuartersOrdersApp.
controller('getHeadQuartersOrdersListController',['$state','$scope','$rootScope','$http','headQuartersOrdersService','regularValidationService','$alert','uiGridTreeViewConstants','i18nService','$timeout','utils',
function($state,$scope,$rootScope,$http,headQuartersOrdersService,regularValidationService,$alert,uiGridTreeViewConstants,i18nService,$timeout,utils){
	$scope.edit_datas = {};
	i18nService.setCurrentLang('zh-cn');
	$scope.supplier = {};
	//支付状态
	$scope.payStateLists = [
            { id : 0 , value : "空"},
			{ id : 1 , value : "待支付"},
			{ id : 2 , value : "部分支付"},
			{ id : 3 , value : "已支付"}
	];
	//订单状态
	$scope.orderStateList = [
            { id : 0 , value : "空"},
			{ id : 2 , value : "待审核"},
			{ id : 3 , value : "待仓库出库"},
			{ id : 4 , value : "审核不通过"},
			{ id : 5 , value : "已发货"},
			{ id : 8 , value : "订单取消"},
			{ id : 9 , value : "待确认到货"},
			{ id : 11, value : "订单完成"},
			{ id : 12, value : "仓库待出库"},
			{ id : 13, value : "订单取消，待确认"}
	];
	//供应商下拉表格start
	$scope.formData ={};
	$scope.formData.orderstate = 0;
	$scope.formData.paystate = 0;
	$scope.getSuppliers = function(key){
		var params = {};
		params.pagesize = 1000;
		params.pagenum = 1;
		headQuartersOrdersService.httpPost(headQuartersOrdersService.getAllReverseSuppliers(),{data : angular.toJson(params)},function(resp){
			$scope.formData.datas = resp.data.rows;
			//页面初始化的时候默认选中第一位供应商
			if(key == 1){
				$scope.supplier.companyid = $scope.formData.datas[0].companyid;
				$scope.formData.keyWord = $scope.formData.datas[0].companyname;
				$timeout(function(){
					$scope.getPage(1,$scope.gridOption.paginationPageSize);
				},100);
			}
		});	
	};
    $scope.query = function () {
    	$scope.formData.keyWord=$scope.formData.keyWord==null?"":$scope.formData.keyWord;
        $scope.getSuppliers(2);
    };
    $scope.$watch("supplier",function(){
    	
    });
    //在comboxtable里的文本框输入时触发的方法
    $scope.onReset = function(){
    	$scope.supplier={};
    };
    //供应商下拉表格end	
    
    //页面初始化的时候默认选中第一位供应商
    $scope.getSuppliers(1);
    
	//支付状态转换
    $scope.convertPayStateName = function (flag) {
        var name = "";
        for (var i = 0; i < $scope.payStateLists.length; i++) {
            if ($scope.payStateLists[i].id == flag) {
                name = $scope.payStateLists[i].value;
            }
        }
        return name;
    };
	//订单状态转换
    $scope.convertOrderStateName = function (flag) {
        var name = "";
        for (var i = 0; i < $scope.orderStateList.length; i++) {
            if ($scope.orderStateList[i].id == flag) {
                name = $scope.orderStateList[i].value;
            }
        }
        return name;
    };
	//ui-grid of Tree View
	$scope.gridOption = {
   	      expandableRowTemplate: 'template/expandableRowTemplate.html',
		  expandableRowHeight: 200,
          paginationPageSizes: [5, 10, 20, 50, 100],
          paginationPageSize: 20,
          useExternalPagination: true,
          enableColumnMenus: false,
          enableGridMenu: true,
	      columnDefs: [
          { name: '序号', enableHiding: false, field:'id',type:'text',enableHiding: false,enableCellEdit: false , enableSorting: false, enableColumnResizing:false,  width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
		  { name: '操作', enableHiding: false, field:'action', width: '9%', enableFiltering: false,
		    cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">' +
		    '<a href="#" class="" ui-sref="headQuartersOrdersDetail({ordernum:row.entity.ordernum})" title="查看"><span class="glyphicon glyphicon-eye-open blue"></span></a>&nbsp;'+
		    '<a href="#" ng-show="row.entity.isPay" ng-click="grid.appScope.payPuchaseOrders(grid,row.entity)" title="付款"><span class="glyphicon glyphicon glyphicon-yen"></span></a>'+
		    '</div>'},             
	      { name: '采购单号', width:'14%', field: 'ordernum'},
	      { name: '订单状态', width:'10%',field: 'orderStateName' },
	      { name: '支付状态', width: '7%', field: 'payStateName' },
	      { name: '供应商', width:'13%', field:'suppliername' },
	      { name: '供应商站点', field: 'supplierstationname' },
	      { name: '地址', width: '18%', field: 'newAddress' },
	      { name: '总金额', width: '7%',field: 'totgoodsmoney' },
	      { name: '总数量', width: '6%', field: 'totgoodsqty' }
	      ],
            
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
                gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                    if (row.isExpanded) {
                        row.entity.subGridOptions = {
                   		 useExternalPagination: true,
                            useExternalSorting: false,
                            enableSorting : false,
                      		enableColumnMenus: false,	 
                            columnDefs: [
                                { name: '商品名称',field:'goodsname'},
                                /*{ name: '商品条码',field:'goodsbarcode'},
                                { name: '规格',field:'goodsspec'},*/
                                { name: '数量',field:'goodsqty'},
                                { name: '价格',field:'dealingprice'},
                                { name: '赠品',field:'giftflag',cellTemplate:
                                    '<div class="ui-grid-cell-contents">{{row.entity.giftflag==2?"是":"否"}}</div>'
                                }
                            ]};
                        row.entity.subGridOptions.data = row.entity.orderlist;
                    }
                });
                $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                    if(getPage) {
                        if (sortColumns.length > 0) {
                            paginationOptions.sort = sortColumns[0].sort.direction;
                        } else {
                            paginationOptions.sort = null;
                        }
                        getPage(grid.options.paginationCurrentPage, grid.options.paginationPageSize);
                    }
                });
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    if(getPage) {
                        getPage(newPage, pageSize);
                    }
                });
                $scope.gridApi.grid.refresh();
            }
	};
	//ui grid分页
    var getPage = function(pagenum, pagesize, sort) {

    	$scope.queryParams = {};
        $scope.queryParams.pagenum = pagenum;
        $scope.queryParams.pagesize = pagesize;
        $scope.queryParams.supplierid = $scope.supplier.companyid;
        $scope.queryParams.ordernum = $scope.formData.purchaseordernum;
        $scope.queryParams.paystate = 1; //订单类型 1-销售单/采购单2-退货单
        $scope.queryParams.orderstate = $scope.formData.orderstate;
        $scope.queryParams.paystate = $scope.formData.paystate;
        $scope.queryParams.orders = ['ordernum'];
        $scope.queryParams.orderkey = 'desc';
        headQuartersOrdersService.httpPost(headQuartersOrdersService.getExternalHeadQuartersOrders(),{data : angular.toJson($scope.queryParams)},function(data){
        	if(data.ret == 0){
        		angular.forEach(data.data.rows,function(data,index,array){
        			//可进行修改采购单订单状态为:1-待审核、3-内部审核失败4-供应商审核失败
        			if(data.orderstate == 2){
        				data.isModify = true;
        			}else{
        				data.isModify = false;
        			}
        			//可进行取消采购单的订单状态为:1-待审核、3-内部审核失败4-供应商审核失败
        			if(data.orderstate == 1 || data.orderstate == 3 || data.orderstate == 4){
        				data.isDelete = true;
        			}else{
        				data.isDelete = false;
        			}   
        			//可进行供应商审核通过的采购单的采购单的订单状态为:1-待审核、3-内部审核失败
        			if(data.orderstate == 1 || data.orderstate == 3){
        				data.isAuditOk = true;
        			}else{
        				data.isAuditOk = false;
        			}    
        			//可进行供应商审核不通过的采购单的采购单的订单状态为:1-待审核、3-内部审核失败
        			if(data.orderstate == 1 || data.orderstate == 3){
        				data.isAuditNo = true;
        			}else{
        				data.isAuditNo = false;
        			} 
        			//可进行采购方支付 支付状态为1-待支付
        			if(data.paystate == 1){
        				data.isPay = true;
        			}else{
        				data.isPay = false;
        			} 
        			//支付状态中文名字
        			data.payStateName = $scope.convertPayStateName(data.paystate);
        			//订单状态中文名字
        			data.orderStateName = $scope.convertOrderStateName(data.orderstate);
        			//地址拼接
        			if(data.orderaddress.orderaddressid != undefined && data.orderaddress.orderaddressid != ''){
        				data.newAddress = data.orderaddress.provincename + data.orderaddress.cityname + data.orderaddress.areaname + data.orderaddress.address;
        			}else{
        				data.newAddress = "";
        			}
        			console.log(data);
        			console.log(110119);
        			//操作动作
        			angular.forEach(data.purchaseorderlist,function(d,i,a){
        				d.action = 'modify';
        			});
        		});
        		$scope.gridOption.data = data.data.rows;
        		$scope.gridOption.totalItems = data.data.total;
        	}else if(data.ret == 10){
            	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
            }else{
        		$alert({title: '提示：', content: '查询采购单异常,'+data.message, placement: 'masget-top',type: 'info', duration:1, show: true});
        	}
        });
    };
    $scope.getPage = getPage;
    //$scope.getPage(1,$scope.gridOption.paginationPageSize);
    //查询采购单
    $scope.searchInternalPurchaseorders = function(){
    	$scope.getPage(1,$scope.gridOption.paginationPageSize);
    };
    //编辑采购单
    $scope.alertEdit = function(grid,entity){
    	if(entity.orderstate == 1 || entity.orderstate == 3 || entity.orderstate == 4){
    		$rootScope.editDatas = entity;
    		$state.go("editPurchaseorders");
    		/*$timeout(function(){
        		$("#editPurchaseOrders").modal("show");
        		$rootScope.recoverAddress();   			
    		},200);*/
    	}else{
    		$alert({title: '提示：', content: '该订单状态的采购单不可编辑!' , placement: 'masget-top',type: 'warning', duration:2, show: true});
    	}
    };
    
    //采购方公司内部审核通过采购单
    $scope.auditPuchaseOrders = function(gird,entity,key){
    	if(key == 2){
        	$confirm("确定要审核通过?",function(){
            	var params = {};
            	params.purchaseordernum = entity.purchaseordernum;
            	params.purchaseorderid = entity.purchaseorderid;
            	//2-内部审核通过,待供应商审核
            	params.orderstate = 2;
            	headQuartersOrdersService.httpPost(headQuartersOrdersService.auditInternalPurchaseorders(),params,function(resp){
            		console.info(resp);
            		if(resp.ret == 0){
            			$alert({title: '提示：', content: '审核通过成功!', placement: 'masget-top',type: 'info', duration:2, show: true});
            			$scope.getPage(1,$scope.gridOption.paginationPageSize);
            		}else if(resp.ret == 10){
            			$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
            		}else{
            			$alert({title: '提示：', content: '审核发生异常,'+resp.message, placement: 'masget-top',type: 'info', duration:2, show: true});
            		}
            	});    		
        	},{scope:$scope});    		
    	}else if(key == 3){
        	$confirm("确定要审核不通过?",function(){
            	var params = {};
            	params.purchaseordernum = entity.purchaseordernum;
            	params.purchaseorderid = entity.purchaseorderid;
            	//3-内部审核不通过,待供应商审核
            	params.orderstate = 3;
            	headQuartersOrdersService.httpPost(headQuartersOrdersService.auditInternalPurchaseorders(),params,function(resp){
            		console.info(resp);
            		if(resp.ret == 0){
            			$alert({title: '提示：', content: '审核不通过成功!', placement: 'masget-top',type: 'info', duration:2, show: true});
            			$scope.getPage(1,$scope.gridOption.paginationPageSize);
            		}else if(resp.ret == 10){
            			$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
            		}else{
            			$alert({title: '提示：', content: '审核发生异常,'+resp.message, placement: 'masget-top',type: 'info', duration:2, show: true});
            		}
            	});    		
        	},{scope:$scope});    		
    	}

    };
    //取消采购单
    $scope.deletePuchaseOrders = function(grid,entity){
    	$confirm("确定要取消订单吗?",function(){
        	var params = {};
        	params.purchaseordernum = entity.purchaseordernum;
        	params.purchaseorderid = entity.purchaseorderid;
        	headQuartersOrdersService.httpPost(headQuartersOrdersService.cancelPurchaseorders(),params,function(resp){
        		console.info(resp);
        		if(resp.ret == 0){
        			$alert({title: '提示：', content: '取消采购单成功!', placement: 'masget-top',type: 'info', duration:2, show: true});
        			$scope.getPage(1,$scope.gridOption.paginationPageSize);
        		}else if(resp.ret == 10){
        			$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
        		}else{
        			$alert({title: '提示：', content: '取消采购单发生异常,'+resp.message, placement: 'masget-top',type: 'info', duration:2, show: true});
        		}
        	}); 
    	},{scope:$scope});
    };
    //采购方支付
    $scope.payPuchaseOrders = function(gird,entity){
		headQuartersOrdersService.setPayData(entity);
		$timeout(function(){
	    	$state.go("headQuartersOrdersPayment");
	    },1000);
    };
    //切换到开单页面
    $scope.toPurchaseOrdersAdd = function(){
    	$state.go("headQuartersOrdersAdd");
    };
}]).
controller('headQuartersOrdersDetailController',['$stateParams','$state','$scope','$rootScope','$http','headQuartersOrdersService','regularValidationService','$alert','commodityService','$timeout',
   function($stateParams,$state,$scope,$rootScope,$http,headQuartersOrdersService,regularValidationService,$alert,commodityService,$timeout){
	console.info($stateParams.ordernum);
	//根据订单号精确查询订单信息
	var params = {};
	params.ordernum = $stateParams.ordernum;
	headQuartersOrdersService.httpPost(headQuartersOrdersService.getRefinedOrders(),params,function(resp){
		console.log(resp.data.rows[0]);
		$scope.edit_datas = resp.data.rows[0];
	});
	//返回列表
	$scope.returnToList = function(){
		$state.go("getHeadQuartersOrders");
	};
	//修改
	$scope.modifyOrders = function(orders){
		$state.go("headQuartersOrdersModify");
		$state.orders = angular.copy(orders);
	};
}]).
controller('headQuartersOrdersMofifyController',['$stateParams','$state','$scope','$http','headQuartersOrdersService','regularValidationService','$alert','i18nService','$timeout',
 function($stateParams,$state,$scope,$http,headQuartersOrdersService,regularValidationService,$alert,i18nService,$timeout){
	i18nService.setCurrentLang('zh-cn');
	$scope.orders = {};
	$scope.orders.orderlist = [];
	$scope.temp_orderlist=[];
	$scope.supplier = {};
	//供应商下拉表格start
	$scope.formData ={};
	$scope.formData.datas = [];
    //省市县初定义
    $scope.baseData = {
        provinces:[],
        citys:[],
        areas:[]
    };
	
	$scope.getSuppliers = function(pagesize,pagenum,companyname,key){
		var data = {};
		data.scenetypeid = 2;
		data.pagesize = pagesize;
		data.pagenum = pagenum;
		data.companyname = companyname;	
		headQuartersOrdersService.httpPost(headQuartersOrdersService.getAllSuppliers(),data,function(resp){
			$scope.formData.datas = resp.data.rows;
			$scope.formData.total = resp.data.total;
			//页面初始化的时候默认选中第一位供应商
			if(key == 1){
				$scope.supplier = $scope.formData.datas[0];
				$scope.formData.keyWord = $scope.formData.datas[0].companyname;
			}
		});	
	};
    $scope.query = function () {
    	$scope.formData.keyWord=$scope.formData.keyWord==null?"":$scope.formData.keyWord;
        $scope.getSuppliers($scope.formData.pagesize,$scope.formData.pagenum,"",2);
    };
    
    $scope.$watch("supplier",function(){
    	
    });
    //在comboxtable里的文本框输入时触发的方法
    $scope.onReset = function(){
    	$scope.supplier={};
    };
    //供应商下拉表格end
    //页面初始化的时候默认选中第一位供应商
    $scope.getSuppliers(10,1,"",1);
	//获取省市县
	 $scope.getProvince = function(){
        var data = {};
        headQuartersOrdersService.getPCA(data, function(res){
            $scope.baseData.provinces = res.data.rows;
        }, function(err){
            $.jBox.tip("获取地区数据失败:" + err.message);
        });
    };
    
    $scope.getCity = function(provinceid, callback){
    	
        if(provinceid == undefined || provinceid == 0)
            return;
        var data = {};
        data.provinceid = provinceid;
        headQuartersOrdersService.getPCA(data, function(res){
            $scope.baseData.citys = res.data.rows;
            if(callback != undefined){
            	callback(provinceid);
            }
        }, function(err){
            $.jBox.tip("获取地区数据失败:" + err.message);
        });
    };

    $scope.getArea = function(cityid, callback){
    	
        if(cityid == undefined || cityid == 0)
            return;
        var data = {};
        data.cityid = cityid;
        headQuartersOrdersService.getPCA(data, function(res){
            $scope.baseData.areas = res.data.rows;
            if(callback != undefined){
            	callback(cityid);
            }
        }, function(err){
            $.jBox.tip("获取地区数据失败:" + err.message);
        });
    };
	
    //调用获取省份信息
    $scope.getProvince();
    //触发获取市县方法
    $scope.onChangeProvince = function(provinceid){
    	$scope.getCity(provinceid);
        $scope.orders.cityid='';
        $scope.orders.areaid = '';
        $scope.orders.buyercityid='';
        $scope.orders.buyercityname='';
        $scope.orders.buyerareaname = '';
        var province=$scope.findById($scope.baseData.provinces,"provinceid",provinceid);
        $scope.orders.buyerprovincename=province.provincename;
    };
    $scope.onChangeCity = function(cityid){
    	$scope.getArea(cityid);
       $scope.orders.areaid = '';
       $scope.orders.buyerareaid = '';
       $scope.orders.buyerareaname = '';
       var city=$scope.findById($scope.baseData.citys,"cityid",cityid);
       $scope.orders.buyercityname=city.cityname;
    };
    
    $scope.onChangeArea = function(areaid){
   	 	$scope.orders.areaid=areaid;
        var area=$scope.findById($scope.baseData.areas,"areaid",areaid);
        $scope.orders.buyerareaname=area.areaname;
    };	
    //在datas中查找key为value的对象
 	$scope.findById = function findById(datas, key,value) {
 		if(datas == null){
 			return null;
 		}
         for (var i = 0; i < datas.length; i++) {
             if (datas[i][key] == value) return datas[i];
         }
         return null;
     };
     //初始方法
     $scope.init = function(){
 			$scope.orders = $state.orders;
 			var provinceid = $scope.orders.buyerprovinceid;
 			var cityid = $scope.orders.buyercityid;
 			
 			$scope.getCity(provinceid);
 			$scope.getArea(cityid);
 			//获取临时数据
 			$scope.orders.orderlist = angular.copy($state.orders.orderlist);
 			$scope.temp_orderlist = angular.copy($state.orders.orderlist);
     };
	 $scope.init();
        //删除临时记录
        $scope.delrecord = function(index){
            $scope.orders.orderlist.splice(index, 1);
            $scope.temp_orderlist[index].action="delete";
        };

        //添加一行
        $scope.addNewRow = function(){
       	 
            var row = {};
            row.action = "add";
            row.discountrate = 0;
            row.goodsqty = 1;
            row.giftflag = 1;
            row.isgiftflag = false;
            row.selected = "";
            $scope.orders.orderlist.push(row);
            
            $scope.$watch(function() {
                return row.selected;
            }, function(newVal, oldVal) {
           	 
           	 //实现添加重复商品时自己匹配操作
           	 angular.forEach($scope.orders.orderlist, function(value, key){
           		 	if( value.goodsid !=undefined && value.goodsid == newVal.goodsid){
           		 		
           		 		value.goodsqty = value.goodsqty + 1;
           		 		$scope.orders.orderlist.pop();
           		 	    $alert({title: '提示：', content: '重复商品已合并,并且数量+1!', placement: 'masget-top',type: 'warning', duration:2, show: true});
           		 	}
           		});
           	 
                row.goodsname = newVal.goodsname;
                row.goodsid = newVal.goodsid;
                row.dealingprice = newVal.shopprice;
                row.goodsmoney = newVal.price;
            });
            
            //监听商品数量
            $scope.$watch(function() {
                return row.goodsqty;
            }, function(newVal, oldVal) {
            	var reg = /^(?:[1-9]\d*|0)$/;
            	if(!reg.test(newVal)){
            		newVal = oldVal;
            		row.goodsqty = oldVal;
            	}
                row.goodsmoney = (newVal *  row.dealingprice);
            });
             
            //计算总数量
            $scope.sumGoodsQty = function(){
                var totgoodsqty = 0;
                angular.forEach($scope.orders.orderlist, function(data,index,array){
                    if(data.goodsid != undefined && !isNaN(data.goodsqty) && !isNaN(data.dealingprice))
                        totgoodsqty += data.goodsqty;
                });
                $scope.orders.totgoodsqty = totgoodsqty;
                return totgoodsqty;
            };
            //计算总金额
            $scope.sumGoodsMoney = function(){
                var totgoodsmoney = 0;
                angular.forEach($scope.orders.orderlist, function(data,index,array){
                    if(data.goodsid != undefined && !isNaN(data.goodsqty) && !isNaN(data.dealingprice) && !isNaN(data.discountrate))
                        totgoodsmoney += data.goodsqty * data.dealingprice - (data.goodsqty *  data.dealingprice * data.discountrate * 0.01);
                });
                $scope.orders.totgoodsmoney = totgoodsmoney;
                return totgoodsmoney;
            };
            
         };
         $scope.addNewRow();			
     //获取商品信息
     $scope.querygoodssku=function(item){
     	var param = {
 			pagenum:1,
 			pagesize:50,
     	};
     	param.companyid = $scope.supplier.companyid;
        $http({
            method : 'POST',
            //url : "/jsbweb/baseline/orders/getgoods_by_classify.do",
            url : "/jsbweb/enterprise/goods/goodsList.do",
            data : $.param(param),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {
            if(data.ret==0){
                angular.forEach(data.data.rows,function(value,index){
                	value.dealingprice = value.shopprice;
                });
                $scope.goodsskus = data;
            }
            if(data.ret==10){
            	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
            }
        });
    };
    //修改
    $scope.submit = function(){
        for (var i = 0; i < $scope.orders.orderlist.length; i++) {
            if ($scope.orders.orderlist[i].goodsid == undefined) {
                $scope.orders.orderlist.splice(i, 1);
                i--;
            }
        }
        if ($scope.orders.orderlist.length == undefined || $scope.orders.orderlist.length <= 0) {
            $alert({title: '提示：', content: '订单明细不能为空!', placement: 'masget-top',type: 'warning', duration:2, show: true});
            return ;
        }
    	//修改界面保存操作
   	 
    	var tempparameter = [];
 		angular.forEach($scope.orders.orderlist, function (value, key) {
 			switch(value.action)
 			{
 			case "add":
 				value.action = "add";
 				value.orderlistid= 0;
 				value.orderid = $scope.orders.orderid;
 				break;
 			  default: value.action = "modify";
 			}
 		
 			tempparameter.push(value);
 		});
 		
 		angular.forEach($scope.temp_orderlist,function(dvalue,dkey){
 			if(dvalue.action=="delete"){
 				tempparameter.push(dvalue);
 			}
 		});
 		
 		$scope.orders.orderlist = tempparameter;
 		
		angular.forEach($scope.orders.orderlist, function(value, key){
			if(value.isgiftflag == false){
				value.giftflag = 1 ;
			}else{
				value.giftflag = 2;
			}
		}); 
		console.info($scope.orders);
		console.log("11");
 		var data = { data: angular.toJson($scope.orders)};
		$http({
             method: 'POST',
             url: "/jsbweb/enterprise/headquartersorders/modifyExternalOrders.do",
             data: $.param(data),
             headers: {
                 'Content-Type': 'application/x-www-form-urlencoded'
             }
         }).success(function (data) {
             if (data.ret == 0) {
            	 $alert({title: '提示：', content: '修改成功!', placement: 'masget-top',type: 'success', duration:2, show: true});
                 $state.go("getHeadQuartersOrders");
                 
             } else if (data.ret == 10) {
                 $alert({title: '提示：', content: '请先登录!', placement: 'masget-top',type: 'warning', duration:2, show: true});
             } else {
                 $alert({title: '提示：', content: '修改失败!', placement: 'masget-top',type: 'warning', duration:2, show: true});
             }
         }).error(function (rep) {
             $alert({title: '提示：', content: '修改失败!', placement: 'masget-top',type: 'warning', duration:2, show: true});
         });
    };
    //返回列表
	$scope.returnToList = function(){
		$state.go("getHeadQuartersOrders");
	}; 
}]);