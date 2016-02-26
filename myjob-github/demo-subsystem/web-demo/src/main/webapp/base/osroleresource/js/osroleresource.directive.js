angular.module('masgetWebApp.osroleresource')
.directive('onFinishRenderFilters', function ($timeout, $q, $sce, utils, $state, $popover,$http) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
        	$scope.aa={};
            if(attr.onFinishRenderFilters == "edit"){
            	if($scope.type == "edit"){
            		$scope.isFlag = true;
            	}else{
            		$('#comtree').combotree({data:[]});
            	}
            	$timeout(function(){
        			$('#baseResource').combotree({
        				data:$scope.result,
        				onChange:function(val,item,index){
        					if($scope.notNewBulid && $scope.notNewBulid!=undefined){
         						$scope.$parent.notNewBulid = false;
         						return;
         					}
        					if($scope.removeEditFlag && $scope.removeEditFlag!=undefined){
        						$scope.$parent.removeEditFlag = false;
        					}else{
        						$scope.addToWayStationList();
        					}
        				},
        				onCheck:function(item){
        					if(item._checked){
        						$scope.checkFlag = true;
        						$scope.reArray = [];
        						$scope.Array = [];
								if(item.authen == ""){
									$scope.reArray = []
								}else{
									$scope.Array = item.authen.split(",");
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
										obj.resourceid = item.resourceid;
										$scope.reArray.push(obj);
									})
								}
        					}
        				}
        			});
        			if($scope.type == "add"){
        				$('#baseResource').combotree('setValue',  ''); 
        			}
        		
            		var editData = [];
            		$scope.$watch('OsRourceData.length', function () {
            			$timeout(function(){
            				$scope.editFlag = true;
							angular.forEach($scope.OsRourceData,function(item,key){
								$scope.resourceFlag = true;
                    			var auArray = [];
                    			var authenText = [];
								if(item.resourceid >= 10000000000){
									$scope.resourceFlag = false;
								}
                    			if($scope.type == "edit" && $scope.editFlag && $scope.isFlag && $scope.resourceFlag){
                    				var obj = item.resourceid;
                    				editData.push(obj);
                    				auArray = item.authen.split(",");
                    				angular.forEach(auArray,function(authenitem,key){
        								if(authenitem == "r"){
        									authenitem = '1';
        								}else if(authenitem == "c"){
        									authenitem = '2';
        								}else if(authenitem == "u"){
        									authenitem = '3';
        								}else if(authenitem == "d"){
        									authenitem = '4';
        								}else if(authenitem == "a"){
        									authenitem = '5';
        								}else if(authenitem == "i"){
        									authenitem = '6';
        								}else if(authenitem == "e"){
        									authenitem = '7';
        								}else if(authenitem == "p"){
        									authenitem = '8';
        								}
        								authenText.push(authenitem);
        							})
                    			}
                    			var resourceid = item.resourceid;
                    			if($scope.type == "add" || $scope.checkFlag&&$scope.checkFlag != undefined ){
									$('#'+resourceid).combotree({
										data: $scope.reArray,
										onChange:function(val){
											var authenText = [];
											angular.forEach(val,function(authenitem,key){
												if(authenitem == "1"){
													authenitem = 'r';
												}else if(authenitem == "2"){
													authenitem = 'c';
												}else if(authenitem == "3"){
													authenitem = 'u';
												}else if(authenitem == "4"){
													authenitem = 'd';
												}else if(authenitem == "5"){
													authenitem = 'a';
												}else if(authenitem == "6"){
													authenitem = 'i';
												}else if(authenitem == "7"){
													authenitem = 'e';
												}else if(authenitem == "8"){
													authenitem = 'p';
												}
												authenText.push(authenitem);
											})
											var auText = authenText.join();
											item.authen = auText;
											if($scope.type == "edit"){
												angular.forEach($scope.EditOsRourceData,function(val,index){
													if(item.resourceid == val.resourceid && item.authen != val.authen){
														val.authen = item.authen;
													}
												})
											}
										}
									});
                    			}else{
                    				$('#'+resourceid).combotree({
                    					data: item.authenData,
                    					onChange:function(val){
                    						var authenText = [];
                    						angular.forEach(val,function(authenitem,key){
                    							if(authenitem == "1"){
                    								authenitem = 'r';
                    							}else if(authenitem == "2"){
                    								authenitem = 'c';
                    							}else if(authenitem == "3"){
                    								authenitem = 'u';
                    							}else if(authenitem == "4"){
                    								authenitem = 'd';
                    							}else if(authenitem == "5"){
                    								authenitem = 'a';
                    							}else if(authenitem == "6"){
                    								authenitem = 'i';
                    							}else if(authenitem == "7"){
                    								authenitem = 'e';
                    							}else if(authenitem == "8"){
                    								authenitem = 'p';
                    							}
                    							authenText.push(authenitem);
                    						})
                    						var auText = authenText.join();
                    						item.authen = auText;
                    						if($scope.type == "edit"){
                    							angular.forEach($scope.EditOsRourceData,function(val,index){
                    								if(item.resourceid == val.resourceid && item.authen != val.authen){
                    									val.authen = item.authen;
                    								}
                    							})
                    						}
                    					}
                    				});
                    			}
                    			$('#child'+resourceid).combotree({
                    				data: [{ "id":100, "text": "打开功能"},
                    				       { "id":101, "text": "分组无动作"},
                    				       { "id":102, "text": "取资源"},
                    				       { "id":103, "text": "取商圈节点"},
                    				       { "id":104, "text": "取人脉节点"},
                    				       { "id":105, "text": "虚拟账号"}],
                    				       onChange:function(val){
                    				    	    item.childnodetype = val;
                    				    	    if($scope.type == "edit"){
                    				    	    	angular.forEach($scope.EditOsRourceData,function(val,index){
                    				    	    		if(item.resourceid == val.resourceid && item.childnodetype != val.childnodetype){
                    				    	    			val.childnodetype = item.childnodetype;
                    				    	    		}
                    				    	    	})
                    				    	    }
                    				       }
                    			});

                    			if($scope.editFlag&&$scope.type == "edit"&& $scope.isFlag && $scope.resourceFlag){
                    				$('#'+resourceid).combotree('setValues',  authenText);
                    			}else{
                    				if(item.authen == undefined ||item.authen == null||item.authen == ""){
                    					item.authen = "";
                    				}else{
                    					auArray = item.authen.split(",");
                        				angular.forEach(auArray,function(authenitem,key){
            								if(authenitem == "r"){
            									authenitem = '1';
            								}else if(authenitem == "c"){
            									authenitem = '2';
            								}else if(authenitem == "u"){
            									authenitem = '3';
            								}else if(authenitem == "d"){
            									authenitem = '4';
            								}else if(authenitem == "a"){
            									authenitem = '5';
            								}else if(authenitem == "i"){
            									authenitem = '6';
            								}else if(authenitem == "e"){
            									authenitem = '7';
            								}else if(authenitem == "p"){
            									authenitem = '8';
            								}
            								authenText.push(authenitem);
            							})
            							$('#'+resourceid).combotree('setValues',  authenText);
                    				}
                    			}
                    			if(item.childnodetype!=null&&item.childnodetype!=""&&item.childnodetype!=undefined){
                    				$('#child'+resourceid).combotree('setValue',  item.childnodetype);
                    			}else{
                    				$('#child'+resourceid).combotree('setValue',  100);
                    			}

                    			if($scope.OsRourceData.length-1 == key && $scope.editFlag && $scope.isFlag){
                    				$('#baseResource').combotree('setValues',  editData);
                        			$scope.editFlag = false;
                        			$scope.isFlag = false;
                    			}
                    		})
						},100)
            		});
            	})   
            	
            	$scope.$watch('osresource.companytypeid', function () {
            		if($scope.osresource.roletypeid == null||$scope.osresource.roletypeid ==""||$scope.osresource.roletypeid == undefined){
            			return;
            		}
            		$scope.check();
            	})
            	
            	$scope.$watch('osresource.roletypeid', function () {
            		if($scope.osresource.companytypeid == null||$scope.osresource.companytypeid ==""||$scope.osresource.companytypeid == undefined){
            			return;
            		}
            		$scope.check();
            	})
            }
        }
    };
})