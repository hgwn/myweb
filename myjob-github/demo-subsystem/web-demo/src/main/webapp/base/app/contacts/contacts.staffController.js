angular.module('masgetWebApp.contacts').controller('staffController',['$scope', '$stateParams', '$state', 'utils','contactsRoletype','$alert','$http','Upload','$timeout',
       function ($scope, $stateParams, $state, utils,contactsRoletype,$alert,$http,Upload,$timeout) {
			$scope.isContactStaff = true;
		    $scope.getStationData = function () {
				if($state.broadCast != null &&$state.broadCast.item !=null &&$state.broadCast.item.companyid !=undefined){
					var companyid = $state.broadCast.item.companyid
				}else{
					var companyid = $state.broadCast.item.parent.companyid;
				}
			    utils.query("/jsbweb/logistic/StowageController/getlist.do?companyid="+companyid).then(function (resp) {
					$scope.stationData = resp.data.rows;
			    });
		    };
			if($state.broadCast==null||$state.broadCast==""){return;}
		    $scope.getStationData();
			if($state.broadCast.type=="add"){
				$scope.type="add";
		    	$scope.loginname = false;
		    	$scope.stationmodel = true;
		    	$scope.roletypemodel = false;
		    	$scope.roletype=utils.removeFromArrayByKeyValue(contactsRoletype,"roletypeid",1);
		    	$scope.comstaffDatum={
		    			staffname:'',
		    			roletypeid:'',
		    			workingstationid:'',
		    			loginname:'',
		    			loginpwd:'',
		    			latitude:'',
		    			mobilephone:'',
		    			identitycard:'',
		    			email:'',
		    			remark:''
		    	};
		    	if($state.broadCast.node!=null){
		    		$scope.nodeId = $state.broadCast.node;
		    	}else{
		    		$scope.nodeId = $state.broadCast.item;
		    	}
		    	$scope.comstaffDatum.stationname = $state.broadCast.item.stationname;
		    	$scope.comstaffDatum.stationid = $state.broadCast.item.stationid;
		        $scope.comstaffDatum.companyname = $scope.session.companyname;
		        
		        $scope.add = function(){
		        	var addArray = new Array();
		        	$scope.button = true;
		        	$scope.form_staff.submitted = false;
		        	if($scope.form_staff.$valid){
							 var objAdd = {};
							 objAdd.staffname=$scope.comstaffDatum.staffname;
							 objAdd.roletypeid=$scope.comstaffDatum.roletypeid;
							 objAdd.workingstationid=$scope.comstaffDatum.stationid;
							 objAdd.loginname=$scope.comstaffDatum.loginname;
							 objAdd.loginpwd=$.md5($scope.comstaffDatum.loginpwd);
							 objAdd.mobilephone=$scope.comstaffDatum.mobilephone;
							 if($scope.comstaffDatum.stafficon!=null&&$scope.comstaffDatum.stafficon!=""){
								objAdd.stafficon=$scope.comstaffDatum.stafficon;
							 }
							 if($scope.comstaffDatum.identitycard!=null&&$scope.comstaffDatum.identitycard!=""){
								objAdd.identitycard=$scope.comstaffDatum.identitycard;
							 }
							 if($scope.comstaffDatum.email!=null&&$scope.comstaffDatum.email!=""){
								objAdd.email=$scope.comstaffDatum.email;
							 }
							 
							 if($scope.comstaffDatum.remark!=null&&$scope.comstaffDatum.remark!=""){
								 objAdd.remark=$scope.comstaffDatum.remark;
							 }
							var data = {};
							data.data = JSON.stringify(objAdd);
							console.info(data);
							$http({
				                method : 'POST',
				                url : "/jsbweb/base/companystaff/add.do",
				                data:$.param(data),
				                headers : {
				                    'Content-Type' : 'application/x-www-form-urlencoded'
				                }
				            }).success(function(resp) {
				            	if(resp.ret==0){
				            		$alert({title: '提示：', content: '新增成功', placement: 'masget-top',duration:2, type: 'info', show: true});
				            		objAdd.staffid = resp.data.staffid;
				            		objAdd.staffname = resp.data.staffname;
				            		addArray.push(objAdd);
				            		$scope.addNodes($scope.nodeId,addArray,"staff");
				            		$state.go("home.contacts_blank",{path:utils.uuid()});
				            	}else{
				            		$alert({title: '提示：', content: '新增失败，已存在该登录名', placement: 'masget-top',duration:2, type: 'info', show: true});
				            	}
				            });
			    		}else{
			    			$scope.button = false;
			    			$scope.form_staff.submitted = true;
			        	}
		        }
		        
		    }else if($state.broadCast.type=="edit"){
		
		    	$scope.basicPhone = $state.broadCast.item.mobilephone;
				$scope.comstaffDatum = $state.broadCast.item;
				$scope.roletype = contactsRoletype;
		    	$scope.type = "edit";
		    	$scope.typeShow = "edit";
		    	if($scope.comstaffDatum.stafficon){
		    		$scope.file = true;
		    	}else{
		    		$scope.file = false;
		    	}
		    	$scope.stationmodel = true;
		    	$scope.roletypemodel = true;
		    	$scope.loginname = true;
		   	 	var data = [];
		       	
		   	 	//判断手机号码是否改变
		   	 	$scope.changePhone = function(){
		   	 		if($scope.comstaffDatum.staffid == $state.broadCast.sessionStaffid){
		   	 			$scope.mobilephone = $scope.comstaffDatum.mobilephone;
		   	 			if($scope.mobilephone!=$scope.basicPhone){
		   	 				$scope.typeShow = "checkSms";
		   	 			}else{
		   	 				$scope.typeShow = "edit";
		   	 			}
		   	 		}
		   	 	}		
		   	 	
		   	 	//倒计时
		   	    $scope.counter = 60;
		   	    $scope.onTimeout = function(){
		   	        $scope.counter--;
		   	        $scope.mytimeout = $timeout($scope.onTimeout,1000);
		   	        if($scope.counter==0){
		   	        	$scope.SMS = false;
		   	        	$timeout.cancel($scope.mytimeout);
		   	        	$scope.counter = 60;
		   	        }
		   	    }
		   	 	
			 		//发送验证短信
		       	$scope.sendSms = function () {
		       		if($scope.comstaffDatum.mobilephone!=null&&$scope.comstaffDatum.mobilephone!=""){
		       			$scope.mobilephone = $scope.comstaffDatum.mobilephone;
		     	    	$http({
		       				method : "POST",
		       				url : "/jsbweb/base/modifySendSms.do",
		       				data : "mobilephone="+$scope.mobilephone,
		       				headers : {
		     	                'Content-Type' : 'application/x-www-form-urlencoded'
		     	            }
		     	    	}).success(function(result) {
		       					if (result.ret == 0 ){
		       						$scope.SMS = true;
		       						$scope.onTimeout();
		       						//成功发短信
		       						$alert({title: '提示：', content: '发送信息成功', placement: 'masget-top',duration:2,type: 'info', show: true});
		       					}else if (result.ret == 10 || result.ret == 12) {
		       						$alert({title: '提示：', content: result.message, placement: 'masget-top',duration:2,type: 'info', show: true});
		       					} 
		     	           });
		       		}else{
		       			$alert({title: '提示：', content: '输入的手机号码格式不对', placement: 'masget-top',duration:2,type: 'info', show: true});
		       		}
		  		}
		       	
		       	//检查验证信息
		       	$scope.checkSms = function () {
		   			 $scope.form_staff.submitted = false;
		       		 if($scope.form_staff.$valid){
		       			var objAdd = {};
		       			objAdd.mobilephone=$scope.comstaffDatum.mobilephone;
						objAdd.verificationCode=$scope.comstaffDatum.validationnum;
						
							var Smsdata = {};
							Smsdata.data = JSON.stringify(objAdd);
							console.info(Smsdata);
		     	    	$http({
		       				method : "POST",
		       				url : "/jsbweb/base/verification.do",
		       				data :$.param(Smsdata),
		       				headers : {
		     	                'Content-Type' : 'application/x-www-form-urlencoded'
		     	            }
		     	    	}).success(function(result) {
		       					if (result.ret == 0 ) {
		       						$scope.edit();
		       					} else {
		       						$alert({title: '提示：', content: result.message, placement: 'masget-top',duration:2,type: 'info', show: true});
		       					}
		       			});
		       		 }else{
		       			 $scope.form_staff.submitted = true;
			        		 $alert({title: '提示：', content: '请检查输入项', placement: 'masget-top',duration:2,type: 'info', show: true});
		        	 }
	       		}
			     
			         
			      
			    $scope.edit = function(){
			    	$scope.button = true;
			    	$scope.form_staff.submitted = false;
		        	if($scope.form_staff.$valid){
		        		var objAdd = {};
		        		objAdd.rstaffid = $scope.comstaffDatum.staffid;
		        		if($scope.comstaffDatum.staffname!=null&&$scope.comstaffDatum.staffname!=""){
		        			objAdd.staffname=$scope.comstaffDatum.staffname;
		        		}
		        		if($scope.comstaffDatum.mobilephone!=null&&$scope.comstaffDatum.mobilephone!=""){
		        			objAdd.mobilephone=$scope.comstaffDatum.mobilephone;
		        		}
		        		if($scope.comstaffDatum.stafficon!=null&&$scope.comstaffDatum.stafficon!=""){
		        			objAdd.stafficon=$scope.comstaffDatum.stafficon;
		        		}
		        		if($scope.comstaffDatum.identitycard!=null&&$scope.comstaffDatum.identitycard!=""){
		        			objAdd.identitycard=$scope.comstaffDatum.identitycard;
		        		}
		        		if($scope.comstaffDatum.email!=null&&$scope.comstaffDatum.email!=""){
		        			objAdd.email=$scope.comstaffDatum.email;
		        		}
		        		if($scope.comstaffDatum.remark!=null&&$scope.comstaffDatum.remark!=""){
		        			objAdd.remark=$scope.comstaffDatum.remark;
		        		}
		        		 if($scope.comstaffDatum.mposname!=null&&$scope.comstaffDatum.mposname!=""){
							 objAdd.mposname=$scope.comstaffDatum.mposname;
						 }
		        		 if($scope.comstaffDatum.mposaddress!=null&&$scope.comstaffDatum.mposaddress!=""){
							 objAdd.mposaddress=$scope.comstaffDatum.mposaddress;
						 }
		        		var data = {};
		        		data.data = JSON.stringify(objAdd);
		        		console.info(data);
		        		$http({
		        			method : 'POST',
		        			url : "/jsbweb/base/companystaff/update.do",
		        			data:$.param(data),
		        			headers : {
		        				'Content-Type' : 'application/x-www-form-urlencoded'
		        			}
		        		}).success(function(resp) {
		        			if(resp.ret==0){
		        				$alert({title: '提示：', content: '修改成功', placement: 'masget-top',duration:2,type: 'info', show: true});
		        				$state.broadCast.node.contactname = $scope.comstaffDatum.staffname;
		        				$state.go("home.contacts_blank",{path:utils.uuid()});
		        			}else{
		        				$alert({title: '提示：', content: resp.message, placement: 'masget-top',duration:2,type: 'info', show: true});
		        			}
		        		});
		        	}else{
		        		$scope.button = false;
		        		$scope.form_staff.submitted = true;
		        		$alert({title: '提示：', content: '请检查输入项', placement: 'masget-top',duration:2,type: 'info', show: true});
		        	}
			    }
		}else{
			$scope.stationmodel = true;
			$scope.roletypemodel = true;
			$scope.comstaffDatum = $state.broadCast.item;
			$scope.roletype = contactsRoletype;
	    	$scope.type = "check";
		}
		    
		//删除图片
		 $scope.deletePic = function(picIndex){
				//删除图片
				$scope.comstaffDatum.pictUrl = utils.removeFromArrayByKeyValue($scope.comstaffDatum.pictUrl,'pictureIndex',picIndex);
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
		                	$scope.comstaffDatum.stafficon = data.data.file;
		                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
		                    $scope.file = true;
		                }).error(function(){
		                	console.log("error");
		                });
		            }
		        }
		 };
		$scope.$on('renderFinished',function(event,data){
            $scope.$watch('files', function () {
                $scope.upload($scope.files);
            });
		})
	}]
)