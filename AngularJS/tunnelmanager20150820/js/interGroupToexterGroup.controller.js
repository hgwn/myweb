/*lihongwen 2015-07-31
 *======================================
 * 内组关联到外部组控制器 interToexterGroupCtr
 * =======================================
 * */
tunnelmanagerModule.controller("interToexterGroupCtr",
    ['$scope','$rootScope', '$http', '$state',  '$timeout', '$modal','i18nService','tunnelmanagerService',function ($scope,$rootScope, $http, $state, $timeout,$modal,i18nService,tunnelmanagerService) {

    	$scope.tunnelGroupData = $rootScope.tempGroupData;  //将获取的当前的组数据赋值
    	if(!$scope.tunnelGroupData){
	    	 $.jBox.confirm("组名称不能为空！"+"<br>"+"确定返回重新选择组？","温馨提示",function(v,h,f){
	    		  if(v == 'ok'){
	    			  $state.go("interGroup");
	    			  }
	    		  })
	    }
    	var interterminalgroupsid =  $scope.tunnelGroupData.interterminalgroupsid;  //当前组的id
    	console.log("获取当前内部组...");
    	console.log($scope.tunnelGroupData);
    	//定义查询表单对象
     	$scope.queryDataForm = {};
     	$scope.queryDataForm.interterminalgroupsid = interterminalgroupsid;
     	$scope.queryDataForm.pagesize=10;
     	$scope.queryDataForm.pagenum=1;
     	$scope.tunnelmanagers = {};
        $scope.exterGroupData_showFlag = false;

 	   //定义组状态
         $scope.status = [
             {name : "启用",value : "E"},
             {name : "停用",value : "D"}
         ];

        //根据内部终端号组去查询关联外部终端号组
         $scope.queryForm=function(){
            var url = tunnelmanagerService.getQueryintergroupsrelationextergroupsUrl();
            tunnelmanagerService.httpPost(url,$scope.queryDataForm,function(data){
            console.log(data);
                if(data.ret==10){
                    $.jBox.info("请先登录！", '温馨提示');
                  return;
                }
                if(data.ret==0){
                    $scope.tunnelmanagers=data;
                    if($scope.tunnelmanagers.data.rows.length==0){
                         $scope.exterGroupData_showFlag = true;
                    }
                    else{
                         $scope.exterGroupData_showFlag = false;
                    }
                }
            });
         };
         //首次调用加载
         $scope.queryForm();

         //删除组 根据内部终端号组去删除外部终端号组
         $scope.tunnelmanager_del = function(item){
         	var interterminalgroupsid = item.interterminalgroupsid;  // 内部组的id
         	var exterterminalgroupsid = item.exterterminalgroupsid;  //外部组的id
         	var exterterminalgroupsname = item.exterterminalgroupsname; //外部组的名称
         	//定义删除数据对象
         	var tempObject = {};
         	var tempid = {exterterminalgroupsid:exterterminalgroupsid};
         	tempObject.flag = "1";  //删除标识
         	tempObject.interterminalgroupsid = interterminalgroupsid;
 	        tempObject.exterterminalgroups = [];
 	        tempObject.exterterminalgroups.push(tempid);
            console.log("根据内部终端号组去删除外部终端号组");
            console.log(tempObject);
 	    	var data = {data:JSON.stringify(tempObject)};
         	 $.jBox.confirm("外部组名称："+exterterminalgroupsname+"<br/>"+"确定要解除关联吗？", "温馨提示", function(v, h, f){
         		 if (v == 'ok') {
                      $.jBox.tip("正在删除数据...", 'loading');
                      var url = tunnelmanagerService.getIntergroupsrelationextergroupsUrl();
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

       //定义查询外部组对象(模态框)
        $scope.getExterGroupDataForm ={};
        $scope.getExterGroupDataForm.pagesize=10;
        $scope.getExterGroupDataForm.pagenum=1;
        $scope.getExterGroupDataForm.flag="0";
    	//ui-grid 分页汉化
    	i18nService.setCurrentLang('zh-cn');

    	var getPage = function(pagenum, pagesize, sort) {
    		$scope.getExterGroupDataForm.pagenum = pagenum;
    		$scope.getExterGroupDataForm.pagesize = pagesize;
    		//调用查询外部终端号接口
    		$scope.getExterGroupData();
        };

        $scope.getPage = getPage;
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
    	                      { name: '外部组名称',field:'exterterminalgroupsname',width:'150',type:'text',enableCellEdit:false},
    	                      { name: '描述',field:'remark',type:'text',enableCellEdit:false},
    	                      { name: '优先级',field:'priority',type:'text',width:'100',enableCellEdit:false},
    	                      { name: '状态',field:'status',width:'100',type:'text',enableCellEdit:false},
    	                      { name:'生效开始时间',field:'effectivetime', width:'150',type:'text',enableCellEdit:false },
    	                      { name: '生效结束时间',field:'expiretime',  width:'150',type:'text',enableCellEdit:false}
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

        //获取外部组数据
	        $scope.getExterGroupData = function(){
                var url = tunnelmanagerService.getQueryexterterminalgroupUrl();
                tunnelmanagerService.httpPost(url,$scope.getExterGroupDataForm,function(data){
	            	 console.log("88外部组数据数据:");
	            	 console.log(data);
	            	 if(data.ret==0){
            		  for(var i=0; i<data.data.rows.length; i++){
	            			if(data.data.rows[i].status == "E"){
	            				data.data.rows[i].status ="启用";
	            			}
	            			else{
	            				data.data.rows[i].status ="停用";
	            			}
	            		}
	            		$scope.gridOptions.data = data.data.rows;  //将获取数据赋值给ui-grid
	   	                $scope.gridOptions.totalItems = data.data.total;
	                }else if(data.ret==10){
	                    $.jBox.info("请先登录！", '温馨提示');
	                }else{
	                    $.jBox.tip("获取外部终端号数据失败", 'warning');
	                }
                });
	        }

        //外部组模态框显示
        $scope.tunnelGroup = function(){
         $("#inToexterGroup_viewModal").modal("show");
        //调用获取外部组数据
	    $scope.getExterGroupData();
        }

        //定义提交内部组绑定外部的数据对象
	   	 $scope.internalGroupData = {};
	   	 $scope.internalGroupData.interterminalgroupsid = $scope.tunnelGroupData.interterminalgroupsid; //内部组的id
	   	 $scope.internalGroupData.flag = "0"  //增加跟删除绑定关系的标志（0代表增加 1代表删除）
	   	 $scope.internalGroupData.exterterminalgroups = [];

        //内部组绑定外部组onClickToSave_exterGroup
        $scope.onClickToSave_exterGroup = function(){
        	var resulte = $scope.gridApi.selection.getSelectedRows();
	    	  if(resulte.length==0){
	    		  $.jBox.tip('请勾选要绑定的外部组!','warning');
	    		  return;
	    	  }

	    	  $scope.internalGroupData.exterterminalgroups = resulte;
	    	  var data ={data:JSON.stringify($scope.internalGroupData)};
	    	  console.log("提交内部组绑定到外部组数据...");
	    	  console.log($scope.internalGroupData);
              var url = tunnelmanagerService.getIntergroupsrelationextergroupsUrl();
              tunnelmanagerService.httpPost(url,data,function(data){
	    	    	console.log(data);
	    	    	if(data.ret==0){
			            $.jBox.tip('添加成功!', 'success');
			            $("#inToexterGroup_viewModal").modal("hide");
			            $scope.queryForm();
	    	    	}
	    	    	else if(data.ret==10){
	    	    		$.jBox.info('请先登录!','温馨提示');
	    	    	}
	    	    	else if(data.ret==18){
	    	    		$.jBox.tip(data.message,'warning');
	    	    	}
	    	    	else{
	    	    		$.jBox.tip('添加失败!','warning');
	    	    	}
              });
        }
}]);




