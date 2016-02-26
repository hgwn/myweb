var app = angular.module("app", ["util.comboxtable"]);
app.controller("comboxtableController", ["$scope", "$http", function ($scope, $http) {
    $http.get("comrelation.json").success(function(data){
        $scope.datas=data;
        console.info(data);
    });
    
    $scope.formData={};
    
    $scope.query = function () {
    	$scope.formData.keyWord=$scope.formData.keyWord==null?"":$scope.formData.keyWord;
        console.info("查询-参数:keyWord:"+$scope.formData.keyWord+",pagesize:"+$scope.formData.pagesize+",pagenum:"+$scope.formData.pagenum);
    };
    $scope.station={};

    $scope.$watch("station",function(){
        console.info($scope.station);
        $scope.stationname=$scope.station.stationname;
    });
}]);

