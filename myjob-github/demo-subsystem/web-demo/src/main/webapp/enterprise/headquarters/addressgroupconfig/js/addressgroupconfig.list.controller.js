addressGroupConfigApp.
controller('addressGroupConfigListController',['$state','$scope','$rootScope','$http','$alert','uiGridTreeViewConstants','i18nService','$timeout','addressGroupConfigService',
function($state,$scope,$rootScope,$http,$alert,uiGridTreeViewConstants,i18nService,$timeout,addressGroupConfigService){
	i18nService.setCurrentLang('zh-cn');
	$scope.formData = {};
	//ui-grid of Tree View
	$scope.gridOption = {
          paginationPageSizes: [5, 10, 20, 50, 100],
          paginationPageSize: 20,
          useExternalPagination: true,
          useExternalSorting: false,
          enableColumnMenus: false,
          enableGridMenu: true,
	      columnDefs: [
          { name: '序号', enableHiding: false, field:'id',type:'text',enableHiding: false,enableCellEdit: false , enableSorting: false, enableColumnResizing:false,  width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
		  { name: '操作', enableHiding: false, field:'action', width: '9%', enableFiltering: false,
		    cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">' +
		    '<a href="#" class="" ng-click="grid.appScope.addressGroupConfigModify(row.entity)" title="查看"><span class="glyphicon glyphicon-pencil blue"></span></a>&nbsp;'+
		    '</div>'},             
	      { name: '级别名称', field: 'addressgroupname'},
	      { name: '订货折扣率', width:'30%',cellTemplate:'<div class="ui-grid-cell-contents" style="text-align:center;">{{row.entity.discountrate}}%</div>' }
	      
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
    var getPage = function(pagenum, pagesize, sort) {
    	$scope.data = {};
        $scope.data.pagenum = pagenum;
        $scope.data.pagesize = pagesize;
        $scope.data.scenetypeid = 3;    //前端默认传3-客户
        $scope.data.saasid = 3000;    //应用id前端默认传3000
        $scope.data.saasaddressgrouptypeid = 2;    //应用分组id前端默认传2-自定义分组
        var data = { data: angular.toJson($scope.data)};
        addressGroupConfigService.httpPost(addressGroupConfigService.getAddressgroupconfig(),data,function(data){
        	console.log(data);
        	if(data.ret == 0){
        		$scope.gridOption.data = data.data.rows;
        		$scope.gridOption.totalItems = data.data.total;
        	}else if(data.ret == 10){
            	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
            }else{
        		$alert({title: '提示：', content: '查询经销商级别配置异常,'+data.message, placement: 'masget-top',type: 'info', duration:1, show: true});
        	}
        });
    };
    $scope.getPage = getPage;
    $scope.getPage(1,$scope.gridOption.paginationPageSize);
    //弹窗修改界面
    $scope.addressGroupConfigModify = function(entity){
    	$scope.modalTitle = '经销商级别修改';
    	$scope.modalSubmit = '确认修改';
	    $("#addressgroupConfigDetail").modal("show");
	    $scope.formData = angular.copy(entity);
	    //弹窗修改操作
	    $scope.formData.action = "modify"; 
    };
    //弹窗新增界面
    $scope.addressGroupConfigAdd = function(){
    	$scope.modalTitle = '经销商级别添加';
    	$scope.modalSubmit = '确认添加';
    	$("#addressgroupConfigDetail").modal("show");
	    $scope.formData = {};
	    $scope.formData.action = "add";
    };
    //修改或新增
    $scope.submit = function(action){
	    //参数过滤
    	if($scope.formData.addressgroupname == undefined || $scope.formData.addressgroupname == ''){
		    $alert({title: '提示：', content: '级别名称不能为空', placement: 'masget-top',type: 'info', duration:2, show: true});
	        return ;
	    }
    	if($scope.formData.discountrate == undefined || $scope.formData.discountrate == ''){
		    $alert({title: '提示：', content: '订货折扣不能为空', placement: 'masget-top',type: 'info', duration:2, show: true});
	        return ;
	    }
	    if($scope.formData.discountrate < 0){
		    $alert({title: '提示：', content: '订货折扣取值范围为不小于0!', placement: 'masget-top',type: 'info', duration:2, show: true});
	        return ;
	    }
	    if(action == 'modify'){
	        var data = { data: angular.toJson($scope.formData)};
		    addressGroupConfigService.httpPost(addressGroupConfigService.getModifyAddressgroupconfigUrl(),data,function(data){
		       	 if(data.ret == 0){
		       		 $alert({title: '提示：', content: '修改成功!', placement: 'masget-top',type: 'info', duration:2, show: true});
		       		 $scope.getPage(1,$scope.gridOption.paginationPageSize);
		       		 $("#addressgroupConfigDetail").modal("hide");
		       	 }else if(data.ret == 10){
		        	 $alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
		         }else{
		    		 $alert({title: '提示：', content: '修改经销商级别异常,'+data.message, placement: 'masget-top',type: 'info', duration:2, show: true});
		    	 }
		    });
	    }else if(action == 'add'){
	    	//3-客户
	    	$scope.formData.scenetypeid = 3;
	    	//应用id
	    	$scope.formData.saasid = 3000;
	        var data = { data: angular.toJson($scope.formData)};
		    addressGroupConfigService.httpPost(addressGroupConfigService.getAddAddressgroupconfigUrl(),data,function(data){
		       	 if(data.ret == 0){
		       		 $alert({title: '提示：', content: '添加经销商分组级别成功!', placement: 'masget-top',type: 'info', duration:2, show: true});
		       		 $scope.getPage(1,$scope.gridOption.paginationPageSize);
		       		 $("#addressgroupConfigDetail").modal("hide");
		       	 }else if(data.ret == 10){
		        	 $alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
		         }else{
		    		 $alert({title: '提示：', content: '添加经销商级别异常,'+data.message, placement: 'masget-top',type: 'info', duration:2, show: true});
		    	 }
		    });
	    }
    };
}])
.controller('addressGroupConfigDetailController',['$state','$scope','$rootScope','$http','$alert','uiGridTreeViewConstants','i18nService','$timeout','addressGroupConfigService',
function($state,$scope,$rootScope,$http,$alert,uiGridTreeViewConstants,i18nService,$timeout,addressGroupConfigService){
	
}]);
