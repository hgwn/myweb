/*======================================
 * 公司数据页面控制器 companyinfoCtr
 * =======================================
 * */
operationsModule.controller("companyinfoCtr",['$scope','$http','$state','$rootScope','operationsmanagerService','i18nService','$modal','Upload',function($scope,$http,$state,$rootScope,operationsmanagerService,i18nService,$modal,Upload){
	//定义查询表单对象
	$scope.queryDataForm={pagenum:1,pagesize:10};
	//定义提交表单对象
	$scope.formData={};
	//定义表单验证标志
	$scope.formFlag=false;
	//ui-grid 分页汉化
	i18nService.setCurrentLang('zh-cn');
	//设置gridOptions表格参数
	$scope.gridOptions={
		paginationPageSizes: [10, 20, 50, 100],
		paginationPageSize: 10,
		useExternalPagination: true,
		useExternalSorting: true,
		enableSorting : true,
		enableColumnMenus: false,
		enableGridMenu: true,
		columnDefs:[
			{ name:'序号',field:'id',type:'text',enableHiding: false,  enableSorting: false, enableColumnResizing:false,  width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
			{ name: 'action',displayName: '操作',width:80,enableSorting: false,enableHiding: false,enableColumnResizing:false,type:'text',
				cellTemplate: '<div class="ui-grid-cell-contents">' +
				'<a class="tunnel-grid-action" ng-click="grid.appScope.comompanyinfoModal(false,row.entity)" title="编辑"><span class=" glyphicon glyphicon-pencil green"></span></a>' +
				'</div>'},
			{ name: '公司名称',field:'companyname',width:'200',type:'text'},
			{ name: '公司类型',field:'companytypename',width:'150',type:'text'},
			{ name: '传真号码',field:'faxnumber',type:'text',width:'100'},
			{ name: '电话号码',field:'phone',type:'text',width:'120'},
			{name:'公司地址',field:'alladdpress',width:'300',type:'text'},
			{ name: '公司介绍',field:'introduction',type:'text'}

		]
	};
	//ui-grid表格操作
	$scope.gridOptions.onRegisterApi=function(gridApi){
		$scope.gridApi = gridApi;
		console.log("onRegisterApi00...");
		console.log($scope.gridApi);
		//分页
		$scope.gridApi.pagination.on.paginationChanged($scope,function(newPage, pageSize){
			//console.log($scope);
			//console.log(newPage+":"+pageSize);
			//调用分页函数
			$scope.getpage(newPage,pageSize);
		});
	};

	//分页函数
	$scope.getpage=function(pagenum,pagesize){
		$scope.queryDataForm.pagenum = pagenum;
		$scope.queryDataForm.pagesize = pagesize;
		//调用查询函数
		$scope.querycompanyinfo();
	}
	//查询公司数据
	$scope.querycompanyinfo=function(){
		//监听省市县/区 id，然后赋值
		$scope.$watch("queryDataForm.addressids",function(newValue,oldValue){
			console.log(newValue+":"+oldValue);
			//如果addressids有值
			if(newValue!=undefined&&newValue!=""){
				var addressArr = newValue.split("&");  //将字符串分割成数组
				//数组只有一个元素--选中省
				if(addressArr.length==1){
					//将省id进行赋值
					$scope.queryDataForm.provinceid=addressArr[0];
					//删除市id
					delete $scope.queryDataForm.cityid;
					//删除县/区id
					delete $scope.queryDataForm.areaid;
				}
				//数组有两个元素--选中省市
				else if(addressArr.length==2){
					//将省市id赋值，删除县/区id
					$scope.queryDataForm.provinceid=addressArr[0];
					$scope.queryDataForm.cityid=addressArr[1];
					delete $scope.queryDataForm.areaid;
				}
				//省市县/区都选中
				else{
					$scope.queryDataForm.provinceid=addressArr[0];
					$scope.queryDataForm.cityid=addressArr[1];
					$scope.queryDataForm.areaid=addressArr[2];
				}
			}
			//省市县/区都没选中，则删除省市县/区id
			else{
				delete $scope.queryDataForm.provinceid;
				delete $scope.queryDataForm.cityid;
				delete $scope.queryDataForm.areaid;
			}
		});
        var companytypeid  = $scope.queryDataForm.companytypeid;
        $scope.queryDataForm.companytypeid = [1,2002,10];
        /*if(companytypeid){
            $scope.queryDataForm.companytypeid.push(companytypeid);
        }*/
        console.log("查询公司数据$scope.queryDataForm....");
		console.log($scope.queryDataForm);
		$http({
			method : 'POST',
			url : '/masgetweb/rboperationsmanager/com/companyinfo_query.do',
			data : $.param($scope.queryDataForm),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data){
			console.log(data);
			if(data.ret==0){
				//循环数组，拼接省+市+县/区+地址
				for(var i=0; i<data.data.length; i++){
					data.data[i].alladdpress="";
					if(data.data[i].provincename!=null){
						data.data[i].alladdpress=data.data[i].provincename;
						data.data[i].pca=data.data[i].provincename;
					}
					if(data.data[i].cityname!=null){
						data.data[i].alladdpress+=data.data[i].cityname;
						data.data[i].pca=data.data[i].pca+" "+data.data[i].cityname;
					}
					if(data.data[i].areaname!=null){
						data.data[i].alladdpress+=data.data[i].areaname;
						data.data[i].pca=data.data[i].pca+" "+data.data[i].areaname;
					}
					if(data.data[i].address!=null){
						data.data[i].alladdpress+=data.data[i].address;
					}
				}
				$scope.gridOptions.data=data.data;
				$scope.gridOptions.totalItems = data.total;
			}
		}).error(function(data){
			console.log("error...");
		});
	};

	//获取公司类型---无条件获取
	$http.get("/masgetweb/rboperationsmanager/base/companytype_get.do")
		.success(function(data){
			if(data.ret==0){
				$scope.companytypeData=data.data.rows;
			}
		});
	//动态加载模块---包括添加和编辑操作
	$scope.comompanyinfoModal=function(type,item){
		if(type=="add"){
			$scope.formData={};    //清空之前数据绑定
			$scope.formFlag=false; //设置表单提交验证标志默认值
			$scope.file = false;   //设置 图标删除按钮不显示
			var modalTitle ="添加公司数据";
		}else{
			var modalTitle ="编辑公司数据";
			$scope.formData=angular.copy(item);  //将当前选择的数据进行深度赋值
			if($scope.formData.icon){
				$scope.file = true;
			}
			console.log($scope.formData);
		}
		$modal({html:true,scope:$scope,title:modalTitle,template:'tpls/companyinfo/companyInfo.modal.tpl.html',contentTemplate:'tpls/companyinfo/companyinfo.add.html',animation:'am-fade-and-scale',callback:function(a,b,c){
			var formInvalid = document.getElementById("companyinfoFormInvalid").value;
			var addressFlag = true;
			console.log(formInvalid);
			if(formInvalid=="true"){
				//$.jBox.tip('验证不通过!', 'warning');
				$scope.formFlag=true;
				return false;
			}
			//若对select地区选择框进行操作，判断省市县id是否有值
			if($scope.formData.addressids!=null&&$scope.formData.addressids!=undefined&&$scope.formData.addressids!=""){
				var addressArr = $scope.formData.addressids.split("&"); //分割成数组
				if(addressArr.length==1){
					addressFlag=false;
				}
				else{
					$scope.formData.provinceid=addressArr[0];
					$scope.formData.cityid=addressArr[1];
				}
				if(addressArr.length==3){
					$scope.formData.areaid=addressArr[2];
				}
				else{
					$scope.formData.areaid=0;//删除县/区
				}
			}
			if(addressFlag){
				if(modalTitle=="添加公司数据"){
					console.log("添加公司数据...");
					var url = '/masgetweb/rboperationsmanager/com/companyinfo_add.do';
				}
				else{
					console.log("提交编辑");
					var url = '/masgetweb/rboperationsmanager/com/companyinfo_modify.do';
				}
				var data={data:JSON.stringify($scope.formData)};
				console.log($scope.formData);
				$http({
					method : 'POST',
					url : url,
					data : $.param(data),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).success(function(data){
					console.log(data);
					if(data.ret==0){
						$.jBox.tip(data.message, 'warning');
						$scope.querycompanyinfo();
						return true;
					}
					else{
						$.jBox.tip(data.message, 'success');
						return false;
					}
				}).error(function(data){
					console.log("error...");
					$.jBox.tip("提交失败！", 'warning');
					return false;
				});
			}else{
				$.jBox.tip("省市不能为空！", 'warning');
				return false;
			}

			}
		});
	}

	//$scope.$watch('files', function () {
	//	$scope.upload($scope.files);
	//});

	//图标上传
	$scope.upload = function (files) {
		//console.log(files);
		if (files && files.length) {
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				Upload.upload({
					url: '/masgetweb/base/fileUpload.do',
					fields: {'username': $scope.username},
					file: file
				}).progress(function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
				}).success(function (data, status, headers, config) {
					console.log(data);
					$scope.formData.icon = data.data.file;  //将图片url赋值
					$scope.file = true;   //设置删除按钮 显示 ，默认隐藏
				}).error(function(){
					console.log("error");
				});
			}
		}
	};

	//删除图标
	$scope.deletePic=function(ojb){
		console.log(ojb);
		var icon = ojb.icon;
		var imgName = icon.split("/").pop();
		console.log(imgName);
		$scope.file = false;   //设置 图标删除按钮不显示
		$http({
			method : 'POST',
			url : '/masgetweb/base/fileDelete.do',
			data : $.param({fileName:imgName}),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data){
			console.log(data);
		}).error(function(data){
			console.log("error...");
		});
		ojb.icon="";//空字符 给后台删除数据表
	};

	//删除操作
	$scope.companyDel=function(){
		var resulte = $scope.gridApi.selection.getSelectedRows();//获取勾选的数据
		if(resulte.length<1){
			$.jBox.tip("请勾选要操作的数据！","warning");
			return;
		}
		var tempdata ={};
		tempdata.companyid = [];
		for(var i=0; i<resulte.length;i++){
			tempdata.companyid.push(resulte[i].companyid);
		}
		var data ={data:JSON.stringify(tempdata)};
		console.log(tempdata);
		$.jBox.confirm("已勾选："+resulte.length+"条数据<br/>"+"确定要删除吗？", "温馨提示", function(v, h, f){
			if (v == 'ok') {
				$.jBox.tip("正在删除数据...", 'loading');
				$http({
					method : 'POST',
					url : '/masgetweb/rboperationsmanager/com/companyinfo_delete.do',
					data : $.param(data),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).success(function(data){
					console.log(data);
					if(data.ret==0){
						$.jBox.tip('删除成功!', 'success');
						$scope.querycompanyinfo();
					}
				}).error(function(data){
					console.log("error..");
				});
			}
			return true; //close
		});

	};

	//初始化函数
	$scope.init=function(){
		//调用查询函数
		$scope.querycompanyinfo();
	}
	//调用初始化函数
	$scope.init();

}])
//指令监听图标上传
.directive('onFinishRenderFilters', function ($timeout, $state,$http) {
	return {
		restrict: 'A',
		link: function ($scope, element, attr) {
			$scope.$watch('files', function () {
				$scope.upload($scope.files);
			});
		}
	};
})



