/**
 * Created by Administrator on 2015-06-12.
 */
entOrdersModule.controller("ordersSalesOrderListController",
    ['$scope','$http',"$stateParams","$state","$window","$timeout","ordersService",
        function($scope, $http,$stateParams,$state,$window,$timeout,ordersService) {
            $scope.orders = [];
            $scope.formData={
                datatype:2,
                pagesize:10,
                pagenum:1
            };
            $scope.modeldata = {};
            // 搜索订单
            $scope.queryForm = function () {
                $scope.formData.orders = 'createdtime';
                $scope.formData.orderkey = 'desc';
                console.log($scope.formData);
                $http({
                    method: 'POST',
                    url: "/jsbweb/enterprise/orders/getsupplier_orders.do",
                    data: $.param($scope.formData),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (data) {
                    console.log(data)
                    $scope.orders = data.data;
                    console.log($scope.orders)
                }).error(function(rep){
                    console.log(rep)
                })
            }

            $scope.convertGiftFlag = function(giftflag){
                if(giftflag == 1)
                    return "否";
                else
                    return "是";
            }
            $scope.view = function(item){
                console.log(item.orderlists)
                $scope.modeldata.orderlists = item.orderlists;
            }
            //
            ////查询
            //$scope.queryForm = function(){
            //
            //    $http({
            //        method : 'POST',
            //        url :"/jsbweb/enterprise/com/get_warehousein.do",
            //        data : $.param($scope.formData),
            //        headers : {
            //            'Content-Type' : 'application/x-www-form-urlencoded'
            //        }
            //    }).success(function(data) {
            //        $scope.warehouseins=data;
            //        $scope.filterdata();
            //    });
            //};
        }
    ])
    .controller("ordersSalesOrderListQueryController",
    ['$scope','$http',"$stateParams","$state","$window","$timeout","ordersService",
        function($scope, $http,$stateParams,$state,$window,$timeout,ordersService) {
            $scope.states = [
                {id:1, name:"待审核"},
                {id:2, name:"审核通过"}
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
                })
            }
        }
    ])
    .controller("ordersSalesOrderListGridController",
    ['$scope','$http',"$stateParams","$state","$window","$timeout","ordersService",
        function($scope, $http,$stateParams,$state,$window,$timeout,ordersService) {
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
                }
            }
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
                }
            }
            $scope.convertAutoWarehouseoutToName = function(autowarehourceout){
                if(autowarehourceout == 1){
                    return "人工出库";
                }else{
                    return "自动出库";
                }
            }
            $scope.convertInvoiceTypwToName = function(invoicetype){
                switch (invoicetype){
                    case 1:
                        return "收据";
                    case 2:
                        return "普通发票";
                    case 3:
                        return "增值税发票";
                }
            }
//            订单状态：（1：，2：，
//3：，4：，5：，
//6：，7：，8：，
//9：，10：，11：）默认1
            $scope.convertOrderStateToName = function(orderstate){
                switch (orderstate){
                    case 1:
                        return "采购方待审核";
                    case 2:
                        return "采购方已审核";
                    case 3:
                        return "供应商已审核";
                    case 4:
                        return "供应商审核异常";
                    case 5:
                        return "供应商已发货";
                    case 6:
                        return "采购商取消";
                    case 7:
                        return "订单已支付";
                    case 8:
                        return "供应商取消";
                    case 9:
                        return "供应商已出库";
                    case 10:
                        return "订金已支付";
                    case 11:
                        return "订单已完结";
                }
            }
            $scope.convertOCreatedTime = function(createdtime){
                var index = createdtime.lastIndexOf(".");
                if(!isNaN(index)){
                    var str = createdtime.substr(0, index);
                    return str;
                }
                return createdtime;
            }

        }
    ])