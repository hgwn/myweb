/**
 * Created by Administrator on 2015-06-10.
 */

angular.module('masgetWebApp.enterprise.stock.service', [

])

    .factory('stockService', ['$http', function ($http) {
        var factory = {};
        
        factory.arrayDataToTree = function (arrayData, propertyId, propertyPid, pId, level, parentNode) {
            if (angular.isArray(arrayData) && arrayData.length == 0) return;
            var filterData = [];
            var result = {};
            if (!angular.isDefined(parentNode)) parentNode = {};
            for (var i = 0; i < arrayData.length; i++) {
                if (arrayData[i][propertyPid] != pId) {
                    filterData.push(arrayData[i]);
                }
            }
            parentNode["nodes"] = [];
            result["nodes"] = [];
            for (var i = 0; i < arrayData.length; i++) {
                if (arrayData[i][propertyPid] == pId) {
                    var node = jQuery.extend({}, arrayData[i],{level:level});
                    arguments.callee(filterData, propertyId, propertyPid, node[propertyId], level + 1, node);
                    if (level == 0) {
                        result["nodes"].push(node);
                    } else {
                        parentNode["nodes"].push(node);
                    }
                }
            }
            if (level == 0)
                return result["nodes"];
        };
        factory.getWarehousein = function(callback, errorback){
            var ordernumparam = {ordertypeid:"308"};
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

        factory.getWarehouseout = function(callback, errorback){
            var ordernumparam = {ordertypeid:"309"};
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

        return factory;
    }]);