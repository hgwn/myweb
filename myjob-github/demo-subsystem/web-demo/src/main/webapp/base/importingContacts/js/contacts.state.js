angular.module('masgetWebApp.contacts', [
    'ui.router',
    'selectAddress',
    'ngMessages'
])
	
    .config(
    ['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state("list", {

                url: "/list",

                views: {

                    'content': {
                        templateUrl: 'html/contacts.list.html',
                        resolve: {
                            groupData: ['example',
                                function (example) {
                                    return example.getGroup();
                                }],
                            session: ['example',
                                function (example) {
                                    return example.getSession();
                                }]
                        },

                        controller: 'contactsCtr'
                    }
                }
            })
            
            .state("import", {

                url: "/import",

                views: {

                    'content': {
                        templateUrl: 'html/contactsImport.html',
                        controller: 'contactsImportCtr'
                    },
                    
                    "selectFile@import":{
    					templateUrl: "html/contacts.select_excel.html"
    				}
                }
            })
    }])
