installmentsconfigApp.
controller('installmentsconfigListController',['$state','$scope','$rootScope','$http','$alert','uiGridTreeViewConstants','i18nService','$timeout','installmentsconfigService',
function($state,$scope,$rootScope,$http,$alert,uiGridTreeViewConstants,i18nService,$timeout,installmentsconfigService){
	i18nService.setCurrentLang('zh-cn');
	$scope.formData = {};
    $scope.formData.enableflag = 0;
    $scope.formData.enableflagList = [{enableflag:0 , name:'--全部--'},
                                      {enableflag:1 , name:'可用'},
                                      {enableflag:2 , name:'不可用'}];
	
	//ui-grid of Tree View
	$scope.gridOption = {
          paginationPageSizes: [5, 10, 20, 50, 100],
          paginationPageSize: 100,
          useExternalPagination: true,
          useExternalSorting: false,
          enableColumnMenus: false,
          enableGridMenu: true,
	      columnDefs: [
          { name: '序号', enableHiding: false, field:'id',type:'text',enableHiding: false,enableCellEdit: false , enableSorting: false, enableColumnResizing:false,  width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
		  { name: '操作', enableHiding: false, field:'action', width: '9%', enableFiltering: false,
		    cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">' +
		    '<a href="#" class="" ng-click="grid.appScope.installmentsconfigModify(row.entity)" title="修改"><span class="glyphicon glyphicon-pencil blue"></span></a>&nbsp;'+
		    '<a href="#" class="" ng-click="grid.appScope.installmentsconfigDelete(row.entity)" title="删除"><span class="glyphicon glyphicon-trash red"></span></a>&nbsp;'+
		    '</div>'},             
	      { name: '分期数', cellTemplate:'<div class="ui-grid-cell-contents" style="text-align:center;">{{row.entity.options}}</div>'},
	      { name: '分期费率', cellTemplate:'<div class="ui-grid-cell-contents" style="text-align:center;">{{row.entity.fee}}%</div>'},
	      ],
            
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    if(getPage) {
                        getPage(newPage, pageSize);
                    }
                });
                $scope.gridApi.grid.refresh();
            }
	};
	//ui grid分页
    var getPage = function(pagenum, pagesize) {
    	$scope.data = {};
    	$scope.data.enableflag = 1;
    	$scope.data.options = $scope.options;
        var data = { data: angular.toJson($scope.data)};
        installmentsconfigService.httpPost(installmentsconfigService.getInstallmentsconfig(),data,function(data){
        	console.log(data);
        	if(data.ret == 0){
        		$scope.gridOption.data = data.data.rows;
        		$scope.gridOption.totalItems = data.data.total;
        	}else if(data.ret == 10){
            	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
            }else{
        		$alert({title: '提示：', content: '查询分期付配置异常,'+data.message, placement: 'masget-top',type: 'info', duration:1, show: true});
        	}
        });
    };
    $scope.getPage = getPage;
    $scope.getPage(1,$scope.gridOption.paginationPageSize);
    //删除分期付款配置
    $scope.installmentsconfigDelete = function(entity){
    	var da = angular.copy(entity);
    	da.enableflag = 2; //2为不可用，即新增
        var data = { data: angular.toJson(da)};
        installmentsconfigService.httpPost(installmentsconfigService.getModifyInstallmentsconfigUrl(),data,function(data){
	       	 if(data.ret == 0){
	       		 $alert({title: '提示：', content: '删除分期付配置成功!', placement: 'masget-top',type: 'info', duration:1, show: true});
	       		 $scope.getPage(1,$scope.gridOption.paginationPageSize);
	       	 }else if(data.ret == 10){
	        	 $alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
	         }else{
	    		 $alert({title: '提示：', content: '删除分期付配置异常,'+data.message, placement: 'masget-top',type: 'info', duration:2, show: true});
	    	 }
	    });
    };
    //弹窗修改界面
    $scope.installmentsconfigModify = function(entity){
    	$scope.modalTitle = '分期付配置修改';
    	$scope.modalSubmit = '确认修改';
	    $("#installmentsconfigDetail").modal("show");
	    $scope.formData = angular.copy(entity);
	    //弹窗修改操作
	    $scope.formData.action = "modify"; 
    };
    //弹窗新增界面
    $scope.installmentsconfigAdd = function(){
    	$scope.modalTitle = '分期付配置添加';
    	$scope.modalSubmit = '确认添加';
    	$("#installmentsconfigDetail").modal("show");
	    $scope.formData = {};
	    $scope.formData.action = "add";
    };
    //修改或新增
    $scope.submit = function(action){
	    if(action == 'modify'){
	        var data = { data: angular.toJson($scope.formData)};
	        installmentsconfigService.httpPost(installmentsconfigService.getModifyInstallmentsconfigUrl(),data,function(data){
		       	 if(data.ret == 0){
		       		 $alert({title: '提示：', content: '修改分期付配置成功!', placement: 'masget-top',type: 'info', duration:2, show: true});
		       		 $scope.getPage(1,$scope.gridOption.paginationPageSize);
		       		 $("#installmentsconfigDetail").modal("hide");
		       	 }else if(data.ret == 10){
		        	 $alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
		         }else{
		    		 $alert({title: '提示：', content: '修改分期付配置异常,'+data.message, placement: 'masget-top',type: 'info', duration:2, show: true});
		    	 }
		    });
	    }else if(action == 'add'){
		    //参数过滤
	    	if($scope.formData.options == undefined || $scope.formData.options == ''){
			    $alert({title: '提示：', content: '分期数不能为空', placement: 'masget-top',type: 'info', duration:2, show: true});
		        return ;
		    }
	    	if($scope.formData.fee == undefined || $scope.formData.fee == ''){
			    $alert({title: '提示：', content: '分期费率不能为空', placement: 'masget-top',type: 'info', duration:2, show: true});
		        return ;
		    }
	    	/*$scope.formData.enableflag = 1;*/
	        var data = { data: angular.toJson($scope.formData)};
	        installmentsconfigService.httpPost(installmentsconfigService.getAddInstallmentsconfig(),data,function(data){
		       	 if(data.ret == 0){
		       		 console.info(data);
		       		 $alert({title: '提示：', content: '添加分期付配置成功!', placement: 'masget-top',type: 'info', duration:2, show: true});
		       		 $scope.getPage(1,$scope.gridOption.paginationPageSize);
		       		 $("#installmentsconfigDetail").modal("hide");
		       	 }else if(data.ret == 10){
		        	 $alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
		         }else{
		    		 $alert({title: '提示：', content: '添加分期付配置异常,'+data.message, placement: 'masget-top',type: 'info', duration:2, show: true});
		    	 }
		    });
	    }
    };
}])
.controller('installmentsconfigDetailController',['$state','$scope','$rootScope','$http','$alert','uiGridTreeViewConstants','i18nService','$timeout','installmentsconfigService',
function($state,$scope,$rootScope,$http,$alert,uiGridTreeViewConstants,i18nService,$timeout,installmentsconfigService){
	
}]);
