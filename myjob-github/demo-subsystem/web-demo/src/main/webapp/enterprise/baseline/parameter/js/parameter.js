/**
 * Created by Administrator on 2015-08-27.
 */
entParameterModule.controller("ParameterController",
    ['$scope','$rootScope','$http',"$stateParams","$state","i18nService","utils",
        function($scope, $rootScope, $http,$stateParams,$state,i18nService,utils) {
    	i18nService.setCurrentLang('zh-cn');
    	$scope.formData = {};
    	$scope.parameter = [];
    	$scope.temp_parameter=[];
    	$scope.queryParams={pagesize:20,pagenum:1};
    	$scope.topformData = {title:"新增参数"};
    	
    	//加载数据源汇总
        $http
            .get("../../../enterprise/parameter/find_parameter.do?pagesize=20&pagenum=1")
            .success(function (data) {
            	var result =angular.copy(data.data.rows);
            	angular.forEach(result, function (value, key) {
            		value.parametername ='';
            		angular.forEach(value.parameter, function (smallValue, smallKey) {
            			value.parametername = value.parametername + smallValue.parametername + " ";
            		});
        		});
                $scope.ParametergridOptions.data = result;
                $scope.ParametergridOptions.totalItems = data.data.total;
                if (data.ret == 1000) {
                    $.jBox.tip("请先登录", 'warning');
                }
                console.log(result);
            });
      
        //加载绑定分类
        $http({
            method: 'POST',
            url: "/jsbweb/enterprise/category/find_category.do?pagesize=30&pagenum=1",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function (data) {
            if (data.ret == 0) {
                $scope.categorynamesOption = data.data.rows;
                $scope.sortCategory();
            }
            if (data.ret == 10) {
                $.jBox.tip("请先登录", 'warning');
            }
        });
          
        //给弹窗的商品分类信息下拉列表进行排序整理
    	$scope.sortCategory = function(){
    		var classify = utils.arrayDataToTree($scope.categorynamesOption,'categoryid', 'parentid', "0", 0);
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
    		$scope.categorynames  = array;
    	};
    	

        //查询
        $scope.onClickToQuery = function(){
        	 $http({
                 method : 'POST',
                 url : "/jsbweb/enterprise/parameter/find_parameter.do",
                 data : $.param($scope.queryParams),
                 headers : {
                     'Content-Type' : 'application/x-www-form-urlencoded'
                 }
             }).success(function(data) {
                 if(data.ret==0){
                	 var result = data.data.rows;
                 	angular.forEach(result, function (value, key) {
                 		value.parametername ='';
                 		angular.forEach(value.parameter, function (smallValue, smallKey) {
                 			value.parametername = value.parametername + smallValue.parametername + " ";
                 		});
             		});
                 	
                    $scope.ParametergridOptions.data = result; 
             		$scope.ParametergridOptions.totalItems = data.data.total;
             		
                 }else if(data.ret==10){
                     $.jBox.tip("请先登录", 'warning');
                 }else{ 
                     $.jBox.tip("获取数据失败", 'warning');
                 }
             }).error(function(rep){
                 $.jBox.tip("获取数据失败", 'warning');
             });
        }
        
    	
    	//展示页面
        
    	$scope.ParametergridOptions = { 
			 paginationPageSizes: [10, 20, 50, 100],
             paginationPageSize: 20,
             useExternalPagination: true,
             useExternalSorting: false,
             enableSorting : false,
       		 enableColumnMenus: false,
       		 columnDefs : [
       		               	{ name:'操作',field:'action',
       		                    cellTemplate: '<div class="ui-grid-cell-contents">' +
       		                '<a style="cursor:pointer; margin-left: 8px;" ng-click="grid.appScope.modifyGoods(grid, row.entity)" title="编辑" ><span class="glyphicon glyphicon-pencil blue"></span></a>' +
       		                '<a style="cursor:pointer; margin-left: 8px;" ng-click="grid.appScope.deleteGoods(row.entity)" title="删除"><span class="glyphicon glyphicon-trash red"></span></a>' +
       		                '</div>',width:'80',enableCellEdit: false },
       		                { name: '名称',field:'parametergroupname',enableCellEdit: false},
       		             	{ name: '绑定分类',field:'categoryname',enableCellEdit: false},
       		                { name: '参数',field:'parametername',enableCellEdit: false},
       		               ],
       		            onRegisterApi: function(gridApi) {
       		                $scope.gridApi = gridApi;
       		                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
       		                    if(getPage) {
       		                        getPage(newPage, pageSize);
       		                    }
       		                });
       		            }
        };
    	
    	var getPage = function(pagenum, pagesize) {
            $scope.queryParams.pagenum = pagenum;
            $scope.queryParams.pagesize = pagesize;
            $scope.onClickToQuery();
        };
        $scope.getPage = getPage;
    	
    	
    	
    	//新增方法切换界面
    	$scope.onBtnClickAdd = function(){
    		$state.go("addParameter");
    		if($scope.formData.parametergroupname != undefined){
    			location.reload();
    		}
    	}
    	
    	//返回
    	$scope.goback = function(grid,myRow){
    		$state.go("parameter");
    	};
    	
    	
    	//保存 	
    	$scope.addFormDataSumbit = function(invalid){
    		
    		$scope.formData.isCommitted=true;
    		
    		if(invalid){
        		$.jBox.tip('请检查提交的数据是否正确!', 'warning');
        		return;
        	}
    		
    		//新增界面保存操作
    		if($scope.formData.parametergroupid == undefined) {
    		
    		var tempparameter = [];
    		
    		angular.forEach($scope.temp_parameter, function (value, key) {
    			tempparameter.push(value);
    		});
    		
			 if (tempparameter.length == 0) {
	             $.jBox.tip('请添加参数名称', 'warning');
	             return;
	         }
    		
    		$scope.formData.parameter = tempparameter;
    		var data = { data: angular.toJson($scope.formData)};
    		
	    		$http({
	                method: 'POST',
	                url: "/jsbweb/enterprise/parameter/add_parameter.do",
	                data: $.param(data),
	                headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded'
	                }
	            }).success(function (data) {
	
	                if (data.ret == 0) {
	                    $.jBox.tip('添加成功', 'success');  
	                    $state.go("parameter");
	                } else {
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
    			
    			$scope.formData.parametergroupid = $scope.formData.parametergroupid
    			var tempparameter = [];
    			var resulte = angular.copy($scope.temp_parameter);	
        		angular.forEach(resulte, function (value, key) {
        			switch(value.action)
        			{
        			case "add":
        				value.action = "add";
        				value.parameterid= 0;
        				value.parametergroupid = $scope.formData.parametergroupid;
        				break;
        			  default: value.action = "modify";
        			}
        		
        			tempparameter.push(value);
        		});
        		
        		angular.forEach($scope.parameter,function(dvalue,dkey){
        			if(dvalue.action=="delete"){
        				tempparameter.push(dvalue);
        			}
        		});
        		
    			 if (tempparameter.length == 0) {
    	             $.jBox.tip('请添加参数名称', 'warning');
    	             return;
    	         }
        		$scope.formData.parameter = tempparameter;
        		var data = { data: angular.toJson($scope.formData)};
    			$http({
                    method: 'POST',
                    url: "/jsbweb/enterprise/parameter/modify_parameter.do",
                    data: $.param(data),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (data) {
                	
                    if (data.ret == 0) {
                    	
                        $.jBox.tip("修改成功", 'success');
                        $state.go("parameter");
                        
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
    	
    	
    	//修改界面跳转
    	$scope.modifyGoods = function(grid,myRow){
    		console.info(myRow);
    		$state.go("addParameter");
    		$state.formData = angular.copy(myRow);
    		
    	};
    	
    	//删除记录
    	$scope.deleteGoods = function(myRow){
    		
    	$.jBox.confirm("确定要删除商品参数组:  " + myRow.parametergroupname + " 吗？", "温馨提示", function(v, h, f){
    		if(v == "ok"){ 
    		$http({
		            method: 'POST',
		            url: "/jsbweb/enterprise/parameter/del_parameter.do?parametergroupid="+myRow.parametergroupid,
		            headers: {
		                'Content-Type': 'application/x-www-form-urlencoded'
		            }
		        }).success(function (data) {
		            if (data.ret == 0) {
		            	$.jBox.tip('删除成功', 'success');
		            	$scope.onClickToQuery();
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
    	
    	
    	
    	//删除临时参数记录
    	$scope.delrecord = function (index) {
            $scope.temp_parameter.splice(index, 1);
            $scope.parameter[index].action="delete";
        };
    	
    	//添加临时参数记录
    	$scope.add_record = function () {
    		var temp = {};
    		temp.parametername="";
    		temp.action = "add";
    		$scope.temp_parameter.push(temp);
    	};
    	$scope.add_record();
    	
    	//定义修改界面初始化页面数据方法
    	var initData=function(){
    		if($state.formData !=null){
    			$scope.formData = $state.formData;
    			$scope.formData.categoryid = $state.formData.categoryid;
    			$scope.formData.categoryname = $state.formData.categoryname;
    			
    			if($scope.formData.parametergroupid == undefined){
    				$scope.topformData.title = "新增参数";
    			}else{
    				$scope.topformData.title = "修改参数";
    			}
    			//获取临时数据
    			$scope.parameter = $state.formData.parameter;
    			$scope.temp_parameter = angular.copy($state.formData.parameter);
    			
    			return;
    		}
    	};
    	//修改界面初始化页面数据
    	initData();
    	
    }]);