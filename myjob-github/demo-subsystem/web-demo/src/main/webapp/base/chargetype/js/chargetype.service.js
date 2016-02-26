angular.module('masgetWebApp.chargetype.service', [

])

// A RESTful factory for retrieving contacts from 'contacts.json'
    .factory('example', ['$http', 'utils', function ($http, utils,$timeout) {
        var factory = {};
        factory.getChargeType = function () {
            return utils.query('/jsbweb/chargeType/getbase.do').then(function (resp) {
                return resp.data.rows;
            });
        };
        
        factory.getSession = function(){
        	return utils.query("/jsbweb/base/getSession.do").then(function (resp) {
                return resp;
            });
        }
        return factory;
    }])


