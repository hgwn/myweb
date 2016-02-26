angular.module('addressgroupconfig.Service',[])
    .factory('addressGroupConfigService',['$http',function($http){
        var factory = {};
        var getSessionUrl = '/jsbweb/base/getSession.do'; 
        var getAddressgroupconfigUrl = '/jsbweb/enterprise/addressgroupconfig/getAddressgroupconfig.do';
        var modifyAddressgroupconfigUrl = '/jsbweb/enterprise/addressgroupconfig/modifyAddressgroupconfig.do';
        var addAddressgroupconfigUrl = '/jsbweb/enterprise/addressgroupconfig/addAddressgroupconfig.do';
        
        factory.getAddAddressgroupconfigUrl = function(){
        	return addAddressgroupconfigUrl;
        };
        factory.getModifyAddressgroupconfigUrl = function(){
        	return modifyAddressgroupconfigUrl;
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