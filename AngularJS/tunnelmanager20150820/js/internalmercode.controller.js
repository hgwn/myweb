/*======================================
 * 内部商户号管理控制器
 internalmercodeController
 * =======================================
 * */
tunnelmanagerModule.controller("internalmercodeController",
    ['$scope','$rootScope', '$http', '$state',  '$timeout', '$modal','$interval','uiGridGroupingConstants','i18nService','tunnelmanagerService',function ($scope,$rootScope, $http, $state, $timeout,$modal,$interval,uiGridGroupingConstants,i18nService,tunnelmanagerService) {
      //定义查询对象
      $scope.getinternalDataForm ={};
      $scope.getinternalDataForm.pagenum=1;
      $scope.getinternalDataForm.pagesize=10;

      //定义终端号状态
      $scope.internalmernamestatus=[
      {value:"D",name:"停用"},
      {value:"E",name:"启用"}
      ]
      //ui-grid 分页汉化
      i18nService.setCurrentLang('zh-cn');

      var getPage = function(pagenum, pagesize, orders,orderkey) {
          $scope.getinternalDataForm.pagenum = pagenum;
          $scope.getinternalDataForm.pagesize = pagesize;
          $scope.getinternalDataForm.orders = orders;
          $scope.getinternalDataForm.orderkey = orderkey;
          //调用查询内部商户号接口
          $scope.getinternalData();
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
                  enableSorting: true,
                  enableColumnMenus: false,
                  enableGridMenu: true,
                  columnDefs : [
                                { name:'序号',field:'id',type:'text',  width:'55',enableHiding: false,enableSorting: false, enableColumnResizing:false, cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
                               /* { name: 'edit',type:'text', displayName: '操作', cellTemplate: '<button id="editBtn" type="button" class="btn-small" ng-click="grid.appScope.edit(row.entity)" >编辑</button> '},*/
                                { name: '内部商户号',field:'internalmercode',width:'150',type:'text'},
                                { name: '内部商户名称',field:'internalmernamename',type:'text'},
                                {name:'内部商户号状态',field:'internalmernamestatus',width:'150',type:'text'},
                                {name:'最后修改时间',field:'updatedtime',width:'150',type:'text'}
                               ],
                     onRegisterApi: function(gridApi) {
                         $scope.gridApi = gridApi;
                         $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                             if(getPage) {
                                 if (sortColumns.length > 0) {
                                     paginationOptions.orders = sortColumns[0].colDef.field;//获取列标题字段名
                                     paginationOptions.orderkey = sortColumns[0].sort.direction;
                                 } else {
                                     paginationOptions.orders = null;
                                     paginationOptions.orderkey = null;
                                 }
                                 getPage(grid.options.paginationCurrentPage, grid.options.paginationPageSize, paginationOptions.orders,paginationOptions.orderkey)
                             }
                         });
                         gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                             if($scope.getPage) {
                               $scope.getPage(newPage, pageSize, paginationOptions.orders,paginationOptions.orderkey);
                             }
                         });
                     }
               };
          //
          $scope.edit=function(myrow){
            console.log("ui-grid 自定义列操作按钮....");
            console.log(myrow);//获取当前单击行的数据
          }
          $scope.getPage = getPage;
          //获取内部商户号数据
            $scope.getinternalData = function(){

              var url = tunnelmanagerService.getQueryInternalmercodeUrl();
              tunnelmanagerService.httpPost(url,$scope.getinternalDataForm,function(data){
                   console.log("内部商户号数据:");
                   console.log(data);
                   if(data.ret==0){
                    //将E转换成”启用“,D换成 停用
                    for(var i=0; i<data.data.rows.length; i++){
                      if(data.data.rows[i].internalmernamestatus=="E"){
                        data.data.rows[i].internalmernamestatus="启用";
                      }
                      else{
                        data.data.rows[i].internalmernamestatus="停用";
                      }
                    }

                    $scope.gridOptions.data = data.data.rows;  //将获取数据赋值给ui-grid
                    $scope.gridOptions.totalItems = data.data.total;
                  }else if(data.ret==10){
                      $.jBox.info("请先登录！", '温馨提示');
                  }else{
                      $.jBox.tip("获取内部商户号数据失败", 'warning');
                  }
              });
            }
        //调用内部商户号数据
        $scope.getinternalData();

        //启用
        $scope.setInterState_E=function(){
          var resulte = angular.copy($scope.gridApi.selection.getSelectedRows()); //获取行数据
          var url = tunnelmanagerService.getOperateInternalmercodeUrl();
          if(resulte.length<1){
             $.jBox.tip("请勾选要操作的数据！","warning");
             return;
          }
          else{
            //转换启用为E，停用为D
            for(var i=0; i<resulte.length; i++){
              resulte[i].internalmernamestatus="E";
            }
          }
          var temp = {internalmercodes:resulte};
          console.log("提交启用数据......");
          console.log(temp);
          var data = {data:JSON.stringify(temp)}
          tunnelmanagerService.httpPost(url,data,function(data){
            console.log(data);
            if(data.ret==0){
               $scope.getinternalData()
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
          var url = tunnelmanagerService.getOperateInternalmercodeUrl();
          if(resulte.length<1){
             $.jBox.tip("请勾选要操作的数据！","warning");
             return;
          }
          else{
            //转换启用为E，停用为D
            for(var i=0; i<resulte.length; i++){
              resulte[i].internalmernamestatus="D";
            }
          }
          var temp = {internalmercodes:resulte};
          console.log("提交停用数据......");
          console.log(temp);
          var data = {data:JSON.stringify(temp)}
          tunnelmanagerService.httpPost(url,data,function(data){
            console.log(data);
            if(data.ret==0){
               $scope.getinternalData()
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



