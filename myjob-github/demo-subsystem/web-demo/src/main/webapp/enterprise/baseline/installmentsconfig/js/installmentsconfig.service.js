angular.module('installmentsconfig.Service',[])
    .factory('installmentsconfigService',['$http',function($http){
        var factory = {};
        var getSessionUrl = '/jsbweb/base/getSession.do'; 
        var getInstallmentsconfigUrl = '/jsbweb/enterprise/installmentsconfig/getInstallmentsconfig.do';
        var addInstallmentsconfigUrl = '/jsbweb/enterprise/installmentsconfig/addInstallmentsconfig.do';
        var modifyInstallmentsconfigUrl = '/jsbweb/enterprise/installmentsconfig/modifyInstallmentsconfig.do'
        
    	factory.getModifyInstallmentsconfigUrl = function(){
        	return modifyInstallmentsconfigUrl;
        };
    	factory.getAddInstallmentsconfig = function(){
        	return addInstallmentsconfigUrl;
        };
        factory.getInstallmentsconfig = function(){
        	return getInstallmentsconfigUrl;
        };
        factory.getAddressgroupconfig = function(){
        	return getAddressgroupconfigUrl;
        };
        factory.getSession = function(){
        	return getSessionUrl;
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