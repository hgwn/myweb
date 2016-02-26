/*======================================
 * 划账信息页面控制器 companytransferaccountinfoController
 * =======================================
 * */
operationsModule.controller("transferaccountinfoController",['$scope','$http','$state','$rootScope','operationsmanagerService','i18nService','$timeout',function($scope,$http,$state,$rootScope,operationsmanagerService,i18nService,$timeout){
	//定义表单对象
	$scope.formData = {};
	$scope.formData.i_pagenum=1;
	$scope.formData.i_page_recordnum=10;
	$scope.i_accounttype=[{id:0,name:"企业帐户",selected:true},{id:1,name:"个人账户",selected:true}]
	$scope.getFormData={};
	//定义重划标志数组
	$scope.actualtransferflag=[{id:1,value:"正常"},{id:2,value:"重划"}]
	//定义跨行标志数组
	$scope.samebankflag=[{id:1,name:"跨行"},{id:2,name:"同行"}]
	//定义服务商标志数组
	$scope.serviceflag=[{id:1,name:"非服务商"},{id:2,name:"服务商"}]
	//定义划账标志数组
	$scope.unionpaytransferflag=[{id:1,name:"银联划帐"},{id:2,name:"非银联划帐"}]

	$scope.showFlag=false; //设置查询条件显示标志
	$scope.resulteFlag=false; //设置查询结果显示标志
	$scope.toshowMore=function(){
		$scope.showFlag=!$scope.showFlag;
	}

	//定义银联公司数据对象
	$scope.awardcompanyData=[];
	//定义银联公司下收单行数据对象
	$scope.acquirebankData=[];

	//定义划账目标公司表单对象
	$scope.companyinfoFormData={pagenum:1,pagesize:20};
	//获取划账目标公司数据
	$scope.fingcompanyinfo=function(){
			console.log("fingcompanyinfo--$scope.companyinfoFormData");
			console.log($scope.companyinfoFormData);
			 $http({
                 method : 'POST',
                 url :"/masgetweb/rboperationsmanager/base/companyinfo_find.do" ,
                 data :$.param($scope.companyinfoFormData),
                 headers : {
                     'Content-Type' : 'application/x-www-form-urlencoded'
                 }
             }).success( function(data) {
                console.log( "....1111222000000");
                console.log(data)
                $scope.companydatas=data.data;
             }).error( function(){
                     console.log( "error.....");
              });
	};



	$scope.onReset=function(){
		$timeout(function(){
			$scope.formData.p_targetcompanyname=$scope.companyinfoFormData.companyname;
		},100);
		console.log('onReset');
	};

	$scope.$watch("companyinfo",function(newVal,oldVal){
		console.log(newVal);
		if(newVal != null){
			$scope.formData.p_targetcompanyname = newVal.companyname;
		}
	});


	//初始化函数
	$scope.init=function(){
		//调用查询划账信息数据条数以及统计数据
		$scope.getcompanytransferaccountinfo_sumData();
		//调用获取银联公司数据
		$scope.getawardcompanyData();
		//调用获取划账目标公司数据
		$scope.fingcompanyinfo();
	}

	//ui-grid 分页汉化
	i18nService.setCurrentLang('zh-cn');

	var getPage = function(pagenum, pagesize, orders,orderkey) {
		$scope.formData.i_pagenum = pagenum;
		$scope.formData.i_page_recordnum = pagesize;
		$scope.formData.orders = orders;
		$scope.formData.orderkey = orderkey;
		//调用
		$scope.getcompanytransferaccountinfo_sumData();
	};

	var paginationOptions = {
		orders: null,
		orderkey: null
	};
	//ui-grid
	$scope.gridOptions = {
		paginationPageSizes: [10, 20, 50, 100],
		paginationPageSize: 10,
		useExternalPagination: true,
		useExternalSorting: true,
		enableSorting : true,
		enableCellEditOnFocus : false,
		enableColumnMenus: false,
		enableGridMenu: true,
		columnDefs : [
			{name:'序号',field:'id',type:'text',enableHiding: false , enableSorting: false, enableColumnResizing:false,  width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
			{name:'银联公司编号',field:'awardcompanyid',width:'120',type:'text'},
			{name:'银联公司',field:'awardcompanyname',width:'250',type:'text'},
			{name:'划账配置编号',field:'transferjournalid',width:'150',type:'text'},
			{name:'收款公司编号',field:'targetcompanyid',width:'150',type:'text'},

			{name:'收款公司',field:'targetcompanyname',width:'250',type:'text'},
			{name:'服务商类型',field:'servicesflag',type:'text',width:'120',cellTemplate:'<div class="ui-grid-cell-contents">{{grid.appScope.getServicesflag(row.entity.status)}}</div>'},
			{name:'收款户名',field:'accountname',type:'text',width:'100'},
			{name:'收款账号',field:'bankaccount',type:'text',width:'150'},
			{name:'联行号',field:'bankcode',type:'text',width:'150'},
			{name:'收款开户行',field:'bank',type:'text',width:'250'},
			{name:'账户类型',field:'accounttype',type:'text',width:'100',cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.getaccounttype(row.entity.accounttype)}}</div>'},
			{name:'跨行标志',field:'samebankflag',type:'text',width:'100',cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.getsamebankflag(row.entity.samebankflag)}}</div>'},
			{name:'划账金额',field:'transferamount',type:'text',width:'150'},
			//{name:'商户编号',field:'merchantid',type:'text',width:'150'},
			{name:'划帐标志',field:'unionpaytransferflag',type:'text',width:'100',cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.getunionpaytransferflag(row.entity.unionpaytransferflag)}}</div>'},
			{name:'重划标志',field:'actualtransferflag',type:'text',width:'100',cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.getactualtransferflag(row.entity.actualtransferflag)}}</div>'},
			{name:'划账手续费',field:'transferexpense',type:'text',width:'100'},
			{name:'入账流水号',field:'tansfersequence',type:'text',width:'180'},
			{name:'划账时间',field:'transfertime',width:'150',type:'text'},
			{name:'结果',field:'dealresult',width:'100',type:'text',cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.getdealresult(row.entity.dealresult)}}</div>'}
			//{name:'备注',field:'remark',width:'150',type:'text',enableCellEdit: false}
		],
		onRegisterApi: function(gridApi) {
			$scope.gridApi = gridApi;
			$scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
				if(getPage) {
					if (sortColumns.length > 0) {
						paginationOptions.orders = sortColumns[0].colDef.field;//获取列标题字段名
						paginationOptions.orderkey = sortColumns[0].sort.direction;
					} else {
						paginationOptions.orders = null;
						paginationOptions.orderkey = null;
					}
					getPage(grid.options.paginationCurrentPage, grid.options.paginationPageSize, paginationOptions.orders,paginationOptions.orderkey)
				}
			});
			gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
				if($scope.getPage) {
					$scope.getPage(newPage, pageSize, paginationOptions.orders,paginationOptions.orderkey);
				}
			});
		}
	};

	$scope.getPage = getPage;

	//4.1.	查询划账信息数据
	$scope.getcompanytransferaccountinfoData=function(){

		var url =operationsmanagerService.getcompanytransferaccountinfoqueryUrl();
		operationsmanagerService.httpPost(url,$scope.formData,function(data){
			console.log("查询划账信息数据....");
			console.log(data);
			if(data.ret==0){
				$scope.gridOptions.data = data.data;  //将获取数据赋值给ui-grid
				$scope.gridOptions.totalItems = data.data.total;
			}
		})
	};

	//2.4.	获取银联公司
	$scope.getawardcompanyData=function(){
		var url =operationsmanagerService.getawardcompanyUrl();
		operationsmanagerService.httpGet(url,function(data){
			console.log("获取银联公司....");
			console.log(data);
			if(data.ret==0){
				$scope.awardcompanyData=data.data.rows;
			}
		})
	};

	//2.5.	获取银联下--收单行数据
	$scope.awardcompanySelect=function(awardcompanyid){
		$scope.acquirebankData.length=0;
		$('#awardcompanyid').attr("disabled","disabled");
		if(awardcompanyid !=null){
			var data ={"awardcompanyid":awardcompanyid};
		console.log("awardcompanyid:"+awardcompanyid);
		var url = operationsmanagerService.getacquirerinfobyawardcompanyUrl();
		operationsmanagerService.httpPost(url,data,function(data){
			console.log(data);
			if(data.ret==0){
				$scope.acquirebankData=data.data.rows;
				if($scope.acquirebankData.length !=0){
					$('#awardcompanyid').removeAttr("disabled");
				}
			}
		})
		}
	}


	//4.2.	查询划账信息数据条数以及统计数据
	$scope.getcompanytransferaccountinfo_sumData=function(){
		$scope.resulteFlag=false;
		var temp = [];
		for(var i=0; i<$scope.i_accounttype.length; i++){
			if($scope.i_accounttype[i].selected){
				temp.push($scope.i_accounttype[i].id);
			}
		}
		console.warn(temp);
		if(temp.length){	
			if(temp.length==1){
				$scope.formData.i_accounttype = temp[0];
			}
			else{
				$scope.formData.i_accounttype=-1;
			}
		}
		else{
			$scope.formData.i_accounttype=-1;
		}
		console.log($scope.formData);
		
		var url =operationsmanagerService.getcompanytransferaccountinfo_sumUrl();
		operationsmanagerService.httpPost(url,$scope.formData,function(data){
			console.log("查询划账信息数据条数以及统计数据....");
			console.log(data);
			$scope.getFormData = angular.copy(data);
			if(data.ret==0){
				$scope.gridOptions.data = data.data;  //将获取数据赋值给ui-grid
				$scope.gridOptions.totalItems = data.total;//总条数
			}
			else{
				if(data.ret==1){  //查无数据
					$scope.resulteFlag=true;
				}
				$scope.gridOptions.data=[];
				$scope.gridOptions.totalItems=0;
			}

		})
	};

	//ui-grid
	$scope.getServicesflag = function(state){
		if(state==1){
			return "非服务商";
		}
		else{
			return "服务商";
		}
	}

	$scope.getunionpaytransferflag=function(ret){
		if(ret==1){
			return "银联划帐";
		}
		else{
			return "非银联划帐";
		}
	}

	$scope.getsamebankflag=function(ret){
		if(ret==1){
			return "跨行";
		}
		else{
			return "同行";
		}
	}
	$scope.getactualtransferflag=function(ret){
		if(ret==1){
			return "正常";
		}
		else{
			return "重划";
		}
	}

	$scope.getaccounttype=function(flag){
		if(flag==0){
			return "企业帐户";
		}
		if(flag==1){
			return "个人帐户";
		}
	}
	$scope.getdealresult=function(ret){
		switch(ret){
			case "00":
				return "转账成功";
				break;
			case "01":
				return "转账失败";
				break;
			case "02":
				return "状态未知";
				break;
			case "03":
				return	"未处理";
				break;
			default:
				return "其它"
		}
	}

	//加载日期控件
	$scope.loadDataTime=function(){
		$("#beginTime,#endTime").datetimepicker({
			language: 'zh-CN',
			autoclose: true,
			todayBtn: true,
			pickerPosition: "bottom-left",
			todayHighlight: true,
			startView: 2,
			minView: 0,
			minuteStep:1,
			format: 'yyyy-mm-dd hh:ii:ss'

		});
	}

	//调用生成划账文件
	$scope.makefile=function(){
		//p_ordertype  根据 重划标志和跨行标志组成 结果 1:本行 2:他行 3:重划本行 4:重划他行 5:全部 6:正常全部 7:重划
		//重划标志  i_actualtransferflag   跨行标志 i_samebankflag
		if($scope.formData.i_actualtransferflag!=undefined||$scope.formData.i_samebankflag!=undefined){
			//i_actualtransferflag ==1正常  2==重划    i_samebankflag==1跨行  2=同行
			if($scope.formData.i_samebankflag==1&&$scope.formData.i_actualtransferflag==undefined){
				//只选择跨行提示必须选择正常或重划
				$.jBox.tip("请选择\"重划标志\"为正常或重划！","warnning");
				return;
			}
			if($scope.formData.i_samebankflag==2&&$scope.formData.i_actualtransferflag==undefined){
				$.jBox.tip("请选择\"重划标志\"为正常或重划！","warnning");
				return;
			}

			if($scope.formData.i_samebankflag==2&&$scope.formData.i_actualtransferflag==1){
				$scope.formData.p_ordertype=1; //1:本行正常
				
			}
			if($scope.formData.i_samebankflag==1&&$scope.formData.i_actualtransferflag==1){
				$scope.formData.p_ordertype=2;//2:他行正常
			}
			if($scope.formData.i_actualtransferflag==2&&$scope.formData.i_samebankflag==2){
				$scope.formData.p_ordertype=3; // 3:重划本行
			}
			if($scope.formData.i_actualtransferflag==2&&$scope.formData.i_samebankflag==1){
				$scope.formData.p_ordertype=4;  //4:重划他行
			}
			if($scope.formData.i_actualtransferflag==1&&$scope.formData.i_samebankflag==undefined){
				$scope.formData.p_ordertype=6;  //6:正常全部 
			}
			if($scope.formData.i_actualtransferflag==2&&$scope.formData.i_samebankflag==undefined){
				$scope.formData.p_ordertype=7;  //7:重划全部 
			}
		}
		else{
			$scope.formData.p_ordertype=5; //默认全部
		}
		console.log($scope.formData);
		$http({
        		method : 'POST',
        		url    : 'com/companytransferaccountinfo_makefile.do',
        		data   : $.param($scope.formData),
        		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  
        	}).success(function(data){
        		console.log(data);
        	}).error(function(resp){
        		console.log("error......");
        	})
	}

	//调用初始化函数
	$scope.init();
}]);

