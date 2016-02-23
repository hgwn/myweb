/*======================================
 * 外部终端号管理控制器(外部商户号+外部终端号的界面+支付通道界面)
 externalterminalController
 * =======================================
 * */
tunnelmanagerModule.controller("externalterminalController",
    ['$scope','$rootScope', '$http', '$state',  '$timeout', '$modal','$interval','uiGridGroupingConstants','i18nService','tunnelmanagerService',function ($scope,$rootScope, $http, $state, $timeout,$modal,$interval,uiGridGroupingConstants,i18nService,tunnelmanagerService) {
      //定义查询外部终端号对象(模态框)
      $scope.getexternalDataForm ={};
      $scope.getexternalDataForm.pagenum=1;
      $scope.getexternalDataForm.pagesize=10;
      $scope.getexternalDataForm.flag="0";  //0代表所有  1表示过滤已绑定  2未绑定

      //定义外部终端号状态
      $scope.externalterminalcodestatus=[
      {value:"D",name:"停用"},
      {value:"E",name:"启用"}
      ]
      //定义外部终端号是否绑定
      $scope.flag=[
      {value:"0",name:"所有"},
      {value:"1",name:"未绑定"},
      {value:"2",name:"已绑定"}
      ]
      //ui-grid 分页汉化
      i18nService.setCurrentLang('zh-cn');

      var getPage = function(pagenum, pagesize, orders,orderkey) {
          $scope.getexternalDataForm.pagenum = pagenum;
          $scope.getexternalDataForm.pagesize = pagesize;
          $scope.getexternalDataForm.orders = orders;
          $scope.getexternalDataForm.orderkey = orderkey;
          //调用查询外部终端号接口
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
              enableSorting: true,
              useExternalPagination: true,
              useExternalSorting: true,
              //enableCellEditOnFocus : true,
              enableColumnMenus: false,
              enableGridMenu: true,
              columnDefs : [
                                {name:'序号',field:'id',type:'text',enableHiding: false,  enableCellEdit: false, width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>',enableSorting: false,enableColumnResizing:false},
                                {name:'外部终端号',field:'externalterminalcode',width:'100',type:'text',enableCellEdit:false},
                                {name:'外部商户号',field:'externalmercode',width:'140',type:'text',enableCellEdit:false},
                                {name:'外部商户名称',field:'externalmername',type:'text',enableCellEdit:false},
                                {name:'支付通道代码',field:'paymentchannelcode',width:'120',type:'text',enableSorting: false},
                                {name:'支付通道名称',field:'paymentchannelname',width:'140',type:'text',enableSorting:false},
                                {name:'通道优先级',field:'priority',width:'100',type:'text',headerTooltip: '优先级的值越大优先级越高'},
                                {name:'状态',field:'externalterminalcodestatus',width:'80',type:'text'},
                                {name:'修改时间',field:'updatedtime',width:'150',type:'text'}
                               ],
                     onRegisterApi: function(gridApi) {
                         $scope.gridApi = gridApi;
                         $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                             if(getPage) {
                                 if (sortColumns.length > 0) {
                                     paginationOptions.orderkey = sortColumns[0].sort.direction;//排序方向
                                     //var orders = sortColumns[0].colDef;//获取列标题信息
                                     paginationOptions.orders = sortColumns[0].colDef.field;//获取列标题字段名
                                     console.log(paginationOptions.orders+":"+paginationOptions.orderkey);
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
          //获取外部终端号数据
            $scope.getexternalData = function(){

              var url = tunnelmanagerService.getQueryexternalmernoUrl();
              tunnelmanagerService.httpPost(url,$scope.getexternalDataForm,function(data){
                   console.log("外部终端号数据:");
                   console.log(data);
                   if(data.ret==0){
                    for(var i=0; i<data.data.rows.length; i++){
                      if(data.data.rows[i].externalterminalcodestatus=="E"){
                        data.data.rows[i].externalterminalcodestatus="启用";
                      }
                      else{
                        data.data.rows[i].externalterminalcodestatus="停用";
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
        //调用获取外部终端号数据
        $scope.getexternalData();
        //启用
        $scope.setInterState_E=function(){
          var resulte = angular.copy($scope.gridApi.selection.getSelectedRows()); //获取行数据
          var url = tunnelmanagerService.getOperateexternalmernoUrl();
          if(resulte.length<1){
             $.jBox.tip("请勾选要操作的数据！","warning");
             return;
          }
          else{
            //转换启用为E，停用为D
            for(var i=0; i<resulte.length; i++){
              resulte[i].externalterminalcodestatus="E";
            }
          }
          var temp = {externalmernos:resulte};
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
          var url = tunnelmanagerService.getOperateexternalmernoUrl();
          if(resulte.length<1){
             $.jBox.tip("请勾选要操作的数据！","warning");
             return;
          }
          else{
            //转换启用为E，停用为D
            for(var i=0; i<resulte.length; i++){
              resulte[i].externalterminalcodestatus="D";
            }
          }
          var temp = {externalmernos:resulte};
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



