goodsstockApp.controller('goodsstockListController',
		['$state','$scope','$rootScope','$http','goodsstockService','$alert','$timeout','i18nService','categoryService','masgetwebUtilService',
   function($state,$scope,$rootScope,$http,goodsstockService,$alert,$timeout,i18nService, categoryService,masgetwebUtilService){
	$scope.formData = {};
	$scope.formData.inoutParams = {};
    $scope.formData.keywords ='';
    $scope.viewData={};
    $scope.viewData.goodsname='';
    i18nService.setCurrentLang('zh-cn');
    $scope.formData.goodsid = 0;
    //加载经销商
    $scope.getSubcompany = function(){
    	$scope.data = {};
        $scope.data.pagenum = 1;
        $scope.data.pagesize = 500;
        $scope.data.enableflag = 2;
        var data = { data: angular.toJson($scope.data)};
        goodsstockService.httpPost(goodsstockService.getSubcompany(),data,function(data){
        	console.log(data);
        	if(data.ret == 0){
        		$scope.formData.subCompanyList = data.data.rows;
        		if($scope.formData.subCompanyList.length != 0){
        			$scope.formData.subcompanyid = $scope.formData.subCompanyList[0].subcompanyid;
        			$scope.queryExternalGoods($scope.formData.subcompanyid);
        		}
        	}else if(data.ret == 10){
            	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
            }else{
        		$alert({title: '提示：', content: '查询经销商异常,'+data.message, placement: 'masget-top',type: 'info', duration:1, show: true});
        	}
        });
    };
    $scope.getSubcompany();
    //获取供应商的companyid、warehouseid
    $scope.getCWid = function(companyid){
    	$scope.formData.inoutParams.companyid = companyid;
    	angular.forEach($scope.formData.subCompanyList,function(data,index){
    		if(data.subcompanyid == companyid){
    			$scope.formData.inoutParams.warehouseid = data.substationid;
    			goodsstockService.setData($scope.formData.inoutParams);
    		}
    	});
    };
    //获取商品信息
    $scope.queryExternalGoods = function(companyid){
    	$scope.getCWid(companyid);
        if(companyid == undefined || companyid == ""){
        	$alert({title: '提示：', content: '请选择经销商!', placement: 'masget-top',type: 'info', duration:1, show: true});
        	return;
        }
    	var param = {
			pagenum:1,
			pagesize:550,
			onlineflag : 1,
			companyid: companyid
    	};
    	
        $http({
            method : 'POST',
            url : "/jsbweb/enterprise/baseline/goods/getExternal.do",
            data : $.param({data:angular.toJson(param)}),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {
        	console.info("商品信息");
            console.info(data);
            if(data.ret==0){
            	$scope.formData.externalGoods = [];
            	data.data.rows.push({goodsid:0,goodsname:"全部商品"});
                $scope.formData.externalGoods = data.data.rows;
                console.log($scope.formData.externalGoods);
            }else if(data.ret==10){
                $alert({title: '提示：', content: '请先登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
            }
        });
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
	      { name: '库存数量',field: 'goodqty' ,type: 'number'},
	      {name: '操作', enableHiding: false, field:'action', width: '12%',
			    cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">' +
			    '<a href="#" class="" ui-sref="goodsstockInOutGet({goodsid:row.entity.goodsid})" title="查看出入库明细">明细</a>&nbsp;&nbsp;'+
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
            if($scope.formData.subcompanyid == null || $scope.formData.subcompanyid == "")
            	$alert({title: '提示：', content: '请选择供应商!', placement: 'masget-top',type: 'info', duration:1, show: true});
            $scope.queryParams.companyid = $scope.formData.subcompanyid;
            if($scope.formData.goodsid != 0)
            	$scope.queryParams.goodsid = $scope.formData.goodsid;
            goodsstockService.httpPost(goodsstockService.getGoodsHeadquartersStockList(),{data:angular.toJson($scope.queryParams)},function(data){
            	if(data.ret == 0){
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
        $scope.init = function(){
        	//默认不带条件，查询所有
        	$timeout(function(){
        		$scope.queryGoodsStockList();
        	},600);
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