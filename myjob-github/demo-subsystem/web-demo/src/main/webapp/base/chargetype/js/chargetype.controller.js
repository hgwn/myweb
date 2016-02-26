angular.module('masgetWebApp.chargetype')
.controller('chargetypeCtr',['$scope', '$stateParams', '$state', 'utils','$alert','$http','$timeout','$modal','session','chargeType','i18nService',
    function ($scope, $stateParams, $state, utils,$alert,$http,$timeout,$modal,session,chargeType,i18nService) {
		$scope.chargeType = chargeType;
		//ui-grid 分页汉化
		i18nService.setCurrentLang('zh-cn');
		//查询
		$scope.charge = {
			pageSize:15,
			pageNum:1
		};
		$scope.check = function(){
	    	 var obj = {}
	    	 obj.pagesize = $scope.charge.pageSize;
	    	 obj.pagenum = $scope.charge.pageNum;
	    	 if($scope.charge.basechargetypeid!=null){
	    		 obj.basechargetypeid = $scope.charge.basechargetypeid;
	    	 }
	         var staData = {};
	         staData.data = JSON.stringify(obj);
	         $http({
	             method : 'POST',
	             url : "/jsbweb/chargeType/getlist.do",
	             data:$.param(staData),
	             headers : {
	                 'Content-Type' : 'application/x-www-form-urlencoded'
	             }
	         }).success(function(resp) {
	        	 if(resp.ret == 0){
					 $scope.gridOptions.data = resp.data.rows;
					 $scope.gridOptions.totalItems = resp.data.total;
	        	 }
	         })
	     }

		$scope.gridOptions = {
			//显示table的th
			columnDefs: [
				{ name: '序号',field:'id', width:60,cellTemplate:
					'<div class="ui-grid-cell-contents" style="text-align:center">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
				},
				{ name: '基础费用类型',field:'chargetypename' },
				{ name: '费用方向',field:'chargedirection',cellTemplate:
					'<div class="ui-grid-cell-contents">{{grid.appScope.chargedirectionToName(row.entity.chargedirection)}}</div>'
				},
				{ name: '备注',field:'remark'},
				{name:'操作', field:'',
					cellTemplate: '<div class="ui-grid-cell-contents">' +
					'<a href="#" ng-click="grid.appScope.edit(row.entity)"><span class="glyphicon glyphicon-pencil blue"></span>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
					'<a href="#" ng-click="grid.appScope.deleteChargetype(row.entity)"><span class="glyphicon glyphicon-trash blue"></span>删除</a>' +
					'</div>'
				}
			],
			paginationPageSizes: [5, 10, 15,20,25,50,100],
			paginationPageSize: 15,
			useExternalPagination: true,
			enableGridMenu: true,
			enableColumnMenus: false,
			onRegisterApi: function(gridApi){
				$scope.gridApi = gridApi;
				$scope.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
					if($scope.getPage) {
						$scope.getPage(newPage, pageSize);
					}
				});
			}
		};

		$scope.chargedirectionToName = function(orderstate){
			switch (orderstate){
				case 1:
					return "支出";
				case 2:
					return "收入";
				default :
					return "";
			}
		};

		$scope.getPage = function(pagenum, pagesize, orders,orderkey) {
			$scope.charge.pageNum = pagenum
			$scope.charge.pageSize = pagesize;
			$scope.check();
		};
		
	     $scope.getnotuse = function(){
	    	 if($scope.type == 'add'){
	    		 var path = '/jsbweb/chargeType/getnotuse.do';
	    	 }else{
	    		 var path = '/jsbweb/chargeType/getbase.do';
	    	 }
	         utils.query(path).then(function (resp) {
	             $scope.notuse = resp.data.rows;
	         });
	     }
	     
	     var addmodal = null;
	     $scope.add = function(){
	    	 $scope.type = "add";
	    	 $scope.getnotuse();
	    	 $scope.button = false;
	    	 $scope.chargetype={
	    			 companyname:session.companyname,
	    			 chargedirection:1,
	    			 remark:''
	    	 };
	    	 $scope.disabled = false;
	    	 addmodal = $modal({html:true,scope:$scope,title:"新增费用类型",template:'html/chargetype.modal.tpl.html',contentTemplate:'html/chargetype.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){}
	    	 });
	     }
	     
	     $scope.addChargetype = function(){
	    	 $scope.button = true;
	    	 addmodal.$scope.form_chargetype.submitted = false;
             if(addmodal.$scope.form_chargetype.$valid){
                    var objAdd = {};
                    objAdd.basechargetypeid=$scope.chargetype.basechargetypeid;
                    objAdd.chargetypename=$scope.chargetype.chargetypename;
                	 objAdd.chargedirection=$scope.chargetype.chargedirection;
                    if($scope.chargetype.remark!=null&&$scope.chargetype.remark!=undefined&&$scope.chargetype.remark!=""){
                    	objAdd.remark=$scope.chargetype.remark;
                    }
                       
                   var data = {};
                   data.data = JSON.stringify(objAdd);
                   console.info(data);
                   $http({
                       method : 'POST',
                       url : "/jsbweb/chargeType/add.do",
                       data:$.param(data),
                       headers : {
                           'Content-Type' : 'application/x-www-form-urlencoded'
                       }
                   }).success(function(resp) {
                       if(resp.ret==0){
                           $alert({title: '提示：', content: '新增成功', placement: 'masget-top',duration:2, type: 'info', show: true});
                           $scope.check();
						   angular.forEach($scope.notuse,function(val,idx){
							   if(val.basechargetypeid == $scope.chargetype.basechargetypeid){
								   $scope.notuse.splice(idx,1);
							   }
						   })
						   $scope.button = false;
                       }else{
                           $alert({title: '提示：', content: '新增失败', placement: 'masget-top',duration:2, type: 'info', show: true});
                       }
                   });
               }else{
            	   $scope.button = false;
            	   addmodal.$scope.form_chargetype.submitted = true;
                   $alert({title: '提示：', content: '请检查输入项', placement: 'masget-top',duration:2, type: 'info', show: true});
               }
  		 
  	 	
	     }
	     
	   	    
	   	  var modal = null;
	   	 	
		
	     $scope.edit = function(item){
	    	 $scope.type = "edit";
	    	 $scope.getnotuse();
	    	 $scope.chargetype = $.extend({},item);
	    	 $scope.chargetype.companyname = session.companyname;
	    	 $scope.button = false;
	    	 $scope.disabled = true;
	    	 modal = $modal({html:true,scope:$scope,title:"费用类型信息",template:'html/chargetype.modal.tpl.html',contentTemplate:'html/chargetype.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){
	    	 	 }
	    	 });
	     }
	     
	     $scope.editChargetype = function(){
	    	 $scope.button = true;
	    	 modal.$scope.form_chargetype.submitted = false;
             if(modal.$scope.form_chargetype.$valid){
                 var objAdd = {};
				 objAdd.basechargetypeid = $scope.chargetype.basechargetypeid;
                 objAdd.chargetypeid=$scope.chargetype.chargetypeid;
             	 objAdd.chargedirection=$scope.chargetype.chargedirection;
                 if($scope.chargetype.remark!=null&&$scope.chargetype.remark!=undefined&&$scope.chargetype.remark!=""){
                 	objAdd.remark=$scope.chargetype.remark;
                 }
                 
                 var data = {};
                 data.data = JSON.stringify(objAdd);
                 console.info(data);
                 $http({
                     method : 'POST',
                     url : "/jsbweb/chargeType/modify.do",
                     data:$.param(data),
                     headers : {
                         'Content-Type' : 'application/x-www-form-urlencoded'
                     }
                 }).success(function(resp) {
                     if(resp.ret==0){
                         $alert({title: '提示：', content: '修改成功', placement: 'masget-top',duration:2,type: 'info', show: true});
                         modal.$scope.$hide();
                         $scope.check();
                     }else{
                         $alert({title: '提示：', content: "订单费用类型名称正在使用，不允许修改...", placement: 'masget-top',duration:2,type: 'info', show: true});
						 modal.$scope.$hide();
                     }
                 });
                 
             }else{
            	 $scope.button = false;
            	 modal.$scope.form_chargetype.submitted = true;
                 $alert({title: '提示：', content: '请检查输入项', placement: 'masget-top',duration:1,type: 'info', show: true});
             }
	     }
	     
	     $scope.deleteChargetype = function(item){
	    	 $modal({title: "提示", content: "确认要删除费用类型为"+item.chargetypename+"?",template:'modal/modal.confirm.tpl.html',animation:'am-fade-and-scale',callback: function(){
				 var objAdd = {};
				 objAdd.chargetypeid=item.chargetypeid;
				 objAdd.basechargetypeid=item.basechargetypeid;
				 var data = {};
				 data.data = JSON.stringify(objAdd);
	    		 $http({
    				 method : 'POST',
    				 url : "/jsbweb/chargeType/delete.do",
    				 data:$.param(data),
    				 headers : {
    					 'Content-Type' : 'application/x-www-form-urlencoded'
    				 }
    			 }).success(function(resp) {
    				 if(resp.ret==0){
    					 $alert({title: '提示：', content: '删除成功', placement: 'masget-top',duration:2,type: 'info', show: true});
    					 $scope.check();
    				 }else{
    					 $alert({title: '提示：', content: "订单费用类型名称正在使用，不允许删除...", placement: 'masget-top',duration:2,type: 'info', show: true});
    				 }
    			 })
	    	 	 }
	    	 });
	     }
	     $scope.check();
		 
}])