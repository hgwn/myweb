angular.module('masgetWebApp.osroleresource.service', [

])

// A RESTful factory for retrieving contacts from 'contacts.json'
    .factory('example', ['$http', 'utils', function ($http, utils,$timeout) {
        var factory = {};
        factory.getRoletype = function () {
            return utils.query("/jsbweb/base/companystaff/getcompanyroletype.do").then(function (resp) {
                return resp.data.rows;
            });
        };
        
        factory.getCompanytype = function () {
            return utils.query("/jsbweb/commonUtils.do?type=companytype").then(function (resp) {
                return resp.data.rows;
            });
        };
        
        return factory;
    }])


