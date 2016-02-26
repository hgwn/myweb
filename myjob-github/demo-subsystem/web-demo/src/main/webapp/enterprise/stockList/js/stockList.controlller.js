stockListApp.
controller('stockListController',['$scope','$timeout','$http','stockListService','$alert','uiGridTreeViewConstants','i18nService',
function($scope,$timeout,$http,stockListService,$alert,uiGridTreeViewConstants,i18nService){
	//tree data
	$scope.baseData = {};
	//树形菜单数组数据
	$scope.station_adbtree = [];
	$scope.baseData.stations = [];
	//ui-grid国际化
	i18nService.setCurrentLang('zh-cn');
		  
	//ui grid tree...start
    var paginationOptions = {
            sort: null
    };
    $scope.gridOption = {
        paginationPageSizes: [10, 20, 50, 100],
        paginationPageSize: 20,
        useExternalPagination: true,
        useExternalSorting: true,
        enableColumnMenus: false,
        enableRowSelection: true,
        enableSelectAll: true,
        selectionRowHeaderWidth: 35,
        columnDefs: [
			{ name: '操作', field: 'action', width: '8%', enableFiltering: false,
			    cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">' +
			    '<a href="#" class="" ng-click="grid.appScope.showStockListModal(grid,row.entity)" title="修改">明细</a>&nbsp;&nbsp;' +
			    '</div>'},
			{ name: '仓库名称',field:'warehousename'},
			{ name: '商品编码',field:'goodssn' },
            { name: '商品名称',field:'goodsname'},
            { name: '商品规格',field:'goodsspec'},
            { name: '商品条码',field:'barcode' },
            { name: '库存数量',field:'goodqty'}
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
    //ui grid tree...end
    //ui grid分页
    $scope.formData = {};
    //默认查询所有站点下的库存商品
    $scope.formData.stationid = 0;
    var getPage = function(pagenum, pagesize, sort) {
    	$scope.queryParams = {};
        $scope.queryParams.pagenum = pagenum;
        $scope.queryParams.pagesize = pagesize;
        //商品名称
        $scope.queryParams.warehouseid = $scope.formData.stationid;
        //商品名称
        $scope.queryParams.goodsname = $scope.formData.goodsname;
        //商品货号
        $scope.queryParams.goodssn = $scope.formData.goodssn;
        //商品条码
        $scope.queryParams.barcode = $scope.formData.barcode;

        stockListService.httpPost(stockListService.getGoodsStockUrl(),$scope.queryParams,function(data){
            if(data.ret==0){
            	$scope.gridOption.data = data.data.rows;
                $scope.gridOption.totalItems = data.data.total;
            }else if(data.ret==10){
            	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
            }        	
        });
    };
    $scope.getPage = getPage;
    $scope.getPage(1,$scope.gridOption.paginationPageSize);
    //点击查询按钮
    $scope.selectGoodsStock = function(){
    	$scope.getPage(1,$scope.gridOption.paginationPageSize);
    };
}])
.controller('stationAdbTreeController',['$scope','$http','stockListService','$alert',function($scope,$http,stockListService,$alert){
    //树的展开名称
    $scope.RecursiveAbnTreeChangeName = function(stations){
        var combotree = [];
        angular.forEach(stations, function(value, index){
            value.label = value.stationname;
            if(value.children != undefined && value.children.length > 0){
                $scope.RecursiveAbnTreeChangeName(value.children);
            }
            this.push(value);
        }, combotree);
        return combotree;
    };
	//递归分类
    $scope.getRecursive = function (nodes, arrayData, propertyId, propertyPid, pId, level, parentNode) {
        if (angular.isArray(arrayData) && arrayData.length == 0) return;
        var filterData = [];
        var result = {};
        if (!angular.isDefined(parentNode)) parentNode = {};
        for (var i = 0; i < arrayData.length; i++) {
            if (arrayData[i][propertyPid] != pId) {
                filterData.push(arrayData[i]);
            }
        }
        parentNode["" + nodes] = [];
        result["" + nodes] = [];
        for (var i = 0; i < arrayData.length; i++) {
            if (arrayData[i][propertyPid] == pId) {
                var node = jQuery.extend({}, arrayData[i]);
                arguments.callee(nodes, filterData, propertyId, propertyPid, node[propertyId], level + 1, node);
                if (level == 0) {
                    result["" + nodes].push(node);
                } else {
                    parentNode["" + nodes].push(node);
                }
            }
        }
        if (level == 0)
            return result["" + nodes];
    };
    //初始化树
    $scope.initAbnTree = function(){
        var abntree = $scope.RecursiveAbnTreeChangeName(angular.copy($scope.baseData.stations));
        var station_adbtree = {
            label:"全部",
            stationid:0,
            children: abntree
        };
        $scope.station_adbtree = [station_adbtree];
    };
    //页面初始化
	$scope.init = function(){
        $http({
            method : 'GET',
            url : stockListService.getStationUrl()
        }).success(function(data) {
        	if(data.ret == 10){
        		$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
        	}else if(data.ret == 0){
            	$scope.baseData.stationsData = data.data.rows;
                $scope.baseData.stations = $scope.getRecursive( "children", $scope.baseData.stationsData, 'stationid', 'pstationid', "0", 0);
                $scope.initAbnTree();        		
        	}
        });
    };
    $scope.init();	
    //树形菜单 触发事件
    $scope.my_tree_handler = function(branch){
    	$scope.formData.stationid = branch.stationid;
    	$scope.getPage(1,$scope.gridOption.paginationPageSize);
    };
}])
.controller('stockListModalController',['$rootScope','$scope','$http','stockListService','$alert','uiGridTreeViewConstants','i18nService',
function($rootScope,$scope,$http,stockListService,$alert,uiGridTreeViewConstants,i18nService){
	i18nService.setCurrentLang('zh-cn');
	//库存明细查询参数
	$scope.queryStockListParams = {};
	//弹出库存明细窗口
    $rootScope.showStockListModal = function(grid,myRow){
    	$("#stockListModal").modal("show");
    	$scope.queryStockListParams.goodsstockid = myRow.goodsstockid;
    	$scope.getPage(1,$scope.stockListGridOption.paginationPageSize);
    };
    //ui grid tree...start
    var paginationOptions = {
            sort: null
    };
    $scope.stockListGridOption = {
        paginationPageSizes: [10, 20, 50, 100],
        paginationPageSize: 20,
        useExternalPagination: true,
        useExternalSorting: true,
        enableColumnMenus: false,
        enableRowSelection: true,
        enableSelectAll: true,
        selectionRowHeaderWidth: 35,
        columnDefs: [
             { name: '批次号',field:'batchcode'},
             { name: '库存数量',field:'leftgoodqty'},
/*             { name: '损坏商品数量',field:'damageqty'},*/
             { name: '商品进货价',field:'purchaseprice'},
             /*{ name: '剩余完好商品数量',field:'leftgoodqty'},
             { name: '剩余损坏商品数量',field:'leftdamageqty'},*/
             { name: '生产日期',field:'producetime'}
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
    //ui grid tree...end
    //stockList列表分页
    var getPage = function(pagenum, pagesize, sort) {
    	$scope.queryStockListParams.pagesize = pagesize;
    	$scope.queryStockListParams.pagenum = pagenum;
    	//批次号
    	$scope.queryStockListParams.batchcode = $scope.formData.batchcode;
    	stockListService.httpPost(stockListService.getGoodsStockListUrl(),$scope.queryStockListParams,function(resp){
    		if(resp.ret==0){
            	$scope.stockListGridOption.data = resp.data.rows;
                $scope.stockListGridOption.totalItems = resp.data.total;
    		}
    	}); 
    };
    
    $scope.getPage = getPage;
    
}]);