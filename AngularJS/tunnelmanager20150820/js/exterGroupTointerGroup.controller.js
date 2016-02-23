/*lihongwen 2015-07-30
 *======================================
 * 外部组关联到内部组控制器 exterTOinterGroupCtr
 * =======================================
 * */
tunnelmanagerModule.controller("exterTointerGroupCtr",
    ['$scope','$rootScope', '$http', '$state',  '$timeout', '$modal','i18nService','tunnelmanagerService',function ($scope,$rootScope, $http, $state, $timeout,$modal,i18nService,tunnelmanagerService) {

    	$scope.tunnelGroupData = $rootScope.tempGroupData;  //将获取的当前的组数据赋值
    	if(!$scope.tunnelGroupData){
	    	 $.jBox.confirm("组名称不能为空！"+"<br>"+"确定返回重新选择组？","温馨提示",function(v,h,f){
	    		  if(v == 'ok'){
	    			  $state.go("exterGroup");
	    			  }
	    		  })
	    }
    	var exterterminalgroupsid =  $scope.tunnelGroupData.exterterminalgroupsid; //外部组的id;
    	//定义查询表单对象
     	$scope.queryDataForm = {};
     	$scope.queryDataForm.exterterminalgroupsid = $scope.tunnelGroupData.exterterminalgroupsid;
     	$scope.queryDataForm.pagesize=10;
     	$scope.queryDataForm.pagenum=1;
     	$scope.tunnelmanagers = {};
      $scope.interGroupData_showFlag = false;

 	   //定义组状态
         $scope.status = [
             {name : "启用",value : "E"},
             {name : "停用",value : "D"}
         ];


        //根据条件查询组
         $scope.queryForm=function(){
         	console.warn("外部组绑定内部组查询....");
         	console.log($scope.queryDataForm);
          var url = tunnelmanagerService.getQueryextergroupsrelationintergroupsUrl();
          tunnelmanagerService.httpPost(url,$scope.queryDataForm,function(data){
               if(data.ret==10){
                  $.jBox.info("请先登录！", '温馨提示');
                  return;
               }
               if(data.ret==0){
             	    $scope.tunnelmanagers=data;
                  if($scope.tunnelmanagers.data.rows.length){
                    $scope.interGroupData_showFlag = false;
                  }
                  else{
                    $scope.interGroupData_showFlag = true;
                  }
               }
          });
         };
         //首次调用加载条件查询
         $scope.queryForm();

         //删除组 根据外部终端号组去删除内部终端号组
         $scope.tunnelmanager_del = function(item){
        	var interterminalgroupsid = item.interterminalgroupsid;  // 内部组的id
          	var exterterminalgroupsid = item.exterterminalgroupsid;  //外部组的id
          	var interterminalgroupsname = item.interterminalgroupsname; //内部组的名称
          	//定义删除数据对象
          	var tempObject = {};
          	var tempid = {interterminalgroupsid:interterminalgroupsid};
          	tempObject.flag = "1";  //删除标识
          	tempObject.exterterminalgroupsid = exterterminalgroupsid;
  	        tempObject.interterminalgroups = [];
  	        tempObject.interterminalgroups.push(tempid);
  	        var data = {data:JSON.stringify(tempObject)};
         	 $.jBox.confirm("组名称："+interterminalgroupsname+"<br/>"+"确定要解除关联吗？", "温馨提示", function(v, h, f){
         		 if (v == 'ok') {
                      $.jBox.tip("正在删除数据...", 'loading');
                      var url = tunnelmanagerService.getExtergroupsrelationintergroupsUrl();
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

       //定义查询内部组对象(模态框)
        $scope.getInterGroupDataForm ={};
        $scope.getInterGroupDataForm.pagesize=10;
        $scope.getInterGroupDataForm.pagenum=1;
        $scope.getInterGroupDataForm.flag="0";
    	//ui-grid 分页汉化
    	i18nService.setCurrentLang('zh-cn');

    	var getPage = function(pagenum, pagesize, sort) {
    		$scope.getInterGroupDataForm.pagenum = pagenum;
    		$scope.getInterGroupDataForm.pagesize = pagesize;
    		//调用查询外部终端号接口
    		$scope.getInterGroupData();
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
    	                      { name: '内部组名称',field:'interterminalgroupsname',width:'100',type:'text',enableCellEdit:false},
    	                      { name: '描述',field:'remark',type:'text',enableCellEdit:false},
    	                      { name: '状态',field:'status',width:'120',type:'text',enableCellEdit:false}
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

        //获取内部组数据
	        $scope.getInterGroupData = function(){
            var url = tunnelmanagerService.getQueryinterterminalgroupUrl();
            tunnelmanagerService.httpPost(url,$scope.getInterGroupDataForm,function(data){
	            	 console.log("88内部组数据数据:");
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
	            		console.log("转换....");
	            		console.log(data.data.rows);
	            		$scope.gridOptions.data = data.data.rows;  //将获取数据赋值给ui-grid
	   	                $scope.gridOptions.totalItems = data.data.total;
	                }else if(data.ret==10){
	                    $.jBox.info("请先登录！", '温馨提示');
	                }else{
	                    $.jBox.tip("获取数据失败", 'warning');
	                }
            });
	        }
          

	    //内部组模态框显示
        $scope.tunnelGroup = function(){
       	 $("#exTointerGroup_viewModal").modal("show");
         //调用获取内部组数据
         $scope.getInterGroupData();
        }

      //定义提交外部组绑定内部部的数据对象
	   	 $scope.externalGroupData = {};
	   	 $scope.externalGroupData.exterterminalgroupsid = $scope.tunnelGroupData.exterterminalgroupsid; //外部组的id
	   	 $scope.externalGroupData.flag = "0"  //增加跟删除绑定关系的标志（0代表增加 1代表删除）
	   	 $scope.externalGroupData.interterminalgroups = [];

       //外部组绑定内部部组onClickToSave_interGroup
       $scope.onClickToSave_interGroup = function(){
       	var resulte = $scope.gridApi.selection.getSelectedRows();
	    	  if(resulte.length==0){
	    		  $.jBox.tip('请勾选要绑定的内部组!','warning');
	    		  return;
	    	  }

	    	  $scope.externalGroupData.interterminalgroups = resulte;
	    	  var data ={data:JSON.stringify($scope.externalGroupData)};
	    	  console.log("提交外部组绑定到内部组数据...");
	    	  console.log($scope.externalGroupData);
          var url = tunnelmanagerService.getExtergroupsrelationintergroupsUrl();
          tunnelmanagerService.httpPost(url,data,function(data){
	    	    	console.log(data);
	    	    	if(data.ret==0){
			            $.jBox.tip('添加成功!', 'success');
			            $("#exTointerGroup_viewModal").modal("hide");
			            $scope.queryForm();
	    	    	}
	    	    	else if(data.ret==10){
	    	    		$.jBox.info('请先登录!','温馨提示');
	    	    	}
	    	    	else if(data.ret==24){
	    	    		$.jBox.tip(data.message,'warning');
	    	    	}
	    	    	else{
	    	    		$.jBox.tip('添加失败!','warning');
	    	    	}
          });
       }
}]);




