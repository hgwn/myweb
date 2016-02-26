/**
 * Created by Administrator on 2015-09-06.
 */
entOrdersModule.controller("ordersAddController",
    ['$scope','$rootScope','$http',"$stateParams","$state","i18nService","ordersService","$timeout","purchaseOrdersService",
        function($scope, $rootScope, $http,$stateParams,$state,i18nService,ordersService,$timeout,purchaseOrdersService) {
    	i18nService.setCurrentLang('zh-cn');
    	$scope.orders = {};
    	$scope.orders.orderlist = [];
    	$scope.temp_orderlist=[];
    	$scope.selectedAcontact= {};
    	$scope.warehouse = {};
    	$scope.orders.ordersource = 1;
    	$scope.orders.orderaddress = {};
    	
    	//默认标志
    	$scope.type = [
  	                 { id: 1, value: "是" },
  	                 { id: 2, value: "否" }
  	             ];
    	
    	//收货人信息,初始化省市县
        $scope.receiveData = {};
        //开单地址是否显示
        $scope.receiveData.addressItemShow = false;
        //地址添加模态窗口是否显示
        $scope.receiveData.modalShow = false;
        $scope.receiveData.provinceid = 0;
        $scope.receiveData.cityid = 0;
        $scope.receiveData.areaid = 0;
    	
             //省市县初定义
             $scope.baseData = {
                 provinces:[],
                 citys:[],
                 areas:[]
             }
             
             //初始方法
             $scope.init = function(){
            	 
            	 //修改切换界面后赋值
            	 if($state.orders !=null){
            		 
 	    			$scope.orders = $state.orders;
 	    			
 	    			$scope.receiveData.addressItemShow = true;
 	    			$scope.orders.orderaddress = $state.orders.orderaddress;
 	    			
 	    			$scope.orders.orderaddressid = $scope.orders.orderaddress.orderaddressid;
 	    			
 	    			$scope.contactkeyword = $state.orders.buyername;
 	    			$scope.selectedAcontact={
    					companyid:$scope.orders.buyerid,
    					companyname:$scope.orders.buyername,
 	    			};
 	    			
 	    			/*$scope.storehouseKeyword = $state.orders.warehousename;
 	    			$scope.warehouse = {
 	    				stationid:$state.orders.warehouseid
 	    			}; */ 
 	    			$scope.orders.edit = "修改";
 	    			
 	    			angular.forEach($scope.orders.orderlist, function(value, key){
 	    				
 	    				/*value.goodsmoney = value.totalmoney;*/
 	    				
 	    				if(value.giftflag == 1){
 	    					value.isgiftflag = false;
 	    				}else{
 	    					value.isgiftflag = true;
 	    				}
 	    			});
 	    			
 	    			//获取临时数据
 	    			$scope.orders.orderlist = angular.copy($state.orders.orderlist);
 	    			$scope.temp_orderlist = angular.copy($state.orders.orderlist);
 	    			
 	    			
 	    		}else{
 	    			
 	    			//新增界面 获取日期和单号
 	    			ordersService.getOrderNum(function(ordernum){
 	                     $scope.orders.ordernum = ordernum + "";
 	                 }, function(err){
 	                     console.log(err)
 	                 });
 	                 //$scope.getProvince();
 	    			$scope.orders.edit = "新增";
 	                console.log("新增订单")
 	                var begin_date = new Date();
 	                $scope.orders.createdtime = begin_date.pattern("yyyy-MM-dd HH:mm");
 	    			
 	    		}
             };

             //获取省市县
        	 $scope.getProvince = function(){
                 var data = {};
                 ordersService.getPCA(data, function(res){
                     $scope.baseData.provinces = res.data.rows;
                 }, function(err){
                     $.jBox.tip("获取地区数据失败:" + err.message);
                 });
             };
             
             $scope.getCity = function(provinceid, callback){
             	
                 if(provinceid == undefined || provinceid == 0)
                     return;
                 var data = {};
                 data.provinceid = provinceid;
                 ordersService.getPCA(data, function(res){
                     $scope.baseData.citys = res.data.rows;
                     if(callback != undefined){
                     	callback(provinceid);
                     }
                 }, function(err){
                     $.jBox.tip("获取地区数据失败:" + err.message);
                 });
             };

             $scope.getArea = function(cityid, callback){
             	
                 if(cityid == undefined || cityid == 0)
                     return;
                 var data = {};
                 data.cityid = cityid;
                 ordersService.getPCA(data, function(res){
                     $scope.baseData.areas = res.data.rows;
                     if(callback != undefined){
                     	callback(cityid);
                     }
                 }, function(err){
                     $.jBox.tip("获取地区数据失败:" + err.message);
                 });
             };
        	
             //调用
             $scope.getProvince();
             
             //触发获取市县方法
             $scope.onChangeProvince = function(provinceid){
             	$scope.getCity(provinceid);
                 $scope.orders.cityid='';
                 $scope.orders.areaid = '';
                 $scope.orders.buyercityid='';
                 $scope.orders.buyercityname='';
                 $scope.orders.buyerareaname = '';
                 var province=$scope.findById($scope.baseData.provinces,"provinceid",provinceid);
                 $scope.orders.buyerprovincename=province.provincename;
             }
             $scope.onChangeCity = function(cityid){
             	$scope.getArea(cityid);
                $scope.orders.areaid = '';
                $scope.orders.buyerareaid = '';
                $scope.orders.buyerareaname = '';
                var city=$scope.findById($scope.baseData.citys,"cityid",cityid);
                $scope.orders.buyercityname=city.cityname;
             }
             
             $scope.onChangeArea = function(areaid){
            	 $scope.orders.areaid=areaid;
                 var area=$scope.findById($scope.baseData.areas,"areaid",areaid);
                 $scope.orders.buyerareaname=area.areaname;
              }


             //删除临时记录
             $scope.delrecord = function(index){
                 $scope.orders.orderlist.splice(index, 1);
                 $scope.temp_orderlist[index].action="delete";
             };

             //添加一行
             $scope.addNewRow = function(){
            	 
                 var row = {};
                 row.action = "add";
                 row.discountrate = 0;
                 row.goodsqty = 1;
                 row.giftflag = 1;
                 row.isgiftflag = false;
                 row.selected = "";
                 $scope.orders.orderlist.push(row);
                 
                 $scope.$watch(function() {
                     return row.selected;
                 }, function(newVal, oldVal) {
                	 
                	 /*//实现提示选择仓库操作
                	 if( newVal.goodsid !=undefined){
                		 if ($scope.orders.warehouseid == undefined || $scope.orders.warehouseid == "") {
	                         $.jBox.tip('请选择订单出货仓库', 'warning');
                		 }
                	 }*/
         		 		
                	 //实现添加重复商品时自己匹配操作
                	 angular.forEach($scope.orders.orderlist, function(value, key){
                		 
                		 	if( value.goodsid !=undefined && value.goodsid == newVal.goodsid){
                		 		
                		 		value.goodsqty = value.goodsqty + 1;
                		 		$scope.orders.orderlist.pop();
                		 		$.jBox.tip('重复商品已合并,并且数量+1', 'warning');
                		 	}
                		});
                	 
                     row.goodsname = newVal.goodsname;
                     row.goodsid = newVal.goodsid;
                     row.dealingprice = newVal.shopprice;
                     row.goodsmoney = newVal.price;
                     row.goodssn = newVal.goodssn;
                     row.barcode = newVal.barcode;
                     
                     if(row.goodsname != undefined){
                    	 row.maxinventory = newVal.productstockconfig.maxinventory;
                     }
                     
                 });
                 
                 //监听商品数量
                 $scope.$watch(function() {
                     return row.goodsqty;
                 }, function(newVal, oldVal) {
                 	var reg = /^(?:[1-9]\d*|0)$/;
                 	if(!reg.test(newVal)){
                 		newVal = oldVal;
                 		row.goodsqty = oldVal;
                 	}
                 	/*if(row.goodsqty>row.maxinventory){
                 		
                 		$.jBox.tip('商品数量已经超过库存数量', 'warning');
                 	}*/
                     row.goodsmoney = (newVal *  row.dealingprice);
                 })
                 
                 //监听单价
                 $scope.$watch(function() {
                     return row.dealingprice;
                 }, function(newVal, oldVal) {
                 	var reg1 = /^\d+(\.\d{2})?$/;
                 	var reg = /^\d+(\.\d{1})?$/;
                 	var reg2 = /^(?:[1-9]\d*|0)$/;
                 	if(!reg2.test(row.dealingprice) && !reg.test(row.dealingprice) && !reg1.test(row.dealingprice)){
                 		row.dealingprice = oldVal;
                 		newVal = oldVal;
                 	}
                     row.goodsmoney = (row.goodsqty *  newVal);

                 })
                 
                 //监听是否赠品
                 $scope.$watch(function(){
                     return row.isgiftflag;
                 }, function(newVal, oldVal){
                     if(newVal){
                         row.giftflag = 2;
                         row.goodsmoney = 0;
                         row.dealingprice = 0;
                         row.discountrate = 100;
                     }
                     else{
                         row.giftflag = 1;
                         row.dealingprice = row.marketprice;
                         row.discountrate = row.discountrate;
                         row.goodsmoney = (row.goodsqty *  row.dealingprice).toFixed(2);
                     }
                 })
                 
                 //监听折扣率
                  $scope.$watch(function(){
                     return row.discountrate;
                 }, function(newVal, oldVal){
                	var reg1 = /^\d+(\.\d{2})?$/;
                  	var reg = /^\d+(\.\d{1})?$/;
                  	var reg2 = /^(?:[1-9]\d*|0)$/;
                  	if(!reg2.test(row.discountrate) && !reg.test(row.discountrate) && !reg1.test(row.discountrate)){
                  		row.discountrate = oldVal;
                  		newVal = oldVal;
                  	}
                      /*row.goodsmoney = (row.goodsqty * row.dealingprice * 100 - (row.goodsqty *  row.dealingprice * newVal));
                      var goodsmoney = parseFloat(row.goodsmoney/100);
                      row.goodsmoney = goodsmoney.toFixed(2);
                      
                      console.warn(row.goodsmoney);*/
                  	  row.goodsmoney = (row.goodsqty *  row.dealingprice - (row.goodsqty *  row.dealingprice * newVal * 0.01));
                 })
              
             //计算总数量
             $scope.sumGoodsQty = function(){
                 var totgoodsqty = 0;
                 angular.forEach($scope.orders.orderlist, function(data,index,array){
                     if(data.goodsid != undefined && !isNaN(data.goodsqty) && !isNaN(data.dealingprice))
                         totgoodsqty += data.goodsqty;
                 });
                 $scope.orders.totgoodsqty = totgoodsqty;
                 return totgoodsqty;
             };
             //计算总金额
             $scope.sumGoodsMoney = function(){
                 var totgoodsmoney = 0;
                 angular.forEach($scope.orders.orderlist, function(data,index,array){
                     if(data.goodsid != undefined && !isNaN(data.goodsqty) && !isNaN(data.dealingprice) && !isNaN(data.discountrate))
                         totgoodsmoney += data.goodsqty * data.dealingprice - (data.goodsqty *  data.dealingprice * data.discountrate * 0.01);
                 });
                 $scope.orders.totgoodsmoney = totgoodsmoney;
                 return totgoodsmoney;
             };
             
          }
             $scope.addNewRow(); 
             
             //获取客户信息
             $scope.getContact = function(){
                 ordersService.getContact($scope.contactkeyword ,function(data, flag){
                	 
                     
                     if(flag){//成功
                     	angular.forEach(data.rows, function(value){
                     		var addressEx = "";
                     		if(!angular.isUndefined(value.provincename)){
                     			addressEx += value.provincename;
                     		}
                     		if(!angular.isUndefined(value.cityname)){
                     			addressEx += value.cityname;
                     		}
                     		if(!angular.isUndefined(value.areaname)){
                     			addressEx += value.areaname;
                     		}
                     		if(!angular.isUndefined(value.address)){
                     			addressEx += "-" +value.address;
                     		}
                     		value.addressEx = addressEx;
                     	});
                         $scope.contacts = data.rows;
                         console.warn($scope.contacts);
                         
                         /*$scope.addressClick($scope.receiveData.dataList[0]);
 						 $scope.receiveData.dataList[0].receiveData = true;*/
                         
                     }
                     else{//失败

                     }
                 });
             };
             
           //检测客户改变时触发
             $scope.$watch("selectedAcontact",function(newVal){
            	 
                 if(angular.isUndefined(newVal)) 
                 	return;
                 $scope.orders.buyerid = newVal.companyid;
                 $scope.orders.buyername = newVal.companyname;
                 
                 $scope.orders.buyerphone = newVal.mobilephone;
                 $scope.orders.buyeraddress = newVal.address;
                 $scope.orders.addressEx = newVal.addressEx;
                 
                 $scope.orders.buyerprovincename = newVal.provincename;
                 $scope.orders.buyercityname = newVal.cityname;
                 $scope.orders.buyerareaname = newVal.areaname;
                 
                 $scope.orders.go = true;
                 
                 $scope.getAddressmanage($scope.orders.buyerid,$scope.orders.go);
                 
                 
                 if($scope.orders.buyerprovinceid == newVal.provinceid){
                 	if($scope.orders.buyercityid == newVal.cityid){
                 		$scope.orders.buyerareaid = newVal.areaid;
                 	}else{
 	                	$scope.orders.buyercityid = newVal.cityid;
 	                	$scope.getArea(newVal.cityid, function(cityid){
 	                		$timeout(function(){
 	                            $scope.orders.buyerareaid = newVal.areaid;	
 	                		}, 300);
 	                  	});
                 	}
                 }else{
 	                $scope.orders.buyerprovinceid = newVal.provinceid;
 	                $scope.baseData.citys = '';
 	                $scope.baseData.areas = '';
 	                
 	                $scope.getCity($scope.orders.buyerprovinceid, function(provinceid){
 	                	
 	                	$scope.getArea(newVal.cityid, function(cityid){
 	                		$timeout(function(){
 	                			$scope.orders.buyercityid = newVal.cityid;
 	                            $scope.orders.buyerareaid = newVal.areaid;	
 	                		}, 300);
 	                		
 	                  	});
 	                });
                 }
             });
             
             /*$scope.storehouseKeyword = "";
             //查询登录公司仓库信息（站点类型为3的站点信息）
             $scope.queryStorehouse = function(){
                 var param = {stationname: $scope.storehouseKeyword};
                 $http({
                     method : 'GET',
                     url : "/jsbweb/station/list.do?" +$.param(param)
                 }).success(function(data) {
                     if(data.data!=null){
                         $scope.storehouses = data.data.rows;
                         
                     }
                 });
             }
             //检测仓库改变时触发
             $scope.$watch("warehouse",function(newVal){
                 if(angular.isUndefined(newVal)) return;
                 $scope.orders.warehouseid = newVal.stationid;
                 $scope.orders.warehousename = newVal.stationname;
             });*/
             
             //检测赠品改变时触发
             $scope.changeGiftflag = function(index){
            	 console.info(index);
            	 
         	};
             
             
             //获取商品信息
             $scope.querygoodssku=function(item){

             	var param = {
         			pagenum:1,
         			pagesize:50,
             	};
             	
                 $http({
                     method : 'POST',
                     url : "/jsbweb/baseline/orders/getgoods_by_classify.do",
                     data : $.param(param),
                     headers : {
                         'Content-Type' : 'application/x-www-form-urlencoded'
                     }
                 }).success(function(data) {
                     if(data.ret==0){
                         $scope.goodsskus = data;
                         console.info($scope.goodsskus);
                     }
                     if(data.ret==10){
                         $.jBox.tip("请先登录", 'warning');
                     }
                 });
             };
             
             
             //初始方法
             $scope.init();
             
             //手工开单
             $scope.submit = function() {
            	 
                 for (var i = 0; i < $scope.orders.orderlist.length; i++) {
                     if ($scope.orders.orderlist[i].goodsid == undefined) {
                         $scope.orders.orderlist.splice(i, 1);
                         i--;
                     }
                 }
                 if ($scope.orders.orderlist.length == undefined || $scope.orders.orderlist.length <= 0) {
                     $.jBox.tip('订单明细不能为空', 'warning');
                     return ;
                 }
                 
                $scope.orders.orderaddress.companyid = $scope.orders.buyerid;
             	$scope.orders.orderaddress.companyname =  $scope.orders.buyername;
                 
                 //新增操作
                 
                 if($scope.orders.orderid == undefined) {
                	 
                	 $scope.orders.deliverydate = $scope.orders.deliverydate +' 23:59:59'
                	 
                	 if ($scope.orders.deliverydate < $scope.orders.createdtime) {
                         $.jBox.tip('发货日期不能早于开单日期', 'warning');
                         return ;
                     }
                	 if ($scope.orders.buyername == undefined || $scope.orders.buyername == "") {
                         $.jBox.tip('客户不能为空', 'warning');
                         return ;
                     }
                	 
	                 var data = {data: angular.toJson($scope.orders)};
	                 $http({
	                     method : 'POST',
	                     url : '/jsbweb/baseline/orders/add_orders.do',
	                     data : $.param(data),
	                     headers : {
	                         'Content-Type' : 'application/x-www-form-urlencoded'
	                     }
	                 }).success(function(data){
	                     
	                     if(data.ret == 0) {
	                         $.jBox.tip('销售开单成功,跳转至详情页', 'success');
	                         
	                         $state.go("check",{ordernum:$scope.orders.ordernum,pagesize:20,pagenum:1});
	                     } 
	                     else if(data.ret == 20012){
	                    	 
	                    	 $.jBox.tip('订单号已存在' , 'warning');
	                     }
	                     else {
	                         $.jBox.tip('销售开单失败' , 'warning');
	                     }
	
	                 }).error(function(rep){
	                     $.jBox.tip('销售开单失败', 'warning');
	                 });
          
             }else{
            	//修改界面保存操作
            	 
            	 $scope.orders.orderaddress.orderaddressid = $scope.orders.orderaddressid; 
            	
            	 $scope.orders.orderaddress.companyid = $scope.orders.buyerid;
             	 $scope.orders.orderaddress.companyname =  $scope.orders.buyername;
             	 $scope.orders.orderaddress.addressmanageid = $scope.orders.orderaddress.addressmanageid;
             	 $scope.orders.orderaddress.orderid =  $scope.orders.orderid;
             	 $scope.orders.orderaddress.buyerid =  $scope.orders.buyerid;
            	 
            	var tempparameter = [];
         		angular.forEach($scope.orders.orderlist, function (value, key) {
         			switch(value.action)
         			{
         			case "add":
         				value.action = "add";
         				value.orderlistid= 0;
         				value.orderid = $scope.orders.orderid;
         				break;
         			  default: value.action = "modify";
         			}
         		
         			tempparameter.push(value);
         		});
         		
         		angular.forEach($scope.temp_orderlist,function(dvalue,dkey){
         			if(dvalue.action=="delete"){
         				tempparameter.push(dvalue);
         			}
         		});
         		
         		$scope.orders.orderlist = tempparameter;
            	 
         		var data = { data: angular.toJson($scope.orders)};
     			$http({
                     method: 'POST',
                     url: "/jsbweb/baseline/orders/modify_orders.do",
                     data: $.param(data),
                     headers: {
                         'Content-Type': 'application/x-www-form-urlencoded'
                     }
                 }).success(function (data) {
                 	
                     if (data.ret == 0) {
                     	
                         $.jBox.tip("修改成功,跳转至详情页", 'success');
                         /*$state.go("entry");*/
                         $state.go("check",{ordernum:$scope.orders.ordernum,pagesize:20,pagenum:1});
                         
                     } else if (data.ret == 10) {
                         $.jBox.tip("请先登录", 'warning');
                     } else {
                         $.jBox.tip("修改失败", 'warning');
                     }
                 }).error(function (rep) {
                     $.jBox.tip("修改失败", 'warning');
                 });
             }	 
         }
             
         //x修改销售单收货地址   
         $scope.submitAddress = function(){
        	 
        	 $scope.ordersAddress = $scope.orders.orderaddress;
        	 $scope.ordersAddress.companyid = $scope.orders.buyerid;
          	 $scope.ordersAddress.companyname =  $scope.orders.buyername;
          	 $scope.ordersAddress.addressmanageid = $scope.orders.orderaddress.addressmanageid;
          	 $scope.ordersAddress.orderid =  $scope.orders.orderid;
          	 $scope.ordersAddress.buyerid =  $scope.orders.buyerid;
          	 $scope.ordersAddress.orderaddressid = $scope.orders.orderaddressid;
          	 
        	 
        	 var data = {data: angular.toJson($scope.ordersAddress)};
             $http({
                 method : 'POST',
                 url : '/jsbweb/baseline/orders/update_orderaddress.do',
                 data : $.param(data),
                 headers : {
                     'Content-Type' : 'application/x-www-form-urlencoded'
                 }
             }).success(function(data){
                 
                 if(data.ret == 0) {
                     $.jBox.tip('地址修改成功,跳转至详情页', 'success');
                     
                     $state.go("check",{ordernum:$scope.orders.ordernum,pagesize:20,pagenum:1});
                 } 
                 else if(data.ret == 20012){
                	 
                	 $.jBox.tip('订单号已存在' , 'warning');
                 }
                 else {
                     $.jBox.tip('地址修改失败' , 'warning');
                 }

             }).error(function(rep){
                 $.jBox.tip('地址修改失败', 'warning');
             });
        	 
         }    
             
       //查询收发货地址
     	$scope.getAddressmanage = function(buyerid,go){
     		
     		if(go != true){
     			if(buyerid == undefined){
         			$.jBox.tip("请选择一个经销商!", 'warning');
         			return;
         		}
     			$('#addressManager').modal("show");
     		}
     		
     		var params = {};
     		params.pagesize = 20;
     		params.pagenum = 1;
     		params.addresstype = 1;
     		params.companyid = buyerid;
     		if(buyerid == undefined ){
     			return;
     		}
     		purchaseOrdersService.httpPost(purchaseOrdersService.getAddressManage(),params,function(resp){
     			
     			if(resp.ret == 0){
     				$scope.receiveData.dataList = resp.data.rows;
     				//不显示编辑修改功能
     				angular.forEach($scope.receiveData.dataList,function(data,index,array){
     					data.editDeleteShow = false;
     				});
     				
     				if($scope.receiveData.dataList.length != 0 && go==true){
     					if($scope.orders.orderid == undefined || $scope.orders.orderid == ''){
     						$scope.addressClick($scope.receiveData.dataList[0]);
     						$scope.receiveData.dataList[0].receiveData = true;
     					}
     				}else{
     					$("#addressManager").modal("show");
     					return;
     				}
     				
     				//默认选中
     				if($scope.orders.orderid == undefined || $scope.orders.orderid == ''){
	     				angular.forEach($scope.receiveData.dataList,function(data,index,array){
	     					if(data.isdefault == 1){
	     						$scope.addressClick(data);
	     						data.receiveData = true;
	     					}
	     				});
     				}
     				
     				/*if($scope.receiveData.dataList.length != 0){
     					if($scope.orders.orderid == undefined || $scope.orders.orderid == ''){
     						$scope.addressClick($scope.receiveData.dataList[0]);
     						$scope.receiveData.dataList[0].receiveData = true;
     					}
     				}*/
     			}else if(resp.ret == 10){
     				
     				$.jBox.tip("请重新登录!", 'warning');
     			}else{
     				
     				$.jBox.tip("查询收发货地址失败", 'warning');
     			}
     		});
     	};   
     	
     	//点击选择地址
    	$scope.addressClick = function(receiveItem){
    		//不显示编辑修改功能
    		angular.forEach($scope.receiveData.dataList,function(data,index,array){
    			data.editDeleteShow = false;
    		});
    		$scope.receiveData.modalShow = false;
    		$scope.receiveData.addressItemShow = true;
    		receiveItem.editDeleteShow = true;
    		//选择地址
    		
    		$scope.orders.orderaddress = receiveItem;
    		console.warn($scope.orders.orderaddress);
    	};
     	
     	
       //在datas中查找key为value的对象
     	$scope.findById = function findById(datas, key,value) {
     		if(datas == null){
     			return null;
     		}
             for (var i = 0; i < datas.length; i++) {
                 if (datas[i][key] == value) return datas[i];
             }
             return null;
         };
             
}])
.controller('OrdersAddressManageController',['$state','$scope','$rootScope','$http','$timeout','OrdersBaseService','$alert','commodityService','purchaseOrdersService','$alert','$timeout',
function($state,$scope,$rootScope,$http,$timeout,OrdersBaseService,$alert,commodityService,purchaseOrdersService,$alert,$timeout){
	
    
  //获取省份信息
	$scope.getProvince = function(){
		commodityService.httpGet(commodityService.getDistrictUrl(),function(resp){
			var newObject = {
					provinceid:0,
					provincename:'--请选择省份--'
			};
	        $scope.provinceList = resp.data.rows;
	        $scope.provinceList.push(newObject);
	    });
	};
	//获取城市信息
	$scope.getArea = function(){
		commodityService.httpGet(commodityService.getDistrictUrl()+"?provinceid="+$scope.receiveData.provinceid,function(resp){
			var newObject = {
					cityid:0,
					cityname:'--请选择城市--'
			};
			$scope.areaList = resp.data.rows;
			$scope.areaList.push(newObject);
			//
			$scope.receiveData.cityid = 0;
	    });
	};
	//获取区、县信息
	$scope.getDistrict = function(){
		var url = commodityService.getDistrictUrl()+"?provinceid="+$scope.receiveData.provinceid+
		          "&cityid="+$scope.receiveData.cityid;
		commodityService.httpGet(url,function(resp){
			var newObject = {
					areaid:0,
					areaname:'--请选择区县--'
			};
	        $scope.districtList = resp.data.rows;
	        $scope.districtList.push(newObject);
	        $scope.receiveData.areaid = 0;
	    });
	};
	$scope.getProvince();
	$scope.getArea();
	$scope.getDistrict();
	
	//保存收-发货地址
	$scope.saveAddressManage = function(){
		/*if(!$scope.testPurchaseOrders()){
			return ;
		};*/
		if($scope.addressModifyAddFlag == 'add'){
			var params = {};
			params.companyid = $scope.orders.buyerid;
			
			params.isdefault = $scope.receiveData.isdefault;
			
			params.addresstype = 1;  //1为收货地址
			params.contactname = $scope.receiveData.contactname;
			params.mobile = $scope.receiveData.mobile;
			params.phonepostcode = $scope.receiveData.phonepostcode;
			params.phone = $scope.receiveData.phone;
			params.phonesubcode = $scope.receiveData.phonesubcode;
			params.provinceid = $scope.receiveData.provinceid;
			params.cityid = $scope.receiveData.cityid;
			params.areaid = $scope.receiveData.areaid;
			params.address = $scope.receiveData.address;
			params.postcode = $scope.receiveData.postcode;
			params.remark = $scope.receiveData.remark;
			console.log(params);
			purchaseOrdersService.httpPost(purchaseOrdersService.addBaseAddressManage(),params,function(resp){
				console.info(resp);
				$scope.orders.go = true;
				$scope.getAddressmanage(params.companyid,$scope.orders.go);
			});
		}
		/*else if($scope.addressModifyAddFlag == 'modify'){
			var params = {}; 
			params.addressmanageid = $scope.receiveData.addressmanageid;
			params.contactname = $scope.receiveData.contactname;
			params.mobile = $scope.receiveData.mobile;
			params.phonepostcode = $scope.receiveData.phonepostcode;
			params.phone = $scope.receiveData.phone;
			params.phonesubcode = $scope.receiveData.phonesubcode;
			params.provinceid = $scope.receiveData.provinceid;
			params.cityid = $scope.receiveData.cityid;
			params.areaid = $scope.receiveData.areaid;
			params.address = $scope.receiveData.address;
			params.postcode = $scope.receiveData.postcode;
			params.remark = $scope.receiveData.remark;
			console.log(params);
			purchaseOrdersService.httpPost(purchaseOrdersService.modifyAddressManage(),params,function(resp){
				console.info(resp);
				$scope.getAddressmanage();
			});
		}*/
	};
	
	
	//$scope.getAddressmanage();
	
	/*//点击选择地址
	$scope.addressClick = function(receiveItem){
		//不显示编辑修改功能
		angular.forEach($scope.receiveData.dataList,function(data,index,array){
			data.editDeleteShow = false;
		});
		$scope.receiveData.modalShow = false;
		$scope.receiveData.addressItemShow = true;
		receiveItem.editDeleteShow = true;
		//选择地址
		
		$scope.orders.orderaddress = receiveItem;
		console.warn($scope.orders.orderaddress);
	};*/
	
	//点击选择新地址
	$scope.newAddressClick = function(){
		
		console.info("addcontrol")
		//不显示编辑修改功能
		angular.forEach($scope.receiveData.dataList,function(data,index,array){
			data.editDeleteShow = false;
		});
		//添加新地址标志
		$scope.addressModifyAddFlag = 'add';
		//显示地址管理模态界面
		$scope.receiveData.modalShow = true;
		//清空所选地址
		$scope.orders.orderaddress = {};
		$scope.receiveData.addressItem = {};
		$scope.receiveData.addressItemShow = false;
		console.log($scope.receiveData.newReceiveItem);
	};
	
	//弹出地址管理模态窗口
	$scope.chooseAddress = function(){
		if($scope.orders.orderaddress.addressmanageid != undefined){
			$("#addressManager").modal("hide");
		}else{
			$.jBox.tip("请选择一个收货地址!", 'warning');
		}
	};
	//删除地址
	/*$scope.deleteAddress = function(receiveItem){
		console.info(receiveItem);	
		var params = {};
		params.addressmanageid = receiveItem.addressmanageid;
		purchaseOrdersService.httpPost(purchaseOrdersService.deleteAddressManage(),params,function(resp){
			if(resp.ret == 0){
				$.jBox.tip('地址删除成功!', 'success');
				$scope.getAddressmanage();
			}else if(resp.ret == 10){
				$.jBox.tip("请重新登录!", 'warning');
			}else{
				$.jBox.tip("删除异常!", 'warning');
			}
		});
	};*/
	//修改地址
	/*$scope.modifyAddress = function(receiveItem){
		
		$scope.addressModifyAddFlag = 'modify';
		$scope.receiveData.addressmanageid = receiveItem.addressmanageid;
		$scope.receiveData.contactname = receiveItem.contactname;
		$scope.receiveData.mobile = receiveItem.mobile; 
		$scope.receiveData.phone = receiveItem.phone;
		$scope.receiveData.phonesubcode = receiveItem.phonesubcode;
		$scope.receiveData.postcode = receiveItem.postcode;
		$scope.receiveData.phonepostcode = receiveItem.phonepostcode;
		$scope.receiveData.provinceid = receiveItem.provinceid;
		$scope.receiveData.cityid = receiveItem.cityid;
		$scope.receiveData.areaid = receiveItem.areaid;
		$scope.receiveData.address = receiveItem.address;
		$scope.receiveData.remark = receiveItem.remark;
		$scope.receiveData.modalShow = true;
		console.log($scope.receiveData);
		commodityService.httpGet(commodityService.getDistrictUrl()+"?provinceid="+$scope.receiveData.provinceid,function(resp){
			var newObject = {cityid:0,cityname:'--请选择城市--'};
			$scope.areaList = resp.data.rows;
			$scope.areaList.push(newObject);
	    });
		var url = commodityService.getDistrictUrl()+"?provinceid="+$scope.receiveData.provinceid+
		        "&cityid="+$scope.receiveData.cityid;
		commodityService.httpGet(url,function(resp){
			var newObject = {areaid:0,areaname:'--请选择区县--'};
		    $scope.districtList = resp.data.rows;
		    $scope.districtList.push(newObject);
		});
	};*/
}]);

