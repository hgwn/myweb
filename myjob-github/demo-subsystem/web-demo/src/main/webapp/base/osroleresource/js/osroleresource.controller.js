angular.module('masgetWebApp.osroleresource')
.controller('osroleresourceCtr',['$scope', '$state', 'utils','$modal','$alert','ngTreetableParams','$http','$timeout','contactsRoletype','companytype',
    function ($scope, $state, utils,$modal,$alert,ngTreetableParams,$http,$timeout,contactsRoletype,companytype) {
	    $scope.station ={};
	 	$scope.data = [];
	 	$scope.contactsRoletype = contactsRoletype;
	 	$scope.companytype = companytype;
	 	
	 	$scope.expanded_params = new ngTreetableParams({
	 		getNodes: function(parent) {
	 			return parent ? parent.children : $scope.data;
	 		},
	 		getTemplate: function(node) {
				return 'tree_node';
			},
	 		options: {
	            onNodeExpand: function() {
	                initialState: 'expanded'
	            }
	        }
	 	});
	
	 	$scope.osroleresource = {
	    		ostype:1
	 	}
	 	
	 	//基础资源查询
		$scope.baseCheck = function(item){
			var obj = {}
			var ordersArray = new Array();
	   	 	ordersArray[0] = "resourceid";
			obj.companytypeid = item;
		   	obj.orders = ordersArray;
			obj.orderkey = "asc";
	    	var data ={};
	    	data.data = JSON.stringify(obj);
	        var url = "/jsbweb/base/resource/get.do"
	        utils.query(url,{method:'POST',data:data}).then(function(resp){
	        	if(resp.ret == 0){
					$scope.result = resp.data.rowOS.concat(resp.data.rows)
	        		angular.forEach($scope.result,function(item,key){
	        			item.id = item.resourceid;
	        			item.text = item.resourcename;
	        		})
	        	}
	        });
		}

	 	//查询公司类型
	     $scope.findCheck = function(){
	    	var obj = {
	    			companytypename:$scope.osroleresource.companytypename
	    	}
	 		utils.query("/jsbweb/base/osroleresource/find.do",{type: "post", method: "post", data: {data: JSON.stringify(obj)}}).then(function (resp) {
	 			 if(resp.ret == 0){
	        		 $scope.data = resp.data.rows;
	        		 $scope.dealFindCheck();
	        		 //调用angular treetable插件
	        		 $scope.expanded_params.refresh();
	        	 }
	         })
	     }
	 	
	 	//findCheck的数据处理
	 	$scope.dealFindCheck = function(){
	 		angular.forEach($scope.data,function(items,keys){
	 			items.id = items.companytypeid;
	 			items.text = items.companytypename;
	 			items.type = 'folder';
	 			items.isLoad = true;
	 			items.isOperation = false;
	 			items.isDelete = false;
	 			items.isAdd = false;
	 			var os = []; 
	 			angular.forEach(items.os,function(val,index){
	 				val.id = val.ostypeid;
	 				val.text = val.ostypename;
	 				val.type = 'folder';
	 				val.isLoad = false;
	 				val.isOperation = false;
	 				val.isDelete = false;
	 				val.isAdd = false;
	 				val.companytypeid = items.companytypeid;
	 				val.osenvirnmentid = val.ostypeid;
	 				var roletype = [];
	 				angular.forEach(val.roles,function(item,key){
	 					item.id = item.roletypeid
	 					item.text = item.roletypename;
	 					item.posresourceid = 0;
	 					item.type = 'folder';
	 					item.isOperation = true;
	 					item.isDelete = false;
	 					item.isAdd = true;
	 					item.companytypeid = items.companytypeid;
	 					item.osenvirnmentid = val.ostypeid;
	 					roletype.push(item);
	 				})
	 				val.children = roletype;
	 				os.push(val);
	 			})
	 			items.children = os;
	 		})
	 	}
	 	
	     //查询
	     $scope.check = function(item){
	    	 var obj = {}
	    	 if(item != undefined&&item != null&&item !=""){
	    		 obj.posresourceid = item.posresourceid;
	    		 obj.companytypeid = item.companytypeid;
	    		 obj.roletypeid = item.roletypeid;
	    		 obj.osenvirnmentid = item.osenvirnmentid;
	    	 }else{
	    		 obj.posresourceid = 0;
		    	 obj.companytypeid = $scope.osresource.companytypeid;
		    	 obj.roletypeid = $scope.osresource.roletypeid;
		    	 obj.osenvirnmentid = $scope.osresource.osenvirnmentid;
	    	 }
	    		 
	         var Data = {};
	         Data.data = JSON.stringify(obj);
	         $http({
	             method : 'POST',
	             url : "/jsbweb/base/osroleresource/get.do",
	             data:$.param(Data),
	             headers : {
	                 'Content-Type' : 'application/x-www-form-urlencoded'
	             }
	         }).success(function(resp) {
	        	 if(resp.ret == 0){
	        		 if(item != undefined&&item != null&&item !=""){
	        			 $scope.treeData = utils.OsroleresourceToTree(resp.data.rows,"osresourceid","posresourceid","0",0,[],null);
	        			 $scope.treeDataParent = utils.OsroleresourceToTreeParent($scope.treeData,"osresourceid","posresourceid","0",item);
	        			 item.children =  $scope.treeDataParent;
	        		 }else{
	        			 $scope.addTreeData = utils.OsroleresourceToTree(resp.data.rows,"osresourceid","posresourceid","0",0,[],null);
	        			 $('#comtree').combotree({data:$scope.addTreeData});
	        			 $('#comtree').combotree('setValue',  ''); 
	        			 if($scope.type == "edit" && $scope.osresource.isDelete){
	        				 $('#comtree').combotree('setValue',  $scope.osresource.osresourceid);
	        			 }else{
	        				 if($scope.osresource.posresourceid != 0){
	        					 $('#comtree').combotree('setValue', $scope.osresource.posresourceid);
	        				 }else{
	        					 $('#comtree').combotree('setValue',  "");
	        				 }
	        			 }
        				 $('#comtree').combotree('disable');
	        		 }
	        	 }
	         })
	     }

		//新增分组信息
		$scope.groupsIndex = 1;
		$scope.groups = function(){
			var obj = {};
			obj.resourcename = "分组名" + $scope.groupsIndex;
			obj.authen = "";
			obj.resourceid = 1000000000 + $scope.groupsIndex;
			obj.baseid = 10035;
			obj.childnodetype = 101;
			obj.placeindex = $scope.OsRourceData.length + 1;
			$scope.OsRourceData.push(obj);
			if($scope.type == "edit"){
				obj.action = "add";
				obj.placeindex = $scope.EditOsRourceData.length + 1;
				$scope.EditOsRourceData.push(obj);
				//排序
				$scope.EditOsRourceData.sort(function(a,b){
					if(a.placeindex>b.placeindex){
						return 1;
					}
					return 0;
				});
			}
			$scope.groupsIndex++;
		}
	 	
	 	$scope.rowClicked = function(node){
	 		if(!node.isLoad&&node.isLoad!=undefined){
	 			angular.forEach(node.children,function(item,key){
	 				$scope.check(item);
	 			})
	 			node.isLoad = true;
	 		}
	 	}
	     
	    $scope.add = function(item,node){
			$scope.baseCheck(item.companytypeid);
	    	$timeout(function(){
				$scope.type = "add";
				$scope.button = false;
				$scope.OsRourceData=[];
				$scope.osenvirnmentModel = false;
				$scope.companytypeModel = true;
				$scope.roletypeModel = true;
				$scope.osresource={
					posresourceid:item.osresourceid,
					resourcename:'',
					companytypeid:item.companytypeid,
					authen:'',
					resourceid:'',
					osenvirnmentid:1,
					roletypeid:item.roletypeid,
					placeindex:'',
					childnodetype:''
				};
				if(item.osresourceid!=null){
					$scope.osresource.posresourceid = item.osresourceid;
				}else{
					$scope.osresource.posresourceid = item.posresourceid;
				}
				$modal({html:true,scope:$scope,title:"新增资源信息",template:'html/osroleresource.modal.html',contentTemplate:'html/osroleresource.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){
					c.form_osresource.submitted = false;
					$scope.button = true;
					var posresourceid = $('#comtree').combobox('getValue');
					if(c.form_osresource.$valid){
						var objAdd = {};
						objAdd.osenvirnmentid = $scope.osresource.osenvirnmentid;
						objAdd.companytypeid = $scope.osresource.companytypeid;
						objAdd.roletypeid = $scope.osresource.roletypeid;
						if(posresourceid!=null&&posresourceid!=""&&posresourceid!=undefined){
							objAdd.posresourceid = posresourceid;
						}else{
							objAdd.posresourceid = 0;
						}
						angular.forEach($scope.OsRourceData,function(item,key){
							if(item.baseid != undefined && item.baseid == 10035){
								item.resourceid = item.baseid;
							}
							item.placeindex = key+1;
						})
						objAdd.osresource = $scope.OsRourceData;
						var data = {};
						data.data = JSON.stringify(objAdd);
						if($scope.OsRourceData.length != 0){
							$http({
								method : 'POST',
								url : "/jsbweb/base/osroleresource/add.do",
								data:$.param(data),
								headers : {
									'Content-Type' : 'application/x-www-form-urlencoded'
								}
							}).success(function(resp) {
								if(resp.ret==0){
									$alert({title: '提示：', content: '新增成功', placement: 'masget-top',duration:1, type: 'info', show: true});
									angular.forEach(resp.data,function(val,key){
										val.isAdd = true;
										val.isDelete = true;
										val.isOperation = true;
										val.id = val.osresourceid;
										val.text = val.resourcename;
										val.type = "folder";
										val.parent = item;
									})
									item.children = resp.data;
									$scope.expanded_params.collapsed([node.$parent._num]);
									$scope.groupsIndex = 1;
								}else{
									$alert({title: '提示：', content: '新增失败', placement: 'masget-top',duration:1, type: 'info', show: true});
								}
							});
							return true;
						}else{
							$scope.button = false;
							$alert({title: '提示：', content: '基础资源不能为空', placement: 'masget-top',duration:2,type: 'info', show: true});
							return false;
						}
					}else{
						$scope.button = false;
						c.form_osresource.submitted = true;
						$alert({title: '提示：', content: '请重新检查输入项', placement: 'masget-top',duration:1,type: 'info', show: true});
						return false;
					}
				}});
			})
	    }
	
	     $scope.edit = function(item,node){
			 $scope.baseCheck(item.companytypeid);
	    	 $timeout(function(){
				 $scope.editFlag = true;
				 $scope.OsFlag = false;
				 $scope.removeEditFlag = "";
				 $scope.osresource = [];
				 $scope.OsRourceData = [];
				 $scope.EditOsRourceData = [];
				 $scope.type = "edit";
				 $scope.button = false;
				 $scope.osenvirnmentModel = true;
				 $scope.companytypeModel = true;
				 $scope.roletypeModel = true;
				 $scope.osresource = angular.copy(item);
				 $scope.OsRourceData = $scope.osresource.children;
				 $scope.OsData = angular.copy($scope.OsRourceData);
				 angular.forEach($scope.OsRourceData,function(item,key){
					 item.action = "modify";
					 if(item.resourceid == 0){
						 item.resourceid = 10000000000 + key;
						 item.resourcepid = 10000000000 + key;
						 item.rebaseid = 0;
					 }
				 })
				 $scope.authenCheck();
				 $modal({html:true,scope:$scope,title:"修改资源信息",template:'html/osroleresource.modal.html',contentTemplate:'html/osroleresource.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){
					 c.form_osresource.submitted = false;
					 $scope.button = true;
					 var posresourceid = $('#comtree').combobox('getValue');
					 if(c.form_osresource.$valid){
						 var objAdd = {};
						 objAdd.osenvirnmentid = $scope.osresource.osenvirnmentid;
						 objAdd.companytypeid = $scope.osresource.companytypeid;
						 objAdd.roletypeid = $scope.osresource.roletypeid;
						 if(posresourceid!=null&&posresourceid!=""&&posresourceid!=undefined){
							 objAdd.posresourceid = posresourceid;
						 }else{
							 objAdd.posresourceid = 0;
						 }
						 angular.forEach($scope.EditOsRourceData,function(item,key){
							 item.placeindex = key+1;
							 delete item.children;
							 if(item.resourceid >= 10000000000 || item.resourceid >=1000000000){
								 item.resourceid = 0;
							 }
						 })
						 objAdd.osresource = $scope.EditOsRourceData;
						 //处理数据，防止递归关系重复a>b,b>c,c>a
						 angular.forEach(objAdd.osresource,function(item,key){
							 delete item.parent;
						 })
						 var data = {};
						 data.data = JSON.stringify(objAdd);
						 if($scope.OsRourceData.length != 0){
							 $http({
								 method : 'POST',
								 url : "/jsbweb/base/osroleresource/update.do",
								 data:$.param(data),
								 headers : {
									 'Content-Type' : 'application/x-www-form-urlencoded'
								 }
							 }).success(function(resp) {
								 if(resp.ret==0){
									 $alert({title: '提示：', content: '修改成功', placement: 'masget-top',duration:1, type: 'info', show: true});
									 angular.forEach(resp.data,function(val,key){
										 val.isAdd = true;
										 val.isDelete = true;
										 val.isOperation = true;
										 val.id = val.osresourceid;
										 val.text = val.resourcename;
										 val.type = "folder";
										 val.parent = item;
									 })
									 item.children = resp.data;
									 $scope.expanded_params.collapsed([node.$parent._num]);
									 $scope.groupsIndex = 1;
								 }else{
									 $alert({title: '提示：', content: '修改失败', placement: 'masget-top',duration:1, type: 'info', show: true});
								 }
							 });
							 return true;
						 }else{
							 $scope.button = false;
							 $alert({title: '提示：', content: '基础资源不能为空', placement: 'masget-top',duration:2,type: 'info', show: true});
							 return false;
						 }
					 }else{
						 $scope.button = false;
						 c.form_osresource.submitted = true;
						 $alert({title: '提示：', content: '请重新检查输入项', placement: 'masget-top',duration:1,type: 'info', show: true});
						 return false;
					 }
				 }});
			 })
	    }
	     
	     $scope.deleteDatum =  function(item,node){
	    	 if(item.children == undefined || item.children.length == 0){
	    		 $modal({title: "提示", content: "确认要删除站点为"+item.resourcename+"?",template:'modal/modal.confirm.tpl.html',animation:'am-fade-and-scale',callback: function(){
	    			 $http({
	    				 method : 'POST',
	    				 url : "/jsbweb/base/osroleresource/delete.do",
	    				 data:"osresourceid="+item.osresourceid,
	    				 headers : {
	    					 'Content-Type' : 'application/x-www-form-urlencoded'
	    				 }
	    			 }).success(function(resp) {
	    				 if(resp.ret==0){
	    					 $alert({title: '提示：', content: '删除成功', placement: 'masget-top',duration:1,type: 'info', show: true});
	    					 angular.forEach(item.parent.children,function(val,key){
	    						 if(item.osresourceid == val.osresourceid){
	    							 item.parent.children.splice(key,1);
	    						 }
	    					 })
	    					 $scope.expanded_params.editRefresh([node.$parent._num]);
	    				 }else{
	    					 $alert({title: '提示：', content: '删除失败', placement: 'masget-top',duration:1,type: 'info', show: true});
	    				 }
	    			 })
	    		 }
	    		 })
	    	 }else{
	    		 $alert({title: '提示：', content: '该资源含有子资源，不能删除', placement: 'masget-top',duration:2,type: 'info', show: true});
	    	 }
		 }
	     
	     
	    $scope.OsRourceData = [];
		
		//添加列表
		$scope.addToWayStationList = function(){
			var baseArray = [];
			var tmep = [];
			var OsEditData = [];
			var baseResource = $('#baseResource').combobox('getValues').join(',');
			if(baseResource=="" ){
				if($scope.OsRourceData.length == 0){
					$alert({title: '提示：', content: '请选择资源!', placement: 'masget-top',duration:1, type: 'info', show: true});
				}else{
					angular.forEach($scope.OsRourceData,function(item,key){
						if(item.baseid == undefined){
							$scope.OsRourceData.splice(key,1);
						}
					})
					$scope.$apply($scope.OsRourceData);
				}
				return;
			}
			baseArray = baseResource.split(",");
			$scope.baseArray = angular.copy(baseArray);
			$scope.OsRemoveData = [];
			//获取勾选id的全部数据
			angular.forEach($scope.result,function(items,key){
				angular.forEach(baseArray,function(item,val){
					var obj = {}
					if(items.resourceid == item){
						obj.resourceid = items.resourceid;
						obj.resourcename = items.resourcename;
						obj.placeindex = $scope.OsRourceData.length+1;
						$scope.OsRemoveData.push(obj);
					}
				})
			})
			if($scope.type == "edit"){
				//取消勾选的时候将数据删除
				if($scope.OsFlag && $scope.OsFlag != undefined){
					$scope.OsFlagData = angular.copy($scope.OsData);
					angular.forEach(baseArray,function(item,key){
						angular.forEach($scope.OsFlagData,function(val,index){
							if(item == val.resourceid){
								$scope.OsFlagData.splice(index,1);
							}
						})
					})
				}
			}
			if($scope.OsRourceData.length != 0){
				angular.forEach($scope.OsRourceData,function(items,key){
					items.saveFlag = true;
					items.Flag = true;
					//去除重复的数据
					angular.forEach(baseArray,function(item,val){
						if(items.resourceid == item){
							items.saveFlag = false;
							baseArray.splice(val,1);
						}
					})
					if($scope.type == "edit" && items.rebaseid == 0){
						items.saveFlag = false;
					}
					//在edit下增加属性action
					if($scope.type == "edit" && items.saveFlag){
						items.action = "delete";
						items.orderno = items.placeindex;
						items.placeindex = 2000+key;
						angular.forEach($scope.EditOsRourceData,function(val,index){
							if(items.resourceid == val.resourceid && items.action == val.action ){
								items.Flag = false;
							}
						})
						if(items.Flag){
							items.deleteFlag = true;
							$scope.saveFlag = true;
							items.notAdd = true;
							angular.forEach($scope.EditOsRourceData,function(val,key){
								if(items.resourceid == val.resourceid){
									items.notAdd = false;
								}
							})
							if(items.notAdd){
								$scope.EditOsRourceData.push(items);
							}
						}
						
					}
				})
			}
			if($scope.type == "edit"){
				//取消勾选的时候判断该数据是否含有子资源
				if($scope.OsFlag && $scope.OsFlag != undefined){
					angular.forEach($scope.OsFlagData,function(val,index){
						angular.forEach($scope.OsRourceData,function(item,key){
							if(val.resourceid == item.resourceid){
								if( item.children == undefined || item.deleteFlag && item.children.length == 0 ){
									item.action = "delete";
									item.placeindex = 2000+key;
									OsEditData.push(item);
									$scope.OsRourceData.splice(key,1);
								}else if(item.deleteFlag && item.children.length != 0){
									var obj = item.resourceid;
									item.placeindex = item.orderno;
									$scope.baseArray.push(obj);
									$scope.notNewBulid = true;
									$scope.returnFlag = true;
									item.deleteFlag = false;
									$alert({title: '提示：', content: '该资源含有子资源，不能删除!', placement: 'masget-top',duration:2, type: 'info', show: true});
									$('#baseResource').combotree('setValues',  $scope.baseArray);
								}
							}
						})
					})
				}
				$scope.OsFlag = true;
				if($scope.returnFlag){
					$scope.returnFlag = false;
					return;
				}
			}
			//新增时处理数据
			angular.forEach($scope.result,function(items,key){
				angular.forEach(baseArray,function(item,val){
					var obj = {}
					if(items.resourceid == item){
						obj.resourceid = items.resourceid;
						obj.resourcename = items.resourcename;
						obj.placeindex = $scope.OsRourceData.length+1;
						//在edit下新增时增加属性action
						if($scope.type == "edit" &&items.osresourceid==undefined){
							obj.action = "add";
							obj.Flag = true;
							angular.forEach($scope.EditOsRourceData,function(val,index){
								if(obj.resourceid == val.resourceid && val.action != "delete"){
									obj.Flag = false;
								}
							})
							if(obj.Flag){
								$scope.EditOsRourceData.push(obj);
							}
						}
						$scope.OsRourceData.push(obj);
					}
				})
			})
			//在页面显示的数据$scope.OsRourceData
			angular.forEach($scope.OsRemoveData,function(items,key){
				angular.forEach($scope.OsRourceData,function(item,val){
					var obj = {}
					item.reFlag = true;
					if(items.resourceid == item.resourceid || item.rebaseid == 0 || item.baseid != undefined && item.baseid == 10035){
						angular.forEach(tmep,function(val,index){
							if(val.resourceid == item.resourceid){
								item.reFlag = false;
							}
						})
						if(item.reFlag){
							tmep.push(item);
						}
					}
				})
			})
			$scope.OsRourceData = tmep;
			//排序。小到大
			$scope.OsRourceData.sort(function(a,b){
				if(a.placeindex>b.placeindex){
					return 1;
				}
				return 0;
			});
			angular.forEach($scope.OsRourceData,function(item,key){
				item.placeindex = key+1;
			})
			//刷新$scope.OsRourceData
			if(!$scope.isType || $scope.isType == undefined){
				$scope.$apply($scope.OsRourceData);
			}else {
				if($scope.isType){
					$scope.$apply($scope.OsRourceData);
				}
				$scope.isType = undefined;
			}
			
			if($scope.type == "edit" && $scope.saveFlag){
				angular.forEach($scope.OsRourceData,function(item,key){
					item.Flag = true;
					angular.forEach($scope.EditOsRourceData,function(val,index){
						if(item.resourceid == val.resourceid){
							item.Flag = false;
						}
					})
					if(item.Flag){
						$scope.EditOsRourceData.push(item);
					}
				})
			}
			if($scope.editFlag && $scope.editFlag !=undefined){
				$scope.editFlag = false;
				$scope.EditOsRourceData = angular.copy($scope.OsRourceData);
			}
			if($scope.type == "edit"){
				//将action为delete的数据增加到$scope.EditOsRourceData
				angular.forEach(OsEditData,function(item,key){
					angular.forEach($scope.EditOsRourceData,function(val,index){
						if(item.resourceid == val.resourceid && item.action != val.action ){
							item.Flag = true;
							item.action = "delete";
							$scope.EditOsRourceData.splice(index,1);
						}
					})
					if(item.Flag){
						$scope.EditOsRourceData.push(item);
					}
				})
				//将item.osresourceid为空的数据去除
				angular.forEach($scope.EditOsRourceData,function(item,key){
					if(item.action == "delete" && item.osresourceid == undefined){
						$scope.EditOsRourceData.splice(key,1);
					}
				})
				//排序
				$scope.EditOsRourceData.sort(function(a,b){
					if(a.placeindex>b.placeindex){
						return 1;
					}
					return 0;
				});
				angular.forEach($scope.EditOsRourceData,function(item,key){
					if(item.action != "delete"){
						item.placeindex = key+1;
					}
				})
			}
		}
		
		//操作类型
		$scope.removeWayStation=function(item,type){
			$scope.removeEditData = [];
			var removeData = [];
			$scope.removeEditFlag = true;
			// 判断是否存在children，存在的话，不能删除
			if(item.children!=""&&item.children!=undefined&&item.children.length != 0 ){
				$alert({title: '提示：', content: '该资源含有子资源，不能删除!', placement: 'masget-top',duration:1, type: 'info', show: true});
				return;
			}
			//删除的时候，如果是edit，则增加action，存入$scope.removeEditData，否则存入removeData
			angular.forEach($scope.OsRourceData,function(waystation,key){
				if(waystation.resourceid==item.resourceid&&item.resourceid != 0 || waystation.resourcepid != undefined&&waystation.resourcepid == item.resourcepid){
					if($scope.type == "add"){
						waystation.placeindex = 1000 + key;
					}else if($scope.type == "edit" && waystation.osresourceid !=null || waystation.action == "add"){
						waystation.action = 'delete';
						waystation.placeindex = 1000 + key;
						$scope.removeEditData.push(waystation);
					}
				}else{
					if(waystation.baseid == undefined && waystation.resourceid < 10000000000){
						var obj = waystation.resourceid;
						removeData.push(obj);
					}
				}
			});
			//排序
			$scope.OsRourceData.sort(function(a,b){
				if(a.placeindex>b.placeindex){
					return 1;
				}
				return 0;
			});
			//删除placeindex大于1000的数据
			$scope.OsRourceData.pop();
			//重新赋予placeindex的值
			angular.forEach($scope.OsRourceData,function(item,key){
				item.placeindex = key+1;
			})
			$scope.isType = type;
			//combotree赋值
			$('#baseResource').combotree('setValues',  removeData);
			if($scope.type == "edit"){
				//edit的时候，判断去重后存入$scope.EditOsRourceData
				angular.forEach($scope.OsRourceData,function(item,key){
					item.Flag = true;
					angular.forEach($scope.EditOsRourceData,function(val,index){
						if(item.resourceid == val.resourceid){
							item.Flag = false;
						}
					})
					if(item.Flag){
						$scope.EditOsRourceData.push(item);
					}
				})
				//edit的时候，在$scope.removeEditData判断去重增加action后存入$scope.EditOsRourceData
				angular.forEach($scope.removeEditData,function(item,key){
					item.Flag = true;
					angular.forEach($scope.EditOsRourceData,function(val,index){
						if(item.resourceid == val.resourceid ){
							item.Flag = false;
						}
						if(item.resourceid == val.resourceid && item.action != val.action){
							item.Flag = true;
							item.action = "delete";
							$scope.EditOsRourceData.splice(index,1);
						}
					})
					if(item.Flag){
						$scope.EditOsRourceData.push(item);
					}
				})
				$scope.EditOsRourceData.sort(function(a,b){
					if(a.placeindex>b.placeindex){
						return 1;
					}
					return 0;
				});
				$scope.OsRourceData = [];
				angular.forEach($scope.EditOsRourceData,function(item,key){
					if(item.action != "delete"){
						item.placeindex = key+1;
						$scope.OsRourceData.push(item);
					}else if(item.action == "delete" && item.osresourceid ==undefined){
						$scope.EditOsRourceData.splice(key,1);
					}
				})
			}
		}
		
		//上移
		$scope.shiftUp=function(item){
			if(item.placeindex==1) return;
			
			angular.forEach($scope.OsRourceData,function(waystation){
				if(waystation.placeindex==(item.placeindex-1)){
					waystation.placeindex=waystation.placeindex+1;
					return false;
				}
			});
			if($scope.type == "edit"){
				angular.forEach($scope.EditOsRourceData,function(val,key){
					if(val.placeindex==(item.placeindex-1)){
						val.placeindex=val.placeindex+1;
						return false;
					}
					if(item.resourceid == val.resourceid){
						val.placeindex=val.placeindex-1;
					}
				})
			}
			if(item.action != "add"){
				item.placeindex=item.placeindex-1;
			}
			//重写数组的sort()方法,将数组元素按placeindex从小到大重新排序
			$scope.OsRourceData.sort(function(a,b){
				if(a.placeindex>b.placeindex){
					return 1;
				}
				return 0;
			});
			if($scope.type == "edit"){
				$scope.EditOsRourceData.sort(function(a,b){
					if(a.placeindex>b.placeindex){
						return 1;
					}
					return 0;
				});
			}
		}
		
		//下移
		$scope.shiftDown=function(item){
			if(item.placeindex==$scope.OsRourceData.length) return;
			
			angular.forEach($scope.OsRourceData,function(waystation){
				if(waystation.placeindex==(item.placeindex+1)){
					waystation.placeindex=waystation.placeindex-1;
					return false;
				}
			});
			if($scope.type == "edit"){
				angular.forEach($scope.EditOsRourceData,function(val,key){
					if(val.placeindex==(item.placeindex+1)){
						val.placeindex=val.placeindex-1;
						return false;
					}
					if(item.resourceid == val.resourceid){
						val.placeindex=val.placeindex+1;
					}
				})
			}
			if(item.action != "add"){
				item.placeindex=item.placeindex+1;
			}
			//重写数组的sort()方法,将数组元素按placeindex从小到大重新排序
			$scope.OsRourceData.sort(function(a,b){
				if(a.placeindex>b.placeindex){
					return 1;
				}
				return 0;
			});
			if($scope.type == "edit"){
				$scope.EditOsRourceData.sort(function(a,b){
					if(a.placeindex>b.placeindex){
						return 1;
					}
					return 0;
				});
			}
		}
		
		//获取权限authen
		$scope.authenCheck = function(){
			angular.forEach($scope.OsRourceData,function(items,key){
				angular.forEach($scope.result,function(val,index){
					if(items.resourceid == val.resourceid){
						$scope.convert(val.authen);
						items.authenData = $scope.conData;
					}
				})
				if(items.resourceid == 0){
					items.authenData = [];
				}
			})
		}
		
		//权限字母和文字转换
		$scope.convert = function(item){
			$scope.Array = [];
			$scope.conData = [];
			$scope.Array = item.split(",");
			angular.forEach($scope.Array,function(val,key){
				var obj = {}
				if(val == "r"){
					obj.id = 1;
					obj.text = "读取";
				}else if(val == "c"){
					obj.id = 2;
					obj.text = "创建";
				}else if(val == "u"){
					obj.id = 3;
					obj.text = "编辑";
				}else if(val == "d"){
					obj.id = 4;
					obj.text = "删除";
				}else if(val == "a"){
					obj.id = 5;
					obj.text = "审核";
				}else if(val == "i"){
					obj.id = 6;
					obj.text = "导入";
				}else if(val == "e"){
					obj.id = 7;
					obj.text = "导出";
				}else if(val == "p"){
					obj.id = 8;
					obj.text = "支付";
				}
				$scope.conData.push(obj);
			})
		}
		
		//编辑资源名称
		$scope.EditReName = function(item){
			if($scope.type="edit"){
				angular.forEach($scope.EditOsRourceData,function(val,key){
					if(item.resourceid == val.resourceid){
						val.resourcename = item.resourcename;
					}
				})
			}
		}
	} 
])