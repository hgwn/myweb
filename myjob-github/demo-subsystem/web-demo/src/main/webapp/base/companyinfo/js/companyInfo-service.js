angular.module('masgetWebApp.companyInfo.service', [

])

// A RESTful factory for retrieving contacts from 'contacts.json'
    .factory('example', ['$http', 'utils', function ($http, utils,$timeout) {
        var factory = {};
        factory.getSession = function(){
        	return utils.query("/jsbweb/base/getSession.do").then(function (resp) {
                return resp;
            })
        }
        return factory;
    }])


