goodsSupplierRelationApp.
controller('configListController',['$timeout','$scope','$rootScope','$http','goodsSuplierRelationService','$alert','$state','utils','uiGridTreeViewConstants','i18nService',
function($timeout,$scope,$rootScope,$http,goodsSuplierRelationService,$alert,$state,utils,uiGridTreeViewConstants,i18nService){
	i18nService.setCurrentLang('zh-cn');
	
	$scope.supplierFormData = {};
	$scope.formData = {};
	//获取商品分类下拉列表
	$timeout(function(){
		$scope.formData.classifyid = 0;
		$scope.additionGoodsClassifyLists  = goodsSuplierRelationService.getAdditionGoodsClassifyLists();
	},50);
	//供应商下拉表格start
	$scope.getSuppliers = function(pagesize,pagenum,companyname){
		var data = {};
		//供应商场景类型
		data.scenetypeid = 2;
		data.pagesize = pagesize;
		data.pagenum = pagenum;
		data.companyname = companyname;	
		goodsSuplierRelationService.httpPost(goodsSuplierRelationService.getGetAllSuppliers(),data,function(resp){
			$scope.suppliersDatas = resp.data.rows;
			$scope.supplierFormData.total = resp.data.total;
		});	
	};
    $scope.query = function () {
    	$scope.supplierFormData.keyWord=$scope.supplierFormData.keyWord==null?"":$scope.supplierFormData.keyWord;
        //console.info("查询-参数:keyWord:"+$scope.supplierFormData.keyWord+",pagesize:"+$scope.supplierFormData.pagesize+",pagenum:"+$scope.supplierFormData.pagenum);
        $scope.getSuppliers($scope.supplierFormData.pagesize,$scope.supplierFormData.pagenum,$scope.supplierFormData.keyWord);
    };
    $scope.supplier2={};
    /*$scope.$watch("supplier2",function(){
        $scope.formData.staffid = $scope.supplier2.staffid;
        $scope.formData.platformuser = $scope.supplier2.platformuser;
    });*/
    //在comboxtable里的文本框输入是触发的方法
    $scope.onReset = function(){
    	$scope.supplier2={};
    };
    //供应商下拉表格end
    var paginationOptions = {
            sort: null
    };
    //勾选商品
    var ary = new Array(); 
    $scope.gridOptions = {
        paginationPageSizes: [10, 20, 50, 100],
        paginationPageSize: 20,
        useExternalPagination: true,
        useExternalSorting: true,
        enableColumnMenus: false,
        enableRowSelection: true,
        enableSelectAll: true,
        selectionRowHeaderWidth: 35,
        columnDefs: [
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
            //单选
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
        		if(row.isSelected){
        			//勾选托运单数据则push进入数组
        			ary.push(row.entity);	
        		}else{
        			//反勾选则从数组中删除已添加的托运单
        			ary.remove(row.entity.goodsid);
        		}
            });
            //全选 ，rows是数组
            gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
                angular.forEach(rows,function(data,index,array){
                	if(rows[index].isSelected){
                		ary.push(rows[index].entity);
                	}else{
                		ary.remove(rows[index].entity.goodsid);
                	}
                });
            });
            $scope.gridApi.grid.refresh();
        }
    };	
	//删除goodscartid值为val的数组元素
	Array.prototype.indexOfIt = function(val) {
		for (var i = 0; i < this.length; i++) {
		    if (this[i].goodsid == val) return i;
		}
		return -1;
	};
	Array.prototype.remove = function(val) {
		var index = this.indexOfIt(val);
		if (index > -1) {
		    this.splice(index, 1);
		}
	};
    //ui grid分页
    var getPage = function(pagenum, pagesize, sort) {
    	 $scope.queryParams = {};
        $scope.queryParams.pagenum = pagenum;
        $scope.queryParams.pagesize = pagesize;
        
        $scope.queryParams.supplierid = $scope.supplier2.staffid;
        $scope.queryParams.suppliername = $scope.supplier2.staffname;
        $scope.queryParams.goodsname = $scope.formData.goodsname;
        $scope.queryParams.barcode = $scope.formData.goodsname;
        $scope.queryParams.goodsspec = $scope.formData.goodsname;
        $scope.queryParams.companygoodsclassifyid = $scope.formData.classifyid;
        
        $http({
            method : 'POST',
            url : "/jsbweb/enterprise/goodssupplierrelation/getgoods_by_classify.do",
            data : $.param($scope.queryParams),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {
        	ary.length = 0;
            if(data.ret==0){
            	$scope.gridOptions.data = angular.copy(data.data.rows);
                angular.forEach($scope.gridOptions.data,function(data,index,array){
                	$scope.gridOptions.data[index].goodsunitprice = data.shopprice; 
                	$scope.gridOptions.data[index].remark = data.description; 
                });
                $scope.gridOptions.totalItems = data.data.total;
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
    //$scope.getPage(1,$scope.gridOptions.paginationPageSize);
    //点击查询按钮
    $scope.selectGoodsByClassify = function(){
    	if($scope.supplier2.staffid == undefined){
    		$alert({title: '提示：', content: '请选择供应商!', placement: 'masget-top',type: 'info', duration:1, show: true});
    		return ;
    	}
    	$scope.getPage(1,$scope.gridOptions.paginationPageSize);
    };
    //确定添加供应商供货信息
    $scope.addSupplierGoods = function(){
    	if($scope.supplier2.staffid == undefined){
    		$alert({title: '提示：', content: '请选择供应商!', placement: 'masget-top',type: 'info', duration:1, show: true});
    		return ;
    	}else if(ary.length == 0){
        		$alert({title: '提示：', content: '请勾选商品!', placement: 'masget-top',type: 'info', duration:1, show: true});
        	    return ;
        }
    	var params = {};
    	params.supplierid = $scope.supplier2.staffid;
    	params.platformuser = $scope.supplier2.platformuser;
    	params.goodslist = angular.toJson(ary);
    	goodsSuplierRelationService.httpPost(goodsSuplierRelationService.getAddSupplierGoodsUrl(),params,function(resp){
    		if(resp.ret == 0){
    			$scope.getPage(1,$scope.gridOptions.paginationPageSize);
    			$alert({title: '提示：', content: '商品添加供应商成功!', placement: 'masget-top',type: 'info', duration:1, show: true});
    		}else if(resp.ret == 20043){
    			$alert({title: '提示：', content: '没有找到对应得商品!', placement: 'masget-top',type: 'info', duration:1, show: true});
    		}else{
    			$alert({title: '提示：', content: '商品添加供应商失败!', placement: 'masget-top',type: 'info', duration:1, show: true});
    		}
    	});
    };
    //添加非平台供应商*********************************************************************
    $scope.baseData = {
        provinces:[],
        citys:[],
        areas:[]
    };
    $scope.getProvince = function(){
        var data = {};
        goodsSuplierRelationService.getPCA(data, function(res){
            $scope.baseData.provinces = res.data.rows;
        }, function(err){
            $alert({title: '提示：', content: '获取地区数据失败:' + err.message, placement: 'masget-top',type: 'info', duration:1, show: true});
        });
    };

    $scope.getCity = function(provinceid, callback){
        if(provinceid == undefined || provinceid == 0)
            return;
        var data = {};
        data.provinceid = provinceid;
        //data.provinceid = province.provincename;
        goodsSuplierRelationService.getPCA(data, function(res){
            $scope.baseData.citys = res.data.rows;
            if(callback != undefined){
            	callback(provinceid);
            }
        }, function(err){
            $alert({title: '提示：', content: '获取地区数据失败:' + err.message, placement: 'masget-top',type: 'info', duration:1, show: true});
        });
    };

    $scope.getArea = function(cityid, callback){
        if(cityid == undefined || cityid == 0)
            return;
        var data = {};
        data.cityid = cityid;
        goodsSuplierRelationService.getPCA(data, function(res){
            $scope.baseData.areas = res.data.rows;
            if(callback != undefined){
            	callback(cityid);
            }
        }, function(err){
        	$alert({title: '提示：', content: '获取地区数据失败:' + err.message, placement: 'masget-top',type: 'info', duration:1, show: true});
        });
    };
    $timeout(function(){
    	$scope.getProvince();
    	$scope.getAddressGroup();
    },50);
    $scope.addConactData = {
        scenetypeid:2,
        provinceid:0,
        cityid:0,
        areaid:0
    };
    $scope.getAddressGroup = function(){
    	$http({
            method : 'GET',
            url : "/jsbweb/base/contractorinfo/getAddressGroup.do?scenetypeid=2"
        }).success(function(data) {
            if(data.data!=null){
            	$scope.scenetype = data.data.rows;
            }
        });
    };
    $scope.onSelectProvince = function(province){
        province = $.parseJSON(province);
        $scope.addConactData.provinceid = province.provinceid;
        $scope.addConactData.provincename = province.provincename;

        $scope.addConactData.cityname = "";
        $scope.addConactData.cityid = 0;
        $scope.addConactData.city = "";
        $scope.addConactData.area = "";
        $scope.addConactData.areaid = 0;
        $scope.addConactData.areaname = "";

        $scope.getCity(province.provinceid);
    }
    $scope.onSelectCity = function(city){
        city = $.parseJSON(city);

        $scope.addConactData.cityid = city.cityid;
        $scope.addConactData.cityname = city.cityname;

        $scope.addConactData.area = "";
        $scope.addConactData.areaid = 0;
        $scope.addConactData.areaname = "";

        $scope.getArea(city.cityid);
    }
    $scope.onSelectArea = function(area){
        area = $.parseJSON(area);

        $scope.addConactData.areaid = area.areaid;
        $scope.addConactData.areaname = area.areaname;
    }
    //验证手机输入是否合法
    $scope.validatemobile = function(mobile){
        if(mobile == undefined || mobile == "" || mobile.length==0){
            $alert({title: '提示：', content: '请输入联系电话!', placement: 'masget-top',type: 'warning', duration:1, show: true});
            return false;
        }
        if(mobile.length!=11){
            $alert({title: '提示：', content: '请输入有效的联系电话!', placement: 'masget-top',type: 'warning', duration:1, show: true});
            return false;
        }

        var myreg = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8]))\d{8}$/;
        
        if(!myreg.test(mobile)){
            $alert({title: '提示：', content: '请输入有效的联系电话!', placement: 'masget-top',type: 'warning', duration:1, show: true});
            return false;
        }
        return true;
    };
    $scope.addConact = function(){
        if($scope.addConactData.companyname == undefined || $scope.addConactData.companyname == ""){
            $alert({title: '提示：', content: '客户公司名称不能为空!', placement: 'masget-top',type: 'warning', duration:1, show: true});
            return;
        }
        if($scope.addConactData.contactname == undefined || $scope.addConactData.contactname == ""){
            $alert({title: '提示：', content: '联系人名称不能为空!', placement: 'masget-top',type: 'warning', duration:1, show: true});
            return;
        }
        if(!$scope.validatemobile($scope.addConactData.mobilephone)){
            return;        	
        }
        if($scope.addConactData.address == undefined || $scope.addConactData.address == ""){
            $alert({title: '提示：', content: '客户联系地址不能为空!', placement: 'masget-top',type: 'warning', duration:1, show: true});
            return;
        }
        if($scope.addConactData.addressgroupid == undefined){
            $alert({title: '提示：', content: '客户类型不能为空!', placement: 'masget-top',type: 'warning', duration:1, show: true});
            return;
        }
        var data = {data: angular.toJson( $scope.addConactData)};
        $http({
            method : 'POST',
            url : '/jsbweb/enterprise/goodssupplierrelation/addContractor.do',
            data : $.param(data),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data){
            if (data.ret == 0) {
                $alert({title: '提示：', content: '供应商添加成功', placement: 'masget-top',type: 'info', duration:1, show: true});
                $("#addControctorModal").modal("hide");
                $scope.addConactData = {};
                $scope.addConactData.scenetypeid = 2;
            } else {
                $alert({title: '提示：', content: '供应商添加失败', placement: 'masget-top',type: 'info', duration:1, show: true});
            }
        }).error(function(rep){
        	$alert({title: '提示：', content: '供应商添加失败', placement: 'masget-top',type: 'info', duration:1, show: true});
        });
    };
	//跳转到供应商已配置商品展示页面*************************************************************
	$scope.serchRelationship = function(){
		$state.go("goodsSupplierRelationList");
	};
}]);