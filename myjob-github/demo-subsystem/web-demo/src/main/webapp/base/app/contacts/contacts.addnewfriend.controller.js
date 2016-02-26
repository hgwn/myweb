angular.module("masgetWebApp.contacts").controller("ordersAddSalesOrderController",
    ['$scope','$http',"$stateParams","$state","$window","$timeout","ordersService",
        function($scope, $http,$stateParams,$state,$window,$timeout,ordersService) {
            $scope.orders = {
                totgoodsmoney:0,
                paymenttype:0,
                autowarehouseout:1,
                tradesourceflag:3,
                goodsdeposit:0,
                invoicetype:1,
                buyeraddressExtra:"",
                orderlist:[]
            };

            //$scope.state

            $scope.scenetype = [
                {id:3, name:"客户"},
                {id:4, name:"渠道商"}
            ];
            $scope.addConactData = {
                scenetypeid:3
            };

            $timeout(function(){
                $scope.init();
            },100);

            $scope.addConact = function(){
                $scope.addConactData.address += "" + $scope.addConactData.addressExtra == undefined? "" : "-" + $scope.addConactData.addressExtra;
                var data = {data: angular.toJson( $scope.addConactData)};
                $http({
                    method : 'POST',
                    url : '/jsbweb/base/contractorinfo/add.do',
                    data : $.param(data),
                    headers : {
                        'Content-Type' : 'application/x-www-form-urlencoded'
                    }
                }).success(function(data){
                    if (data.ret == 0) {
                        $.jBox.tip('客户添加成功', 'success');
                        $("#modal-container-184101").modal("hide");
                        $scope.addConactData = {};
                    } else {
                        $.jBox.tip('客户添加失败', 'warning');
                    }
                }).error(function(rep){
                    console.log(rep)
                    $.jBox.tip('客户添加失败', 'warning');
                });
            }


            $scope.init = function(){
                ordersService.getOrderNum(function(ordernum){
                    $scope.orders.ordernum = ordernum + "";
                }, function(err){
                    console.log(err)
                });
                var begin_date = new Date();
                $scope.orders.createdtime = begin_date.pattern("yyyy-MM-dd HH:mm");
            }

            $scope.submit = function() {
                console.log($scope.orders)
                if ($scope.orders.buyerid == undefined) {
                    $scope.orders.tradesourceflag = 3;
                    $scope.orders.buyerid = 0;
                    $scope.orders.buyname = "匿名客户";
                }
                if( $scope.orders.buyeraddressExtra != undefined && $scope.orders.buyeraddressExtra != ""){
                    $scope.orders.buyeraddress += "-"  +  $scope.orders.buyeraddressExtra;
                }


                for(var i=0; i< $scope.orders.orderlist.length; i++){
                    if($scope.orders.orderlist[i].goodsid == undefined){
                        $scope.orders.orderlist.splice(i, 1);
                        i--;
                    }
                }

                var data = {data: angular.toJson($scope.orders)};
                $http({
                    method : 'POST',
                    url : '/jsbweb/enterprise/billing/addsalesorder.do',
                    data : $.param(data),
                    headers : {
                        'Content-Type' : 'application/x-www-form-urlencoded'
                    }
                }).success(function(data){
                    console.log(data);
                    if (data.ret == 0) {
                        $.jBox.tip('售货开单成功', 'success');
                        setTimeout("location.reload()",3000);
                    } else {
                        $.jBox.tip('售货开单失败', 'warning');
                    }

                }).error(function(){
                    console.log("err");
                    $.jBox.tip('售货开单失败', 'warning');
                });
            }
        }])