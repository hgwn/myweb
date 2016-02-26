angular.module('masgetWebApp.resource')
.controller('resourceController',['$scope', '$state', 'utils','$modal','$alert','$http','$timeout','Upload',
    function ($scope, $state, utils,$modal,$alert,$http,$timeout,Upload) {
		//计算描述输入字数
	    $scope.checkText = function () {
			if($scope.editCompany.introduction!=null){
				if ($scope.editCompany.introduction.length > 500) {
					$scope.editCompany.introduction = $scope.editCompany.introduction.substr(0, 500);
					$scope.text = 500 - $scope.editCompany.introduction.length;
				}else{
					$scope.text = 500 - $scope.editCompany.introduction.length;
				}
			}else{
				$scope.text = 500;
			}
	    };
	    
	    $scope.resourceModel = {
	    		pageSize:15
	    }
	    
		//查询
		$scope.check = function(){
			var obj = {}
			var ordersArray = new Array();
	   	 	ordersArray[0] = "resourceid";
		   	obj.orders = ordersArray;
			obj.orderkey = "asc";
			obj.pagesize = $scope.resourceModel.pageSize;
			obj.pagenum = $scope.resourceModel.pageNum;
			if($scope.resourceModel.resourceid!=null&&$scope.resourceModel.resourceid!=""){
				obj.resourceid = parseInt($scope.resourceModel.resourceid);
			}
			if($scope.resourceModel.resourcename!=null&&$scope.resourceModel.resourcename!=""){
				obj.resourcename = $scope.resourceModel.resourcename;
			}
	    	var data ={};
	    	data.data = JSON.stringify(obj);
	        var url = "/jsbweb/base/resource/get.do"
	        utils.query(url,{method:'POST',data:data}).then(function(resp){
	        	if(resp.ret == 0){
	        		$scope.result = resp.data.rows;
		        	$scope.total =resp.data.total;
	        	}
	        });
		}
		
	    var addmodal = null;
	     $scope.addModel = function(){
	    	 $scope.button = false;
	    	 $scope.authenText = [];
	    	 $scope.resourceidModel = false;
	    	 $scope.resource={
	    			  resourceid:"",
	    			  resourcename:"",
	    			  resourcetip:"",
	    			  weburl:"",
	    			  icon:"",
	    			  description:""
	    	 };
	    	 $scope.file = false;
	    	 $scope.type = "add";
	    	 addmodal = $modal({html:true,
	    		 				scope:$scope,
	    		 				title:"新增资源信息",
	    		 				template:'html/resource-modal.html',
	    		 				contentTemplate:'html/resource-edit.html',
	    		 				animation:'am-fade-and-scale',
	    		 				callback:function(a,b,c){}
	    	 });
	     }
	     
	     $scope.add = function(){
	    	 $scope.button = true;
	    	 addmodal.$scope.form_resource.submitted = false;
             if(addmodal.$scope.form_resource.$valid){
                   var objAdd = {};
                   objAdd.resourceid=$scope.resource.resourceid;
                   objAdd.resourcename=$scope.resource.resourcename;
                   if($scope.resource.resourcetip!=null&&$scope.resource.resourcetip!=""){
                      objAdd.resourcetip=$scope.resource.resourcetip;
                   }
                   if($scope.resource.weburl!=null&&$scope.resource.weburl!=""){
                      objAdd.weburl=$scope.resource.weburl;
                   }
                   if($scope.resource.icon!=null&&$scope.resource.icon!=""){
                      objAdd.icon=$scope.resource.icon;
                   }
                   
                   if($scope.resource.description!=null&&$scope.resource.description!=""){
                       objAdd.description=$scope.resource.description;
                   }
                   if($scope.authen!=null&& $scope.authen!=""){
                	   objAdd.authen = $scope.authen;
                   }else{
                	   objAdd.authen = "";
                   }
                      
                  var data = {};
                  data.data = JSON.stringify(objAdd);
                  $http({
                      method : 'POST',
                      url : "/jsbweb/base/resource/add.do",
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
                    	  $scope.button = false;
                          $alert({title: '提示：', content: '新增失败，该资源主码已存在', placement: 'masget-top',duration:2, type: 'info', show: true});
                      }
                  });
              }else{
           	   	  $scope.button = false;
           	   	  addmodal.$scope.form_resource.submitted = true;
                  $alert({title: '提示：', content: '请检查输入项', placement: 'masget-top',duration:1, type: 'info', show: true});
              }
	     }
	     
	     $scope.editModel = function(item){
	    	 $scope.resourceidModel = true;
	    	 $scope.resource = $.extend({},item);
	    	 if($scope.resource.icon){
	    		$scope.file = true;
	    	 }else{
	    		$scope.file = false;
	    	 }
	    	 $scope.button = false;
	    	 $scope.type = "edit";
	    	 var auArray = [];
	    	 $scope.authenText = [];
	    	 auArray = item.authen.split(",");
			 angular.forEach(auArray,function(authenitem,key){
				if(authenitem == "r"){
					authenitem = '1';
				}else if(authenitem == "c"){
					authenitem = '2';
				}else if(authenitem == "u"){
					authenitem = '3';
				}else if(authenitem == "d"){
					authenitem = '4';
				}else if(authenitem == "a"){
					authenitem = '5';
				}else if(authenitem == "i"){
					authenitem = '6';
				}else if(authenitem == "e"){
					authenitem = '7';
				}else if(authenitem == "p"){
					authenitem = '8';
				}
				 $scope.authenText.push(authenitem);
			})
	    	 modal = $modal({html:true,
	    		 			scope:$scope,
	    		 			title:"员工信息",
	    		 			template:'html/resource-modal.html',
	    		 			contentTemplate:'html/resource-edit.html',
	    		 			animation:'am-fade-and-scale',
	    		 			callback:function(a,b,c){}
	    	 });
	     }
	     
	     $scope.edit = function(){
	    	 $scope.button = true;
	    	 modal.$scope.form_resource.submitted = false;
             if(modal.$scope.form_resource.$valid){
                 var objAdd = {};
                 objAdd.resourceid=$scope.resource.resourceid;
                 objAdd.resourcename=$scope.resource.resourcename;
                 if($scope.resource.resourcetip!=null&&$scope.resource.resourcetip!=""){
                    objAdd.resourcetip=$scope.resource.resourcetip;
                 }
                 if($scope.resource.weburl!=null&&$scope.resource.weburl!=""){
                    objAdd.weburl=$scope.resource.weburl;
                 }
                 if($scope.resource.icon!=null&&$scope.resource.icon!=""){
                    objAdd.icon=$scope.resource.icon;
                 }
                 
                 if($scope.resource.description!=null&&$scope.resource.description!=""){
                     objAdd.description=$scope.resource.description;
                 }
                 if($scope.authen!=null && $scope.authen!=""){
              	   objAdd.authen = $scope.authen;
                 }else{
                	 objAdd.authen = "";
                 }
                 
                var data = {};
                data.data = JSON.stringify(objAdd);
                $http({
                    method : 'POST',
                    url : "/jsbweb/base/resource/update.do",
                    data:$.param(data),
                    headers : {
                        'Content-Type' : 'application/x-www-form-urlencoded'
                    }
                }).success(function(resp) {
                    if(resp.ret==0){
                        $alert({title: '提示：', content: '修改成功', placement: 'masget-top',duration:2, type: 'info', show: true});
                        $scope.check();
                        modal.$scope.$hide();
                    }else{
                    	$scope.button = false;
                        $alert({title: '提示：', content: '修改失败', placement: 'masget-top',duration:2, type: 'info', show: true});
                    }
                });
            }else{
            	 $scope.button = false;
            	 modal.$scope.form_resource.submitted = true;
                 $alert({title: '提示：', content: '请检查输入项', placement: 'masget-top',duration:1,type: 'info', show: true});
             }
	     }
	     
	     $scope.deleteModel = function(item){
    		 $modal({title: "提示", content: "确认要删除资源为"+item.resourcename+"?",template:'modal/modal.confirm.tpl.html',animation:'am-fade-and-scale',callback: function(){
    			 $http({
    				 method : 'POST',
    				 url : "/jsbweb/base/resource/delete.do",
    				 data:"resourceid="+item.resourceid,
    				 headers : {
    					 'Content-Type' : 'application/x-www-form-urlencoded'
    				 }
    			 }).success(function(resp) {
    				 if(resp.ret==0){
    					 $alert({title: '提示：', content: '删除成功', placement: 'masget-top',duration:1,type: 'info', show: true});
    					 $scope.check();
    				 }else{
    					 $alert({title: '提示：', content: '删除失败', placement: 'masget-top',duration:1,type: 'info', show: true});
    				 }
    			 })
    		 }
    		 })
		 }
	     
	     //删除图片
		 $scope.deletePic = function(picIndex){
				//删除图片
				$scope.resource.pictUrl = utils.removeFromArrayByKeyValue($scope.resource.pictUrl,'pictureIndex',picIndex);
				$scope.file = false;
		 }
		 
		 $scope.upload = function (files) {
		 	//console.log(files);
		        if (files && files.length) {
		            for (var i = 0; i < files.length; i++) {
		                var file = files[i];
		                Upload.upload({
		                    url: '/jsbweb/base/fileUpload.do',
		                    fields: {'username': $scope.username},
		                    file: file
		                }).progress(function (evt) {
		                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
		                }).success(function (data, status, headers, config) {
		                	console.log(data);
		                	$scope.resource.icon = data.data.file;
		                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
		                    $scope.file = true;
		                }).error(function(){
		                	console.log("error");
		                });
		            }
		        }
		 };
	}
])
