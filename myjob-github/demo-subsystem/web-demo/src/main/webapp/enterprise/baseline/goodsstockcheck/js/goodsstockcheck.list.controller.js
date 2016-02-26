goodsstockcheckApp.controller('goodsstockcheckListController',['$state','$scope','$rootScope','$http','goodsstockcheckService','$alert','$timeout','i18nService',
   function($state,$scope,$rootScope,$http,goodsstockcheckService,$alert,$timeout,i18nService){
	$scope.formData = {};
	var currentDate  = new Date();
	var currentDateStr = currentDate.getFullYear() + '-' + (currentDate.getMonth()+1) + '-' + currentDate.getDate();
    $scope.formData.begincreatedtime = currentDateStr;
    $scope.formData.endcreatedtime = currentDateStr;
    i18nService.setCurrentLang('zh-cn');
    
	//ui-grid 
	$scope.gridOption = {
          paginationPageSizes: [5, 10, 20, 50, 100],
          paginationPageSize: 20,
          enableSorting: false,
          enableColumnMenus: false,
          enableGridMenu: true,
	      columnDefs: [
          { name: '序号',field:'id',type:'text',enableHiding: false,enableCellEdit: false , enableSorting: false, enableColumnResizing:false,  width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
          { name: '单号', field: 'goodsstockchecknum'},
	      { name: '日期',field:'createdtime', cellTemplate:
	          	'<div class="ui-grid-cell-contents">{{row.entity.createdtime|limitTo:10}}</div>'
	          },
	      { name: '制单人',  field: 'createdbyname' },
	      { name: '操作', enableHiding: false, field:'action', width: '9%', enableFiltering: false,
			    cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">' +
			    '<a href="#" class="" ng-click="grid.appScope.viewGoodsStockCheckDetail(grid,row.entity)" title="查看">查看明细</a>&nbsp;'+
			    '</div>'}],
	      
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
        	$scope.queryParams = {};
            $scope.queryParams.pagenum = pagenum;
            $scope.queryParams.pagesize = pagesize;
            $scope.queryParams.begincreatedtime = $scope.formData.begincreatedtime;
            $scope.queryParams.endcreatedtime = $scope.formData.endcreatedtime;
            
            goodsstockcheckService.httpPost(goodsstockcheckService.getGoodsStockCheckList(),$scope.queryParams,function(data){
            	console.info(data);
            	if(data.ret == 0){
            		$scope.gridOption.data = data.data.rows;
            		$scope.gridOption.totalItems = data.data.total;
            	}else if(data.ret == 10){
                	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'warning', duration:4, show: true});
                }else{
            		$alert({title: '提示：', content: '查询盘点历史异常,'+data.message, placement: 'masget-top',type: 'warning', duration:4, show: true});
            	}
            });
        };
        
        $scope.getPage = getPage;
        
        //查询盘点记录
        $scope.queryGoodsStockCheckList=  function(){
          $scope.getPage(1,$scope.gridOption.paginationPageSize);
        };
        //跳转至新增盘点记录页面
        $scope.addGoodsStockCheck=  function(){
        	$state.go("goodsstockcheckAdd");
        };
        //查看盘点明细
        $scope.viewGoodsStockCheckDetail = function(grid,entity){
        	$scope.checkDetailLists = entity;
        	/*angular.forEach($scope.edit_datas.purchaseorderlist,function(data,index,array){
        		data.itemSum = parseFloat(data.dealingprice) * data.dealingprice();
        	});*/
        	console.info(entity);
    		$timeout(function(){
    			$("#viewGoodsStockCheckDetailId").modal("show");
    			/*$rootScope.recoverAddress();*/   			
    		},200);
        };
}]).
controller('goodsstockcheckDetailController',['$state','$scope','$rootScope','$http','$alert','$timeout',
                                           function($state,$scope,$rootScope,$http,$alert,$timeout){
	//查看明细的control
 }]);