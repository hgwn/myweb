angular.module('masgetWebApp.osroleresource', [
    'ui.router',
    'ngMessages'
])

	.run(['$templateCache',function ($templateCache) {

        }
	])
	
    .config(
    ['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider.state("index", {

                url: "/index",

                views: {

                    'content': {
                        templateUrl: 'html/index.html',
                        controller: 'mainCtr'
                    }
                }
            })
    }])
