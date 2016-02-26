goodsstockApp.controller('goodsstockInOutController',['$state','$scope','$rootScope','$http','goodsstockService','$alert','$timeout','i18nService','$stateParams','categoryService',
   function($state,$scope,$rootScope,$http,goodsstockService,$alert,$timeout,i18nService,$stateParams,categoryService){
//	$scope.parentData = $state.broadCast.viewData;
	$scope.formData = {};
	$scope.subCompany = goodsstockService.getData();
	console.log($scope.subCompany);
	console.log(110119);
	//定义表单数据对象
	//初始化时间
	var dayTime=60*60*24*1000*30;
	var afterdayTime=60*60*24*1000*1;
	var backTime=new Date().getTime()-dayTime;
	var afterTime = new Date().getTime()+afterdayTime;
	$scope.formData={
			pageNum:1,
			pageSize:10,
			begincreatedtime:new Date(backTime).format("yyyy-MM-dd"),
			endcreatedtime:new Date(afterTime).format("yyyy-MM-dd")
	};
	
    $scope.formData.keywords ='';
    $scope.formData.categoryid ='';
    $scope.formData.goodsid =$stateParams.goodsid;
    $scope.viewData ={};
    $scope.formData.notHasGoodsId = true;
    $scope.formData.queryTypes = [
		                                   {  displayid : 1, displayname : "按商品"},
		                                   {  displayid : 2, displayname : "按商品分类"}
                                   ];
    $scope.formData.queryType = 1;
    $scope.formData.queryTypeSelected = true;
    $scope.formData.queryTypeSelected1 = false;
    i18nService.setCurrentLang('zh-cn');
    
    
    $scope.queryTypeChange = function()
    { 
    	  $scope.formData.queryTypeSelected = ($scope.formData.queryType == 1);
    	  $scope.formData.queryTypeSelected1 =($scope.formData.queryType != 1);
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
    	//如果是从其他页面跳转过来，且 parentData不为空，即查询条件中的商品分类，id等已经确定，不可以选择
    	if($scope.formData.goodsid>0){
//    		console.info($scope.formData.goodsid);
    		$scope.formData.notHasGoodsId = false;
    		$scope.formData.queryTypeSelected1 = false;
    		$scope.formData.queryTypeSelected = false;
    		$scope.queryGoodsStockInOutList();
    	}
    	else
    	{
    		$scope.formData.hasGoodsId = false;
    		$scope.formData.queryTypeSelected1 = false;
    		$scope.formData.queryTypeSelected = true;
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
	    }
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
          { name: '商品编码',field: 'goodssn' ,enableCellEdit: false},
	      { name: '商品名称',  field: 'goodsname' ,enableCellEdit: false},
	      { name: '规格', field: 'goodsspec' ,enableCellEdit: false},
	      { name: '类型', field: 'typeName' ,enableCellEdit: false},
          { name: '单号', field: 'ordernum',enableHiding: false,enableCellEdit: false , enableSorting: false, enableColumnResizing:true, width:'15%'
        	  /*,cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{row.entity.ordernum}}&nbsp;'*/},
	      { name: '日期',field:'createdtime', cellTemplate:
          	'<div class="ui-grid-cell-contents">{{row.entity.createdtime|limitTo:10}}</div>'
          },
	      { name: '出入库数量',  field: 'goodsqty' },
	      { name: '库存数量',  field: 'inventoryqty' }],
	      
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
            $scope.queryParams.companyid = $scope.subCompany.companyid;
            $scope.queryParams.warehouseid = $scope.subCompany.warehouseid;
            if( $scope.formData.goodsid>0)
            {
            	$scope.queryParams.goodsid=$scope.formData.goodsid;
            }
            else if( $scope.formData.queryType==1)
            {
            	$scope.queryParams.keywords = $scope.formData.keywords;
            }
            else
            {
            	$scope.queryParams.categoryid = $scope.formData.categoryid;
            }
            
            goodsstockService.httpPost(goodsstockService.getGoodsStockInOutList(),$scope.queryParams,function(data){
//            	console.info(data);
            	if(data.ret == 0){
                		angular.forEach(data.data.rows,function(data,index){
                			if(2 == data.type)
                			{
                				data.typeName = "出库";
                			}
                			else
                			{
                				data.typeName = "入库";
                			}
                		});
            		$scope.gridOption.data = data.data.rows;
            		$scope.gridOption.totalItems = data.data.total;
            		console.log($scope.gridOption.data);
            		console.log(22333);
            	}else if(data.ret == 10){
                	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'warning', duration:4, show: true});
                }else{
            		$alert({title: '提示：', content: '查询商品出入库历史记录异常,'+data.message, placement: 'masget-top',type: 'warning', duration:4, show: true});
            	}
            });
        };
        
        $scope.getPage = getPage;
        
        //查询出入库记录
        $scope.queryGoodsStockInOutList=  function(){
          $scope.getPage(1,$scope.gridOption.paginationPageSize);
        };
        
        //返回查询商品库存页面
        $scope.backGoodsStockList=function() {
        	$state.go("goodsstockGet");
        }
        
        //数字是否转换 1 --否，2--是
        $scope.tranNum2BolleanStr=  function(num){
           if(1==num)
           {
        	   return "否";
           }
           else if(2==num)
           {
        	   return "是";
           }
        };
 
        //初始化查询条件等
        $scope. init();
}]);