angular.module('goodsstockcheck.Service',[])
    .factory('goodsstockcheckService',['$http',function($http){
        var factory = {};
        
        var getGoodsStockListUrl = '/jsbweb/enterprise/goodsstockcheck/getGoodsStockList.do';
        
        var getGoodsStockCheckListUrl = '/jsbweb/enterprise/goodsstockcheck/getGoodsStockCheckList.do';
        
        var addGoodsStockCheckListUrl = '/jsbweb/enterprise/goodsstockcheck/addGoodsStockCheckList.do';
        
        factory.getGoodsStockList = function(){
        	return getGoodsStockListUrl;
        };
        factory.getGoodsStockCheckList = function(){
        	return getGoodsStockCheckListUrl;
        };
        factory.addGoodsStockCheckList = function(){
        	return addGoodsStockCheckListUrl;
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