angular.module('masgetWebApp.find.service', [

])

.factory('find', ['$http', 'utils', function ($http, utils) {
  var factory = {};
  factory.all = function () {
    return [];
  };

  return factory;
}]);
