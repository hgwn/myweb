angular.module('masgetWebApp.leagueapply.service', [

])

// A RESTful factory for retrieving contacts from 'contacts.json'
    .factory('example', ['$http', 'utils', function ($http, utils,$timeout) {
        var factory = {};
        factory.getSession = function () {
            return utils.query("/jsbweb/base/getSession.do").then(function (resp) {
                return resp;
            });
        };

        factory.getStation = function () {
            return utils.query("/jsbweb/base/stationdatum/getCompetenceStation.do").then(function (resp) {
                return resp.data.rows;
            });
        };

        factory.getPlatform = function () {
            return utils.query("/jsbweb/base/platform/get.do?data={}").then(function (resp) {
                return resp.data.rows;
            });
        };

        factory.getSceneData = function () {
            return utils.query("/jsbweb/contacts.do?type=group.getbyscenetype&&scenetypeid=3").then(function (resp) {
                return resp.data.rows;
            });
        };

        return factory;
    }])


