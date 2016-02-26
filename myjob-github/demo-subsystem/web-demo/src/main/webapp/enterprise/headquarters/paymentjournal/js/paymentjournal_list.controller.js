
logComPaymentjournalModule.controller("paymentjournalListController",
		['$scope','$http',"$stateParams","goodsstockService","$state","$rootScope",'$modal','$alert','i18nService',function($scope, $http,$stateParams,goodsstockService,$state,$rootScope,$modal,$alert,i18nService) {
	//定义表单数据对象
	var dayTime=60*60*24*1000*6;
	var afterdayTime=60*60*24*1000*1;
	var backTime=new Date().getTime()-dayTime;
	var afterTime = new Date().getTime()+afterdayTime;
	
	$scope.formData={pagenum:1,pagesize:10,
		businesstimebegin:new Date(backTime).format("yyyy-MM-dd"),
		businesstimeend:new Date(afterTime).format("yyyy-MM-dd"),
		agentflag:2
	};
	
	//支付状态
	$scope.paymentorderList = [
            { id : 306 , value : "采购单"},
			{ id : 307 , value : "销售单"},
			{ id : 316 , value : "预付款钱包充值单"},
			{ id : 317 , value : "预付款钱包支付单"},
			{ id : 318 , value : "预付款钱包流水单"}
	];
	
	//支付状态转换
    $scope.convertPaymentorderType = function (flag) {
    	//console.log("-->"+flag);
    	flag = flag.substring(0,3);
        var name = "";
        for (var i = 0; i < $scope.paymentorderList.length; i++) {
            if ($scope.paymentorderList[i].id == flag) {
                name = $scope.paymentorderList[i].value;
            }
        }
        return name;
    };
    
			//ui-grid 分页汉化
	i18nService.setCurrentLang('zh-cn');
	
	$rootScope.isShowList=false;
	
	//加载经销商
    $scope.getSubcompany = function(){
    	$scope.data = {};
        $scope.data.pagenum = 1;
        $scope.data.pagesize = 500;
        $scope.data.enableflag = 2;
        var data = { data: angular.toJson($scope.data)};
        goodsstockService.httpPost(goodsstockService.getSubcompany(),data,function(data){
        	//console.log(data);
        	if(data.ret == 0){
        		$scope.formData.subCompanyList = data.data.rows;
        		if($scope.formData.subCompanyList.length != 0){
        			$scope.formData.subcompanyid = $scope.formData.subCompanyList[0].subcompanyid;
        		}
        		$scope.queryForm();
        	}else if(data.ret == 10){
            	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
            }else{
        		$alert({title: '提示：', content: '查询经销商异常,'+data.message, placement: 'masget-top',type: 'info', duration:1, show: true});
        	}
        });
    };
    $scope.getSubcompany();
	
	$http({
		method : 'POST',
		url :"/jsbweb/base/paymenttype/list.do",
		data : $.param({}),
		headers : {
			'Content-Type' : 'application/x-www-form-urlencoded'
		}
	}).success(function(data) {
		$scope.paymenttypes=data;
	});
	
	//查询托运单信息
	$scope.queryForm=function(state){
		
		if(!$scope.validateTime($scope.formData.businesstimebegin,$scope.formData.businesstimeend)){
			return;
		}
		
		if(state==1){
			$scope.formData.pagenum=1;
		}
		$http({
			method : 'POST',
			url :"/jsbweb/headquarters/paymentjournal/list.do",
			data : $.param($scope.formData),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data) {
			$scope.paymentjournals=data;
			$scope.paymentjournalGrid.gridOptions.data=[];
			if(data.data != null && data.data.rows != null){
				angular.forEach(data.data.rows,function(data,index,array){
					//支付类型
					data.paymentordertype = $scope.convertPaymentorderType(data.paymentordername);
				});
				$scope.paymentjournalGrid.gridOptions.data = data.data.rows;
			}
		});
	};
	
	$scope.validateTime = function(timeStart,timeEnd){
		if(timeStart==""||timeStart==undefined){
			$alert({title: '提示：', content: '开始时间不能为空！', placement: 'masget-top',type: 'info', duration:1, show: true});
			return false;
		}
		if(timeEnd==""||timeEnd==undefined){
			$alert({title: '提示：', content: '结束时间不能为空！', placement: 'masget-top',type: 'info', duration:1, show: true});
			return false;
		}
		if(timeStart>timeEnd){
			$alert({title: '提示：', content: '开始时间不能晚于结束时间', placement: 'masget-top',type: 'info', duration:1, show: true});
			return false;
		}
		if($scope.dateDiff(timeEnd,timeStart)>30){
			$alert({title: '提示：', content: '只能查询一个月之内的流水', placement: 'masget-top',type: 'info', duration:1, show: true});
			return false;
		}
		return true;
	};
	
	//日期相減取天
	$scope.dateDiff = function(sDate1, sDate2){
	    var aDate, oDate1, oDate2, iDays
	    aDate = sDate1.split("/")
	    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) //轉換為12-18-2002格式
	    aDate = sDate2.split("/")
	    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
	    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 /24) //把相差的毫秒數轉抽象為天數
	    return iDays
	};
	
	//$scope.queryForm();
	
	//ui-grid配置
	$scope.paymentjournalGrid = {};
	$scope.paymentjournalGrid.gridOptions = {
            useExternalSorting: true,
            enableColumnMenus: false,
            enableRowSelection: true,
            enableSelectAll: true,
            selectionRowHeaderWidth: 35,
            columnDefs: [
                { name: '序号',field:'id', width:60,cellTemplate:
                	'<div class="ui-grid-cell-contents" style="text-align:center">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
                },
                { name: '收款公司',field:'logisticsname' , width:120},
                { name: '收款公司站点',field:'stationname' , width:140},
                { name: '代收经销商名称',field:'enterprisemembername' , width:140},
                { name: '经销商编号',field:'merchantid' , width:100},
                { name: '终端号',field:'terminalnumber', width:100},
                { name: '单号',field:'consignnotenum' , width:140},
                { name: '来源',field:'paymentordertype' , width:140},
                { name: '支付单号',field:'paymentordername' , width:140},
                { name: '刷卡金额',field:'accountreceived', width:100},
                { name: '代收货款',field:'goodsreceived', width:80},
                { name: '支付类型',field:'paymenttype' , width:100},
                { name: '支付状态',field:'state', width:80},
                { name: '交易时间',field:'businesstime' , width:140, cellTemplate:
                	'<div class="ui-grid-cell-contents">{{row.entity.businesstime|limitTo:19}}</div>'
                },
                { name: '支付卡号',field:'bankaccount', width:100},
                { name: '银行卡类型',field:'bankcardtype' , width:100},
                { name: '银联流水号',field:'unionpaydealid', width:100},
                { name: '终端凭证号',field:'terminaldealid' , width:100},
                { name: '代收货款收入',field:'actualenterprisereceived', width:100},
                { name: '代收手续费',field:'actualenterprisesettlementfee', width:120},
                { name: '实际收入',field:'actualcompanyreceived' , width:100},
                { name: '支付手续费',field:'actualcompanysettlementfee' , width:100},
                { name: '清算时间',field:'settlementtime' , width:140, cellTemplate:
                	'<div class="ui-grid-cell-contents">{{row.entity.settlementtime|limitTo:19}}</div>'
                }
                ],
		paginationPageSizes: [5, 10, 15,20,25,50,100],
		paginationPageSize: 15,
		useExternalPagination: true,
		enableGridMenu: true,
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
		$scope.formData.pagenum = pagenum
		$scope.formData.pagesize = pagesize;
		$scope.queryForm();
	};
	
	//打印预览-pdf
	$scope.privewToPdf=function(){
		var params="agentflag=2"
			+"&membername="+encodeURIComponent(encodeURIComponent(checkNull($scope.formData.membername)))
		    +"&consignnotenum="+checkNull($scope.formData.consignnotenum)
		    +"&terminalnumber="+checkNull($scope.formData.terminalnumber)
		    +"&businesstimebegin="+checkNull($scope.formData.businesstimebegin)
		    +"&businesstimeend="+checkNull($scope.formData.businesstimeend)
		    +"&paymenttype="+checkNull($scope.formData.paymenttype);
		window.open("/jsbweb/headquarters/paymentjournal/report.do?"+params);
	};
	
	var checkNull = function(v){
		if(angular.isUndefined(v)||v == null){
			v = "";
		}
		return v;
	};
	
}]);


