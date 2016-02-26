/**
 * Created by Administrator on 2015-09-9.
 */

angular.module('service', [

])

    .factory('addressmanageService', ['$http', function ($http) {
        var factory = {};

        factory.getPCA = function(data, callback, errorback){
            //?type=district&provinceid=
            data.type = "district";
            $http({
                method  : 'POST',
                url     : '/jsbweb/commonUtils.do',
                data    : $.param(data),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data) {
                console.log(data)
                if (data.ret == 0) {
                    callback(data);
                }else{
                    errorback(data);
                }
            }).error(function(resp){
                console.log(resp)
                errorback(resp);
            });
        }
        return factory;
    }]);