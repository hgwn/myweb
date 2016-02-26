angular.module('masgetWebApp.exploration', [
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
                        templateUrl: 'html/exploration.content.html',

                        controller: 'explorationCtr'
                    }
                }
            })
    }])
