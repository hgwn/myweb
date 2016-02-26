angular.module('masgetWebApp.datum')
.controller('datumCtr',['$scope', '$state', 'utils','$modal','$alert','ngTreetableParams','$http','stationtype','$timeout','companyData','Session',
    function ($scope, $state, utils,$modal,$alert,ngTreetableParams,$http,stationtype,$timeout,companyData,Session) {
		var sessionid = Session.companyid;
	    var sessionStationid = Session.stationid;
	    $scope.station ={};
	    
	    
	 	var data = [];
	 	$scope.companyData = companyData;
	 	
	 	$scope.expanded_params = new ngTreetableParams({
	 		getNodes: function(parent) {
	 			return parent ? parent.children : data;
	 		},
	 		getTemplate: function(node) {
	 			return 'tree_node';
	 		},
	 		options: {
	 			initialState: 'expanded'
	 		}
	 	});

		////查询
		//$scope.checklist = function(){
		//	var obj = {}
		//	if($scope.station.companyid!=null&&$scope.station.companyid!=""){
		//		obj.companyid = $scope.station.companyid;
		//	}
		//	if($scope.station.stationname!=null&&$scope.station.stationname!=""){
		//		obj.stationname = $scope.station.stationname;
		//	}
		//	var staData = {};
		//	staData.data = JSON.stringify(obj);
		//	$http({
		//		method : 'POST',
		//		url : "/jsbweb/base/stationdatum/getlist.do",
		//		data:$.param(staData),
		//		headers : {
		//			'Content-Type' : 'application/x-www-form-urlencoded'
		//		}
		//	}).success(function(resp) {
		//		$scope.asdasd = utils.signDataToAdd(resp.data.rows, "stationid", "pstationid", 0, 0);
		//		for(var i = 0 ; i <$scope.asdasd.length; i++){
		//			$scope.asdasd[i].$$treeLevel  = $scope.asdasd[i].treelevel;
		//			if($scope.asdasd[i].areaname != undefined){
		//				$scope.asdasd[i].alladdress = $scope.asdasd[i].provincename + $scope.asdasd[i].cityname + $scope.asdasd[i].areaname + $scope.asdasd[i].address;
		//			}else{
		//				$scope.asdasd[i].alladdress = $scope.asdasd[i].provincename + $scope.asdasd[i].cityname + $scope.asdasd[i].address;
		//			}
		//			$scope.asdasd[i].sessionid = sessionid;
		//			$scope.asdasd[i].sessionStationid = sessionStationid;
		//		}
		//		$scope.asdasd.sort(function(a,b){
		//			return a.treelevel - b.treelevel;
		//		})
		//		$scope.gridOptions.data = $scope.asdasd;
		//		$scope.gridOptions.totalItems = resp.data.total;
		//	})
		//}
		////$scope.checklist();
        //
		//$scope.gridOptions = {
		//	//显示table的th
		//	columnDefs: [
		//		{ name: '序号',field:'id', width:60,cellTemplate:
		//			'<div class="ui-grid-cell-contents" style="text-align:center">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
		//		},
		//		{name:'操作', field:'', width: 120,
		//			cellTemplate: '<div class="ui-grid-cell-contents">' +
		//			'<span ng-if="row.entity.companyid == row.entity.sessionid">' +
		//			'<a href=""  class="link_edit" ng-click="grid.appScope.edit(row.entity)"><span class="glyphicon glyphicon-pencil blue"></span>编辑</a>&nbsp;&nbsp;' +
		//			'<a href="" class="link_delete" ng-click="grid.appScope.staffCheck(row.entity)" ng-if="row.entity.sessionStationid != row.entity.stationid"><span class="glyphicon glyphicon-trash blue"></span>删除</a>' +
		//			'</span>' +
		//			'<span ng-if="row.entity.companyid != row.entity.sessionid">' +
		//			'<a href="" class="link_edit" ng-click="grid.appScope.checkData(row.entity)"><span class="glyphicon glyphicon-check blue"></span>查看</a>' +
		//			'</span>' +
		//			'</div>'
		//		},
		//		{ name: '站点名称',field:'stationname',width:170 },
		//		{ name: '公司名称',field:'companyname'},
		//		{ name: '站点简写',field:'stationcode',width:100 },
		//		{ name: '站点类型',field:'stationtypename'},
		//		{ name: '站点地址',field:'alladdress'}
		//	],
		//	paginationPageSizes: [5, 10, 15,20,25,50,100],
		//	paginationPageSize: 15,
		//	useExternalPagination: true,
		//	enableGridMenu: true,
		//	enableColumnMenus: false,
		//	enableSorting: true,
		//	selectionRowHeaderWidth: 35,
		//	showTreeExpandNoChildren: true,
		//	onRegisterApi: function(gridApi){
		//		$scope.gridApi = gridApi;
		//		//$scope.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
		//		//	if($scope.getPage) {
		//		//		$scope.getPage(newPage, pageSize);
		//		//	}
		//		//});
		//	}
		//};
	
	
	     //查询
	     $scope.check = function(){
	    	 var obj = {}
	    	 if($scope.station.companyid!=null&&$scope.station.companyid!=""){
	    		 obj.companyid = $scope.station.companyid;
	    	 }
	    	 if($scope.station.stationname!=null&&$scope.station.stationname!=""){
	    		 obj.stationname = $scope.station.stationname;
	    	 }
	         var staData = {};
	         staData.data = JSON.stringify(obj);
	         $http({
	             method : 'POST',
	             url : "/jsbweb/base/stationdatum/list.do",
	             data:$.param(staData),
	             headers : {
	                 'Content-Type' : 'application/x-www-form-urlencoded'
	             }
	         }).success(function(resp) {
        		 $scope.sessionData = utils.addSession(resp,"children",0,sessionid);
        		 data = utils.addStation($scope.sessionData,"children",0,sessionStationid);
	        	 //调用angular treetable插件
	        	 $scope.expanded_params.refresh();
	        	 $alert({title: '提示：', content: '查询成功', placement: 'masget-top',duration:2, type: 'info', show: true});
	         })
	     }
	     
	    $scope.add = function(){
	    	$scope.checkPCA = true;
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
    	 	$scope.button = false;
	    	$scope.stationDatum={
	    			stationtypeid:'',
	    			stationname:'',
	    			stationcode:'',
	    			shortening:'',
	    			longitude:'',
	    			latitude:'',
	    			address:'',
	    			selectedProvince:'',
	    			selectedCity:'',
	    			selectedArea:''
	    	};
	    	$scope.stationDatum.companyid = sessionid;
	    	$scope.stationDatum.companyname = Session.companyname;
	    	//默认经纬度
		    $scope.stationDatum.longitude=0.01
		    $scope.stationDatum.latitude=0.01
	    	
	        $scope.stationtype = utils.removeFromArrayByKeyValue(stationtype,"stationtypeid",1);
	     	
	        $modal({html:true,scope:$scope,title:"新增站点信息",template:'app/datum/datum.modal.tpl.html',contentTemplate:'app/datum/datum.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){
	        	c.form_station.submitted = false;
	        	$scope.button = true;
	        	var pstationid = $('#comtree').combotree('getValue');
	        	if(c.form_station.$valid){
					$scope.iconFlag = 'add';
					$scope.context = '正在操作中...';
					 var objAdd = {};
					 if(pstationid!=null&&pstationid!=""){
						 objAdd.pstationid=pstationid;
					 }else{
						 objAdd.pstationid=0;
					 }
					 objAdd.stationtypeid=$scope.stationDatum.stationtypeid;
					 objAdd.stationname=$scope.stationDatum.text;
					 if($scope.stationDatum.stationcode!=null&&$scope.stationDatum.stationcode!=""){
						 objAdd.stationcode=$scope.stationDatum.stationcode;
					 }
					 if($scope.stationDatum.shortening!=null&&$scope.stationDatum.shortening!=""){
						 objAdd.shortening=$scope.stationDatum.shortening;
					 }
					if($scope.stationDatum.addressids !=null && $scope.stationDatum.addressids != undefined && $scope.stationDatum.addressids != ""){
						var spcaIds = $scope.stationDatum.addressids.split("&");
						if(spcaIds.length == 1){
							$scope.checkPCA = false;
						}else{
							objAdd.provinceid = spcaIds[0];
							objAdd.cityid = spcaIds[1];
						}
						if(spcaIds.length == 3){
							objAdd.areaid = spcaIds[2];
						}else{
							objAdd.areaid = 0;
						}
					}
					 if($scope.stationDatum.longitude!=null&&$scope.stationDatum.longitude!=""&&$scope.stationDatum.longitude!=undefined){
						 objAdd.longitude=$scope.stationDatum.longitude;
					 }else{
						 objAdd.longitude = 0;
					 }
					 if($scope.stationDatum.latitude!=null&&$scope.stationDatum.latitude!=""&&$scope.stationDatum.latitude!=undefined){
						 objAdd.latitude=$scope.stationDatum.latitude;
					 }else{
						 objAdd.latitude = 0;
					 }
					 objAdd.address=$scope.stationDatum.address;
						
					var data = {};
					data.data = JSON.stringify(objAdd);
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
			            		$alert({title: '提示：', content: '新增成功', placement: 'masget-top',duration:1, type: 'info', show: true});
			            		$scope.check();
			            	}else{
			            		$alert({title: '提示：', content: '新增失败', placement: 'masget-top',duration:1, type: 'info', show: true});
			            	}
							$scope.iconFlag = '';
			            });
			            return true;
					}else{
						 $scope.button = false;
						 $scope.checkPCA = true;
						 $scope.iconFlag = '';
	       				 $alert({title: '提示：', content: '省市不能为空', placement: 'masget-top',duration:2,type: 'info', show: true});
	       				 return false;
					}
	    		}else{
	    			$scope.button = false;
	    			c.form_station.submitted = true;
	    			 $alert({title: '提示：', content: '请重新检查输入项', placement: 'masget-top',duration:1,type: 'info', show: true});
	    			 return false;
	        	 }
	        }});
	    }
	
	     $scope.edit = function(item){
	    	 $scope.select = true;
	    	 $scope.stationname = false;
    	 	 $scope.stationcode = false;
    	 	 $scope.shortening = false;
    	 	 $scope.comtree = false;
    	 	 $scope.longitude = false;
    	 	 $scope.latitude = false;
    	 	 $scope.selectedProvince = false;
    	 	 $scope.selectedCity = false;
    	 	 $scope.selectedArea = false;
    	 	 $scope.address = false;
    	 	 $scope.button = false;
	        //$state.go("edit");
	    	 $scope.stationtype = stationtype;
			 if(item.provincename != undefined &&item.provincename != null){
				 item.pca = item.provincename;
				 item.addressids = item.provinceid;
			 }
			 if(item.cityname != undefined &&item.cityname != null){
				 item.pca = item.pca + ' ' + item.cityname
				 item.addressids = item.addressids + '&' + item.cityid;
			 }
			 if(item.areaname != undefined && item.areaname != null){
				 item.pca = item.pca + ' ' + item.areaname;
				 item.addressids = item.addressids + '&' + item.areaid;
			 }
	         $scope.stationDatum = angular.copy(item);
	         $scope.checkPCA = true;
	         $state.broadCast={detail:item};
	         $modal({html:true,scope:$scope,title:"修改站点信息",template:'app/datum/datum.modal.tpl.html',contentTemplate:'app/datum/datum.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){
	        	 var pstationid = $('#comtree').combotree('getValue');
	        	 c.form_station.submitted = false;
	        	 $scope.button = true;
	        	 if(c.form_station.$valid){
					 $scope.iconFlag = 'add';
					 $scope.context = '正在操作中...';
	        		 if(pstationid!=$scope.stationDatum.id){
	        			 var objAdd = {};
	        			 objAdd.mstationid=$scope.stationDatum.id;
	        			 if(pstationid!=null&&pstationid!=""){
	        				 objAdd.pstationid=pstationid;
	        			 }else{
	        				 objAdd.pstationid=0;
	        			 }
	        			 objAdd.stationtypeid=$scope.stationDatum.stationtypeid;
	        			 objAdd.stationname=$scope.stationDatum.text;
	        			 objAdd.stationcode=$scope.stationDatum.stationcode;
	        			 objAdd.shortening=$scope.stationDatum.shortening;
						 if($scope.stationDatum.addressids !=null && $scope.stationDatum.addressids != undefined && $scope.stationDatum.addressids != ""){
							 var spcaIds = $scope.stationDatum.addressids.split("&");
							 if(spcaIds.length == 1){
								 $scope.checkPCA = false;
							 }else{
								 objAdd.provinceid = spcaIds[0];
								 objAdd.cityid = spcaIds[1];
							 }
							 if(spcaIds.length == 3){
								 objAdd.areaid = spcaIds[2];
							 }else{
								 objAdd.areaid = 0;
							 }
						 }
	        			 if($scope.stationDatum.longitude!=null&&$scope.stationDatum.longitude!=""&&$scope.stationDatum.longitude!=undefined){
							 objAdd.longitude=$scope.stationDatum.longitude;
						 }else{
							 objAdd.longitude = 0;
						 }
						 if($scope.stationDatum.latitude!=null&&$scope.stationDatum.latitude!=""&&$scope.stationDatum.latitude!=undefined){
							 objAdd.latitude=$scope.stationDatum.latitude;
						 }else{
							 objAdd.latitude = 0;
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
	        						 $scope.check();
	        					 }else{
	        						 $alert({title: '提示：', content: '修改失败', placement: 'masget-top',duration:2,type: 'info', show: true});
	        					 }
								 $scope.iconFlag = '';
	        				 });
	        				 return true;
	        			 }else{
	        				 $scope.button = false;
	        				 $scope.checkPCA = true;
							 $scope.iconFlag = '';
	        				 $alert({title: '提示：', content: '省市不能为空', placement: 'masget-top',duration:2,type: 'info', show: true});
	        				 return false;
	        			 }
	        		 }else{
	        			 $scope.button = false;
						 $scope.iconFlag = '';
	        			 $alert({title: '提示：', content: '父站点不能是当前站点', placement: 'masget-top',duration:2,type: 'info', show: true});
		        		 return false;
	        		 }
	        	 }else{
	        		 $scope.button = false;
	        		 c.form_station.submitted = true;
	        		 $alert({title: '提示：', content: '请检查输入项', placement: 'masget-top',duration:2,type: 'info', show: true});
	        		 return false;
	        	 }
	         }});
	    }
	     
	     $scope.checkData = function(item){
    	 	    $scope.stationname = true;
	    	 	$scope.stationcode = true;
	    	 	$scope.shortening = true;
	    	 	$scope.select = true;
	    	 	$scope.comtree = true;
	    	 	$scope.longitude = true;
	    	 	$scope.latitude = true;
	    	 	$scope.selectedProvince = true;
	    	 	$scope.selectedCity = true;
	    	 	$scope.selectedArea = true;
	    	 	$scope.address = true;
	    	 	$scope.button = true;
	    	 	
		        //$state.broadCast ={item:item};
		        //$state.go("edit");
		    	 $scope.stationtype = stationtype;
		         $scope.stationDatum = $.extend({},item);
		         $scope.stationDatum.selectedProvince = $scope.stationDatum.provinceid;
		         $scope.stationDatum.selectedCity = $scope.stationDatum.cityid;
		         $scope.stationDatum.selectedArea = $scope.stationDatum.areaid;
		         $state.broadCast={detail:item};
		         $modal({html:true,scope:$scope,title:"站点信息",template:'app/datum/datum.modal.tpl.html',contentTemplate:'app/datum/datum.edit.html',animation:'am-fade-and-scale',callback:function(){
		        	 $scope.check();
		         }});
	     }
	     
	     $scope.deleteDatum =  function(item){
	    	 $scope.stationid = item.id;
	    	 if($scope.stationStaff.length == 0){
	    		 $modal({title: "提示", content: "确认要删除站点为"+item.text+"?",template:'modal/modal.confirm.tpl.html',animation:'am-fade-and-scale',callback: function(){
	    			 $http({
	    				 method : 'POST',
	    				 url : "/jsbweb/base/stationdatum/delete.do",
	    				 data:"mstationid="+$scope.stationid,
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
	    		 })
	    	 }else{
	    		 $alert({title: '提示：', content: '该站点下有员工，不能删除', placement: 'masget-top',duration:2,type: 'info', show: true});
	    	 }
		 }
	     
	     //查询删除该站点点的员工
	     $scope.staffCheck = function(item){
	    	 var obj = {};
	    	 obj.pagesize = 10;
	    	 obj.pagenum = 1;
	    	 obj.stationid=item.id;
			 var data = {};
			 data.data = JSON.stringify(obj);
	    	 $http({
	             method : 'POST',
	             url : "/jsbweb/base/companystaff/getcompanystaff.do",
	             data:$.param(data),
	             headers : {
	                 'Content-Type' : 'application/x-www-form-urlencoded'
	             }
	         }).success(function(resp) {
	        	 if(resp.ret == 0){
	        		 $scope.stationStaff = resp.data.rows;
	        		 $scope.deleteDatum(item);
	        	 }
	         })
	     }
	    
	     $scope.check();
	}
])