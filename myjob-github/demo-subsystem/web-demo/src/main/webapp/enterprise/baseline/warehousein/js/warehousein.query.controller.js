/**
 * 
 */
masgetWebApp.controller('warehouseinQueryController',
		['$state','$scope','$rootScope','$http','$alert','$timeout', "i18nService", "warehouseinService",
function($state, $scope, $rootScope, $http, $alert, $timeout, i18nService, warehouseinService){
		i18nService.setCurrentLang('zh-cn');
		$scope.formData = {};
		$scope.auditData = {};
		$scope.sourceflagList = [
             	 {sourceflag:0, sourceflagname:"全部"},
		         {sourceflag:1, sourceflagname:"采购入库"},
		         {sourceflag:2, sourceflagname:"手工入库"},
		         {sourceflag:3, sourceflagname:"盘盈入库"}
		      ];
		$scope.formData.sourceflag = 0;
        var paginationOptions = {
                sort: null
            };
		$scope.gridOption = {
	   	      expandableRowTemplate: 'template/expandableRowTemplate.html',
			  expandableRowHeight: 200,
	          paginationPageSizes: [10, 20, 50, 100],
	          paginationPageSize: 20,
	          useExternalPagination: true,
	          enableColumnMenus: false,
	          enableGridMenu: true,
		      columnDefs: [
	          { name: '序号', enableHiding: false, field:'id',type:'text',enableHiding: false,
	        	  enableCellEdit: false , enableSorting: false, enableColumnResizing:false, width:'55', 
	        	  cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},           
		      { name: '单号', field: 'warehouseinnum'},
		      { name: '仓库', width:'15%', field: 'warehousename'},
		      { name: '时间', width:'15%', field: 'createdtime' },
		      { name: '类型', width: '15%', field: 'sourceflagName' },
		      { name: '状态', width:'15%', field:'stateName' },
			  { name: '操作', width:'10%', field:'action', enableFiltering: false,
				    cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">'
				    	+ '<a href="#" class="" ng-click="grid.appScope.viewData(row.entity)"><span class="glyphicon glyphicon-eye-open blue"></span></a>&nbsp;'
				    	+ '</div>'
			    	},  
		      ],
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
                gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                    if (row.isExpanded) {
                        row.entity.subGridOptions = {
                   		 useExternalPagination: true,
                            useExternalSorting: false,
                            enableSorting : false,
                      		enableColumnMenus: false,	 
                            columnDefs: [
                                { name: '商品编码',field:'goodssn'},
                                { name: '商品名称',field:'goodsname'},
                                { name: '进货价',field:'purchaseprice'},
                                { name: '条形码',field:'barcode'},
                                { name: '批次号',field:'batchcode'},
                                { name: '数量',field:'goodsqty'}
                            ]};
                        	row.entity.subGridOptions.data = row.entity.warehouseinlist;
                    }
                });
                $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                    if(getPage) {
                        if (sortColumns.length > 0) {
                            paginationOptions.sort = sortColumns[0].sort.direction;
                        } else {
                            paginationOptions.sort = null;
                        }
                        getPage(grid.options.paginationCurrentPage, grid.options.paginationPageSize, paginationOptions.sort)
                    }
                });
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    if(getPage) {
                        getPage(newPage, pageSize, paginationOptions.sort);
                    }
                });
            }
		};
		//ui grid分页
	    var getPage = function(pagenum, pagesize, sort) {
	    	 $scope.formData.pagenum = pagenum;
             $scope.formData.pagesize = pagesize;
             $scope.formData.orders = ['createdtime'];
             $scope.formData.orderkey = 'desc';
            /* var tempdata = $scope.formData.endcreatedtime;
             
             if($scope.formData.endcreatedtime != undefined)
             	$scope.formData.endcreatedtime = $scope.formData.endcreatedtime +' 23:59:59';*/
             
             warehouseinService.httpPost(warehouseinService.getQueryWarehouseinUrl(), {data : angular.toJson($scope.formData)}, function(resp){
            	 if(resp.ret == null){
            		 
            	 }else if(resp.ret == 0){
            		 angular.forEach(resp.data.rows,function(data,index){
            			 if(data.sourceflag == 1){
            				 data.sourceflagName = '采购入库';
            			 }else if(data.sourceflag == 2){
            				 data.sourceflagName = '手工入库';
            			 }else if(data.sourceflag == 3){
            				 data.sourceflagName = '盘盈入库';
            			 }
            			 if(data.state == 1){
            				 data.stateName = '待审核';
            			 }else if(data.state == 2){
            				 data.stateName = '审核通过';
            			 }else if(data.state == 3){
            				 data.stateName = '审核不通过';
            			 }
            		 });
            		 $scope.gridOption.totalItems = resp.data.total;
            		 $scope.gridOption.data = resp.data.rows;
            	 }else{
            		 $alert({title: '提示：', content: '查询异常,'+resp.message, placement: 'masget-top',type: 'info', duration:2, show: true});
            	 }
             });
             /*$scope.formData.endcreatedtime = tempdata;*/
	    };
	    $scope.getPage = getPage;
	    $scope.getPage(1,$scope.gridOption.paginationPageSize);
	    //查询
	    $scope.queryForm = function(){
	    	$scope.getPage(1, $scope.gridOption.paginationPageSize);
	    };
	    //查看明细
	    $scope.viewData = function(entity){
	    	console.log(entity);
	    	$state.go("warehousein_detail");
	    	warehouseinService.setData(entity);
	    };
	    //审核弹窗
	    $scope.audit = function (entity){
	    	console.log(entity);
	    	$scope.auditData = entity;
	    	$("#warehouseInAuditModal").modal("show");
	    };

}])
.controller('warehouseinDetailController',
		['$state','$scope','$rootScope','$http','$alert','$timeout', "i18nService", "warehouseinService",
 function($state, $scope, $rootScope, $http, $alert, $timeout, i18nService, warehouseinService){
		$scope.viewData = {};
		$scope.viewData = warehouseinService.getData();
		$scope.returnToList = function() {
			$state.go("warehousein");
		};
		//明细信息 ui-grid of Tree View
		$scope.gridOptionDetail = {
	        enableColumnMenus: false,
	        enableGridMenu: true,
		    columnDefs: [
	        { name: '序号', enableHiding: false, field:'id',type:'text',enableHiding: false,enableCellEdit: false , enableSorting: false, enableColumnResizing:false,  width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
	        { name: '商品编码',field:'goodssn'},
	        { name: '商品名称',field:'goodsname'},
            { name: '进货价',field:'purchaseprice'},
            { name: '条形码',field:'barcode'},
            { name: '批次号',field:'batchcode'},
            { name: '数量',field:'goodsqty'}
	    ]};
		$scope.gridOptionDetail.data = $scope.viewData.warehouseinlist;
		$scope.gridOptionDetail.totalItems = $scope.viewData.warehouseinlist.length;
	    //审核
	    $scope.auditOk = function(state){
	    	$scope.auditData.state = state;
	    	$scope.auditData.warehouseinid =  $scope.viewData.warehouseinid;
	    	$scope.auditData.warehouseinnum = $scope.viewData.warehouseinnum;
            warehouseinService.httpPost(warehouseinService.getAuditWarehousein(),{data : angular.toJson($scope.auditData)},function(data){
            	if(data.ret == 0){
            		$alert({title: '提示：', content: '审核成功!', placement: 'masget-top',type: 'info', duration:2, show: true});
        		    $state.go("warehousein");
            	}else if(data.ret == 10){
                	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
                }else{
            		$alert({title: '提示：', content: '审核异常,'+data.message, placement: 'masget-top',type: 'info', duration:2, show: true});
            	}
            });
	    };
}]);