angular.module('masgetWebApp.leagueapply', [
    'ui.router',
    "util.pagination",
    'ngMessages'
])

    .config(
    ['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state("list", {

                url: "/list",

                views: {

                    'content': {
                        templateUrl: 'html/leagueapply.audit.html',
                        resolve: {
                        	session:['example',
                                 function (example) {
                                     return example.getSession();
                                 }],
                            stationData:['example',
                                function (example) {
                                    return example.getStation();
                                }],
                            platformData:['example',
                                function (example) {
                                    return example.getPlatform();
                                }]
                        },
                        controller: 'leagueapplyCtr'
                    }
                }
            })

            .state("audit", {

                url: "/audit",

                views: {

                    'content': {
                        templateUrl: 'html/leagueapply.audit.html',
                        resolve: {
                            session:['example',
                                function (example) {
                                    return example.getSession();
                                }],
                            platformData:['example',
                                function (example) {
                                    return example.getPlatform();
                                }],
                            sceneData:['example',
                                function (example) {
                                    return example.getSceneData();
                                }]
                        },
                        controller: 'auditCtr'
                    }
                }
            })

            .state("plat", {

                url: "/plat",

                views: {

                    'content': {
                        templateUrl: 'html/platformmember.html',
                        resolve: {
                            session:['example',
                                function (example) {
                                    return example.getSession();
                                }],
                            platformData:['example',
                                function (example) {
                                    return example.getPlatform();
                                }]
                        },
                        controller: 'platCtr'
                    }
                }
            })
    }])
