angular.module('masgetWebApp.vehicletype', [
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
                        templateUrl: 'html/vehicletype.list.html',
//                        resolve: {
//                        	session:['example',
//                                     function (example) {
//                                         return example.getSession();
//                                     }]
//                        },

                        controller: 'vehicletypeCtr'
                    }
                }
            })

    }])
