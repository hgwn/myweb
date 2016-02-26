angular.module('masgetWebApp.osroleresource')
.controller('mainCtr',['$scope', '$state', 'utils','$modal','$alert','$http','$timeout',
    function ($scope, $state, utils,$modal,$alert,$http,$timeout) {
	 //窗口调整
	$(".ztree").height($(window).height()-$(".ztree:eq(0)").offset().top-40)
	$(window).resize(function(){
		var winHeight=$(window).height()-$(".ztree:eq(0)").offset().top-40
			$(".ztree").height(winHeight)
	})
		 $http({
             method : 'POST',
             url : "/jsbweb/base/getSession.do",
             headers : {
                 'Content-Type' : 'application/x-www-form-urlencoded'
             }
         }).success(function(logMSG) {
        if(logMSG.ret==0)	{ 
	 	//获取管理员资源
		$scope.findGMClip=function(){
			var find={}
			find.staffid=$scope.addstaff.staffid
			find.saasid=logMSG.companytypeid
			find.osenvirnmentid=$scope.osenvirnment.osenvirnmentid
			find.ostype=$scope.osenvirnment.osenvirnmentid
	         $http({
	             method : 'POST',
	             url : "/jsbweb/base/clip/getstaff.do",
	             data:"data="+JSON.stringify(find),
	             headers : {
	                 'Content-Type' : 'application/x-www-form-urlencoded'
	             }
	         }).success(function(resp) {
	        	 if(resp.ret == 0){
	        		 treeNodes1=resp.data.rows
	        		 treeObj1 = $.fn.zTree.init($("#treeDemo"), setting, Dataformat(treeNodes1));
	        		
	        	 }
	         })
		}
		
		//获取员工信息
		var findStaff=function(staData,callback){
	         $http({
	             method : 'POST',
	             url : "/jsbweb/base/companystaff/getcompanystaffwithout.do",
	             data:"data="+JSON.stringify(staData),
	             headers : {
	                 'Content-Type' : 'application/x-www-form-urlencoded'
	             }
	         }).success(function(resp) {
	        	 if(resp.ret == 0){
	        		 $scope.datas = resp.data.rows;
	        		 $scope.comboxValue.recordcount= resp.data.total
	        		 callback && callback();
	        	 }
	         })
		}
		//查询某个员工资源
		$scope.findStaffClip=function(){
			var find={}
			find.staffid=$scope.addstaff.staffid
			find.saasid=logMSG.companytypeid
			find.osenvirnmentid=$scope.osenvirnment.osenvirnmentid
			find.ostype=$scope.osenvirnment.osenvirnmentid
			$scope.staffname=$scope.addstaff.staffname
	         $http({
	             method : 'POST',
	             url : "/jsbweb/base/clip/getdisstaff.do",
	             data:"data="+JSON.stringify(find),
	             headers : {
	                 'Content-Type' : 'application/x-www-form-urlencoded'
	             }
	         }).success(function(resp) {
	        	 if(resp.ret == 0){
	        		 treeNodes2=resp.data.rows
	        		 treeObj2=$.fn.zTree.init($("#treeDemo2"), setting2,Dataformat(treeNodes2));
	        	 }
	         })
	         $scope.findGMClip()
		}
		//裁剪某个员工资源
		$scope.staffClip=function(data,callback){
			
	         $http({
	             method : 'POST',
	             url : "/jsbweb/base/clip/delete.do",
	             data:"data="+JSON.stringify(data),
	             headers : {
	                 'Content-Type' : 'application/x-www-form-urlencoded'
	             }
	         }).success(function(resp) {
	        	 callback && callback(resp)
	         })
		}
		//追加某个员工资源
		$scope.addtionalresource=function(data,callback){
			
	         $http({
	             method : 'POST',
	             url : "/jsbweb/base/clip/add.do",
	             data:"data="+JSON.stringify(data),
	             headers : {
	                 'Content-Type' : 'application/x-www-form-urlencoded'
	             }
	         }).success(function(resp) {
	        	 callback && callback(resp)
	         })
		}
		//点击添加资源
		$scope.addResource=function(){
					var nodes1=treeObj1.transformToArray(treeObj1.getNodes());
					$scope.addAbled=true;
					
					var addNode={};
					addNode.addstaffid=$scope.addstaff.staffid
					addNode.osenvirnmentid=$scope.osenvirnment.osenvirnmentid
					addNode.ostype=$scope.osenvirnment.osenvirnmentid
					
					addNode.saasid=logMSG.companytypeid
					addNode.addtionalresourceList=[];
					
					var changNode=[]
					for(var i=0;i<nodes1.length;i++){
						if(nodes1[i].checked!=nodes1[i].checkedOld&&!nodes1[i].isParent){
							for(var j=0;j<nodes1.length;j++){
								if(nodes1[i].o_posresourceid==nodes1[j].o_osresourceid){
									nodes1[i].o_resourcepid=nodes1[j].o_resourceid;
									treeObj1.checkNode(nodes1[i], true, false);
									changNode.push(nodes1[i])
									addNode.addtionalresourceList.push({"resourcepid":nodes1[j].o_resourceid,"resourceid":nodes1[i].o_resourceid})
									break;
								}
							}
						}
					}
					console.log(changNode)
					if(addNode.addtionalresourceList.length>0){
						$scope.addtionalresource(addNode,function(data){
							$scope.addAbled=false;
							if(data.ret==0){
							var tree2=treeObj2.transformToArray(treeObj2.getNodes());
							for(var j=0;j<changNode.length;j++)	{ 
								for(var i=0;i<tree2.length;i++){
									if(changNode[j].o_resourcepid==tree2[i].o_resourceid){
										changNode[j].checked=false
										treeObj2.addNodes(tree2[i],changNode[j])
										changNode[j].checked=true
										changNode[j].checkedOld=true
										break;
									}
								}
								treeObj1.setChkDisabled(changNode[j], true);
							}
							}else{
								alert(data.message);
							}
						})
					}else{
						$scope.addAbled=false;
					}
		}
		
		//点击裁剪资源
		$scope.delResource=function(){
					$scope.delAbled=true
					var nodes2=treeObj2.transformToArray(treeObj2.getNodes());
					var delNode={};	
					delNode.clistaffid=$scope.addstaff.staffid
					delNode.osenvirnmentid=$scope.osenvirnment.osenvirnmentid
					delNode.ostype=$scope.osenvirnment.osenvirnmentid
					delNode.saasid=logMSG.companytypeid
					delNode.clippingresourceList=[]
					
					var changNode=[]
					
					
					for(var i=0;i<nodes2.length;i++){
						if(nodes2[i].checked!=nodes2[i].checkedOld&&!nodes2[i].isParent){
							changNode.push(nodes2[i])
						    delNode.clippingresourceList.push({"resourceid":nodes2[i].o_resourceid})
						}
					}
					if(delNode.clippingresourceList.length>0){
						$scope.staffClip(delNode,function(data){
							$scope.delAbled=false
							if(data.ret==0){
								var tree1=treeObj1.transformToArray(treeObj1.getNodes());
							for(var j=0;j<changNode.length;j++)	{ 
								for(var i=0;i<tree1.length;i++){
									if(changNode[j].o_resourceid==tree1[i].o_resourceid){
										
										treeObj1.setChkDisabled(tree1[i],false)
										treeObj1.checkNode(tree1[i], false, false);
										tree1[i].checkedOld=false;
										break;
									}
								}
								
								treeObj2.removeNode(changNode[j]);
								
								var nodes2=treeObj2.transformToArray(treeObj2.getNodes());
								for(var i=0;i<nodes2.length;i++){
									if(nodes2[i].isParent){
										treeObj2.checkNode(nodes2[i], false, false);
									}
								}
							}
								
							}else{
								alert("裁剪失败! "+data.message);
								$scope.findStaffClip()
							}
						})
					}else{
						alert("请勾选要回收的资源");
						$scope.delAbled=false
					}
		}
		//左边展开
		function zTreeOnExpand(event, treeId, treeNode) {
			var tree2=treeObj2.transformToArray(treeObj2.getNodes());
			for(var i=0;i<tree2.length;i++){
				if(tree2[i].o_resourceid==treeNode.o_resourceid){
					treeObj2.expandNode(tree2[i],true,false);
					treeObj2.selectNode(tree2[i])
					break;
				}
			}
		};
		//左边合并
		function zTreeOnCollapse(event, treeId, treeNode) {
			var tree2=treeObj2.transformToArray(treeObj2.getNodes());
			for(var i=0;i<tree2.length;i++){
				if(tree2[i].o_resourceid==treeNode.o_resourceid){
					treeObj2.expandNode(tree2[i],false,false);
					break;
				}
			}
		};
		//右边展开
		function zTreeOnExpand1(event, treeId, treeNode) {
			var tree1=treeObj1.transformToArray(treeObj1.getNodes());
			for(var i=0;i<tree1.length;i++){
				if(tree1[i].o_resourceid==treeNode.o_resourceid){
					treeObj1.expandNode(tree1[i],true,false);
					treeObj1.selectNode(tree1[i])
					break;
				}
			}
		};
		//右边合并
		function zTreeOnCollapse1(event, treeId, treeNode) {
			var tree1=treeObj1.transformToArray(treeObj1.getNodes());
			for(var i=0;i<tree1.length;i++){
				if(tree1[i].o_resourceid==treeNode.o_resourceid){
					treeObj1.expandNode(tree1[i],false,false);
					break;
				}
			}
		};
		//树1 配置
	 	var setting = {
				data: {
					key: {
						name: "o_resourcename"
					},
					simpleData: {
						enable: true,
						idKey: "o_osresourceid",
						pIdKey: "o_posresourceid",
					}
				},
				check: {
					enable: true
				},
				callback: {
					onExpand: zTreeOnExpand,
					onCollapse: zTreeOnCollapse
				}
				
			};
	 	//树2 配置
		var setting2 = {
				data: {
					keep: {
						parent: true
					},
					key: {
						name: "o_resourcename"
					},
					simpleData: {
						enable: true,
						idKey: "o_osresourceid",
						pIdKey: "o_posresourceid",
					}
				},
				check: {
					enable: true
				},
				callback: {
					onExpand: zTreeOnExpand1,
					onCollapse: zTreeOnCollapse1
				}
				
			};
			Dataformat=function(data){
				/*for(var j=0;j<data.length;j++){
					data[j].chkDisabled=data[j].chkdisabled
				}*/
			   for(var i=0;i<data.length;i++){							   
					if(data[i].o_resourceid>=10000 && data[i].o_resourceid<=20000)
					/*	data[i].icon='/jsbweb/static/img/base/clipp/iconfont-iconfontcolor51.png';
						data[i].iconOpen='/jsbweb/static/img/base/clipp/iconfont-iconfontcolor52.png';
						data[i].iconClose='/jsbweb/static/img/base/clipp/iconfont-iconfontcolor51.png';*/
						data[i].isParent=true;
				}
				return data
			}
			
			$scope.find={}
			
			$scope.osenvirnments=[{"osenvirnmentid":1,"osenvirnmentname":"pc"},
			                     {"osenvirnmentid":2,"osenvirnmentname":"andrio"},
			                     {"osenvirnmentid":3,"osenvirnmentname":"ios"}
			]
			
			$scope.osenvirnment=$scope.osenvirnments[0]
			$scope.comboxValue={}
			$scope.comboxValue.pagenum=1;
			$scope.comboxValue.pagesize=5;
			$scope.comboxValue.orders=["staffid"]
			$scope.comboxValue.orderkey="asc"
			
			var alldata;
			findStaff($scope.comboxValue,function(){
				if($scope.datas.length<=0)
					return 
				 alldata=$scope.datas;
				 
				 $scope.addstaff=$scope.datas[0]	
				 $scope.comboxValue.staffname=$scope.datas[0].staffname
				
				
			});
			
			$scope.query=function(){
				findStaff($scope.comboxValue)
			}
		
			$scope.$watch("addstaff",function(){
				$scope.findStaffClip();
				$scope.datas=alldata
				
		    });
			
        }
       })
	} 
])