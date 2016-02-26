angular.module('orderinstallments.Service',[])
    .factory('orderinstallmentsService',['$http',function($http){
        var factory = {};
        var data = {};
        var getSessionUrl = '/jsbweb/base/getSession.do'; 
        var getOrderinstallmentsUrl = "/jsbweb/enterprise/orderinstallments/getOrderinstallments.do";
        var auditOrderinstallmentsUrl = "/jsbweb/enterprise/orderinstallments/auditOrderinstallments.do";
        
        factory.auditOrderinstallments = function() {
        	return auditOrderinstallmentsUrl;
        };
        factory.getOrderinstallments = function (){
        	return getOrderinstallmentsUrl;
        };
        factory.getSession = function(){
        	return getSessionUrl;
        };
        factory.setData = function(entity){
        	data = entity;
        };
        factory.getData = function(){
        	return data;
        };
        //获取客户
        factory.getContact = function(data, callback){
        	var param = {};
        	param.companyname = data;
        	param.scenetypeid = 2;
        	param.pagenum = 1;
        	param.pagesize = 200;
            $http({
                method  : 'POST',
                url     : '/jsbweb/enterprise/commodity/suppliersGetAll.do',
                /*url     : '/jsbweb/base/contractorinfo/get.do',*/
                data    : $.param(param),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data) {
                console.log(data);
                if (data.ret == 0) {
                   callback(data.data, true)
                }
                else{
                    callback(data.message, false);
                }
            }).error(function(resp){
                console.log(resp)
                callback(resp.message, false)

            });
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