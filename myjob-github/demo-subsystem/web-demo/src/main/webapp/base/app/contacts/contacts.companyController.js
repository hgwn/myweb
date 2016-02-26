angular.module('masgetWebApp.contacts').controller('companyController',['$scope', '$stateParams', '$state', 'utils','$alert','$http','Upload','$timeout',
    function ($scope, $stateParams, $state, utils,$alert,$http,Upload,$timeout) {
		if($state.broadCast==null||$state.broadCast==""){return;}
		$scope.isCompany = false;
		
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
		
		if($state.broadCast.type=="edit"){
			$scope.type = "edit";
	    	$scope.editCompany = $state.broadCast.item;
	    	$scope.nodeId = $state.broadCast.node;
			if($scope.editCompany.provincename != undefined &&$scope.editCompany.provincename != null){
				$scope.editCompany.pca = $scope.editCompany.provincename
			}
			if($scope.editCompany.cityname != undefined &&$scope.editCompany.cityname != null){
				$scope.editCompany.pca = $scope.editCompany.pca + ' ' + $scope.editCompany.cityname
			}
			if($scope.editCompany.areaname != undefined && $scope.editCompany.areaname != null){
				$scope.editCompany.pca = $scope.editCompany.pca + ' ' + $scope.editCompany.areaname;
			}
	    	if($scope.editCompany.icon){
	    		$scope.file = true;
	    	}else{
	    		$scope.file = false;
	    	}
	
		   	$scope.edit = function(){
				$scope.ddressFlag = true;
				var objAdd = {};
				if($scope.editCompany.addressids !=null && $scope.editCompany.addressids != undefined && $scope.editCompany.addressids != ""){
				var spcaIds = $scope.editCompany.addressids.split("&");
				if(spcaIds.length == 1){
				   	$scope.ddressFlag = false;
				}else{
				 	$scope.editCompany.provinceid = spcaIds[0];
				   	$scope.editCompany.cityid = spcaIds[1];
				}
				if(spcaIds.length == 3){
				   	$scope.editCompany.areaid = spcaIds[2];
				}else{
				   	$scope.editCompany.areaid = 0;
				}
				}
				var data = {};
				data.data = JSON.stringify($scope.editCompany);
				if($scope.ddressFlag){
				$http({
					method : 'POST',
					url : "/jsbweb/base/companyinfo/update.do",
					data:$.param(data),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).success(function(resp) {
					if(resp.ret==0){
						$alert({title: '提示：', content: '修改成功', placement: 'masget-top',duration:1, type: 'info', show: true});
						$scope.nodeId.addressgroupname = $scope.editCompany.companyname;
						$state.go("home.contacts_blank",{path:utils.uuid()});
					}else {
						$alert({title: '提示：', content: '修改失败', placement: 'masget-top',duration:1, type: 'info', show: true});
					}
				});
				}else{
					$scope.ddressFlag = true;
					$alert({title: '提示：', content: '省市不能为空', placement: 'masget-top',duration:1, type: 'info', show: true});
				}
			}
	           
		   	    $scope.checkText();
		}else if($state.broadCast.type=="check"){
			$scope.editCompany = $state.broadCast.item;
			if($scope.editCompany.provincename != undefined &&$scope.editCompany.provincename != null){
				$scope.editCompany.pca = $scope.editCompany.provincename
			}
			if($scope.editCompany.cityname != undefined &&$scope.editCompany.cityname != null){
				$scope.editCompany.pca = $scope.editCompany.pca + ' ' + $scope.editCompany.cityname
			}
			if($scope.editCompany.areaname != undefined && $scope.editCompany.areaname != null){
				$scope.editCompany.pca = $scope.editCompany.pca + ' ' + $scope.editCompany.areaname;
			}
			$scope.type="check";
			$scope.file = true;
			$scope.checkText();
		}
		
		//删除图片
		    $scope.deletePic = function(picIndex){
	   		//删除图片
	   		$scope.editCompany.stafficon = utils.removeFromArrayByKeyValue($scope.editCompany.stafficon,'pictureIndex',picIndex);
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
	                	if(data.ret == 0){
	                		console.log(data);
	                		$scope.editCompany.icon = data.data.file;
	                		console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
	                		$scope.file = true;
	                	}
	                }).error(function(){
	                	console.log("error");
	                });
	            }
	        }
	   };
	   
	   $scope.$on('renderFinished',function(event,data){
	   	if(data.type == "editCompany"){
		   		$scope.$watch('files', function () {
		                $scope.upload($scope.files);
	 	       	});
	 	   	}
	   })
	}]
)