/*======================================
 * 菜单管理页面控制器 operationsController
 * =======================================
 * */
operationsModule.controller("operationsController",['$scope','$http','$state','$rootScope','operationsmanagerService',function($scope,$http,$state,$rootScope,operationsmanagerService){
	//定义表单对象
	$scope.formData = {};
	$scope.osenvinrmentFormData = {};
	$scope.osenvinrmentFormData.osenvinrmentData=[];
	//$scope.formData.osenvirnmentid=1;//设置默认选择pc
	$scope.companytypeFormData = {};
	$scope.companytypeFormData.companytypeData = [];
	//$scope.formData.companytypeid =2002;//物理管理方id
	$scope.roletypeFormData = {};
	$scope.roletypeFormData.roletypeData=[];
	//初始化函数
	$scope.init=function(){
		//调用获取系统环境数据
		$scope.getosenvinrmentData();
		//调用获取公司类型数据
		$scope.getcompanytypetData();
		//调用获取角色类型数据
		$scope.getroletype();
	}

	//获取系统环境数据
	$scope.getosenvinrmentData=function(){
		var url =operationsmanagerService.getosenvinrmentUrl();
		operationsmanagerService.httpGet(url,function(data){
			if(data.ret==0){
				$scope.osenvinrmentFormData.osenvinrmentData=data.data.rows;
			}
		})
	};

	//获取公司类型数据
	$scope.getcompanytypetData=function(){
		var url =operationsmanagerService.getcompanytypeUrl();
		operationsmanagerService.httpGet(url,function(data){
			if(data.ret==0){
				$scope.companytypeFormData.companytypeData=data.data.rows;
			}
			else{
				console.log(data);
			}
		})
	};

	//获取角色类型数据
	$scope.getroletype=function(){
		var url = operationsmanagerService.getroletypeUrl();
		operationsmanagerService.httpGet(url,function(data){
			console.log(data);
			if(data.ret==0){
				$scope.roletypeFormData.roletypeData = data.data.rows;
			}
		});
	}

	$rootScope.tempData=[];
	$scope.gotoNest=function(){
		if($scope.formData.osenvirnmentid==undefined||$scope.formData.osenvirnmentid==""){
			$.jBox.tip( "请选择系统环境" , 'warning');
			return;
		}
		if($scope.formData.companytypeid==undefined||$scope.formData.companytypeid==""){
			$.jBox.tip( "请选择公司类型" , 'warning');
			return;
		}
		if($scope.formData.roletypeid==undefined||$scope.formData.roletypeid==""){
			$.jBox.tip( "请选择角色" , 'warning');
			return;
		}
		$rootScope.tempData=$scope.formData;
		$state.go("osroleresource");
		console.log("..1111...");
		console.warn($rootScope.tempData);
	}

	//调用初始化函数
	$scope.init();
}]);

/*
* 配置菜单管理控制器
* */
operationsModule.controller("ConnectedTreesCtrl",['$scope','$rootScope','$http','$state','operationsmanagerService',function($scope,$rootScope,$http,$state,operationsmanagerService){

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
		var url = operationsmanagerService.getosroleresourceUrl();
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
		})
	}
	//调用获取角色菜单资源函数
	$scope.getosroleresource();
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
		var url=operationsmanagerService.getosroleresourcesetUrl();
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
		});
	}

}])