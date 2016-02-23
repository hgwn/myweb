/*======================================
 * 外部终端绑定查询页面控制器 exSearchTunnelController
 * =======================================
 * */
tunnelmanagerModule.controller("exSearchTunnelController",
    ['$scope','$rootScope', '$http', '$state',  '$timeout', '$modal','$interval','uiGridGroupingConstants','tunnelmanagerService','i18nService',function ($scope,$rootScope, $http, $state, $timeout,$modal,$interval,uiGridGroupingConstants,tunnelmanagerService,i18nService) {
      //定义查询数据对象
      $scope.getexternalDataForm={};
      $scope.getexternalDataForm.pagenum = 1;
      $scope.getexternalDataForm.pagesize = 10;
      $scope.getexternalDataForm.flag = "1";    //设置一级节点标识

      $scope.getexterterminalgroupsnameDataForm = {};  //设置获取外部组数据对象
      $scope.getexterterminalgroupsnameDataForm.pagenum = "";
      $scope.getexterterminalgroupsnameDataForm.pagesize="";
      $scope.getexterterminalgroupsnameDataForm.flag="1";   //0所有 1绑定终端  2没有绑定组
      //ui-grid 分页汉化
      i18nService.setCurrentLang('zh-cn');
    	$scope.gridOptions = {
          paginationPageSizes: [10, 20, 50, 100],
          paginationPageSize: 10,
    		  enableSorting: false,
    		  enableFiltering: true,
    		  showTreeExpandNoChildren: true,
    		  enableColumnMenus: false,
    	    enableRowSelection: true,
    	    enableSelectAll: true,
          enableCellEditOnFocus :false,
    		  columnDefs: [
              { name: '外部终端号', field:'externalterminalcode' ,type:'text'},
              { name: '外部商户号', field:'externalmercode' ,type:'text'},
              { name: '外部商户名称', field:'externalmername' ,type:'text'},
              { name: '通道代码', field:'paymentchannelcode' ,type:'text'},
              { name: '通道名称', field:'paymentchannelname' ,type:'text'},
              { name: '外部组名称', field:'exterterminalgroupsname' ,type:'text'},
              { name: '内部组名称', field:'interterminalgroupsname' ,type:'text'},
              { name: '内部终端号', field:'internalterminalcode',type:'text'},
              { name: '内部商户号', field:'internalmercode' ,type:'text'},
              { name: '内部商户名称', field:'internalmernamename' ,type:'text'}
		      ],
		      onRegisterApi: function( gridApi ) {
		          $scope.gridApi = gridApi;
		          //无子节点的节点也显示'展开图标'
		          $scope.gridOptions.showTreeExpandNoChildren = true;
//    		          $scope.gridApi.grid.refresh();
                  $scope.gridApi.treeBase.on.rowExpanded($scope, function(row){     //+展开事件
                    console.log("获取行数据...");
                    console.log(row.entity);  //获取行数据
                    //console.log($scope.gridOptions.data.indexOf(row.entity));
                    var index = $scope.gridOptions.data.indexOf(row.entity)+1;     //索引
                    var treeLevel = row.entity.$$treeLevel;
                    var interterminalgroupsid = row.entity.interterminalgroupsid;
                    var exterterminalgroupsid = row.entity.exterterminalgroupsid;
                    if(treeLevel==0){
                        if(!row.entity.nodeLoaded){
                          $interval(function(){
                            if(exterterminalgroupsid==undefined) return;
                              var url =  tunnelmanagerService.getAllbyexterterminalUrl()+"?flag=2&exterterminalgroupsid="+exterterminalgroupsid;
                              tunnelmanagerService.httpGet(url,function(data){
                                console.log("flag222");
                                console.log(data);
                                  var resulte = angular.copy(data);
                                  for(var i =0; i<resulte.data.rows.length; i++){
                                      resulte.data.rows[i].$$treeLevel=row.entity.$$treeLevel+1;    //设置二级节点 $$treeLevel
                                      resulte.data.rows[i].nodeLoaded = false;
                                      $scope.gridOptions.data.splice(index,0,resulte.data.rows[i]);

                                  }
                              });
                              row.entity.nodeLoaded = true;
                              console.log("$scope.gridOptions.data22");
                              console.log($scope.gridOptions.data);
                          },600, 1)
                      }
                    }
                    if(treeLevel==1){
                      if(!row.entity.nodeLoaded){
                          $interval(function(){
                            if(interterminalgroupsid==undefined) return;
                              var url =  tunnelmanagerService.getAllbyexterterminalUrl()+"?flag=3&interterminalgroupsid="+interterminalgroupsid;
                              tunnelmanagerService.httpGet(url,function(data){
                                console.log("flag33");
                                console.log(data);
                                  var resulte = angular.copy(data);
                                  for(var i =0; i<resulte.data.rows.length; i++){
                                      resulte.data.rows[i].$$treeLevel=row.entity.$$treeLevel+1;    //设置三级节点 $$treeLevel
                                      resulte.data.rows[i].nodeLoaded = false;
                                      $scope.gridOptions.data.splice(index,0,resulte.data.rows[i]);

                                  }
                              });
                              row.entity.nodeLoaded = true;
                              console.log("$scope.gridOptions.data33");
                              console.log($scope.gridOptions.data);
                          },600, 1)
                      }
                    }
                  });
    		      }
    		};

        //加载外部终端号关联外部组数据
        $scope.getExterData = function(){
            var url = tunnelmanagerService.getAllbyexterterminalUrl();
            tunnelmanagerService.httpPost(url,$scope.getexternalDataForm,function(data){
              if(data.ret==10){
                $.jBox.info("请先登陆！","温馨提示");
                return;
              }
              console.log("加载外部终端号查询所有关于终端号的关联信息88");
              console.log(data);
              var resulte = angular.copy(data);
              //alert(resulte.data.rows.length);
              if(resulte.data.rows.length){
                for(var i=0; i<resulte.data.rows.length; i++){
                  resulte.data.rows[i].$$treeLevel = 0;   //设置根节点 $$treeLevel = 0
                  resulte.data.rows[i].nodeLoaded = false;
                }
                $scope.gridOptions.data = resulte.data.rows;
              }
              else{
                $scope.gridOptions.data.length = 0;
                $.jBox.info("查询数据为空！","温馨提示");
              }
            });
        }

        //调用外部终端号关联外部组数据
        $scope.getExterData();

    	$scope.expandAll = function(){
    	    $scope.gridApi.treeBase.expandAllRows();
    	  };

	    $scope.toggleRow = function( rowNum ){
		    $scope.gridApi.treeBase.toggleRowTreeState($scope.gridApi.grid.renderContainers.body.visibleRowCache[rowNum]);
		  };

      //获取外部组数据
      $scope.getexterterminalgroupsnameData = function(){
          var url = tunnelmanagerService.getQueryexterterminalgroupUrl();
          tunnelmanagerService.httpPost(url,$scope.getexterterminalgroupsnameDataForm,function(data){
            console.log(data);
            $scope.exterterminalgroupsnameData = data.data.rows;
          });
      }
      //调用获取外部组数据
      $scope.getexterterminalgroupsnameData();

}]);



