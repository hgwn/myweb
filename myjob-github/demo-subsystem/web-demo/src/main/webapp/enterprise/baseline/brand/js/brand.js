/**
 * Created by Administrator on 2015-08-27.
 */
entBrandModule.controller("BrandController",
    ['$scope','$rootScope','$http',"$stateParams","$state","i18nService","Upload","utils",
        function($scope, $rootScope, $http,$stateParams,$state,i18nService,Upload,utils) {
    	i18nService.setCurrentLang('zh-cn');
    	$scope.formData = {};
    	$scope.topformData = {title:"新增品牌"};
    	$scope.queryBrand={pagesize:20,pagenum:1};
    	
    	
    	
    	//加载数据源汇总
        $http
            .get("../../../enterprise/brand/find_brand.do?pagesize=20&pagenum=1")
            .success(function (data) {
            	var result =angular.copy(data.data.rows);
            	
                $scope.BrandgridOptions.data = result;
                $scope.BrandgridOptions.totalItems = data.data.total;
                if (data.ret == 1000) {
                    $.jBox.tip("请先登录", 'warning');
                }
                console.log(result);
            });
    	
      //查询
        $scope.onClickToQuery = function(){
        	 $http({
                 method : 'POST',
                 url : "/jsbweb/enterprise/brand/find_brand.do",
                 data : $.param($scope.queryBrand),
                 headers : {
                     'Content-Type' : 'application/x-www-form-urlencoded'
                 }
             }).success(function(data) {
                 if(data.ret==0){
                	 var result =angular.copy(data.data.rows);
                	 /*angular.forEach(result, function (value, key) {
                 		value.logo
             		});*/
                	 
                    $scope.BrandgridOptions.data = result;
                    $scope.BrandgridOptions.totalItems = data.data.total;
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
        
    	$scope.BrandgridOptions = { 
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
       		                { name: '名称',field:'brandname',enableCellEdit: false},
       		                /*{ name:'品牌 logo',field:'picshow',
       		                    cellTemplate: '<div class="ui-grid-cell-contents">' +
       		                '<a style="cursor:pointer; margin-left: 70px;" ng-click="grid.appScope.look(row.entity)" title="查看"><span class="glyphicon glyphicon-picture">查看</span></a>' +
       		                '</div>',width:'200',enableCellEdit: false },*/
       		                
       		                { name:'品牌 logo',field:'picshow',
       		                    cellTemplate: '<div class="ui-grid-cell-contents">' +
       		                '<a style="cursor:pointer; margin-left: 70px;" ng-click="grid.appScope.look(row.entity)" id="modal-728099" href="#modal-container-728099" data-toggle="modal" title="查看"><span class="glyphicon glyphicon-picture">查看</span></a>' +
       		                '</div>',width:'200',enableCellEdit: false },
       		                
       		                { name: '品牌官网地址',field:'url',enableCellEdit: false},
       		             	{ name: '品牌描述',field:'description',enableCellEdit: false},
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
            $scope.queryBrand.pagenum = pagenum;
            $scope.queryBrand.pagesize = pagesize;
            $scope.onClickToQuery();
        };
        $scope.getPage = getPage;
    	
        //查看图片
        $scope.look = function(myRow){
        	//window.open(myRow.logo);
        	/*if(myRow.logo == undefined){
        		$.jBox.tip('该品牌没有上传Logo图片!', 'warning');
        	}else{
	        	$.jBox("iframe:"+myRow.logo, {
	        	    title: myRow.brandname + "品牌logo图片预览",
	        	    width: 550,
	        	    height: 550,
	        	    buttons: { '关闭': true }
	        	})
        	};*/
        	if(myRow.logo == undefined){
        		$.jBox.tip('该品牌没有上传Logo图片!', 'warning');
        	}
        	$scope.formData=myRow;
        };
       
    	
    	//新增和编辑方法切换界面
    	$scope.onBtnClickAdd = function(){
    		$state.go("addBrand");
    		
    	}
    	
    	//返回
    	$scope.goback = function(grid,myRow){
    		$state.formData = {};
    		$state.go("brand");
    	};
    	
    	
    	//修改界面跳转
    	$scope.modifyGoods = function(grid,myRow){
    		console.info(myRow);
    		$state.go("addBrand");
    		$state.formData = angular.copy(myRow);
    		
    	};  
    		
    	//保存 	
    	$scope.addFormDataSumbit = function(invalid){
    		
    		if(invalid){
        		$.jBox.tip('请检查提交的数据是否正确!', 'warning');
        		return;
        	}
    		
    		if($scope.formData.brandname == undefined || $scope.formData.brandname == ""){
        		$.jBox.tip('名称不能为空!', 'warning');
        		return;
        	}
    		
    		//新增界面保存操作
    		if($scope.formData.brandid == undefined) {
    		
    		var data = { data: angular.toJson($scope.formData)};
    		
	    		$http({
	                method: 'POST',
	                url: "/jsbweb/enterprise/brand/add_brand.do",
	                data: $.param(data),
	                headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded'
	                }
	            }).success(function (data) {
	
	                if (data.ret == 0) {
	                    $.jBox.tip('添加成功', 'success');  
	                    $state.go("brand");
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
        		var data = { data: angular.toJson($scope.formData)};
    			$http({
                    method: 'POST',
                    url: "/jsbweb/enterprise/brand/modify_brand.do",
                    data: $.param(data),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (data) {
                	
                    if (data.ret == 0) {
                    	
                        $.jBox.tip("修改成功", 'success');
                        $state.go("brand");
                        
                        $state.formData = {};
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
    		
    	$.jBox.confirm("确定要删除品牌: " + myRow.brandname + "吗？", "温馨提示", function(v, h, f){
    		if(v == "ok"){ 
    		$http({
		            method: 'POST',
		            url: "/jsbweb/enterprise/brand/del_brand.do?brandid="+myRow.brandid,
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
    	
    	
    	//删除图片
		 $scope.deletePic = function(picIndex){
				//删除图片
				$scope.formData.logo = utils.removeFromArrayByKeyValue($scope.formData.logo,'pictureIndex',picIndex);
				$scope.file = false;
		 }
		 //上传图片
		 $scope.$watch('files', function () {
		        $scope.upload($scope.files);
		  });
		 
		 $scope.upload = function (files) {
		 	//console.log(files);
		        if (files && files.length) {
		            for (var i = 0; i < files.length; i++) {
		                var file = files[i];
		                var name = file.name;
		                $scope.filename = name;
		                var index = name.lastIndexOf(".");
			           	var ext = name.substring(index + 1, name.length);
			           	if(ext !='jpg' && ext !='jpeg' && ext !='png'){
			           		$.jBox.tip("请选择图片格式(*.jpg/*.png/*.jpeg)上传！", 'warning');
			           		return;
			           	}
		                Upload.upload({
		                    url: '/jsbweb/base/fileUpload.do',
		                    fields: {'username': $scope.username},
		                    file: file
		                }).progress(function (evt) {
		                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
		                }).success(function (data, status, headers, config) {
		                	console.log(data);
		                	$scope.formData.logo = data.data.file;
		                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
		                    $scope.file = true;
		                }).error(function(){
		                	console.log("error");
		                });
		            }
		        }
		 };
		 
		 	//定义修改界面初始化页面数据方法
	    	var initData=function(){
	    		if($state.formData !=null){
	    			$scope.formData = $state.formData;
	    			
	    			if($scope.formData.brandid == undefined){
	    				$scope.topformData.title = "新增品牌";
	    			}else{
	    				$scope.topformData.title = "修改品牌";
	    			}
	    			
	    			if($scope.formData.logo){
	    				$scope.file = true;
			    	}else{
			    		$scope.file = false;
			    	}
	    			
	    			console.info($scope.topformData.title);
	    			return;
	    		}
	    	};
	    	//修改界面初始化页面数据
	    	initData();
  
    }]);