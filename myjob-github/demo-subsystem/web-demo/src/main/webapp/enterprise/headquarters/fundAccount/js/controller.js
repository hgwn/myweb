angular.module('masgetWebApp.Faccount')
.controller('FaccountController',['$scope', '$state', 'utils','$modal','$alert','$http','$timeout','$window','session','uiGridConstants','i18nService',
    function ($scope, $state, utils,$modal,$alert,$http,$timeout,$window,session,uiGridConstants,i18nService) {
		$scope.session = session;
		//ui-grid 分页汉化
		i18nService.setCurrentLang('zh-cn');
		
		var dayTime=60*60*24*1000*30;
		var afTime=60*60*24*1000*1;
		var backTime=new Date().getTime()-dayTime;
		var afterTime=new Date().getTime()+afTime;
		$scope.fundForm={
			begincreatedtime:new Date(backTime).format("yyyy-MM-dd"),
			endcreatedtime:new Date(afterTime).format("yyyy-MM-dd"),
			pageSize:15,
			pageNum:1
		}
		
		//查询所有者钱包数据
		$scope.providerget = function(){
			var obj = {
				pagesize:$scope.fundForm.pageSize,
				pageNum:$scope.fundForm.pageNum,
				objectname:$scope.fundForm.objectname
			}
			var url = "/jsbweb/enterprise/FundAccount/providerget.do"
			utils.query(url,{method:'POST',data:{data:JSON.stringify(obj)}},true).then(function(resp){
				$scope.gridOptions.data = resp.data.rows;
				$scope.gridOptions.totalItems = resp.data.total;
				$scope.sumCheck();
			},function(resp){

			});
		}

		//汇总所有者钱包数据
		$scope.sumCheck = function(){
			var obj = {}
			var url = "/jsbweb/enterprise/FundAccount/providersum.do"
			utils.query(url,{method:'POST',data:{data:JSON.stringify(obj)}},true).then(function(resp){
				$scope.sumData = resp.data !=null?resp.data:[];
			},function(resp){

			});
		}

		//新增经销商
		$scope.add = function(){
			var obj = {
				pagesize:100,
				pagenum:1
			}
			utils.query("/jsbweb/enterprise/FundAccount/subcompanyget.do",{method:'POST',data:{data:angular.toJson(obj)}},true).then(function(resp){
				$scope.addData = resp.data.rows;
			},function(resp){
				console.info(resp)
			});
		}

		//新增经销商Model
		$scope.addrecharge = {
			objecttypeid:1
		}
		$scope.addModel = function(){
			$modal({
				html:true,
				scope:$scope,
				title:"新增经销商钱包",
				template:'template/modal.html',
				contentTemplate:'template/dealer.html',
				animation:'am-fade-and-scale',
				callback:function(a,b,c){
					b.submitted = false;
					if(b.$invalid){
						b.submitted = true;
						$alert({title: '提示：', content:"请检查输入", placement: 'masget-top',duration:2, type: 'info', show: true});
						return false;
					}
					$scope.iconFlag = "add";
					$scope.context = "正在操作中..."
					utils.query("/jsbweb/enterprise/FundAccount/walletadd.do",{method:'POST',data:{data:JSON.stringify($scope.addrecharge)}},true).then(function(resp){
						$alert({title: '提示：', content:"新增成功", placement: 'masget-top',duration:2, type: 'info', show: true});
						$scope.iconFlag = "";
						$scope.providerget();
					},function(resp){
						$scope.iconFlag = "";
						$scope.button = false;
						$alert({title: '提示：', content: "新增失败", placement: 'masget-top',duration:2, type: 'info', show: true});
					});
				}})
		}

		$scope.add();
		$scope.providerget();

		//收支明细
		$scope.incomeDetail = function(item){
			$state.broadCast = {item:item}
			$state.go('incomeDetail')
		}

		//充值
		$scope.Recharge = function(item){
			$scope.rechargeDebit = {};
			$scope.rechargeDebit.objectname = item.objectname;
			$modal({html:true,scope:$scope,title:"充值",template:'template/modal.html',contentTemplate:'template/RechargeDebit.html',animation:'am-fade-and-scale',callback:function(a,b,c){
				b.submitted = false;
				if(b.$invalid){
					b.submitted = true;
					$alert({title: '提示：', content:"请检查输入", placement: 'masget-top',duration:2, type: 'info', show: true});
					return false;
				}
				$scope.iconFlag = "add";
				$scope.context = "正在操作中..."
				var obj = {
					objectid:item.objectid,
					walletid:item.walletid,
					amount:$scope.rechargeDebit.amount,
					rechargedesc:$scope.rechargeDebit.rechargedesc
				}
				utils.query('/jsbweb/enterprise/FundAccount/provideradd.do',{method:'POST',data:{data:JSON.stringify(obj)}},true).then(function(resp){
					$alert({title: '提示：', content:"充值成功", placement: 'masget-top',duration:2, type: 'info', show: true});
					$scope.iconFlag = "";
					$scope.providerget();
				},function(resp){
					$scope.iconFlag = "";
					$alert({title: '提示：', content: "充值失败", placement: 'masget-top',duration:2, type: 'info', show: true});
					return false;
				});
			}})
		}

		//扣款
		$scope.Debit = function(item){
			$modal({html:true,scope:$scope,title:"扣款",template:'template/modal.html',contentTemplate:'template/RechargeDebit.html',animation:'am-fade-and-scale',callback:function(a,b,c){
				b.submitted = false;
				if(b.$invalid){
					b.submitted = true;
					$alert({title: '提示：', content:"请检查输入", placement: 'masget-top',duration:2, type: 'info', show: true});
					return false;
				}
				$scope.iconFlag = "add";
				$scope.context = "正在操作中..."
				utils.query('/jsbweb/enterprise/FundAccount/rechargeadd.do',{method:'POST',data:{data:JSON.stringify($scope.rechargeData)}},true).then(function(resp){
					$alert({title: '提示：', content:"扣款成功", placement: 'masget-top',duration:2, type: 'info', show: true});
					$scope.iconFlag = "";
				},function(resp){
					$scope.iconFlag = "";
					$scope.button = false;
					$alert({title: '提示：', content: "扣款失败", placement: 'masget-top',duration:2, type: 'info', show: true});
				});
			}})
		}

		$scope.gridOptions = {
			//显示table的th
			columnDefs: [
				{ name: '序号',field:'id', width:60,cellTemplate:
					'<div class="ui-grid-cell-contents" style="text-align:center">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
				},
				{name:'操作', field:'',
					cellTemplate: '<div class="ui-grid-cell-contents">' +
					'<a href="" class="link_edit" ng-click="grid.appScope.incomeDetail(row.entity)">收支明细</a>' +
					'&nbsp;&nbsp;<a href="" class="link_edit" ng-click="grid.appScope.Recharge(row.entity)">充值</a>' +
					//'&nbsp;&nbsp;<a href="" class="link_edit" ng-click="grid.appScope.Debit(row.entity)">扣款</a>' +
					'</div>'
				},
				{ name: '经销商名称',field:'objectname',
					sort: {
						direction: uiGridConstants.DESC,
						priority: 1
					}
				},
				{ name: '账户编号',field:'walletno'},
				{ name: '余额',field:'usablebalance'	},
			],
			paginationPageSizes: [5, 10, 15,20,25,50,100],
			paginationPageSize: 15,
			useExternalPagination: true,
			enableGridMenu: true,
			enableColumnMenus: false,
			onRegisterApi: function(gridApi){
				$scope.gridApi = gridApi;
				$scope.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
					if($scope.getPage) {
						$scope.getPage(newPage, pageSize);
					}
				});
			}
		};

		$scope.getPage = function(pagenum, pagesize) {
			$scope.fundForm.pageNum = pagenum
			$scope.fundForm.pageSize = pagesize;
			$scope.providerget();
		};
	}
])
