/*======================================
 * 一对一绑定选项卡控制器 oneToOneTabController
 * =======================================
 * */
tunnelmanagerModule.controller("oneToOneTabController",
      ['$scope', '$http', '$state',  '$timeout','$modal','i18nService','tunnelmanagerService', function ($scope, $http, $state, $timeout,$modal,i18nService,tunnelmanagerService) {
      //ui-grid 分页汉化
      i18nService.setCurrentLang('zh-cn');
      //定义内部终端表单查询对象
      $scope.internal_queryDataForm = {};
      $scope.internal_queryDataForm.pagenum =1;
      $scope.internal_queryDataForm.pagesize=20;
      $scope.internal_queryDataForm.flag="1";   //0代表所有  1过滤已绑定

      //定义外部终端表单查询对象
      $scope.external_queryDataForm = {};
      $scope.external_queryDataForm.pagenum = 1;
      $scope.external_queryDataForm.pagesize = 20;
      $scope.external_queryDataForm.flag="1"; //0代表所有  1过滤已绑定


      //内部终端号查询
        $scope.internalQueryForm = function(){
          var url = tunnelmanagerService.getQueryinternalmernoUrl();
          tunnelmanagerService.httpPost(url,$scope.internal_queryDataForm,function(data){
            console.log(data);
            if(data.ret==0){
              $scope.internalData=data;
            }
            if(data.ret==10){
              $.jBox.info("请先登录！","温馨提示");
            }
          });
        }

        //获取内部终端号数据
        $scope.getInternalData = function(){
          var url= tunnelmanagerService.getQueryinternalmernoUrl()+"?pagenum=1&pagesize=20&flag="+"1";
          tunnelmanagerService.httpGet(url,function(data){
            if(data.ret==0){
              $scope.internalData=data;
            }
            if(data.ret==10){
              $.jBox.info("请先登录！","温馨提示");
            }
          });
        }

        //获取外部终端号数据
        $scope.getExternalData = function(){
          var url = tunnelmanagerService.getQueryexternalmernoUrl()+"?pagenum=1&pagesize=20&flag="+"1";
          tunnelmanagerService.httpGet(url,function(data){
            if(data.ret==0){
              $scope.externalData=data;
            }
            if(data.ret==10){
              $.jBox.info("请先登录！","温馨提示");
            }
          });
        }

        //外部终端号查询
        $scope.externalQueryForm = function(){
          var url = tunnelmanagerService.getQueryexternalmernoUrl();
          tunnelmanagerService.httpPost(url,$scope.external_queryDataForm,function(data){
            console.log(data);
            if(data.ret==0){
              $scope.externalData=data;
            }
            if(data.ret==10){
              $.jBox.info("请先登录！","温馨提示");
            }
          });
        }

      
}]);
/*======================================
 * 内部终端号控制器 tabInternalController
 * =======================================
 * */
tunnelmanagerModule.controller("tabInternalController",
    ['$scope','$rootScope', '$http', '$state',  '$timeout', '$modal','$interval','uiGridGroupingConstants','tunnelmanagerService','i18nService',function ($scope,$rootScope, $http, $state, $timeout,$modal,$interval,uiGridGroupingConstants,tunnelmanagerService,i18nService) {

      //首次加载内部终端号数据
      $scope.getInternalData();

      //定义模态框--外部终端号查询数据对象
      $scope.external_queryViewmodal={};
      $scope.external_queryViewmodal.pagenum=1;
      $scope.external_queryViewmodal.pagesize=20;
      $scope.external_queryViewmodal.flag="1"; //0代表所有  1过滤已绑定

      //模态框--外部终端号查询
        $scope.external_queryViewForm = function(){
          var url = tunnelmanagerService.getQueryexternalmernoUrl();
          tunnelmanagerService.httpPost(url,$scope.external_queryViewmodal,function(data){
            console.log("....模态框--外部终端号查询...")
            console.log(data);
            if(data.ret==0){
              $scope.gridOptions_inview.data = data.data.rows;  //赋值给外部模块
            }
            if(data.ret==10){
              $.jBox.info("请先登录！","温馨提示");
            }
          });
        }

     //模态框
      $scope.internalAudit = function(item){
        $('#internal_viewModal').modal('show');
        //清空条件查询外部终端号及商户名称值
        $scope.external_queryViewmodal.externalterminalcode='';
        $scope.external_queryViewmodal.externalmername='';
        $scope.internalViewmodal = angular.copy(item);
        //获取外部终端号数据
         var url = tunnelmanagerService.getQueryexternalmernoUrl()+"?pagenum=1&pagesize=20&flag="+"1";
          tunnelmanagerService.httpGet(url,function(data){
           console.log(data);
            if(data.ret==0){
              $scope.gridOptions_inview.data = data.data.rows;  //赋值给外部模块
            }
            if(data.ret==10){
              $.jBox.info("请先登录！","温馨提示");
            }
        });
      }
      //模态框--外部终端号  ui-grid 分页
      var getPage = function(pagenum, pagesize, sort) {
          $scope.external_queryViewmodal.pagenum = pagenum;
          $scope.external_queryViewmodal.pagesize = pagesize;
          //调用查询外部终端号接口
          $scope.external_queryViewForm();
          };

      var paginationOptions = {sort: null};


     //ui-grid 外部ui-gird
          $scope.gridOptions_inview = {
                  paginationPageSizes: [10, 20, 50, 100],
                  paginationPageSize: 20,
                  enableCellEditOnFocus : true,
                  enableColumnMenus: false,
                  enableSorting: false,
                  columnDefs : [
                                  { name: '序号',field: 'id',type: 'text',  enableCellEdit: false, width: '60', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
                                  { name: '外部终端号',field:'externalterminalcode',width:'100',type:'text'},
                                  { name: '外部商户号',field:'externalmercode',width:'140',type:'text'},
                                  { name: '外部商户名称',field:'externalmername',type:'text'},
                                  { name: '支付通道代码',field:'paymentchannelcode',width:'120',type:'text'},
                                  { name: '支付通道名称',field:'paymentchannelname',width:'140',type:'text'}
                                 ],
                  onRegisterApi: function(gridApi) {
                         $scope.gridApi = gridApi;
                         $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
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

          
          //onClickToSave_internal 提交绑定数据
         $scope.onClickToSave_internal = function(){
          var internalterminalcodeid = $scope.internalViewmodal.internalterminalcodeid;   //内部终端号id
          var internalterminalcode = $scope.internalViewmodal.internalterminalcode;   //内部终端号
          var internalmercode = $scope.internalViewmodal.internalmercode;   //内部商户号
           console.log(".....内部终端号id...."+internalterminalcodeid);
           var url = tunnelmanagerService.getInterterminal1to1exterterminalUrl();
           var result = $scope.gridApi.selection.getSelectedRows();
           if(result.length<1){
            $.jBox.tip("请勾选要绑定的数据！","warning");
            return;
           }
           if(result.length>1){
            $.jBox.tip("只能勾选一条数据！","warning");
            return;
           }
           var temp ={};
           temp.flag="0"; //flag 0代表增加 1代表删除
           //添加内部终端号id给json对象
           for(var i=0; i<result.length;i++){
             result[i].internalterminalcodeid =internalterminalcodeid;
             result[i].internalterminalcode =internalterminalcode;
             result[i].internalmercode =internalmercode;
           }
           temp.terminalids=result;
           var data ={data:JSON.stringify(temp)};
           console.log(temp);
           tunnelmanagerService.httpPost(url,data,function(data){
            console.log(data);
              if(data.ret==0){
                $.jBox.tip("绑定成功！","success");
                $('#internal_viewModal').modal('hide');
                $scope.internalQueryForm();
                $scope.externalQueryForm();
              }
              else{
                $.jBox.tip("绑定失败！","warning");
              }
           });
         }
}]);


/*======================================
 * 外部终端号控制器 tabExternalController
 * =======================================
 * */
tunnelmanagerModule.controller("tabExternalController",
    ['$scope','$rootScope', '$http', '$state',  '$timeout', '$modal','$interval','uiGridGroupingConstants','tunnelmanagerService','i18nService',function ($scope,$rootScope, $http, $state, $timeout,$modal,$interval,uiGridGroupingConstants,tunnelmanagerService,i18nService) {

     //加载外部终端号数据源汇总
      $scope.getExternalData();

      //定义模态框--内部终端号查询数据对象
      $scope.internal_queryViewmodal={};
      $scope.internal_queryViewmodal.pagenum=1;
      $scope.internal_queryViewmodal.pagesize=20;
      $scope.internal_queryViewmodal.flag="1"; //0代表所有  1过滤已绑定
      //模态框--内部终端号条件查询函数
      $scope.internal_queryViewForm=function(){
         var url = tunnelmanagerService.getQueryinternalmernoUrl();
          tunnelmanagerService.httpPost(url,$scope.internal_queryViewmodal,function(data){
            console.warn(data);
            if(data.ret==0){
              $scope.gridOptions.data = data.data.rows;  //赋值给ui-grid
            }
            if(data.ret==10){
              $.jBox.info("请先登录！","温馨提示");
            }
          });
      }

      //模态框
      $scope.externalAudit = function(item){
        $('#external_viewModal').modal('show');
        //清空条件查询内部终端号及商户名称的值
        $scope.internal_queryViewmodal.internalterminalcode='';
        $scope.internal_queryViewmodal.internalmernamename='';
        $scope.externalViewmodal = angular.copy(item);
        //获取内部终端号数据
        var url= tunnelmanagerService.getQueryinternalmernoUrl()+"?pagenum=1&pagesize=20&flag="+"1";
        tunnelmanagerService.httpGet(url,function(data){
          console.log(data);
            if(data.ret==0){
              $scope.gridOptions.data = data.data.rows;  //赋值给ui-grid
            }
            if(data.ret==10){
              $.jBox.info("请先登录！","温馨提示");
            }
        });
      }

      //模态框--内部终端号  ui-grid 分页
      var getPage = function(pagenum, pagesize, sort) {
          $scope.internal_queryViewmodal.pagenum = pagenum;
          $scope.internal_queryViewmodal.pagesize = pagesize;
          //调用查询内部终端号接口
          $scope.internal_queryViewForm();
          };

      var paginationOptions = {sort: null};

      //ui-grid
      $scope.gridOptions = {
              paginationPageSizes: [10, 20, 50, 100],
              paginationPageSize: 20,
              enableCellEditOnFocus : true,
              enableColumnMenus: false,
              enableSorting: false,
              columnDefs : [
                              { name: '序号',field: 'id',type: 'text',  enableCellEdit: false, width: '60', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
                              { name: '内部终端号',field:'internalterminalcode',width:'150',type:'text'},
                              { name: '内部商户号',field:'internalmercode',width:'150',type:'text'},
                              { name: '内部商户名称',field:'internalmernamename',type:'text'}
                             ],
              onRegisterApi: function(gridApi) {
                         $scope.gridApi = gridApi;
                         $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
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


      //onClickToSave_internal
     $scope.onClickToSave_external = function(){
          var externalterminalcodeid = $scope.externalViewmodal.externalterminalcodeid;   //内部终端号id
          var externalterminalcode = $scope.externalViewmodal.externalterminalcode;   //内部终端号
          var externalmercode = $scope.externalViewmodal.externalmercode;   //内部商户号
           var url = tunnelmanagerService.getInterterminal1to1exterterminalUrl();
           var result = $scope.gridApi.selection.getSelectedRows();
           if(result.length<1){
            $.jBox.tip("请勾选要绑定的数据！","warning");
            return;
           }
           if(result.length>1){
            $.jBox.tip("只能勾选一条数据！","warning");
            return;
           }
           var temp ={};
           temp.flag="0"; //flag 0代表增加 1代表删除
           //添加内部终端号id给json对象
           for(var i=0; i<result.length;i++){
             result[i].externalterminalcode =externalterminalcode;
             result[i].externalterminalcodeid =externalterminalcodeid;
             result[i].externalmercode =externalmercode;
           }
           temp.terminalids=result;
           var data ={data:JSON.stringify(temp)};
           console.log(temp);
           tunnelmanagerService.httpPost(url,data,function(data){
            console.log(data);
              if(data.ret==0){
                $.jBox.tip("绑定成功！","success");
                $('#external_viewModal').modal('hide');
                $scope.internalQueryForm();
                $scope.externalQueryForm();
              }
              else{
                $.jBox.tip("绑定失败！","warning");
              }
           });
     }


}]);




