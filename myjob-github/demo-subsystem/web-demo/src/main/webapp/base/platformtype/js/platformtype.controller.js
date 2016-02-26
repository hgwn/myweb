angular.module('masgetWebApp.vehicletype')
.controller('vehicletypeCtr',['$scope', '$stateParams', '$state','$alert','$http','$timeout','$modal',
    function ($scope, $stateParams, $state,$alert,$http,$timeout,$modal) {
		$scope.platform={};
		//查询
		$scope.platform.pageSize = 15;
		$scope.platform.pageNum = 1;
	    $scope.check = function(){
	
	         $http({
	             method : 'POST',
	             url : "/jsbweb/platformType/list.do",
	             data:"data="+JSON.stringify($scope.platform),
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
	    	 $scope.platformItem={};
	    	 addmodal = $modal({html:true,scope:$scope,title:"新增平台类型",template:'html/platformtype.modal.tpl.html',contentTemplate:'html/platformtype.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){}});
	    	 
	     }
	     
	     $scope.addVehicle = function(form,platform){
	    	 $scope.button = true;
	    	 if(form.$valid){
                   $http({
                       method : 'POST',
                       url : "/jsbweb/platformType/add.do",
                       data:"data="+JSON.stringify(platform),
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
	    	 $scope.platformItem = $.extend({},item);
	    	 $scope.button = false;
	    	 $scope.type = "edit";
	    	 modal = $modal({html:true,scope:$scope,title:"平台类型信息",template:'html/platformtype.modal.tpl.html',contentTemplate:'html/platformtype.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){
	    	 	 }
	    	 });
	     }
	     
	     $scope.editVehicle = function(form){
	    	 $scope.button = true;
	    	
             if(form.$valid){
                 $http({
                     method : 'POST',
                     url : "/jsbweb/platformType/modify.do",
                     data:"data="+JSON.stringify( $scope.platformItem ),
                     headers : {
                         'Content-Type' : 'application/x-www-form-urlencoded'
                     }
                 }).success(function(resp) {
                     if(resp.ret==0){
                         $alert({title: '提示：', content: '修改成功', placement: 'masget-top',duration:1,type: 'info', show: true});
                         modal.$scope.$hide();
                         $scope.platformItem={};
                         $scope.check();
                     }else{
                         $alert({title: '提示：', content: '修改失败', placement: 'masget-top',duration:1,type: 'info', show: true});
                     }
                 });
                 
             }else{
            	 $scope.button = false;
                 $alert({title: '提示：', content: '请检查输入项', placement: 'masget-top',duration:1,type: 'info', show: true});
             }
	     }
	     
	     $scope.deleteVehicletype = function(item){
	    	 $modal({title: "提示", content: "确认要删除平台类型为"+item.platformtypename+"?",template:'modal/modal.confirm.tpl.html',animation:'am-fade-and-scale',callback: function(){
	    		 $http({
    				 method : 'POST',
    				 url : "/jsbweb/platformType/delete.do",
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