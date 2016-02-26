
entDeliverygoodsModule.controller("deliverygoodsAddController",
		['$scope','$http',"$stateParams","$state","$window","$timeout","$rootScope",function($scope, $http,$stateParams,$state,$window,$timeout,$rootScope) {
	
	//定义货物明细数组数据
	$scope.commodities=new Array();
	
	$scope.commodity={};
	
	$scope.isShowAddCommodityLink=true;
	$scope.isShowImportDataLink=true;
	
	$rootScope.isShowList=true;
	
	//定义托运单操作类型
	$scope.operaType="insertByManual";
	
	//定义初始化基础数据方法
	var initBaseData=function(){
		//定义提货方式数据
		$scope.consignmentTypes=[{value:1,name:'物流上门收货'},{value:2,name:'货主送货'}];
		
		//定义送货方式数据
		$scope.deliveryTypes=[{value:1,name:'送货上门'},{value:2,name:'收货方自提'}];
		
		//定义结算类型数据
		$scope.settlementTypes=[{value:1,name:'现付'},{value:2,name:'到付'},{value:3,name:'回单付'},{value:4,name:'月结'}];
	};
	
	//定义初始化页面数据方法
	var loadData=function(){
		
		dealNewCommodity();
		dealNewCommodity();
		dealNewCommodity();
		
		initCommodityCheck();
		
		//初始化表单数据，包括日期
		$scope.formData={
				datasource:1,
				createdtime:new Date().format("yyyy-MM-dd"),
				deliveryType:1,
				consignmentType:1,
				settlementType:2,
				transportType:1,
				receiptflag:1,
				codflag:2,
				isCommitted:false
				};
		
		
		//获取发货单号
		$http({
			method : 'POST',
			url : "/jsbweb/orderNum/get.do?ordertypeid=305"
		}).success(function(data) {
			$scope.formData.deliverynum=data.ordernum;		
		});
		
		//定义发货人信息对象和收货人信息对象
		$scope.enterprises=new Array();
		$scope.recvcompanys=new Array();
		
		//获取当前登录公司信息
		$http({
			method : 'POST',
			url : "/jsbweb/base/getSession.do"
		}).success(function(data) {
			$scope.session=data;
			$scope.formData.sendstationid=$scope.session.stationid;
		});
		
		//获取通讯录分组信息
		$http.get("/jsbweb/base/addressGroup/list.do?scenetypeid=3&pageNum=1&pageSize=100").success(function(data){
			if(data!=null&&data.data!=null&&data.data.rows!=null){
				$scope.addressGroups=[];
				angular.forEach(data.data.rows,function(item){
					if(item.saasaddressgrouptypeid != 1){
						$scope.addressGroups.push(item);
					}
				});
			}
		});
		
		initBaseData();
		
	};
	
	$scope.isGoodsNameEditable=false;
	
	//初始化表单控件状态
	//分'导入'和'修改'两种
	var initFormState=function(type,datasource){
		if(type=='import'){
			$scope.formData.isEnterpriseDisabled=true;
			$scope.formData.isRecvcompanyDisabled=true;
			$scope.formData.isSendaddressDisabled=false;
			$scope.formData.isRecvaddressDisabled=false;
			$scope.formData.isUnloadstationidDisabled=false;
			$scope.formData.isStorehouseKeywordDisabled=true;
			$scope.isShowAddCommodityLink=false;
			$scope.isShowImportDataLink=true;
		}
		else if(type=='update'&&datasource==1){
			$scope.formData.isEnterpriseDisabled=true;
			$scope.formData.isRecvcompanyDisabled=true;
			$scope.formData.isSendaddressDisabled=false;
			$scope.formData.isRecvaddressDisabled=false;
			$scope.formData.isUnloadstationidDisabled=true;
			$scope.formData.isStorehouseKeywordDisabled=false;
			$scope.isShowAddCommodityLink=true;
			$scope.isShowImportDataLink=false;
		}
		else if((type=='update'&&datasource==2)||(type=='update'&&datasource==3)){
			$scope.formData.isEnterpriseDisabled=true;
			$scope.formData.isRecvcompanyDisabled=true;
			$scope.formData.isSendaddressDisabled=true;
			$scope.formData.isRecvaddressDisabled=true;
			$scope.formData.isUnloadstationidDisabled=true;
			$scope.formData.isStorehouseKeywordDisabled=true;
			$scope.isShowAddCommodityLink=false;
			$scope.isShowImportDataLink=false;
		}
	}
	
	var checkNull=function(v){
		if(angular.isUndefined(v)||v==null){
			v="";
		}
		return v;
	}
	
	var checkNullTo0 = function(v){
		if(angular.isUndefined(v)||v == null||v == ''){
			v = 0;
		}
		return v;
	};
	
	$scope.queryFormData={};
	
	$scope.queryLogisticFormData={scenetypeid:2,companytypeid:2000,platformuser:1};
	
	//查询物流公司信息
	$scope.queryLogistic=function(){
		if(angular.isUndefined($scope.queryFormData.logisticKeyword)){
			$scope.queryFormData.logisticKeyword="";
		}
		$scope.queryLogisticFormData.condition=$scope.queryFormData.logisticKeyword;
		$http({
			method : 'POST',
			url : "/jsbweb/enterprise/deliverygoods/queryContractorinfo.do",
			data:$.param($scope.queryLogisticFormData),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data) {
			$scope.logistics=data;
			if($scope.logistics!=null&&$scope.logistics.data!=null&&$scope.logistics.data.rows!=null){
				angular.forEach($scope.logistics.data.rows,function(logistic){
					var pca=checkNull(logistic.provincename)+checkNull(logistic.cityname)+checkNull(logistic.areaname);
					var address=checkNull(logistic.address);
					logistic.address=pca;
					if(pca!=''&&address!=''){
						logistic.address=pca+"-"+address;
					}
					if(pca==''||address==''){
						logistic.address=pca+address;
					}
				});
			}
		});
	};

	
	$scope.queryEnterpriseFormData={scenetypeid:2};
	
	//查询发货人信息
	$scope.queryEnterprise=function(){
		if(angular.isUndefined($scope.queryFormData.enterpriseKeyword)){
			$scope.queryFormData.enterpriseKeyword="";
		}
		$scope.queryEnterpriseFormData.condition=$scope.queryFormData.enterpriseKeyword;
		
		var data={};
		data.data=angular.toJson($scope.queryEnterpriseFormData);
		$http({
			method : 'POST',
			url : "/jsbweb/base/companystaff/getcompanystaff.do",
			data:$.param(data),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data) {
			$scope.enterprises=data;
			if($scope.enterprises!=null&&$scope.enterprises.data!=null&&$scope.enterprises.data.rows!=null){
				angular.forEach($scope.enterprises.data.rows,function(enterprise){
					var pca=checkNull(enterprise.provincename)+checkNull(enterprise.cityname)+checkNull(enterprise.areaname);
					var address=checkNull(enterprise.address);
					enterprise.address=pca;
					if(pca!=''&&address!=''){
						enterprise.address=pca+"-"+address;
					}
					if(pca==''||address==''){
						enterprise.address=pca+address;
					}
				});
			}
		});
	};
	
	$scope.queryRecvcompanyFormData={scenetypeid:3};
	
	//查询收货人信息
	$scope.queryRecvcompany=function(){
		if(angular.isUndefined($scope.queryFormData.recvcompanyKeyword)){
			$scope.queryFormData.recvcompanyKeyword="";
		}
		$scope.queryRecvcompanyFormData.condition=$scope.queryFormData.recvcompanyKeyword;
		$http({
			method : 'POST',
			url : "/jsbweb/enterprise/deliverygoods/queryContractorinfo.do",
			data:$.param($scope.queryRecvcompanyFormData),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data) {
			$scope.recvcompanys=data;
			if($scope.recvcompanys!=null&&$scope.recvcompanys.data!=null&&$scope.recvcompanys.data.rows!=null){
				angular.forEach($scope.recvcompanys.data.rows,function(recvcompany){
					var pca=checkNull(recvcompany.provincename)+checkNull(recvcompany.cityname)+checkNull(recvcompany.areaname);
					var address=checkNull(recvcompany.address);
					recvcompany.address=pca;
					if(pca!=''&&address!=''){
						recvcompany.address=pca+"-"+address;
					}
					if(pca==''||address==''){
						recvcompany.address=pca+address;
					}
				});
			}
		});
	};
	
	//查询登录公司仓库信息（站点类型为3的站点信息）
	$scope.queryStorehouse=function(){
		if(angular.isUndefined($scope.queryFormData.storehouseKeyword)){
			$scope.queryFormData.storehouseKeyword="";
		}
		$http({
			method : 'POST',
			url : "/jsbweb/station/list.do",
			data:"stationname="+$scope.queryFormData.storehouseKeyword,
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data) {
			if(data.data!=null){
				$scope.storehouses=data.data.rows;
			}
		});
	}
	
	//初始化货物信息监测
	var initCommodityCheck=function(){
		if($scope.commodities!=null){
			angular.forEach($scope.commodities,function(commodity){
				//监测货物名称是否正确并计算运费、总金额和货物金额
				$scope.$watch(
					function(){ return commodity.goodsName},
					function(newVal){
						//判断货物名称是否为空
						/*if(newVal!=null&&newVal!=''){
							commodity.isGoodsNameCorrect=true;
						}else{
							commodity.isGoodsNameCorrect=false;
						};*/
						
						if($scope.operaType=="insertByImport"||($scope.operaType=='update'&&$scope.formData.datasource==2)
								||($scope.operaType=='update'&&$scope.formData.datasource==3)){
							return;
						}
							//判断货物名称是否重复
						commodity.isGoodNameRepetitive=false;
						if($scope.commodities!=null){
							angular.forEach($scope.commodities,function(obj){
								if(obj.index!=commodity.index&&commodity.goodsName!=null&&commodity.goodsName!=""&&obj.goodsName==commodity.goodsName){
									commodity.isGoodNameRepetitive=true;
								}
							});
							if(commodity.isGoodNameRepetitive==true){
								$.jBox.tip("货物名称不能重复...", 'waring');
							}
						};
						
						dealSumGoodsPrice();
				});
				//监测货物打包数量是否正确
				$scope.$watch(
					function(){ return commodity.packageQty},
					function(newVal){
						if(newVal!=null&&newVal!=''&&newVal>0&&!isNaN(newVal)){
							commodity.isPackageQtyCorrect=true;
						}else{
							commodity.isPackageQtyCorrect=false;
						}
				});
				//监测货物重量是否正确
				$scope.$watch(
					function(){ return commodity.totalWeight},
					function(newVal){
						newVal=newVal==''||angular.isUndefined(newVal)?null:newVal;
						if(!isNaN(newVal)){
							commodity.isTotalWeightCorrect=true;
						}else{
							commodity.isTotalWeightCorrect=false;
						}
				});
				//监测货物体积是否正确
				$scope.$watch(
					function(){ return commodity.totalVolume},
					function(newVal){
						newVal=newVal==''||angular.isUndefined(newVal)?null:newVal;
						if(!isNaN(newVal)){
							commodity.isTotalVolumeCorrect=true;
						}else{
							commodity.isTotalVolumeCorrect=false;
						}
				});
				//监测货物金额是否正确并计算货物总金额
				$scope.$watch(
					function(){ return commodity.totGoodsMoney},
					function(newVal){
						newVal=newVal==''||angular.isUndefined(newVal)?null:newVal;
						if(!isNaN(newVal)){
							commodity.isTotGoodsMoneyCorrect=true;
						}else{
							commodity.isTotGoodsMoneyCorrect=false;
						}
						dealSumGoodsPrice();
				});
			});
		}
	}
	
	//保存原来的运费信息
	$scope.oldConsignnoteChagres=new Array();
	
	$scope.search={action:'!delete'};
	
	//更新从托运单列表过来的数据
	var updateData=function(deliverygoods){
		$scope.formData={};
		console.info(deliverygoods);
		
		initBaseData();
		
		$scope.operaType="update";
		
		initFormState('update',deliverygoods.datasource);
		
		$scope.formData.deliveryid=deliverygoods.deliveryid;
		$scope.formData.deliverynum=deliverygoods.deliverynum;
		
		$scope.formData.datasource=deliverygoods.datasource;
		
		//发货人信息
		$scope.formData.enterpriseid=deliverygoods.sendcompanyid;
		$scope.formData.sendstationid=deliverygoods.sendstationid;
		
		$scope.queryFormData.storehouseKeyword=deliverygoods.sendstationname;/////
		
		deliverygoods.sendaddress=deliverygoods.sendaddress==null?"":deliverygoods.sendaddress;
		$scope.formData.sendaddress=deliverygoods.sendaddress.split("-")[0];
		$scope.formData.sendaddressExtra=deliverygoods.sendaddress.split("-")[1];
		if($scope.formData.sendaddressExtra==''){
			$scope.formData.sendaddressExtra=deliverygoods.sendaddress.split("-")[2];
		}
		
		$scope.formData.enlinkername=deliverygoods.enlinkername;
		$scope.formData.enlinkerphone=deliverygoods.enlinkerphone;
		
		$scope.queryFormData.enterpriseKeyword=deliverygoods.enlinkername;
		
		//收货人信息
		$scope.formData.recvcompanyid=deliverygoods.recvcompanyid;
		$scope.formData.recvstationid=deliverygoods.recvstationid;
		
		deliverygoods.recvaddress=deliverygoods.recvaddress==null?"":deliverygoods.recvaddress;
		$scope.formData.recvaddress=deliverygoods.recvaddress.split("-")[0];
		$scope.formData.recvaddressExtra=deliverygoods.recvaddress.split("-")[1];
		if($scope.formData.recvaddressExtra==""){
			$scope.formData.recvaddressExtra=deliverygoods.recvaddress.split("-")[2];
		}
		
		$scope.formData.recvlinkername=deliverygoods.recvlinkername;
		$scope.formData.recvlinkerphone=deliverygoods.recvlinkerphone;
		
		$scope.queryFormData.recvcompanyKeyword=deliverygoods.recvlinkername;
		
		$scope.queryFormData.logisticKeyword=deliverygoods.logcompanyname;/////
		$scope.formData.logisticid=deliverygoods.logisticid;
		$scope.formData.logstationid=deliverygoods.logstationid;
				
		//要求回单标志
		$scope.formData.receiptflag=deliverygoods.receiptflag;
		
		$timeout(function(){
			//提货方式
			$scope.formData.consignmentType=deliverygoods.consignmenttype;
			//送货方式
			$scope.formData.deliveryType=deliverygoods.deliverytype;
		},0.5);
		
		//代收货款标志
		$scope.formData.codflag=deliverygoods.codflag;
		
		$scope.formData.remark1=deliverygoods.remark1;
		
		if(deliverygoods.deliverygoodscharge!=null&&deliverygoods.deliverygoodscharge.rows!=null){
			angular.forEach(deliverygoods.deliverygoodscharge.rows,function(charge){
				
				$scope.formData.settlementType=charge.settlementtypeid;
				//当费用类型为1即货款时
				if(charge.chargetypeid==1){
					$scope.formData.goodsChargeId=charge.deliverygoodschargeid;
					$scope.formData.chargedirection=2;
					$scope.formData.sumCodPrice=charge.chargeamount;
				}
			});
		}
		
		//存储货物明细数据到deliverygoodslist中
		$scope.commodities=new Array();
		if(deliverygoods.deliverygoodslist!=null&&deliverygoods.deliverygoodslist.rows!=null){
			angular.forEach(deliverygoods.deliverygoodslist.rows,function(goods,index){
				var obj=new Object();
				obj.index=$scope.commodities.length+1;
				obj.deliverylistid=goods.deliverylistid;
				obj.goodsid=goods.goodsid;
				obj.goodsName=goods.goodsname;
				obj.packageQty=goods.packageqty;
				obj.totalWeight=goods.totalweight;
				obj.totalVolume=goods.totalvolume;
				obj.totGoodsMoney=goods.totgoodsmoney;
				obj.remark=goods.remark;
				obj.action="modify";				
				$scope.commodities.push(obj);
				initCommodityCheck();
			});
		}
	};
	
	//定义初始化页面数据方法
	var initData=function(){
		if($state.delivery==null){
			loadData();
		}else{
			$scope.isView=$state.isView;
			updateData($state.delivery);
		}
	};
	
	//处理新建货物明细
	var dealNewCommodity=function(){
		$scope.commodities.push({
			index:$scope.commodities.length+1,
			packageQty:1,
			action:"add"
		});
	};
	
	//初始化页面数据
	initData();
	
	//检测物流改变时触发
	$scope.$watch("formData.logistic",function(newVal){
		if(angular.isUndefined(newVal)) return;
		$scope.formData.logisticid=newVal.companyid;
		$scope.formData.logstationid=newVal.stationid;
	});
	
	//检测发货人改变时触发
	$scope.$watch("formData.enterprise",function(newVal){
		if(angular.isUndefined(newVal)) return;
		$scope.formData.enterpriseid=newVal.companyid;
		$scope.formData.enstationid=newVal.stationid;
		$scope.formData.enlinkername=newVal.staffname;
		$scope.formData.enlinkerphone=newVal.mobilephone;
		
		$scope.formData.sendaddress=newVal.address.split("-")[0];
		$scope.formData.sendaddressExtra=newVal.address.split("-")[1];
	});
	
	//检测收货人改变时触发
	$scope.$watch("formData.recvcompany",function(newVal){
		if(angular.isUndefined(newVal)) return;
		$scope.formData.recvcompanyid=newVal.companyid;
		$scope.formData.recvstationid=newVal.stationid;
		$scope.formData.recvlinkername=newVal.staffname;
		$scope.formData.recvlinkerphone=newVal.mobilephone;
		
		$scope.formData.recvaddress=newVal.address.split("-")[0];
		$scope.formData.recvaddressExtra=newVal.address.split("-")[1];
	});
	
	//当发货人输入文本改变时触发的方法（用到的是keyup事件）
	$scope.resetActionWithEnterprise=function(){
		$scope.formData.enterpriseid=0;
		$scope.formData.enstationid=0;
		$scope.formData.enlinkername=$scope.queryFormData.enterpriseKeyword;
	}
	
	//当收货人输入文本改变时触发的方法（用到的是keyup）
	$scope.resetActionWithRecvcompany=function(){
		$scope.formData.recvcompanyid=0;
		$scope.formData.recvstationid=0;
		$scope.formData.recvlinkername=$scope.queryFormData.recvcompanyKeyword;
	}
	
	//计算货物总金额--即货款
	var dealSumGoodsPrice=function(){
		var sumPrice=0;
		if($scope.commodities!=null){
			angular.forEach($scope.commodities,function(commodity){
				if(commodity.action!=null&&commodity.action=="delete") return true;
				if(commodity.goodsName==null||commodity.goodsName=='') return true;
				if(commodity.totGoodsMoney==null||commodity.totGoodsMoney=='') return true;
				if(isNaN(commodity.totGoodsMoney)==true) return true;
				if(commodity.isGoodNameRepetitive==true) return true;
				sumPrice+=parseFloat(commodity.totGoodsMoney);
			});
			$scope.formData.sumGoodsPrice=sumPrice;
		}
	};
	
	//校测选择仓库是否
	$scope.$watch("formData.storehouse",function(){
		if($scope.formData.storehouse!=null){
			$scope.formData.sendstationid=$scope.formData.storehouse.stationid;
		}
	});
	
	$scope.formData_ds={};
	
	$scope.queryDataSourse=function(){
		$http({
			method : 'POST',
			url : "/jsbweb/enterprise/deliverygoods/queryDataSourse.do",
			data : $.param($scope.formData_ds),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		
		}).success(function(data) {
			$scope.datasources=data;
		});
	};
	
	//编辑货物明细
	$scope.editCommodity=function(commodity){
		if($scope.isView==true) return;
		var flag=false;
		if(commodity==null){
			if($scope.commodities!=null){
				angular.forEach($scope.commodities,function(obj){
					obj.editSwitch=false;
					obj.isGoodsNameEditable=false;
					obj.isTotGoodsMoneyEditable=false;
				});
			};
			return;
		}
		if($scope.commodities!=null){
			angular.forEach($scope.commodities,function(obj){
				if(obj.editSwitch==true){
					obj.editSwitch=false;
					obj.isGoodsNameEditable=false;
					obj.isTotGoodsMoneyEditable=false;
					if(obj.index!=commodity.index){
						flag=true;
						return false;
					}
				}
			});
			
			if(flag==true){
				commodity.editSwitch=false;
				commodity.isGoodsNameEditable=false;
				commodity.isTotGoodsMoneyEditable=false;
			}else{
				commodity.editSwitch=true;
				commodity.isGoodsNameEditable=true;
				commodity.isTotGoodsMoneyEditable=true;
			}

			if($scope.operaType=='insertByImport'||($scope.operaType=='update'&&$scope.formData.datasource==2)||($scope.operaType=='update'&&$scope.formData.datasource==3)){
				commodity.isGoodsNameEditable=false;
				commodity.isTotGoodsMoneyEditable=false;
			}
		}
	};
	
	//显示选择数据源模态框
	$scope.showDatasourceModal=function(type){
		
		if($scope.isView==true) return;
		
		$("#datasourceModal").modal("show");
	};
	
	//检测货物明细数据是否正确和完整
	//returnFlag为返回标志
	//returnFlag=0-->校验通过
	//returnFlag=1-->货物明细条数为0
	//returnFlag=2-->货物明细条数不为0但是货物明细的某些字段校验不通过
	var checkCommodityCorrect=function(){
		var returnFlag=0;
		if($scope.commodities==null||$scope.commodities.length==0){
			returnFlag=1;
			return returnFlag;
		}
		if($scope.commodities.length!=0){	
			var flag=true;//标示货物正确条数是否为0
			angular.forEach($scope.commodities,function(commodity){
				if(commodity.goodsName!=null&&commodity.goodsName!=""){
					flag=false;
				}
			});
			if(flag){
				returnFlag=1;
				return returnFlag;
			}else{
				angular.forEach($scope.commodities,function(commodity){
					if(commodity.isGoodNameRepetitive||!commodity.isPackageQtyCorrect||!commodity.isTotalWeightCorrect||
							!commodity.isTotalVolumeCorrect||!commodity.isTotGoodsMoneyCorrect){
						returnFlag=2;
						return false;
					}
				});
			}
		}
		return returnFlag;
	};
	
	//定义发货单对象，用于存储'生成托运单'所需要的表单数据
	$scope.delivergoods={};
	
	//处理要提交的表单对象order的数据
	var dealCreateOrderData=function(){
		
		$scope.delivergoods.datasource=$scope.formData.datasource;
		$scope.delivergoods.deliveryid=$scope.formData.deliveryid;
		$scope.delivergoods.deliverynum=$scope.formData.deliverynum;
		$scope.delivergoods.relationnum=$scope.formData.relationnum;
		
		$scope.delivergoods.sendcompanyid=$scope.formData.enterpriseid;
		$scope.delivergoods.sendstationid=$scope.formData.sendstationid;
		
		//发货人信息
		$scope.formData.sendaddress=$scope.formData.sendaddress!=null?$scope.formData.sendaddress:"";
		if($scope.formData.sendaddressExtra!=null&&$scope.formData.sendaddressExtra!=""){
			$scope.formData.sendaddressExtra="-"+$scope.formData.sendaddressExtra;
		}else{
			$scope.formData.sendaddressExtra="";
		}
		$scope.delivergoods.enlinkername=$scope.formData.enlinkername==null?"":$scope.formData.enlinkername;
		$scope.delivergoods.sendaddress=$scope.formData.sendaddress+$scope.formData.sendaddressExtra;
		$scope.delivergoods.enlinkerphone=$scope.formData.enlinkerphone;
		
		//收货人信息
		$scope.formData.recvaddress=$scope.formData.recvaddress!=null?$scope.formData.recvaddress:"";
		if($scope.formData.recvaddressExtra!=null&&$scope.formData.recvaddressExtra!=""){
			$scope.formData.recvaddressExtra="-"+$scope.formData.recvaddressExtra;
		}else{
			$scope.formData.recvaddressExtra="";
		}
		
		$scope.delivergoods.recvcompanyid=$scope.formData.recvcompanyid;
		$scope.delivergoods.recvstationid=$scope.formData.recvstationid;
		$scope.delivergoods.recvlinkername=$scope.formData.recvlinkername;
		$scope.delivergoods.recvaddress=$scope.formData.recvaddress+$scope.formData.recvaddressExtra;
		$scope.delivergoods.recvlinkerphone=$scope.formData.recvlinkerphone;
		
		$scope.delivergoods.logisticid=$scope.formData.logisticid;
		$scope.delivergoods.logstationid=$scope.formData.logstationid;
		
		//要求回单标志
		$scope.delivergoods.receiptflag=$scope.formData.receiptflag;
		//送货方式
		$scope.delivergoods.deliverytype=$scope.formData.deliveryType;
		//提货方式
		$scope.delivergoods.consignmenttype=$scope.formData.consignmentType;
		
		//代收货款标志
		$scope.delivergoods.codflag=$scope.formData.codflag;
		
		$scope.delivergoods.remark1=$scope.formData.remark1;
		
		//存储货物明细数据到consignnotelist中
		var deliverygoodslist=new Array();
		if($scope.commodities!=null){
			angular.forEach($scope.commodities,function(commodity){
				if(commodity.goodsName==null||commodity.goodsName=='') return true;
				var obj=new Object();
				if($scope.operaType=="update"){
					obj.deliverylistid=commodity.deliverylistid;
				}
				obj.goodsid=commodity.goodsid;
				obj.goodsname=commodity.goodsName;
				obj.packageqty=checkNullTo0(commodity.packageQty);
				obj.totalweight=checkNullTo0(commodity.totalWeight);
				obj.totalvolume=checkNullTo0(commodity.totalVolume);
				obj.totgoodsmoney=checkNullTo0(commodity.totGoodsMoney);
				obj.remark=commodity.remark;
				obj.action=commodity.action;
				deliverygoodslist.push(obj);
				
			});
			$scope.delivergoods.deliverygoodslist=angular.toJson(deliverygoodslist);
		}
		
		//存储货物金额对象到consignnotecharge中
		var deliverygoodscharge=new Array();
		
		if($scope.formData.sumGoodsPrice==null){
			$scope.formData.sumGoodsPrice=0;
		}
		var goodsCharge=new Object();
		goodsCharge.settlementtypeid=1;
		goodsCharge.chargetypeid=1;
		goodsCharge.chargedirection=2;
		goodsCharge.chargeamount=$scope.formData.sumCodPrice;
		if($scope.operaType=="update"){
			goodsCharge.deliverygoodschargeid=$scope.formData.goodsChargeId;
			goodsCharge.action="modify";
		}
		//将货物金额对象push到数组consignnotecharge中
		deliverygoodscharge.push(goodsCharge);
		
		if(deliverygoodscharge.length>0){
			$scope.delivergoods.deliverygoodscharge=angular.toJson(deliverygoodscharge);
		}
		
		if($scope.formData.datasource==2){
			$scope.delivergoods.warehouseoutid=$scope.formData.warehouseoutid;
		}
		
		if($scope.formData.datasource==3){
			$scope.delivergoods.orderid=$scope.formData.orderid;
		}
		
		console.info($scope.delivergoods);
	};
	
	//开托运单
	$scope.createOrder=function(){
		
		console.info($scope.deliverygoodsForm.$valid);
		
		$scope.formData.isCommitted=true;
		
		var isCorrect=true;
		
		if($scope.deliverygoodsForm.$valid==false||!$scope.isSumCodPriceCorrect()){
			$.jBox.tip("请检查输入", 'waring');
			return;
		}
		else if(checkCommodityCorrect()==1){
			$.jBox.tip("请新增货物明细", 'waring');
			return;
		}
		else if(checkCommodityCorrect()==2){
			$.jBox.tip("请检查货物明细数据是否正确", 'waring');
			return;
		}
		
		dealCreateOrderData();
		
		//添加托运单
		if($scope.operaType=="insertByImport"||$scope.operaType=="insertByManual"){
			
			$.jBox.tip("正在生成发货单...", 'loading');
			
			$http({
				method : 'POST',
				url : "/jsbweb/enterprise/deliverygoods/createOrder.do",
				data : $.param($scope.delivergoods),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			
			}).success(function(data) {
				if(data.ret==0){
					$scope.isCreateOrderDisabled=true;
					$.jBox.messager("成功生成发货单", "温馨提示", null, { width: 350, height:100});
					$.jBox.closeTip();
					$timeout(function(){
						$window.location.reload();
					},1500);
				}
				else if(data.ret==12){
					$.jBox.messager(data.message, "温馨提示", null, { width: 350, height:100});
					$.jBox.closeTip();
				}
				else if(data.ret==10){
					$.jBox.tip("请先登录", 'warning');
				}
			}).error(function(data){
				$.jBox.messager(data.message, "温馨提示", null, { width: 350, height:100});
				$.jBox.closeTip();
			});
		}
		//修改发货单
		else if($scope.operaType=="update"){
			
			$.jBox.tip("正在修改发货单...", 'loading');
			
			$http({
				method : 'POST',
				url : "/jsbweb/enterprise/deliverygoods/updateOrder.do",
				data : $.param($scope.delivergoods),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			
			}).success(function(data) {
				if(data.ret==0){
					$scope.isCreateOrderDisabled=true;
					$.jBox.messager("成功修改发货单", "温馨提示", null, { width: 350, height:100});
					$.jBox.closeTip();
					$timeout(function(){
						$window.location.reload();
					},1500);
				}
				else if(data.ret==12){
					$.jBox.messager(data.message, "温馨提示", null, { width: 350, height:100});
					$.jBox.closeTip();
				}
				else if(data.ret==10){
					$.jBox.tip("请先登录", 'warning');
				}
			}).error(function(data){
				$.jBox.messager(data.message, "温馨提示", null, { width: 350, height:100});
				$.jBox.closeTip();
			});
		}
	};
	
	//从发货单导入数据
	$scope.importData=function(order){
		console.info(order);
		
		$scope.operaType="insertByImport";
		
		initFormState('import');
		
//		$scope.formData.deliverynum=$scope.order.deliverynum;
		
		$scope.formData.datasource=order.datatype==1?2:3;
		
		$scope.formData.relationnum=order.ordernum;
		
		$scope.formData.sendstationid=order.warehouseid;
		$scope.queryFormData.storehouseKeyword=order.warehousename;
		
		//供应商信息
		$scope.formData.enterpriseid=order.supplierid;
//		$scope.formData.sendstationid=order.supplierstationid;
		
		$scope.formData.enlinkername=order.suppliercompanyname;
		$scope.formData.enlinkerphone=order.supplierphone;
		
		order.supplierprovincename=checkNull(order.supplierprovincename);
		order.suppliercityname=checkNull(order.suppliercityname);
		order.supplierareaname=checkNull(order.supplierareaname);
		order.supplieraddress=checkNull(order.supplieraddress);
		
		$scope.formData.sendaddress =order.supplierprovincename+order.suppliercityname+order.supplierareaname;
		$scope.formData.sendaddressExtra=order.supplieraddress;
//		$scope.formData.sendaddress=order.supplieraddress;
		
		$scope.queryFormData.enterpriseKeyword=order.suppliercompanyname;
		
		//采购商信息
		$scope.formData.recvcompanyid=order.buyerid;
		$scope.formData.recvstationid=order.buyerstationid;
		
		$scope.formData.recvlinkername=order.buyername;
		$scope.formData.recvlinkerphone=order.buyerphone;
		
		order.buyerprovincename=checkNull(order.buyerprovincename);
		order.buyercityname=checkNull(order.buyercityname);
		order.buyerareaname=checkNull(order.buyerareaname);
		order.buyeraddress=checkNull(order.buyeraddress);
		
		$scope.formData.recvaddress=order.buyerprovincename+order.buyercityname+order.buyerareaname;
		$scope.formData.recvaddressExtra=order.buyeraddress;
//		$scope.formData.recvaddress=order.buyeraddress;
		
		$scope.queryFormData.recvcompanyKeyword=order.buyername;
		
		$scope.formData.sumGoodsPrice=0;
		
		order.totgoodsmoney=(order.totgoodsmoney!=null&&order.totgoodsmoney!="")?order.totgoodsmoney:0;
		order.goodsdeposit=(order.goodsdeposit!=null&&order.goodsdeposit!="")?order.goodsdeposit:0;
		
		if(order.settlementtypeid==10){
			$scope.formData.codflag=1;
			$scope.formData.sumCodPrice=order.totgoodsmoney-order.goodsdeposit;
		}else{
			$scope.formData.sumCodPrice=0;
		}
		
		//存储货物明细数据到consignnotelist中
		$scope.commodities=new Array();
		if(order.orderlists!=null){
			angular.forEach(order.orderlists,function(detail,index){
				//缺少包装类型packtypeid，chargingtype运输方式
				var obj=new Object();
				obj.index=$scope.commodities.length+1; 
				obj.goodsid=detail.goodsid;
				obj.goodsName=detail.goodsname;
				obj.packageQty=1;
				obj.totalWeight=checkNullTo0(detail.goodsweight);
				obj.totalVolume=checkNullTo0(detail.goodsvolume);
				obj.totGoodsMoney=detail.dealingprice*detail.goodsqty;
				if(!isNaN(obj.totGoodsMoney)){
					$scope.formData.sumGoodsPrice+=parseInt(obj.totGoodsMoney);
				}
				
				$scope.commodities.push((obj));
				initCommodityCheck();
			});
		}
		
		if($scope.formData.datasource==2){
			$scope.formData.warehouseoutid=order.warehouseoutid;
		}
		
		if($scope.formData.datasource==3){
			$scope.formData.orderid=order.orderid;
		}
		
		$('#datasourceModal').modal('hide');
	}
	
	
	//新增货物明细
	$scope.newCommodity=function(){
		dealNewCommodity();
		initCommodityCheck();
	};
	
	//清空-->暂时为重新刷新页面
	$scope.clear=function(){
		$window.location.reload();
	};
	
	//移除货物明细
	$scope.removeCommodity=function(commodity){
		if($scope.operaType=="insertByImport"||($scope.operaType=='update'&&$scope.formData.datasource==2)||($scope.operaType=='update'&&$scope.formData.datasource==3)){
			var submit = function (v, h, f) {
			    if (v == 'ok') {
			    	$window.location.reload();
			    }
			    return true; //close
			};
			$.jBox.confirm("确认要取消受理该订单吗?", "温馨提示", submit);
			
		}
		else if($scope.operaType=="update"&&$scope.formData.datasource==1&&commodity.deliverylistid!=null){
			commodity.action="delete";
			dealSumGoodsPrice();
		}else{
			commodity.removeFlag=true;
			//重写数组的sort方法，将数组中removeFlag为true的对象放在最底部，并从数组中移除掉
			$scope.commodities.sort(function(a,b){
				if(a.removeFlag==true){
					return 1;
				}
				return 0;
			});
			$scope.commodities.pop();
			
			dealSumGoodsPrice();
		}
	};
	
	$scope.codflagChange=function(){
		if($scope.formData.codflag==1&&($scope.formData.sumCodPrice==null||$scope.formData.sumCodPrice=='')){
			$scope.formData.sumCodPrice=$scope.formData.sumGoodsPrice;
		}
	}
	
	$scope.isSumCodPriceCorrect=function(){
		var flag=true;
		if($scope.formData.sumCodPrice>$scope.formData.sumGoodsPrice){
//			$.jBox.tip("物流代收金额不能大于货物总金额", 'waring');
			flag=false;
		}
		return flag;
	}
	
	//打印
	$scope.createPrint=function(template){
		
	/*	$scope.printTemplate=template;
		
		$scope.choosePrintTemplate(template);*/
		
		$scope.delivergoods.delivergoodsnum=$scope.formData.delivergoodsnum;
		$scope.delivergoods.relationnumber=$scope.formData.relationnumber==null?"":$scope.formData.relationnumber;
		
		$scope.delivergoods.createdtime=$scope.formData.createdtime;
		
		$scope.delivergoods.loadstationid=$scope.formData.loadstationname;
		$scope.delivergoods.curstationid=$scope.formData.curstationname;
		$scope.delivergoods.unloadstationid=$scope.formData.unloadstationname;
		
		$scope.delivergoods.sendstationid=$scope.formData.sendstationname;
		
		//发货人信息
		$scope.formData.sendaddress=$scope.formData.sendaddress!=null?$scope.formData.sendaddress:"";
		if($scope.formData.sendaddressExtra!=null&&$scope.formData.sendaddressExtra!=""){
			$scope.formData.sendaddressExtra="-"+$scope.formData.sendaddressExtra;
		}else{
			$scope.formData.sendaddressExtra="";
		}
		$scope.delivergoods.enterpriseid=checkNull($scope.formData.enterprisename);
		$scope.delivergoods.enstationid=$scope.formData.enstationname;
		$scope.delivergoods.enlinkername=$scope.formData.enlinkername==null?"":$scope.formData.enlinkername;
		$scope.delivergoods.sendaddress=$scope.formData.sendaddress+$scope.formData.sendaddressExtra;
		$scope.delivergoods.enlinkerphone=$scope.formData.enlinkerphone;
		
		//收货人信息
		$scope.formData.recvaddress=$scope.formData.recvaddress!=null?$scope.formData.recvaddress:"";
		if($scope.formData.recvaddressExtra!=null&&$scope.formData.recvaddressExtra!=""){
			$scope.formData.recvaddressExtra="-"+$scope.formData.recvaddressExtra;
		}else{
			$scope.formData.recvaddressExtra="";
		}
		
		if(angular.isUndefined($scope.formData.recvcompanyid)||$scope.formData.recvcompanyid==null||$scope.formData.recvcompanyid==''){
			$scope.formData.recvcompanyid=0;
		}
		if(angular.isUndefined($scope.formData.recvstationid)||$scope.formData.recvstationid==null||$scope.formData.recvstationid==''){
			$scope.formData.recvstationid=0;
		}
		
		$scope.delivergoods.recvcompanyid=checkNull($scope.formData.recvcompanyname);
		$scope.delivergoods.recvstationid=$scope.formData.recvstationname;
		$scope.delivergoods.recvlinkername=$scope.formData.recvlinkername;
		$scope.delivergoods.recvaddress=$scope.formData.recvaddress+$scope.formData.recvaddressExtra;
		$scope.delivergoods.recvlinkerphone=$scope.formData.recvlinkerphone;
		//要求回单标志
		$scope.delivergoods.receiptflag=$scope.formData.receiptflagName;
		//送货方式
		$scope.delivergoods.deliverytype=$scope.findById($scope.deliveryTypes,"value",$scope.formData.deliveryType).name;
		//提货方式
		$scope.delivergoods.consignmenttype=$scope.findById($scope.consignmentTypes,"value",$scope.formData.consignmentType).name;
		
		//代收货款标志
		$scope.delivergoods.codflag=$scope.formData.codflagName;
		
		$scope.delivergoods.remark=$scope.formData.remark;
		
		var list=new Array();
		//存储货物明细数据到delivergoodslist中
		var delivergoodslist=new Array();
		if($scope.commodities!=null){
			angular.forEach($scope.commodities,function(commodity){
				if(commodity.goodsName==null||commodity.goodsName=='') return true;
				var obj=new Object();
				if($scope.operaType=="update"){
					obj.delivergoodslistid=commodity.delivergoodslistid;
				}
				obj.goodsname=commodity.goodsName;
				obj.packageqty=commodity.packageQty==null?0:commodity.packageQty;
				obj.totalweight=commodity.totalWeight==null?0:commodity.totalWeight;
				obj.totalvolume=commodity.totalVolume==null?0:commodity.totalVolume;
				obj.totgoodsmoney=commodity.totGoodsMoney==null?0:commodity.totGoodsMoney;
				obj.action=commodity.action;
				delivergoodslist.push(obj);
				
			});
			list.push(delivergoodslist);
			$scope.delivergoods.list=list;
		}
		
		$scope.formData.sumCodPrice=$scope.formData.sumCodPrice!=null?$scope.formData.sumCodPrice:0;
		$scope.delivergoods.codmoney=$scope.formData.sumCodPrice;
		
		$scope.formData.sumTransPrice=$scope.formData.sumTransPrice!=null?$scope.formData.sumTransPrice:0;
		$scope.delivergoods.fareamount=$scope.formData.sumTransPrice;
		
		$scope.delivergoods.additionalamount=$scope.formData.extraCharge!=null?$scope.formData.extraCharge:0;
		
		//存储附加费用到delivergoodscharge中
		var delivergoodscharge=new Array();
		if($scope.chargetypes!=null){
			angular.forEach($scope.chargetypes,function(chargetype){
				var obj=new Object();
				if($scope.operaType=="update"){
					obj.delivergoodschargeid=chargetype.delivergoodschargeid;
					obj.action="modify";
				}
				obj.chargetypeid=chargetype.basechargetypeid;
				obj.chargedirection=2;
				chargetype.chargeamount=(chargetype.chargeamount!=null&&chargetype.chargeamount!=""&&!isNaN(chargetype.chargeamount))?chargetype.chargeamount:0;
				obj.chargeamount=parseInt(chargetype.chargeamount);
				delivergoodscharge.push(obj);
			});
		}
		
		$scope.delivergoods.delivergoodscharge=angular.toJson(delivergoodscharge);
		
		$scope.delivergoods.settlementtypeid=parseInt($scope.formData.settlementType);
		//当结算类型为3即回单付时
		if($scope.formData.settlementType==3){
			$scope.delivergoods.prepayamount=$scope.formData.prePrice==null?0:$scope.formData.prePrice;
		}else{
			$scope.delivergoods.prepayamount=0;
		}
		
		$scope.delivergoods.totchargereceivable=$scope.formData.totalPrice-$scope.delivergoods.prepayamount;
		
		console.info(angular.toJson($scope.delivergoods));
		
		if(angular.isUndefined($scope.printTemplate)) return;
		
		/*var dow=new printDoc();
		dow.viewModel($scope.printTemplate,$scope.delivergoods);*/
		
		
		console.info(angular.toJson($scope.delivergoods));
	}
	
	//打印模板
	$scope.printTemplate={};
	
	//选择模板
	$scope.choosePrintTemplate=function(template){
		
		$scope.printTemplate=template;
		angular.forEach($scope.templates,function(item){
			item.isActive=false;
		});
		template.isActive=true;
	}
	
	//在datas中查找key为value的对象
	$scope.findById=function findById(datas, key,value) {
        for (var i = 0; i < datas.length; i++) {
            if (datas[i][key] == value) return datas[i];
        }
        return null;
    }
	
	//显示添加联系人模态框
	$scope.showContractorModal=function(type){
		
		if($scope.operaType=="update"||$scope.isView==true) return;
			
		$scope.contractor={};
		if(type=='enterprise') $scope.contractor_modal_title="发货人";
		if(type=='recvcompany') $scope.contractor_modal_title="收货人";
		$("#contractorModal").modal("show");
	}
	
	//添加联系人
	$scope.addContractor=function(form){
		$scope.contractor.isCommitted=true;
		if(form.$invalid){
			$.jBox.tip('请检查输入', 'warning'); 
			return;
		}
		
		$scope.contractor.provinceid=$scope.contractor.pcaids.split("&")[0];
		$scope.contractor.cityid=$scope.contractor.pcaids.split("&")[1];
		$scope.contractor.areaid=$scope.contractor.pcaids.split("&")[2];
		
		$scope.contractor.provincename=$scope.contractor.pca.split(" ")[0];
		$scope.contractor.cityname=$scope.contractor.pca.split(" ")[1];
		$scope.contractor.areaname=$scope.contractor.pca.split(" ")[2];
		
		$scope.contractor.scenetypeid=3;
		
		$scope.contractorData={data:angular.toJson($scope.contractor)};
		
		$http({
			method : 'POST',
			url : "/jsbweb/base/contractorinfo/add.do",
			data:$.param($scope.contractorData),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data) {
			if(data.ret==0){
				$.jBox.tip('添加成功', 'success'); 
				$("#contractorModal").modal("hide");
				$scope.queryRecvcompany();
				$scope.contractor={};
			}
		});
	}
	
}]);

