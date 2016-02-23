/*lihongwen 2015-07-30 改版
 *======================================
 * 内部组控制器 interGroupController
 * =======================================
 * */
tunnelmanagerModule.controller("interGroupController",
    ['$scope','$rootScope', '$http', '$state',  '$timeout', '$modal','tunnelmanagerService',function ($scope,$rootScope, $http, $state, $timeout,$modal,tunnelmanagerService) {

    	//定义查询表单对象
    	$scope.queryDataForm = {};
    	$scope.queryDataForm.pagesize=10;
    	$scope.queryDataForm.pagenum=1;
    	$scope.queryDataForm.flag="0"; //0表示查询所有 
    	$scope.tunnelmanagers = {};
    	$rootScope.interGroup_showflag = true;  //table 操作列 显示标识
    	$rootScope.exterGroup_delBtn_showflag = false;  //组关联操作 删除按钮显示标识
    	$rootScope.interGroup_delBtn_showflag = true;
    	//定义编辑数据对象
	    $scope.editDataForm = {};
	    $scope.editDataForm.isCommitted=false;  //表单提交标识，默认为否
	   //定义组状态
        $scope.status = [
            {name : "启用",value : "E"},
            {name : "停用",value : "D"}
        ];

	    //获取当前编辑的数据

	    $scope.tunnelmanager_edit =function(item){
	    	$scope.tempitem = item;
	    	$scope.editDataForm = angular.copy(item);
	    	console.log($scope.editDataForm)
	    	$("#editGroupModal").modal("show");
	    }

	   //加载内部组数据
		$scope.getQueryinterterminalgroup=function(){
			var url = tunnelmanagerService.getQueryinterterminalgroupUrl()+"?pagesize=10&pagenum=1&flag="+"0";
			tunnelmanagerService.httpGet(url,function(data){
				console.warn(data);
				if(data.ret==10){
	                 $.jBox.info("请先登录！", '温馨提示');
	                 return;
	             }
		    	$scope.tunnelmanagers=data;
		    	console.log("httpGet查询内部组数据.....");
		    	console.log($scope.tunnelmanagers);
			})

		}
		//调用内部组数据
		$scope.getQueryinterterminalgroup();

       //根据条件查询组
        $scope.queryForm=function(){
        	console.log("查询条件.....");
        	console.log($scope.queryDataForm);
        	var url =tunnelmanagerService.getQueryinterterminalgroupUrl();
        	tunnelmanagerService.httpPost(url,$scope.queryDataForm,function(data){
        		if(data.ret==10){
        			$.jBox.info("请先登录！","温馨提示");
        		}
        		if(data.ret==0){
        		$scope.tunnelmanagers=data;
        		}
        	})
        };

        //删除组
        $scope.tunnelmanager_del = function(item){
        	//{groups:[{terminalgroupsid:11},{terminalgroupsid:11}],flag:"0"}
        	var interterminalgroupsid = item.interterminalgroupsid;
        	var tempObject = {};
        	tempObject.flag = "0"; //默认标识为内部组
        	var tempid = {groupid:interterminalgroupsid};
	        tempObject.groups = [];
	        tempObject.groups.push(tempid);
	    	var data = {data:JSON.stringify(tempObject)};
        	 $.jBox.confirm("组名称："+item.interterminalgroupsname+"<br/>"+"确定要删除吗？", "温馨提示", function(v, h, f){
        		 if (v == 'ok') {
                     $.jBox.tip("正在删除数据...", 'loading');
                     var url=tunnelmanagerService.getDeletegroupUrl();
                     tunnelmanagerService.httpPost(url,data,function(data){
                     	if(data.ret==0){
                             $scope.queryForm();
                             $.jBox.tip('删除成功!', 'success');
                         }

                         if(data.ret==10){
                             $.jBox.info("请先登录！", '温馨提示');
                         }
                     })
                 }
                 return true; //close
        	 });
        }


        //启用组状态    status  E：已启用；D：已停用；
	       $scope.tunnelmanagerStatus_e = function(item){
	    	   var interterminalgroupsid = item.interterminalgroupsid;
	    	   var status = 'E';
	    	   $.jBox.confirm("组名称："+item.interterminalgroupsname+"<br>"+"确定要启用吗？","温馨提示",function(v,h,f){
	    		  if(v == 'ok'){
	    		  	var url = tunnelmanagerService.getModifyinterterminalgroupUrl();
	    		  	tunnelmanagerService.httpPost(url,{status:status,interterminalgroupsid:interterminalgroupsid},function(data){
	    				  if(data.ret==0){
	    					  $scope.queryForm();
	    					  $.jBox.tip('启用成功!','success');
	    				  }
	    				  else if(data.ret==10){
	    					  $.jBox.info('请先登录！','温馨提示');
	    				  }
	    				  else{
	    					  $.jBox.tip('启用失败!','warning');
	    				  }
	    		  	});
	    		  }
	    	   });
	       }

	     //停用组状态    status  E：已启用；D：已停用；
	       $scope.tunnelmanagerStatus_d = function(item){
	    	   var interterminalgroupsid = item.interterminalgroupsid;
	    	   var status = 'D';
	    	   $.jBox.confirm("组名称："+item.interterminalgroupsname+"<br>"+"确定要停用吗？","温馨提示",function(v,h,f){
	    		  if(v == 'ok'){
	    		  	var url = tunnelmanagerService.getModifyinterterminalgroupUrl();
	    		  	tunnelmanagerService.httpPost(url,{status:status,interterminalgroupsid:interterminalgroupsid},function(data){
	    		  		  console.log(data);
	    				  if(data.ret==0){
	    					  $scope.queryForm();
	    					  $.jBox.tip('停用成功!','success');
	    				  }
	    				  else if(data.ret==10){
	    					  $.jBox.info('请先登录！','温馨提示');
	    				  }
	    				  else{
	    					  $.jBox.tip('停用失败!','warning');
	    				  }
	    		  	});
	    		  }
	    	   });
	       }
    	//新增组模态框显示
    	$scope.addGroup = function(){
    		$("#addGroupModal").modal("show");
    	}

    	$rootScope.tempGroupData = {};
    	$rootScope.tempGroup_tunnelreflect = {};
    	//绑定组页面跳转
    	$scope.tunnelmanagerGroup = function(item){
    		$rootScope.tempGroupData = angular.copy(item);  //获取当前组json数据
    		$state.go("interGroupTunnel");
    	}

    	//关联外部组页面跳转
    	$scope.tunnelInterGroup = function(item){
    		$rootScope.tempGroupData = angular.copy(item);  //获取当前组json数据
    		$state.go('interToexterGroup');
    	}
}]);


/*
 * =========================================
 * 新增组控制器 addInterGrouprCtr
 * =========================================
 * */
tunnelmanagerModule.controller("addInterGrouprCtr",
	    ['$scope','$rootScope', '$http', '$state',  '$timeout','tunnelmanagerService', function ($scope, $rootScope, $http, $state, $timeout,tunnelmanagerService) {
	    	//定义数据对象
	    	$scope.addDataForm = {};
	    	$scope.addDataForm.status = 'E'; //设置默认状态为启用

	       //保存新增组数据
	       $scope.onClickToSave = function(invalid){
	    	   //验证必填
	    	   $scope.addDataForm.isCommitted=true;
	        	if(invalid){
	        		//$.jBox.tip('请检查提交的数据是否正确!', 'warning');
	        		return;
	        	}

	           //拼接json格式要求 {groups:[{...},{...},...]}
	           var tempObject = {};
	           tempObject.groups = [];
	           tempObject.groups.push($scope.addDataForm);
	    	   var data = {data:JSON.stringify(tempObject)};
	    	   console.log("...提交添加组数据...");
	    	   console.log($scope.addDataForm);
	    	   var url = tunnelmanagerService.getAddinterterminalgroupUrl();
	    	   tunnelmanagerService.httpPost(url,data,function(data){
		            if(data.ret == 0){
		            	$.jBox.tip('添加成功!', 'success');

		            	$timeout(function(){
		            		$('#addGroupModal').modal('hide');
		            	},1000);
		            	$scope.queryForm();
		            	//清空数据
		            	for(var i=0; i<tempObject.groups.length;i++){
		            		for(var key in tempObject.groups[i]){
		            			tempObject.groups[i][key]="";
		            		}
		            	}

		            	$scope.addDataForm.status = 'E';
		            }
		            else if(data.ret == 10){
		            	$.jBox.info('请先登录！','温馨提示');
		            }
		            else{
		            	$.jBox.tip('添加失败!', 'warning');
		            }

	    	   });
	       }

	       //关闭新增组模态框
	       $scope.onClickToCancel = function(){
	    	   $("#addGroupModal").modal("hide");
	    	   for(var key in $scope.addDataForm){
	    		   //alert("key:"+key+",value:"+$scope.addDataForm[key]);
	    		   $scope.addDataForm[key]="";
	    	   }
	    	   $scope.addDataForm.isCommitted=false;
	    	   $scope.addDataForm.status = 'E';
	       }

}]);

/*
 * =========================================
 * 编辑内部组页面控制器 editInterGrouprCtr
 * =========================================
 * */
tunnelmanagerModule.controller("editInterGrouprCtr",
	    ['$scope','$rootScope', '$http', '$state',  '$timeout','tunnelmanagerService', function ($scope, $rootScope, $http, $state, $timeout,tunnelmanagerService) {
	       //保存编辑数据
	       $scope.onClickToSave = function(invalid){
	    	   $scope.editDataForm.isCommitted=true;
	        	if(invalid){
	        		//$.jBox.tip('请检查提交的数据是否正确!', 'warning');
	        		return;
	        	}
	    	   console.log("...保存编辑数据...");
	    	   console.log($scope.editDataForm);
	    	   var url = tunnelmanagerService.getModifyinterterminalgroupUrl();
	    	   tunnelmanagerService.httpPost(url,$scope.editDataForm,function(data){
	    	    	console.log(data);
		            if(data.ret == 0){
		            	$.jBox.tip('编辑成功!', 'success');
		            	$timeout(function(){
		            		$('#editGroupModal').modal('hide');
		            	},1000);
		            	$scope.queryForm();
		            }
		            else if(data.ret == 10){
		            	$.jBox.info('请先登录！','温馨提示');
		            }
		            else{
		            	$.jBox.tip('编辑失败!', 'warning');
		            }
		            $("#goodseditBtn").button("reset");
	    	   });
	       }
}]);


//interGroupTunnelmanagerCtr

/*
 * =================================================
 * 内部组总控制器 interGroupTunnelmanagerCtr 2015-08-03
 * =================================================
 * */
tunnelmanagerModule.controller("interGroupTunnelmanagerCtr",
	    ['$scope','$rootScope', '$http', '$state',  '$timeout','$modal','i18nService','tunnelmanagerService', function($scope, $rootScope, $http, $state, $timeout,$modal,i18nService,tunnelmanagerService) {
	    //定义数据对象
	    $scope.tunnelGroupData = {}; //定义提交绑定数据对象
	    $scope.internalData = [];  //定义内部终端号数据对象
	    $scope.externalData = [];  //定义外部终端号数据对象
	    $scope.internalData_showFlag = false;
	    $scope.externalData_showFlag = false;
	    $scope.tunnelGroupData = $rootScope.tempGroupData;  //将获取的当前的组数据赋值
	    if(!$scope.tunnelGroupData){
	    	//$.jBox.tip('获取组数据失败!'+'<br>'+'请返回重新选择组!','warning');
	    	 $.jBox.confirm("组名称不能为空！"+"<br>"+"确定返回重新选择组？","温馨提示",function(v,h,f){
	    		  if(v == 'ok'){
	    			  $state.go("interGroup");
	    			  }
	    		  })
	    }
	    console.log("获取的当前的组数据赋值...");
	    console.log($scope.tunnelGroupData);

	    //查询绑定到组的终端号
		$scope.internal_queryDataForm ={};
		$scope.internal_queryDataForm.pagesize = 10;
		$scope.internal_queryDataForm.pagenum = 1;
       	if($scope.tunnelGroupData){
       		$scope.internal_queryDataForm.interterminalgroupsid = $scope.tunnelGroupData.interterminalgroupsid;
       	}
	    //绑定内部终端号到内部组查询
        $scope.internalQueryForm = function(){
        	var url = tunnelmanagerService.getQueryintergroupsinterterminalUrl();
        	tunnelmanagerService.httpPost(url,$scope.internal_queryDataForm,function(data){
             	 $scope.internalData=data.data;
             	 console.log("绑定内部终端号到组查询161616....");
             	 console.log(data);
             	if($scope.internalData.rows.length==0){
            		 //$.jBox.tip('内部终端号的数据为空！','warning');
             		$scope.internalData_showFlag = true;
            	 }
             	else{
             		$scope.internalData_showFlag = false;
             	}
        	});
        }
        //调用绑定内部终端号到内部组查询
       $scope.internalQueryForm();
        //日期时间比较函数
        $scope.CompareDate = function(startTime,endTime){
        	return ((new Date(startTime.replace(/-/g,"\/"))) > (new Date(endTime.replace(/-/g,"\/"))));
        }

}]);


/*
 * internalGroupCtr  内部终端号绑定内部组-控制器2015-08-03
 * --------------------------------------------------
 * */
tunnelmanagerModule.controller("internalGroupCtr",
	    ['$scope', '$rootScope', '$http', '$state',  '$timeout','i18nService','tunnelmanagerService', function ($scope,$rootScope, $http, $state, $timeout,i18nService,tunnelmanagerService) {

	    	//定义内部终端号要绑定到组 数据对象
	    	$scope.internalGroupData = {};
	    	if($scope.tunnelGroupData){
	    		var interterminalgroupsid = $scope.tunnelGroupData.interterminalgroupsid; //获取当前组的id
	    		$scope.internalGroupData.interterminalgroupsid = interterminalgroupsid;
	    	}
	    	$scope.internalGroupData.intermernogroup =[];

	    	//定义查询内部终端号对象(模态框)
	    	$scope.getInternalDataForm ={};
	        $scope.getInternalDataForm.pagenum=1;
	        $scope.getInternalDataForm.pagesize=10;
	        $scope.getInternalDataForm.flag="1";  //0代表所有  1过滤已绑定

	    	//ui-grid 分页汉化
	    	i18nService.setCurrentLang('zh-cn');

	    	//显示模态框
	    	$scope.internalGroupShow = function(){
	    		$("#internalGroup_viewModal").modal("show");
	    		 //调用获取内部终端号数据
	        	$scope.getInternalData();
	    	}


	    	var getPage = function(pagenum, pagesize, sort) {
	    		$scope.getInternalDataForm.PageStart = pagenum;
	    		$scope.getInternalDataForm.PageSize = pagesize;
	    		$scope.getInternalData();
	        };

	        var paginationOptions = {
	                sort: null
	            };
	      //ui-grid
	        $scope.gridOptions = {
	        		   paginationPageSizes: [10, 20, 50, 100],
	        		   paginationPageSize: 10,
	        		   useExternalPagination: true,
	                   useExternalSorting: true,
	        	       enableCellEditOnFocus : true,
	        	       enableColumnMenus: false,
	        	       columnDefs : [
                                      { name:'序号',field:'id',type:'text',  enableCellEdit: false, width:'60', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
	        	                      { name: '内部终端号',field:'internalterminalcode',width:'150',type:'text',enableCellEdit:false},
	        	                      { name: '内部商户号',field:'internalmercode',width:'250',type:'text',enableCellEdit:false},
	        	                      { name: '内部商户名称',field:'internalmernamename',type:'text',enableCellEdit:false}
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
	                             if($scope.getPage) {
	                            	 $scope.getPage(newPage, pageSize, paginationOptions.sort);
	                             }
	                         });
	                     }
	        	     };


    		$scope.getPage = getPage;

	    	//获取内部终端号数据
	        $scope.getInternalData = function(){
	        	var url=tunnelmanagerService.getQueryinternalmernoUrl();
	        	tunnelmanagerService.httpPost(url,$scope.getInternalDataForm,function(data){
	            	 console.log("内部终端号数据:");
	            	 console.log(data);
	            	 if(data.ret==0){
	            		 $scope.gridOptions.data = data.data.rows;  //将获取数据赋值给ui-grid
		            	 $scope.gridOptions.totalItems = data.data.total;
	            	 }
	            	 else if(data.ret==10){
	            		 $.jBox.info('请先登录！','温习提示');
	            	 }
	            	 else{
	            		 $.jBox.tip("获取内部终端号数据失败", 'warning');
	            	 }
	        	});
	        }
	       

	       //保存内部终端号到组
	       $scope.onClickToSave_internal = function(){
	    	  var resulte = $scope.gridApi.selection.getSelectedRows();
	    	  console.log("获取行...");
	    	  console.log(resulte);
	    	  if(resulte.length==0){
	    		  $.jBox.tip('请勾选要绑定的数据!','warning');
	    		  return;
	    	  }
	    	  //{interterminalgroupsid,1111,intermernogroup:[{...},{...}...]}
	    	 for(var i=0; i<resulte.length; i++){
	    		 resulte[i].internalmernocode = resulte[i].interMerchantNO;
	    		 resulte[i].internalmernoname = resulte[i].interMerchantNane;
	    		 resulte[i].internalterminalno = resulte[i].interTerminalNO;
	    	 }
	    	 $scope.internalGroupData.intermernogroup = resulte;
	    	  var data ={data:JSON.stringify($scope.internalGroupData)};
	    	  console.log("提交内部终端到内部组数据...");
	    	  console.log($scope.internalGroupData);
	    	  var url = tunnelmanagerService.getAddintergroupsinterterminalUrl();
	    	  tunnelmanagerService.httpPost(url,data,function(data){
	    	    	console.log(data);
	    	    	if(data.ret==0){
			            $.jBox.tip('添加内部终端号到组成功!', 'success');
			            $("#internalGroup_viewModal").modal("hide");
			            $scope.internalQueryForm();
	    	    	}
	    	    	else if(data.ret==10){
	    	    		$.jBox.info('请先登录!','温馨提示');
	    	    	}
	    	    	else if(data.ret==22){
	    	    		$.jBox.tip(data.message,'warning');
	    	    	}
	    	    	else{
	    	    		$.jBox.tip('添加内部终端号到组失败!','warning');
	    	    	}
	    	  });
	       }

	       //删除内部终端号
	       $scope.internalDel = function(item){
	    	  // $scope.internalData.splice(index,1);
	    	   var terminalgroupsid = $scope.tunnelGroupData.terminalgroupsid; //获取当前组的id
	    	   var interterminalgroupsid = item.interterminalgroupsid;  //获取当前内部终端号的id
	    	   var internalDelData = {};
	    	   internalDelData.terminalgroupsid = terminalgroupsid;
	    	   internalDelData.flag = "0";  //内部组默认标识
	    	   internalDelData.extermernogroupids = [];
	    	   internalDelData.intermernogroupids = [];
	    	   internalDelData.intermernogroupids.push(item);
	    	   console.warn(internalDelData);
	    	   var data = {data:JSON.stringify(internalDelData)};
	        	var submit = function (v, h, f) {
	                if (v == 'ok') {
	                    $.jBox.tip("正在删除数据...", 'loading');
	                    var url = tunnelmanagerService.getDeletetunnelreflectUrl();
	                    tunnelmanagerService.httpPost(url,data,function(data){
	                        if(data.ret==0){
	                        	$scope.internalQueryForm();
	                            $.jBox.tip('删除成功!', 'success');
	                        }

	                        if(data.ret==10){
	                            $.jBox.info("请先登录！", '温馨提示');
	                        }
	                    });
	                }
	                return true; //close
	            };
	            $.jBox.confirm("内部终端号："+item.internalterminalcode+"<br>"+"确定要解除绑定 吗？", "温馨提示", submit);
	       }
}]);




