/**
 * 
 */
entOrdersModule.controller('selectBatchcodeController',
		['$state','$scope','$rootScope','$http','$alert','$timeout', 'i18nService','masgetwebUtilService',
function($state, $scope, $rootScope, $http, $alert, $timeout, i18nService, masgetwebUtilService){
		i18nService.setCurrentLang('zh-cn');
		
        var paginationOptions = {
                sort: null
            };
        $scope.formData = {};
		
		$scope.batchcodeGridOption = {
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
		      { name: '批次号',  field: 'batchcode'},
		      { name: '供应商名称', field: 'suppliername' },
		      { name: '库存数量', field: 'leftgoodqty' },
		      { name: '生产日期', field: 'producetime' },
		      { name: '有效期', field: 'vailddate' }
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
		
        
        $scope.onClickToQueryGoods = function(){
        	$scope.getPage(1, 20, 0);
        }
        
        $scope.onClickToAddBatchcode = function(){
        	var result = $scope.gridApi.selection.getSelectedRows();
        	$scope.getSelectedBatchcodeData(result);
        	$('#select_batchcode').modal("hide");
        }
        
        var getPage = function(pagenum, pagesize, sort) {
            masgetwebUtilService.httpGet("/jsbweb/enterprise/stock/warehouseout/getGoodsBatchcode.do"
            		+"?pagesize="+pagesize + "&pagenum="+ pagenum, 
            	function(data){
            			console.log(data.data.rows);
	        		if(data.ret == 0){
	        			var rows = [];
	        			angular.forEach(data.data.rows, function(serial){
	        				rows.push({
	        					batchcode:serial.batchcode,
	        					suppliername:serial.suppliername,
	        					leftgoodqty:serial.leftgoodqty,
	        					producetime:serial.producetime,
	        					vailddate:serial.vailddate,
	        				});
	        			});
	        			
	        			$scope.batchcodeGridOption.totalItems = rows.length;
	        			$scope.batchcodeGridOption.data = rows; 
	        		}
        	});

        };
        $scope.getPage = getPage;
}]);