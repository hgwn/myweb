/**
 * 
 */
masgetWebApp.controller('selectGoodsController',
		['$state','$scope','$rootScope','$http','$alert','$timeout', 'i18nService', "warehouseinService",
function($state, $scope, $rootScope, $http, $alert, $timeout, i18nService, warehouseinService){
		i18nService.setCurrentLang('zh-cn');
		
        $scope.formData = {};
		
      //ui-grid of Tree View
    	$scope.goodsGridOption = {
              paginationPageSizes: [5, 10, 20, 50, 100],
              paginationPageSize: 20,
              useExternalPagination: true,
              useExternalSorting: false,
              enableColumnMenus: false,
              enableGridMenu: true,
	          enableRowSelection: true,
	          enableSelectAll: true,
	          selectionRowHeaderWidth: 35,
		      columnDefs: [
	          { name: '序号', enableHiding: false, field:'id',type:'text',enableHiding: false,
	        	  enableCellEdit: false , enableSorting: false, enableColumnResizing:false, width:'55', 
	        	  cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},           
		      { name: '商品编码', width:'20%', field: 'goodssn'},
		      { name: '商品',  field: 'productname'},
		      { name: '规格', width:'30%',field: 'goodsspec' }
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
        	$scope.queryParams = {};
            $scope.queryParams.pagenum = pagenum;
            $scope.queryParams.pagesize = pagesize;
            $scope.queryParams.keywords = $scope.formData.keywords;
            warehouseinService.httpPost(warehouseinService.getGoodsUrl("get"),{data : angular.toJson($scope.queryParams)},function(data){
            	if(data.ret == 0){
        			angular.forEach(data.data.rows,function(value,index){
        			    value.purchaseprice = value.shopprice;
        				//批次号中文名转换
        				if(value.productstockconfig.isbatchcode == 2){
        					value.productstockconfig.isbatchcodeName = "是";
        				}else if(value.productstockconfig.isbatchcode == 1){
        					value.productstockconfig.isbatchcodeName = "否";
        				}
        			});
        			$scope.goodsGridOption.totalItems = data.data.total;
        			$scope.goodsGridOption.data = data.data.rows; 
        		}else if(data.ret == 10){
                	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
                }else{
            		$alert({title: '提示：', content: '查询商品异常,'+data.message, placement: 'masget-top',type: 'info', duration:2, show: true});
            	}
            });
        };
        $scope.getPage = getPage;
        $scope.onClickToQueryGoods = function(){
        	$scope.getPage(1,$scope.gridOption.paginationPageSize);
        };
        $scope.onClickToQueryGoods();
        //清除所有选择的商品
        $scope.clearAll = function() {
            $scope.gridApi.selection.clearSelectedRows();
          };
        $scope.onClickToAddGoods = function(){
        	var result = $scope.gridApi.selection.getSelectedRows();
        	$scope.getSelectedGoodsData(result);
        	$scope.clearAll();
        	$('#viewModal-select-goods').modal("hide");
        };
        
}]);