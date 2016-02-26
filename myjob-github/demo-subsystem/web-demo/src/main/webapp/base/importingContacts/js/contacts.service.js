angular.module('masgetWebApp.contacts.service', [

])

// A RESTful factory for retrieving contacts from 'contacts.json'
    .factory('example', ['$http', 'utils', function ($http, utils,$timeout) {
        var factory = {};
        
        factory.getGroup = function () {
            return utils.query("/jsbweb/contacts.do?type=group.get").then(function (resp) {
                return resp.data.rows;
            });
        };

        factory.getSession = function(){
        	return utils.query("/jsbweb/base/getSession.do").then(function (resp) {
                return resp;
            });;
        }
        return factory;
    }])


