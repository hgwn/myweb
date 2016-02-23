/*======================================
 * 外部商户号管理控制器
 externalmercodeController
 * =======================================
 * */
tunnelmanagerModule.controller("externalmercodeController",
    ['$scope','$rootScope', '$http', '$state',  '$timeout', '$modal','$interval','uiGridGroupingConstants','i18nService','tunnelmanagerService',function ($scope,$rootScope, $http, $state, $timeout,$modal,$interval,uiGridGroupingConstants,i18nService,tunnelmanagerService) {
      //定义查询外部商户号对象(模态框)
      $scope.getexternalDataForm ={};
      $scope.getexternalDataForm.pagenum=1;
      $scope.getexternalDataForm.pagesize=10;

      //定义外部商户号状态
      $scope.externalmercodestatus=[
      {value:"D",name:"停用"},
      {value:"E",name:"启用"}
      ]
      //ui-grid 分页汉化
      i18nService.setCurrentLang('zh-cn');

      var getPage = function(pagenum, pagesize, orders,orderkey) {
          $scope.getexternalDataForm.pagenum = pagenum;
          $scope.getexternalDataForm.pagesize = pagesize;
          $scope.getexternalDataForm.orders = orders;
          $scope.getexternalDataForm.orderkey = orderkey;
          //调用查询外部商户号接口
          $scope.getexternalData();
          };

      var paginationOptions = {
              orders: null,
              orderkey:null
          };
    	//ui-grid
          $scope.gridOptions = {
               paginationPageSizes: [10, 20, 50, 100],
               paginationPageSize: 10,
               useExternalPagination: true,
               useExternalSorting: true,
               enableColumnMenus: false,
               enableGridMenu: true,
               columnDefs : [
                                { name:'序号',field:'id',type:'text',  width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>',enableSorting: false,enableColumnResizing:false,enableHiding: false},
                                { name: '外部商户号',field:'externalmercode',width:'150',type:'text',enableCellEdit:false},
                                { name: '外部商户名称',field:'externalmername',type:'text',enableCellEdit:false},
                                {name:'外部商户号状态',field:'externalmercodestatus',width:'150',type:'text'},
                                {name:'最后修改时间',field:'updatedtime',width:'150',type:'text'}
                               ],
                     onRegisterApi: function(gridApi) {
                         $scope.gridApi = gridApi;
                         $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                             if(getPage) {
                                 if (sortColumns.length > 0) {
                                     paginationOptions.orders = sortColumns[0].colDef.field;  //获取orders
                                     paginationOptions.orderkey = sortColumns[0].sort.direction;//获取orderkey
                                 } else {
                                     paginationOptions.orders = null;
                                     paginationOptions.orderkey = null;
                                 }
                                 getPage(grid.options.paginationCurrentPage, grid.options.paginationPageSize, paginationOptions.orders,paginationOptions.orderkey)
                             }
                         });
                         gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                             if($scope.getPage) {
                              $scope.getPage(newPage, pageSize,paginationOptions.orders, paginationOptions.orderkey);
                             }
                         });
                     }
               };

          $scope.getPage = getPage;
          //获取外部商户号数据
            $scope.getexternalData = function(){

              var url = tunnelmanagerService.getQueryExternalmercodeUrl();
              tunnelmanagerService.httpPost(url,$scope.getexternalDataForm,function(data){
                   console.log("外部商户号数据:");
                   console.log(data);
                   if(data.ret==0){
                    for(var i=0; i<data.data.rows.length; i++){
                      if(data.data.rows[i].externalmercodestatus=="E"){
                        data.data.rows[i].externalmercodestatus="启用";
                      }
                      else{
                        data.data.rows[i].externalmercodestatus="停用";
                      }
                    }

                    $scope.gridOptions.data = data.data.rows;  //将获取数据赋值给ui-grid
                        $scope.gridOptions.totalItems = data.data.total;
                  }else if(data.ret==10){
                      $.jBox.info("请先登录！", '温馨提示');
                  }else{
                      $.jBox.tip("获取外部商户号数据失败", 'warning');
                  }
              });
            }
        //调用获取外部商户号数据
        $scope.getexternalData();
        //启用
        $scope.setInterState_E=function(){
          var resulte = angular.copy($scope.gridApi.selection.getSelectedRows()); //获取行数据
          var url = tunnelmanagerService.getOperateExternalmercodeUrl();
          if(resulte.length<1){
             $.jBox.tip("请勾选要操作的数据！","warning");
             return;
          }
          else{
            //转换启用为E，停用为D
            for(var i=0; i<resulte.length; i++){
              resulte[i].externalmercodestatus="E";
            }
          }
          var temp = {externalmercodes:resulte};
          console.log("提交启用数据......");
          console.log(temp);
          var data = {data:JSON.stringify(temp)}
          tunnelmanagerService.httpPost(url,data,function(data){
            console.log(data);
            if(data.ret==0){
               $scope.getexternalData()
              $.jBox.tip("启用成功！","success");
              //取消全选
               $scope.gridApi.selection.clearSelectedRows();
            }
            else{
              $.jBox.tip(data,"warning");
            }
          });

        }

        //停用
        $scope.setInterState_D=function(){
          var resulte = angular.copy($scope.gridApi.selection.getSelectedRows()); //获取行数据
          var url = tunnelmanagerService.getOperateExternalmercodeUrl();
          if(resulte.length<1){
             $.jBox.tip("请勾选要操作的数据！","warning");
             return;
          }
          else{
            //转换启用为E，停用为D
            for(var i=0; i<resulte.length; i++){
              resulte[i].externalmercodestatus="D";
            }
          }
          var temp = {externalmercodes:resulte};
          console.log("提交停用数据......");
          console.log(temp);
          var data = {data:JSON.stringify(temp)}
          tunnelmanagerService.httpPost(url,data,function(data){
            console.log(data);
            if(data.ret==0){
               $scope.getexternalData()
              $.jBox.tip("停用成功！","success");
              //取消全选
               $scope.gridApi.selection.clearSelectedRows();
            }
            else{
              $.jBox.tip(data,"warning");
            }
          });

        }

}]);



