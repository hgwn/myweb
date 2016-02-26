angular.module('category.Service',[])
    .factory('categoryService',['$http',function($http){
        var factory = {};
        var getCategoryUrl = '/jsbweb/enterprise/category/find_category.do';
        var addCategoryUrl = '/jsbweb/enterprise/category/add_category.do';
        var editCategoryUrl = '/jsbweb/enterprise/category/modify_category.do';
        var deleteCategoryByIdUrl = '/jsbweb/enterprise/category/del_category.do';
        
        factory.deleteCategoryByIdUrl = function(){
        	return deleteCategoryByIdUrl;
        }
        factory.editCategoryUrl = function(){
        	return editCategoryUrl;
        };
        factory.addCategoryUrl = function(){
        	return addCategoryUrl;
        };
        factory.getCategoryUrl = function(){
        	return getCategoryUrl;
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