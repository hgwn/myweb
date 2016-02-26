/**
 * Created by Administrator on 2015-09-06.
 */
entCatagoryModule.controller("CategoryController",
    ['$scope','$rootScope','$http',"$stateParams","$state","i18nService","uiGridTreeViewConstants","utils",'$interval','categoryService',
        function($scope, $rootScope, $http,$stateParams,$state,i18nService,uiGridTreeViewConstants,utils,$interval,categoryService) {
    	i18nService.setCurrentLang('zh-cn');
    		
    	$scope.myForm = {};
    	$scope.queryCategorys={pagesize:20,pagenum:1};
    	$scope.gridOptions = {};
    	$scope.gridOptions.data = [];
    	
    	//加载数据源汇总
        $http
            .get("../../../enterprise/category/find_category.do?pagesize=20&pagenum=1")
            .success(function (data) {
            	
            	//给商品分类增加一个默认分类
 				$scope.newObject = {
 						parentid:0,
 						categoryid:0,
 						categoryname:'(空)'
 				};
            	var result =angular.copy(data.data.rows);
            	$scope.data = angular.copy(data.data.rows);
            	
            	$scope.CategorygridOptions.totalItems = data.data.total;
            	
            	//在模态框中显示默认分类
                $scope.gridOptions.data = angular.copy(result);
         		$scope.gridOptions.data.push($scope.newObject);
            	
            	angular.forEach($scope.data,function(data,index,array){
					if(data.parentid == 0){
						//一级节点设置$$treeLevel为0,二级节点设置为1,以此类推
						data.$$treeLevel = 0;
						$scope.CategorygridOptions.data.push(data);
						hasChildNodes(data.categoryid,$scope.CategorygridOptions.data,data.$$treeLevel);
					}
				});
                
                if (data.ret == 1000) {
                    $.jBox.tip("请先登录", 'warning');
                }
                console.log(result);
            });
        
        //查询
        $scope.onClickToQuery = function(){
        	 $http({
                 method : 'POST',
                 url : "/jsbweb/enterprise/category/find_category.do",
                 data : $.param($scope.queryCategorys),
                 headers : {
                     'Content-Type' : 'application/x-www-form-urlencoded'
                 }
             }).success(function(data) {
                 if(data.ret==0){
                	//给商品分类增加一个默认分类
     				$scope.newObject = {
     						parentid:0,
     						categoryid:0,
     						categoryname:'(空)'
     				};
     				
     				//在模态框中显示默认分类
     				$scope.gridOptions.data = angular.copy(data.data.rows);
     				$scope.gridOptions.data.push($scope.newObject);
                	
     				$scope.data = angular.copy(data.data.rows);
     				$scope.CategorygridOptions.data = []; 
                 	
                 	angular.forEach($scope.data,function(data,index,array){
     					if(data.parentid == 0){
     						//一级节点设置$$treeLevel为0,二级节点设置为1,以此类推
     						data.$$treeLevel = 0;
     						$scope.CategorygridOptions.data.push(data);
     						hasChildNodes(data.categoryid,$scope.CategorygridOptions.data,data.$$treeLevel);
     					}
     				});
                 	$scope.CategorygridOptions.totalItems = data.data.total;
             		
                 }else if(data.ret==10){
                     $.jBox.tip("请先登录", 'warning');
                 }else{ 
                     $.jBox.tip("获取数据失败", 'warning');
                 }
             }).error(function(rep){
                 $.jBox.tip("获取数据失败", 'warning');
             });
        }
        
        //给弹窗的商品分类信息下拉列表进行排序整理
    	$scope.sortCategory = function(){
    		var classify = utils.arrayDataToTree($scope.gridOptions.data,'categoryid', 'parentid', "0", 0);
    		var array = [];
    		function text(classify){
    			angular.forEach(classify, function (value, key) {
    				var a = value;
    				array.push({categoryname:getspace(a.level) + a.categoryname,categoryid:a.categoryid});
    				if(a.nodes && a.nodes.length>0)
    				{
    					text(a.nodes);
    				};
        		});
    		}
    		function getspace(count){
    			var space = '';
    			while(count--){
    				space += '--';
    			}
    			
    			return space;
    		}
    		text(classify);
    		$scope.parentnamegridOptions  = array;
    	};
    	
       	
        
    	
    	//展示页面 ui-grid of Tree View
    	$scope.CategorygridOptions = { 
			 paginationPageSizes: [10, 20, 50, 100],
             paginationPageSize: 20,
             useExternalPagination: true,
             useExternalSorting: false,
             enableSorting : true,
       		 enableColumnMenus: false,
       		 enableFiltering: false,
       		 showTreeExpandNoChildren: true,  	 
       		 enableRowSelection: true,
       		 //enableSelectAll: true,
       		 
       		 columnDefs : [
       		                { name: '名称',field:'categoryname'},
       		                { name: '上级分类',field:'parentname'},
       		                { name: '操作',field:'action', width: '20%',enableFiltering: false,
       		                    cellTemplate: '<div class="ui-grid-cell-contents">' +
       		                '<a style="cursor:pointer; margin-left: 8px;" ng-click="grid.appScope.modifyGoods(grid, row.entity)" title="编辑" href="#" data-toggle="modal" data-target="#category-container"><span class="glyphicon glyphicon-pencil blue"></span></a>' +
       		                '<a style="cursor:pointer; margin-left: 8px;" ng-click="grid.appScope.deleteGoods(row.entity)" title="删除"><span class="glyphicon glyphicon-trash red"></span></a>' +
       		                '</div>',width:'80'},
       		               ],
       		            onRegisterApi: function(gridApi) {
       		                $scope.gridApi = gridApi;
       		               // $scope.CategorygridOptions.showTreeExpandNoChildren = true;
       		                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
       		                    if(getPage) {
       		                        getPage(newPage, pageSize);
       		                    }
       		                });
       		            }
        };
    	
    	//判断节点是否含有子节点
    	function hasChildNodes(categoryid,arr,level){
    		angular.forEach($scope.data,function(data,index,array){
    			//判断节点的id是否为其它节点的父节点,是则继续递归
    			if(categoryid == data.parentid){ 
    				//一级节点设置$$treeLevel为0,二级节点设置为1,以此类推
    				data.$$treeLevel = parseInt(level)+1;
    				$scope.CategorygridOptions.data.push(data);
    				hasChildNodes(data.categoryid,$scope.CategorygridOptions.data,data.$$treeLevel);
    			}
    		});
    	}
    	
    	var getPage = function(pagenum, pagesize) {
            $scope.queryCategorys.pagenum = pagenum;
            $scope.queryCategorys.pagesize = pagesize;
            $scope.onClickToQuery();
        };
        $scope.getPage = getPage;
        
        //新增界面模态框
        $scope.onBtnClickAdd = function(){
        	$scope.myForm = {};
        	$scope.myForm.title = "新增分类";
        	$scope.sortCategory();
        };
        
        
        //修改界面模态框
    	$scope.modifyGoods = function(grid,myRow){
    		console.info(myRow);
    		$scope.myForm = {};
    		$scope.myForm.categoryid = myRow.categoryid;
    		$scope.myForm.categoryname = myRow.categoryname;
    		$scope.myForm.parentid = myRow.parentid;
    		$scope.myForm.title = "修改分类";
    		$scope.sortCategory();
    	};
    	
        
        //保存 	
    	$scope.addFormDataSumbit = function(myForm){
    		
    		console.info($scope.myForm);
    		if($scope.myForm.categoryname == undefined){
    			$.jBox.tip('分类名不能为空', 'warning');
    			return;
    		}
    		    		
    		//新增界面保存操作
    		if($scope.myForm.categoryid == undefined) {
    			
    		$scope.myForm.title = "新增分类"; 		  		
    		var data = { data: angular.toJson($scope.myForm)};
    		
	    		$http({
	                method: 'POST',
	                url: "/jsbweb/enterprise/category/add_category.do",
	                data: $.param(data),
	                headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded'
	                }
	            }).success(function (data) {
	
	                if (data.ret == 0) {
	                    $.jBox.tip('添加成功', 'success'); 
	                    $('#category-container').modal('hide');
	                    $scope.onClickToQuery();
	                }else if(data.ret == 20135){
	                	$.jBox.tip('同一级商品分类名称不能相同', 'warning');
	                } 
	                else {
	                    $.jBox.tip('添加失败', 'warning');
	                }
	
	                if (data.ret == 10) {
	                    $.jBox.tip("请先登录", 'warning');
	                }
	            }).error(function(data){
	                $.jBox.tip("连接服务器失败", "warning");
	            });
    		}else{
    			
    			//修改界面保存操作
    			 	
    			if($scope.myForm.categoryid == $scope.myForm.parentid){
    				$.jBox.tip("不能选取自己为上级分类", "warning");
    				return;
    			}
        		var data = { data: angular.toJson($scope.myForm)};
    			$http({
                    method: 'POST',
                    url: "/jsbweb/enterprise/category/modify_category.do",
                    data: $.param(data),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (data) {
                	
                    if (data.ret == 0) {
                    	
                        $.jBox.tip("修改成功", 'success');
                        $('#category-container').modal('hide');
                        $scope.onClickToQuery();
                        
                    } else if (data.ret == 10) {
                        $.jBox.tip("请先登录", 'warning');
                    } else {
                        $.jBox.tip("修改失败", 'warning');
                    }
                }).error(function (rep) {
                    console.log(rep)
                    $.jBox.tip("修改失败", 'warning');
                });
    		}	
    	};
    	
    	//删除记录
    	$scope.deleteGoods = function(myRow){
    		
    	$.jBox.confirm("确定要删除商品分类:  " + myRow.categoryname + " 吗？", "温馨提示", function(v, h, f){
    		if(v == "ok"){ 
    		$http({
		            method: 'POST',
		            url: "/jsbweb/enterprise/category/del_category.do?categoryid="+myRow.categoryid,
		            headers: {
		                'Content-Type': 'application/x-www-form-urlencoded'
		            }
		        }).success(function (data) {
		            if (data.ret == 0) {
		            	$.jBox.tip('删除成功', 'success');
		            	$scope.onClickToQuery();
		            }else if(data.ret == 20141){
	                	$.jBox.tip('商品分类存在下级分类无法删除', 'warning');
	                }else if(data.ret == 20133){
	                	$.jBox.tip('商品分类存在上级分类无法删除', 'warning');
	                }else {
	                    $.jBox.tip('删除失败', 'warning');
	                }
		            if (data.ret == 10) {
		                $.jBox.tip("请先登录", 'warning');
		            }
		        });
    		}
    		 return true;
    	});
    }
        
    }]);