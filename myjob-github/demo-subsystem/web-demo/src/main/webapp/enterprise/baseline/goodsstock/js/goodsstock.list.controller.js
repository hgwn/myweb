goodsstockApp.controller('goodsstockListController',
		['$state','$scope','$rootScope','$http','goodsstockService','$alert','$timeout','i18nService','categoryService','masgetwebUtilService',
   function($state,$scope,$rootScope,$http,goodsstockService,$alert,$timeout,i18nService, categoryService,masgetwebUtilService){
	$scope.formData = {};
    $scope.formData.keywords ='';
    $scope.formData.categoryid ='';
    $scope.formData.queryTypes = [
		                                   {  displayid : 1, displayname : "按商品"},
		                                   {  displayid : 2, displayname : "按商品分类"}
                                   ];
    $scope.formData.queryType = 1;
    $scope.formData.queryTypeSelected = true;
    $scope.viewData={};
    $scope.viewData.goodsname='';
    i18nService.setCurrentLang('zh-cn');
    
    $scope.queryTypeChange = function()
    { 
    	  $scope.formData.queryTypeSelected = ($scope.formData.queryType == 1);
    };
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
    	
    	//默认不带条件，查询所有
    	$scope.queryGoodsStockList();
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
          useExternalPagination: true,
          useExternalSorting: false,
          enableGridMenu: true,
	      columnDefs: [
          { name: '序号',field:'id',type:'text',enableHiding: false,enableCellEdit: false , enableSorting: false, enableColumnResizing:false,  width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},

	      { name: '商品编码',field: 'goodssn' },
	      { name: '商品名称',  field: 'goodsname'},
	      { name: '规格', field: 'goodsspec' },
	      { name: '条形码', field:'barcode'},
	  /*    { name: '库存警戒线',field: 'maxinventory' ,type: 'number', enableCellEdit: false},*/
	      { name: '库存数量',field: 'goodqty' ,type: 'number'},
	      {name: '操作', enableHiding: false, field:'action', width: '12%',
			    cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">' +
			    '<a href="#" class="" ui-sref="goodsstockInOutGet({goodsid:row.entity.goodsid})" title="查看出入库明细">明细</a>&nbsp;&nbsp;'+
			    '<a href="#" class=""  ng-click="grid.appScope.viewGoodsstockBatch(grid,row.entity)"  title="查看批次明细" ng-if="row.entity.isbatchcode==2">批次</a>&nbsp;'+
			    '</div>'
			    }],
			    // ng-if="row.entity.companyid != row.entity.sessionid"
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
	
      //ui grid分页查询
        var getPage = function(pagenum, pagesize, sort) {
        	$scope.queryParams = {};
            $scope.queryParams.pagenum = pagenum;
            $scope.queryParams.pagesize = pagesize;
            
            if( $scope.formData.queryType==1)
            {
            	$scope.queryParams.keywords = $scope.formData.keywords;
            }
            else
            {
            	$scope.queryParams.categoryid = $scope.formData.categoryid;
            }
            
            goodsstockService.httpPost(goodsstockService.getGoodsStockList(),$scope.queryParams,function(data){
            	if(data.ret == 0){
        /*    		angular.forEach(data.data.rows,function(data,index){
            			data.goodsqty=data.goodqty;
            			if(null == data.checkqty || undefined == data.checkqty)
            			{
            				data.checkqty = 0;
            			}
            			else
            			{
            				data.differqty = data.checkqty -  data.goodqty;
            			}
            		});
            		*/
            		$scope.gridOption.data = data.data.rows;
            		$scope.gridOption.totalItems = data.data.total;
            	}else if(data.ret == 10){
                	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
                }else{
            		$alert({title: '提示：', content: '查询库存异常,'+data.message, placement: 'masget-top',type: 'info', duration:1, show: true});
            	}
            });
        };
        
        $scope.getPage = getPage;
      
        //查看商品批次明细
        $scope.viewGoodsstockBatch = function(grid,entity)
        {
        	$scope.detailQueryParams = {};
            $scope.detailQueryParams.pagenum = 1;
            $scope.detailQueryParams.pagesize = 100;
            $scope.detailQueryParams.goodsstockid = entity.goodsstockid;
            $scope.detailQueryParams.goodsid = entity.goodsid;
            $scope.viewData.goodsname=entity.goodsname;

        	//调用出库的精确查询接口
            goodsstockService.httpPost(goodsstockService.getGoodsStockBatchList(),$scope.detailQueryParams,function(data){
            	if(data.ret == 0){
            		//过滤掉数量为 0 的数据
            		var dataRows = data.data.rows;
            		angular.forEach(data.data.rows, function(value, index){
                       var goodqty = value.goodqty;
                        if(goodqty == undefined ||  goodqty== 0){
                        	dataRows.splice(index,1);
                        }
                    });
            		
            		$scope.viewData.batchList = dataRows;
            		$("#viewGoodsStockBatchDetailId").modal("show");
            	}else if(data.ret == 10){
                	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'warning', duration:4, show: true});
                }else{
            		$alert({title: '提示：', content: '查询商品出入库历史记录异常,'+data.message, placement: 'masget-top',type: 'warning', duration:4, show: true});
            	}
            });
        }
        
        //查询库存
        $scope.queryGoodsStockList=  function(){
        	$scope.getPage(1,$scope.gridOption.paginationPageSize);
        };
        
        //查询条件的初始化
        $scope.init();
        
        //查看某一个商品的详细出入库记录
//        $scope.goodsstockInOutGet=function(grid,goodsObject)
//        {
//        	$state.go("goodsstockInOutGet");
//        	$state.broadCast = { viewData : angular.copy(goodsObject)};
//        }
}])