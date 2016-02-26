/**
 * Created by Administrator on 2015-08-27.
 */
entWarehouseoutModule.controller("entWarehouseoutController",
    ['$scope','$rootScope','$http',"$stateParams","$state","i18nService",
        function($scope, $rootScope, $http,$stateParams,$state,i18nService) {
    	i18nService.setCurrentLang('zh-cn');
    	$scope.formData = {};
    	$scope.parameter = [];
    	$scope.temp_parameter=[];
    	$scope.queryParams={pagesize:20,pagenum:1};
    	$scope.topformData = {title:"新增参数"};
    	$scope.viewData = {};//用于存放查看明细数据
    	
        $scope.sourceflags = [
            { id: 1, value: "销售出库" },
            { id: 2, value: "其他出库" },
            { id: 4, value: "盘亏" }
        ];
        var jsonData={"message": "查询成功",
                      "ret": 0,
                      "data": {
                        "total": 1,
                        "rows": [
                          {
		        		    "warehouseoutnum": "31100805104743786",
		        		    "createdby": "小李",
		        		    "createdtime": "2015-10-16",
		        		    "sourceflag": 1,
		        		    "warehouseoutlist": [
		                             {
		                            "warehouseoutlistid":1,
		   		        		    "goodsid":1,
		   		        		    "goodsname":"苹果",
		   		        		    "goodssn":"001",
		   		        		    "goodsspec":"土豪金",
		   		        		    "actualqty": 10
		   		        		    
	   		        		  }]
		        		  }]}
	        		};
    	
    	//加载数据源汇总
        $http
            .get("../../enterprise/stock/warehouseout/getWarehouseout.do?pagesize=20&pagenum=1")
            .success(function (data) {
            	//data=jsonData;
            	console.log(data);
            	if (data.ret == 0) {
	            	var result =angular.copy(data.data.rows);
	            	/*angular.forEach(result, function (value, key) {
	            		value.parametername ='';
	            		angular.forEach(value.parameter, function (smallValue, smallKey) {
	            			value.parametername = value.parametername + smallValue.parametername + " ";
	            		});
	        		});*/
	                $scope.WarehouseoutgridOptions.data = result;
	                $scope.WarehouseoutgridOptions.totalItems = data.data.total;
            	}
                if (data.ret == 1000) {
                    $.jBox.tip("请先登录", 'warning');
                }
            });
      
        //查询
        $scope.onClickToQuery = function(){
        	 $http({
                 method : 'POST',
                 url : "/jsbweb/enterprise/stock/warehouseout/getWarehouseout.do",
                 data : $.param($scope.queryParams),
                 headers : {
                     'Content-Type' : 'application/x-www-form-urlencoded'
                 }
             }).success(function(data) {
                 if(data.ret==0){
                	var result = data.data.rows;
                    $scope.WarehouseoutgridOptions.data = result; 
             		$scope.WarehouseoutgridOptions.totalItems = data.data.total;
             		
                 }else if(data.ret==10){
                     $.jBox.tip("请先登录", 'warning');
                 }else{ 
                     $.jBox.tip("获取数据失败", 'warning');
                 }
             }).error(function(rep){
                 $.jBox.tip("获取数据失败", 'warning');
             });
        }
        
    	
    	//展示页面
        
    	$scope.WarehouseoutgridOptions = { 
			 paginationPageSizes: [10, 20, 50, 100],
             paginationPageSize: 20,
             useExternalPagination: true,
             useExternalSorting: false,
             enableSorting : false,
       		 enableColumnMenus: false,
       		 columnDefs : [
       		                { name: '序号',field:'id', width:60,cellTemplate:
								'<div class="ui-grid-cell-contents" style="text-align:center">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
							},
       		                { name: '单号',field:'warehouseoutnum',enableCellEdit: false},
	       		            { name: '日期',field:'createdtime',enableCellEdit: false, cellTemplate:
	       		            	'<div class="ui-grid-cell-contents">{{row.entity.createdtime|limitTo:19}}</div>'
	       		            },
       		                { name: '类型',field:'sourceflag',enableCellEdit: false,cellTemplate:
	       		            	'<div class="ui-grid-cell-contents">{{grid.appScope.getSourceflag(row.entity.sourceflag)}}</div>'},
	       		            { name: '状态', width:'15%', field:'statename' },
	       		            { name: '制单人',field:'createdname',enableCellEdit: false},
       		                { name: '操作',field:'action',
       		                    cellTemplate: '<div class="ui-grid-cell-contents">' +
       		                '<a role="button" ng-click="grid.appScope.viewWarehouseout(row.entity)" data-target="#warehouseout_view" data-toggle="modal" title="查看明细">查看明细</a>' +
       		                '</div>',width:'100',enableCellEdit: false }
       		               ],
       		            onRegisterApi: function(gridApi) {
       		                $scope.gridApi = gridApi;
       		                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
       		                    if(getPage) {
       		                        getPage(newPage, pageSize);
       		                    }
       		                });
       		            }
        };
    	
    	var getPage = function(pagenum, pagesize) {
            $scope.queryParams.pagenum = pagenum;
            $scope.queryParams.pagesize = pagesize;
            $scope.onClickToQuery();
        };
        $scope.getPage = getPage;
    	
    	//新增方法切换界面
    	$scope.onBtnClickAdd = function(){
    		$state.go("addWarehouseout");
    	}
    	
    	
    	//查看详细
    	$scope.viewWarehouseout = function(myRow){
    		$scope.viewData=myRow;
    	};
    	
    	$scope.getSourceflag = function(sourceflag){
            switch (sourceflag){
                case 1:
                {
                    return "销售出库";
                }
                case 2:
                {
                    return "其他出库";
                }
                case 3:
                {
                    return "盘亏";
                }
            }
        }
    }]);