var app=angular.module("app",["util.pagination"]);
app.controller("paginationController",["$scope",function($scope){
    //初始化条数目为123
    $scope.recordCount='123';
    $scope.formData={};
    $scope.formData.pagesize=10;
    $scope.query=function(){
        console.info("查询-参数pagenum："+$scope.formData.pagenum+"，pagesize："+$scope.formData.pagesize);
    }
}]);

