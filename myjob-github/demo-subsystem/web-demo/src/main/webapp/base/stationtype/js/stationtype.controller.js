angular.module('masgetWebApp.vehicletype')
.controller('vehicletypeCtr',['$scope', '$stateParams', '$state', 'utils','$alert','$http','$timeout','$modal',
    function ($scope, $stateParams, $state, utils,$alert,$http,$timeout,$modal) {

		$scope.station={};
		//查询
		$scope.station.pageSize = 15;
		$scope.station.pageNum = 1;
	    $scope.check = function(){
	
	         $http({
	             method : 'POST',
	             url : "/jsbweb/stationType/list.do",
	             data:"data="+JSON.stringify($scope.station),
	             headers : {
	                 'Content-Type' : 'application/x-www-form-urlencoded'
	             }
	         }).success(function(resp) {
	        	 console.log(resp)
	        	 if(resp.ret == 0){
	        		 $scope.result = resp.result.rows;
	        		 $scope.total = resp.result.rows;
	        	 }
	         })
	     }
	     $scope.check();
	     
	     var addmodal = null;
	     $scope.add = function(){
	    	 $scope.button = false;
	    	 $scope.type = "add";
	    	 $scope.stationItem={};
	    	 addmodal = $modal({html:true,scope:$scope,title:"新增站点类型",template:'html/stationtype.modal.tpl.html',contentTemplate:'html/stationtype.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){}});
	    	 
	     }
	     
	     $scope.addVehicle = function(form,station){
	    	 $scope.button = true;
	    	 if(form.$valid){
                   $http({
                       method : 'POST',
                       url : "/jsbweb/stationType/add.do",
                       data:"data="+JSON.stringify( station),
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
	    	 $scope.stationItem =$.extend({},item);
	    	 console.log($scope.stationItem)
	    	 $scope.button = false;
	    	 $scope.type = "edit";
	    	 modal = $modal({html:true,scope:$scope,title:"站点类型信息",template:'html/stationtype.modal.tpl.html',contentTemplate:'html/stationtype.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){
	    	 	 }
	    	 });
	     }
	     
	     $scope.editVehicle = function(form){
	    	 $scope.button = true;
	    	
             if(form.$valid){
                 $http({
                     method : 'POST',
                     url : "/jsbweb/stationType/modify.do",
                     data:"data="+JSON.stringify( $scope.stationItem ),
                     headers : {
                         'Content-Type' : 'application/x-www-form-urlencoded'
                     }
                 }).success(function(resp) {
                     if(resp.ret==0){
                         $alert({title: '提示：', content: '修改成功', placement: 'masget-top',duration:1,type: 'info', show: true});
                         modal.$scope.$hide();
                         $scope.stationItem={};
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
	    	 $modal({title: "提示", content: "确认要删除站点类型为"+item.stationtypename+"?",template:'modal/modal.confirm.tpl.html',animation:'am-fade-and-scale',callback: function(){
	    		 $http({
    				 method : 'POST',
    				 url : "/jsbweb/stationType/delete.do",
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