angular.module('masgetWebApp.Prepayment')
.controller('PrepaymentController',['$scope', '$stateParams','$state', 'utils','$modal','$alert','$http','$timeout','$window','session','uiGridConstants','i18nService',
    function ($scope,$stateParams, $state, utils,$modal,$alert,$http,$timeout,$window,session,uiGridConstants,i18nService) {
		$scope.session = session;
		//ui-grid 分页汉化
		i18nService.setCurrentLang('zh-cn');
		
		var dayTime=60*60*24*1000*7;
		var afTime=60*60*24*1000*1;
		var backTime=new Date().getTime()-dayTime;
		var afterTime=new Date().getTime()+afTime;
		$scope.watergetData={
			begincreatedtime:new Date(backTime).format("yyyy-MM-dd"),
			endcreatedtime:new Date(afterTime).format("yyyy-MM-dd"),
			pagesize:10,
			pagenum:1
		}
		
		//查询钱包数据
		$scope.walletget = function(){
			var obj = {
				objectid:$scope.session.companyid,
				wallettypeid:3
			}
			utils.query('/jsbweb/enterprise/PrepaymentManagement/walletget.do',{type:'POST',data:{data:JSON.stringify(obj)}},true).then(function (resp) {
				$scope.walletData = resp.data.rows[0];
				$scope.waterget();
			},function(resp){
				console.info(11)
			});
		}

		//查询支付流水
		$scope.waterget = function(){
			var obj = {
				pagenum:$scope.watergetData.pagenum,
				pagesize:$scope.watergetData.pagesize,
				watertype:parseInt($scope.watergetData.watertype),
				walletid:$scope.walletData.walletid,
				begincreatedtime:$scope.watergetData.begincreatedtime !=null?$scope.watergetData.begincreatedtime:new Date(backTime).format("yyyy-MM-dd"),
				endcreatedtime:$scope.watergetData.endcreatedtime != null?$scope.watergetData.endcreatedtime:new Date(afterTime).format("yyyy-MM-dd")
			}
			utils.query('/jsbweb/enterprise/PrepaymentManagement/waterget.do',{type:'POST',data:{data:JSON.stringify(obj)}},true).then(function (resp) {
				angular.forEach(resp.data.rows,function(item,idx){
					if(item.watertype == 4 || item.watertype == 5 || item.watertype == 6){
						item.income = item.amount;
					}else{
						item.pay = item.amount;
					}
				})
				$scope.gridOptions.data = resp.data.rows;
				$scope.gridOptions.totalItems = resp.data.total;
			},function(resp){
				console.info(11)
			});
		}

		//支付流水
		$scope.gridOptions = {
			//显示table的th
			columnDefs: [
				{ name: '序号',field:'id', width:60,cellTemplate:
					'<div class="ui-grid-cell-contents" style="text-align:center">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
				},
				{ name: '流水号',field:'waternum'},
				{ name: '日期',field:'updatetime',
					sort: {
						direction: uiGridConstants.DESC,
						priority: 1
					}
				},
				{ name: '摘要',field:'watertype',
					cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.watertypeToName(row.entity.watertype)}}</div>'
				},
				{ name: '收款',field:'income'},
				{ name: '付款',field:'pay'},
				{ name: '余额',field:'usablebalance' },
				{ name: '备注',field:'changedesc'}
			],
			paginationPageSizes: [5, 10, 15,20,25,50,100],
			paginationPageSize: 10,
			useExternalPagination: true,
			enableGridMenu: true,
			enableColumnMenus: false,
			selectionRowHeaderWidth:40,
			onRegisterApi: function(gridApi){
				$scope.gridApi = gridApi;
				$scope.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
					if($scope.getPage) {
						$scope.getPage(newPage, pageSize);
					}
				});
			}
		};

		$scope.watertypeToName = function(orderstate){
			switch (orderstate){
				case 1:
					return "提现";
				case 2:
					return "支付付款";
				case 3:
					return "转账付款";
				case 4:
					return "充值";
				case 5:
					return "支付收款";
				case 6:
					return "转账收款";
				default :
					return "";
			}
		};

		//调用分页
		$scope.getPage = function(pagenum, pagesize) {
			$scope.watergetData.pagenum = pagenum
			$scope.watergetData.pagesize = pagesize;
			$scope.waterget();
		};
		
		//充值
		$scope.recharge = function(item){
			$scope.rechargeData = {
				rechargetype:1,
				amount:''
			}
			$modal({html:true,scope:$scope,title:"充值",template:'template/modal.html',contentTemplate:'template/recharge.html',animation:'am-fade-and-scale',callback:function(a,b,c){
				b.submitted = false;
				if(b.$invalid){
					b.submitted = true;
					$alert({title: '提示：', content:"请检查输入", placement: 'masget-top',duration:2, type: 'info', show: true});
					return false;
				}
				item.rechargeData = $scope.rechargeData;
				$scope.rechargeData.walletid = item.walletid;
				$scope.iconFlag = "add";
				$scope.context = "正在新增支付中..."
				utils.query('/jsbweb/enterprise/PrepaymentManagement/rechargeadd.do',{method:'POST',data:{data:JSON.stringify($scope.rechargeData)}},true).then(function(resp){
					if($scope.rechargeData.rechargetype == 2){
						$scope.pay($scope.rechargeData,resp.data.rechargenum);
						$alert({title: '提示：', content:"操作成功", placement: 'masget-top',duration:2, type: 'info', show: true});
					}else if($scope.rechargeData.rechargetype == 1){
						$state.broadCast = {
							item:resp.data
						};
						$state.go("pos");
					}else{
						$alert({title: '提示：', content:"支付成功", placement: 'masget-top',duration:2, type: 'info', show: true});
					}
					$scope.iconFlag = "";
					$scope.waterget();
				},function(resp){
					$scope.iconFlag = "";
					$alert({title: '提示：', content: "支付失败", placement: 'masget-top',duration:2, type: 'info', show: true});
				});
				return true;
			}})
		}

		//支付服务
		$scope.pay = function(item,value){
			var obj = {
				partnerId:5990400000000013,
				txnType:'01',
				orderId:value,
				payAmount:$scope.rechargeData.amount * 10,
				businessTime:new Date().format("yyyyMMddhhmmss"),
				frontUrl:'www.baidu.com',
				backUrl:'http://14.18.207.75:8095/webapi/rongbang/onlinepay/notify'
			}
			utils.query('/jsbweb/enterprise/PrepaymentManagement/pay.do',{method:'POST',data:{data:JSON.stringify(obj)}},true).then(function(resp){
				myWindow=window.open('','');
				myWindow.document.write(resp.message);
				myWindow.focus();
			},function(resp){
				$scope.iconFlag = "";
				$scope.button = false;
				$alert({title: '提示：', content: "支付失败", placement: 'masget-top',duration:2, type: 'info', show: true});
			});
		}

		//充值明细
		$scope.gridrechargeDetail = {
			//显示table的th
			columnDefs: [
				{ name: '序号',field:'id', width:60,cellTemplate:
					'<div class="ui-grid-cell-contents" style="text-align:center">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
				},
				{ name: '充值单号',field:'rechargenum'},
				{ name: '时间',field:'updatetime',
					sort: {
						direction: uiGridConstants.DESC,
						priority: 1
					}
				},
				{ name: '金额',field:'amount'},
				{ name: '支付方式',field:'',
					cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.rechargetypeToName(row.entity.rechargetype)}}</div>'
				},
				{ name: '状态',field:'',
					cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.rechargestatusToName(row.entity.rechargestatus)}}</div>'
				},
				{ name: '充值凭证',field:'rechargedesc' }
			],
			paginationPageSizes: [5, 10, 15,20,25,50,100],
			paginationPageSize: 10,
			useExternalPagination: true,
			enableGridMenu: true,
			enableColumnMenus: false,
			selectionRowHeaderWidth:40,
			onRegisterApi: function(gridApi){
				$scope.gridApi = gridApi;
				$scope.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
					if($scope.getPage) {
						$scope.getDetailPage(newPage, pageSize);
					}
				});
			}
		};

		//调用分页
		$scope.getDetailPage = function(pagenum, pagesize) {
			$scope.watergetData.pagenum = pagenum
			$scope.watergetData.pagesize = pagesize;
			$scope.rechargeDeCheck();
		};

		$scope.rechargetypeToName = function(orderstate){
			switch (orderstate){
				case 1:
					return "pos机";
				case 2:
					return "网银";
				case 3:
					return "线下转账";
				default :
					return "";
			}
		};

		$scope.rechargestatusToName = function(orderstate){
			switch (orderstate){
				case 1:
					return "待支付";
				case 2:
					return "充值中";
				case 3:
					return "充值成功";
				case 4:
					return "充值失败";
				default :
					return "";
			}
		};

		//充值明细查询
		$scope.rechargeDeCheck = function(){
			var obj = {
				pagenum:$scope.watergetData.pagenum,
				pagesize:$scope.watergetData.pagesize,
				objectid:parseInt($stateParams.id),
				begincreatedtime:$scope.watergetData.begincreatedtime !=null?$scope.watergetData.begincreatedtime:new Date(backTime).format("yyyy-MM-dd"),
				endcreatedtime:$scope.watergetData.endcreatedtime != null?$scope.watergetData.endcreatedtime:new Date(afterTime).format("yyyy-MM-dd")
			}
			utils.query('/jsbweb/enterprise/PrepaymentManagement/rechargeget.do',{type:'POST',data:{data:JSON.stringify(obj)}},true).then(function (resp) {
				$scope.gridrechargeDetail.data = resp.data.rows;
				$scope.gridrechargeDetail.totalItems = resp.data.total;
			},function(resp){
				console.info(11)
			});
		}

		//返回资金账户
		$scope.reset = function(){
			$state.go('list');
		}

		//订单付款
		$scope.gridorderPay = {
			//显示table的th
			columnDefs: [
				{ name: '序号',field:'id', width:60,cellTemplate:
					'<div class="ui-grid-cell-contents" style="text-align:center">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
				},
				//{ name: '支付流水号',field:'loadingbillnum',width:150},
				{ name: '时间',field:'createdtime',
					sort: {
						direction: uiGridConstants.DESC,
						priority: 1
					}
				},
				{ name: '订单号',field:'relationnum'},
				{ name: '支付单号',field:'paymentnum'},
				{ name: '金额',field:'amount'},
				//{ name: '支付方式',field:'',
				//	cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.rechargetypeToName(row.entity.rechargetype)}}</div>'
				//},
				{ name: '状态',field:'',
					cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.paystatus == 1?"成功":"失败"}}</div>'
				}
			],
			paginationPageSizes: [5, 10, 15,20,25,50,100],
			paginationPageSize: 15,
			useExternalPagination: true,
			enableGridMenu: true,
			enableColumnMenus: false,
			selectionRowHeaderWidth:40,
			onRegisterApi: function(gridApi){
				$scope.gridApi = gridApi;
				$scope.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
					if($scope.getPage) {
						$scope.getOrder(newPage, pageSize);
					}
				});
			}
		};

		//调用分页
		$scope.getOrder = function(pagenum, pagesize) {
			$scope.orderPayData.pagenum = pagenum
			$scope.orderPayData.pagesize = pagesize;
			$scope.orderPayCheck();
		};

		$scope.orderPayData = {
			pagenum:1,
			pagesize:2
		}
		//订单付款查询
		$scope.orderPayCheck = function(){
			var obj = {
				walletid:parseInt($stateParams.id),
				pagenum:$scope.orderPayData.pagenum,
				pagesize:$scope.orderPayData.pagesize,
				begincreatedtime:$scope.watergetData.begincreatedtime !=null?$scope.watergetData.begincreatedtime:new Date(backTime).format("yyyy-MM-dd"),
				endcreatedtime:$scope.watergetData.endcreatedtime != null?$scope.watergetData.endcreatedtime:new Date(afterTime).format("yyyy-MM-dd")
			}
			utils.query('/jsbweb/enterprise/PrepaymentManagement/paymentget.do',{type:'POST',data:{data:JSON.stringify(obj)}},true).then(function (resp) {
				$scope.gridorderPay.data = resp.data.rows;
				$scope.gridorderPay.totalItems = resp.data.total;
			},function(resp){
				console.info(11)
			});
		}

		if($state.current.name == 'list')
		{
			$scope.walletget();
		}
		else if($state.current.name == 'reDetail')
		{
			$scope.rechargeDeCheck();
		}
		else
		{
			$scope.watergetData.pagesize = 15;
			$scope.orderPayCheck();
		}

	}
])
