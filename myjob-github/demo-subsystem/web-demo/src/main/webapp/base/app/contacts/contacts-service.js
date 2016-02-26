angular.module('masgetWebApp.contacts.service', [

])

    .factory('contacts', ['$http', 'utils', function ($http, utils) {
        var factory = {};
        factory.getGroup = function () {
            return utils.query("/jsbweb/contacts.do?type=group.get").then(function (resp) {
                return resp.data.rows;
            });
        };

        factory.getAll = function () {
            return utils.query("/jsbweb/contacts.do?type=getall").then(function (resp) {
                return resp.data.rows;
            });
        };

        factory.getRoletype = function () {
            return utils.query("/jsbweb/base/companystaff/getcompanyroletype.do").then(function (resp) {
                return resp.data.rows;
            });
        };

        factory.getorSession = function () {
            return utils.query("/jsbweb/base/getSession.do").then(function (resp) {
                return resp;
            });
        };

        factory.getPca = function () {
            return utils.query("/jsbweb/commonUtils.do?type=district_NOS").then(function (resp) {
                return [{provincename:'未选择'}].concat(resp.data.rows);
            });
        };

//        factory.getContactsData = function () {
//            return utils.query("/jsbweb/base/companystaff/getcompanystaff.do").then(function (resp) {
//                return resp.data.rows;
//            });
//        };

        factory.getStationtype = function () {
            return utils.query('/jsbweb/base/stationdatum/stationtype.do').then(function (resp) {
                return resp.result.rows;
            });
        };

        return factory;
    }]);
