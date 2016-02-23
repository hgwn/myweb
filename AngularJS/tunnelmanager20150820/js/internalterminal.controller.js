/*======================================
 * 内部终端号管理控制器(内部商户号+内部终端号的界面)
 internalterminalController
 * =======================================
 * */
tunnelmanagerModule.controller("internalterminalController",
    ['$scope','$rootScope', '$http', '$state',  '$timeout', '$modal','$interval','uiGridGroupingConstants','i18nService','tunnelmanagerService',function ($scope,$rootScope, $http, $state, $timeout,$modal,$interval,uiGridGroupingConstants,i18nService,tunnelmanagerService) {
      //定义查询对象
      $scope.getinternalDataForm ={};
      $scope.getinternalDataForm.pagenum=1;
      $scope.getinternalDataForm.pagesize=10;
      $scope.getinternalDataForm.flag="0"; //0代表所有  1过滤已绑定  2未绑定

      //定义终端号状态
      $scope.internalterminalcodestatus=[
      {value:"D",name:"停用"},
      {value:"E",name:"启用"}
      ]


      //定义终端号是否绑定
      $scope.flag=[
      {value:"0",name:"所有"},
      {value:"1",name:"未绑定"},
      {value:"2",name:"已绑定"}
      ]
      //ui-grid 分页汉化
      i18nService.setCurrentLang('zh-cn');

      var getPage = function(pagenum, pagesize, orders,orderkey) {
          $scope.getinternalDataForm.pagenum = pagenum;
          $scope.getinternalDataForm.pagesize = pagesize;
          $scope.getinternalDataForm.orders = orders;
          $scope.getinternalDataForm.orderkey = orderkey;
          //调用查询内部终端号接口
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
                  enableSorting : true,
                  enableColumnMenus: false,
                  enableGridMenu: true,
                  columnDefs : [
                                {name:'序号',field:'id',type:'text',enableHiding: false, enableSorting: false, enableColumnResizing:false, width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
                                {name:'内部终端号',field:'internalterminalcode',width:'100',type:'text'},
                                {name:'内部商户号',field:'internalmercode',width:'140',type:'text'},
                                {name:'内部商户名称',field:'internalmernamename',type:'text'},
                                {name:'状态',field:'internalterminalcodestatus',width:'80',type:'text'},
                                {name:'修改时间',field:'updatedtime',width:'150',type:'text'}
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
                               $scope.getPage(newPage, pageSize,paginationOptions.orders,paginationOptions.orderkey);
                             }
                         });
                     }
               };

          $scope.getPage = getPage;
          //获取内部终端号数据
            $scope.getinternalData = function(){
              var url = tunnelmanagerService.getQueryinternalmernoUrl();
              tunnelmanagerService.httpPost(url,$scope.getinternalDataForm,function(data){
                   console.log("内部终端号数据:");
                   console.log(data);
                   if(data.ret==0){
                    //将E转换成”启用“,D换成 停用
                    for(var i=0; i<data.data.rows.length; i++){
                      if(data.data.rows[i].internalterminalcodestatus=="E"){
                        data.data.rows[i].internalterminalcodestatus="启用";
                      }
                      else{
                        data.data.rows[i].internalterminalcodestatus="停用";
                      }
                    }

                    $scope.gridOptions.data = data.data.rows;  //将获取数据赋值给ui-grid
                    $scope.gridOptions.totalItems = data.data.total;
                  }else if(data.ret==10){
                      $.jBox.info("请先登录！", '温馨提示');
                  }else{
                      $.jBox.tip("获取内部终端号数据失败", 'warning');
                  }
              });
            }
        //调用内部终端号数据
        $scope.getinternalData();

        //启用
        $scope.setInterState_E=function(){
          var resulte = angular.copy($scope.gridApi.selection.getSelectedRows()); //获取行数据
          var url = tunnelmanagerService.getOperateinternalmernoUrl();
          if(resulte.length<1){
             $.jBox.tip("请勾选要操作的数据！","warning");
             return;
          }
          else{
            //转换启用为E，停用为D
            for(var i=0; i<resulte.length; i++){
              resulte[i].internalterminalcodestatus="E";
            }
          }
          var temp = {internalmernos:resulte};
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
          var url = tunnelmanagerService.getOperateinternalmernoUrl();
          if(resulte.length<1){
             $.jBox.tip("请勾选要操作的数据！","warning");
             return;
          }
          else{
            //转换启用为E，停用为D
            for(var i=0; i<resulte.length; i++){
              resulte[i].internalterminalcodestatus="D";
            }
          }
          var temp = {internalmernos:resulte};
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



