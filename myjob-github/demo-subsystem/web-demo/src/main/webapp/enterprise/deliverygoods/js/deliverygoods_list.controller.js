
entDeliverygoodsModule.controller("deliverygoodsListController",
		['$scope','$http',"$stateParams","$state","$rootScope",function($scope, $http,$stateParams,$state,$rootScope) {
	
	//定义表单数据对象
	$scope.formData={pageNum:1,pageSize:10};
	
	$state.delivery=null;
	
	$rootScope.isShowList=false;
	
	//查询发货单信息
	$scope.queryForm=function(state){
		if(state==1){
			$scope.formData.pageNum=1;
		}
		$http({
			method : 'POST',
			url :"/jsbweb/enterprise/deliverygoods/query.do",
			data : $.param($scope.formData),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data) {
			$scope.deliverys=data;
			$scope.deliverygoodsGrid.gridOptions.data=[];
			if(data.data != null && data.data.rows != null){
				$scope.deliverygoodsGrid.gridOptions.data = data.data.rows;
			}
		});
	};
	
	//ui-grid配置
	$scope.deliverygoodsGrid = {};
	$scope.deliverygoodsGrid.gridOptions = {
            useExternalSorting: true,
            enableColumnMenus: false,
            enableRowSelection: true,
            enableSelectAll: true,
            selectionRowHeaderWidth: 35,
            columnDefs: [
                { name: '序号',field:'id', width:60,cellTemplate:
                	'<div class="ui-grid-cell-contents" style="text-align:center">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
                },
                { name:'操作', field:'', width: 100,
                    cellTemplate: '<div class="ui-grid-cell-contents">' +
                    '<a href="javascript:;" class="link_edit" ng-click="grid.appScope.view(row.entity)">查看 </a> '+
    				'<a href="javascript:;" class="link_edit" ng-click="grid.appScope.edit(row.entity)" ng-if="row.entity.deliverystate<4">修改 </a>'+ 
    				'<a href="javascript:;" class="link_edit" ng-click="grid.appScope.deleteDelivery(row.entity)" ng-if="row.entity.deliverystate<4">删除</a>'+ 
                    '</div>'
                },
                { name: '发货单号',field:'deliverynum' , width:140},
                { name: '开单时间',field:'createdtime' , width:130, cellTemplate:
                    '<div class="ui-grid-cell-contents">{{row.entity.createdtime|limitTo:19}}</div>'
                },
                { name: '状态',field:'statename', width:90},
                { name: '来源',field:'datasource', width:80,cellTemplate:
                	 '<div class="ui-grid-cell-contents">{{row.entity.datasource==1?"手工开单":row.entity.datasource==2?"出库单":row.entity.datasource==3?"售货单":""}}</div>'
                },
                { name: '发货人',field:'enlinkername', width:120},
                { name: '发货地址',field:'sendaddress', width:120},
                { name: '发货人电话',field:'enlinkerphone', width:100},
                { name: '收货人',field:'recvlinkername', width:120},
                { name: '收货人地址',field:'recvaddress', width:120},
                { name: '收货人电话',field:'recvlinkerphone', width:100},
                { name: '提货方式',field:'deliverytype', width:80,cellTemplate:
                	'<div class="ui-grid-cell-contents">{{row.entity.deliverytype==1?"送货上门":"收货方自提"}}</div>'
                },
                { name: '送货方式',field:'consignmenttype', width:80,cellTemplate:
                	'<div class="ui-grid-cell-contents">{{row.entity.consignmenttype==1?"物流上门收货":"货主送货"}}</div>'
                }
            ]
        };
	
	$scope.queryForm();
	
	//编辑发货单信息
	$scope.edit=function(delivery){
		$state.go("edit");
		$state.isView=false;
		$state.delivery=delivery;
	};
	
	//查看发货单信息
	$scope.view=function(delivery){
		$state.go("edit");
		$state.isView=true;
		$state.delivery=delivery;
	};
	
	//删除发货单信息
	$scope.deleteDelivery=function(delivery){
		var deliveryid=delivery.deliveryid;
		var submit = function (v, h, f) {
		    if (v == 'ok') {
		        $.jBox.tip("正在删除数据...", 'loading');
		        $http({
					method : 'POST',
					url : "/jsbweb/enterprise/deliverygoods/delete/"+deliveryid+".do",
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).success(function(data) {
					if(data.ret==0){
						$scope.queryForm();
						$.jBox.tip('删除成功', 'success'); 
					}
					if(data.ret==10){
						$.jBox.tip("请先登录", 'warning');
					}
				});
		    }
		    return true; //close
		};
		$.jBox.confirm("确定要删除托运单   "+delivery.deliverynum+" 吗？", "温馨提示", submit);
	};
}]);


