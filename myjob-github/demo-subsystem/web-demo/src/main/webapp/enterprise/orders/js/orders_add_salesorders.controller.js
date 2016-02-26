/**
 * Created by Administrator on 2015-06-10.
 */
//
//Number.prototype.toFixed=function(len)
//{
//    var tempNum = 0;
//    var s,temp;
//    var s1 = this + "";
//    var start = s1.indexOf(".");
//
//    //截取小数点后,0之后的数字，判断是否大于5，如果大于5这入为1
//
//    if(s1.substr(start+len+1,1)>=5)
//        tempNum=1;
//
//    //计算10的len次方,把原数字扩大它要保留的小数位数的倍数
//    var temp = Math.pow(10,len);
//    //求最接近this * temp的最小数字
//    //floor() 方法执行的是向下取整计算，它返回的是小于或等于函数参数，并且与之最接近的整数
//    s = Math.floor(this * temp) + tempNum;
//    return s/temp;
//
//}

entOrdersModule.controller("ordersAddSalesOrderController",
    ['$scope','$rootScope','$http',"$stateParams","$state","$window","$timeout","ordersService",
        function($scope, $rootScope, $http,$stateParams,$state,$window,$timeout,ordersService, utils) {
            $scope.orders = {
                totgoodsmoney:0,
                paymenttype:0,
                autowarehouseout:1,
                tradesourceflag:3,
                goodsdeposit:0,
                orderlist:[]
            };

            //$scope.state
            $scope.baseData = {
                provinces:[],
                citys:[],
                areas:[]
            }
            
            $scope.init = function(){
                ordersService.getOrderNum(function(ordernum){
                    $scope.orders.ordernum = ordernum + "";
                }, function(err){
                    console.log(err)
                });
                $scope.getProvince();

                var begin_date = new Date();
                $scope.orders.createdtime = begin_date.pattern("yyyy-MM-dd HH:mm");
            };

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
                //data.provinceid = province.provincename;
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

            $timeout(function(){
                $scope.init();
            },100);


            $scope.validatemobile = function(mobile)
            {
                if(mobile == undefined || mobile == "" || mobile.length==0)
                {
                    $.jBox.tip('请输入联系电话', 'warning');
                    return false;
                }
                if(mobile.length!=11)
                {
                    $.jBox.tip('请输入有效的联系电话', 'warning');
                    return false;
                }

                var myreg = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8]))\d{8}$/;
                //var myreg = /(^(\d{2,4}[-_－—]?)?\d{3,8}([-_－—]?\d{3,8})?([-_－—]?\d{1,7})?$)|(^0?1[35]\d{9}$)/;
                if(!myreg.test(mobile))
                {
                    $.jBox.tip('请输入有效的联系电话', 'warning');
                    return false;
                }

                return true;
            };

            $scope.submit = function() {
                
                if ($scope.orders.buyerid == undefined) {
                    $scope.orders.tradesourceflag = 3;
                    $scope.orders.buyerid = 0;
                    $scope.orders.buyname = "匿名客户";
                }
                if ($scope.orders.warehouseid == undefined) {
                    $.jBox.tip('请选择订单出货仓库', 'warning');
                    return ;
                }
                if(!$scope.validatemobile($scope.orders.buyerphone))
                    return;

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
                
                if((parseInt($scope.orders.settlementtypeid)==2||parseInt($scope.orders.settlementtypeid)==10) && isNaN($scope.orders.goodsdeposit)){
                	$.jBox.tip('定金输入金额只能为数字', 'warning');
                	return;
                }
                
                if((parseInt($scope.orders.settlementtypeid)==2||parseInt($scope.orders.settlementtypeid)==10) && $scope.orders.goodsdeposit>$scope.orders.totgoodsmoney){
                	$.jBox.tip('定金不能大于货物总金额', 'warning');
                	return;
                }

                var data = {data: angular.toJson($scope.orders)};
                $http({
                    method : 'POST',
                    url : '/jsbweb/enterprise/billing/addsalesorder.do',
                    data : $.param(data),
                    headers : {
                        'Content-Type' : 'application/x-www-form-urlencoded'
                    }
                }).success(function(data){
                    
                    if (data.ret == 0) {
                        $.jBox.tip('售货开单成功', 'success');
                        setTimeout("location.reload()",3000);
                    } else {
                        $.jBox.tip('售货开单失败：' + data.message, 'warning');
                    }

                }).error(function(){
                    console.log("err");
                    $.jBox.tip('售货开单失败:' + err, 'warning');
                });
            };
    		//获取打印模板信息
    		$http.get("/jsbweb/printTemplate/getTemp.do?temptype=309").success(function(data){
    			if(data!=null&&data.data!=null&&data.data.rows!=null){
    				$scope.templates=data.data.rows;
    				angular.forEach($scope.templates,function(item,index){
    					if(index==0){
    						$scope.printTemplate=item;
    					}
    				});
    			}
    		});
    		
    		//套打打印
    		$scope.ordersPrintData = {};
    		$scope.createPrint=function(template){
    			if ($scope.orders.buyerid == undefined) {
                    $scope.orders.tradesourceflag = 3;
                    $scope.orders.buyerid = 0;
                    $scope.orders.staffname = "匿名客户";
                }
                if ($scope.orders.warehouseid == undefined) {
                    $.jBox.tip('请选择订单出货仓库', 'warning');
                    return ;
                }
                if(!$scope.validatemobile($scope.orders.buyerphone))
                    return;

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
                
    			$scope.printTemplate=template;
    			
    			$scope.ordersPrintData.staffname = $scope.orders.staffname;
    			$scope.ordersPrintData.buyername = $scope.orders.buyername;
    			angular.forEach($scope.baseData.provinces,function(data,index,array){
    				if($scope.orders.buyerprovinceid == data.provinceid){
    					$scope.ordersPrintData.buyerprovincename = data.provincename;
    				}
    			});
    			angular.forEach($scope.baseData.citys,function(data,index,array){
    				if($scope.orders.buyercityid == data.cityid){
    					$scope.ordersPrintData.buyercityname = data.cityname;
    				}
    			});
    			angular.forEach($scope.baseData.areas,function(data,index,array){
    				if($scope.orders.buyerareaid == data.areaid){
    					$scope.ordersPrintData.buyerareaname = data.areaname;
    				}
    			});
    			$scope.ordersPrintData.buyeraddress = $scope.orders.buyeraddress;
    			$scope.ordersPrintData.buyerphone = $scope.orders.buyerphone;
    			$scope.ordersPrintData.totgoodsmoney = $scope.orders.totgoodsmoney;
    			$scope.ordersPrintData.goodsdeposit = $scope.orders.goodsdeposit;
    			$scope.ordersPrintData.totgoodsqty = $scope.orders.totgoodsqty;
    			$scope.ordersPrintData.createdtime = $scope.orders.createdtime;
    			$scope.ordersPrintData.warehousename = $scope.orders.warehousename;
				$scope.ordersPrintData.ordernum = $scope.orders.ordernum;
			    $scope.ordersPrintData.remark = $scope.orders.remark;
		        $scope.ordersPrintData.suppliername = $scope.orders.suppliername;
	        	$scope.ordersPrintData.createdbyname = $scope.orders.createdbyname;
            	
    			$scope.ordersPrintData.list = [];
    			$scope.ordersPrintData.list.push($scope.orders.orderlist);
    			
    			if(angular.isUndefined($scope.printTemplate)) return;
    			console.info($scope.orders);
    			var dow=new printDoc();
    			dow.viewModel($scope.printTemplate,$scope.ordersPrintData);
    			
    		};
    	    //div打印
    		$scope.printHtml = function(){
    			//获取登录信息
                $http({
                    method : 'GET',
                    url : '/jsbweb/base/getSession.do'
                }).success(function(data){
                	
                    if (data.ret == 0) {
                    	$scope.orders.suppliername = data.companyname;
                    	$scope.orders.createdbyname = data.loginname;
                    	$scope.orders.stationname = data.stationname;
                    	//查询商家信息
                    	$http({
                            method : 'GET',
                            url : '/jsbweb/enterprise/commodity/merchant.do?companyId='+data.companyid
                        }).success(function(data){
                        	$scope.orders.supplyCompanyProvincename = data.data.rows[0].provincename;
                        	$scope.orders.supplyCompanyCityname = data.data.rows[0].cityname;
                        	$scope.orders.supplyCompanyAreaname = data.data.rows[0].areaname;
                        	$scope.orders.supplyCompanyAddress = data.data.rows[0].address;
                        	$scope.orders.supplyCompanyPhone = data.data.rows[0].phone;
                        });
                    } else {
                        $.jBox.tip('请先登录', 'warning');
                    }
                });
    			if ($scope.orders.buyerid == undefined) {
                    $scope.orders.tradesourceflag = 3;
                    $scope.orders.buyerid = 0;
                    $scope.orders.staffname = "匿名客户";
                }
                if ($scope.orders.warehouseid == undefined) {
                    $.jBox.tip('请选择订单出货仓库', 'warning');
                    return ;
                }
                if(!$scope.validatemobile($scope.orders.buyerphone))
                    return;

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
    			
    			$scope.ordersPrintData.staffname = $scope.orders.staffname;
    			$scope.ordersPrintData.buyername = $scope.orders.buyername;
    			angular.forEach($scope.baseData.provinces,function(data,index,array){
    				if($scope.orders.buyerprovinceid == data.provinceid){
    					$scope.ordersPrintData.buyerprovincename = data.provincename;
    				}
    			});
    			angular.forEach($scope.baseData.citys,function(data,index,array){
    				if($scope.orders.buyercityid == data.cityid){
    					$scope.ordersPrintData.buyercityname = data.cityname;
    				}
    			});
    			angular.forEach($scope.baseData.areas,function(data,index,array){
    				if($scope.orders.buyerareaid == data.areaid){
    					$scope.ordersPrintData.buyerareaname = data.areaname;
    				}
    			});
    		    angular.forEach($scope.orders.deliverytype,function(data,index,array){
    		    	if($scope.orders.deliveryflag == data.id){
    		    		$scope.ordersPrintData.deliveryName = data.name;
    		    	}
    		    });
    		    
    			$scope.ordersPrintData.buyeraddress = $scope.orders.buyeraddress;
    			$scope.ordersPrintData.buyerphone = $scope.orders.buyerphone;
    			$scope.ordersPrintData.totgoodsmoney = $scope.orders.totgoodsmoney;
    			$scope.ordersPrintData.goodsdeposit = $scope.orders.goodsdeposit;
    			$scope.ordersPrintData.totgoodsqty = $scope.orders.totgoodsqty;
    			$scope.ordersPrintData.createdtime = $scope.orders.createdtime;
    			$scope.ordersPrintData.warehousename = $scope.orders.warehousename;
				$scope.ordersPrintData.ordernum = $scope.orders.ordernum;
			    $scope.ordersPrintData.remark = $scope.orders.remark;
		        $scope.ordersPrintData.suppliername = $scope.orders.suppliername;
		        $scope.ordersPrintData.stationname = $scope.orders.stationname;
	        	$scope.ordersPrintData.createdbyname = $scope.orders.createdbyname;
	        	
	        	$scope.ordersPrintData.supplyCompanyProvincename = $scope.orders.supplyCompanyProvincename;
	        	$scope.ordersPrintData.supplyCompanyCityname = $scope.orders.supplyCompanyCityname;
	        	$scope.ordersPrintData.supplyCompanyAreaname = $scope.orders.supplyCompanyAreaname;
	        	$scope.ordersPrintData.supplyCompanyAddress = $scope.orders.supplyCompanyAddress;
	        	$scope.ordersPrintData.supplyCompanyPhone = $scope.orders.supplyCompanyPhone;
	        	$scope.ordersPrintData.ordernum = $scope.orders.ordernum;

    			$scope.ordersPrintData.list = [];
    			$scope.ordersPrintData.list.push($scope.orders.orderlist);
    			console.info($scope.orders);
    			$rootScope.divOrdersPrintData = $scope.ordersPrintData;
    			$("#modal-container-print").modal("show");
    		};
        	$rootScope.myPreview = function(){	
    	   		var LODOP = getLodop();  	
    	   		var strBodyStyle="<style>"+document.getElementById("style1").innerHTML+"</style>";
    	   		var strFormHtml=strBodyStyle+"<body>"+document.getElementById("form1").innerHTML+"</body>";
    	   		LODOP.ADD_PRINT_HTM(0,0,"100%","100%",strFormHtml);
    	   		LODOP.PREVIEW();
    	   	};
    }])
    entOrdersModule.controller("ordersAddSalesOrderOrdersController",
    ['$scope','$http',"$stateParams","$state","$window","$timeout","ordersService",
        function($scope, $http,$stateParams,$state,$window,$timeout, ordersService) {
            //1收据，2普通发票，3增值税票，
            $scope.invoiceType = [
                //{id:0, name:"(空)"},
                {id:1, name:"收据"},
                {id:2, name:"普通发票"},
                {id:3, name:"增值税发票"}
            ];
            //结算方式
            $scope.settlementtype = [
                {id : 1,name : "现付"},
                {id : 2,name : "到付"},
                //{id : 4,name : "分期付"},
                {id : 10,name : "物流代收"}
            ];
            //支付方式
            $scope.paymenttype = [
                { id : 1, name : "现金" },
                { id : 2, name : "刷卡" },
                { id : 11,name : "二维码" }
            ];
            //送货方式
            $scope.deliverytype = [
                { id : 1, name : "送货上门" },
                { id : 2, name : "仓库自提" },
                { id : 3, name : "现场交货" }
            ];
            $scope.orders.deliverytype = $scope.deliverytype; 
            $scope.contacts = [];
            $scope.selectedAcontact = {};
            $scope.contactFormData={};
            $scope.contactFormData.contactkeyword = "";
            $scope.getContact = function(){
                ordersService.getContact($scope.contactFormData,function(data, flag){
                    
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
                        $scope.contactData=data;
                    }
                    else{//失败

                    }
                });
            };
            
            $scope.baseData.getContact = $scope.getContact;
            
            $scope.storehouseKeyword = "";
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

            $scope.init = function(){
                $scope.orders.settlementtypeid = 1;//默认现付
                $scope.orders.deliveryflag = 1;//送货上门
                $scope.getContact();
                $scope.queryStorehouse();
            }

            $scope.init()

            $scope.$watch("orders.settlementtypeid",function(newVal){
            	if(newVal==1){
            		$scope.orders.goodsdeposit=0;
            	}
                if (newVal == 2 || newVal == 10){//到付或物流送货时没有月结
                    //送货方式
                    $scope.deliverytype = [
                        { id : 1, name : "送货上门" },
                        { id : 2, name : "仓库自提" }
                    ];
                    $scope.orders.deliveryflag = 1;
                }else{
                    //送货方式
                    $scope.deliverytype = [
                        { id : 1, name : "送货上门" },
                        { id : 2, name : "仓库自提" },
                        { id : 3, name : "现场交货" }
                    ];
                    $scope.orders.deliveryflag = 1;
                }
            });

            //检测发货人改变时触发
            $scope.$watch("selectedAcontact",function(newVal){
                if(angular.isUndefined(newVal)) 
                	return;
                
                $scope.orders.tradesourceflag = newVal.platformuser;
                $scope.orders.buyerid = newVal.staffid;
                $scope.orders.buyername = newVal.companyname;
                $scope.orders.buyerphone = newVal.mobilephone;
                $scope.orders.buyeraddress = newVal.address;
                
                $scope.orders.staffname = newVal.staffname;
                /*$scope.orders.provincename = newVal.provincename;
                $scope.orders.cityname = newVal.cityname;
                $scope.orders.areaname = newVal.areaname;*/
                
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

            //检测仓库改变时触发
            $scope.$watch("warehouse",function(newVal){
                if(angular.isUndefined(newVal)) return;
                $scope.orders.warehouseid = newVal.stationid;
                $scope.orders.warehousename = newVal.stationname;
            });

            $scope.onChangeProvince = function(provinceid){
            	$scope.getCity(provinceid);
                $scope.orders.buyercityid='';
                $scope.orders.buyerareaid = '';
            }
            $scope.onChangeCity = function(cityid){
            	$scope.getArea(cityid);
                $scope.orders.buyerareaid = '';
            }
        }
    ]);
entOrdersModule.controller("ordersAddSalesOrderOrderListController",
    ['$scope','$http',"$stateParams","$state","$window","$timeout",
        function($scope, $http,$stateParams,$state,$window,$timeout) {
            $scope.goodsskus={};

            $scope.init = function(){
                $scope.addNewRow();
                $scope.addNewRow();
                $scope.addNewRow();
            }

            $scope.delrecord = function(index){
                $scope.orders.orderlist.splice(index, 1);
            };

            $scope.addNewRow = function(){
                var row = {};
                row.goodsid = -1;
                row.goodsName = "";
                row.goodsspec = "";
                row.goodsqty = 1;
                row.goodsmoney = 0;
                row.goodsbarcode = "";
                row.goodsunitprice = 0;
                row.dealingprice = 0;
                row.skuid = "0";
//                row.discount = 100;
                $scope.orders.orderlist.push(row);
                row.selected = "";
                row.giftflag = 1;
                row.isgiftflag = false;
                $scope.$watch(function() {
                    return row.selected;
                }, function(newVal, oldVal) {
                    row.goodsname = newVal.goodsname;
                    row.goodsid = newVal.goodsid;
                    row.goodsunitprice = newVal.shopprice;
                    row.dealingprice = newVal.shopprice;
                    row.goodssn = newVal.goodssn;
                    row.goodsbarcode = newVal.barcode;
                    row.skuid = newVal.skuid;
                    row.skuname = newVal.skuname;
                    row.weight = newVal.weight;
                    row.virtualflag = newVal.virtualflag;
                    row.goodsunitname = newVal.goodsunitname;
                    
                    var goodsspec = "";

                    if (newVal.properties == undefined) {
                        goodsspec = newVal.goodsspec;
                    } else {
                        var goodsspec_array = eval(newVal.properties);

                        angular.forEach(goodsspec_array, function (data, index, array) {
                            if (goodsspec == "")
                                goodsspec += data.attribproperties;
                            else
                                goodsspec += "," + data.attribproperties;
                        });
                    }
                    row.goodsspec = goodsspec;
                    row.goodsmoney = newVal.price;
                });
                $scope.$watch(function() {
                    return row.goodsqty;
                }, function(newVal, oldVal) {
                	var reg = /^(?:[1-9]\d*|0)$/;
                	if(!reg.test(newVal)){
                		newVal = oldVal;
                		row.goodsqty = oldVal;
                	}
                    row.goodsmoney = (newVal *  row.dealingprice);
                })
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
                $scope.$watch(function(){
                    return row.isgiftflag;
                }, function(newVal, oldVal){
                    if(newVal){
                        row.giftflag = 2;
                        row.goodsmoney = 0;
                        row.dealingprice = 0;
                    }
                    else{
                        row.giftflag = 1;
                        row.dealingprice = row.goodsunitprice;
                        row.goodsmoney = (row.goodsqty *  row.dealingprice).toFixed(2);
                    }
                })

            }

            $scope.sumGoodsQty = function(){
                var totgoodsqty = 0;
                angular.forEach($scope.orders.orderlist, function(data,index,array){
                    if(data.goodsid != undefined && !isNaN(data.goodsqty) && !isNaN(data.dealingprice))
                        totgoodsqty += data.goodsqty;
                });
                $scope.orders.totgoodsqty = totgoodsqty;
                return totgoodsqty;
            };
            $scope.sumGoodsMoney = function(){
                var totgoodsmoney = 0;
                angular.forEach($scope.orders.orderlist, function(data,index,array){
                    if(data.goodsid != undefined && !isNaN(data.goodsqty) && !isNaN(data.dealingprice))
                        totgoodsmoney += data.goodsqty * data.dealingprice;
                });
                $scope.orders.totgoodsmoney = totgoodsmoney;
                return totgoodsmoney;
            };

            $scope.querygoodssku=function(item){

            	var param = {
        			pagenum:item.pagenum,
        			pagesize:item.pagesize,
                    barcode:item.goodsname,
                	goodsspec:item.goodsname,
                	goodsname:item.goodsname
            	};
            	
                $http({
                    method : 'POST',
                    url : "/jsbweb/enterprise/goods/getgoods_by_classify.do",
                    data : $.param(param),
                    headers : {
                        'Content-Type' : 'application/x-www-form-urlencoded'
                    }
                }).success(function(data) {
                    if(data.ret==0){
                        $scope.goodsskus = data;
                    }
                    if(data.ret==10){
                        $.jBox.tip("请先登录", 'warning');
                    }
                });
            };

            $scope.init();
        }
    ])
    entOrdersModule.controller("OrderAddContactController",
    ['$scope','$http',"$stateParams","$state","$window","$timeout",
        function($scope, $http,$stateParams,$state,$window,$timeout) {
//            $scope.scenetype = [
//                {id:3, name:"客户"},
//                {id:4, name:"渠道商"}
//            ];

            $scope.initAddContact = function(){
                $scope.addConactData = {
                    scenetypeid:3,
                    provinceid:0,
                    cityid:0,
                    areaid:0
                };
                
                $scope.getAddressGroup ();
            };

            $scope.getAddressGroup = function(){
            	$http({
                    method : 'GET',
                    url : "/jsbweb/base/contractorinfo/getAddressGroup.do?scenetypeid=3"
                }).success(function(data) {
                    if(data.data!=null){
                    	$scope.scenetype = data.data.rows;
                    }
                });
            }
            
            $scope.onSelectProvince = function(province){
                province = $.parseJSON(province);
                $scope.addConactData.provinceid = province.provinceid;
                $scope.addConactData.provincename = province.provincename;
                $scope.addConactData.cityname = "";
                $scope.addConactData.cityid = 0;
                $scope.addConactData.city = "";
                $scope.addConactData.area = "";
                $scope.addConactData.areaid = 0;
                $scope.addConactData.areaname = "";

                $scope.getCity(province.provinceid);
            }
            $scope.onSelectCity = function(city){
                city = $.parseJSON(city);

                $scope.addConactData.cityid = city.cityid;
                $scope.addConactData.cityname = city.cityname;

                $scope.addConactData.area = "";
                $scope.addConactData.areaid = 0;
                $scope.addConactData.areaname = "";

                $scope.getArea(city.cityid);
            }
            $scope.onSelectArea = function(area){
                area = $.parseJSON(area);

                $scope.addConactData.areaid = area.areaid;
                $scope.addConactData.areaname = area.areaname;
            }


            $scope.initAddContact();
            
            $scope.addConact = function(){
                //$scope.addConactData.address += "" + $scope.addConactData.addressExtra == undefined? "" : "-" + $scope.addConactData.addressExtra;

                if($scope.addConactData.companyname == undefined || $scope.addConactData.companyname == ""){
                    $.jBox.tip('客户公司名称不能为空', 'warning');
                    return;
                }
                if($scope.addConactData.contactname == undefined || $scope.addConactData.contactname == ""){
                    $.jBox.tip('联系人名称不能为空', 'warning');
                    return;
                }

                if(!$scope.validatemobile($scope.addConactData.mobilephone))
                    return;

                if($scope.addConactData.address == undefined || $scope.addConactData.address == ""){
                    $.jBox.tip('客户联系地址不能为空', 'warning');
                    return;
                }

                var data = {data: angular.toJson( $scope.addConactData)};
                $http({
                    method : 'POST',
                    url : '/jsbweb/base/contractorinfo/add.do',
                    data : $.param(data),
                    headers : {
                        'Content-Type' : 'application/x-www-form-urlencoded'
                    }
                }).success(function(data){
                    if (data.ret == 0) {
                        $.jBox.tip('客户添加成功', 'success');
                        $("#modal-container-184101").modal("hide");
                        $scope.addConactData = {
                                scenetypeid:3,
                                provinceid:0,
                                cityid:0,
                                areaid:0
                            };
                        $scope.baseData.getContact();
                    } else {
                        $.jBox.tip('客户添加失败', 'warning');
                    }
                }).error(function(rep){
                    console.log(rep)
                    $.jBox.tip('客户添加失败', 'warning');
                });
            }
        }
    ]);
entOrdersModule.controller("OrderAddAddressGroupController",
    ['$scope','$http',"$stateParams","$state","$window","$timeout",
        function($scope, $http,$stateParams,$state,$window,$timeout) {
    	
//    	$scope.a
    	$scope.getAddressGroup = function(){
//        	$http({
//                method : 'GET',
//                url : "/jsbweb/base/contractorinfo/getAddressGroup.do?scenetypeid=3"
//            }).success(function(data) {
//                console.log(data)
//                if(data.data!=null){
//                	$scope.scenetype = data.data.rows;
//                }
//            });
        }
    	
    	
    	
    
    
    }])
    /*entOrdersModule.controller("printHtmlController",['$scope','$rootScope','$http',"$stateParams","$state","$window","$timeout",
            function($scope, $rootScope, $http,$stateParams,$state,$window,$timeout) {
    	$scope.divOrdersPrintData = $rootScope.divOrdersPrintData;
    	console.info($rootScope.divOrdersPrintData);

    	$scope.myPreview = function(){	
	   		var LODOP = getLodop();  	
	   		var strBodyStyle="<style>"+document.getElementById("style1").innerHTML+"</style>";
	   		var strFormHtml=strBodyStyle+"<body>"+document.getElementById("form1").innerHTML+"</body>";
	   		LODOP.ADD_PRINT_HTM(0,0,"100%","100%",strFormHtml);
	   		LODOP.PREVIEW();
	   	};
    }])*/;


