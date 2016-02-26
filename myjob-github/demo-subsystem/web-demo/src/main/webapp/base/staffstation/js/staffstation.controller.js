
staffstationModule.controller("staffstationController",
		['$scope','$http',"$stateParams","$state","$window","$timeout","$rootScope",function($scope, $http,$stateParams,$state,$window,$timeout,$rootScope) {
	
	var zNodes =[
		{ id:1, pId:0, name:"广东"},
		{ id:2, pId:1, name:"广州"},
		{ id:3, pId:2, name:"天河"},
		{ id:101, pId:2, name:"越秀"},
		{ id:4, pId:1, name:"深圳"},
		{ id:5, pId:4, name:"福田"},
		{ id:6, pId:0, name:"北京"},
		{ id:7, pId:6, name:"朝阳区"},
		{ id:8, pId:0, name:"上海"},
		{ id:9, pId:8, name:"浦东"},
		{ id:10, pId:8, name:"虹口"}
	];
			
	$scope.formData={};
	$scope.queryFormData={};
	$scope.queryRecvcompanyFormData={};
	//定义员工信息对象
	$scope.recvcompanys=new Array();
	
	$scope.leftNodes=new Array();
	$scope.rightNodes=new Array();
	$scope.parentNodes=new Array();
	$scope.childNodes=new Array();
	var setting = {
		data: {
			simpleData: {
				enable: true
			}
		},
		view:{
			selectedMulti: true
		},
		/*check: {
			enable: true,
			chkDisabledInherit: true,
			chkboxType:{"Y":"p", "N":"s"}
		}*/
		callback:{
			onDblClick: function(event, treeId, treeNode) {
				//获取所有父节点，先将parentNodes置空；添加某个站点，所有父站点也要添加，所以要获取父节点
				$scope.parentNodes=new Array();
				$scope.getAllParents(treeNode);
				
				deleteLeft();
		        
		        $scope.createLeftTree();
		        $scope.createRightTree();
			}
		}
	};
	
	var setting2 = {
		data: {
			simpleData: {
				enable: true
			}
		},
		view:{
			selectedMulti: true
		},
		/*check: {
			enable: true,
			chkDisabledInherit: true,
			chkboxType:{"Y":"s", "N":"p"}
		}*/
		callback:{
			onDblClick: function(event, treeId, treeNode) {
				//获取所有子节点，先将childNodes置空；删除某个站点，所有子站点也要删除，所以要获取所有子节点
				$scope.childNodes=new Array();
				//先将选中节点放置childNodes，再将子节点放入
				$scope.childNodes.push({
					id:treeNode.id,
					pId:treeNode.parentid,
					name:treeNode.name,
					parentid:treeNode.parentid,
					staffstationsid:treeNode.staffstationsid
				});
				//获取子节点
				$scope.getAllChilds(treeNode);
				
				//var righttree = $.fn.zTree.getZTreeObj("hasStationTree"); 
				//删除选择节点，及所有子节点
				//righttree.removeNode(treeNode);
		       // $scope.leftNodes.push(treeNode);
		        //获取树的json字符串对象
		       /* var nodes=righttree.getNodes();
		        var simpleNodes = righttree.transformToArray(nodes);
		        console.log(simpleNodes);
		        $scope.rightNodes=simpleNodes;*/
				
				deleteRight();
		        $scope.createLeftTree();
		        $scope.createRightTree();
			}
		}
	};
	
	//删除左边节点，更新左右树json对象
	function deleteLeft(){
		for(var j=0;j<$scope.parentNodes.length;j++){
			var isexist=false;
			for(var i=0;i<$scope.leftNodes.length;i++){
				if($scope.leftNodes[i].id==$scope.parentNodes[j].id){
					//右边树添加节点
					$scope.rightNodes.push({
		        		id:$scope.parentNodes[j].id,
						pId:$scope.parentNodes[j].parentid,
						name:$scope.parentNodes[j].name,
						parentid:$scope.parentNodes[j].parentid,
						staffstationsid:$scope.parentNodes[j].staffstationsid
	        		});
					//左边树删除节点
					$scope.leftNodes.splice(i,1);
					$scope.parentNodes.splice(j,1);
					isexist=true;
					break;
				}
			}
			if(!isexist){//如果节点不在左边树中，则删除这个节点
				$scope.parentNodes.splice(j,1);
			}
			break;
		}
		if($scope.parentNodes.length>0){
			deleteLeft();
		}
		return;
	}
	//删除右边边节点，更新左右树json对象
	function deleteRight(){
		for(var j=0;j<$scope.childNodes.length;j++){
			var isexist=false;
			for(var i=0;i<$scope.rightNodes.length;i++){
				if($scope.rightNodes[i].id==$scope.childNodes[j].id){
					//左边树添加节点
					$scope.leftNodes.push({
		        		id:$scope.childNodes[j].id,
						pId:$scope.childNodes[j].parentid,
						name:$scope.childNodes[j].name,
						parentid:$scope.childNodes[j].parentid,
						staffstationsid:$scope.childNodes[j].staffstationsid,
						loginstationflag:$scope.childNodes[j].loginstationflag

	        		});
					
					$scope.rightNodes.splice(i,1);
					$scope.childNodes.splice(j,1);
					isexist=true;
					break;
				}
			}
			if(!isexist){//如果节点不在右边树中，则删除这个节点
				$scope.childNodes.splice(j,1);
			}
			break;
		}
		if($scope.childNodes.length>0){
			deleteRight();
		}
		return;
	}
	
	//点击向右按钮
	$scope.clickRight=function(){
		$scope.formData.isCommitted=true;
		if($scope.formData.staffid==null||$scope.formData.staffid==""){
			$scope.consignnoteForm.recvcompany.$invalid=true;
		}
		if($scope.consignnoteForm.$valid==false){
			$.jBox.tip("请检查输入", 'waring');
			return;
		}
        var treeObj = $.fn.zTree.getZTreeObj("stationTree"); 
        var nodes=treeObj.getSelectedNodes();
        angular.forEach(nodes, function(treeNode){
	        console.log(treeNode);
	        $scope.parentNodes=new Array();
			$scope.getAllParents(treeNode);
			
			deleteLeft();
        });
        $scope.createLeftTree();
        $scope.createRightTree();
	}
	//点击向左按钮
	$scope.clickLeft=function(){
		$scope.formData.isCommitted=true;
		if($scope.formData.staffid==null||$scope.formData.staffid==""){
			$scope.consignnoteForm.recvcompany.$invalid=true;
		}
		if($scope.consignnoteForm.$valid==false){
			$.jBox.tip("请检查输入", 'waring');
			return;
		}

		var treeObj = $.fn.zTree.getZTreeObj("hasStationTree");
        var nodes=treeObj.getSelectedNodes();
		$scope.Flag = true;
        angular.forEach(nodes, function(treeNode){
			angular.forEach($scope.pData,function(item){
				if(item.stationname == treeNode.name &&item.stationid == treeNode.id ){
					$.jBox.tip("删除站点含有为该员工的登录站点，不能删除", 'waring');
					$scope.Flag = false;
				}
			})
			if(!$scope.Flag){
				return;
			}
        	$scope.childNodes=new Array();
    		//先将选中节点放置childNodes，再将子节点放入
    		$scope.childNodes.push({
    			id:treeNode.id,
    			pId:treeNode.parentid,
    			name:treeNode.name,
    			parentid:treeNode.parentid,
    			staffstationsid:treeNode.staffstationsid,
				loginstationflag:treeNode.loginstationflag
    		});
    		//获取子节点
    		$scope.getAllChilds(treeNode);
    		
    		deleteRight();
		});
        $scope.createLeftTree();
        $scope.createRightTree();
		
	}

	//定义初始化页面数据方法
	var initData=function(){
		
		//获取当前登录公司信息
		$http({
			method : 'POST',
			url : "/jsbweb/logistic/stdConsignnote/getLoginCompanyMsg.do"
		}).success(function(data) {
			$scope.curCompanyMsg=data;
			$scope.formData.curstationid=$scope.curCompanyMsg!=null?$scope.curCompanyMsg.stationid:0;
			$scope.formData.curstationname=$scope.curCompanyMsg!=null?$scope.curCompanyMsg.stationname:"";

		});
		
		//获取登录公司站点信息
		$http({
			method : 'POST',
			url : "/jsbweb/base/staffstation/list.do"
		}).success(function(data) {
			if(data.data!=null){
				var nodestmp=new Array();
				angular.forEach(data.data.rows, function(station){
					nodestmp.push({
						id:station.stationid,
						pId:station.pstationid,
						name:station.stationname,
						parentid:station.pstationid
					});
				});
				$scope.leftNodes=nodestmp;
				$.fn.zTree.init($("#stationTree"), setting, nodestmp);
		        var treeObj = $.fn.zTree.getZTreeObj("stationTree"); 
		        treeObj.expandAll(true); 
			}
		});
		
	};
	
	//初始化页面数据
	initData();
	
	
	//查询站点信息
	$scope.getstation=function(staffid){
		$http({
			method : 'POST',
			url : "/jsbweb/base/staffstation/getstation.do",
			data:"workingstaffid="+staffid,
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data) {
			$scope.leftNodes=new Array();
			angular.forEach(data.data.rows, function(station){
				$scope.leftNodes.push({
					id:station.stationid,
					pId:station.pstationid,
					name:station.stationname,
					parentid:station.pstationid
				});
			});
			$scope.createLeftTree();
		});
	};
	
	//查询员工已经拥有的站点信息
	$scope.getHasStation=function(staffid,companyid){
		$scope.haData = {
			staffid:staffid,
			companyid:companyid
		}
		$http({
			method : 'POST',
			url : "/jsbweb/base/staffstation/getHasStation.do",
			data:"workingstaffid="+staffid+"&staffcompanyid="+companyid,
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data) {
			$scope.rightNodes=new Array();
			$scope.pData = [];
			angular.forEach(data.data.rows, function(station){
				$scope.rightNodes.push({
					id:station.stationid,
					pId:station.pstationid,
					name:station.stationname,
					parentid:station.pstationid,
					staffstationsid:station.staffstationsid,
					loginstationflag:station.loginstationflag
				});
				if(station.loginstationflag == 1){
					$scope.pData.push(station);
				}
			});
			$scope.createRightTree();
		});
	};
	
	//查询员工信息
	$scope.queryRecvcompany=function(){
		if(angular.isUndefined($scope.queryFormData.recvcompanyKeyword)){
			$scope.queryFormData.recvcompanyKeyword="";
		}
		$scope.queryRecvcompanyFormData.condition=$scope.queryFormData.recvcompanyKeyword;
		$http({
			method : 'POST',
			url : "/jsbweb/base/staffstation/getstaff.do",
			data:$.param($scope.queryRecvcompanyFormData),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data) {
			$scope.recvcompanys=data;
		});
	};
	//检测员工改变时触发
	$scope.$watch("formData.recvcompany",function(newVal){
		
		if(angular.isUndefined(newVal)) return;
		$scope.formData.staffid=newVal.staffid;
		$scope.formData.recvcompanyid=newVal.companyid;
		$scope.formData.companyname=newVal.companyname;
		$scope.formData.recvstationid=newVal.stationid;
		$scope.formData.recvlinkername=newVal.staffname;
		$scope.formData.stationname=newVal.stationname;
		$scope.formData.recvlinkerphone=newVal.mobilephone;
		
		$scope.getstation(newVal.staffid);
		$scope.getHasStation(newVal.staffid,newVal.companyid);
	});
	
	//当收货人输入文本改变时触发的方法（用到的是keyup）
	$scope.resetActionWithRecvcompany=function(){
		$scope.formData.recvcompanyid=0;
		$scope.formData.recvstationid=0;
		$scope.formData.staffid="";
		$scope.formData.recvlinkername=$scope.queryFormData.recvcompanyKeyword;
	}
	
	
	//分配站点
	$scope.assignStation=function(){
		$scope.formData.isCommitted=true;
		if($scope.formData.staffid==null||$scope.formData.staffid==""){
			$scope.consignnoteForm.recvcompany.$invalid=true;
		}
		if($scope.consignnoteForm.$valid==false){
			$.jBox.tip("请检查输入", 'waring');
			return;
		}
		console.log($scope.leftNodes);
		console.log($scope.rightNodes);
		//新增的站点，如果右边树节点staffstationsid是空的，则表示是新增的，staffstationsid-员工站点表的id
		var staffstations=new Array();
		angular.forEach($scope.rightNodes, function(node){
			if(node.staffstationsid==null){
				var obj=new Object();
				obj.workingcompanyid=$scope.formData.recvcompanyid;
				obj.workingstaffid=$scope.formData.staffid;
				obj.workingstationid=node.id;
				obj.deflogin=1;
				staffstations.push(obj);
			}
		});
		
		//取消的站点，如果左边树节点staffstationsid是不为空，则表示是删除的，staffstationsid-员工站点表的id
		var cancelstations=new Array();
		angular.forEach($scope.leftNodes, function(node){
			if(node.staffstationsid!=null){
				var obj=new Object();
				obj.staffstationsid=node.staffstationsid;
				obj.stationid = node.id;
				obj.loginstationflag = node.loginstationflag;
				cancelstations.push(obj);
			}
		});
		
		//如果新增和删除的都是空的，则未做任何变动
		if(staffstations.length==0&&cancelstations.length==0){
			$.jBox.tip("未做任何修改", 'warning');
			return;
		}
		
		var submit = function (v, h, f) {
			if (v == 'ok') {
				
				$.jBox.tip("正在保存员工工作站点...", 'loading');
				
				$http({
					method : 'POST',
					url : "/jsbweb/base/staffstation/add.do",
					data : "staffstations="+angular.toJson(staffstations)+"&cancelstations="+angular.toJson(cancelstations),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).success(function(data) {
					if(data.ret==0){
						$scope.isCreateOrderDisabled=true;
						$.jBox.messager("员工工作站点配置成功", "温馨提示", null, { width: 350, height:100});
						$.jBox.closeTip();
						$timeout(function(){
							$window.location.reload();
						},1500);
					}
					else if(data.ret==12){
						$.jBox.messager(data.message, "温馨提示", null, { width: 350, height:100});
						$.jBox.closeTip();
					}
					else if(data.ret==10){
						$.jBox.tip("请先登录", 'warning');
					}else if(data.ret==1){
						$.jBox.messager(data.message, "温馨提示", null, { width: 350, height:100});
						$.jBox.closeTip();
						$scope.getHasStation($scope.haData.staffid,$scope.haData.companyid);
					}else{
						$.jBox.tip("员工工作站点配置失败", 'warning');
					}
				}).error(function(data){
					$.jBox.messager(data.message, "温馨提示", null, { width: 350, height:100});
					$.jBox.closeTip();
				});
            }
            return true; //close
        };
        $.jBox.confirm("您确定要保存吗？", "温馨提示", submit);
	};
	
	//清空-->暂时为重新刷新页面
	$scope.clear=function(){
		$window.location.reload();
	};
	
	//获取所有父节点，包括自身节点
	$scope.getAllParents=function(treeNode){
		if(treeNode==null){
			return;
		}
		$scope.parentNodes.push({
			id:treeNode.id,
			pId:treeNode.parentid,
			name:treeNode.name,
			parentid:treeNode.parentid,
			staffstationsid:treeNode.staffstationsid
		});
		if (treeNode.pId=="0"||treeNode.getParentNode()==null) {
			return ;
		}else{
			$scope.getAllParents(treeNode.getParentNode());
		}
	}
	//获取所有子节点，包括自身节点
	$scope.getAllChilds=function(treeNode){
		if(treeNode==null){
			return;
		}
        var childrenNodes = treeNode.children;
        if (childrenNodes) {
            for (var i = 0; i < childrenNodes.length; i++) {
				$scope.childNodes.push({
					id:childrenNodes[i].id,
					pId:childrenNodes[i].parentid,
					name:childrenNodes[i].name,
					parentid:childrenNodes[i].parentid,
					staffstationsid:childrenNodes[i].staffstationsid
				});
				if (childrenNodes[i].isParent) {
               		$scope.getAllChilds(childrenNodes[i]);
            	}
        	}
    	}
	}
	//创建可分配站点树
	$scope.createLeftTree=function(){
		$.fn.zTree.init($("#stationTree"), setting, $scope.leftNodes);
        var treeObj = $.fn.zTree.getZTreeObj("stationTree"); 
        treeObj.expandAll(true); 
	};
	//创建已分配站点树
	$scope.createRightTree=function(){
		$.fn.zTree.init($("#hasStationTree"), setting2, $scope.rightNodes);
        var righttree = $.fn.zTree.getZTreeObj("hasStationTree"); 
        righttree.expandAll(true); 
	};
}]);

