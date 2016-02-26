var app=angular.module("app",["util.decimal"]);
app.controller("decimalController",["$scope",function($scope){
	//初始化
	$scope.text1=0; //可输入
	$scope.text2=12; //不可用
	$scope.text3=50; //只读
	$scope.text4=0; //可输入(保留1位小数)
	$scope.text5=0; //可输入(保留3位小数)
}]);

