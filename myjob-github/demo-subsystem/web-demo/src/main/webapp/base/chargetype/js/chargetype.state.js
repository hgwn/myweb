angular.module('masgetWebApp.chargetype', [
    'ui.router',
    'ngMessages'
])
	
    .config(
    ['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state("list", {

                url: "/list",

                views: {

                    'content': {
                        templateUrl: 'html/chargetype.list.html',
                        resolve: {
                        	session:['example',
                                 function (example) {
                                     return example.getSession();
                                 }],
                         	chargeType:['example',
                                 function (example) {
                         			return example.getChargeType();
                            }]
                        },

                        controller: 'chargetypeCtr'
                    }
                }
            })

    }])
