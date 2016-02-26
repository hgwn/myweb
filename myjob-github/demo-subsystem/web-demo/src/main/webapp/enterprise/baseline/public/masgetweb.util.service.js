angular.module('masgetweb.util.Service',[])
    .factory('masgetwebUtilService',['$http',function($http){
        var factory = {};
        
        var queryCategoryUrl = '/jsbweb/enterprise/category/find_category.do';
        var queryGoodsUrl = '/jsbweb/enterprise/baseline/product/getgoods_list.do';
        var addWarehouseinUrl = '/jsbweb/enterprise/baseline/warehousein/add.do';
        
        factory.getQueryCategoryUrl = function(){
        	return queryCategoryUrl;
        }

        factory.getQueryGoodsUrl = function(){
        	return queryGoodsUrl;
        }
        
        factory.getAddWarehouseinUrl = function(){
        	return addWarehouseinUrl;
        }
        
        //回调方式通过get方法获取数据
        factory.httpGet = function (url, callback) {
            $http.get(url).then(function (resp) {
                callback(resp.data);
            });
        };
        //回调方式通过post方法获取数据
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
        
        factory.getOrderNum = function(ordertypeid,callback, errorback){
        	if(undefined == ordertypeid || ""==ordertypeid)
        	{
        		  console.error("订单类型不能为空！");
        		  return;
        	}
            var ordernumparam = {ordertypeid:ordertypeid};
            $http({
                method  : 'POST',
                url     : '/jsbweb/orderNum/get.do',
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