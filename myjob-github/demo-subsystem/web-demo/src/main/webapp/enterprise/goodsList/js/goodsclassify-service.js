angular.module('goodsClassify.Service',[])
    .factory('goodsClassifyService',['$http',function($http){
        var factory = {};
        var getCompanyGoodsClassifyUrl = '/jsbweb/enterprise/goodsclassify/get.do';
        var getSessionUrl = '/jsbweb/base/getSession.do';
        var addCompanyGoodsClassifyUrl = '/jsbweb/enterprise/goodsclassify/addCompanyGoodsClassify.do';
        var editCompanyGoodsClassifyUrl = '/jsbweb/enterprise/goodsclassify/editCompanyGoodsClassify.do';
        var deleteCompanyGoodsClassifyByIdUrl = '/jsbweb/enterprise/goodsclassify/deleteCompanyGoodsClassifyById.do';
        
        factory.getDeleteCompanyGoodsClassifyByIdUrl = function(){
        	return deleteCompanyGoodsClassifyByIdUrl;
        }
        factory.getEditCompanyGoodsClassifyUrl = function(){
        	return editCompanyGoodsClassifyUrl;
        };
        factory.getAddCompanyGoodsClassifyUrl = function(){
        	return addCompanyGoodsClassifyUrl;
        };
        factory.getGetSessionUrl = function(){
        	return getSessionUrl;
        };
        factory.getGetCompanyGoodsClassifyUrl = function(){
        	return getCompanyGoodsClassifyUrl;
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