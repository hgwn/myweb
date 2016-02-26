/**
 * 
 */
entWarehouseoutModule.controller('selectSerialController',
		['$state','$scope','$rootScope','$http','$alert','$timeout', 'i18nService','masgetwebUtilService',
function($state, $scope, $rootScope, $http, $alert, $timeout, i18nService, masgetwebUtilService){
		i18nService.setCurrentLang('zh-cn');
		
        var paginationOptions = {
                sort: null
            };
        $scope.formData = {};
		
		$scope.serialGridOption = {
	          paginationPageSizes: [10, 20, 50, 100],
	          paginationPageSize: 20,
	          enableColumnMenus: false,
	          enableGridMenu: true,
	          enableRowSelection: true,
	          enableSelectAll: true,
	          selectionRowHeaderWidth: 35,
		      columnDefs: [
	          { name: '序号', enableHiding: false, field:'id',type:'text',enableHiding: false,
	        	  enableCellEdit: false , enableSorting: false, enableColumnResizing:false, width:'55', 
	        	  cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},           
		      { name: '序列号', width:'20%', field: 'serialnum'},
		      { name: '批次号',  field: 'batchcode'},
		      { name: '供应商名称', width:'30%',field: 'suppliername' }
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
            }
		};
		
        
        $scope.onClickToQuerySerial = function(){
        	$scope.getPage(1, 20, 0);
        }
        
        $scope.onClickToAddSerial = function(){
        	var result = $scope.gridApi.selection.getSelectedRows();
        	$scope.getSelectedGoodsData(result);
        	$('#select_serial').modal("hide");
        }
        
        var getPage = function(pagenum, pagesize, sort) {
            
            masgetwebUtilService.httpGet("/jsbweb/enterprise/stock/warehouseout/getGoodsSerial.do"
            		+"?pagesize="+pagesize + "&pagenum="+ pagenum, 
            	function(data){
            		console.log(data)
	        		if(data.ret == 0){
	        			var rows = [];
	        			angular.forEach(data.data.rows, function(serial){
	        				rows.push({
	        					serialnum:serial.serialnum,
	        					batchcode:serial.batchcode,
	        					suppliername:serial.suppliername
	        				});
	        			});
	        			
	        			$scope.serialGridOption.totalItems = rows.length;
	        			$scope.serialGridOption.data = rows; 
	        		}
        	});

        };
        $scope.getPage = getPage;
}]);