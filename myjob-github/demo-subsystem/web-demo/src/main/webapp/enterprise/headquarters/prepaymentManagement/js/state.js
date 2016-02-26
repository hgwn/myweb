angular.module('masgetWebApp.Prepayment', [
    'ui.router'
])

	
    .config(
    ['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state("list", {

                url: "/list",

                views: {

                    'content': {
                        templateUrl: 'template/list.html',
                        resolve: {
                            session:['Prepayment',
                                 function (Prepayment) {
                                     return Prepayment.getSession();
                                 }]
                        },
                        controller:'PrepaymentController'

                    }
                    
                }
            })

            .state("pos", {

                url: "/pos",

                views: {

                    'content': {
                        templateUrl: 'template/rechargeRecord.html',
                        controller:['$scope', '$state', '$stateParams',
                            function ($scope, $state, $stateParams) {
                                $scope.detail = $state.broadCast ? $state.broadCast.item : "";
                                if($scope.detail == ''){
                                    $state.go('list');
                                }
                                $scope.detail.amount = $scope.detail.amount.toFixed(2);
                                $scope.checkIncome = function () {
                                    $state.go("reDetail");
                                }
                            }]
                    }

                }
            })

            .state("reDetail", {

                url: "/detail?id",

                views: {

                    'content': {
                        templateUrl: 'template/rechargeDetail.html',
                        resolve: {
                            session:['Prepayment',
                                function (Prepayment) {
                                    return Prepayment.getSession();
                                }]
                        },
                        controller:'PrepaymentController'
                    }

                }
            })

            .state("order", {

                url: "/order?id",

                views: {

                    'content': {
                        templateUrl: 'template/orderPayment.html',
                        resolve: {
                            session:['Prepayment',
                                function (Prepayment) {
                                    return Prepayment.getSession();
                                }]
                        },
                        controller:'PrepaymentController'
                    }

                }
            })
    }])
