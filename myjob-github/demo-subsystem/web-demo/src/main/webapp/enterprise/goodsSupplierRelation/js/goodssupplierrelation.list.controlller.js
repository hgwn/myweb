goodsSupplierRelationApp.
controller('goodsSupplierRelationController',['$state','$scope','$rootScope','$http','goodsSuplierRelationService','$alert','$state','utils','uiGridTreeViewConstants','i18nService',
function($state,$scope,$rootScope,$http,goodsSuplierRelationService,$alert,$state,utils,uiGridTreeViewConstants,i18nService){
	i18nService.setCurrentLang('zh-cn');
	//供应商下拉表格start
	$scope.getSuppliers = function(pagesize,pagenum,companyname){
		var data = {};
		data.scenetypeid = 2;
		data.pagesize = pagesize;
		data.pagenum = pagenum;
		data.companyname = companyname;	
		goodsSuplierRelationService.httpPost(goodsSuplierRelationService.getGetAllSuppliers(),data,function(resp){
			$scope.datas = resp.data.rows;
			$scope.formData.total = resp.data.total;
		});	
	};
    $scope.query = function () {
    	$scope.formData.keyWord=$scope.formData.keyWord==null?"":$scope.formData.keyWord;
        //console.info("查询-参数:keyWord:"+$scope.formData.keyWord+",pagesize:"+$scope.formData.pagesize+",pagenum:"+$scope.formData.pagenum);
        $scope.getSuppliers($scope.formData.pagesize,$scope.formData.pagenum,$scope.formData.keyWord);
    };
    $scope.supplier={};
    $scope.$watch("supplier",function(){
        /*$scope.companyid = $scope.supplier.companyid;
        $scope.staffid = $scope.supplier.staffid;
        $scope.staffname = $scope.supplier.staffname;*/
    });
    //在comboxtable里的文本框输入是触发的方法
    $scope.onReset = function(){
    	$scope.supplier={};
    };
    //供应商下拉表格end
    
    //获取商品分类信息start
	$scope.formData = {};
	$scope.formData.classifyid = 0;
	$scope.searchGoodsClassify = function(){
	    var url = goodsSuplierRelationService.getGetCompanyGoodsClassifyUrl()+"?parentid=";
	    goodsSuplierRelationService.httpGet(url,function(data){
			if(data.ret == 0){
				//给商品分类增加一个默认分类
				$scope.newObject = {
						parentid:0,
						companygoodsclassifyid:0,
						companygoodsclassifyname:'空'
				};
				$scope.goodsClassifyLists = angular.copy(data.data.rows);
				$scope.goodsClassifyLists.push($scope.newObject);
				var classify = utils.arrayDataToTree($scope.goodsClassifyLists,'companygoodsclassifyid', 'parentid', "0", 0);
				var array = [];
				function text(classify){
					for(var i=0; i<classify.length;i++){
						var a = classify[i];
						array.push({companygoodsclassifyname:getspace(a.level) + a.companygoodsclassifyname,companygoodsclassifyid:a.companygoodsclassifyid});
						if(a.nodes && a.nodes.length>0)
						{
							text(a.nodes);
						};
					}
				}
				function getspace(count){
					var space = '';
					while(count--){
						space += '--';
					}
					return space;
				}
				text(classify);
				$scope.additionGoodsClassifyLists  = array;
				goodsSuplierRelationService.setAdditionGoodsClassifyLists(array)
			}else{
				$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
			}
		});	
	};	
	//获取商品分类信息end
	//首次查询商品分类信息
	$scope.searchGoodsClassify();    
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
			{name: '操作', field: 'action', width: '10%', enableFiltering: false,
			cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">' +
			'<a href="#" class="" ng-click="grid.appScope.editGoodsSuppliers(grid,row.entity)" title="修改"><span class="glyphicon glyphicon-pencil"></span></a>&nbsp;&nbsp;' +
			'<a href="#" class="" ng-click="grid.appScope.deleteGoodsSuppliers(grid,row.entity)" title="删除"><span class="glyphicon glyphicon-trash"></span></a>' +
			'</div>'},
			{ name: '商品编码',field:'goodssn' },
            { name: '商品条码',field:'barcode' },
            { name: '商品名称',field:'goodsname'},
            { name: '规格',field:'goodsspec'},
            { name: '商品分类',field:'companygoodsclassifyname'},
            { name: '销售价',field:'goodsunitprice'},
            { name: '单位',field:'goodsunitname'},
            { name: '产地',field:'origin'},
            { name: '重量',field:'weight'},
            { name: '备注',field:'remark'}
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
    var getPage = function(pagenum, pagesize, sort) {
    	 $scope.queryParams = {};
        $scope.queryParams.pagenum = pagenum;
        $scope.queryParams.pagesize = pagesize;
        $scope.queryParams.supplierid = $scope.supplier.staffid;
        $scope.queryParams.suppliername = $scope.supplier.staffname;
        
        $scope.queryParams.goodsname = $scope.formData.goodsname;
        $scope.queryParams.barcode = $scope.formData.goodsname;
        $scope.queryParams.goodsspec = $scope.formData.goodsname;
        $scope.queryParams.companygoodsclassifyid = $scope.formData.classifyid;

        
        $http({
            method : 'POST',
            url : "/jsbweb/enterprise/goodssupplierrelation/getSupplierGoods.do",
            data : $.param($scope.queryParams),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {
            if(data.ret==0){
            	$scope.gridOption.data = angular.copy(data.data.rows);
                $scope.gridOption.totalItems = data.data.total;
            }else if(data.ret==10){
            	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
            }else{
            	
            }
        }).error(function(rep){
            console.info(rep)
        });
    };
    $scope.getPage = getPage;
    //首页加载页面查询商品
    //$scope.getPage(1,$scope.gridOption.paginationPageSize);
    //点击查询按钮
    $scope.selectGoodsByClassify = function(){
    	if($scope.supplier.staffid == undefined){
    		$alert({title: '提示：', content: '请选择供应商!', placement: 'masget-top',type: 'info', duration:1, show: true});
    		return ;
    	}
    	$scope.getPage(1,$scope.gridOption.paginationPageSize);
    };
    $scope.updateData={};
    //弹出修改模态窗口
    $scope.editGoodsSuppliers = function(grid,myRow){
    	$scope.updateData.supplierid = $scope.supplier.staffid;
    	$scope.updateData.suppliergoodsinfoid = myRow.suppliergoodsinfoid;
    	$scope.updateData.goodsid = myRow.goodsid;
    	$scope.updateData.goodsunitprice = myRow.goodsunitprice;
    	$scope.updateData.remark = myRow.remark;
    	$("#editGoodsSuppliersModal").modal("show");
    };
    //更新
    $scope.update = function (){
        var myreg = /^\d+(\.\d+)?$/;
        
        if(!myreg.test($scope.updateData.goodsunitprice)){
            $alert({title: '提示：', content: '请输入合法数字!', placement: 'masget-top',type: 'warning', duration:1, show: true});
            return false;
        }
    	var url = goodsSuplierRelationService.getUpdateSupplierGoodsUrl();
    	goodsSuplierRelationService.httpPost(url,$scope.updateData,function(resp){

            if(resp.ret==0){
            	$("#editGoodsSuppliersModal").modal("hide");
            	$scope.getPage(1,$scope.gridOption.paginationPageSize);
                $alert({title: '提示：', content: '更新成功!', placement: 'masget-top',type: 'info', duration:1, show: true});
                
            }else if(resp.ret==10){
            	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
            }else{
            	$alert({title: '提示：', content: '更新失败!', placement: 'masget-top',type: 'info', duration:1, show: true});
            }
    	});
    };
    $scope.deleteData = {};
    //删除供应商供货关系
    $scope.deleteGoodsSuppliers = function(grid,myRow){
    	$scope.deleteData.supplierid = $scope.supplier.staffid;
    	$scope.deleteData.suppliergoodsinfoid = myRow.suppliergoodsinfoid;
    	if(confirm("确定要删除数据吗?")){
        	var url = goodsSuplierRelationService.getDeleteSupplierGoodsUrl();
        	goodsSuplierRelationService.httpPost(url,$scope.deleteData,function(resp){

                if(resp.ret==0){
                	$scope.getPage(1,$scope.gridOption.paginationPageSize);
                    $alert({title: '提示：', content: '删除成功!', placement: 'masget-top',type: 'info', duration:1, show: true});
                    
                }else if(resp.ret==10){
                	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
                }else{
                	$alert({title: '提示：', content: '删除失败!', placement: 'masget-top',type: 'info', duration:1, show: true});
                }
        	});
    	}
    };
    //跳转到添加供应商供货信息页面
	$scope.configurateRelationship = function(){
		$state.go("configList");
	};
}]);