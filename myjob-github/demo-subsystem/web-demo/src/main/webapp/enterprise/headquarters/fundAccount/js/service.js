angular.module('masgetWebApp.Faccount.service', [

])

// A RESTful factory for retrieving contacts from 'contacts.json'
    .factory('FaccountUtils', ['$http', 'utils','$q', function ($http, utils,$qa) {
        var factory = {};
        //factory.getWalletget = function () {
        //    return utils.query('/jsbweb/enterprise/PrepaymentManagement/walletget.do').then(function (resp) {
        //        return resp.data.rows;
        //    });
        //};
        factory.getSession = function(){
            return utils.query("/jsbweb/base/getSession.do").then(function (resp) {
                return resp;
            });
        }
        return factory;
        
    }])


