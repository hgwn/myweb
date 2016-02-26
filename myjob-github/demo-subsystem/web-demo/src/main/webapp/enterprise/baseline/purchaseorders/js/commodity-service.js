angular.module('commodity.Service',[])
    .factory('commodityService',['$http',function($http){
        var factory = {};
        var getordernumUrl = '/jsbweb/enterprise/commodity/getordernum.do';
        var getdistrict = '/jsbweb/enterprise/commodity/getdistrict.do';
        var suppliersGetAllUrl = '/jsbweb/enterprise/commodity/suppliersGetAll.do';
        //回调方式通过get方法获取数据
        factory.httpGet = function (url, callback) {
            $http.get(url).then(function (resp) {
                callback(resp.data);
            });
        };
        factory.getSuppliersGetAllUrl = function(){
        	return suppliersGetAllUrl;
        };
        factory.getDistrictUrl = function(){
            return getdistrict;
        };
        factory.getOrderNumUrl = function(){
            return getordernumUrl;
        };
        factory.parseUrl=function(){
     	   var path = window.location.href.split("?");
    	   return path[1].split("#")[0].split("=");
        };
        return factory;
    }]);