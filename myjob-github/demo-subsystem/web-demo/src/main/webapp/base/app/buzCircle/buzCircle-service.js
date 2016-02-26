angular.module('masgetWebApp.buzcircle.service', [

])

    .factory('buzcircle', ['$http', 'utils', function ($http, utils) {
        var factory = {};
        factory.all = function () {
            return utils.query("/jsbweb/buzCircle.do?type=get").then(function (resp) {
                return resp.data.rows;
            });
        };
        return factory;
    }]);
