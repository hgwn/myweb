var changewarehouseModule= angular.module('changewarehouse',[
    "util.pagination"
]);

changewarehouseModule.controller("changewarehouseController",
    ['$scope','$http','$stateParams','$state','$alert', "$window","$timeout",function($scope, $http,$stateParams,$state,$alert,$window,$timeout) {


        //定义表单数据对象
        $scope.formData={};
        $scope.formData.pagesize=10;
        $scope.changewarehouse={};
        
        $scope.addFormData={};
        $scope.addFormData.changetype = 1;  //移库类型默认值
        $scope.addFormData.state = 1;       //移库单状态默认值
        $scope.addFormData.auditflag =1;    //移库审核标志默认值
        $scope.addFormData.autoaduitflag = 1;  //自动审核默认值为否
        $scope.addFormData.changewarehouselist=[]; //定义移库单明细数组
        $scope.addFormData.isCommitted=false;  //表单提交标识，默认为否
        
        //定义移库单状态数组
        $scope.states = [
            {id : 1,value : "新建"},
            {id : 2,value : "审核通过"},
            {id : 3,value: "审核不通过"},
            {id : 4,value: "已出库"},
            {id : 5,value: "已入库"}
        ];
        
        
        //定义移库类库数组
        $scope.changetypes=[
            {id:1,value:"手工"},
            {id:2,value:"收货单"}
        ];
        
        //设置查询条件默认值为 '手工'
        $scope.formData.changetype = 1;
        
        //定义审核标志数组
        $scope.auditflags = [
            {id : 1,value : "待审核"},
            {id : 2,value : "审核" }
        ];
        
        $scope.formData.auditflag = 1;
        
        
        //加载数据源汇总
        $http
            .get("/jsbweb/enterprise/com/get_changewarehouse.do?pagesize=10&pagenum=1&changetype=1&auditflag=1&orders=createdtime&orderkey=desc")
            .success(function(data) {
                if(data.ret==1000){
                    $.jBox.tip("请先登录", 'warning');
                    return;
                }
                $scope.changewarehouses=data;
            });
        
        //加载实时库存信息
       $http.get("/jsbweb/enterprise/com/get_goodsstock.do?pagesize=10&pagenum=1")
        .success(function(data){
        	if(data.ret==100){
        		$.jBox.tip("请先登录", 'warning');
        		return;
        	}
        	$scope.goodsstockData=data;
        	console.log("实时库存信息...");
        	console.log($scope.goodsstockData);
        });
        
        $scope.queryFormData={};
        
        //查询添加移库
        $scope.changewarehouseAddQuery = function(item){
        	if(item.keyWord==null){
        		item.keyWord="";	
        	}
        	console.log("....1111");
        	 $http({
                 method : 'POST',
                 url :"/jsbweb/enterprise/com/get_goodsstock.do",
                 data : "pagesize=10&pagenum=1&goodsname="+item.keyWord,
                 headers : {
                     'Content-Type' : 'application/x-www-form-urlencoded'
                 }
             }).success(function(data) {
                 $scope.goodsstockData=data;
                 console.log("....1111222");
                console.log($scope.goodsstockData)
             }).error(function(){
 				console.log("error.....");
 			});
        }
        
        //新增一行移库单数据
        $scope.addrecord=function(){
            var temp={};
            temp.goodsid=0; //默认值
            temp.goodsname="";
            temp.goodssn="";
            temp.barcode="";
            temp.skuid="";
            temp.weight="";
            temp.goodsunitprice=0.00;
            temp.purchaseprice =0.00;
            temp.goodsqty=1;
            temp.goodssoundqty=1;
            temp.goodsdamageqty=0;
            temp.virtualflag=1;
            $scope.addFormData.changewarehouselist.push(temp);
            temp.selected = "";
            
            $scope.$watch(function() {
                return temp.selected;
            }, function(newVal, oldVal) {
            	console.log(".newVal........");
            	console.log(newVal);
            	if(angular.isUndefined(newVal)||newVal==null) return;
            	temp.goodsid= newVal.goodsid;
                temp.goodsname = newVal.goodsname;
                temp.goodssn = newVal.goodssn;
                temp.barcode = newVal.barcode;
                temp.skuid = newVal.skuid;
                temp.weight = newVal.weight;
                temp.purchaseprice = newVal.purchaseprice;
                if(angular.isUndefined(newVal.goodsunitprice) || ""){
                	newVal.goodsunitprice = 0.00;
                }
                temp.goodsunitprice = newVal.goodsunitprice;
                temp.goodsqty = newVal.goodsqty;
                temp.goodssoundqty = newVal.goodssoundqty;
                temp.goodsdamageqty = newVal.goodsdamageqty;
                temp.virtualflag = newVal.virtualflag;
                
            });
        };
        
        //删除一行移库单数据
        $scope.delHouseAddRecord=function(index){
            $scope.addFormData.changewarehouselist.splice(index, 1);
        };
        
        //showaddmodal函数 生成移库单号
        $scope.showaddmodal=function(){
        	if($scope.addFormData.changewarehousenum==undefined||$scope.addFormData.changewarehousenum ==""){
        		 var today = new Date();
                 var year = today.getFullYear();
                 var month = (today.getMonth()  + 1) < 10  ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
                 var day      = (today.getDate())  < 10 ? '0' + (today.getDate()) : (today.getDate());
                 var hours    = (today.getHours()) < 10 ? '0' + (today.getHours()) : (today.getHours());
                 var minutes    = (today.getMinutes()) < 10 ? '0' + (today.getMinutes()) : (today.getMinutes());
                 var seconds  = (today.getSeconds()) < 10 ? '0' + (today.getSeconds()) : (today.getSeconds());
                 $scope.addFormData.changewarehousenum= "RK"+year +  month  + day +  hours +   minutes +  seconds;
        	}
        	$scope.addFormData.changewarehouselist=[];
        	$scope.addrecord();
        	//$scope.changewarehouseAddQuery();
           
        };
        
        //查询目标仓库
        $scope.searchTargetwarehouse = function(){
        	var data = {stationtypeid:3,selfflag:1};
        	$http({
        		method : 'POST',
        		url    : '/jsbweb/station/list.do',
        		data   : $.param(data),
        		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  
        	}).success(function(data){
        		console.log("查询目标仓库...");
        		console.log(data);
        		
        		$scope.targetwarehouselist = data.data.rows;
        		for(var i=0; i<$scope.targetwarehouselist.length; i++){
        			$scope.targetwarehouselist[i].targetwarehouseid = $scope.targetwarehouselist[i].stationid;
        			$scope.targetwarehouselist[i].targetwarehousename = $scope.targetwarehouselist[i].stationname;
        			delete $scope.targetwarehouselist[i].address;
        			
        		}
        		
        	}).error(function(resp){
        		console.log("error......");
        	})
        	
        }   
        $scope.searchTargetwarehouse();
        
       //提交移库单数据
        $scope.addFormDataSumbit=function(invalid){
        	$scope.addFormData.isCommitted=true;
        	if(invalid){
        		$.jBox.tip('请检查提交的数据是否正确!', 'warning');
        		return;
        	}
             for(var i=0;i<$scope.addFormData.changewarehouselist.length;i++){
            	 delete $scope.addFormData.changewarehouselist[i].selected;
            	 $scope.addFormData.changewarehouselist[i].goodsunitprice = $scope.addFormData.changewarehouselist[i].purchaseprice;
            	 //判断完好数量和损坏数量不能同时为0
            	 if($scope.addFormData.changewarehouselist[i].goodssoundqty==0&&$scope.addFormData.changewarehouselist[i].goodsdamageqty==0){
            		 $.jBox.tip('完好数量和损坏数量不能同时为0!','warning');
            		 return;
            	 }
             }
            
            $scope.addFormData.targetwarehouseid = parseInt($scope.addFormData.targetwarehouseid);
            $scope.addFormData.targetpstationid = $scope.addFormData.targetwarehouseid;
            
        	var data = {data:JSON.stringify($scope.addFormData)};
        	console.log("提交移库单数据.....");
        	console.log(data);
        	$http({
        		method : 'POST',
        		url    : '/jsbweb/enterprise/com/add_changewarehouse.do',
        		data   : $.param(data),
        		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  
        	}).success(function(data){
        		console.log(data);
        		if(data.ret==0){
        			$.jBox.tip('移库单添加成功!', 'success');
        			$("#changewarehouse-container").modal("hide");
        			$scope.queryForm();
        		}else if(data.ret==10){
                    $.jBox.tip("请先登录", 'warning');
                }
        		else {
                    $.jBox.tip('添加失败，' + data.message, 'warning');
                }
        	}).error(function(resp){
        		console.log("error......");
        	})
        	
        }

        //条件查询
        $scope.queryForm=function(){

            $scope.formData.orders = 'createdtime';
            $scope.formData.orderkey = 'desc';
            var temp_endcreatedtime = $scope.formData.endcreatedtime;
            if($scope.formData.endcreatedtime){
            	 $scope.formData.endcreatedtime= $scope.formData.endcreatedtime+' 23:59:59';
            }
            console.log("查询条件.....");
            console.log( $scope.formData);
            $http({
                method : 'POST',
                url :"/jsbweb/enterprise/com/get_changewarehouse.do",
                data : $.param($scope.formData),
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
            }).success(function(data) {
                $scope.changewarehouses=data;
                console.log($scope.changewarehouses)
            }).error(function(){
				console.log("error.....");
			});
            
            $scope.formData.endcreatedtime = temp_endcreatedtime;
            
        };

        //审核移库单
        $scope.changewarehouseAudit=function(changewarehouse){
        	changewarehouseid = changewarehouse.changewarehouseid;
            var submit = function (v, h, f) {
                if (v == 'ok') {
                    $.jBox.tip("正在审核数据...", 'loading');
                    $http({
                        method : 'POST',
                        url : "/jsbweb/enterprise/com/audit_changewarehouse.do",
                        data:$.param({changewarehouseid:changewarehouseid,state:2,auditflag:2}),
                        headers : {
                            'Content-Type' : 'application/x-www-form-urlencoded'
                        }
                    }).success(function(data) {

                        if(data.ret==0){
                            $scope.queryForm();
                            $.jBox.tip('审核成功', 'success');
                        }
                        else {
                            $.jBox.tip('审核失败' + data.message, 'warning');
                        }

                        if(data.ret==10){
                            $.jBox.tip("请先登录", 'warning');
                        }
                    });
                }
                return true; //close
            };

            $.jBox.confirm("确定要审核移库单号："+changewarehouse.changewarehousenum+" 的数据 吗？", "温馨提示", submit);
        };

        //根据移库单Id查看 移库明细单 一对多关系
        $scope.changewarehouseView=function(changewarehouseid){
            $http
            .get("/jsbweb/enterprise/com/get_changewarehouselist.do?pagesize=10&pagenum=1"+"&changewarehouseid="+changewarehouseid)
            .success(function(data) {
                if(data.ret==1000){
                    $.jBox.tip("请先登录", 'warning');
                    return;
                }
                
                if(data.ret==0){
                	$scope.changewarehouselists=data;
                } 
                	console.log($scope.changewarehouselists);
            });

        };

        //根据移库单id changewarehouseid 删除移库单
        $scope.changewarehouseDelete=function(changewarehouse){
        	changewarehouseid = changewarehouse.changewarehouseid;
        	console.log("移库单id："+changewarehouseid);
        	var submit = function (v, h, f) {
                if (v == 'ok') {
                    $.jBox.tip("正在删除数据...", 'loading');
                    $http({
                        method : 'POST',
                        url : "/jsbweb/enterprise/com/del_changewarehouse.do",
                        data:$.param({changewarehouseid:changewarehouseid}),
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
            $.jBox.confirm("确定要删除移库单号："+changewarehouse.changewarehousenum+" 的数据 吗？", "温馨提示", submit);
        };

        $scope.changewarehouseSubmit=function(){

        };
        
        //converToName 函数
        $scope.converToName = function(flag,arryName){
        	var name ="";
        	for(var i=0;i<arryName.length; i++){
        		if(arryName[i].id == flag){
        			name = arryName[i].value;
        		}
        	}
        	return name;
        };
        
        /*//日期控件
        $scope.queryload = function () {
            $("#begincreatedtime,#endcreatedtime").datetimepicker({
                language: 'zh-CN',
                autoclose: true,
                todayBtn: true,
                pickerPosition: "bottom-left",
                todayHighlight: true,
                startView: 2,
                minView: 2,
                format:'yyyy-mm-dd'
            });
        };*/
    	
    }
    ]);


