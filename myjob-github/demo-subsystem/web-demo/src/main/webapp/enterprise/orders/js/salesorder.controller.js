/**
 * Created by Administrator on 2015-06-25.
 */
/**
 * Created by Administrator on 2015-06-12.
 */
entOrdersModule.controller("SalesOrdersController",
    ['$scope','$http',"$stateParams","$state","$window","$timeout","ordersService",
        function($scope, $http,$stateParams,$state,$window,$timeout,ordersService) {
            $scope.orders = [];
            $scope.formData={
                datatype:2,
                pagesize:10,
                pagenum:1
            };

            $scope.baseData = {};


            $scope.modeldata = {};

            $scope.getPage = function(pagenum, pagesize, sort) {
                $scope.formData.pagenum = pagenum;
                $scope.formData.pagesize = pagesize;
                $scope.formData.orders = 'createdtime';
                $scope.formData.orderkey = 'desc';
                var tempdata = $scope.formData.endcreatedtime;
                if($scope.formData.endcreatedtime != undefined)
                	$scope.formData.endcreatedtime = $scope.formData.endcreatedtime +' 23:59:59';
                console.log($scope.formData.selectedAcontact)
                
                if($scope.formData.selectedAcontact != undefined && $scope.formData.selectedAcontact != "")
                	$scope.formData.buyerid = $scope.formData.selectedAcontact.staffid;
                
                console.log($scope.formData)
                $http({
                    method: 'POST',
                    url: "/jsbweb/enterprise/orders/getsupplier_orders.do",
                    data: $.param($scope.formData),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (data) {
                    if(data.ret==0){
                    	angular.forEach(data.data.rows,function(data,index,array){
                    		data.buyeraddress = data.buyerprovincename + data.buyercityname + data.buyerareaname + data.buyeraddress;
                    	});
                        $scope.baseData.gridOptions.data = data.data.rows;
                        $scope.baseData.gridOptions.totalItems = data.data.total;
                    }else if(data.ret==10){
                        $.jBox.tip("请先登录", 'warning');
                    }else{
                        $.jBox.tip("获取商品数据失败", 'warning');
                    }
                }).error(function(rep){
                    console.log(rep)
                    $.jBox.tip("获取商品数据失败", 'warning');
                });
                
                $scope.formData.endcreatedtime = tempdata;
            };

            //$scope.view = function(item){
            //    console.log(item.orderlists)
            //    $scope.modeldata.orderlists = item.orderlists;
            //}
        }
    ])
    .controller("SalesOrdersQueryController",
    ['$scope','$http',"$stateParams","$state","$window","$timeout","ordersService",
        function($scope, $http,$stateParams,$state,$window,$timeout,ordersService) {

            $scope.onClickToQuery = function(){
//            	$scope.formData.selectedAcontact
//            	$scope.formData.buyerid = $scope.formData.selectedAcontact.companyid;
                //$scope.queryParams.barcode = $scope.queryParams.goodsname;
                //$scope.queryParams.goodsspec = $scope.queryParams.goodsname;
                $scope.getPage(1, $scope.baseData.gridOptions.paginationPageSize);
            }
//            //日期控件
//            $scope.queryload = function () {
//                $("#begincreatedtime,#endcreatedtime").datetimepicker({
//                    language: 'zh-CN',
//                    autoclose: true,
//                    todayBtn: true,
//                    pickerPosition: "bottom-left",
//                    todayHighlight: true,
//                    startView: 2,
//                    minView: 2,
//                    format:'yyyy-mm-dd'
//                });
//                
//                $scope.getContact();
//            };
            $scope.states = [
                {id:2, name:"新增售货单"},
                {id:3, name:"审核通过"},
                {id:12, name:"仓库待出库"},
                {id:9, name:"仓库已出库"},
                {id:5, name:"已发货"},
                {id:11, name:"订单已完结"},
                {id:8, name:"订单取消"}
            ]
            $scope.contacts = [];
            $scope.selectedAcontact = {};
            $scope.contactFormData={};
            $scope.contactFormData.contactkeyword = "";
            $scope.getContact = function(){
                ordersService.getContact($scope.contactFormData ,function(data, flag){
                    console.log(data);
                    if(flag){//成功
                        $scope.contacts = data.rows;
                        $scope.contactData=data;
                    }
                    else{//失败

                    }
                });
            };
            
        }
    ])
    .controller("SalesOrdersGridController",
    ['$scope','$http',"$stateParams","$state","$window","$timeout","ordersService", "i18nService",
        function($scope, $http,$stateParams,$state,$window,$timeout,ordersService, i18nService) {
            i18nService.setCurrentLang('zh-cn');

            var paginationOptions = {
                sort: null
            };
            $scope.baseData.gridOptions = {
                expandableRowTemplate: 'tpls/expandableRowTemplate.html',
                expandableRowHeight: 200,
                paginationPageSizes: [10, 20, 50, 100],
                paginationPageSize: 20,
                useExternalPagination: true,
                useExternalSorting: true,
                enableColumnMenus: false,
                enableRowSelection: true,
                enableSelectAll: true,
                selectionRowHeaderWidth: 35,
                columnDefs: [
                    {name:'操作', field:'', width: 120,
                        cellTemplate: '<div class="ui-grid-cell-contents">' +
                        '<a style="cursor:pointer; margin-left: 10px;" ng-click="grid.appScope.auditOrders(grid, row.entity)" title="审核通过" ng-if="row.entity.orderstate == 2">' +
                        '<span class="">审核</span></a>' +
                        //'<a style="cursor:pointer; margin-left: 10px;" ng-click="grid.appScope.payfornowOrders(grid, row.entity)" title="确认现付收款" ng-if="row.entity.orderstate == 2">' +
                        //'<span class="glyphicon glyphicon-saved green"></span></a>' +
                        '<a style="cursor:pointer; margin-left: 10px;" ng-click="grid.appScope.endOrders(grid, row.entity)" title="订单完结" ng-if="row.entity.orderstate != 11">' +
                        '<span class=""></span>完结</a>' +
                        '<a style="cursor:pointer; margin-left: 10px;" ng-click="grid.appScope.cancelOrders(grid, row.entity)" title="取消订单" ng-if="row.entity.orderstate != 11 && row.entity.orderstate != 5 && row.entity.orderstate != 9 && row.entity.orderstate != 8">' +
                        '<span class="">取消</span></a>' +
                        '</div>'
                    },
                    { name: '售货单号',field:'ordernum' , width:160},
                    { name: '开单日期',field:'createdtime' , width:100,cellTemplate:
                        '<div class="ui-grid-cell-contents">{{grid.appScope.convertOCreatedTime(row.entity.createdtime)}}</div>'
                    },
                    { name: '状态',field:'orderstate' , width:100,cellTemplate:
                        '<div class="ui-grid-cell-contents">{{grid.appScope.convertOrderStateToName(row.entity.orderstate)}}</div>'
                    },
                    { name: '仓库',field:'warehousename' , width:100},
                    //{ name: '自动出库',field:'autowarehouseout' , width:100},
                    { name: '客户',field:'buyername' , width:120},
                    { name: '总数量',field:'totgoodsqty' , width:80},
                    { name: '总金额',field:'totgoodsmoney' , width:80},
                    //{ name: '折扣金额',field:'totdiscountmoney' , width:100},
                    { name: '定金',field:'goodsdeposit' , width:80},
                    { name: '结算方式',field:'settlementtypeid' , width:80,cellTemplate:
                        '<div class="ui-grid-cell-contents">{{grid.appScope.convertSettlementToName(row.entity.settlementtypeid)}}</div>'
                    },
                    { name: '交货方式',field:'deliveryflag' , width:80,cellTemplate:
                        '<div class="ui-grid-cell-contents">{{grid.appScope.convertDeliveryFlagToName(row.entity.deliveryflag)}}</div>'
                    },
                    { name: '联系电话',field:'buyerphone' , width:100},
                    { name: '客户地址',field:'buyeraddress' , width:120},
                    { name: '发票类型',field:'invoicetype' , width:100,cellTemplate:
                        '<div class="ui-grid-cell-contents">{{grid.appScope.convertInvoiceTypwToName(row.entity.invoicetype)}}</div>'
                    },
                    { name: '发票编号',field:'invoicenumber' , width:100},
                    { name: '备注',field:'remark' , width:100}
                ],
                onRegisterApi: function(gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                        if (row.isExpanded) {
                            row.entity.subGridOptions = {
                                columnDefs: [
                                    { name: '商品名称',field:'goodsname'},
                                    { name: '商品条码',field:'goodsbarcode'},
                                    { name: '规格',field:'goodsspec'},
                                    { name: '数量',field:'goodsqty'},
                                    { name: '价格',field:'dealingprice'},
                                    { name: '赠品',field:'giftflag',cellTemplate:
                                        '<div class="ui-grid-cell-contents">{{row.entity.giftflag==2?"是":"否"}}</div>'
                                    }
                                ]};
                            row.entity.subGridOptions.data = row.entity.orderlists;
                            console.log(row.entity.orderlists)
                        }
                    });

                    $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                        if($scope.getPage) {
                            if (sortColumns.length > 0) {
                                paginationOptions.sort = sortColumns[0].sort.direction;
                            } else {
                                paginationOptions.sort = null;
                            }
                            $scope.getPage(grid.options.paginationCurrentPage, grid.options.paginationPageSize, paginationOptions.sort)
                        }
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        if($scope.getPage) {
                            $scope.getPage(newPage, pageSize, paginationOptions.sort);
                        }
                    });
                }
            };

            $scope.auditOrders = function(grid, row){
                var param = {};
                param.orderid = row.orderid;
                param.ordernum = row.ordernum;

                $http({
                    method: 'POST',
                    url: "/jsbweb/enterprise/orders/audit.do",
                    data: $.param(param),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (data) {
                    if(data.ret==0){
                        $.jBox.tip("审核成功", 'success');
                        $scope.getPage(1, $scope.baseData.gridOptions.paginationPageSize);
                    }else if(data.ret==10){
                        $.jBox.tip("登录信息异常,请重新登录", 'warning');
                    }else{
                        $.jBox.tip("审核失败", 'warning');
                    }
                }).error(function(rep){
                    console.log(rep)
                    $.jBox.tip("审核失败", 'warning');
                });
            };

            $scope.endOrders = function(grid, row){
                var param = {};
                param.orderid = row.orderid;
                param.ordernum = row.ordernum;
                $http({
                    method: 'POST',
                    url: "/jsbweb/enterprise/orders/ended.do",
                    data: $.param(param),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (data) {
                    if(data.ret==0){
                        $.jBox.tip("订单已完结", 'success');
                        $scope.getPage(1, $scope.baseData.gridOptions.paginationPageSize);
                    }else if(data.ret==10){
                        $.jBox.tip("登录信息异常,请重新登录", 'warning');
                    }else{
                        $.jBox.tip("结束订单失败", 'warning');
                    }
                }).error(function(rep){
                    console.log(rep)
                    $.jBox.tip("结束订单失败", 'warning');
                });
            };

            $scope.cancelOrders = function(grid, row){
                $.jBox.confirm("确定要取消该笔售货单，单号::  " + row.ordernum + " ？", "温馨提示", function(v, h, f){
                    if(v == "ok"){
                        var param = {};
                        param.orderid = row.orderid;
                        param.ordernum = row.ordernum;
                        $http({
                            method: 'POST',
                            url: "/jsbweb/enterprise/orders/cancel.do",
                            data: $.param(param),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        }).success(function (data) {
                            if(data.ret==0){
                                $.jBox.tip("取消售货单成功", 'success');
                                $scope.getPage(1, $scope.baseData.gridOptions.paginationPageSize);
                            }else if(data.ret==10){
                                $.jBox.tip("登录信息异常,请重新登录", 'warning');
                            }else{
                                $.jBox.tip("取消售货单失败", 'warning');
                            }
                        }).error(function(rep){
                            console.log(rep)
                            $.jBox.tip("取消售货单失败", 'warning');
                        });
                    }
                    return true;
                });

            };
            //{id : 1,name : "现付"},
            //{id : 2,name : "到付"},
            //{id : 4,name : "月结"},
            //{id : 10,name : "物流代收"}
            $scope.convertSettlementToName = function(settlementid){
                switch(settlementid){
                    case 1:
                        return "现付";
                    case 2:
                        return "到付";
                    case 3:
                        return "月结";
                    case 10:
                        return "物流代收";
                    default :
                        return "";
                }
            };
            //{ id : 1, name : "送货上门" },
            //{ id : 2, name : "仓库自提" },
            //{ id : 3, name : "现场交货" }
            $scope.convertDeliveryFlagToName = function(deliveryflag){
                switch (deliveryflag){
                    case 1:
                        return "送货上门";
                    case 2:
                        return "仓库自提";
                    case 3:
                        return "现场交货";
                    default :
                        return "";
                }
            };
            $scope.convertAutoWarehouseoutToName = function(autowarehourceout){
                if(autowarehourceout == 1){
                    return "人工出库";
                }else{
                    return "自动出库";
                }
            };
            $scope.convertInvoiceTypwToName = function(invoicetype){
                switch (invoicetype){
                    case 1:
                        return "收据";
                    case 2:
                        return "普通发票";
                    case 3:
                        return "增值税发票";
                    default :
                        return "";
                }
            };
//            订单状态：（1：，2：，
//3：，4：，5：，
//6：，7：，8：，
//9：，10：，11：）默认1
            $scope.convertOrderStateToName = function(orderstate){
                switch (orderstate){
                    case 1:
                        return "采购方待审核";
                    case 2:
                        return "待审核";
                    case 3:
                        return "审核通过";
                    case 4:
                        return "供应商审核异常";
                    case 5:
                        return "已发货";
                    case 6:
                        return "采购商取消";
                    case 7:
                        return "订单已支付";
                    case 8:
                        return "订单取消";
                    case 9:
                        return "仓库已出库";
                    case 10:
                        return "订金已支付";
                    case 11:
                        return "订单已完结";
                    case 12:
                        return "仓库待出库";
                    default :
                        return "";
                }
            };
//
//            订单状态：（1：采购方待审核，2：采购方已审核(新增售货单)，
//3：供应商已审核(审核通过)，4：供应商审核异常，5：供应商已发货(已发货)，
//6：采购商取消，7：订单已支付，8：供应商取消(订单取消)，
//9：供应商已出库(仓库已出库)，10：订金已支付，11：订单已完结，12:仓库待出库）默认1
//            销货单流程: 2->3->12->9->5->11->8

            $scope.convertGiftFlag = function(giftflag){
                console.log(giftflag)
                if(giftflag == 1)
                    return "否";
                else
                    return "是";
            };

            $scope.convertOCreatedTime = function(createdtime){
                var index = createdtime.lastIndexOf(".");
                if(!isNaN(index)){
                    var str = createdtime.substr(0, index);
                    return str;
                }
                return createdtime;
            }

            $scope.getPage(1, $scope.baseData.gridOptions.paginationPageSize);
        }
    ]);