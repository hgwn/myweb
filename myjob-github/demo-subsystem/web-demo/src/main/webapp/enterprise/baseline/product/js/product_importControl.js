/**
 * 
 */
entProductsModule.controller('importController',
		['$state','$scope','$rootScope','$http','$alert','$timeout', 'i18nService',
function($state, $scope, $rootScope, $http, $alert, $timeout, i18nService){
		i18nService.setCurrentLang('zh-cn');
		
        var paginationOptions = {
                sort: null
            };
        $scope.formData = {};
		
		$scope.gridImportOptions = {
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
		      { name: '编码',  field: 'goodssn'},
		      { name: '商品名称', field: 'productname' },
		      { name: '条形码', field: 'barcode' },
		      { name: '单位', field: 'goodsunitname' },
		      { name: '商品分类', field: 'categoryname' },
		      { name: '市场价', field: 'marketprice' },
		      { name: '销售价', field: 'shopprice' }
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
            /*masgetwebUtilService.httpGet("/jsbweb/enterprise/stock/warehouseout/getGoodsBatchcode.do"
            		+"?pagesize="+pagesize + "&pagenum="+ pagenum, 
            	function(data){
            			console.log(data.data.rows);
	        		if(data.ret == 0){
	        			
	        			$scope.batchcodeGridOption.totalItems = data.data.rows.length;
	        			$scope.batchcodeGridOption.data = data.data.rows; 
	        		}
        	});*/

        };
        $scope.getPage = getPage;
}]);