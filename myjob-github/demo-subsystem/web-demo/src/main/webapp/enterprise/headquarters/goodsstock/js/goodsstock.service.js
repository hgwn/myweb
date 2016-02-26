angular.module('goodsstock.Service',[])
    .factory('goodsstockService',['$http',function($http){
        var factory = {};
        var data = {};
        var getGoodsStockListUrl = '/jsbweb/enterprise/goodsstock/getGoodsStockList.do';
        
        var getGoodsHeadquartersStockListUrl = '/jsbweb/enterprise/goodsstock/headquarters/goodsstock/get.do';
        
        var getGoodsStockInOutListUrl = '/jsbweb/enterprise/goodsstock/getGoodsStockInOutList.do';
        
        var getGoodsStockOutListUrl = '/jsbweb/enterprise/goodsstock/getGoodsStockOutDetail.do';
        
        var getGoodsStockInListUrl = '/jsbweb/enterprise/goodsstock/getGoodsStockInDetail.do';
        
        var getGoodsStockBatchListUrl = '/jsbweb/enterprise/goodsstock/getGoodsStockBatchDetail.do';
        
        var getSubcompanyUrl = '/jsbweb/enterprise/contactor/getSubcompany.do';
        
        factory.getSubcompany = function(){
        	return getSubcompanyUrl;
        };
        factory.getGoodsStockBatchList = function(){
        	return getGoodsStockBatchListUrl;
        };
        factory.getGoodsHeadquartersStockList = function(){
        	return getGoodsHeadquartersStockListUrl;
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
        factory.setData = function(da){
        	data = da;
        };
        factory.getData = function(){
        	return data;
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