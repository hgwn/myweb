angular.module('contractorInfo.Service',[])
    .factory('contractorInfoService',['$http',function($http){
        var factory = {};
        var getAddressgroupconfigUrl = '/jsbweb/enterprise/addressgroupconfig/getAddressgroupconfig.do';
        var addAddressgroupconfigUrl = '/jsbweb/enterprise/addressgroupconfig/addAddressgroupconfig.do';
        var getdistrict = '/jsbweb/enterprise/commodity/getdistrict.do';
        var regSubcompanyUrl = '/jsbweb/enterprise/contactor/regSubcompany.do';
        var getSubcompanyUrl = '/jsbweb/enterprise/contactor/getSubcompany.do';
        var modifySubcompanyUrl = '/jsbweb/enterprise/contactor/modifySubcompany.do';
        var getAddressmanageUrl = '/jsbweb/base/addressManage/getAddressManage.do';
        
        factory.getAddressmanage = function(){
        	return getAddressmanageUrl;
        };
        factory.getModifySubcompany = function(){
        	return modifySubcompanyUrl;
        };
        factory.getSubcompany = function(){
        	return getSubcompanyUrl;
        };
        factory.getRegSubcompanyUrl = function(){
        	return regSubcompanyUrl;
        };
        factory.getDistrictUrl = function(){
            return getdistrict;
        };
        factory.getAddAddressgroupconfigUrl = function(){
        	return addAddressgroupconfigUrl;
        };
        factory.getAddressgroupconfig = function(){
        	return getAddressgroupconfigUrl;
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