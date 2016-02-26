angular.module('masgetWebApp.warehouseinService',[])
    .factory('warehouseinService',['$http',function($http){
        var factory = {};
        var data = {};
        var queryWarehouseinUrl = '/jsbweb/enterprise/baseline/warehousein/get.do';
        var queryCategoryUrl = '/jsbweb/enterprise/category/find_category.do';
        var goodsUrl = '/jsbweb/enterprise/baseline/goods/get.do';
        var allReverseSuppliersUrl = '/jsbweb/companyrelation/reverse/get.do';
        var addWarehouseinUrl = '/jsbweb/enterprise/baseline/warehousein/addWarehousein.do' 
        var auditWarehouseInUrl = '/jsbweb/enterprise/baseline/warehousein/auditWarehousein.do';
        	
        factory.getAuditWarehousein = function(){
            return auditWarehouseInUrl;
        };
        factory.getAddWarehouseinUrl = function(){
        	return addWarehouseinUrl;
        };
        factory.getAllReverseSuppliers = function(){
        	return allReverseSuppliersUrl;
        };
        factory.getQueryWarehouseinUrl = function(){
        	return queryWarehouseinUrl;
        };
        factory.getQueryCategoryUrl = function(){
        	return queryCategoryUrl;
        }
        factory.getGoodsUrl = function(action){
        	return '/jsbweb/enterprise/baseline/goods/'+ action +'.do';
        }
        factory.setData = function(entity){
        	data = entity;
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
        
        factory.httpPost = function (url, params, callback){
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