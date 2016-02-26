contractorInfoApp.
controller('contractorInfoListController',['$state','$scope','$rootScope','$http','$alert','uiGridTreeViewConstants','i18nService','$timeout','contractorInfoService','$modal',
function($state,$scope,$rootScope,$http,$alert,uiGridTreeViewConstants,i18nService,$timeout,contractorInfoService,$modal){
	i18nService.setCurrentLang('zh-cn');
    $scope.ctformData = {};
    $scope.ctformData.addressgroupid = 0;
    $scope.ctformData.addressgroupList = [];
    $scope.ctformData.enableflag = 0;
    $scope.ctformData.enableflagList = [{enableflag:0 , name:'--全部状态--'},
                                        {enableflag:1 , name:'未开通'},
                                        {enableflag:2 , name:'启用'},
                                        {enableflag:3 , name:'禁用'}];
	//状态转换
    $scope.convertEnableFlagName = function (flag) {
        var name = "";
        for (var i = 0; i < $scope.ctformData.enableflagList.length; i++) {
            if ($scope.ctformData.enableflagList[i].enableflag == flag) {
                name = $scope.ctformData.enableflagList[i].name;
            }
        }
        return name;
    };
    //查询分组级别
	$scope.getAddressGroupConfig = function(){
		$scope.data = {};
        $scope.data.scenetypeid = 3;    //前端默认传3-客户
        $scope.data.saasid = 3000;    //应用id前端默认传3000
        $scope.data.saasaddressgrouptypeid = 2;    //应用分组id前端默认传2-自定义分组
        var data = { data: angular.toJson($scope.data)};
        contractorInfoService.httpPost(contractorInfoService.getAddressgroupconfig(),data,function(data){
        	if(data.ret == 0){
        		console.log(data);
        		//增加一个默认分类
        		$scope.ctformData.addressgroupList.length = 0;
				var newObject = {
					addressgroupid : 0,
					addressgroupname : '--全部级别--'
				};
        		$scope.ctformData.addressgroupList = data.data.rows;
        		$scope.ctformData.addressgroupList.push(newObject);
        	}else if(data.ret == 10){
            	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
            }else{
        		$alert({title: '提示：', content: '查询分组级别配置异常,'+data.message, placement: 'masget-top',type: 'info', duration:1, show: true});
        	}
        });
	};
	$scope.getAddressGroupConfig();
	//ui-grid of Tree View
	$scope.gridOption = {
          paginationPageSizes: [5, 10, 20, 50, 100],
          paginationPageSize: 20,
          useExternalPagination: true,
          useExternalSorting: false,
          enableSorting : false,
          enableColumnMenus: false,
          enableGridMenu: true,
	      columnDefs: [
          { name: '序号', enableHiding: false, field:'id',type:'text',enableHiding: false,enableCellEdit: false , enableSorting: false, enableColumnResizing:false,  width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
		               
	      { name: '经销商名称', field: 'subcompanyname'},
	      { name: '登录账号', field: 'loginname'},
	      { name: '级别', field: 'addressgroupname'},
	      { name: '地址', field: 'allAddress'},
	      { name: '联系人', field: 'contractname'},
	      { name: '手机', field: 'mobilephone'},
	      { name: '状态', field: 'enableflagName'},
	      { name: '操作', enableHiding: false, field:'action', width: '9%', enableFiltering: false,
			    cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">' +
			    '<a href="#" class="" ng-click="grid.appScope.contractorInfoView(row.entity)" title="查看"><span class="glyphicon glyphicon-eye-open blue"></span></a>&nbsp;'+
			    /*'<a href="#" class="" ng-click="grid.appScope.contractorInfoModify(row.entity)" title="修改"><span class="glyphicon glyphicon-pencil blue"></span></a>&nbsp;'+*/
			    '<a href="#" class="" ng-click="grid.appScope.contractorInfoDelete(row.entity)" title="删除"><span class="glyphicon glyphicon-trash blue"></span></a>&nbsp;'+
			    '</div>'}
	      ],
            
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
	//ui grid分页
    var getPage = function(pagenum, pagesize, sort) {
    	$scope.data = {};
        $scope.data.pagenum = pagenum;
        $scope.data.pagesize = pagesize;
        $scope.data.addressgroupid = $scope.ctformData.addressgroupid;
        $scope.data.enableflag = $scope.ctformData.enableflag;
        $scope.data.subcompanyname = $scope.ctformData.subcompanyname;
        console.info($scope.data);
        var data = { data: angular.toJson($scope.data)};
        contractorInfoService.httpPost(contractorInfoService.getSubcompany(),data,function(data){
        	console.log(data);
        	if(data.ret == 0){
        		angular.forEach(data.data.rows,function(data,index){
        			data.allAddress = data.provincename+data.cityname+data.areaname+data.address;
        			//支付状态中文名字
        			data.enableflagName = $scope.convertEnableFlagName(data.enableflag);
        		});
        		
        		$scope.gridOption.data = data.data.rows;
        		$scope.gridOption.totalItems = data.data.total;
        	}else if(data.ret == 10){
            	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
            }else{
        		$alert({title: '提示：', content: '查询经销商异常,'+data.message, placement: 'masget-top',type: 'info', duration:1, show: true});
        	}
        });
    };
    $scope.getPage = getPage;
    $scope.getPage(1,$scope.gridOption.paginationPageSize);
    $scope.contactorinfoSearch = function(){
    	$scope.getPage(1,$scope.gridOption.paginationPageSize);
    };
    //跳转到添加页面
    $scope.add_state = function(){
    	$state.go("addContractorInfo");
    };
    //删除经销商
    $scope.contractorInfoDelete = function(entity){
    	$modal({title: "提示", content: "确认要删除经销商吗?",template:'modal/modal.confirm.tpl.html',animation:'am-fade-and-scale',callback: function(){
    		$scope.data = {};
        	var subCompany = [{subcompanyid : entity.subcompanyid,
        	                   addressgroupid : entity.addressgroupid,
        	                   enableflag : entity.enableflag,
        	                   contactid : entity.contactid
        	                  }];
            $scope.data.action = "delete";
            $scope.data.subcompany = subCompany;
            console.info($scope.data);
            var data = { data: angular.toJson($scope.data)};
            contractorInfoService.httpPost(contractorInfoService.getModifySubcompany(),data,function(data){
            	console.log(data);
            	if(data.ret == 0){
            		$alert({title: '提示：', content: '经销商删除成功!', placement: 'masget-top',type: 'info', duration:2, show: true});
            		$scope.getPage(1,$scope.gridOption.paginationPageSize);
            	}else if(data.ret == 10){
                	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
                }else{
            		$alert({title: '提示：', content: '经销商删除异常,'+data.message, placement: 'masget-top',type: 'info', duration:2, show: true});
            	}
            });
    		console.log(entity);
    	}});
    };
    //修改经销商
    $scope.contractorInfoModify = function(entity){
    	
    };
    //查看经销商
    $scope.contractorInfoView = function(entity){

		var da = {};
    	da.companyid = entity.subcompanyid;
    	da.pagesize = 5;
    	da.pagenum = 1;
    	da.addresstype = 1; //1为收货地址
        contractorInfoService.httpPost(contractorInfoService.getAddressmanage(),da,function(data){
        	if(data.ret == 0){
        		entity.addressmanageList = data.data.rows;
        	}else if(data.ret == 10){
            	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
            }else{
        		$alert({title: '提示：', content: '查询经销商地址异常,'+data.message, placement: 'masget-top',type: 'info', duration:2, show: true});
        	}
        });
        $timeout(function(){
        	$state.go("viewContractorInfo");
        	$state.broadCast = {viewData: angular.copy(entity)};
        },500);

    };
}])
.controller('contractorInfoAddController',['$state','$scope','$rootScope','$http','$alert','uiGridTreeViewConstants','i18nService','$timeout','contractorInfoService',
function($state,$scope,$rootScope,$http,$alert,uiGridTreeViewConstants,i18nService,$timeout,contractorInfoService){
	//addressgroupconfig分组级别参数
	$scope.agcformData = {};
	//经销商参数
	$scope.formData = {};
	$scope.formData.addressgroupid = 0;
	$scope.formData.cooperanttypeid = 1;
    $scope.formData.provinceid = 0;
    $scope.formData.cityid = 0;
    $scope.formData.areaid = 0;
	$scope.addressgroupList = [];
	$scope.formData.cooperanttypeList = [{cooperanttypeid:1,cooperanttypename:"直营"},
	                                     {cooperanttypeid:2,cooperanttypename:"加盟"}]
	
	//查询分组级别
	$scope.getAddressGroupConfig = function(){
		$scope.data = {};
        $scope.data.scenetypeid = 3;    //前端默认传3-客户
        $scope.data.saasid = 3000;    //应用id前端默认传3000
        $scope.data.saasaddressgrouptypeid = 2;    //应用分组id前端默认传2-自定义分组
        var data = { data: angular.toJson($scope.data)};
        contractorInfoService.httpPost(contractorInfoService.getAddressgroupconfig(),data,function(data){
        	if(data.ret == 0){
        		//给商品分类增加一个默认分类
        		$scope.addressgroupList.length = 0;
				var newObject = {
					addressgroupid : 0,
					addressgroupname : '--请选择分组级别--'
				};
        		$scope.addressgroupList = data.data.rows;
        		$scope.addressgroupList.push(newObject);
        	}else if(data.ret == 10){
            	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
            }else{
        		$alert({title: '提示：', content: '查询采购单异常,'+data.message, placement: 'masget-top',type: 'info', duration:1, show: true});
        	}
        });
	};
	$scope.getAddressGroupConfig();
	//弹窗新增界面
    $scope.addressGroupConfigAdd = function(){
    	$("#addressgroupConfigAdd").modal("show");
    };
    $scope.cancelAdd = function(){
    	$state.go("getContractorInfo");
    };
    //新增分组级别
    $scope.submit = function(action){
	    //参数过滤
    	if($scope.agcformData.addressgroupname == undefined || $scope.agcformData.addressgroupname == ''){
		    $alert({title: '提示：', content: '级别名称不能为空', placement: 'masget-top',type: 'info', duration:2, show: true});
	        return ;
	    }
    	if($scope.agcformData.discountrate == undefined || $scope.agcformData.discountrate == ''){
		    $alert({title: '提示：', content: '订货折扣不能为空', placement: 'masget-top',type: 'info', duration:2, show: true});
	        return ;
	    }
	    if($scope.agcformData.discountrate < 0 || $scope.agcformData.discountrate > 100){
		    $alert({title: '提示：', content: '订货折扣取值范围为0-100!', placement: 'masget-top',type: 'info', duration:2, show: true});
	        return ;
	    }
    	//3-客户
    	$scope.agcformData.scenetypeid = 3;
    	//应用id
    	$scope.agcformData.saasid = 3000;
        var data = { data: angular.toJson($scope.agcformData)};
        contractorInfoService.httpPost(contractorInfoService.getAddAddressgroupconfigUrl(),data,function(data){
	       	 if(data.ret == 0){
	       		 $alert({title: '提示：', content: '添加经销商分组级别成功!', placement: 'masget-top',type: 'info', duration:2, show: true});
	       		 $("#addressgroupConfigAdd").modal("hide");
	       		 $scope.getAddressGroupConfig();
	       	 }else if(data.ret == 10){
	        	 $alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
	         }else{
	    		 $alert({title: '提示：', content: '添加经销商级别异常,'+data.message, placement: 'masget-top',type: 'info', duration:2, show: true});
	    	 }
	    });
    };
    //获取省份信息
	$scope.getProvince = function(){
		contractorInfoService.httpGet(contractorInfoService.getDistrictUrl(),function(resp){
			var newObject = {
					provinceid:0,
					provincename:'--请选择省份--'
			};
	        $scope.provinceList = resp.data.rows;
	        $scope.provinceList.push(newObject);
	    });
	};
	//获取城市信息
	$scope.getArea = function(){
		contractorInfoService.httpGet(contractorInfoService.getDistrictUrl()+"?provinceid="+$scope.formData.provinceid,function(resp){
			var newObject = {
					cityid:0,
					cityname:'--请选择城市--'
			};
			$scope.areaList = resp.data.rows;
			$scope.areaList.push(newObject);
			//
			$scope.formData.cityid = 0;
	    });
	};
	//获取区、县信息
	$scope.getDistrict = function(){
		var url = contractorInfoService.getDistrictUrl()+"?provinceid="+$scope.formData.provinceid+
		          "&cityid="+$scope.formData.cityid;
		contractorInfoService.httpGet(url,function(resp){
			var newObject = {
					areaid:0,
					areaname:'--请选择区县--'
			};
	        $scope.districtList = resp.data.rows;
	        $scope.districtList.push(newObject);
	        $scope.formData.areaid = 0;
	    });
	};
	$scope.getProvince();
	$scope.getArea();
	$scope.getDistrict();
	//验证提交数据
	$scope.validateData = function(){
		//手机号码验证
		var regPhoneNum = new RegExp("^((1[0-9][0-9])|(15[^4,\\D])|(18[0,5-9]))\\d{8}$");
		if($scope.formData.subcompanyname == undefined || $scope.formData.subcompanyname == ''){
			$alert({title: '提示：', content: '请输入经销商名称!', placement: 'masget-top',type: 'info', duration:2, show: true});
		    return false;
		}
		if($scope.formData.addressgroupid == undefined || $scope.formData.addressgroupid == 0){
			$alert({title: '提示：', content: '请输入经销商级别!', placement: 'masget-top',type: 'info', duration:2, show: true});
			return false;
		}
		if($scope.formData.provinceid == undefined || $scope.formData.provinceid == 0){
			$alert({title: '提示：', content: '请选择省份!', placement: 'masget-top',type: 'info', duration:2, show: true});
			return false;
		}
		if($scope.formData.cityid == undefined || $scope.formData.cityid == 0){
			$alert({title: '提示：', content: '请选择城市!', placement: 'masget-top',type: 'info', duration:2, show: true});
			return false;
		}
		if($scope.formData.areaid == undefined || $scope.formData.areaid == 0){
			$alert({title: '提示：', content: '请选择县区!', placement: 'masget-top',type: 'info', duration:2, show: true});
			return false;
		}
		if($scope.formData.address == undefined || $scope.formData.address == ''){
			$alert({title: '提示：', content: '请输入街道地址!', placement: 'masget-top',type: 'info', duration:2, show: true});
			return false;
		}
		if($scope.formData.staffname == undefined || $scope.formData.staffname == ''){
			$alert({title: '提示：', content: '请输入联系人!', placement: 'masget-top',type: 'info', duration:2, show: true});
			return false;
		}
		if($scope.formData.mobilephone == undefined || $scope.formData.mobilephone == ''){
			$alert({title: '提示：', content: '请输入手机号码!', placement: 'masget-top',type: 'info', duration:2, show: true});
			return false;
		}
		if(!regPhoneNum.test($scope.formData.mobilephone)){
			$alert({title: '提示：', content: '手机号码必须为11位有效数字!', placement: 'masget-top',type: 'info', duration:2, show: true});
			return false;
		}
		if($scope.formData.loginname == undefined || $scope.formData.loginname == ''){
			$alert({title: '提示：', content: '请输入登录账号!', placement: 'masget-top',type: 'info', duration:2, show: true});
			return false;
		}
		if($scope.formData.loginpwd == undefined || $scope.formData.loginpwd == ''){
			$alert({title: '提示：', content: '请输入密码!', placement: 'masget-top',type: 'info', duration:2, show: true});
			return false;
		}
		if($scope.formData.loginpwd != $scope.formData.loginpwd2){
			$alert({title: '提示：', content: '两次密码输入不一致!', placement: 'masget-top',type: 'info', duration:2, show: true});
			return false;
		}
		return true;
	};
	//添加
	$scope.add = function(){
		if(!$scope.validateData()){
			return ;
		}
		var data = {};
		data = angular.copy($scope.formData);
		data.industryid = 5;  //行业类型-餐饮业
		data.companytypeid = 3003; //公司类型
		data.loginpwd = $.md5($scope.formData.loginpwd);
		if($scope.formData.sendmsgflag == true){
			data.sendmsgflag = 1;
		}else{
			data.sendmsgflag = 2;
		}
		var da = {data : angular.toJson(data)};
        contractorInfoService.httpPost(contractorInfoService.getRegSubcompanyUrl(),da,function(data){
        	console.log(data);
        	if(data.ret == 0){
        		$alert({title: '提示：', content: '添加经销商信息信息成功!', placement: 'masget-top',type: 'info', duration:2, show: true});
        		$state.go("getContractorInfo");
        	}else if(data.ret == 10){
            	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
            }else{
        		$alert({title: '提示：', content: '添加经销商信息失败,'+data.message, placement: 'masget-top',type: 'info', duration:2, show: true});
        	}
        });
	};
}])
.controller('contractorInfoDetailController',['$state','$scope','$rootScope','$http','$alert','uiGridTreeViewConstants','i18nService','$timeout','contractorInfoService',
function($state,$scope,$rootScope,$http,$alert,uiGridTreeViewConstants,i18nService,$timeout,contractorInfoService){
	$scope.viewData = {};
	$scope.viewData = $state.broadCast.viewData;

	if($scope.viewData.cooperanttypeid == 1){
		$scope.viewData.cooperanttypename = '直营';
	}else if($scope.viewData.cooperanttypeid == 2){
		$scope.viewData.cooperanttypename = '加盟';
	}

	//返回首页
	$scope.returnToList = function(){
		$state.go("getContractorInfo");
	};
}]);
