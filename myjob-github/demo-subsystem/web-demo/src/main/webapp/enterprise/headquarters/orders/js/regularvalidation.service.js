angular.module('regularValidation.Service',[])
    .factory('regularValidationService',['$http',function($http){
        var factory = {};
        var regNum = new RegExp("^[0-9]*$");
        var regPhoneNum = new RegExp("^((13[0-9])|(15[^4,\\D])|(18[0,5-9]))\\d{8}$");
        //验证只能为数字
        factory.testNumber = function(value){
        	return regNum.test(value);
        };
        factory.testPhoneNum = function(value){
        	return regPhoneNum.test(value);
        };
        return factory;
    }]);