angular.module('masgetWebApp.goodsClassify')
.controller('goodsClassifyController',['$scope','$rootScope','$http','goodsClassifyService','$alert','$state','utils','uiGridTreeViewConstants','i18nService',
function($scope,$rootScope,$http,goodsClassifyService,$alert,$state,utils,uiGridTreeViewConstants,i18nService){
	i18nService.setCurrentLang('zh-cn');
	//模态窗口标题
	$scope.mdalTitle = '';
	//下拉列表展示商品分类信息
	$scope.goodsClassifyLists = [];
	$scope.additionGoodsClassifyLists = [];
	
	//ui-grid of Tree View
	$scope.gridOptions = {
	      enableSorting: true,
	      enableFiltering: true,
	      showTreeExpandNoChildren: true,
	      enableColumnMenus: false,
          enableRowSelection: true,
          enableSelectAll: true,
	      columnDefs: [
	      { name: '商品分类名称', field:'companygoodsclassifyname' },
	      { name: '关键字', field: 'keywords' },
	      { name: '操作', field: 'action', width: '10%', enableFiltering: false,
    	    cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">' +
            '<a href="#" class="" ng-click="grid.appScope.alertEdit(grid,row.entity)" title="修改"><span class="glyphicon glyphicon-pencil"></span></a>&nbsp;&nbsp;' +
            '<a href="#" class="" ng-click="grid.appScope.deleteClassify(grid,row.entity)" title="删除"><span class="glyphicon glyphicon-trash"></span></a>' +
            '</div>'}],
	      onRegisterApi: function( gridApi ) {
	          $scope.gridApi = gridApi;
	          //无子节点的节点也显示'展开图标'
	          $scope.gridOptions.showTreeExpandNoChildren = true;
//	          $scope.gridApi.grid.refresh();
	      }
	};
	//判断节点是否含有子节点
	function hasChildNodes(companygoodsclassifyid,arr,level){
		angular.forEach($scope.copyData,function(data,index,array){
			//判断节点的companygoodsclassifyid是否为其它节点的父节点,是则继续递归
			if(companygoodsclassifyid == data.parentid){ 
				//一级节点设置$$treeLevel为0,二级节点设置为1,以此类推
				data.$$treeLevel = parseInt(level)+1;
				$scope.gridOptions.data.push(data);
				hasChildNodes(data.companygoodsclassifyid,$scope.gridOptions.data,data.$$treeLevel);
			}
		});
	}
	//商品分类信息首页展示
	$scope.searchGoodsClassify = function(){
	    var url = goodsClassifyService.getGetCompanyGoodsClassifyUrl()+"?parentid=";
		goodsClassifyService.httpGet(url,function(data){
			if(data.ret == 0){
				//给商品分类增加一个默认分类
				$scope.newObject = {
						parentid:0,
						companygoodsclassifyid:0,
						companygoodsclassifyname:'(空)'
				};
				$scope.goodsClassifyLists = angular.copy(data.data.rows);
				$scope.goodsClassifyLists.push($scope.newObject);
				
				//ui-grid表格所需数据，格式为数组
				$scope.copyData = angular.copy(data.data.rows);
				$scope.gridOptions.data = [];
				//获取所有的一级节点
				angular.forEach($scope.copyData,function(data,index,array){
					if(data.parentid == 0){
						//一级节点设置$$treeLevel为0,二级节点设置为1,以此类推
						data.$$treeLevel = 0;
						$scope.gridOptions.data.push(data);
						hasChildNodes(data.companygoodsclassifyid,$scope.gridOptions.data,data.$$treeLevel);
					}
				});
			}else{
				$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
			}
		});	
	};
	//首次加载页面调用查询商品分类信息
	$scope.searchGoodsClassify();
	
	//给弹窗的商品分类信息下拉列表进行排序整理
	$scope.sortGoodsClassify = function(){
		var classify = utils.arrayDataToTree($scope.goodsClassifyLists,'companygoodsclassifyid', 'parentid', "0", 0);
		var array = [];
		function text(classify){
			for(var i=0; i<classify.length;i++){
				var a = classify[i];
				array.push({companygoodsclassifyname:getspace(a.level) + a.companygoodsclassifyname,companygoodsclassifyid:a.companygoodsclassifyid});
				if(a.nodes && a.nodes.length>0)
				{
					text(a.nodes);
				};
			}
		}
		function getspace(count){
			var space = '';
			while(count--){
				space += '--';
			}
			
			return space;
		}
		text(classify);
		$scope.additionGoodsClassifyLists  = array;
	};
	
	$scope.baseData = {};
	//修改商品分类信息弹窗窗口信息处理
	$scope.alertEdit = function(grid,myRow){
		//关闭商品分类名称表单验证提示
		$scope.goodsClassifyFrom.submitted = false;
        $scope.baseData.classifyData = angular.copy(myRow);
        $("#goodsClassifyModal").modal("show");
		$scope.mdalTitle = "编辑商品分类";
		$scope.submition = "确定修改";
		//操作标志赋值为'edit'
		$scope.operationFlag = 'edit';
		$scope.myForm = {};
		$scope.myForm.keywords = $scope.baseData.classifyData.keywords;
		$scope.myForm.companygoodsclassifyname = $scope.baseData.classifyData.companygoodsclassifyname;
		$scope.myForm.companygoodsclassifyid = $scope.baseData.classifyData.companygoodsclassifyid;
		$scope.myForm.description = $scope.baseData.classifyData.description;
		$scope.myForm.parentid = $scope.baseData.classifyData.parentid;
		$scope.sortGoodsClassify();
	};
	//添加商品分类信息弹窗窗口信息处理
	$scope.alertAddGoodsClassify = function(){
		//关闭商品分类名称表单验证提示
		$scope.goodsClassifyFrom.submitted = false;
		$scope.myForm = {};
        $scope.myForm.parentid = 0;
		$scope.mdalTitle = "添加商品分类";
		$scope.submition = "确定添加";
		//操作标志赋值为'add'
		$scope.operationFlag = 'add';
		
		$scope.sortGoodsClassify();
	};
	//添加或编辑商品
	$scope.addOrEditGoodsClassify = function(){
		if($scope.operationFlag == 'add'){
			//判断表单验证是否通过
			if($scope.goodsClassifyFrom.companygoodsclassifyname.$invalid){
				$scope.goodsClassifyFrom.submitted = true;
			}else{
	            //请求后台处理操作
				var url = goodsClassifyService.getAddCompanyGoodsClassifyUrl();
				goodsClassifyService.httpPost(url,$scope.myForm,function(resp){
					if(resp.ret == 0){
						//添加成功后重新获取商品分类数据
						$scope.searchGoodsClassify();
						//$scope.gridApi.grid.refresh();
						$('#goodsClassifyModal').modal('hide');
						$alert({title: '提示：', content: '商品分类添加成功!', placement: 'masget-top',type: 'info', duration:2, show: true});								
					}else if(resp.ret == 20019){
						$alert({title: '提示：', content: '添加失败,同一级商品分类名称不能相同!', placement: 'masget-top',type: 'info', duration:2, show: true});
					}else if(resp.ret == 20020){
						$alert({title: '提示：', content: resp.message, placement: 'masget-top',type: 'info', duration:2, show: true});
					}
				});	
			}
		}else if($scope.operationFlag == 'edit'){
			if($scope.goodsClassifyFrom.companygoodsclassifyname.$invalid){
				$scope.goodsClassifyFrom.submitted = true;
			}else{
	            //请求后台处理操作
				var url = goodsClassifyService.getEditCompanyGoodsClassifyUrl();
				goodsClassifyService.httpPost(url,$scope.myForm,function(resp){
					if(resp.ret == 0){
						//添加成功后重新获取商品分类数据
						$scope.searchGoodsClassify();
						//$scope.gridApi.grid.refresh();
						$('#goodsClassifyModal').modal('hide');
						$alert({title: '提示：', content: '商品分类修改成功!', placement: 'masget-top',type: 'info', duration:2, show: true});							
					}else{
						$alert({title: '提示：', content: '商品分类修改失败!', placement: 'masget-top',type: 'info', duration:2, show: true});
					}
				});				
			}
		}
	};
	//删除商品分类
	$scope.deleteClassify = function(grid,myRow){
		if(confirm("确定要删除数据吗?")){
			$scope.baseData.classifyData = angular.copy(myRow);
				$scope.params = {};
				$scope.params.companygoodsclassifyid = $scope.baseData.classifyData.companygoodsclassifyid;
				var url = goodsClassifyService.getDeleteCompanyGoodsClassifyByIdUrl();
				goodsClassifyService.httpPost(url,$scope.params,function(resp){
					if(resp.ret == 0){
						//添加成功后重新获取商品分类数据
						$scope.searchGoodsClassify();
						$scope.gridApi.grid.refresh();
						$('#goodsClassifyModal').modal('hide');
						$alert({title: '提示：', content: '删除商品分类成功!', placement: 'masget-top',type: 'info', duration:2, show: true});							
					}else{
						$alert({title: '提示：', content: '删除失败,该分类存在子分类或该分类下存在商品!', placement: 'masget-top',type: 'info', duration:3, show: true});
					}
				});	
		}
	};
}]);