angular.module('attribute.Service',[])
    .factory('attributeService',['$http',function($http){
        var factory = {};
        var getAttributeUrl = '/jsbweb/enterprise/attribute/find_attribute.do';
        var addAttributeUrl = '/jsbweb/enterprise/attribute/add_attribute.do';
        var editAttributeUrl = '/jsbweb/enterprise/attribute/modify_attribute.do';
        var deleteAttributeByIdUrl = '/jsbweb/enterprise/attribute/del_attribute.do';
        
        factory.deleteAttributeByIdUrl = function(){
        	return deleteAttributeByIdUrl;
        }
        factory.editAttributeUrl = function(){
        	return editAttributeUrl;
        };
        factory.addAttributeUrl = function(){
        	return addAttributeUrl;
        };
        factory.getAttributeUrl = function(){
        	return getAttributeUrl;
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