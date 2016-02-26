angular.module('masgetWebApp.osroleresource')
.controller('mainCtr',['$scope', '$state', 'utils','$modal','$alert','$http','$timeout',
    function ($scope, $state, utils,$modal,$alert,$http,$timeout) {
	 //窗口调整
	console.log($(".ztree:eq(0)").offset().top)
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
        	 console.log(logMSG)
        if(logMSG.ret==0){ 
        	
			
        	console.log(logMSG)
	 	//获取追加资源列表
		$scope.findGMClip=function(){
	         $http({
	             method : 'POST',
	             url : "/jsbweb/base/cmpclip/ddtionalList.do",
	             data:"data="+JSON.stringify($scope.find),
	             headers : {
	                 'Content-Type' : 'application/x-www-form-urlencoded'
	             }
	         }).success(function(resp) {
	        	 console.log(resp)
	        	 if(resp.ret == 0){
	        		 treeObj1=$.fn.zTree.init($("#treeDemo"), setting, resp.data.rows);
	        	 }
	         })
	         
		}
   
		//获取公司信息
		$scope.findCompany=function(callback){
	         $http({
	             method : 'POST',
	             url : "/jsbweb/base/company/list.do",
	             data:"data="+JSON.stringify($scope.comboxValue),
	             headers : {
	                 'Content-Type' : 'application/x-www-form-urlencoded'
	             }
	         }).success(function(resp) {
	        	 console.log(resp)
	        	 if(resp.ret == 0){
	        		 $scope.datas = resp.data.rows;
	        		 $scope.comboxValue.recordcount=resp.data.total;
	        		 
	        		 callback && callback(resp)
	        	 }
	         })
		}
		//查询某个公司资源
		$scope.findCompanyClip=function(callback){
			$scope.find.cmpcompanyid=$scope.cmpcompany.companyid
			$scope.find.companyid=$scope.cmpcompany.companyid
			$scope.comNmae=$scope.cmpcompany.companyname
			$scope.typeName=$scope.osenvirnment.osenvirnmentname
			$scope.find.roletypeid=1
			$scope.find.osenvirnmentid=$scope.osenvirnment.osenvirnmentid
			$scope.find.saasid=$scope.cmpcompany.companytypeid
			$scope.findGMClip();  //查询公司定制
	         $http({
	             method : 'POST',
	             url : "/jsbweb/base/cmpclip/resourceList.do",
	             data:"data="+JSON.stringify($scope.find),
	             headers : {
	                 'Content-Type' : 'application/x-www-form-urlencoded'
	             }
	         }).success(function(resp) {
	        	
	        	 if(resp.ret == 0){
	        		 console.log(resp)
	        		 treeObj2=$.fn.zTree.init($("#treeDemo2"), setting2,Dataformat(resp.data.rows));
	        	 }
	        	 callback && callback(resp)
	         })
	    
		}
		//裁剪某个公司资源
		$scope.staffClip=function(data,callback){
			 
	         $http({
	             method : 'POST',
	             url : "/jsbweb/base/cmpclip/delete.do",
	             data:"data="+JSON.stringify(data),
	             headers : {
	                 'Content-Type' : 'application/x-www-form-urlencoded'
	             }
	         }).success(function(resp) {
	        	 callback && callback(resp)
	        	 console.log(resp)
	         })
		}
		//追加某个公司资源
		$scope.addtionalresource=function(data,callback){
			
	         $http({
	             method : 'POST',
	             url : "/jsbweb/base/cmpclip/add.do",
	             data:"data="+JSON.stringify(data),
	             headers : {
	                 'Content-Type' : 'application/x-www-form-urlencoded'
	             }
	         }).success(function(resp) {
	        	 callback && callback(resp)
	        	 console.log(resp)
	         })
		}
		//显示移除按钮
		function showRemoveBtn(){
			return false
		}
		
		
		
		//拖拽动作--释放时候回调方法
		function beforeDrop(treeId, treeNodes, targetNode, moveType) {
				var node=treeNodes[0];
				console.log()
				var addNode={};
				addNode.addcompanyid=$scope.cmpcompany.companyid
				addNode.osenvirnmentid=$scope.find.osenvirnmentid
				addNode.saasid=$scope.cmpcompany.companytypeid
				addNode.cmpaddtionalresourceList=[]     
				addNode.cmpaddtionalresourceList.push({"resourcepid":targetNode.o_resourceid,"resourceid":node.resourceid})

				console.log(addNode)
				
				$scope.addtionalresource(addNode,function(data){
					if(data.ret==0){
						$scope.findCompanyClip(function(ret){
							alert("增加定制资源成功")
							var nodes2= treeObj2.transformToArray(treeObj2.getNodes());
							for(var i=0;i<nodes2.length;i++){
								if(nodes2[i].o_resourceid==node.resourceid){
									treeObj2.selectNode(nodes2[i])
									break;
								}
							}
						});
						
					}
				})
			   
			    return false
			}
		
	
		
		var editNode=[];  //改动的资源
		var zTreeOnCheck=function(event, treeId, treeNode) {
			
			var newAddNode=treeObj2.transformToArray(treeNode)
			if(!newAddNode[0].o_posresourceid){
				newAddNode.splice(0,1)
			}
			if(newAddNode[0].isParent)
			for(var i=0;i<newAddNode.length;i++){
				console.log(newAddNode[i].checked)
				if(newAddNode[i].checked==newAddNode[i].checkedOld){
					newAddNode.splice(i,1)
					i--;
				}	
			}
			console.log("newAdd"+newAddNode)
			if(!editNode||editNode.length==0){
					editNode=newAddNode;
					
				}else{
					
					for(var i=0;i<newAddNode.length;i++){
						var j=0;
						var len=editNode.length;
						var falg=true;
						while(j<len){
							if(newAddNode[i].o_resourceid==editNode[j].o_resourceid){ 
									editNode.splice(j,1);
									j--;
									break;
							}
							if(j==editNode.length-1){
								editNode.push(newAddNode[i])
							}
							j++;
						}
					}
						
				}
		};
		
		//获取改动的资源
		var getChangeNode=function(){
			
			var editNode={};
				editNode.cmpaddtionalresourceList=[]
				editNode.cmpclippingresourceList=[]
			var nodes2=treeObj2.transformToArray(treeObj2.getNodes());
			
			for(var i=0;i<nodes2.length;i++){
				if(nodes2[i].checked!=nodes2[i].checkedOld&&!nodes2[i].isParent){
					if(nodes2[i].checked){
						editNode.cmpaddtionalresourceList.push({"resourcepid":nodes2[i].o_posresourceid,"resourceid":nodes2[i].o_resourceid})
					}else{
						editNode.cmpclippingresourceList.push({"resourceid":nodes2[i].o_resourceid})
					}
				
				}
			}
			console.log(editNode)
			return editNode;
		}
		
		//点击保存资源
		$scope.saveNode=function(){
			var editNode=getChangeNode()
			if(editNode.cmpaddtionalresourceList>0||editNode.cmpclippingresourceList>0){
				return false
			}
			var addNode={};
				addNode.addcompanyid=$scope.cmpcompany.companyid
				addNode.osenvirnmentid=$scope.find.osenvirnmentid
				addNode.saasid=$scope.cmpcompany.companytypeid
				addNode.cmpaddtionalresourceList=editNode.cmpaddtionalresourceList
				
			var delNode={};	
				delNode.clicompanyid=$scope.cmpcompany.companyid
				delNode.osenvirnmentid=$scope.find.osenvirnmentid
				delNode.saasid=$scope.cmpcompany.companytypeid
				delNode.cmpclippingresourceList=editNode.cmpclippingresourceList
				
			var msg;	
			var addtionalresource;
			var companyclip;
			
			if(addNode.cmpaddtionalresourceList.length>0){
					$scope.addtionalresource(addNode,function(data){
						if(data.ret!=0){
								msg+=data.message
						}else{
							var nodes2=treeObj2.transformToArray(treeObj2.getNodes());
							for(var i=0;i<nodes2.length;i++){
								if(nodes2[i].checked==true&&!nodes2[i].isParent){
									nodes2[i].checkedOld =true;
								}
							}	
						}
						if(companyclip&&!msg){	
							alert("权限修改成功")
						}
						else if(companyclip&&msg){
							alert(msg)
							$scope.findCompanyClip();
						}	
						addtionalresource=true
					})
			}else{
				 addtionalresource=true
			}
			if(delNode.cmpclippingresourceList.length>0){
					$scope.staffClip(delNode,function(data){
					if(data.ret!=0){
							msg+=data.message
					}else{
						var nodes2=treeObj2.transformToArray(treeObj2.getNodes());
						for(var i=0;i<nodes2.length;i++){
							if(nodes2[i].checked==false&&!nodes2[i].isParent){
								nodes2[i].checkedOld =false;
							}
						}
						var node1=treeObj1.transformToArray(treeObj1.getNodes());
						
						for(var j=0;j<node1.length;j++){
							for(var i=0;i<nodes2.length;i++){
									if(node1[j].resourceid==nodes2[i].o_resourceid&&!node1[j].enableflag){
										treeObj2.removeNode(nodes2[i]);
									}
							}
						}
						$scope.findGMClip();
					}		
					if(addtionalresource&&!msg){	
						alert("权限修改成功")
					}
					else if(addtionalresource&&msg){
						alert(msg)
					}
					companyclip=true
				})
			}else{
				companyclip=true
			}	
			console.log(msg)
			editNode=[];
		}
		
		//拖拽前
		function beforeDrag(treeId, treeNodes) {
			if(!treeNodes[0].enableflag){
				var nodes2=treeObj2.transformToArray(treeObj2.getNodes());
				for(var i=0;i<nodes2.length;i++){
					if(treeNodes[0].resourceid==nodes2[i].o_osresourceid){
						treeObj2.selectNode(nodes2[i])
						break;
					}
				}
				return false;
			}
		};
		//点击定制资源
		function zTreeOnClick(event, treeId, treeNode) {
			if(!treeNode.enableflag){
				var nodes2=treeObj2.transformToArray(treeObj2.getNodes());
				for(var i=0;i<nodes2.length;i++){
					if(treeNode.resourceid==nodes2[i].o_osresourceid){
						treeObj2.selectNode(nodes2[i])
						break;
					}
				}
				return false;
			}
		};
		//设置定制资源颜色
		function setFontCss(treeId, treeNode) {
			return treeNode.enableflag  ? {} : {color:"#ADADAD"};
		};
		//树1 配置
	 	var setting = {
				edit: {
					enable: true,
					drag:{
						prev: false,
						next: false
					},
					showRemoveBtn: false,
					showRenameBtn: false
				},
				data: {
					key: {
						name: "resourcename"
					}
				},
				callback: {
					beforeDrop: beforeDrop,
					beforeDrag: beforeDrag,
					onClick: zTreeOnClick
				},
				view: {
					fontCss: setFontCss
				}
			};
	 	//树2 配置
		var setting2 = {
				edit: {
					enable: true,
					drag:{
						isCopy: false,
						prev: false,
						next: false,
						isMove: false
					},
					showRemoveBtn: showRemoveBtn,
					showRenameBtn: false
				},
				data: {
					keep: {
						parent:true,
						leaf:true
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
				}
			};
		
			Dataformat=function(data){
				
			    for(var i=0;i<data.length;i++){							   
						if(data[i].o_resourceid>=10000 && data[i].o_resourceid<=20000)
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
			
			$scope.findCompany(function(){
				 $scope.cmpcompany=$scope.datas[1]	
				 $scope.comboxValue.companyname=$scope.datas[1].companyname
				 $scope.findCompanyClip()
			});
			
			$scope.query=function(){
				$scope.findCompany()
			}
        }
       })
	} 
])