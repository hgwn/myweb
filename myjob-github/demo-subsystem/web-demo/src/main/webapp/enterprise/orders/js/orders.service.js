/**
 * Created by Administrator on 2015-06-10.
 */

angular.module('masgetWebApp.enterprise.orders.service', [

])

    .factory('ordersService', ['$http', function ($http) {
        var factory = {};

        factory.getPCA = function(data, callback, errorback){
            //?type=district&provinceid=
            data.type = "district";
            $http({
                method  : 'POST',
                url     : '/masgetweb/commonUtils.do',
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

        factory.getOrderNum = function(callback, errorback){
            var ordernumparam = {ordertypeid:"307"};
            $http({
                method  : 'POST',
                url     : '../../orderNum/get.do',
                data    : $.param(ordernumparam),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data){
                console.log(data)
                callback(data.ordernum);
                //$scope.orders.ordernum = data.ordernum;
            }).error(function(resp){
                errorback(resp)
                console.log(resp)
            });
        }

        factory.getContact = function(contactFormData, callback){
            var param = { keyword:contactFormData.contactkeyword,pagenum:contactFormData.pagenum,pagesize:contactFormData.pagesize};
            $http({
                method  : 'POST',
                url     : '../../base/contractorinfo/get.do',
                data    : $.param(param),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data) {
                console.log(data);
                if (data.ret == 0) {
                   callback(data.data, true)
                }
                else{
                    callback(data.message, false);
                }
            }).error(function(resp){
                console.log(resp);
                callback(resp.message, false)

            });
        }

        return factory;
    }]);