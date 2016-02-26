/**
 * 
 */
entWarehouseoutModule.controller('warehouseoutAddController',
		['$state','$scope','$rootScope','$http','$alert','$timeout', "i18nService",'masgetwebUtilService',
function($state, $scope, $rootScope, $http, $alert, $timeout, i18nService, masgetwebUtilService){
		i18nService.setCurrentLang('zh-cn');
		$scope.formData = {sourceflag:2};
		$scope.sourceflags = [
		                      { id: 2, value: "其他出库" },
		                      { id: 3, value: "盘亏" }
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
		          { name: '商品编码', enableCellEdit: false, width:'10%', field: 'goodssn'},
			      { name: '商品', enableCellEdit: false, width:'20%', field: 'goodsname'},
//			      { name: '出库单价', enableCellEdit: false,  field: 'goodsunitprice'},
			      { name: '批次号', enableCellEdit: false,  field: 'batchcode',
		    	  	  cellTemplate: '<input type="" class="form-control"  ng-model="row.entity.batchcode" ng-if="row.entity.issernum == 2||row.entity.isbatchcode == 2" ng-click="grid.appScope.selectOutCount(grid.renderContainers.body.visibleRowCache.indexOf(row),row.entity)" />'
                  },
                  { name: '库存数', enableCellEdit: false,  field: 'inventoryqty'},
			      { name: '出库数量', enableCellEdit: true, field: 'goodsqty',type:"number", min:1},
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
			if(sourceflag==1){
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
		
		//选择批次或者序列号
		$scope.selectOutCount = function(index,entity){
			var sourceflag=$scope.formData.sourceflag;
			var issernum=entity.issernum;
			var isbatchcode=entity.isbatchcode;
			/*if(issernum==2){
				$('#select_serial').modal("show");
			}else*/ 
			if(isbatchcode==2){
				$scope.selectedGoodsstockid = entity.goodsstockid;
				$('#select_batchcode').modal("show");
			}
			
			$scope.rowindex=index;
		};
		
		$scope.init = function(){
			//获取订单号
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
			if(warehouseoutlist.length == 1){
				$.jBox.messager("请选择出库商品", "温馨提示", null, { width: 350, height:100});
				$.jBox.closeTip();
				return ;
			}
			
			$scope.formData.warehouseoutlist = [];
			
			for(var i = 0; i < warehouseoutlist.length; i++){
				var row=warehouseoutlist[i];
				if(row.goodsid!=null){
					if(row.goodsqty==null){
						$.jBox.messager("请输入出库数量", "温馨提示", null, { width: 350, height:100});
						$.jBox.closeTip();
						return ;
					}
					if(row.goodsqty > row.inventoryqty){
						$.jBox.messager("第"+(i+1)+"行商品("+row.goodsname+")出库数量不能大于库存数量", "温馨提示", null, { width: 350, height:100});
						$.jBox.closeTip();
						return ;
					}
					if(row.isbatchcode == 2 && (row.batchcode == undefined || row.batchcode == "")){
						$.jBox.messager("第"+(i+1)+"行商品("+row.goodsname+")使用了批次管理,请选择对应的出库批次", "温馨提示", null, { width: 350, height:100});
						$.jBox.closeTip();
						return ;
					}
					$scope.formData.warehouseoutlist.push({
						goodsid:row.goodsid,
						goodsname:row.goodsname,
						goodssn:row.goodssn,
						barcode:row.barcode,
						goodsunitprice:row.goodsunitprice,
						goodsqty:row.goodsqty,
						batchcode:row.batchcode,
						producetime:row.producetime,
						vailddate:row.vailddate
					});
				}
			};
			
			//默认审核通过
			$scope.formData.state=2;
			
			console.log($scope.formData);
			masgetwebUtilService.httpPost("/jsbweb/enterprise/stock/warehouseout/add.do", 
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
		
		//选择商品确认后返回的方法
		$scope.getSelectedGoodsData = function(data){
			var warehouseoutlist = $scope.warehouseoutlist;
			//删除最后一条数据，因为最后一条是空的
			warehouseoutlist.pop();
			
			for(var index = 0; index < data.length; index++){
				var flag = false;
				for(var jIndex = 0 ; jIndex < warehouseoutlist.length; jIndex++){
					if(warehouseoutlist[jIndex].goodsid == data[index].goodsid){
						//warehouseoutlist[jIndex].goodssoundqty++;
						flag = true;
						break;
					}
				}
				if(!flag){
					//data[index].goodssoundqty = 1;
					warehouseoutlist.push(data[index]);
				}
			}
			warehouseoutlist.push({});
			$scope.warehouseoutlist = warehouseoutlist;
			$scope.gridOption.data = $scope.warehouseoutlist;
			console.log($scope.warehouseoutlist)
		};

		//选择批次号确认后返回的方法
		$scope.getSelectedBatchcodeData = function(data){
			var warehouseoutlist = $scope.warehouseoutlist;
			warehouseoutlist.pop();
			for(var i = 0; i < data.length; i++){
				//如果是同一商品并且批次号已经存在则不添加
				for(var j = 0 ; j < warehouseoutlist.length; j++){
					if(warehouseoutlist[$scope.rowindex].goodsid == warehouseoutlist[j].goodsid
						&&	warehouseoutlist[j].batchcode == data[i].batchcode){
						data[i].flag="1";
						break;
					}else{
						data[i].flag="0";
					}
				}
			}
			for(var i = 0; i < data.length; i++){
				if(data[i].flag=="0"){
					if(warehouseoutlist[$scope.rowindex].batchcode==null||warehouseoutlist[$scope.rowindex].batchcode==""){
						warehouseoutlist[$scope.rowindex].batchcode = data[0].batchcode;
						warehouseoutlist[$scope.rowindex].producetime = data[0].producetime;
						warehouseoutlist[$scope.rowindex].vailddate = data[0].vailddate;
						warehouseoutlist[$scope.rowindex].inventoryqty = data[0].inventoryqty;
					}else{
						warehouseoutlist.push({
	    					goodsname:warehouseoutlist[$scope.rowindex].goodsname,
	    					goodssn:warehouseoutlist[$scope.rowindex].goodssn,
	    					barcode:warehouseoutlist[$scope.rowindex].barcode,
	    					goodsid:warehouseoutlist[$scope.rowindex].goodsid,
	    					goodsspec:warehouseoutlist[$scope.rowindex].goodsspec,
							goodsunitprice:warehouseoutlist[$scope.rowindex].goodsunitprice,
							issernum:warehouseoutlist[$scope.rowindex].issernum,
							isbatchcode:warehouseoutlist[$scope.rowindex].isbatchcode,
							goodsstockid:warehouseoutlist[$scope.rowindex].goodsstockid,
							inventoryqty:data[i].inventoryqty,
							batchcode:data[i].batchcode,
							producetime:data[i].producetime,
							vailddate:data[i].vailddate
	    				});
					}
				}
			}
			console.log(warehouseoutlist);
			warehouseoutlist.push({});
			$scope.warehouseoutlist = warehouseoutlist;
			$scope.gridOption.data = $scope.warehouseoutlist;
		};

}]);