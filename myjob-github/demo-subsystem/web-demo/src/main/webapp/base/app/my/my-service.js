angular.module('masgetWebApp.my.service', [])

    .factory('my', ['$http', 'utils','$alert' ,'$rootScope',function ($http, utils,$alert,$rootScope) {

        var factory = {};
        factory.all = function () {
            return
        };
        return factory;
    }]);