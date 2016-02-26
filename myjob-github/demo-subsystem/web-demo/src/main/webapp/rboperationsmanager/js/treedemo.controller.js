
/*
* 配置菜单管理控制器
* */
operationsModule.controller("treedemoCtr",['$scope','$rootScope','$http','$state','operationsmanagerService',function($scope,$rootScope,$http,$state,operationsmanagerService){

	//定义查询未配置菜单表单对象
	$scope.tempData = $rootScope.tempData;
	$scope.sedData= angular.copy($rootScope.tempData);
	$scope.remove = function (scope) {
		scope.remove();
	};

	$scope.toggle = function (scope) {
		scope.toggle();
	};

	$scope.newSubItem = function (scope) {
		var nodeData = scope.$modelValue;
		nodeData.nodes.push({
			id: nodeData.id * 10 + nodeData.nodes.length,
			title: nodeData.title + '.' + (nodeData.nodes.length + 1),
			nodes: []
		});
	};

	$scope.tree1=[];
	$scope.tree2=[];

	//获取角色菜单资源函数
	$scope.getosroleresource=function(){
		/*var url = operationsmanagerService.getosroleresourceUrl();
		//var data={osenvirnmentid: 1, companytypeid: 2000, roletypeid: 1};
		var data=$rootScope.tempData;
		if(!data) return;
		console.log(".....000参数...");
		console.log(data);
		operationsmanagerService.httpPost(url,data,function(data){
			console.log("获取角色菜单资源函数....");
			console.log(data);
			if(data.ret==0){
				$scope.tree1=data.data[0].rows;
				angular.forEach(data.data[0].overage_resource,function(value,key){
					//console.log(key+":"+value);
					value.children=[];
				});
				$scope.tree2=data.data[0].overage_resource;
				console.log($scope.tree2)
			}
		})*/
		$http.get("json/uitree.json").success(function(data){
			console.log(data);
			$scope.tree1=data.data[0].rows;
			angular.forEach(data.data[0].overage_resource,function(value,key){
				//console.log(key+":"+value);
				value.children=[];
			});
			$scope.tree2=data.data[0].overage_resource;
		});
	}
	//调用获取角色菜单资源函数
	//$scope.getosroleresource();
	//返回上一步函数
	$scope.tobackBtn=function(){
		$state.go("operation");
	}
	//刷新
	$scope.reflash=function(){
		var url = operationsmanagerService.getosroleresourceUrl();
		operationsmanagerService.httpPost(url,$scope.tempData,function(data){
			if(data.ret==0){
				$scope.tree1=data.data[0].rows;
				angular.forEach(data.data[0].overage_resource,function(value,key){
					value.children=[];
				});
				$scope.tree2=data.data[0].overage_resource;
			}
		})
	}

	//查询未配置菜单函数
	$scope.searchResourc=function(){
		console.log($scope.tempData);
		var url=operationsmanagerService.getoverageUrl();
		operationsmanagerService.httpPost(url,$scope.tempData,function(data){
			angular.forEach(data.data,function(value,key){
				value.children=[];
			});
			$scope.tree2=data.data;
		});
	}

	$scope.enter=function(e){
		if (e.keyCode !== 13) return;
		$scope.searchResourc();
	}

	$scope.treedatasubmit=function(){
		/*var url=operationsmanagerService.getosroleresourcesetUrl();
		var treedata=$scope.sedData;
		treedata.roleresource=$scope.tree1;
		console.log(treedata);
		var data={data:JSON.stringify(treedata)};
		operationsmanagerService.httpPost(url,data,function(data){
			console.log(data);
			if(data.ret==0){
				$.jBox.tip("菜单配置成功！","success");
				$scope.searchResourc();
			}
		});*/
	}

	$scope.tree1 = [{
		'id': 1,
		'title': 'tree1 - item1',
		'nodes': []
	}, {
		'id': 2,
		'title': 'tree1 - item2',
		'nodes': []
	}, {
		'id': 3,
		'title': 'tree1 - item3',
		'nodes': []
	}, {
		'id': 4,
		'title': 'tree1 - item4',
		'nodes': []
	}];
	$scope.tree2 = [{
		'id': 1,
		'title': 'tree2 - item1',
		'nodes': []
	}, {
		'id': 2,
		'title': 'tree2 - item2',
		'nodes': []
	}, {
		'id': 3,
		'title': 'tree2 - item3',
		'nodes': []
	}, {
		'id': 4,
		'title': 'tree2 - item4',
		'nodes': []
	}];
}])