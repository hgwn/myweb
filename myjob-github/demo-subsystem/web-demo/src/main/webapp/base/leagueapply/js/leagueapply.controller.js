angular.module('masgetWebApp.leagueapply')
.controller('leagueapplyCtr',['$scope', '$state', 'utils','$modal','$alert','$http','$timeout','session','stationData','platformData','i18nService',
    function ($scope, $state, utils,$modal,$alert,$http,$timeout,session,stationData,platformData,i18nService) {
		$scope.listFlag = true;
		$scope.auditFlag = false;
		$scope.stationData = stationData;
		$scope.platformData = platformData;
		//ui-grid 分页汉化
		i18nService.setCurrentLang('zh-cn');

		//时间戳的计算
		var dayTime=60*60*24*1000*1;
		var beforeTime=60*60*24*1000*30;
		var backTime=new Date().getTime()+dayTime;
		var backbeTime = new Date().getTime()-beforeTime;

		$scope.leagueapplyList = {
			screatedtime:new Date(backbeTime).format("yyyy-MM-dd"),
			ecreatedtime:new Date(backTime).format("yyyy-MM-dd"),
			state:"",
			pageSize:15,
			pageNum:1
		}

		$scope.Check = function(){
			var obj = {};
			obj.pagenum = $scope.leagueapplyList.pageNum;
			obj.pagesize = $scope.leagueapplyList.pageSize;
			if($scope.leagueapplyList.state != null && $scope.leagueapplyList.state != ""){
				obj.state = $scope.leagueapplyList.state;
			}
			if($scope.leagueapplyList.screatedtime != null ){
				obj.screatedtime = $scope.leagueapplyList.screatedtime;
			}else{
				obj.screatedtime = new Date(backbeTime).format("yyyy-MM-dd");
			}
			if($scope.leagueapplyList.ecreatedtime != null ){
				obj.ecreatedtime = $scope.leagueapplyList.ecreatedtime;
			}else{
				obj.ecreatedtime = new Date(backTime).format("yyyy-MM-dd");
			}
			var data ={};
			data.data = JSON.stringify(obj);
			var url = "/jsbweb/base/leagueapply/get.do";
			utils.query(url,{method:'POST',data:data}).then(function(resp){
				$scope.leagueapplyData = resp.data.rows;
				$scope.total = resp.data.total;
				$scope.gridOptions.data = resp.data.rows;
				$scope.gridOptions.totalItems = resp.data.total;
			});
		}

		$scope.gridOptions = {
			//显示table的th
			columnDefs: [
				{ name: '序号',field:'id', width:60,cellTemplate:
					'<div class="ui-grid-cell-contents" style="text-align:center">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
				},
				{ name: '平台名称',field:'platformname' },
				{ name: '申请公司',field:'appcompanyname'},
				{ name: '申请站点',field:'appstationname'},
				{ name: '申请人',field:'appstaffname'},
				{ name: '申请状态',field:'statename'},
				{ name: '审核人',field:'auditorname'},
				{ name: '审核时间',field:'audittime'},
				{ name: '备注',field:'remark'}

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

		$scope.getPage = function(pagenum, pagesize, orders,orderkey) {
			$scope.leagueapplyList.pageNum = pagenum
			$scope.leagueapplyList.pageSize = pagesize;
			$scope.Check();
		};

		//加盟申请
		$scope.add = function(){
			$scope.button = false;
			$scope.platformidModel = true;
			$scope.leagueapply = {
				platformid:"",
				appcompanyid:session.companyid,
				appcompanyname:session.companyname,
				appstationid:"",
				appstaffid:"",
				appstaffname:session.staffname,
				remark:""
			}
			$modal({html:true,scope:$scope,title:"加盟申请信息",template:'html/leagueapply.modal.html',contentTemplate:'html/leagueapply.edit.html',animation:'am-fade-and-scale',callback:function(a,b,c){
				c.form_leagueapply.submitted = false;
				$scope.button = true;
				if(c.form_leagueapply.$valid){
					var objAdd = {};
					objAdd.platformid = $scope.leagueapply.platformid
					objAdd.appcompanyid=$scope.leagueapply.appcompanyid;
					objAdd.appstationid=$scope.leagueapply.stationid;
					objAdd.appstaffid=$scope.leagueapply.staffid;
					if($scope.leagueapply.remark!=null&&$scope.leagueapply.remark!=""){
						objAdd.remark=$scope.leagueapply.remark;
					}

					var data = {};
					data.data = JSON.stringify(objAdd);
					var url = "/jsbweb/base/leagueapply/join.do";
					utils.query(url,{method:'POST',data:data}).then(function(resp){
						if(resp.ret == 0){
							$alert({title: '提示：', content: '加盟申请成功，待审核！', placement: 'masget-top',duration:2,type: 'info', show: true});
							$scope.Check();
						}
					});
					return true;
				}else{
					$scope.button = false;
					c.form_leagueapply.submitted = true;
					$alert({title: '提示：', content: '请重新检查输入项', placement: 'masget-top',duration:2,type: 'info', show: true});
					return false;
				}
			}
			})
		}
		$scope.Check();
	} 
])