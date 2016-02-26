angular.module('masgetWebApp.goodsAdd.service', [

])

// A RESTful factory for retrieving contacts from 'contacts.json'
    .factory('buzcircle', ['$http', 'utils', function ($http, utils) {
        var path = '/jsbweb/buzCircle.do?type=get';
        var buzcircle = utils.query(path).then(function (resp) {
            return resp.data.rows;
        });

        var factory = {};
        factory.all = function () {
            return buzcircle;
        };
        factory.get = function (id) {
           return find.then(function(){
             return utils.findById(find, id);
           })
        };
        return factory;
    }]);
