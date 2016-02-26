angular.module('purchaseOrders.Service',[])
    .factory('purchaseOrdersService',['$http',function($http){
        var factory = {};
        var payData = {};
        //var allSuppliersUrl = '/jsbweb/enterprise/commodity/suppliersGetAll.do';
        var allReverseSuppliersUrl = '/jsbweb/companyrelation/reverse/get.do';
        var allSuppliersUrl = '/jsbweb/companyrelation/get.do';
        var goodsListUrl = '/jsbweb/enterprise/goods/goodsList.do';
        var internalPurchaseordersUrl = '/jsbweb/enterprise/purchaseorders/getInternalPurchaseorders.do';
        var modifyPurchaseOrdersUrl = '/jsbweb/enterprise/purchaseorders/modifyPurchaseOrders.do';
        var auditInternalPurchaseordersUrl = '/jsbweb/enterprise/purchaseorders/auditInternalPurchaseorders.do';
        var cancelPurchaseordersUrl = '/jsbweb/enterprise/purchaseorders/cancelPurchaseorders.do';
        var getExternalPurchaseordersUrl ="/jsbweb/enterprise/purchaseorders/getExternalPurchaseorders.do"
        var auditExternalPurchaseordersUrl ="/jsbweb/enterprise/purchaseorders/auditExternalPurchaseorders.do";
        var acceptExternalPurchaseordersUrl = '/jsbweb/enterprise/purchaseorders/acceptExternalPurchaseorders.do';
        var addAddressManageUrl = '/jsbweb/base/addressManage/addAddressManage.do';
        var getAddressManageUrl = '/jsbweb/base/addressManage/getAddressManage.do';
        var deleteAddressManageUrl = '/jsbweb/base/addressManage/deleteAddressManage.do';
        var modifyAddressManageUrl = '/jsbweb/base/addressManage/modifyAddressManage.do';
        var paidOrdersUrl = '/jsbweb/enterprise/headquartersorders/paidOrders.do';
        var getSessionUrl = '/jsbweb/base/getSession.do'; 
        
        factory.getSession = function(){
        	return getSessionUrl;
        };
        factory.paidOrders = function(){
        	return paidOrdersUrl;
        };
        factory.modifyAddressManage = function(){
        	return modifyAddressManageUrl;
        };
        factory.deleteAddressManage = function(){
        	return deleteAddressManageUrl;
        };
        factory.getAddressManage = function(){
        	return getAddressManageUrl;
        };
        factory.addAddressManage = function(){
        	return addAddressManageUrl;
        };
        factory.acceptExternalPurchaseorders = function(){
        	return acceptExternalPurchaseordersUrl;
        };
        factory.auditExternalPurchaseorders = function(){
        	return auditExternalPurchaseordersUrl;
        };
        factory.getExternalPurchaseordersUrl = function(){
        	return getExternalPurchaseordersUrl;
        };	
        factory.cancelPurchaseorders = function(){
        	return cancelPurchaseordersUrl;
        };
        factory.auditInternalPurchaseorders = function(){
        	return auditInternalPurchaseordersUrl;
        };
        factory.getModifyPurchaseOrders = function(){
        	return modifyPurchaseOrdersUrl;
        };
        factory.getInternalPurchaseorders = function(){
        	return internalPurchaseordersUrl;
        };
        factory.getAllReverseSuppliers = function(){
        	return allReverseSuppliersUrl;
        };
        factory.getAllSuppliers = function(){
        	return allSuppliersUrl;
        };
        factory.getGoodsList = function(){
        	return goodsListUrl;
        }; 
        factory.setPayData = function(data){
        	payData = data;
        };
        factory.getPayData = function(){
        	return payData;
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