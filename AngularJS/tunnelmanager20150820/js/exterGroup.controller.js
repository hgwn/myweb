/*lihongwen 2015-07-30
 *======================================
 * 外部组控制器 exterGroupController
 * =======================================
 * */
tunnelmanagerModule.controller("exterGroupController",
    ['$scope','$rootScope', '$http', '$state',  '$timeout', '$modal','tunnelmanagerService',function($scope,$rootScope, $http, $state, $timeout,$modal,tunnelmanagerService) {

    	//定义查询表单对象
    	$scope.queryDataForm = {};
    	$scope.queryDataForm.pagesize=10;
    	$scope.queryDataForm.pagenum=1;
    	$scope.queryDataForm.flag="0"; //表示查询所有
    	$scope.tunnelmanagers = {};
    	$rootScope.exterGroup_showflag = true;  //
    	$rootScope.exterGroup_delBtn_showflag = true;  //操作 删除按钮显示标识
    	$rootScope.interGroup_delBtn_showflag = false;
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

	   //加载组数据
	   $scope.getQueryexterterminalgroup = function(){
	   	var url = tunnelmanagerService.getQueryexterterminalgroupUrl()+"?pagesize=10&pagenum=1&flag="+"0";
	   	tunnelmanagerService.httpGet(url,function(data){
	    	 if(data.ret==10){
                 $.jBox.info("请先登录！", '温馨提示');
                 return;
             }
	    	$scope.tunnelmanagers=data;
	    	console.log("查询组数据.....")
	    	console.log($scope.tunnelmanagers);
	   	});
	   }
		//调用加载组数据
		$scope.getQueryexterterminalgroup();
       //根据条件查询组
        $scope.queryForm=function(){
        	console.log("查询条件.....");
        	console.log($scope.queryDataForm);
        	var url = tunnelmanagerService.getQueryexterterminalgroupUrl();
        	tunnelmanagerService.httpPost(url,$scope.queryDataForm,function(data){
        		console.log(data);
        		if(data.ret==0){
        		$scope.tunnelmanagers=data;
        		}
        		if(data.ret==10){
        			$.jBox.info("请先登录！","温馨提示");
        		}
        	});
        };

        //删除组
        $scope.tunnelmanager_del = function(item){
        	//{groups:[{terminalgroupsid:11},{terminalgroupsid:11}],flag:"1"}
        	var exterterminalgroupsid = item.exterterminalgroupsid;
        	var tempObject = {};
        	tempObject.flag = "1"; //外部组默认标识
        	var tempid = {groupid:exterterminalgroupsid};
	        tempObject.groups = [];
	        tempObject.groups.push(tempid);
	    	var data = {data:JSON.stringify(tempObject)};
        	 $.jBox.confirm("组名称："+item.exterterminalgroupsname+"<br/>"+"确定要删除吗？", "温馨提示", function(v, h, f){
        		 if (v == 'ok') {
                     $.jBox.tip("正在删除数据...", 'loading');
                     var url = tunnelmanagerService.getDeletegroupUrl();
                     tunnelmanagerService.httpPost(url,data,function(data){
                         if(data.ret==0){
                             $scope.queryForm();
                             $.jBox.tip('删除成功', 'success');
                         }

                         if(data.ret==10){
                             $.jBox.info("请先登录！", '温馨提示');
                         }
                     });
                 }
                 return true; //close
        	 });
        }

        //启用组状态    status  E：已启用；D：已停用；
	       $scope.tunnelmanagerStatus_e = function(item){
	    	   var exterterminalgroupsid = item.exterterminalgroupsid;
	    	   var status = 'E';
	    	   $.jBox.confirm("组名称："+item.exterterminalgroupsname+"<br>"+"确定要启用吗？","温馨提示",function(v,h,f){
	    		  if(v == 'ok'){
	    		  	var url = tunnelmanagerService.getModifyexterterminalgroupUrl();
	    		  	tunnelmanagerService.httpPost(url,{status:status,exterterminalgroupsid:exterterminalgroupsid},function(data){
	    				  if(data.ret==0){
	    					  $scope.queryForm();
	    					  $.jBox.tip('启用成功','success');
	    				  }
	    				  else if(data.ret==10){
	    					  $.jBox.info('请先登录！','温馨提示');
	    				  }
	    				  else{
	    					  $.jBox.tip('启用失败','warning');
	    				  }
	    		  	});
	    		  }
	    	   });
	       }

	     //停用组状态    status  E：已启用；D：已停用；
	       $scope.tunnelmanagerStatus_d = function(item){
	    	   var exterterminalgroupsid = item.exterterminalgroupsid;
	    	   var status = 'D';
	    	   $.jBox.confirm("组名称："+item.exterterminalgroupsname+"<br>"+"确定要停用吗？","温馨提示",function(v,h,f){
	    		  if(v == 'ok'){
	    		  	var url = tunnelmanagerService.getModifyexterterminalgroupUrl();
	    		  	tunnelmanagerService.httpPost(url,{status:status,exterterminalgroupsid:exterterminalgroupsid},function(data){
	    				  if(data.ret==0){
	    					  $scope.queryForm();
	    					  $.jBox.tip('停用成功','success');
	    				  }
	    				  else if(data.ret==10){
	    					  $.jBox.info('请先登录！','温馨提示');
	    				  }
	    				  else{
	    					  $.jBox.tip('停用失败','warning');
	    				  }
	    		  	});
	    		  }
	    	   });
	       }

    	/*//日期控件1
    	$scope.queryloadData = function(){
    		$("#begincreatedtime,#endcreatedtime").datetimepicker({
                language: 'zh-CN',
                autoclose: true,
                todayBtn: true,
                pickerPosition: "bottom-left",
                todayHighlight: true,
                startView: 2,
                minView: 2,
                format:'yyyy-mm-dd'
            });
        }*/

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

    	//关联内部组页面跳转
    	$scope.tunnelInterGroup = function(item){
    		$rootScope.tempGroupData = angular.copy(item);  //获取当前组json数据
    		$state.go('exterTointerGroup');
    	}

    	$scope.exterGrouptooltip = {
		  "title": "Hello Tooltip<br />This is a multiline message!",
		  "checked": false
		};

}]);


/*
 * =========================================
 * 新增组控制器 addExterGrouprCtr
 * =========================================
 * */
tunnelmanagerModule.controller("addExterGrouprCtr",
	    ['$scope','$rootScope', '$http', '$state',  '$timeout','tunnelmanagerService', function ($scope, $rootScope, $http, $state, $timeout,tunnelmanagerService) {
	    	//定义数据对象
	    	$scope.addDataForm = {};
	    	$scope.addDataForm.status = 'E'; //设置默认状态为启用
	    	//日期控件2
	    	$scope.addloadData = function(){
	    		$("#add_begintime,#add_endtime").datetimepicker({
	                language: 'zh-CN',
	                autoclose: true,
	                todayBtn: true,
	                pickerPosition: "bottom-left",
	                todayHighlight: true,
	                startView: 2,
	                minView: 0,
	                minuteStep:1,
	                format: 'yyyy-mm-dd hh:ii:ss'
	            });
	        };

	       //保存新增组数据
	       $scope.onClickToSave = function(invalid){
	    	   //验证必填
	    	   $scope.addDataForm.isCommitted=true;
	        	if(invalid){
	        		//$.jBox.tip('请检查提交的数据是否正确!', 'warning');
	        		return;
	        	}
	        	var temp_effectivetime = $scope.addDataForm.effectivetime;  //获取开始日期
	        	var temp_expiretime = $scope.addDataForm.expiretime;        //获取结束日期
	        	function CompareDate(startTime,endTime)
	        	{
	        	  return ((new Date(startTime.replace(/-/g,"\/"))) > (new Date(endTime.replace(/-/g,"\/"))));
	        	}
	        	if(CompareDate(temp_effectivetime,temp_expiretime)){
	        		$.jBox.tip('生效开始时间不能大于生效结束时间!', 'warning');
	        		return;
	        	}

	           //拼接json格式要求 {groups:[{...},{...},...]}
	           var tempObject = {};
	           tempObject.groups = [];
	           tempObject.groups.push($scope.addDataForm);
	    	   var data = {data:JSON.stringify(tempObject)};
	    	   console.log("...提交添加组数据...");
	    	   console.log(data);
	    	   var url = tunnelmanagerService.getAddexterterminalgroupUrl();
	    	   tunnelmanagerService.httpPost(url,data,function(data){
	    	    	console.log(data);
		            if(data.ret == 0){
		            	$.jBox.tip('添加成功!', 'success');
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
		            	$.jBox.info('请先登录!','温馨提示');
		            }
		            else{
		            	$.jBox.tip('添加失败!', 'warning');
		            }
	            	$timeout(function(){
	            		$('#addGroupModal').modal('hide');
	            	},1000);
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
 * 编辑外部组控制器 editExterGrouprCtr
 * =========================================
 * */
tunnelmanagerModule.controller("editExterGrouprCtr",
	    ['$scope','$rootScope', '$http', '$state',  '$timeout','tunnelmanagerService', function ($scope, $rootScope, $http, $state, $timeout,tunnelmanagerService) {
	    	//日期控件2
	    	$scope.editloadData = function(){
	    		$("#edit_begintime,#edit_endtime").datetimepicker({
	                language: 'zh-CN',
	                autoclose: true,
	                todayBtn: true,
	                pickerPosition: "bottom-left",
	                todayHighlight: true,
	                startView: 2,
	                minView: 0,
	                minuteStep:1,
	                format: 'yyyy-mm-dd hh:ii:ss'
	            });
	        };

	       //保存编辑数据
	       $scope.onClickToSave = function(invalid){
	    	   $scope.editDataForm.isCommitted=true;
	        	if(invalid){
	        		//$.jBox.tip('请检查提交的数据是否正确!', 'warning');
	        		return;
	        	}
	        	var temp_effectivetime = $scope.editDataForm.effectivetime;  //获取开始日期
	        	var temp_expiretime = $scope.editDataForm.expiretime;        //获取结束日期
	        	function CompareDate(startTime,endTime)
	        	{
	        	  return ((new Date(startTime.replace(/-/g,"\/"))) > (new Date(endTime.replace(/-/g,"\/"))));
	        	}
	        	if(CompareDate(temp_effectivetime,temp_expiretime)){
	        		$.jBox.tip('生效开始时间不能大于生效结束时间!', 'warning');
	        		return;
	        	}
	    	   console.log("...保存编辑数据...");
	    	   console.log($scope.editDataForm);
	    	   //var data = {data:JSON.stringify($scope.editDataForm)};
	    	   var url = tunnelmanagerService.getModifyexterterminalgroupUrl();
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


//tunnelmanagerGroupController

/*
 * =============================================
 * 绑定组 总控制器 exterGroupTunnelmanagerCtr
 * =============================================
 * */
tunnelmanagerModule.controller("exterGroupTunnelmanagerCtr",
	    ['$scope','$rootScope', '$http', '$state',  '$timeout','$modal','i18nService','tunnelmanagerService', function ($scope, $rootScope, $http, $state, $timeout,$modal,i18nService,tunnelmanagerService) {

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
	    			  $state.go("exterGroup");
	    			  }
	    		  })
	    }
	    console.log("获取的当前的组数据赋值...");
	    console.log($scope.tunnelGroupData);

	    //查询绑定到组的终端号
    	$scope.external_queryDataForm ={};
    	$scope.external_queryDataForm.pagesize = 10;
    	$scope.external_queryDataForm.pagenum = 1;
       	if($scope.tunnelGroupData){
       		$scope.external_queryDataForm.exterterminalgroupsid = $scope.tunnelGroupData.exterterminalgroupsid;
       	}

        //绑定外部终端号到组查询
        $scope.externalQueryForm = function(){
        	var url = tunnelmanagerService.getQueryextergroupsexterterminalUrl();
        	tunnelmanagerService.httpPost(url,$scope.external_queryDataForm,function(data){
             	 console.log("绑定外部终端号到组查询8888......");
             	 console.log(data);
        		if(data.ret==0){
             	 $scope.externalData=data.data;
	             	 if($scope.externalData.rows.length==0){
	             		 //$.jBox.tip('外部终端号的数据为空！','warning');
	             		 $scope.externalData_showFlag = true;
	             	 }
	             	 else{
	             		$scope.externalData_showFlag = false;
	             	 }
        		}
        		else if(data.ret ==10){
        			$.jBox.info("请先登录！","温馨提示");
        		}
        		else{
        			$.jBox.tip("查询失败！","warning");
        		}
        	});
        }

        $scope.externalQueryForm();

        //日期时间比较函数
        $scope.CompareDate = function(startTime,endTime){
        	return ((new Date(startTime.replace(/-/g,"\/"))) > (new Date(endTime.replace(/-/g,"\/"))));
        }

}]);


/*
 * externalGroupCtr  绑定组--外部终端号控制器
 * -----------------------------------
 * */
tunnelmanagerModule.controller("externalGroupCtr",
	    ['$scope', '$http', '$state',  '$timeout','i18nService','tunnelmanagerService', function ($scope, $http, $state, $timeout,i18nService,tunnelmanagerService) {

	    	//定义外部终端号要绑定到组 数据对象
	    	$scope.extermernoGroupData = {};
	    	if($scope.tunnelGroupData){
	    		var exterterminalgroupsid = $scope.tunnelGroupData.exterterminalgroupsid;
		    	$scope.extermernoGroupData.exterterminalgroupsid = exterterminalgroupsid;
	    	}
	    	$scope.extermernoGroupData.extermernogroup =[];
	    	//定义查询外部终端号对象(模态框)
	        $scope.getexternalDataForm ={};
   	        $scope.getexternalDataForm.pagenum=1;
   	        $scope.getexternalDataForm.pagesize=10;
   	        $scope.getexternalDataForm.flag="1";  //0代表所有  1表示过滤已绑定
	    	//ui-grid 分页汉化
	    	i18nService.setCurrentLang('zh-cn');

	    	//显示模态框
	    	$scope.externalGroupShow = function(){
	    		$("#externalGroup_viewModal").modal("show");
	    		//调用查询外部组终端号
	    		$scope.getexternalData();
	    	}

	    	var getPage = function(pagenum, pagesize, sort) {
	    		$scope.getexternalDataForm.pagenum = pagenum;
	    		$scope.getexternalDataForm.pagesize = pagesize;
	    		//调用查询外部终端号接口
	    		$scope.getexternalData();
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
        	                      { name: '外部终端号',field:'externalterminalcode',width:'90',type:'text',enableCellEdit:false},
        	                      { name: '外部商户号',field:'externalmercode',width:'130',type:'text',enableCellEdit:false},
        	                      { name: '外部商户名称',field:'externalmername',type:'text',enableCellEdit:false},
        	                      { name: '支付通道代码',field:'paymentchannelcode',width:'100',type:'text',enableCellEdit:false},
        	                      { name: '支付通道名称',field:'paymentchannelname',width:'140',type:'text',enableCellEdit:false},
        	                      { name: '通道优先级',field:'priority',width:'90',type:'text',enableCellEdit:false},
        	                      { name: '外部终端号优先级',field:'externalterminalcodepriority',width:'150',type:'text',placeholder:'请输入优先级'},
        	                      {name:'生效开始时间',field:'effectivetime', width:'150' ,  cellTemplate:'<div class="ui-grid-cell-contents"><input  type="text" style="border:none; background:none;" ng-model="row.entity.effectivetime"  id="datetimepicker_start{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}" ng-click="grid.appScope.datetimepicker_start(grid.renderContainers.body.visibleRowCache.indexOf(row))"/></div>'},
        	                      { name: '生效结束时间',field:'expiretime',  width:'150', cellTemplate:'<div class="ui-grid-cell-contents"><input  type="text" style="border:none; background:none;" ng-model="row.entity.expiretime"  id="datetimepicker_end{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}" ng-click="grid.appScope.datetimepicker_end(grid.renderContainers.body.visibleRowCache.indexOf(row))"/></div>'}
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
	        //获取外部终端号数据
   	        $scope.getexternalData = function(){
   	        	var url = tunnelmanagerService.getQueryexternalmernoUrl();
   	        	tunnelmanagerService.httpPost(url,$scope.getexternalDataForm,function(data){
   	            	 console.log("外部终端号数据:");
   	            	 console.log(data);
   	            	 if(data.ret==0){
   	            		$scope.gridOptions.data = data.data.rows;  //将获取数据赋值给ui-grid
   	   	                $scope.gridOptions.totalItems = data.data.total;
 	                }else if(data.ret==10){
 	                    $.jBox.info("请先登录！", '温馨提示');
 	                }else{
 	                    $.jBox.tip("获取外部终端号数据失败", 'warning');
 	                }
   	        	});
   	        }

   	        //验证非负整数
   	        $scope.valiNum=function(strValue){
   	        	 var reg = /^\d+$/
                 return !reg.test(strValue)
   	        }
	        //绑定外部终端号到组
	       $scope.onClickToSave_external = function(){
	    	   resulte = $scope.gridApi.selection.getSelectedRows();
	    	   if(resulte.length<1){
		    		  $.jBox.tip('请勾选要绑定的数据!','warning');
		    		  return;
		    	  }
	    	   for(var i =0; i<resulte.length;i++){
	    		  var temp_effectivetime = resulte[i].effectivetime;
	    		  var temp_expiretime = resulte[i].expiretime;
	    		  var externalterminalcodepriority = resulte[i].externalterminalcodepriority; //外部终端号优先级
	    		  if(externalterminalcodepriority==undefined||externalterminalcodepriority==""){
	    			  $.jBox.tip('外部终端号优先级不能为空！','warning');
	    			  return;
	    		  }
	    		  if(externalterminalcodepriority!=null){
	    		  		if($scope.valiNum(externalterminalcodepriority)){
	    		  			$.jBox.tip('优先级应为非负整数！','warning');
	    			  		return;
	    		  		}
	    		  }
	    		  if(temp_effectivetime==undefined ||temp_effectivetime==""){
	    			  $.jBox.tip('生效开始时间不能为空！','warning');
	    			  return;
	    		  }
	    		  if(temp_expiretime==undefined||temp_expiretime==""){
	    			  $.jBox.tip('生效结束时间不能为空！','warning');
	    			  return;
	    		  }
	    		  if($scope.CompareDate(temp_effectivetime,temp_expiretime)){
	    			  $.jBox.tip('生效开始时间不能大于生效结束时间！','warning');
	    			  return;
	    		  }
	    		 
		    	}

	    	   $scope.extermernoGroupData.extermernogroup = resulte;
	    	   console.log("提交数据外部终端奥....");
	    	   console.log($scope.extermernoGroupData);
		    	  var data ={data:JSON.stringify($scope.extermernoGroupData)};
		    	  var url = tunnelmanagerService.getAddextergroupsexterterminalUrl();
		    	  tunnelmanagerService.httpPost(url,data,function(data){
		    	    	console.log(data);
		    	    	if(data.ret==0){
		    	    		//$scope.externalData = data;
				            $.jBox.tip('添加外部终端号到组成功!', 'success');
				            $("#externalGroup_viewModal").modal("hide");
				            $scope.externalQueryForm();
		    	    	}
		    	    	else if(data.ret==10){
		    	    		$.jBox.info('请先登录!','温习提示');
		    	    	}
		    	    	else if(data.ret==24){
		    	    		$.jBox.tip(data.message,'warning');
		    	    	}
		    	    	else if(data.ret==8){
		    	    		$.jBox.tip(data.message,'warning');
		    	    	}
		    	    	else{
		    	    		$.jBox.tip('添加外部终端号到组失败!','warning');
		    	    	}
		    	  });
	       }

	       //删除外部终端号
	       $scope.externalDel=function(item){
	    	  // $scope.externalData.splice(index,1);
	    	   var terminalgroupsid = item.terminalgroupsid; //获取当前组的id
	    	   var exterterminalgroupsid = item.exterterminalgroupsid;  //获取当前内部终端号的id
	    	   var externalDelData = {};
	    	   externalDelData.flag = "1";//外部组默认标识
	    	   externalDelData.terminalgroupsid = terminalgroupsid;
	    	   externalDelData.extermernogroupids = [];
	    	   externalDelData.intermernogroupids = [];

	    	   externalDelData.extermernogroupids.push(item);
	    	   var data = {data:JSON.stringify(externalDelData)};
	        	var submit = function (v, h, f) {
	                if (v == 'ok') {
	                    $.jBox.tip("正在删除数据...", 'loading');
	                    var url = tunnelmanagerService.getDeletetunnelreflectUrl();
	                    tunnelmanagerService.httpPost(url,data,function(data){
	                        if(data.ret==0){
	                        	$scope.externalQueryForm();
	                            $.jBox.tip('删除成功', 'success');
	                        }

	                        if(data.ret==10){
	                            $.jBox.info("请先登录！", '温馨提示');
	                        }
	                    });
	                }
	                return true; //close
	            };
	            $.jBox.confirm("外部终端号："+item.externalterminalcode+"<br>"+"确定要解除绑定 吗？", "温馨提示", submit);
	       }

	     //外部终端号ui-grid 开始日期
	       $scope.datetimepicker_start = function(index){
	    	   console.log(index)
		        $("#datetimepicker_start"+index).datetimepicker({
	                language: 'zh-CN',
	                autoclose: true,
	                todayBtn: true,
	                pickerPosition: "bottom-left",
	                todayHighlight: true,
	                startView: 2,
	                minView: 0,
	                minuteStep:1,
	                format: 'yyyy-mm-dd hh:ii:ss'

	            });
	    	   $("#datetimepicker_start"+index).datetimepicker('show');
	       }

	       //外部终端号ui-grid 结束日期
	       $scope.datetimepicker_end = function(index){
		        $("#datetimepicker_end"+index).datetimepicker({
	                language: 'zh-CN',
	                autoclose: true,
	                todayBtn: true,
	                pickerPosition: "bottom-left",
	                todayHighlight: true,
	                startView: 2,
	                minView: 0,
	                format: 'yyyy-mm-dd hh:ii:ss'

	            });
	    	   $("#datetimepicker_end"+index).datetimepicker('show');
	       }

}]);


