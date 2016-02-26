angular.module('masgetWebApp.resource', [
    'ui.router',
    'ngMessages'
])

	
    .config(
    ['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state("list", {

                url: "/list",

                views: {

                    'resource_content': {
                        templateUrl: 'html/resource-check.html',
                        controller:'resourceController'

                    },
                    
                    'resource_checkList@list': {
                        templateUrl: 'html/resource-checkList.html',
                    }
                    
                }
            })
    }])
