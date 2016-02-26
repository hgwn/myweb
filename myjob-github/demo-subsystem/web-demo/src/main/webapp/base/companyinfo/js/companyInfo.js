angular.module('masgetWebApp.companyInfo', [
    'ui.router',
    'ngFileUpload',
    'ngMessages',
    'selectAddress'
])
	
    .config(
    ['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state("list", {

                url: "/list",

                views: {

                    'content': {
                        templateUrl: 'html/companyInfo.list.html',
                        resolve: {
                        	session:['example',
                                     function (example) {
                                         return example.getSession();
                                     }]
                        },

                        controller: 'companyInfoCtr'
                    }
                }
            })
    }])
