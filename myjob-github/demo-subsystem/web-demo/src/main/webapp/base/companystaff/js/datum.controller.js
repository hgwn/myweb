angular.module('masgetWebApp.datum')
.controller('datumCtr',['$scope', '$stateParams', '$state', 'utils','contactsRoletype','$alert','$http','Upload','$timeout','$modal','session','plData','i18nService',
    function ($scope, $stateParams, $state, utils,contactsRoletype,$alert,$http,Upload,$timeout,$modal,session,plData,i18nService) {
		var plDataObj = {
			id: "",
			text: "--请选择--"
		}
		//ui-grid 分页汉化
		i18nService.setCurrentLang('zh-cn');
		$scope.plData = plData;
		$scope.plData.splice(0,0,plDataObj);
		$scope.reData = contactsRoletype;
		$scope.reData.sort(function(a,b){
			return a.roletypeid - b.roletypeid;
		})
		$scope.isContactStaff = false;
		$scope.comStaff=[];
		$scope.stationDataCheck = function(){
			var path = '/jsbweb/base/stationdatum/getCompetenceStation.do?data={}';
	        utils.query(path).then(function (resp) {
	        	if(resp.ret == 0){
	        		$scope.stationData = resp.data.rows;
	        		$scope.check()
	        	}
	        });
		}
		$scope.stationDataCheck();
		
		//查询
		$scope.comStaff.pageSize = 15;
		$scope.comStaff.pageNum =1;
		$scope.check = function(){
			var ordersArray = new Array();
			ordersArray[0] = "staffid";
			var stationid =  $('#comtree').combotree('getValue');
			var obj = {}
			obj.pagesize = $scope.comStaff.pageSize;
			obj.pagenum = $scope.comStaff.pageNum;
			if($scope.comStaff.roletypeid!=null){
				obj.roletypeid = $scope.comStaff.roletypeid;
			}
			if($scope.comStaff.staffname!=null){
				obj.staffname = $scope.comStaff.staffname;
			}
			if(stationid!=null&&stationid!=""){
				obj.stationid = stationid;
			}
			obj.orders = ordersArray;
			obj.orderkey = "asc";
			var staData = {};
			staData.data = JSON.stringify(obj);
			$http({
				method : 'POST',
				url : "/jsbweb/base/companystaff/getcompanystaff.do",
				data:$.param(staData),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(resp) {
				if(resp.ret == 0){
					angular.forEach(resp.data.rows,function(item,key){
						item.seStaffid = session.staffid;
						item.allroletypeid = session.roletypeid;
					})
					$scope.gridOptions.data = resp.data.rows;
					$scope.gridOptions.totalItems = resp.data.total;
				}
			})
		}

		$scope.gridOptions = {
			//显示table的th
			columnDefs: [
				{ name: '序号',field:'id', width:60,enablePinning:false,cellTemplate:
					'<div class="ui-grid-cell-contents" style="text-align:center">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
				},
				{name:'操作', field:'', width: 100,pinnedRight:true,
					cellTemplate: '<div class="ui-grid-cell-contents">' +
					'<span ng-if="row.entity.allroletypeid == 1">' +
					'<a href="#" ng-click="grid.appScope.edit(row.entity)"><span class="glyphicon glyphicon-pencil blue"></span>编辑</a>' +
					'</span>' +
					'<span ng-if="row.entity.allroletypeid != 1">' +
					'<a href="#" ng-click="grid.appScope.edit(row.entity)" ng-if="row.entity.staffid == row.entity.seStaffid "><span class="glyphicon glyphicon-pencil blue"></span>编辑</a>' +
					'<a href="#" ng-click="grid.appScope.checkEdit(row.entity)" ng-if="row.entity.staffid != row.entity.seStaffid "><span class="glyphicon glyphicon-check blue"></span>查看</a>' +
					'</span>' +
					'</div>'
				},
				{ name: '登录名称',field:'loginname' , width:115},
				{ name: '角色类型',field:'roletypename',width:100},
				{ name: '员工名称',field:'staffname' , width:115},
				{ name: '电话号码',field:'mobilephone' , width:100},
				{ name: '公司名称',field:'companyname',width:185},
				{ name: '工作站点',field:'stationname',width:130},
				{ name: '电子邮箱',field:'email' , width:170},
				{ name: '身份证号',field:'identitycard', width:170}
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
			$scope.comStaff.pageNum = pagenum
			$scope.comStaff.pageSize = pagesize;
			$scope.check();
		};
	     
		var addmodal = null;
		$scope.add = function(){
			$scope.stationDataCheck();
			$timeout(function(){
				$scope.typeShow = "edit";
				$scope.button = false;
				$scope.loginname = false;
				$scope.stationmodel = false;
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
					remark:'',
					companyname:session.companyname,
					stationid:''
				};
				$scope.file = false;
				$scope.type = "add";
				addmodal = $modal({html:true,scope:$scope,title:"新增员工信息",template:'html/datum.modal.tpl.html',contentTemplate:'html/staffdatum.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){}
				});
			},10)
		}
	     
		$scope.addstaff = function(){
			$scope.button = true;
			addmodal.$scope.form_staff.submitted = false;
			if(addmodal.$scope.form_staff.$valid){
				$scope.comstaffDatum.workingstationid=$scope.comstaffDatum.stationid;
				$scope.comstaffDatum.loginname=$scope.comstaffDatum.loginname.trim();
				$scope.comstaffDatum.loginpwd=$.md5($scope.comstaffDatum.loginpwd);
				var data = {};
				data.data = JSON.stringify($scope.comstaffDatum);
				$http({
					method : 'POST',
					url : "/jsbweb/base/companystaff/add.do",
					data:$.param(data),
					headers : {
					   'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).success(function(resp) {
					if(resp.ret==0){
					   $alert({title: '提示：', content: '新增成功', placement: 'masget-top',duration:1, type: 'info', show: true});
					   $scope.check();
					   addmodal.$scope.$hide();
					}else{
					   $scope.button = false;
					   $alert({title: '提示：', content: '新增员工信息失败.登录名已存在', placement: 'masget-top',duration:1, type: 'info', show: true});
					}
				});
			}else{
				$scope.button = false;
				addmodal.$scope.form_staff.submitted = true;
				$alert({title: '提示：', content: '请检查输入项', placement: 'masget-top',duration:1,type: 'info', show: true});
			}
		}
	     
		//判断手机号码是否改变
		$scope.changePhone = function(){
			if($scope.comstaffDatum.staffid == session.staffid){
				if($scope.type == "edit"){
					$scope.mobilephone = $scope.comstaffDatum.mobilephone;
					if($scope.mobilephone!=$scope.basicPhone){
						$scope.typeShow = "checkSms";
					}else{
						$scope.typeShow = "edit";
					}
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
	   	    
		var modal = null;
	   	 	
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
							$alert({title: '提示：', content: '发送信息成功', placement: 'masget-top',duration:1,type: 'info', show: true});
						}else if (result.ret == 10 || result.ret == 12) {
							$alert({title: '提示：', content: result.message, placement: 'masget-top',duration:1,type: 'info', show: true});
						}
				   });
			}else{
				$alert({title: '提示：', content: '输入的手机号码格式不对', placement: 'masget-top',duration:1,type: 'info', show: true});
			}
		}
	       	
		//检查验证信息
		$scope.checkSms = function () {
			if($scope.typeShow == "edit"){
				$scope.editStaff();
			}else{
				$scope.button = true;
				modal.$scope.form_staff.submitted = false;
				if(modal.$scope.form_staff.$valid){
					var objAdd = {};
					objAdd.mobilephone=$scope.comstaffDatum.mobilephone;
					objAdd.verificationCode=$scope.comstaffDatum.validationnum;

					var Smsdata = {};
					Smsdata.data = JSON.stringify(objAdd);
					$http({
						method : "POST",
						url : "/jsbweb/base/verification.do",
						data :$.param(Smsdata),
						headers : {
							'Content-Type' : 'application/x-www-form-urlencoded'
						}
					}).success(function(result) {
						$scope.button = false;
						if (result.ret == 14 ) {
							$alert({title: '提示：', content: result.message, placement: 'masget-top',duration:1,type: 'info', show: true});
						} else if (result.ret == 15 ) {
							$alert({title: '提示：', content: result.message, placement: 'masget-top',duration:1,type: 'info', show: true});
						}else{
							$scope.editStaff();
						}
					});
				}else{
					$scope.button = false;
					modal.$scope.form_staff.submitted = true;
					$alert({title: '提示：', content: '请检查输入项', placement: 'masget-top',duration:1,type: 'info', show: true});
				}
			}
		}
		
		$scope.edit = function(item){
	    	 $scope.typeShow = "edit";
	    	 $scope.stationDataCheck();
	    	 $scope.comstaffDatum = angular.copy(item);
	    	 if($scope.comstaffDatum.stafficon){
	    		$scope.file = true;
	    	 }else{
	    		$scope.file = false;
	    	 }
	    	 $scope.loginname = true;
	    	 $scope.stationmodel = true;
	    	 $scope.roletypemodel = true;
	    	 $scope.button = false;
	    	 $scope.type = "edit";
	    	 $scope.roletype=contactsRoletype;
	    	 $scope.basicPhone = item.mobilephone;
	    	 modal = $modal({html:true,scope:$scope,title:"员工信息",template:'html/datum.modal.tpl.html',contentTemplate:'html/staffdatum.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){
	    	 	 }
	    	 });
		}
	     
		$scope.editStaff = function(){
			$scope.button = true;
			modal.$scope.form_staff.submitted = false;
			if(modal.$scope.form_staff.$valid){
				$scope.comstaffDatum.rstaffid = $scope.comstaffDatum.staffid;
				var data = {};
				data.data = JSON.stringify($scope.comstaffDatum);
				$http({
					 method : 'POST',
					 url : "/jsbweb/base/companystaff/update.do",
					 data:$.param(data),
					 headers : {
						 'Content-Type' : 'application/x-www-form-urlencoded'
					 }
				}).success(function(resp) {
					 $scope.button = false;
					 if(resp.ret==0){
						 $alert({title: '提示：', content: '修改成功', placement: 'masget-top',duration:2,type: 'info', show: true});
						 modal.$scope.$hide();
						 $scope.typeShow = "edit";
						 $scope.check();
					 }else{
						 $alert({title: '提示：', content: resp.message, placement: 'masget-top',duration:2,type: 'info', show: true});
					 }
				});
			}else{
				$scope.button = false;
				modal.$scope.form_staff.submitted = true;
				$alert({title: '提示：', content: '请检查输入项', placement: 'masget-top',duration:1,type: 'info', show: true});
			}
		}
	     
		$scope.checkEdit = function(item){
	    	 $scope.stationDataCheck();
	    	 $scope.typeShow = "edit";
	    	 $scope.comstaffDatum = angular.copy(item);
	    	 if($scope.comstaffDatum.stafficon){
	    		$scope.file = true;
	    	 }else{
	    		$scope.file = false;
	    	 }
	    	 $scope.loginname = true;
	    	 $scope.stationmodel = true;
	    	 $scope.roletypemodel = true;
	    	 $scope.type = "edit";
	    	 $scope.roletype=contactsRoletype;
	    	 $modal({html:true,scope:$scope,title:"员工信息",template:'html/datum.modal.tpl.html',contentTemplate:'html/staffdatum.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){
	    	 	 }
	    	 });
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
		
}])