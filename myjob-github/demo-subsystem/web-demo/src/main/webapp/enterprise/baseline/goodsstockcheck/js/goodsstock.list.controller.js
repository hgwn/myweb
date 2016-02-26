goodsstockcheckApp.controller('goodsstockListController',
		['$state','$scope','$rootScope','$http','goodsstockcheckService','$alert','$timeout','i18nService','categoryService','masgetwebUtilService',
   function($state,$scope,$rootScope,$http,goodsstockcheckService,$alert,$timeout,i18nService, categoryService,masgetwebUtilService){
	$scope.formData = {};
    $scope.formData.goodsname ='';
    $scope.formData.goodsstockchecknum = "";
    $scope.formData.issernum;
    i18nService.setCurrentLang('zh-cn');
    $scope.stockData={};
    $scope.stockData.warehouseoutlist = [];
    
    
    //商品分类级联
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

    //初始化商品分类树形结构
    $scope.initComboTree = function(){
        var combotree = $scope.RecursiveComboTreeChangeName(angular.copy($scope.category));
        var tree = [];
        var parentCategory = {id:0, name:"所有分类",categoryid:0,categoryname:"所有分类"};
        parentCategory.children = combotree;
        tree.push(parentCategory);
        
        $scope.classifycombotree = tree;
    }
    
    $scope.init = function(){
    	//页面数据的初始化
    	$scope.activeCategoryItem =  {id:0, name:"所有分类",categoryid:0,categoryname:"所有分类"};
    	
    	//获取订单单号 @未完成 此处订单单号后续需要修改为盘点专用的
    	//masgetwebUtilService.getOrderNum('306',function(data){$scope.formData.goodsstockchecknum  =data;},function(errordata){});
    	 
    	//查询商品分类
    	categoryService.httpGet(categoryService.getCategoryUrl()+ "?pagesize=100&pagenum=1",  function(data){
    		if(data.ret == 0){
    			$scope.category = data.data.rows;
    			$scope.initComboTree();
    		}else
    		{
                	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
    		}
    	});
    }
    
    $scope.changeItem = function (value) {

        $scope.activeCategoryItem = value;
        $scope.formData.categoryid = value.categoryid;
    };
    
	//ui-grid
	$scope.gridOption = {
          paginationPageSizes: [5, 10, 20, 50, 100],
          paginationPageSize: 20,
          enableSorting: false,
          enableColumnMenus: false,
          enableGridMenu: true,
	      columnDefs: [
          { name: '序号',field:'id',type:'text',enableHiding: false,enableCellEdit: false , enableSorting: false, enableColumnResizing:false,  width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},

          { name: '商品分类', field: 'categoryname',enableCellEdit: false},
	      { name: '商品编码',field: 'goodssn' ,enableCellEdit: false},
	      { name: '商品名称',  field: 'goodsname' ,enableCellEdit: false},
	      { name: '条形码', field:'barcode' ,enableCellEdit: false},
	      { name: '规格', field: 'remark' ,enableCellEdit: false},
	      { name: '系统库存',field: 'goodsqty' ,type: 'number', enableCellEdit: false},
	      { name: '盘点库存', field: 'checkqty' ,type: 'number',enableHiding: false,enableCellEdit: true,cellClass:'border1px'},
	      { name: '盘盈盘亏',  field: 'differqty',type: 'number',enableCellEdit: false }],
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
                
                //动态计算盘盈盘亏的值
                $scope.gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                	console.info(rowEntity);
                    rowEntity.differqty = parseFloat(newValue) - parseFloat(rowEntity.goodqty);
                    rowEntity.differqty = rowEntity.differqty.toFixed(2);
                	$scope.$apply();
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
                
                $scope.gridApi.grid.refresh();
            }
	};
      //ui grid分页查询
        var getPage = function(pagenum, pagesize, sort) {
        	if($scope.issernum){
        		$scope.formData.issernum = 1;
        	}
        	
        	$scope.queryParams = {};
            $scope.queryParams.pagenum = pagenum;
            $scope.queryParams.pagesize = pagesize;
            $scope.queryParams.goodsname = $scope.formData.goodsname;
            $scope.queryParams.categoryid = $scope.formData.categoryid;
            $scope.queryParams.issernum = $scope.formData.issernum;
            
            goodsstockcheckService.httpPost(goodsstockcheckService.getGoodsStockList(),$scope.queryParams,function(data){
            	if(data.ret == 0){
            		angular.forEach(data.data.rows,function(data,index){
            			data.goodsqty=data.goodqty;
            			if(null == data.checkqty || undefined == data.checkqty)
            			{
            				data.checkqty = 0;
            			}
            			
            			data.differqty = data.checkqty -  data.goodqty;
            		});
            		
            		$scope.gridOption.data = data.data.rows;
            		$scope.gridOption.totalItems = data.data.total;
            	}else if(data.ret == 10){
                	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
                }else{
            		$alert({title: '提示：', content: '查询采购单异常,'+data.message, placement: 'masget-top',type: 'info', duration:1, show: true});
            	}
            });
        };
        
        $scope.getPage = getPage;
      
        //查询库存
        $scope.queryGoodsStockList=  function(){
        	$scope.getPage(1,$scope.gridOption.paginationPageSize);
        };
        
        //跳转到入库或者出库单，进行出入库操作
		$scope.saveCheckDatas = function() {

								$scope.stockData.sourceflag = 3;
								$scope.stockData.state = 1;
								$scope.stockData.remark = "系统盘亏出库。";

								angular	.forEach(	$scope.gridOption.data,
												function(data, index) {
													var goodsqty = data.differqty;
													if (null != goodsqty&& goodsqty != undefined&& goodsqty != 0) {
														var warehouseoutlistJson = {};
														//如果盘点数据小于0 ，则为盘亏，做出库。
														if (goodsqty < 0) {
															warehouseoutlistJson.goodsid = data.goodsid;
															warehouseoutlistJson.goodsname = data.goodsname;
															warehouseoutlistJson.goodssn = data.goodssn;
															warehouseoutlistJson.barcode = data.barcode;
															warehouseoutlistJson.goodsqty = -data.differqty;
															warehouseoutlistJson.vailddate = data.vailddate;
															warehouseoutlistJson.batchcode = data.batchcode;
															warehouseoutlistJson.producetime = data.producetime;
														}
														//如果盘点数据大于0 ，则做盘盈入库
														else
														{
															
														}
														$scope.stockData.warehouseoutlist.push(warehouseoutlistJson);
													}

												});

								console.info($scope.stockData);

								// console.error($scope.stockData.warehouseoutlist);

								// $scope.insertParams = {};
								// $scope.insertParams.goodsstockchecknum =
								// $scope.formData.goodsstockchecknum;
								// $scope.insertParams.goodsstockchecklist
								// =$scope.gridOption.data;
								//            
								// if(null == $scope.formData.goodsstockchecknum
								// || undefined ==
								// $scope.formData.goodsstockchecknum)
								// {
								// $alert({title: '提示：',
								// content:'没有需要进行操作的数据字段！', placement:
								// 'masget-top',type: 'info', duration:4, show:
								// true});
								// }
								// var data =
								// {insertDatas:angular.toJson($scope.insertParams)};
								// goodsstockcheckService.httpPost(goodsstockcheckService.addGoodsStockCheckList(),data,function(data){
								// if(data.ret == 0){
								// $alert({title: '提示：', content: '添加盘点记录成功！',
								// placement: 'masget-top',type: 'success',
								// duration:4, show: true});
								// setTimeout("location.reload()",3000);
								// }else if(data.ret == 10){
								// $alert({title: '提示：', content: '请重新登录!',
								// placement: 'masget-top',type: 'info',
								// duration:4, show: true});
								// }else{
								// $alert({title: '提示：', content:
								// '添加盘点记录异常,'+data.message, placement:
								// 'masget-top',type: 'info', duration:4, show:
								// true});
								//            	}
								//            });

							};
        
        //查询条件的初始化
        $scope.init();
}])/*.
controller('goodsStockListController',['$state','$scope','$rootScope','$http','$alert','$timeout',
                                           function($state,$scope,$rootScope,$http,$alert,$timeout){
                                            
 }]);*/