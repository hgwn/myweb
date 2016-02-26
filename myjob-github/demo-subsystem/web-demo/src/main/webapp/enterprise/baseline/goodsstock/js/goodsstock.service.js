angular.module('goodsstock.Service',[])
    .factory('goodsstockService',['$http',function($http){
        var factory = {};
        
        var getGoodsStockListUrl = '/jsbweb/enterprise/goodsstock/getGoodsStockList.do';
        
        var getGoodsStockInOutListUrl = '/jsbweb/enterprise/goodsstock/getGoodsStockInOutList.do';
        
        var getGoodsStockOutListUrl = '/jsbweb/enterprise/goodsstock/getGoodsStockOutDetail.do';
        
        var getGoodsStockInListUrl = '/jsbweb/enterprise/goodsstock/getGoodsStockInDetail.do';
        
        var getGoodsStockBatchListUrl = '/jsbweb/enterprise/goodsstock/getGoodsStockBatchDetail.do';
        
        factory.getGoodsStockBatchList = function(){
        	return getGoodsStockBatchListUrl;
        };
        
        factory.getGoodsStockList = function(){
        	return getGoodsStockListUrl;
        };

        factory.getGoodsStockInOutList = function(){
        	return getGoodsStockInOutListUrl;
        };
        
        factory.getGoodsStockOutList = function(){
        	return getGoodsStockOutListUrl;
        };
        
        factory.getGoodsStockInList = function(){
        	return getGoodsStockInListUrl;
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