angular.module('masgetWebApp.contacts')
.controller('contactsImportCtr',['$scope', '$state', '$timeout','$rootScope',  '$modal', '$alert','utils','Upload','$http','i18nService',
                           function ($scope, $state, $timeout,$rootScope, $modal, $alert,utils,Upload,$http,i18nService) {
	$rootScope.isShowList=false;
	//ui-grid 分页汉化
	i18nService.setCurrentLang('zh-cn');
	
	//导出
    $scope.Export = function () {
    	window.location.href="/jsbweb/base/contractorinfo/downloadfile.do";
    };

    //导入
    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var name = file.name;
                $scope.filename = name;
                var index = name.lastIndexOf(".");
	           	var ext = name.substring(index + 1, name.length);
	   
	           	if(ext !='xls'){
	           		$alert({title: '提示：', content: '请选择Excel文件(*.xls)！', placement: 'masget-top', duration: 2, type: 'info', show: true});
	           		return;
	           	}
               Upload.upload({
                    url: '/jsbweb/base/contractorinfo/import.do',
                    headers: {'Content-Type': file.type},
                    file: file
               }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
               }).success(function (data, status, headers, config) {
                	angular.forEach(data.data,function(item,key){
                		item.val = key;
                	});
				    $scope.gridOptions.data = data.data;
                	$('#goodsstockcheck-save').modal('hide');
                	$scope.filename = "";
                	$alert({title: '提示：', content: '导入成功', placement: 'masget-top', duration: 2, type: 'info', show: true});
			   });
	           	
            }
        }
    };

	$scope.gridOptions = {
	   //显示table的th
	   columnDefs: [
		   { name: '序号',field:'id', width:60,cellTemplate:
			   '<div class="ui-grid-cell-contents" style="text-align:center">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
		   },
		   {name:'导入结果', field:'result',width:200},
		   { name: '公司名称',field:'companyname' ,width:150},
		   { name: '公司简介',field:'profile',width:150},
		   { name: '联系人',field:'contactname',width:100},
		   { name: '联系电话',field:'mobilephone',width:100},
		   { name: '传真号',field:'faxnumber',width:100},
		   { name: '公司地址',field:'Alladress',width:150},
		   { name: '商户类型',field:'scenetypename',width:100},
		   { name: '分组类型',field:'saasgrouptypename',width:100},
		   { name: '分组名',field:'addressgroupname',width:100},
		   { name: '自定义1',field:'remark1',width:100},
		   { name: '自定义2',field:'remark2',width:100},
		   { name: '自定义3',field:'remark3',width:100}
	   ],
	   enableGridMenu: true,
	   enableColumnMenus: false,
		onRegisterApi: function(gridApi){
			$scope.gridApi = gridApi;
		}
	};
    
    //提交
    $scope.submit = function(){
    	$scope.iconFlag = 'add';
    	$scope.context = "正在提交中...";
    	var newArray = $scope.auData = angular.copy($scope.gridApi.selection.getSelectedRows());
    	var obj = {};
    	obj.contractors = newArray;
    	
    	var Data = {};
        Data.data = JSON.stringify(obj);
        if(newArray.length!=0){
        	$http({
        		method : 'POST',
        		url : "/jsbweb/base/contractorinfo/contactsImport.do",
        		data:$.param(Data),
        		headers : {
        			'Content-Type' : 'application/x-www-form-urlencoded'
        		}
        	}).success(function(resp) {
        		if(resp.ret == 0){
					$scope.gridOptions.data =resp.data.rows;
        			$scope.iconFlag = '';
        			$alert({title: '提示：', content: '提交成功', placement: 'masget-top', duration: 2, type: 'info', show: true});
        		}else{
        			$scope.iconFlag = '';
        			$alert({title: '提示：', content: '提交失败', placement: 'masget-top', duration: 2, type: 'info', show: true});
        		}
        	})
        }else{
        	$scope.iconFlag = '';
        	$alert({title: '提示：', content: '请勾选数据', placement: 'masget-top', duration: 2, type: 'info', show: true});
        }
    };
    
}]);