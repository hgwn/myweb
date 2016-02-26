/**
 * 
 */
entWarehouseoutModule.controller('warehouseoutAddController',
		['$state','$scope','$rootScope','$http','$alert','$timeout', "i18nService",'masgetwebUtilService',
function($state, $scope, $rootScope, $http, $alert, $timeout, i18nService, masgetwebUtilService){
		i18nService.setCurrentLang('zh-cn');
		$scope.formData = {sourceflag:1};
		$scope.sourceflags = [
		                      { id: 1, value: "手工出库" },
		                      { id: 2, value: "订单出库" },
		                      { id: 3, value: "退货出库" },
		                      { id: 4, value: "盘亏出库" }
		                  ];
		
		$scope.gridOption = {
	          paginationPageSizes: [10, 20, 50, 100],
	          paginationPageSize: 20,
	          enableColumnMenus: false,
	          enableGridMenu: true,
	          enableCellEdit:true,
	          enableCellEditOnFocus: true,
	          enableSorting: false,
		      columnDefs: [
		          { name: '序号', field:'id',type:'text',enableCellEdit: false,enableHiding: false,
		        	    enableColumnResizing:false, width:'55', 
		        	  cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},           
			      { name: '操作', field:'action',enableCellEdit: false, enableColumnResizing:false, width:'55',enableHiding: false,
		        		  cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">' +
		                      '<a style="cursor:pointer;" ng-click="grid.appScope.addList(grid.renderContainers.body.visibleRowCache.indexOf(row))" title="选择商品" ng-if="row.entity.goodsid == undefined"><span class="glyphicon glyphicon-plus"></span></a>' +
		                      '<a style="cursor:pointer;" ng-click="grid.appScope.deleteList(grid.renderContainers.body.visibleRowCache.indexOf(row))" title="删除行"  ng-if="row.entity.goodsid != undefined"><span class="glyphicon glyphicon-minus"></span></a>' +
		                      '</div>'
		          },
			      { name: '商品', enableCellEdit: false, width:'20%', field: 'goodsname'},
			      { name: '出库单价', enableCellEdit: false, width:'20%', field: 'goodsunitprice'},
			      { name: '出库数量', width:'100',field: 'goodsqty',type:"number", min:1},
			      { name: '备注',  field: 'remark', type:'text'}
		      ],
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
                gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                    $scope.$apply();
                });
            }
		};
		
		$scope.warehouseoutlist = [];
		
		
		$scope.addList = function(index){
			var sourceflag=$scope.formData.sourceflag;
			if(sourceflag==2){
				$('#viewModal-select-orders').modal("show");
			}else{
				$('#viewModal-select-goods').modal("show");
			}
		};
		
		$scope.deleteList = function(index){
			$scope.warehouseoutlist.splice(index, 1);
			if($scope.warehouseoutlist.length == 0){
				$scope.warehouseoutlist.push({});
			}
		};
		
		$scope.init = function(){
			masgetwebUtilService.getOrderNum("309", function(data){
				if(data == undefined){
					$scope.formData.warehouseoutnum = "2010000000";
				}else{
					$scope.formData.warehouseoutnum = data;
				}
			}, function(data){
				
			});
			
			$scope.warehouseoutlist.push({});
			
			$scope.gridOption.data = $scope.warehouseoutlist;
		};
		
		$scope.init();
		
		//点击提交
		$scope.onClickToAddWarehouseout = function(){
			var warehouseoutlist = $scope.warehouseoutlist;
			/*if(warehouseoutlist[warehouseoutlist.length-1].goodsid == undefined)
				warehouseoutlist.pop();*/
			if(warehouseoutlist.length == 1){
				alert("请选择入库商品");
				return ;
			}
			
			$scope.formData.warehouseoutlist = [];
			
			angular.forEach(warehouseoutlist, function(row){
				if(row.goodsid!=null){
					$scope.formData.warehouseoutlist.push({
						goodsid:row.goodsid,
						goodsunitprice:row.goodsunitprice,
						goodsqty:row.goodsqty
					});
				}
			});
			
			console.log($scope.formData);
			masgetwebUtilService.httpPost("/jsbweb/enterprise/baseline/warehouseout/add.do", 
					{data: angular.toJson($scope.formData)}, function(data){
						
				console.log(data);
				if(data.ret==0){
					$.jBox.messager("成功生成出库单", "温馨提示", null, { width: 350, height:100});
					$.jBox.closeTip();
					$timeout(function(){
						$state.go("warehouseout");
					},1500);
				}else{
					$.jBox.messager(data.message, "温馨提示", null, { width: 350, height:100});
					$.jBox.closeTip();
				}
			});
		};
		
		$scope.getSelectedGoodsData = function(data){
			var warehouseoutlist = $scope.warehouseoutlist;
			warehouseoutlist.pop();
			
			for(var index = 0; index < data.length; index++){
				var flag = false;
				for(var jIndex = 0 ; jIndex < warehouseoutlist.length; jIndex++){
					if(warehouseoutlist[jIndex].goodsid == data[index].goodsid){
						warehouseoutlist[jIndex].goodssoundqty++;
						flag = true;
						break;
					}
				}
				if(!flag){
					data[index].goodssoundqty = 1;
					warehouseoutlist.push(data[index]);
				}
			}
			warehouseoutlist.push({});
			$scope.warehouseoutlist = warehouseoutlist;
			$scope.gridOption.data = $scope.warehouseoutlist;
			console.log($scope.warehouseoutlist)
		}
		
		
		

}]);