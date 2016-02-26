angular.module('stockList.Service',[])
    .factory('stockListService',['$http',function($http){
        var factory = {};
        var getGoodsStockListUrl = "/jsbweb/enterprise/stockList/getGoodsStockList.do";
        var getGoodsStockUrl = "/jsbweb/enterprise/stockList/getGoodsStock.do";
        var getStationUrl = "/jsbweb/enterprise/stockList/getStation.do";

        factory.getGoodsStockListUrl = function(){
        	return getGoodsStockListUrl;
        };
        factory.getGoodsStockUrl = function(){
        	return getGoodsStockUrl;
        };
        factory.getStationUrl = function(){
        	return getStationUrl;
        };
        //回调方式通过get方法获取数据
        factory.httpGet = function (url, callback) {
            $http.get(url).then(function (resp) {
                callback(resp.data);
            });
        };
        factory.httpPost = function (url,params,callback){
        	$http({
                method : 'POST',
                url : url,
                data : $.param(params),
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
            }).success(function(resp){
            	callback(resp);
            }).error(function(resp){
            	callback(resp);
            });
        };
        return factory;
    }]);