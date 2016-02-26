angular.module('goodsSuplierRelation.Service',[])
    .factory('goodsSuplierRelationService',['$http',function($http){
        var factory = {};
        var getCompanyGoodsClassifyUrl = '/jsbweb/enterprise/goodsclassify/get.do';
        var getAllSuppliersUrl = '/jsbweb/enterprise/commodity/suppliersGetAll.do';
        var getGoodsByClassifyUrl = '/jsbweb/enterprise/goodssupplierrelation/getgoods_by_classify.do'; 
        var addSupplierGoodsUrl = '/jsbweb/enterprise/goodssupplierrelation/addSupplierGoods.do';
        var updateSupplierGoodsUrl = '/jsbweb/enterprise/goodssupplierrelation/updateSupplierGoods.do';
        var deleteSupplierGoodsUrl = '/jsbweb/enterprise/goodssupplierrelation/deleteSupplierGoods.do';
        //商品分类数组
        var additionGoodsClassifyLists = [];
        
        factory.getDeleteSupplierGoodsUrl = function(){
        	return deleteSupplierGoodsUrl;
        };
        factory.getUpdateSupplierGoodsUrl = function(){
        	return updateSupplierGoodsUrl;
        };
        factory.getAddSupplierGoodsUrl = function(){
        	return addSupplierGoodsUrl;
        };
        factory.getGetGoodsByClassifyUrl = function(){
        	return getGoodsByClassifyUrl;
        };
        factory.getGetAllSuppliers = function(){
        	return getAllSuppliersUrl;
        };
        factory.getGetCompanyGoodsClassifyUrl = function(){
        	return getCompanyGoodsClassifyUrl;
        };       
        
        factory.setAdditionGoodsClassifyLists = function(array){
        	additionGoodsClassifyLists = array;
        };
        factory.getAdditionGoodsClassifyLists = function(){
        	return additionGoodsClassifyLists;
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
        //获取省市县数据
        factory.getPCA = function(data, callback, errorback){
            //?type=district&provinceid=
            data.type = "district";
            $http({
                method  : 'POST',
                url     : '/jsbweb/commonUtils.do',
                data    : $.param(data),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data) {
                if (data.ret == 0) {
                    callback(data);
                }else{
                    errorback(data);
                }
            }).error(function(resp){
                console.log(resp)
                errorback(resp);
            });
        };
        return factory;
    }]);