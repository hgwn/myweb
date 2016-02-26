/**
 * 
 */
entWarehouseoutModule.controller('selectGoodsController',
		['$state','$scope','$rootScope','$http','$alert','$timeout', 'i18nService','masgetwebUtilService',
function($state, $scope, $rootScope, $http, $alert, $timeout, i18nService, masgetwebUtilService){
		i18nService.setCurrentLang('zh-cn');
		
        var paginationOptions = {
                sort: null
            };
        $scope.formData = {};
		
		$scope.goodsGridOption = {
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
		      { name: '商品编码', width:'20%', field: 'goodssn'},
		      { name: '商品',  field: 'goodsname'},
		      { name: '规格', width:'30%',field: 'goodsspec' }
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
//	                $scope.gridApi.grid.refresh();
            }
		};
		
        var getPage = function(pagenum, pagesize, sort) {
        
        	
            $scope.queryParams.pagenum = pagenum;
            $scope.queryParams.pagesize = pagesize;
        }
        
        $scope.RecursiveComboTreeChangeName = function(classify){
            var combotree = [];
            angular.forEach(classify, function(value, index){
                value.id = value.categoryid;
                value.name = value.categoryname;
                if(value.children != undefined && value.children.length > 0){
                    $scope.RecursiveComboTreeChangeName(value.children);
                }
                this.push(value);
            }, combotree);
            return combotree;
        };

        $scope.collection = [];

        $scope.changeItem = function(value){
            $scope.activeComboItem = value;
            $scope.formData.categoryid = value.categoryid;
        }
        
        $scope.initComboTree = function(){
            var combotree = $scope.RecursiveComboTreeChangeName(angular.copy($scope.category));
            var combotreeCollection = {id:0, name:"全部分类", categoryid:0, categoryname:"全部分类"};
            combotreeCollection.children = combotree;
            $scope.combotreeCollection = [combotreeCollection];
        }
        
        $scope.init = function(){
        	masgetwebUtilService.httpGet(masgetwebUtilService.getQueryCategoryUrl()+ "?pagesize=1000&pagenum=1", function(data){
        		if(data.ret == 0){
        			$scope.category = data.data.rows; 
        			 $scope.initComboTree();
        		}
//        		combotreeCollection
        	});
        }
        
        $scope.onClickToQueryGoods = function(){
        	$scope.getPage(1, 20, 0);
        }
        
        $scope.onClickToAddGoods = function(){
        	var result = $scope.gridApi.selection.getSelectedRows();
        	console.log(result)
        	$scope.getSelectedGoodsData(result);
        	 $('#viewModal-select-goods').modal("hide");
        }
        
        var getPage = function(pagenum, pagesize, sort) {
            
            masgetwebUtilService.httpGet("/jsbweb/enterprise/baseline/warehouseout/getStockGoods.do"
            		+"?pagesize="+pagesize + "&pagenum="+ pagenum 
            		//+ "&categoryid=" + $scope.formData.categoryid
            		+ "&keywords=" + $scope.formData.keywords, 
            	function(data){
            		console.log(data)
	        		if(data.ret == 0){
	        			var rows = [];
	        			angular.forEach(data.data.rows, function(goods){
	        				rows.push({
	        					goodsname:goods.goodsname,
	        					goodssn:goods.goodssn,
	        					barcode:goods.barcode,
	        					goodsid:goods.goodsid,
	        					goodsspec:goods.goodsspec,
	    						goodsunitprice:goods.shopprice
	        					
	        				});
	        			});
	        			
	        			$scope.goodsGridOption.totalItems = rows.length;
	        			$scope.goodsGridOption.data = rows; 
	        		}
        	});

        };
        $scope.getPage = getPage;
        
        $scope.init();
}]);