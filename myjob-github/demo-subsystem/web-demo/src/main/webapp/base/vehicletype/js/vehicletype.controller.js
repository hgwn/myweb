angular.module('masgetWebApp.vehicletype')
.controller('vehicletypeCtr',['$scope', '$stateParams', '$state', 'utils','$alert','$http','$timeout','$modal','i18nService',
    function ($scope, $stateParams, $state, utils,$alert,$http,$timeout,$modal,i18nService) {
		$scope.vehicle = {
				licensenumber:"",
				vehicletypename:""
		}
		//ui-grid 分页汉化
		i18nService.setCurrentLang('zh-cn');
		//查询
		$scope.vehicle.pageSize = 15;
		$scope.vehicle.pageNum = 1;
	     $scope.check = function(){
	    	 var obj = {}
	    	 obj.pagesize = $scope.vehicle.pageSize;
	    	 obj.pagenum = $scope.vehicle.pageNum;
	    	 if($scope.vehicle.vehicletypename!=null){
	    		 obj.vehicletypename = $scope.vehicle.vehicletypename;
	    	 }
	         var staData = {};
	         staData.data = JSON.stringify(obj);
	         $http({
	             method : 'POST',
	             url : "/jsbweb/vehicleType/gettype.do",
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
				{ name: '车辆类型',field:'vehicletypename' },
				{ name: '载重数量',field:'loadcapacity'},
				{ name: '最大载重',field:'maxloadcapacity'},
				{ name: '车辆长度',field:'vehiclelength' },
				{ name: '车辆宽度',field:'vehiclewidth'},
				{ name: '车辆高度',field:'vehiclehigth'},
				{name:'操作', field:'', width:140,
					cellTemplate: '<div class="ui-grid-cell-contents">' +
					'<a href="#" ng-click="grid.appScope.edit(row.entity)"><span class="glyphicon glyphicon-pencil blue"></span>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
					'<a href="#" ng-click="grid.appScope.deleteVehicletype(row.entity)"><span class="glyphicon glyphicon-trash blue"></span>删除</a>' +
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

		$scope.getPage = function(pagenum, pagesize, orders,orderkey) {
			$scope.vehicle.pageNum = pagenum
			$scope.vehicle.pageSize = pagesize;
			$scope.check();
		};
	     
	     var addmodal = null;
	     $scope.add = function(){
	    	 $scope.button = false;
	    	 $scope.vehicletype={
	    			 vehicletypename:'',
	    			 loadcapacity:'',
	    			 maxloadcapacity:'',
	    			 vehiclelength:'',
	    			 vehiclewidth:'',
	    			 vehiclehigth:''
	    	 };
	    	 $scope.type = "add";
	    	 addmodal = $modal({html:true,scope:$scope,title:"新增车辆类型",template:'html/vehicletype.modal.tpl.html',contentTemplate:'html/vehicletype.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){}
	    	 });
	     }
	     
	     $scope.addVehicle = function(){
	    	 $scope.button = true;
	    	 addmodal.$scope.form_vehicletype.submitted = false;
             if(addmodal.$scope.form_vehicletype.$valid){
                    var objAdd = {};
                    objAdd.vehicletypename=$scope.vehicletype.vehicletypename;
                    if($scope.vehicletype.loadcapacity!=null&&$scope.vehicletype.loadcapacity!=undefined&&$scope.vehicletype.loadcapacity!=""){
                    	objAdd.loadcapacity=$scope.vehicletype.loadcapacity;
                    }
                    if($scope.vehicletype.maxloadcapacity!=null&&$scope.vehicletype.maxloadcapacity!=undefined&&$scope.vehicletype.maxloadcapacity!=""){
                    	objAdd.maxloadcapacity=$scope.vehicletype.maxloadcapacity;
                    }
                    if($scope.vehicletype.vehiclelength!=null&&$scope.vehicletype.vehiclelength!=undefined&&$scope.vehicletype.vehiclelength!=""){
                    	 objAdd.vehiclelength=$scope.vehicletype.vehiclelength;
                    }
                    if($scope.vehicletype.vehiclewidth!=null&&$scope.vehicletype.vehiclewidth!=undefined&&$scope.vehicletype.vehiclewidth!=""){
                    	objAdd.vehiclewidth=$scope.vehicletype.vehiclewidth;
                    }
                    if($scope.vehicletype.vehiclehigth!=null&&$scope.vehicletype.vehiclehigth!=undefined&&$scope.vehicletype.vehiclehigth!=""){
                    	objAdd.vehiclehigth=$scope.vehicletype.vehiclehigth;
                    }
                       
                   var data = {};
                   data.data = JSON.stringify(objAdd);
                   console.info(data);
                   $http({
                       method : 'POST',
                       url : "/jsbweb/vehicleType/add.do",
                       data:$.param(data),
                       headers : {
                           'Content-Type' : 'application/x-www-form-urlencoded'
                       }
                   }).success(function(resp) {
                       if(resp.ret==0){
                           $alert({title: '提示：', content: '新增成功', placement: 'masget-top',duration:2, type: 'info', show: true});
                           $scope.check();
                           addmodal.$scope.$hide();
                       }else{
                           $alert({title: '提示：', content: '新增失败', placement: 'masget-top',duration:2, type: 'info', show: true});
                       }
                   });
               }else{
            	   $scope.button = false;
            	   addmodal.$scope.form_vehicletype.submitted = true;
                   $alert({title: '提示：', content: '请检查输入项', placement: 'masget-top',duration:2, type: 'info', show: true});
               }
  		 
  	 	
	     }
	     
	   	    
	   	  var modal = null;
	   	 	
		
	     $scope.edit = function(item){
	    	 $scope.typeShow = "edit";
	    	 $scope.vehicletype = angular.copy(item);
	    	 $scope.button = false;
	    	 $scope.type = "edit";
	    	 modal = $modal({html:true,scope:$scope,title:"车辆类型信息",template:'html/vehicletype.modal.tpl.html',contentTemplate:'html/vehicletype.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){
	    	 	 }
	    	 });
	     }
	     
	     $scope.editVehicle = function(){
	    	 $scope.button = true;
	    	 modal.$scope.form_vehicletype.submitted = false;
             if(modal.$scope.form_vehicletype.$valid){
                 var objAdd = {};
                 objAdd.vehicletypeid=$scope.vehicletype.vehicletypeid;
                 objAdd.vehicletypename=$scope.vehicletype.vehicletypename;
                 if($scope.vehicletype.loadcapacity!=null&&$scope.vehicletype.loadcapacity!=undefined&&$scope.vehicletype.loadcapacity!=""){
                 	objAdd.loadcapacity=$scope.vehicletype.loadcapacity;
                 }
                 if($scope.vehicletype.maxloadcapacity!=null&&$scope.vehicletype.maxloadcapacity!=undefined&&$scope.vehicletype.maxloadcapacity!=""){
                 	objAdd.maxloadcapacity=$scope.vehicletype.maxloadcapacity;
                 }
                 if($scope.vehicletype.vehiclelength!=null&&$scope.vehicletype.vehiclelength!=undefined&&$scope.vehicletype.vehiclelength!=""){
                 	 objAdd.vehiclelength=$scope.vehicletype.vehiclelength;
                 }
                 if($scope.vehicletype.vehiclewidth!=null&&$scope.vehicletype.vehiclewidth!=undefined&&$scope.vehicletype.vehiclewidth!=""){
                 	objAdd.vehiclewidth=$scope.vehicletype.vehiclewidth;
                 }
                 if($scope.vehicletype.vehiclehigth!=null&&$scope.vehicletype.vehiclehigth!=undefined&&$scope.vehicletype.vehiclehigth!=""){
                 	objAdd.vehiclehigth=$scope.vehicletype.vehiclehigth;
                 }
                 
                 var data = {};
                 data.data = JSON.stringify(objAdd);
                 console.info(data);
                 $http({
                     method : 'POST',
                     url : "/jsbweb/vehicleType/modify.do",
                     data:$.param(data),
                     headers : {
                         'Content-Type' : 'application/x-www-form-urlencoded'
                     }
                 }).success(function(resp) {
                     if(resp.ret==0){
                         $alert({title: '提示：', content: '修改成功', placement: 'masget-top',duration:1,type: 'info', show: true});
                         modal.$scope.$hide();
                         $scope.check();
                     }else{
                         $alert({title: '提示：', content: '修改失败', placement: 'masget-top',duration:1,type: 'info', show: true});
                     }
                 });
                 
             }else{
            	 $scope.button = false;
            	 modal.$scope.form_vehicletype.submitted = true;
                 $alert({title: '提示：', content: '请检查输入项', placement: 'masget-top',duration:1,type: 'info', show: true});
             }
	     }
	     
	     $scope.deleteVehicletype = function(item){
	    	 $modal({title: "提示", content: "确认要删除车辆类型为"+item.vehicletypename+"?",template:'modal/modal.confirm.tpl.html',animation:'am-fade-and-scale',callback: function(){
	    		 $http({
    				 method : 'POST',
    				 url : "/jsbweb/vehicleType/delete.do",
    				 data:"vehicletypeid="+item.vehicletypeid,
    				 headers : {
    					 'Content-Type' : 'application/x-www-form-urlencoded'
    				 }
    			 }).success(function(resp) {
    				 if(resp.ret==0){
    					 $alert({title: '提示：', content: '删除成功', placement: 'masget-top',duration:1,type: 'info', show: true});
    					 $scope.check();
    				 }else{
    					 $alert({title: '提示：', content: '删除失败', placement: 'masget-top',duration:1,type: 'info', show: true});
    					 $scope.check();
    				 }
    			 })
	    	 	 }
	    	 });
	     }
	     
	     $scope.check();
		 
}])