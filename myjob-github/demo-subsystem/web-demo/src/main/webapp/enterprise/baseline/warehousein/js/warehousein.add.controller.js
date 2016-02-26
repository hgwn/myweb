/**
 * 
 */
masgetWebApp.controller('warehouseinAddController',
		['$state','$scope','$rootScope','$http','$alert','$timeout', "i18nService", "warehouseinService",'masgetwebUtilService',
function($state, $scope, $rootScope, $http, $alert, $timeout, i18nService, warehouseinService, masgetwebUtilService){
		
		i18nService.setCurrentLang('zh-cn');
		$scope.formData = {sourceflag:2};
		$scope.sourceflag = [
		         {sourceflag:2, sourceflagname:"手工入库"},
		         {sourceflag:3, sourceflagname:"盘盈"}
	    ];
		//供应商下拉表格start
		$scope.getSuppliers = function(key){
			var params = {};
			params.pagesize = 1000;
			params.pagenum = 1;
			warehouseinService.httpPost(warehouseinService.getAllReverseSuppliers(),{data : angular.toJson(params)},function(resp){
				$scope.formData.datas = resp.data.rows;
			});	
		};
	    $scope.query = function () {
	    	$scope.formData.keyWord=$scope.formData.keyWord==null?"":$scope.formData.keyWord;
	        $scope.getSuppliers();
	    };
	    $scope.$watch("supplier",function(){
	    	console.log($scope.supplier);
	    });
	    //在comboxtable里的文本框输入时触发的方法
	    $scope.onReset = function(){
	    	$scope.supplier={};
	    };
	    //供应商下拉表格end
		$scope.gridOption = {
	          paginationPageSizes: [10, 20, 50, 100],
	          paginationPageSize: 20,
	          enableColumnMenus: false,
	          enableGridMenu: true,
	          enableCellEdit:true,
	          enableCellEditOnFocus: true,
	          enableSorting: false,
		      columnDefs: [
		          { name: '序号', field:'id',type:'text',enableCellEdit: false, enableHiding: false,
		        	    enableColumnResizing:false, width:'55', 
		        	  cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},           
			      { name: '操作', field:'action',enableCellEdit: false, enableColumnResizing:false, width:'55',enableHiding: false,
		        		  cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">' +
		                      '<a style="cursor:pointer;" ng-click="grid.appScope.addList(grid.renderContainers.body.visibleRowCache.indexOf(row))" title="新增行" ng-if="row.entity.goodsid == undefined"><span class="glyphicon glyphicon-plus"></span></a>' +
		                      '<a style="cursor:pointer;" ng-click="grid.appScope.deleteList(grid.renderContainers.body.visibleRowCache.indexOf(row))" title="删除行"  ng-if="row.entity.goodsid != undefined"><span class="glyphicon glyphicon-minus"></span></a>' +
		                      '</div>'
		          },
			      { name: '商品编码', enableCellEdit: false,width:'10%', field: 'goodssn'},
			      { name: '商品', enableCellEdit: false, field: 'productname'},
			      { name: '商品条形码',enableCellEdit: false, width:'10%', field: 'barcode'},
			      { name: '商品规格', enableCellEdit: false,width:'15%', field: 'goodsspec'},
			      { name: '是否使用批次', width:'8%', enableCellEdit: false, enableHiding: false, field: 'productstockconfig.isbatchcodeName'},
			      { name: '批次号', width:'15%', enableHiding: false, enableCellEdit: false,
			    	  cellTemplate: '<input type="" class="form-control" style="border: 3px solid #F10505;" ng-model="row.entity.batchcode" ng-if="row.entity.productstockconfig.isbatchcode == 2"/>'},
			      { name: '入库数量', width:'100',field: 'goodsqty', enableHiding: false, type:"number", min:1,enableCellEdit: true},
			      { name: '备注', width:'100', field: 'remark', type:'text'}  
		      ],
	            onRegisterApi: function(gridApi) {
	                $scope.gridApi = gridApi;
	                gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
	                	if(rowEntity.productstockconfig.isbatchcode == 1){
	                		colDef.enableCellEdit = false;
	                	}
	                	$scope.$apply();
	                });
	            }
		};
		
		$scope.warehouseinlist = [];
		
		
		$scope.addList = function(index){
			console.log(index);
//			$scope.warehouseinlist.splice(index+1, 0, {});
			$('#viewModal-select-goods').modal("show");
		};
		//删除库存list元素
		$scope.deleteList = function(index){
			$scope.warehouseinlist.splice(index, 1);
			if($scope.warehouseinlist.length == 0){
				$scope.warehouseinlist.push({});
			}
		};
		//初始化
		$scope.init = function(){
			masgetwebUtilService.getOrderNum("308", function(data){
				if(data == undefined){
					$alert({title: '提示：', content: '入库单号生成失败!', placement: 'masget-top',type: 'info', duration:2, show: true});
					//$scope.formData.warehouseinnum = "2010000000";
				}else{
					$scope.formData.warehouseinnum = data;
				}
			}, function(data){
				
			});
			
			$scope.warehouseinlist.push({});
			$scope.gridOption.data = $scope.warehouseinlist;
		};
		
		$scope.init();
		//提交新增库存
		$scope.onClickToAddWarehousein = function(){
			var WarehouseInflag = true;
			var warehouseinlist = $scope.warehouseinlist;
			if($scope.supplier != undefined){
				$scope.formData.supplierid = $scope.supplier.companyid;
				$scope.formData.suppliername = $scope.supplier.companyname;
			}
			if(warehouseinlist.length == 0){
				$alert({title: '提示：', content: '请选择入库商品!', placement: 'masget-top',type: 'info', duration:2, show: true});
				return ;
			}
			//清除{}元素
			if(warehouseinlist[warehouseinlist.length-1].goodsid == undefined)
				warehouseinlist.pop();
			console.log(warehouseinlist);
			//数据校验
			angular.forEach(warehouseinlist,function(data,index){
				warehouseinlist[index].goodsstockconfig = warehouseinlist[index].productstockconfig;
				if(data.productstockconfig.isbatchcode == 2 && (data.batchcode == undefined || data.batchcode == "")) {
					WarehouseInflag = false;
				}
			});
			if(!WarehouseInflag){
				$alert({title: '提示：', content: '使用了批次号的商品需要填写批次号!', placement: 'masget-top',type: 'info', duration:3, show: true});
				return;
			}
			$scope.formData.warehouseinlist = warehouseinlist;
			//入库单状态  1-新增，待审核
			$scope.formData.state = 2;
			warehouseinService.httpPost(warehouseinService.getAddWarehouseinUrl(), 
					{data: angular.toJson( $scope.formData)}, function(data){
            	if(data.ret == 0){
            		$alert({title: '提示：', content: '商品入库成功!', placement: 'masget-top',type: 'info', duration:1, show: true});
            		$state.go("warehousein");
            	}else if(data.ret == 10){
                	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
                }else{
            		$alert({title: '提示：', content: '商品入库异常,'+data.message, placement: 'masget-top',type: 'info', duration:2, show: true});
            	}
			});
		};
		//确认选择商品后触发方法
		$scope.getSelectedGoodsData = function(data){
			//var warehouseinlist保存旧数据
			var warehouseinlist = $scope.warehouseinlist;
			//清掉{}元素
			warehouseinlist.pop();
			for(var index = 0; index < data.length; index++){
				var flag = false;
				//选择商品前与选择商品后两两进行比较，相同的则合并
				for(var jIndex = 0 ; jIndex < warehouseinlist.length; jIndex++){
					if(warehouseinlist[jIndex].goodsid == data[index].goodsid){
						warehouseinlist[jIndex].goodsqty++;
						flag = true;
						break;
					}
				}
				//某个新数据跟旧数据不同则将新数据添加到库存list中
				if(!flag){
					data[index].goodsqty = 1;
					warehouseinlist.push(data[index]);
				}
			}
			warehouseinlist.push({});
			$scope.warehouseinlist = warehouseinlist;
			$scope.gridOption.data = $scope.warehouseinlist;
		};
}]);