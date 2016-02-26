orderinstallmentsApp.
controller('orderinstallmentsListController',['$state','$scope','$rootScope','$http','$alert','uiGridTreeViewConstants','i18nService','$timeout','orderinstallmentsService',
function($state,$scope,$rootScope,$http,$alert,uiGridTreeViewConstants,i18nService,$timeout,orderinstallmentsService){
	i18nService.setCurrentLang('zh-cn');
	$scope.formData = {};
	$scope.formData.state = 0;//默认选中全部
    $scope.formData.stateList = [{id:0 , value:'--全部--'},
                                 {id:1 , value:'待确认'},
                                 {id:2 , value:'还款中'},
                                 {id:3 , value:'已还清'},
                                 {id:4 , value:'已取消'}];
    $scope.formData.detailStateList = [{id:1 , value:'待付'},
                                       {id:2 , value:'已付'}];
	//分期状态转换
    $scope.convertStateName = function (flag) {
        var name = "";
        for (var i = 0; i < $scope.formData.stateList.length; i++) {
            if ($scope.formData.stateList[i].id == flag) {
                name = $scope.formData.stateList[i].value;
            }
        }
        return name;
    };
	//分期明细状态转换
    $scope.convertDetailStateName = function (flag) {
        var name = "";
        for (var i = 0; i < $scope.formData.detailStateList.length; i++) {
            if ($scope.formData.detailStateList[i].id == flag) {
                name = $scope.formData.detailStateList[i].value;
            }
        }
        return name;
    };
    //combox下拉列表start
	$scope.contacts = [];
	$scope.getContact = function(){
		orderinstallmentsService.getContact($scope.formData.contactkeyword ,function(data, flag){
            console.log(data);
            if(flag){//成功
                $scope.contacts = data.rows;
            }
            else{//失败

            }
        });
    };
    //combox下拉列表end
	//ui-grid of Tree View
	$scope.gridOption = {
		  expandableRowTemplate: 'template/expandableRowTemplate.html',
          paginationPageSizes: [5, 10, 20, 50, 100],
          paginationPageSize: 100,
          useExternalPagination: true,
          useExternalSorting: false,
          enableColumnMenus: false,
          enableGridMenu: true,
	      columnDefs: [
          { name: '序号', enableHiding: false, field:'id',type:'text',enableHiding: false,enableCellEdit: false , enableSorting: false, enableColumnResizing:false,  width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
		  { name: '操作', enableHiding: false, field:'action', width: '5%', enableFiltering: false,
		    cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">' +
		    '<a href="#" class="" ng-click="grid.appScope.orderinstallmentsView(row.entity)" title="查看"><span class="glyphicon glyphicon-eye-open blue"></span></a>&nbsp;'+
		    '</div>'}, 
		  { name: '申请分期公司名', width: '10%',field:'companyname'},
	      { name: '订单号', field:'ordernum'},
	      { name: '订单类型', field:'ordertypename'},
	      { name: '商品信息', field:'goodsname'},
	      { name: '分期数', field:'options'},
	      { name: '分期费率', field:'fee'},
	      { name: '首付款', field:'prepayamount'},
	      { name: '分期本金', field:'amount'},
	      { name: '分期服务费', field:'installmentsamount'},
	      { name: '应还金额', field:'totamount'},
	      { name: '状态 ', field:'stateName'}
	      ],
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
                gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                    if (row.isExpanded) {
                        row.entity.subGridOptions = {
                   		    useExternalPagination: true,
                            useExternalSorting: false,
                            enableSorting : false,
                      		enableColumnMenus: false,	 
                            columnDefs: [
                                { name: '第几期分期',field:'optionsindex'},
                                { name: '分期金额',field:'amount'},
                                { name: '状态',field:'stateName'},
                                { name: '预计还款时间',field:'repaytime'},
                                { name: '实际还款时间',field:'repaidtime'}
                            ]};
                        row.entity.subGridOptions.data = row.entity.orderinstallmentslist;
                    }
                });
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    if(getPage) {
                        getPage(newPage, pageSize);
                    }
                });
                $scope.gridApi.grid.refresh();
            }
	};
	//ui grid分页
    var getPage = function(pagenum, pagesize) {
    	$scope.formData.pagesize = pagesize;
    	$scope.formData.pagenum = pagenum;
    	//下拉列表
    	if($scope.formData.selectedAcontact != undefined && $scope.formData.selectedAcontact != ""){
    		$scope.formData.rcompanyid = $scope.formData.selectedAcontact.companyid;
    		$scope.formData.rstationid = $scope.formData.selectedAcontact.stationid;
    	};
        var data = { data: angular.toJson($scope.formData)};
        orderinstallmentsService.httpPost(orderinstallmentsService.getOrderinstallments(),data,function(data){
        	console.log(data);
        	if(data.ret == 0){
        		angular.forEach(data.data.rows,function(data,index){
        			data.stateName = $scope.convertStateName(data.state);
        			angular.forEach(data.orderinstallmentslist,function(value,key){
        				console.info(value.state);
        				value.stateName = $scope.convertDetailStateName(value.state);
        			});
        		});
        		$scope.gridOption.data = data.data.rows;
        		$scope.gridOption.totalItems = data.data.total;
        	}else if(data.ret == 10){
            	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
            }else{
        		$alert({title: '提示：', content: '查询分期记录异常,'+data.message, placement: 'masget-top',type: 'info', duration:2, show: true});
        	}
        });
    };
    $scope.getPage = getPage;
    $scope.getPage(1,$scope.gridOption.paginationPageSize);
    
    //弹窗修改界面
    $scope.installmentsconfigModify = function(entity){
    	$scope.modalTitle = '分期付配置修改';
    	$scope.modalSubmit = '确认修改';
	    $("#installmentsconfigDetail").modal("show");
	    $scope.formData = angular.copy(entity);
	    //弹窗修改操作
	    $scope.formData.action = "modify"; 
    };
    //跳转到查看状态
    $scope.orderinstallmentsView = function(entity) {

        $timeout(function(){
        	$state.go("orderinstallmentsView");
        	orderinstallmentsService.setData(entity);
        },30);
    };
}])
.controller('orderinstallmentsDetailController',['$state','$scope','$rootScope','$http','$alert','uiGridTreeViewConstants','i18nService','$timeout','orderinstallmentsService',
function($state,$scope,$rootScope,$http,$alert,uiGridTreeViewConstants,i18nService,$timeout,orderinstallmentsService){
	$scope.viewData = {};
	$scope.viewData = orderinstallmentsService.getData();
	$scope.returnToList = function() {
		$state.go("getOrderinstallments");
	};
	//分期账户信息 ui-grid of Tree View
	$scope.gridOptionInfo = {
        enableColumnMenus: false,
        enableGridMenu: true,
	    columnDefs: [
        { name: '序号', enableHiding: false, field:'id',type:'text',enableHiding: false,enableCellEdit: false , enableSorting: false, enableColumnResizing:false,  width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
		{ name: '开户名', width: '10%',field:'accountname'},
	    { name: '身份证', field:'identitycard'},
	    { name: '手机号', field:'mobilephone'},
	    { name: '客户编号', field:'usernumber'},
	    { name: '银行卡号', field:'bankaccount'},
	    { name: '银行编码', field:'bankcode'},
	    { name: '银行', field:'bank'},
	    { name: '备注', field:'remark'}
	]};
	$scope.gridOptionInfo.data = $scope.viewData.orderinstallmentsinfo;
	$scope.gridOptionInfo.totalItems = $scope.viewData.orderinstallmentsinfo.length;
	//分期明细信息 ui-grid of Tree View
	$scope.gridOptionDetail = {
        enableColumnMenus: false,
        enableGridMenu: true,
	    columnDefs: [
        { name: '序号', enableHiding: false, field:'id',type:'text',enableHiding: false,enableCellEdit: false , enableSorting: false, enableColumnResizing:false,  width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
		{ name: '第几期', width: '10%',field:'companyname'},
	    { name: '分期金额', field:'amount'},
	    { name: '状态', field:'stateName'},
	    { name: '实际还款时间', field:'repaidtime'},
	    { name: '预计还款时间', field:'repaytime'}
    ]};
	$scope.gridOptionDetail.data = $scope.viewData.orderinstallmentslist;
	$scope.gridOptionDetail.totalItems = $scope.viewData.orderinstallmentslist.length;
	//默认状态选项选择还款中
	$scope.auditState = 2;
    $scope.auditStateList = [{id:2 , value:'通过'},
                             {id:4 , value:'不通过'}];
	//弹窗审核窗口
	$scope.auditModal = function(){
		$("#auditModal").modal("show");
	};
	//确定审核
	$scope.audit = function(){
		var param = {};
		param.orderinstallmentsid = $scope.viewData.orderinstallmentsid;
		param.state = $scope.auditState;
        var data = { data: angular.toJson(param)};
        orderinstallmentsService.httpPost(orderinstallmentsService.auditOrderinstallments(),data,function(data){
        	console.log(data);
        	if(data.ret == 0){
        		$("#auditModal").modal("hide");
        		$alert({title: '提示：', content: '审核成功!', placement: 'masget-top',type: 'info', duration:1, show: true});
        		$timeout(function(){
        			$state.go("getOrderinstallments");	
        		},1000);
        	}else if(data.ret == 10){
            	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
            }else{
        		$alert({title: '提示：', content: '审核分期记录异常,'+data.message, placement: 'masget-top',type: 'info', duration:2, show: true});
        	}
        });
	};
}]);
