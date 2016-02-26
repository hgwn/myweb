angular.module('masgetWebApp.Faccount', [
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
                        	session:['FaccountUtils',
                                 function (FaccountUtils) {
                                     return FaccountUtils.getSession();
                                 }]
                        },
                        controller:'FaccountController'

                    }
                    
                }
            })

            .state("incomeDetail", {

                url: "/incomeDetail",

                views: {

                    'content': {
                        templateUrl: 'template/IncomeDetail.html',
                        resolve: {
                            session:['FaccountUtils',
                                function (FaccountUtils) {
                                    return FaccountUtils.getSession();
                                }]
                        },
                        controller:'payaccountController'

                    }

                }
            })

            .state("confirm", {

                url: "/confirm",

                views: {

                    'content': {
                        templateUrl: 'template/confirmation.html',
                        resolve: {
                            session:['FaccountUtils',
                                function (FaccountUtils) {
                                    return FaccountUtils.getSession();
                                }]
                        },
                        controller:'confirmController'

                    }

                }
            })
    }])
