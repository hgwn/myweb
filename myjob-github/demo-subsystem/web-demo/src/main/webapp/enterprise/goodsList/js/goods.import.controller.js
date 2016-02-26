/**
 * 
 */
comGoodsListApp
    //商品导入总控制器
    .controller('GoodsImportGridController',
    		['$scope','$rootScope', '$http', '$timeout','i18nService','Upload',
    function($scope,$rootScope, $http, $timeout, i18nService, Upload) {
           
        $scope.baseData = {};
        $scope.baseData.companygoodsclassify = [];
        $scope.baseData.goodsunit = [];
	
        $scope.gridImportOptions = {};
        
		$scope.init = function(){
			//查询商品分类
            $http({
                method : 'GET',
                url : "/jsbweb/enterprise/goodsclassify/get.do"
            }).success(function(data) {
            	console.log(data)
            	if(data.ret == 0){
            		$scope.baseData.companygoodsclassify = data.data.rows;
            	}
                //查询计量单位
                $scope.getGoodsUnit($scope.initGridImportOptions);
            });
            //定义ui-grid表头
        };
        
        $scope.getGoodsUnit = function(callback){
            $http({
                method : 'GET',
                async:false,
                url : "/jsbweb/enterprise/goodsunit/get.do"
            }).success(function(data) {
                console.log(data)
                if(data.ret == 0){
                    $scope.baseData.goodsunit = data.data.rows;
                    if(callback != undefined){
                    	callback();
                    }
                }
            });
        };
//        $scope.initGridImportOptions = function(){
    	   $scope.gridImportOptions = {
	        	enableCellEditOnFocus:true,
	        	enableColumnMenus: false,
	        	enableRowSelection: true,
	            enableSelectAll: true,
	            selectionRowHeaderWidth: 35,
	            multiSelect:true,
	            enableRowHeaderSelection: true,
	        	columnDefs:
				[
	               { name:'操作',field:'action',enableCellEdit: false,
					    cellTemplate: '<div class="ui-grid-cell-contents" style="text-align: center">' +
					    '<a style="cursor:pointer; margin-left: 8px;" ng-click="grid.appScope.deleteImportGoods(row.entity, $Index)" title="删除"><span class="glyphicon glyphicon-trash"></span></a>' +
					    '</div>'},
	               { name: '商品编码',field:'goodssn'},
	               { name: '商品条码',field:'barcode'},
	               { name: '商品名称',field:'goodsname'},
	               { name: '规格',field:'goodsspec'},
	               /*{ name: '商品分类',field:'companygoodsclassifyname',editableCellTemplate: 'ui-grid/dropdownEditor',
	            	   editDropdownIdLabel: 'companygoodsclassifyname', editDropdownValueLabel: 'companygoodsclassifyname', 
	            	   editDropdownOptionsArray:$scope.baseData.companygoodsclassify
	               },*/
	               { name: '商品分类',field:'companygoodsclassifyname'},
	               
	               { name: '销售价',field:'shopprice'},
	              /* { name: '单位',field:'goodsunitname',editableCellTemplate: 'ui-grid/dropdownEditor',
	            	    editDropdownIdLabel: 'goodsunitname', editDropdownValueLabel: 'goodsunitname', 
	            	    editDropdownOptionsArray:$scope.baseData.goodsunit
	               },*/
	               { name: '单位',field:'goodsunitname'},
	               { name: '产地',field:'origin'},
	               { name: '重量',field:'weight'},
	               { name: '备注',field:'description'},
//	               { name: '状态',field:'message'}
	               { name: '状态',field:'message',enableCellEdit: false, width: '15%' ,cellTemplate:
	                   '<div class="ui-grid-cell-contents">{{grid.appScope.getState(row.entity.message)}}</div>'
	               }
	             ]
	        };   
    	  
	        $scope.gridImportOptions.onRegisterApi = function(gridApi){
	           $scope.gridApi = gridApi;
	           
	           gridApi.selection.on.rowSelectionChanged($scope,function(row){
	        	   
	           });
	           gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
	        	   /*var state = $scope.gridApi.selection.getSelectAllState();
        		   angular.forEach(rows, function(value, index){
        			  value.isSelected = state;
        		   });
	               var msg = 'rows changed ' + rows.length;*/
	           });
	              
			   gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
				   angular.forEach($scope.baseData.goodsunit, function(value, index){
					   if(rowEntity.goodsunitname == value.goodsunitname){
						   rowEntity.goodsunitid = value.goodsunitid;
					   }
				   });
				   angular.forEach($scope.baseData.companygoodsclassify, function(value, index){
					   if(rowEntity.companygoodsclassifyname == value.companygoodsclassifyname){
						   rowEntity.companygoodsclassifyid = value.companygoodsclassifyid;
					   }
				   });
			    	   
			       $scope.$apply();
			   });
	        };
//        };
        
	    //删除导入的数据
        $scope.deleteImportGoods = function(row){
        	angular.forEach($scope.gridImportOptions.data, function(value, index){
        		if(row === value)
        			$scope.gridImportOptions.data.splice(index, 1);
        	});
        };
        
        $scope.getState = function(message){
        	return message;
//            switch (resultImport){
//                case 1:
//                {
//                    return "提交成功";
//                }
//                case 2:
//                {
//                    return "提交失败";
//                }
//                case 3:
//                {
//                    return "提交失败，已经存在相同的商品";
//                }
//                case 4:
//                {
//                    return "提交失败，商品编码不能为空";
//                }
//                case 5:
//                {
//                    return "提交失败，商品名称不能为空";
//                }
//                case 6:
//                {
//                    return "提交失败，商品销售价不能为空";
//                }
//                default: return "未提交";
//            }
        }
        
        
        //导入数据全选按钮的批量新增
        $scope.onClickImportAddGoods = function(){
        	var result = $scope.gridApi.selection.getSelectedRows();
        	        	
        	if(result==''){
        		$.jBox.tip("请选择要提交的商品", 'warning');
        		return;
        	}
        	
        	console.log(result);
	    	 $.jBox.confirm("确定要提交选中的"+result.length+"个商品吗？", "温馨提示", function(v, h, f){
	    		if(v == "ok"){
	    			$.jBox.tip("正在提交数据,请等待...", 'warning');
	    			var data = {goodslist:result};
	   	    		$http({
                        method : 'POST',
                        url : "/jsbweb/enterprise/goods/addBatch.do",
                        data : $.param({data:JSON.stringify(data)}),
                        headers : {
                            'Content-Type' : 'application/x-www-form-urlencoded'
                        }
                    }).success(function(rep) {
                    	$scope.gridApi.selection.clearSelectedRows();
                    	console.log(rep);
                    	$scope.gridImportOptions.data = [];
                    	//$scope.gridImportOptions.data.length = 0;
                    	$scope.gridImportOptions.data = angular.copy(rep.data.rows);
                    	 $.jBox.tip("一共提交" + rep.data.total +"个商品," +rep.data.success+ "个商品提交成功" + rep.data.fail+ "个商品提交失败", 'warning');
                    });
                    
	    			return true;
	    			var success = 0;
	    			var error = 0;
	    			angular.forEach(result, function(value, index){
		   	    		console.info(result.length);
		   	    		var receviced = false;
		   	    		$http({
	                         method : 'POST',
	                         url : "/jsbweb/enterprise/goods/addgoods.do",
	                         data : $.param(value),
	                         headers : {
	                             'Content-Type' : 'application/x-www-form-urlencoded'
	                         }
	                     }).success(function(data) {
	                    	 receviced = true;
	                         console.log(data)
	                         if(data.ret == 0){
	                        	 success++;
	                        	 value.resultImport = 1;
	                        	 $scope.deleteImportGoods(value);	                        	 
	                        	 
	                         }else if(data.ret == 20039){
	                        	 error++;
	                        	 value.resultImport = 3;
	                        	 
	                         }
	                         else if(data.ret == 20038){
	                        	 error++;
	                        	 value.resultImport = 4;
	                        	 
	                         }
	                         else if(data.ret == 20000){
	                        	 error++;
	                        	 value.resultImport = 5;
	                        	 
	                         }
	                         $.jBox.tip("一共提交" + result.length +"个商品," +success+ "个商品提交成功", 'warning');
	                     
	                     }).error(function(rep){
	                    	 receviced = true;
	                    	 error++;
	                    	 value.resultImport = 2;
	                    	 console.info(error);
	                    	 $.jBox.tip("一共提交" + result.length + "个商品," +error+ "个商品提交失败", 'warning');
	                     });
		   	    		
	   	        	});
	    			//$.jBox.tip("一共提交"+result.length+"个商品,"+error+"个商品提交失败"+success+"个商品提交成功", 'warning');
				}
				return true;
	 		});
     	};
        
//      //导入数据单个按钮的批量新增
//  	     $scope.onClickImportAddGoods = function(row){
//  	    	console.info(row.isSelected);
//	    		console.info(obj);
//	    		console.info(ary);
//	    	 $.jBox.confirm("确定要新增商品吗？", "温馨提示", function(v, h, f){
//	    		if(v == "ok"){
//	   	    	$.each(ary,function(key,item){
//		   	    		$http({
//	                         method : 'POST',
//	                         url : "/jsbweb/enterprise/goods/addgoods.do",
//	                         data : $.param(item),
//	                         headers : {
//	                             'Content-Type' : 'application/x-www-form-urlencoded'
//	                         }
//	                     }).success(function(data) {
//	                         console.log(data)
//	                         if(data.ret == 0){
//	                             $.jBox.tip("商品新增成功", 'success');
//	                         }else if(data.ret==10){
//	                             $.jBox.tip("请先登录", 'warning');
//	                         }else{
//	                             $.jBox.tip("商品新增失败", 'warning');
//	                         }
//	                     }).error(function(rep){
//	                         console.log(rep)
//	                         $.jBox.tip("商品新增失败", 'warning');
//	                     });
//	   	        	})
//	   	        	
//	    				}
//	    				return true;
//	    	 		});
//  	     	};
        //导入
        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });
        
        $scope.upload = function (files) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var name = file.name;
                    $scope.filename = name;
                    var index = name.lastIndexOf(".");
    	           	var ext = name.substring(index + 1, name.length);
    	   
    	           	if(ext !='xls'){
    	           		$.jBox.tip("请选择Excel文件(*.xls)！", 'warning');
    	           		return;
    	           	}
                   Upload.upload({
                        url: '/jsbweb/enterprise/goods/import.do',
                        headers: {'Content-Type': file.type},
                        file: file
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function (data, status, headers, config) {
                        $scope.gridImportOptions.data = data.data;
                    	console.log($scope.gridImportOptions.data);
                    	$('#goodsstockcheck-save').modal('hide');
                    	$.jBox.tip("导入成功", 'success');
                    }); 
    	           	
                }
            }
        };
        
        /*$scope.uploadExl = function(){
           if(data.ret==10){
        	   $.jBox.tip("请登陆", 'warning');
        	   return;
           }
           window.location.href="/jsbweb/enterprise/goods/downloadfile.do";
        };*/
        
        $scope.init();
 }]);