app = angular.module('app', ['util.selectAddress']);
app.controller('pcaController', ["$scope",function ($scope) {
	$scope.formData={};
    $scope.formData.provinceid = 19;
    $scope.formData.cityid = 197;
}]);
