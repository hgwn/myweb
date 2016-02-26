angular.module('commodity.Service',[])
    .factory('commodityService',['$http',function($http){
        var factory = {};
        var commodityListUrl = '/jsbweb/enterprise/commodity.do';
        var commoditySearchListUrl = '/jsbweb/enterprise/commodity/list.do';
        var merchantUrl = '/jsbweb/enterprise/commodity/merchant.do';
        var commodityListDetailUrl = '/jsbweb/enterprise/commodity/list_detail.do';
        var commodityGoodsSkuUrl = '/jsbweb/enterprise/commodity/get_goods_sku.do';
        var getSessionUrl = '/jsbweb/base/getSession.do';
        var addGoodscartUrl = '/jsbweb/enterprise/commodity/addgoodscart.do';
        var getGoodscartUrl = '/jsbweb/enterprise/commodity/getgoodscart.do';
        var deleteGoodscartUrl = '/jsbweb/enterprise/commodity/deletegoodscart.do';
        var getordernumUrl = '/jsbweb/enterprise/commodity/getordernum.do';
        var getdistrict = '/jsbweb/enterprise/commodity/getdistrict.do';
        var addpurchaseorderbycart = '/jsbweb/enterprise/commodity/addpurchaseorderbycart.do'
        var suppliersGetAllUrl = '/jsbweb/enterprise/commodity/suppliersGetAll.do';
        var modifyGoodscartsUrl = '/jsbweb/enterprise/commodity/modifyGoodscarts.do';
        //回调方式通过get方法获取数据
        factory.httpGet = function (url, callback) {
            $http.get(url).then(function (resp) {
                callback(resp.data);
            });
        };
        factory.getModifyGoodscartsUrl = function(){
        	return modifyGoodscartsUrl;
        };
        factory.getSuppliersGetAllUrl = function(){
        	return suppliersGetAllUrl;
        };
        factory.getAddpurchaseorderbycart = function(){
        	return addpurchaseorderbycart;
        };
        factory.getDistrictUrl = function(){
            return getdistrict;
        };
        factory.getOrderNumUrl = function(){
            return getordernumUrl;
        };
        factory.getDeleteGoodscartUrl = function(){
        	return deleteGoodscartUrl;
        };
        factory.getGetGoodsCartUrl = function(){
            return getGoodscartUrl;
        };
        factory.getAddGoodscartUrl=function(){
        	return addGoodscartUrl;
        };
        factory.getGetSessionUrl = function(){
        	return getSessionUrl;
        };
        factory.getCommodityListUrl = function(){
            return commodityListUrl;
        };
        factory.getCommodityListDetailUrl = function(){
            return commodityListDetailUrl;
        };
        factory.getCommoditySearchListUrl = function(){
            return commoditySearchListUrl;
        };
        factory.getMerchantUrl = function(){
            return merchantUrl;
        };
        factory.getCommodityGoodsSkuUrl = function(){
            return commodityGoodsSkuUrl;
        };
        factory.parseUrl=function(){
     	   var path = window.location.href.split("?");
    	   return path[1].split("#")[0].split("=");
        };
        //商品属性中被顾客选中某一属性则更换特殊样式,则同类的其它属性样式恢复原貌
        factory.selectedClick = function(item,items){
            if(item.cssFlag){
                items.selectedFlag = false;
                item.cssFlag = false;
            }else{
                angular.forEach(items.properties,function(data,index,array){
                    items.properties[index].cssFlag = false;
                });
                items.selectedFlag = true;
                item.cssFlag = true;
            }
        };
        return factory;
    }]);