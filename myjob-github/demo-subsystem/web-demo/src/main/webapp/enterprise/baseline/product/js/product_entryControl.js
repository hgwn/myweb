/**
 * Created by Administrator on 2015-10-10.
 */
entProductsModule.controller("productEntryController",
    ['$scope','$rootScope','$http',"$stateParams","$state","i18nService","utils",'Upload',
        function($scope, $rootScope, $http,$stateParams,$state,i18nService,utils,Upload) {
    	i18nService.setCurrentLang('zh-cn');
    	$scope.formData={pagesize:20,pagenum:1};
    	
    	$scope.Data={};
    	
    	//加载数据源汇总
        $http
            .get("../../../enterprise/baseline/product/getgoods_list.do?pagesize=20&pagenum=1")
            .success(function (data) {
            	if (data.ret == 10) {
                    $.jBox.tip("请先登录", 'warning');
                }
            	var result =angular.copy(data.data.rows);
            	
            	/*angular.forEach(result, function (value, key) {
            		if(value.onlineflag == 1){
            			value.onlineflagZh = "上架";
            		}else{
            			value.onlineflagZh = "下架";
            		}
            		
        		});*/
            	
                $scope.entrygridOptions.data = result;
                $scope.entrygridOptions.totalItems = data.data.total;
                
                
            });
        
        
       //加载绑定分类
    	$http({
            method: 'POST',
            url: "/jsbweb/enterprise/category/find_category.do?pagesize=30&pagenum=1",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function (data) {
            if (data.ret == 0) {
                $scope.categorynamesOption = data.data.rows;
                $scope.sortCategory();
            }
            if (data.ret == 10) {
                $.jBox.tip("请先登录", 'warning');
            }
        });
    	
    	//给弹窗的商品分类信息下拉列表进行排序整理
    	$scope.sortCategory = function(){
    		var classify = utils.arrayDataToTree($scope.categorynamesOption,'categoryid', 'parentid', "0", 0);
    		var array = [];
    		function text(classify){
    			angular.forEach(classify, function (value, key) {
    				var a = value;
    				array.push({categoryname:getspace(a.level) + a.categoryname,categoryid:a.categoryid});
    				if(a.nodes && a.nodes.length>0)
    				{
    					text(a.nodes);
    				};
        		});
    		}
    		function getspace(count){
    			var space = '';
    			while(count--){
    				space += '__';
    			}
    			
    			return space;
    		}
    		text(classify);
    		$scope.categorynames  = array;
    	};
    	
    	//加载计量单位
    	$http({
            method: 'POST',
            url: "/jsbweb/enterprise/baseline/product/find_goodsunit.do?pagesize=30&pagenum=1",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function (data) {
            if (data.ret == 0) {
                $scope.goodsunitOption = data.data.rows;
                
            }
            if (data.ret == 10) {
                $.jBox.tip("请先登录", 'warning');
            }
        });
    	
        
        //查询
        $scope.onClickToQuery = function(){
        	
        	$scope.formData.orders = 'goodssn';
            $scope.formData.orderkey = 'desc';
                    	 
            $http({
                 method : 'POST',
                 url : "/jsbweb/enterprise/baseline/product/getgoods_list.do",
                 data : $.param($scope.formData),
                 headers : {
                     'Content-Type' : 'application/x-www-form-urlencoded'
                 }
             }).success(function(data) {
                 if(data.ret==0){
                	 var result =angular.copy(data.data.rows);
                	 
                	 /*angular.forEach(result, function (value, key) {
                 		if(value.onlineflag == 1){
                 			value.onlineflagZh = "上架";
                 		}else{
                 			value.onlineflagZh = "下架";
                 		}
             		});*/
                	 
                    $scope.entrygridOptions.data = result;
                    $scope.entrygridOptions.totalItems = data.data.total;
                    
                 }else if(data.ret==10){
                     $.jBox.tip("请先登录", 'warning');
                 }else{ 
                     $.jBox.tip("获取数据失败", 'warning');
                 }
             }).error(function(rep){
                 $.jBox.tip("获取数据失败", 'warning');
             });
        }
        
    	
    	//展示商品页面
    	$scope.entrygridOptions = { 
    		 paginationPageSizes: [10, 20, 50, 100],
             paginationPageSize: 20,
             useExternalPagination: true,
 			 enableGridMenu: true,
 			 enableColumnMenus: false,
 			
       		 columnDefs : [
							{ name: '序号',field:'id', width:55,cellTemplate:
								'<div class="ui-grid-cell-contents" style="text-align:center">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
							},
       		               	{ name:'操作',field:'action',
       		                    cellTemplate: '<div class="ui-grid-cell-contents">' +
       		                    '<a style="cursor:pointer; margin-left: 10px;" ui-sref="updata({goodssn:row.entity.goodssn,pagesize:20,pagenum:1})" title="修改" ><span class="glyphicon glyphicon-pencil red">修改</span></a>' +      
       		                 '<a style="cursor:pointer; margin-left: 10px;" ng-click="grid.appScope.delOrders(row.entity)" title="删除" ><span class="glyphicon glyphicon-trash red">删除</span></a>' +
       		                '</div>',width:'120',enableCellEdit: false },
//       		                {
//       		                	name: '商品图片',field:'thumb',
//       		                	cellTemplate:'<div class="ui-grid-cell-contents" style="height:141px" ><a style="cursor:pointer;" ng-click="grid.appScope.look(row.entity)" id="modal-728099" href="#modal-container-728099" data-toggle="modal" title="查看">' +
//       		                		'<img src="{{COL_FIELD}}" style="width:100px; height:88px"></a></div>'
//       		                },
       		                { name: '编码',field:'goodssn',enableCellEdit: false},
       		                { name: '商品名称',field:'productname', enableCellEdit: false},
       		                { name: '条形码',field:'barcode',enableCellEdit: false},
       		                { name: '单位',field:'goodsunitname', enableCellEdit: false},
       		                { name: '商品分类',field:'categoryname',enableCellEdit: false},
       		                /*{ name: '市场价',field:'marketprice',width:"70",enableCellEdit: false},*/
       		                { name: '销售价',field:'shopprice',enableCellEdit: false},
       		                /*{ name: '状态',field:'onlineflagZh',width:"60",enableCellEdit: false},*/
       		               ],
       		            onRegisterApi: function(gridApi) {
       		                $scope.gridApi = gridApi;
       		                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
       		                    if(getPage) {
       		                        getPage(newPage, pageSize);
       		                    }
       		                });
       		            }
        };
    	
    	var getPage = function(pagenum, pagesize) {
            $scope.formData.pagenum = pagenum;
            $scope.formData.pagesize = pagesize;
            
            $scope.onClickToQuery();
        };
        $scope.getPage = getPage;
        
        //查看图片
        $scope.look = function(myRow){
        	
        	if(myRow.thumb == ""){
        		$.jBox.tip('该商品没有上传图片!', 'warning');
        	}
        	$scope.formData.thumb = myRow.thumb;
        };
        
        
        //导出
        $scope.onBtnClickexportGoods = function(){
        	
        	window.location.href="/jsbweb/enterprise/baseline/product/export.do?pagesize=300&pagenum=1";
        }
        
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
                        url: '/jsbweb/enterprise/baseline/product/import.do',
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
                    	$('#select_imports').modal('show');
                    }); 
    	           	
                }
            }
        };
        
        
        //展示导入的商品界面
        $scope.gridImportOptions = {
  	          paginationPageSizes: [10, 20, 50, 100],
  	          paginationPageSize: 20,
  	          enableColumnMenus: false,
  	          enableGridMenu: true,
  	          enableRowSelection: true,
  	          enableSelectAll: true,
  	          selectionRowHeaderWidth: 35,
  		      columnDefs: [
  	          { name: '序号', enableHiding: false, field:'id',type:'text',enableHiding: false,
  	        	  enableCellEdit: false , enableSorting: false, enableColumnResizing:false, width:'55', 
  	        	  cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},           
  		      { name: '编码',  field: 'goodssn'},
  		      { name: '商品名称', field: 'goodsname' },
  		      { name: '条形码', field: 'barcode' },
  		      { name: '单位', field: 'goodsunitname' },
  		      
  		      { name: '规格', field: 'goodsspec' },
  		      
  		      { name: '商品分类', field: 'categoryname' },
  		      /*{ name: '市场价', field: 'marketprice' },*/
  		      { name: '销售价', field: 'shopprice' },
  		      
  		      { name: '启用批次号', field: 'isbatchcodeZh' },
  		      { name: '状态',field:'result',enableCellEdit: false, width: '20%'}
  		      ],
              onRegisterApi: function(gridApi) {
                  $scope.gridApi = gridApi;
                  $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                      if(getPage) {
                          if (sortColumns.length > 0) {
                              paginationOptions.sort = sortColumns[0].sort.direction;
                          } else {
                              paginationOptions.sort = null;
                          }
                          getPage(grid.options.paginationCurrentPage, grid.options.paginationPageSize, paginationOptions.sort)
                      }
                  });
                  gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                      if(getPage) {
                          getPage(newPage, pageSize, paginationOptions.sort);
                      }
                  });
              }
  		};
        
        //删除导入的数据
        $scope.deleteImportGoods = function(row){
        	angular.forEach($scope.gridImportOptions.data, function(value, index){
        		if(row === value)
        			$scope.gridImportOptions.data.splice(index, 1);
        	});
        };
        
        //导入数据全选按钮的批量新增
        $scope.onClickToAddimports = function(){
        	var result = $scope.gridApi.selection.getSelectedRows();
        	        	
        	if(result==''){
        		$.jBox.tip("请选择要提交的商品", 'warning');
        		return;
        	}
        	
        	console.log(result);
	    	 $.jBox.confirm("确定要提交选中的"+result.length+"个商品吗？", "温馨提示", function(v, h, f){
	    		if(v == "ok"){
	    			
	    			angular.forEach(result, function(value, index){
	    				if(value.isbatchcodeZh == "是"){
	    					value.isbatchcode = 2;
	    				}else{
	    					value.isbatchcode = 1;
	    				}
	    			});
	    			
	    			$scope.Data.goods = result;
	    			
	    			//批量新增
	    			var data = { data: angular.toJson($scope.Data)};
	   	    		$http({
                         method : 'POST',
                         url : "/jsbweb/enterprise/baseline/product/add_allProduct.do",
                         data : $.param(data),
                         headers : {
                             'Content-Type' : 'application/x-www-form-urlencoded'
                         }
                     }).success(function(data) {
                    	 console.info(data);
                    	 
                    	 $scope.gridImportOptions.data = data.data.rows;
                    	 
                    	 if($scope.gridImportOptions.data.length == 0){
                    		 $('#select_imports').modal("hide");
                    		 $.jBox.tip("商品提交成功", 'success');
                    	 }
                    	 
                    	 $scope.onClickToQuery();
                    	 
                    	 
                     }).error(function(rep){
                    	 console.info(error);
                     });
	    			
				}
	 		});
     	};
        
     	//删除商品
        $scope.delOrders = function(row){
            $.jBox.confirm("确定要删除该商品" + row.productname + " ？", "温馨提示", function(v, h, f){
                if(v == "ok"){
                    var param = {};
                    param.productid = row.productid;
                    $http({
                        method: 'POST',
                        url: "/jsbweb/enterprise/baseline/product/deleteProduct.do",
                        data: $.param(param),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function (data) {
                        if(data.ret==0){
                            $.jBox.tip("删除商品成功", 'success');
                            $scope.onClickToQuery();
                        }else if(data.ret==10){
                            $.jBox.tip("登录信息异常,请重新登录", 'warning');
                        }else{
                            $.jBox.tip("删除商品失败", 'warning');
                        }
                    }).error(function(rep){
                        console.log(rep)
                        $.jBox.tip("删除商品失败", 'warning');
                    });
                }
                return true;
            });
        };
    }]);

entProductsModule.directive('onFinishRenderFilters', function ($timeout) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
        	
            $(window).resize(function () {
                $("#entrygridOptionsid", element).css("height", (document.documentElement.clientHeight - 120) + "px");
            });
            $timeout(function(){
                $("#entrygridOptionsid", element).css("height", (document.documentElement.clientHeight - 120) + "px");
            })
        }
    };
})