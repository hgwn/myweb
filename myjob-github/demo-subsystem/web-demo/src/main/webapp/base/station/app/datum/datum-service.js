angular.module('masgetWebApp.datum.service', [

])

// A RESTful factory for retrieving contacts from 'contacts.json'
    .factory('example', ['$http', 'utils', function ($http, utils,$timeout) {
        var path = '/jsbweb/base/stationdatum/stationtype.do';
        var stationtype = utils.query(path).then(function (resp) {
            return resp.result.rows;
        });
        
        var path = '/jsbweb/base/stationdatum/getcompanyrelation.do';
        var companyData = utils.query(path).then(function (resp) {
            return resp.result.rows;
        });
        
        
        var factory = {};
//        factory.all = function () {
//            return contracts;
//        };
//
        factory.getCompanyData = function () {
            return companyData;
        };
        
        factory.getStationtype = function () {
            return stationtype;
        };
        
        factory.getfindById = function(){
        	return {
                findById: function findById(a, key,value) {
                    for (var i = 0; i < a.length; i++) {
                        if (a[i][key] == value) return a[i];
                    }
                    return null;
                },
                id:123456
            };
        }
        factory.getSession = function(){
            return utils.query("/jsbweb/base/getSession.do").then(function (resp) {
                return resp;
            });
        }
        return factory;
    }])


