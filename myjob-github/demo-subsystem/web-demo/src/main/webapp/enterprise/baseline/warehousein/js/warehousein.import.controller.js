/**
 * 
 */
masgetWebApp.controller('warehouseinImportController',
		['$state','$scope','$rootScope','$http','$alert','$timeout', "i18nService", "warehouseinService",
function($state, $scope, $rootScope, $http, $alert, $timeout, i18nService, warehouseinService){
		i18nService.setCurrentLang('zh-cn');
		$scope.formData = {};
		$scope.sourceflag = [
		         {sourceflag:1, sourceflagname:"手工入库"},
		         {sourceflag:2, sourceflagname:"采购入库"},
		         {sourceflag:3, sourceflagname:"盘盈入库"},
		         {sourceflag:4, sourceflagname:"退货入库"},
		      ];
		
		$scope.gridOption = {
	          paginationPageSizes: [10, 20, 50, 100],
	          paginationPageSize: 20,
	          enableColumnMenus: false,
	          enableGridMenu: true,
		      columnDefs: [
	          { name: '序号', enableHiding: false, field:'id',type:'text',enableHiding: false,
	        	  enableCellEdit: false , enableSorting: false, enableColumnResizing:false, width:'55', 
	        	  cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},           
		      { name: '单号', width:'20%', field: 'warehouseinnum'},
		      { name: '仓库', width:'15%', field: 'warehousename'},
		      { name: '时间', width:'15%',field: 'createdtime' },
		      { name: '类型', width: '15%', field: 'ordersource' },
		      { name: '制单人', width:'15%', field:'createdbyname' },
			  { name: '操作', field:'action', enableFiltering: false,
				    cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">'
				    	+ '<a href="#" class="" ng-click="grid.appScope.viewDetail(row.entity)">查看明细</a>&nbsp;'
				    	+ '</div>'
				    	},  
		      ],
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
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
                $scope.gridApi.grid.refresh();
            }
		};
		//ui grid分页
	    var getPage = function(pagenum, pagesize, sort) {
	    	 $scope.formData.pagenum = pagenum;
             $scope.formData.pagesize = pagesize;
             $scope.formData.orders = 'createdtime';
             $scope.formData.orderkey = 'desc';
             var tempdata = $scope.formData.endcreatedtime;
             if($scope.formData.endcreatedtime != undefined)
             	$scope.formData.endcreatedtime = $scope.formData.endcreatedtime +' 23:59:59';
             
             warehouseinService.httpPost(warehouseinService.getQueryWarehouseinUrl(), $scope.formData, function(resp){
            	 $scope.gridOption.data = resp.data.rows;
            	 $scope.gridOptions.totalItems = resp.data.total;
             });
             
//             $scope.formData.endcreatedtime = tempdata;
             
	    };
	    $scope.getPage = getPage;
	    $scope.getPage(1,$scope.gridOption.paginationPageSize);
	    
	    $scope.viewDetail = function(row){
	    	
	    }
	    
	    $scope.queryForm = function(){
	    	$scope.getPage(1, $scope.gridOption.paginationPageSize);
	    }
}]);