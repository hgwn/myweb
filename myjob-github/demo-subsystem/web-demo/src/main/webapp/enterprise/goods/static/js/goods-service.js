angular.module('goods.Service',[])
.factory('goodsService',['$http',function($http){
	var factory = {};
	var goodsUrl = '/jsbweb/enterprise/goods.do';
	// var commoditySearchListUrl = '/jsbweb/enterprise/Commodity/list.do';
	// var commodityListDetailUrl = '../../com/assets/commodityDetail.json';
	//回调方式通过get方法获取数据
	factory.httpGet = function (url, callback) {
        $http.get(url).then(function (resp) {
            callback(resp.data);
        });
    };	
    factory.getGoodsUrl = function(){
    	return goodsUrl;
    };
    // factory.getCommodityListDetailUrl = function(){
    // 	return commodityListDetailUrl;
    // };
    // factory.getCommoditySearchListUrl = function(){
    // 	return commoditySearchListUrl;
    // };
    return factory;
}]);