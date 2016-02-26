angular.module('masgetWebApp.companyInfo')
.controller('companyInfoCtr',['$scope', '$stateParams', '$state', 'utils','$alert','$http','Upload','$timeout','$modal','session','i18nService',
    function ($scope, $stateParams, $state, utils,$alert,$http,Upload,$timeout,$modal,session,i18nService) {
		$scope.cominfo=[];
		$scope.isCompany = true;
		//ui-grid 分页汉化
		i18nService.setCurrentLang('zh-cn');
		//查询
		 $scope.cominfo.pageSize = 15;
		 $scope.cominfo.pageNum=1;
	     $scope.check = function(){
	    	 var obj = {}
	    	 if($scope.cominfo.companyname!=null){
	    		 obj.companyname = $scope.cominfo.companyname;
	    	 }
	    	 obj.pagesize = $scope.cominfo.pageSize;
	    	 obj.pagenum = $scope.cominfo.pageNum;
	         var staData = {};
	         staData.data = JSON.stringify(obj);
	         $http({
	             method : 'POST',
	             url : "/jsbweb/base/companyinfo/list.do",
	             data:$.param(staData),
	             headers : {
	                 'Content-Type' : 'application/x-www-form-urlencoded'
	             }
	         }).success(function(resp) {
	        	 if(resp.ret == 0){
					 angular.forEach(resp.data.rows,function(item,key){
						 item.sessionid = session.companyid;
						 item.Alladress = '';
						 if(item.provincename != undefined &&item.provincename != null){
							 item.Alladress = item.provincename;
							 item.pca = item.provincename
						 }
						 if(item.cityname != undefined &&item.cityname != null){
							 item.Alladress += item.cityname;
							 item.pca = item.pca + ' ' + item.cityname
						 }
						 if(item.areaname != undefined && item.areaname != null){
							 item.Alladress += item.areaname
							 item.pca = item.pca + ' ' + item.areaname;
						 }
						 if(item.address != undefined && item.address != null){
							 item.Alladress += item.address;
						 }
					 })
					 $scope.gridOptions.data = resp.data.rows;
					 $scope.gridOptions.totalItems = resp.data.total;
	        	 }
	         })
	     }
	   
	     
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
		
	     $scope.edit = function(item){
	    	 $scope.editCompany = angular.copy(item);
	    	 $scope.editCompany.stafficon = $scope.editCompany.icon;
	    	 if($scope.editCompany.stafficon){
	    		$scope.file = true;
	    	 }else{
	    		$scope.file = false;
	    	 }
	    	 $scope.type = "edit";
	    	 $scope.checkText();
	    	 $modal({html:true,scope:$scope,title:"公司信息",template:'html/companyInfo.modal.tpl.html',contentTemplate:'html/companyInfo.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){
				 	$scope.iconFlag = 'add';
				 	$scope.context = '正在操作中...';
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
								$alert({title: '提示：', content: '修改成功', placement: 'masget-top',duration:2, type: 'info', show: true});
								$scope.check();
							}else {
								$alert({title: '提示：', content: '修改失败', placement: 'masget-top',duration:2, type: 'info', show: true});
							}
							$scope.iconFlag = '';
						});
						return true;
					}else{
						$scope.ddressFlag = true;
						$scope.iconFlag = '';
						$alert({title: '提示：', content: '省市不能为空', placement: 'masget-top',duration:2,type: 'info', show: true});
						return false;
					}
	    	 	 }
	    	 });
	     }

		$scope.gridOptions = {
			//显示table的th
			columnDefs: [
				{ name: '序号',field:'id', width:60,cellTemplate:
					'<div class="ui-grid-cell-contents" style="text-align:center">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
				},
				{name:'操作', field:'', width: 100,pinnedRight:true,
					 cellTemplate: '<div class="ui-grid-cell-contents">' +
					 '<a href="#" ng-show="row.entity.companyid == row.entity.sessionid" ng-click="grid.appScope.edit(row.entity)"><span class="glyphicon glyphicon-pencil blue"></span>编辑</a>' +
					 '<a href="#" ng-if="row.entity.companyid != row.entity.sessionid" ng-click="grid.appScope.checkEdit(row.entity)"><span class="glyphicon glyphicon-check blue"></span>查看</a>' +
					 '</div>'
				},
				{ name: '公司名称',field:'companyname' , width:185},
				{ name: '电话号码',field:'phone' , width:100},
				{ name: '传真号码',field:'faxnumber' , width:130},
				{ name: '公司地址',field:'Alladress',width:300},
				{ name: '备注',field:'introduction',width:300}
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
			$scope.cominfo.pageNum = pagenum
			$scope.cominfo.pageSize = pagesize;
			$scope.check();
		};


	     $scope.checkEdit = function(item){
	    	 $scope.editCompany = $.extend({},item);
	    	 $scope.type = "check";
	    	 $scope.checkText();
	    	 $modal({html:true,scope:$scope,title:"公司信息",template:'html/companyInfo.modal.tpl.html',contentTemplate:'html/companyInfo.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){
	    	 	 }
	    	 });
	     }
	     
		//删除图片
		 $scope.deletePic = function(picIndex){
				//删除图片
				$scope.editCompany.pictUrl = utils.removeFromArrayByKeyValue($scope.editCompany.pictUrl,'pictureIndex',picIndex);
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
							$scope.editCompany.icon = data.data.file;
		                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
		                    $scope.file = true;
		                }).error(function(){
		                	console.log("error");
		                });
		            }
		        }
		 };
		 
		  $scope.check();
}])