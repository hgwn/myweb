var changewarehouseModule= angular.module('goodsstockcheck',[
    "util.pagination","ngFileUpload","ngMessages"
]);

changewarehouseModule.controller('goodsstockcheckController',['$scope','$http','Upload','$state',function($scope,$http,Upload,$state){
	//定义数据对象
    $scope.addFormData={};
    $scope.addFormData.goodsstockchecklist = [];
    
    $scope.formData={};
    $scope.formData.pagesize = 10;
    $scope.formData.pagenum = 1;
    
    $scope.IngridOptions = {};
    $scope.OutgridOptions = {};
    //选项卡   
    //top.pushTab("百度","");
    //console.log(top.angular.module('masgetWebApp.home'));
    
    //$scope.goodsstockcheckForm = {};
    //$scope.goodsstockcheckForm.isCommitted = false;
    //新增一行移库单数据
    $scope.addrecord=function(){
        var temp={};
        temp.goodsid=0; //默认值
        temp.goodsname="";
        temp.skuid="";
        temp.weight="";
        temp.goodsqty=0;
        temp.damageqty=0;
        $scope.addFormData.goodsstockchecklist.push(temp);
    };
    
    //删除一行移库单数据
    $scope.delHouseAddRecord=function(index){
        $scope.addFormData.goodsstockchecklist.splice(index, 1);
    };
    
    //showaddmodal函数 生成移库单号
    $scope.showaddmodal=function(){
    	if($scope.addFormData.checkbatch ==""||$scope.addFormData.checkbatch==undefined){
    		 var today = new Date();
             var year = today.getFullYear();
             var month = (today.getMonth()  + 1) < 10  ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
             var day      = (today.getDate())  < 10 ? '0' + (today.getDate()) : (today.getDate());
             var hours    = (today.getHours()) < 10 ? '0' + (today.getHours()) : (today.getHours());
             var minutes    = (today.getMinutes()) < 10 ? '0' + (today.getMinutes()) : (today.getMinutes());
             var seconds  = (today.getSeconds()) < 10 ? '0' + (today.getSeconds()) : (today.getSeconds());
             $scope.addFormData.checkbatch= "PD"+year +  month  + day +  hours +   minutes +  seconds;
    	}
    	$scope.addFormData.goodsstockchecklist = [];
    	$scope.addrecord();
    };
        
    //goodsstockcheckAddQuery
    $scope.queryFormData={};
    $scope.goodsstockcheckAddQuery = function(){
    	
    	$http({
            method : 'POST',
            url :"/jsbweb/enterprise/com/getbycompany_goodssku.do",
            data : "goodsid="+$scope.queryFormData.keyWord,
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {
            $scope.goodsstockData=data;
           // console.log($scope.goodsstockData)
        }).error(function(){
			console.log("error.....");
		});
    }

    //查询仓库
    $scope.searchTargetwarehouse = function(){

        //var data = {data:JSON.stringify($scope.addFormData)};
        var data = {data:"{stationtypeid:3,selfflag:1}"};
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

    //查询实时库存信息
    $scope.isActive = true;
    $scope.queryForm = function(){
    	$scope.isActive = false;
        $http({
            method:'POST',
            url:'/jsbweb/enterprise/com/get_goodsstock.do',
            data: $.param($scope.formData),
            headers:{ 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data){
            if(data.ret==100){
                $.jBox.tip("请先登录", 'warning');
                return;
            }
            $scope.goodsstockData=data;
            console.log("实时库存信息...");
            console.log($scope.goodsstockData);
        }).error(function(resp){
            console.log("error...");
        });
    }

   // $scope.queryForm();
    
    
    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });
    $scope.upload = function (files) {
    	
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                console.log("...2..");
                console.log(file);
                var name = file.name;
                $scope.filename = name;
                var index = name.lastIndexOf(".");
	           	var ext = name.substring(index + 1, name.length);
	           	console.log(ext);
	           	if(ext !='xls'){
	           		$.jBox.tip("请选择Excel文件(*.xls)！", 'warning');
	           		return;
	           	}
                Upload.upload({
                    url: '/jsbweb/enterprise/com/import.do',
                    headers: {'Content-Type': file.type},
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                	console.warn(data);
                	
                	$scope.IngridOptions.data = data.surplusList;
                	$scope.OutgridOptions.data = data.lossList;
                	
                	console.warn($scope.IngridOptions.data);
                	console.warn($scope.OutgridOptions.data);
                	
                	$('#goodsstockcheck-save').modal('hide');
                	$('#dialog').dialog();
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                }).error(function(resp){
                	$.jBox.tip("导入的数据不正确，请检查！", 'warning');
                });
            }
        }
    };
    
    
    $scope.addSumbit = function(){
    	
    	//$scope.upload($scope.files);

    }
   
    
    //导出
    $scope.onBtnClickexportGoods = function(){
    	window.location.href="/jsbweb/enterprise/com/export.do";
    }
    
    //盘亏单
    $scope.goodsstockcheckout_action = function(){
    	top.pushTab("盘亏单","/jsbweb/enterprise/stock/goodsstock.html#/goodsstockcheckout");
    	top.transferDataOut = $scope.OutgridOptions.data;
    }
    //盘盈单
    $scope.goodsstockcheckin_action = function(){
    	top.pushTab("盘盈单","/jsbweb/enterprise/stock/goodsstock.html#/goodsstockcheckin");
    	top.transferDataIn = $scope.IngridOptions.data;
    }
      
}]);

