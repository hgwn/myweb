angular.module('masgetWebApp.vehicletype')
.controller('vehicletypeCtr',['$scope', '$stateParams', '$state','$alert','$http','$timeout','$modal',
    function ($scope, $stateParams, $state,$alert,$http,$timeout,$modal) {
		$scope.delivery={};
		//查询
		$scope.delivery.pageSize = 15;
		$scope.delivery.pageNum = 1;
	    $scope.check = function(){
	
	         $http({
	             method : 'POST',
	             url : "/jsbweb/deliveryType/list.do",
	             data:"data="+JSON.stringify($scope.delivery),
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
	    	 $scope.deliveryItem={};
	    	 $scope.deliveryItem.enableflag=1
	    	 addmodal = $modal({html:true,scope:$scope,title:"新增企业提货类型",template:'html/deliverytype.modal.tpl.html',contentTemplate:'html/deliverytype.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){}});
	    	 
	     }
	     
	     $scope.addVehicle = function(form,deliver){
	    	 $scope.button = true;
	    	 if(form.$valid){
                   $http({
                       method : 'POST',
                       url : "/jsbweb/deliveryType/add.do",
                       data:"data="+JSON.stringify(deliver),
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
	    	 $scope.deliveryItem = $.extend({},item);
	    	 $scope.button = false;
	    	 $scope.type = "edit";
	    	 modal = $modal({html:true,scope:$scope,title:"企业提货类型信息",template:'html/deliverytype.modal.tpl.html',contentTemplate:'html/deliverytype.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){
	    	 	 }
	    	 });
	     }
	     
	     $scope.editVehicle = function(form){
	    	 $scope.button = true;
	    	
             if(form.$valid){
                 $http({
                     method : 'POST',
                     url : "/jsbweb/deliveryType/modify.do",
                     data:"data="+JSON.stringify( $scope.deliveryItem ),
                     headers : {
                         'Content-Type' : 'application/x-www-form-urlencoded'
                     }
                 }).success(function(resp) {
                     if(resp.ret==0){
                         $alert({title: '提示：', content: '修改成功', placement: 'masget-top',duration:1,type: 'info', show: true});
                         modal.$scope.$hide();
                         $scope.deliveryItem={};
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
	    	 $modal({title: "提示", content: "确认要删除企业提货类型为"+item.deliverytypename+"?",template:'modal/modal.confirm.tpl.html',animation:'am-fade-and-scale',callback: function(){
	    		 $http({
    				 method : 'POST',
    				 url : "/jsbweb/deliveryType/delete.do",
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