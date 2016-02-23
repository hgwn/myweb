/*======================================
 * 一对一绑定控制器 oneToOneController
 * =======================================
 * */
tunnelmanagerModule.controller("oneToOneController",
    ['$scope','$rootScope', '$http', '$state',  '$timeout', '$modal','$interval','uiGridGroupingConstants','tunnelmanagerService','i18nService',function ($scope,$rootScope, $http, $state, $timeout,$modal,$interval,uiGridGroupingConstants,tunnelmanagerService,i18nService) {
      //定义表单查询对象
      $scope.getOneToOneDataForm={pagenum:1,pagesize:10};
      //ui-grid 分页汉化
      i18nService.setCurrentLang('zh-cn');
       var getPage = function(pagenum, pagesize, orders,orderkey) {
          $scope.getOneToOneDataForm.pagenum = pagenum;
          $scope.getOneToOneDataForm.pagesize = pagesize;
          $scope.getOneToOneDataForm.orders = orders;
          $scope.getOneToOneDataForm.orderkey = orderkey;
         //调用获取一对一绑定数据
         $scope.getOneToOneData();
          };

      var paginationOptions = {
              orders: null,
              orderkey: null
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
                                { name:'序号',field:'id',type:'text',  enableSorting: false, enableColumnResizing:false,enableHiding: false,  width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
                                { name: '内部商户号',field:'internalmercode',width:'150',type:'text'},
                                { name: '内部商户名称',field:'internalmernamename',width:'150',type:'text'},
                                { name: '内部终端号',field:'internalterminalcode',width:'150',type:'text'},
                                {name:'外部商户号',field:'externalmercode',width:'150',type:'text'},
                                {name:'外部商户名称',field:'externalmername',width:'150',type:'text'},
                                {name:'外部终端号',field:'externalterminalcode',width:'150',type:'text'},
                                {name:'支付通道代码',field:'paymentchannelcode',width:'150',type:'text'},
                                {name:'支付通道名称',field:'paymentchannelname',width:'150',type:'text'},
                                {name:'创建时间',field:'createdtime',width:'150',type:'text'},
                                {name:'创建人',field:'createdby',width:'150',type:'text'},
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

          $scope.getPage = getPage;

      //定义提交删除表单对象
      $scope.delOneToOneDataForm ={};
      $scope.delOneToOneDataForm.flag ="1";  //0代表增加 1代表删除
      $scope.delOneToOneDataForm.terminalids=[];

      //获取一对一绑定数据
      $scope.getOneToOneData = function(){
        var url = tunnelmanagerService.getQueryInterterminal1to1exterterminalUrl();
        tunnelmanagerService.httpPost(url,$scope.getOneToOneDataForm,function(data){
          console.log("获取一对一绑定数据..");
          if(data.ret==10){
            $.jBox.info("请先登录！","温馨提示");
            return;
          }
          //$scope.oneToOneData = data;
           $scope.gridOptions.data = data.data.rows;  //将获取数据赋值给 ui-grid
           $scope.gridOptions.totalItems = data.data.total;

          console.log(data);
        });
      }
      //调用获取一对一绑定数据
      $scope.getOneToOneData();
      //goToOneToOneAdd
      $scope.goToOneToOneAdd=function(){
        $state.go("oneToOneAdd");
      }
      $scope.goToOneToOneTab=function(){
        $state.go("oneToOneTab.Page1");
      }
      //解除绑定一对一
      $scope.oneToOne_del=function(item){
        var resulte = angular.copy($scope.gridApi.selection.getSelectedRows()); //获取行数据
        if(resulte.length<1){
          $.jBox.tip("请勾选要操作的数据！","warn");
          return;
        }
        /*var externalterminalcodeid = item.externalterminalcodeid;
        var internalterminalcodeid = item.internalterminalcodeid;
        var temp = {};
        $scope.delOneToOneDataForm.terminalids.push(item);*/
        $scope.delOneToOneDataForm.terminalids = resulte;
        var data ={data:JSON.stringify($scope.delOneToOneDataForm)};
        console.warn($scope.delOneToOneDataForm);
        var submit = function(v,h,f){
            if(v=="ok"){
              $.jBox.tip("正在删除数据...", 'loading');
              var url = tunnelmanagerService.getInterterminal1to1exterterminalUrl();
              tunnelmanagerService.httpPost(url,data,function(data){
                console.log(data);
                if(data.ret==0){
                  $scope.getOneToOneData();
                  $.jBox.tip("删除成功！","success");
                  //取消全选
                  $scope.gridApi.selection.clearSelectedRows();

                }
                if(data.ret==10){
                  $.jBox.info("请先登录！", '温馨提示');
                }
              });
            }
            return true; //close
        };
        //$.jBox.confirm("内部商户号："+item.internalmercode+"<br/>"+"确定要删除吗？", "温馨提示",submit);
        $.jBox.confirm("已勾选："+resulte.length+"条数据<br/>"+"确定要删除吗？", "温馨提示",submit);
      };
}]);


