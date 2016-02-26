angular.module('masgetWebApp.datum', [
    'ui.router',
    'ngFileUpload',
    'ngMessages'
])
	
    .config(
    ['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state("list", {

                url: "/list",

                views: {

                    'content': {
                        templateUrl: 'html/datum.list.html',
                        resolve: {
                        	session:['example',
                                     function (example) {
                                         return example.getSession();
                                     }],
                        	contactsRoletype:['example',
                                 function (example) {
                                     return example.getRoletype();
                                 }],
                            plData:['example',
                                function (example) {
                                    return example.getplData();
                                }]
                        },

                        controller: 'datumCtr'
                    }
                }
            })
    }])
