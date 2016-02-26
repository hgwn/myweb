angular.module('masgetWebApp.vehicletype')
.controller('vehicletypeCtr',['$scope', '$stateParams', '$state', 'utils','$alert','$http','$timeout','$modal',
    function ($scope, $stateParams, $state, utils,$alert,$http,$timeout,$modal) {
		$scope.vehicle = {
				licensenumber:"",
				vehicletypename:""
		}
		$scope.staff={};
		//查询
		$scope.staff.pageSize = 15;
		$scope.staff.pageNum = 1;
	    $scope.check = function(){
	
	         $http({
	             method : 'POST',
	             url : "/jsbweb/staffType/list.do",
	             data:"data="+JSON.stringify($scope.staff),
	             headers : {
	                 'Content-Type' : 'application/x-www-form-urlencoded'
	             }
	         }).success(function(resp) {
	        	 console.log(resp)
	        	 if(resp.ret == 0){
	        		 $scope.result = resp.data.rows;
	        		 $scope.total = resp.data.total;
	        	 }
	         })
	     }
	     $scope.check();
	     
	     var addmodal = null;
	     $scope.add = function(){
	    	 $scope.button = false;
	    	 $scope.type = "add";
	    	 $scope.staffItem={};
	    	 addmodal = $modal({html:true,scope:$scope,title:"新增员工类型",template:'html/stafftype.modal.tpl.html',contentTemplate:'html/stafftype.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){}});
	    	 
	     }
	     
	     $scope.addVehicle = function(form,stafftype){
	    	 $scope.button = true;
	    	 if(form.$valid){
                   $http({
                       method : 'POST',
                       url : "/jsbweb/staffType/add.do",
                       data:"data="+JSON.stringify(stafftype),
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
                       $scope.button = false;
                   });
               }else{
            	   $scope.button = false;
                   $alert({title: '提示：', content: '请检查输入项', placement: 'masget-top',duration:2, type: 'info', show: true});
               }
	     }
	     
	   	  var modal = null;
	   	 	
		
	     $scope.edit = function(item){
	    	 $scope.typeShow = "edit";
	    	 $scope.staffItem = $.extend({},item);
	    	 $scope.button = false;
	    	 $scope.type = "edit";
	    	 modal = $modal({html:true,scope:$scope,title:"员工类型信息",template:'html/stafftype.modal.tpl.html',contentTemplate:'html/stafftype.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){
	    	 	 }
	    	 });
	     }
	     
	     $scope.editVehicle = function(form){
	    	 $scope.button = true;
	    	
             if(form.$valid){
                 $http({
                     method : 'POST',
                     url : "/jsbweb/staffType/modify.do",
                     data:"data="+JSON.stringify( $scope.staffItem ),
                     headers : {
                         'Content-Type' : 'application/x-www-form-urlencoded'
                     }
                 }).success(function(resp) {
                     if(resp.ret==0){
                         $alert({title: '提示：', content: '修改成功', placement: 'masget-top',duration:1,type: 'info', show: true});
                         modal.$scope.$hide();
                         $scope.staffItem={};
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
	    	 $modal({title: "提示", content: "确认要删除员工类型为"+item.stafftypename+"?",template:'modal/modal.confirm.tpl.html',animation:'am-fade-and-scale',callback: function(){
	    		 $http({
    				 method : 'POST',
    				 url : "/jsbweb/staffType/delete.do",
    				 data:"data="+JSON.stringify(item),
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
		 
}])