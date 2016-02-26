/**
 * Created by Administrator on 2015-09-08.
 */
entAddressmanageModule.controller("AddressmanageController",
    ['$scope','$rootScope','$http',"$stateParams","$state","i18nService","addressmanageService",
        function($scope, $rootScope, $http,$stateParams,$state,i18nService,addressmanageService) {
    	i18nService.setCurrentLang('zh-cn');
    	$scope.formData = {};
    	$scope.topformData = {title:"新增地址"};
    	$scope.queryAddress={pagesize:20,pagenum:1};
    	
    	$scope.baseData = {
                provinces:[],
                citys:[],
                areas:[]
            }
    	
    	$scope.type = [
    	                 { id: 1, value: "收货地址" },
    	                 { id: 2, value: "发货地址" }
    	             ];
    	
    	//获取省市县
    	 $scope.getProvince = function(){
             var data = {};
             addressmanageService.getPCA(data, function(res){
                 $scope.baseData.provinces = res.data.rows;
             }, function(err){
                 $.jBox.tip("获取地区数据失败:" + err.message);
             });
         };
         
         $scope.getCity = function(provinceid, callback){
         	
             if(provinceid == undefined || provinceid == 0)
                 return;
             var data = {};
             data.provinceid = provinceid;
             addressmanageService.getPCA(data, function(res){
                 $scope.baseData.citys = res.data.rows;
                 if(callback != undefined){
                 	callback(provinceid);
                 }
             }, function(err){
                 $.jBox.tip("获取地区数据失败:" + err.message);
             });
         };

         $scope.getArea = function(cityid, callback){
         	
             if(cityid == undefined || cityid == 0)
                 return;
             var data = {};
             data.cityid = cityid;
             addressmanageService.getPCA(data, function(res){
                 $scope.baseData.areas = res.data.rows;
                 if(callback != undefined){
                 	callback(cityid);
                 }
             }, function(err){
                 $.jBox.tip("获取地区数据失败:" + err.message);
             });
         };
    	
         //调用
         $scope.getProvince();
         
         //触发获取市县方法
         $scope.onChangeProvince = function(provinceid){
         	$scope.getCity(provinceid);
             $scope.formData.cityid='';
             $scope.formData.areaid = '';
         }
         $scope.onChangeCity = function(cityid){
         	$scope.getArea(cityid);
            $scope.formData.areaid = '';
         }
         
    	//加载数据源汇总
        $http
            .get("../../../enterprise/addressmanage/find_addressmanage.do?pagesize=20&pagenum=1")
            .success(function (data) {
            	var result =angular.copy(data.data.rows);
            	angular.forEach(result,function(data,index,array){
            		if(data.addresstype == 1){
            			data.addresstypename = "收货地址";
            		}else{
            			data.addresstypename = "发货地址";
            		}
            		data.pcaaddress = data.provincename + data.cityname + data.areaname;
            	});
                $scope.AddressmanagegridOptions.data = result;
                $scope.AddressmanagegridOptions.totalItems = data.data.total;
                if (data.ret == 1000) {
                    $.jBox.tip("请先登录", 'warning');
                }
                console.log(result);
            });
        
        //查询
        $scope.onClickToQuery = function(){
            
        	 $http({
                 method : 'POST',
                 url : "/jsbweb/enterprise/addressmanage/find_addressmanage.do",
                 data : $.param($scope.queryAddress),
                 headers : {
                     'Content-Type' : 'application/x-www-form-urlencoded'
                 }
             }).success(function(data) {
                 if(data.ret==0){
                	 var result =angular.copy(data.data.rows);
                 	angular.forEach(result,function(data,index,array){
                 		if(data.addresstype == 1){
                 			data.addresstypename = "收货地址";
                 		}else{
                 			data.addresstypename = "发货地址";
                 		}
                 		data.pcaaddress = data.provincename + data.cityname + data.areaname;
                 	});
                    $scope.AddressmanagegridOptions.data = result;
                    $scope.AddressmanagegridOptions.totalItems = data.data.total;
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
    	$scope.AddressmanagegridOptions = { 
			 paginationPageSizes: [10, 20, 50, 100],
             paginationPageSize: 20,
             useExternalPagination: true,
             useExternalSorting: false,
             enableSorting : false,
       		 enableColumnMenus: false,
       		 columnDefs : [
       		               	{ name:'操作',field:'action',
       		                    cellTemplate: '<div class="ui-grid-cell-contents">' +
       		                '<a style="cursor:pointer; margin-left: 8px;" ng-click="grid.appScope.modifyGoods(grid, row.entity)" title="编辑" ><span class="glyphicon glyphicon-pencil blue"></span></a>' +
       		                '<a style="cursor:pointer; margin-left: 8px;" ng-click="grid.appScope.deleteGoods(row.entity)" title="删除"><span class="glyphicon glyphicon-trash red"></span></a>' +
       		                '</div>',width:'80',enableCellEdit: false },
       		                { name: '地址类型',field:'addresstypename',enableCellEdit: false},
       		                { name: '联系人',field:'contactname',enableCellEdit: false},
       		                { name: '手机号',field:'mobile',enableCellEdit: false},
       		                //{ name: '区号',field:'specificationoptionname',enableCellEdit: false},
    		                { name: '固话',field:'phone',enableCellEdit: false},
    		                //{ name: '分机号',field:'specificationoptionname',enableCellEdit: false},
       		                { name: '地址',field:'pcaaddress',enableCellEdit: false},
       		                { name: '详细地址',field:'address',enableCellEdit: false},
       		                { name: '邮编',field:'postcode',enableCellEdit: false},
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
            $scope.queryAddress.pagenum = pagenum;
            $scope.queryAddress.pagesize = pagesize;
            $scope.onClickToQuery();
        };
        $scope.getPage = getPage;
    	
    	//新增方法切换界面
    	$scope.onBtnClickAdd = function(){
    		$state.go("addAddressmanage");
    		
    	}
    	
    	//返回
    	$scope.goback = function(grid,myRow){
    		$state.formData = {};
    		$state.go("addressmanage");
    	};
    	
    	
    	//修改界面跳转
    	$scope.modifyGoods = function(grid,myRow){
    		
    		$state.go("addAddressmanage");
    		
    		$state.formData = angular.copy(myRow);
    	};	
    	
    	//保存 	
    	$scope.addFormDataSumbit = function(invalid){
    		
    		if(invalid){
        		$.jBox.tip('请检查提交的数据是否正确!', 'warning');
        		return;
        	}
    		if($scope.formData.contactname == undefined || $scope.formData.contactname == ""){
        		$.jBox.tip('联系人不能为空!', 'warning');
        		return;
        	}
    		if($scope.formData.cityid == undefined || $scope.formData.cityid == ""){
        		$.jBox.tip('省市县不能为空!', 'warning');
        		return;
        	}
    		
    		if($scope.formData.address == undefined || $scope.formData.address == ""){
        		$.jBox.tip('详细地址不能为空!', 'warning');
        		return;
        	}
    		
    		
    		//新增界面保存操作
    		if($scope.formData.addressmanageid == undefined) {
    		
    		var data = { data: angular.toJson($scope.formData)};
    		
	    		$http({
	                method: 'POST',
	                url: "/jsbweb/enterprise/addressmanage/add_addressmanage.do",
	                data: $.param(data),
	                headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded'
	                }
	            }).success(function (data) {
	
	                if (data.ret == 0) {
	                    $.jBox.tip('添加成功', 'success');  
	                    $state.go("addressmanage");
	                } else {
	                    $.jBox.tip('添加失败', 'warning');
	                }
	
	                if (data.ret == 10) {
	                    $.jBox.tip("请先登录", 'warning');
	                }
	            }).error(function(data){
	                $.jBox.tip("连接服务器失败", "warning");
	            });
    		}else{
    			
    			//修改界面保存操作
        		var data = { data: angular.toJson($scope.formData)};
    			$http({
                    method: 'POST',
                    url: "/jsbweb/enterprise/addressmanage/modify_addressmanage.do",
                    data: $.param(data),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (data) {
                	
                    if (data.ret == 0) {
                    	
                        $.jBox.tip("修改成功", 'success');
                        $state.go("addressmanage");
                        $state.formData = {};
                        
                    } else if (data.ret == 10) {
                        $.jBox.tip("请先登录", 'warning');
                    } else {
                        $.jBox.tip("修改失败", 'warning');
                    }
                }).error(function (rep) {
                    console.log(rep)
                    $.jBox.tip("修改失败", 'warning');
                });
    		}	
    	};
    	
    	//删除记录
    	$scope.deleteGoods = function(myRow){
    		
    	$.jBox.confirm("确定要删除:  联系人" + myRow.contactname + " 的" + myRow.addresstypename + "吗？", "温馨提示", function(v, h, f){
    		if(v == "ok"){ 
    		$http({
		            method: 'POST',
		            url: "/jsbweb/enterprise/addressmanage/del_addressmanage.do?addressmanageid="+myRow.addressmanageid,
		            headers: {
		                'Content-Type': 'application/x-www-form-urlencoded'
		            }
		        }).success(function (data) {
		            if (data.ret == 0) {
		            	$.jBox.tip('删除成功', 'success');
		            	$scope.onClickToQuery();
		            }else {
	                    $.jBox.tip('删除失败', 'warning');
	                }
		            if (data.ret == 10) {
		                $.jBox.tip("请先登录", 'warning');
		            }
		        });
    		}
    		 return true;
    	});
    }
    	
    	//定义修改界面初始化页面数据方法
    	var initData=function(){
    		if($state.formData !=null){
    			$scope.formData = $state.formData;
    			var provinceid = $scope.formData.provinceid;
    			var cityid = $scope.formData.cityid;
    			
    			$scope.getCity(provinceid);
    			$scope.getArea(cityid);
    			if($scope.formData.addressmanageid == undefined){
    				$scope.topformData.title = "新增地址";
    			}else{
    				$scope.topformData.title = "修改地址";
    			}
    			return;
    		}
    	};
    	//修改界面初始化页面数据
    	initData();
    
    }]);