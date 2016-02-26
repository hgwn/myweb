angular.module('masgetWebApp.datum.service', [

])

// A RESTful factory for retrieving contacts from 'contacts.json'
    .factory('example', ['$http', 'utils', function ($http, utils,$timeout) {
        var factory = {};
        factory.getplData = function () {
            return utils.query('/jsbweb/base/stationdatum/plData.do').then(function (resp) {
                return resp.data.rows;
            });;
        };
        
        factory.getRoletype = function () {
            return utils.query('/jsbweb/base/companystaff/getcompanyroletype.do').then(function (resp) {
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


