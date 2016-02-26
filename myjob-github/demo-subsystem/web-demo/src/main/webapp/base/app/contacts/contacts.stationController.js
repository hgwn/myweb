angular.module('masgetWebApp.contacts').controller('stationController',['$scope', 'utils', '$stateParams', '$state','$alert','$http','$timeout','contactsStation','$timeout','$dropdown',
    function ($scope,utils,$stateParams, $state, $alert,$http,$timeout,contactsStation,$timeout,$dropdown) {
		if($state.broadCast==null||$state.broadCast==""){return;}
		if($state.broadCast.type == "edit"){
			 $scope.select = true;
	    	 $scope.stationtype = contactsStation;
	    	 $scope.type = "edit";
	         $scope.stationDatum = $state.broadCast.item;
	         if($state.broadCast.node!=null){
	        	 $scope.nodeId = $state.broadCast.node;
	         }
	         $scope.stationDatum.Province = $state.broadCast.item.provinceid;
	         $scope.stationDatum.City = $state.broadCast.item.cityid;
			
			$scope.edit = function(){
				$scope.button = true;
				$scope.checkPCA = true;
//				var pstationid = $('#comtree').combotree('getValue');
				$scope.form_station.submitted = false;
		        	 if($scope.form_station.$valid){
		        		 if($scope.stationDatum.pstationid!=$scope.stationDatum.stationid){
		        			 var objAdd = {};
		   					 objAdd.mstationid=$scope.stationDatum.stationid;
		   					 if($scope.stationDatum.pstationid!=null&&$scope.stationDatum.pstationid!=""){
		   						objAdd.pstationid=$scope.stationDatum.pstationid;
		   					 }
		   					 if($scope.stationDatum.stationtypeid!=null&&$scope.stationDatum.stationtypeid!=""){
		   						 objAdd.stationtypeid=$scope.stationDatum.stationtypeid;
		   					 }
		   					 if($scope.stationDatum.stationname!=null&&$scope.stationDatum.stationname!=""){
		   						 objAdd.stationname=$scope.stationDatum.stationname;
		   					 }
		   					 if($scope.stationDatum.stationcode!=null&&$scope.stationDatum.stationcode!=""){
		   						 objAdd.stationcode=$scope.stationDatum.stationcode;
		   					 }
		   					 if($scope.stationDatum.shortening!=null&&$scope.stationDatum.shortening!=""){
		   						 objAdd.shortening=$scope.stationDatum.shortening;
		   					 }
		   					if($scope.stationDatum.provinceid!=null&&$scope.stationDatum.provinceid!=""){
		        				 objAdd.provinceid=$scope.stationDatum.provinceid;
		        				 if($scope.stationDatum.cityid!=null&&$scope.stationDatum.cityid!=""){
		        					 objAdd.cityid=$scope.stationDatum.cityid;
		        					 if($scope.stationDatum.areaid!=null&&$scope.stationDatum.areaid!=""){
		        						 objAdd.areaid=$scope.stationDatum.areaid;
		        					 }else{
		        						 objAdd.areaid = 0;
		        					 }
		        				 }else{
		        					 $scope.checkPCA = false; 
		        				 }
		        			 }else{
		        				 $scope.checkPCA = false;
		        			 }
		   					if($scope.stationDatum.longitude!=null&&$scope.stationDatum.longitude!=""){
								 objAdd.longitude=$scope.stationDatum.longitude;
							 }
							 if($scope.stationDatum.latitude!=null&&$scope.stationDatum.latitude!=""){
								 objAdd.latitude=$scope.stationDatum.latitude;
							 }
		   					 objAdd.address=$scope.stationDatum.address;
		   						
		   					var data = {};
		   					data.data = JSON.stringify(objAdd);
		   					if($scope.checkPCA){
		   						$http({
			   		                method : 'POST',
			   		                url : "/jsbweb/base/stationdatum/update.do",
			   		                data:$.param(data),
			   		                headers : {
			   		                    'Content-Type' : 'application/x-www-form-urlencoded'
			   		                }
			   		            }).success(function(resp) {
			   		            	if(resp.ret==0){
			   		            		$alert({title: '提示：', content: '修改成功', placement: 'masget-top',duration:2,type: 'info', show: true});
			   		            		$scope.nodeId.addressgroupname = $scope.stationDatum.stationname;
			   		            		$state.go("home.contacts_blank",{path:utils.uuid()});
			   		            	}else{
			   		            		$alert({title: '提示：', content: '修改失败', placement: 'masget-top',duration:2,type: 'info', show: true});
			   		            	}
			   		            });
		   						return true;
		   					}else{
		   						$scope.button = false;
		   						$alert({title: '提示：', content: '省市不能为空', placement: 'masget-top',duration:2,type: 'info', show: true});
		   						return false;
		   					}
		        		 }else{
		        			 $scope.button = false;
		        			$alert({title: '提示：', content: '该父站点与站点不能相同', placement: 'masget-top',duration:2,type: 'info', show: true});
		        			return false;
		        		 }
		        	 }else{
		        		 $scope.button = false;
		        		 $scope.form_station.submitted = true;
		        		 $alert({title: '提示：', content: '请检查输入项', placement: 'masget-top',duration:2,type: 'info', show: true});
		        		 return false;
		        	 }
			}
		}else if($state.broadCast.type == "add"){
			 $scope.type = "add";
			$scope.stationDatum={
	    			stationtypeid:'',
	    			stationname:'',
	    			stationcode:'',
	    			shortening:'',
	    			longitude:0.01,
	    			latitude:0.01,
	    			address:'',
	    			selectedProvince:'',
	    			selectedCity:'',
	    			selectedArea:''
	    	};
	    	$scope.stationDatum.companyid = $scope.session.companyid;
	    	$scope.stationDatum.companyname = $scope.session.companyname;
	    	
	        $scope.stationtype = utils.removeFromArrayByKeyValue(contactsStation,"stationtypeid",1);
	        if($state.broadCast.node!=null){
	        	 $scope.nodeId = $state.broadCast.node;
	         }
	
	    	$scope.add = function(){
		    	$scope.stationname = false;
	    	 	$scope.stationcode = false;
	    	 	$scope.shortening = false;
	    	 	$scope.select = false;
	    	 	$scope.comtree = false;
	    	 	$scope.longitude = false;
	    	 	$scope.latitude = false;
	    	 	$scope.selectedProvince = false;
	    	 	$scope.selectedCity = false;
	    	 	$scope.selectedArea = false;
	    	 	$scope.address = false;
	    	 	$scope.button = true;
	    	 	$scope.checkPCA = true;
		        $scope.form_station.submitted = false;
		        var addArray = new Array();
//	        	var pstationid = $('#comtree').combotree('getValue');
	        	if($scope.form_station.$valid){
					 var objAdd = {};
					 if($scope.stationDatum.pstationid!=null&&$scope.stationDatum.pstationid!=""){
						 objAdd.pstationid=$scope.stationDatum.pstationid;
					 }else{
						 objAdd.pstationid=0;
					 }
					 objAdd.stationtypeid=$scope.stationDatum.stationtypeid;
					 objAdd.stationname=$scope.stationDatum.stationname;
					 if($scope.stationDatum.stationcode!=null&&$scope.stationDatum.stationcode!=""){
						 objAdd.stationcode=$scope.stationDatum.stationcode;
					 }
					 if($scope.stationDatum.shortening!=null&&$scope.stationDatum.shortening!=""){
						 objAdd.shortening=$scope.stationDatum.shortening;
					 }
					 if($scope.stationDatum.provinceid!=null&&$scope.stationDatum.provinceid!=""){
        				 objAdd.provinceid=$scope.stationDatum.provinceid;
        				 if($scope.stationDatum.cityid!=null&&$scope.stationDatum.cityid!=""){
        					 objAdd.cityid=$scope.stationDatum.cityid;
        					 if($scope.stationDatum.areaid!=null&&$scope.stationDatum.areaid!=""){
        						 objAdd.areaid=$scope.stationDatum.areaid;
        					 }else{
        						 objAdd.areaid = 0;
        					 }
        				 }else{
        					 $scope.checkPCA = false; 
        				 }
        			 }else{
        				 $scope.checkPCA = false;
        			 }
					 if($scope.stationDatum.longitude!=null&&$scope.stationDatum.longitude!=""){
						 objAdd.longitude=$scope.stationDatum.longitude;
					 }else{
						 objAdd.longitude = 0;
					 }
					 if($scope.stationDatum.latitude!=null&&$scope.stationDatum.latitude!=""){
						 objAdd.latitude=$scope.stationDatum.latitude;
					 }else{
						 objAdd.latitude = 0;
					 }
					 objAdd.address=$scope.stationDatum.address;
					 
					var data = {};
					data.data = JSON.stringify(objAdd);
					console.info(data);
					if($scope.checkPCA){
						$http({
			                method : 'POST',
			                url : "/jsbweb/base/stationdatum/add.do",
			                data:$.param(data),
			                headers : {
			                    'Content-Type' : 'application/x-www-form-urlencoded'
			                }
			            }).success(function(resp) {
			            	if(resp.ret==0){
			            		$alert({title: '提示：', content: '新增成功', placement: 'masget-top',duration:2, type: 'info', show: true});
			            		objAdd.stationid = resp.data;
			            		addArray.push(objAdd);
			            		$scope.addNodes($scope.nodeId,addArray,"station");
			            		$state.go("home.contacts_blank",{path:utils.uuid()});
			            	}else{
			            		$alert({title: '提示：', content: '新增失败', placement: 'masget-top',duration:2,type: 'info', show: true});
			            	}
			            });
					}else{
						 $scope.button = false;
		    			 $alert({title: '提示：', content: '省市不能为空', placement: 'masget-top',duration:2,type: 'info', show: true});
					}
	    		}else{
	    			 $scope.button = false;
	    			 $scope.form_station.submitted = true;
	    			 $alert({title: '提示：', content: '请检查输入项', placement: 'masget-top',duration:2,type: 'info', show: true});
	        	 }
		    }
	  }else if($state.broadCast.type == "check"){
		  $scope.type = "check";
		  $scope.select = true;
		  $scope.stationDatum = $state.broadCast.item;
		  $scope.stationtype = contactsStation;
		  $scope.stationDatum.Province = $state.broadCast.item.provinceid;
		  $scope.stationDatum.City = $state.broadCast.item.cityid;
	  }

        $scope.stationChanged = function(item){
                console.log(item);
            $scope.stationDatum.pstationname = item.text;
            $scope.stationDatum.pstationid = item.id;
        }
		
		$scope.$on('renderFinished',function(event,data){
			   if(data.type == "editStation"){
					 var sessionid = $scope.session.companyid;
					 var stationid = $scope.session.stationid;
					 if($state.broadCast!=null&&$state.broadCast!=''&&$state.broadCast!=undefined&&$state.broadCast.item!=null&&$state.broadCast.item.stationid!=null&&sessionid == $state.broadCast.item.companyid){
						if(sessionid == $state.broadCast.item.companyid){
							 var id = $state.broadCast.item.stationid;
								utils.query("/jsbweb/base/stationdatum/plist.do?id="+id).then(function(resp){
									utils.calTreeLevel(resp.data.rows,0);
									$scope.stationList = resp.data.rows;
									$dropdown($("#comtree"),{
										animation: "am-fade-and-slide-bottom",
										trigger: "focus",
										unbindBodyClick:true,
										html: "true",
										scope: $scope,
										container:"body",
										template: "stationList.tpl.html",
										prefixevent: "stationDropDown"
									})
								})
						}
					 }else{
						 if($state.broadCast.item!=null){
							 var companyid = $state.broadCast.item.companyid
						 }else if($state.broadCast.node!=null){
							 var companyid = $state.broadCast.node.companyid
						 }
						 $scope.stationDatum.pstationname = $scope.session.stationname;
						 $scope.stationDatum.pstationid = stationid;
						 utils.query("/jsbweb/base/stationdatum/plist.do?companyid="+companyid).then(function(resp){
							 utils.calTreeLevel(resp.data.rows,0);
							 $scope.stationList = resp.data.rows;
							 $dropdown($("#comtree"),{
								 animation: "am-fade-and-slide-bottom",
								 trigger: "focus",
								 unbindBodyClick:true,
								 html: "true",
								 scope: $scope,
								 container:"body",
								 template: "stationList.tpl.html",
								 prefixevent: "stationDropDown"
							 });
						 });
					 }

					 $state.broadCast={};
	        	         
	
	            	$scope.pca = utils.pca;
	                $scope.cities = [];
	                $scope.areas = [];
	                
	                $scope.$watch("stationDatum.provinceid", function (newValue, oldValue, scope) {
	                	if(newValue != $scope.stationDatum.Province){
	                		$scope.stationDatum.cityid ="";
	                		$scope.stationDatum.areaid ="";
	                	}
	                	if($scope.stationDatum.provinceid!=""&&$scope.stationDatum.provinceid!=null){
	                		utils.httpGet("/jsbweb/commonUtils.do?type=district&provinceid=" + newValue, function (resp) {
	                			if(resp.ret == 0){
	                				$scope.cities = resp.data.rows;
	                				$scope.areas = [];
	                			}
	                		})
	                	}
	                })
	                
	                $scope.$watch("stationDatum.cityid", function (newValue, oldValue, scope) {
	                	if(newValue != $scope.stationDatum.City){
	                		$scope.stationDatum.areaid ="";
	                	}
	                	if($scope.stationDatum.cityid!=""&&$scope.stationDatum.cityid!=null){
	                		$timeout(function(){
		                		utils.httpGet("/jsbweb/commonUtils.do?type=district&cityid=" + newValue, function (resp) {
		                    		if(resp.ret == 0){
		                    			$scope.areas = resp.data.rows;
		                    		}
		                	})},10);
	                	}
	                })
			   }
	  })
	}]
)