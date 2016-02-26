/**
 * Created by Administrator on 2015-06-18.
 */
comGoodsListApp
    //商品管理总控制器
    .controller('GoodsListController',['$scope','$rootScope', '$http', '$timeout','i18nService',
    function($scope,$rootScope, $http, $timeout, i18nService) {
        $scope.queryParams = {
            companygoodsclassifyid:0,
            goodsname:"",
            barcode:"",
            goodsspec:""
        };
        
        //$scope.queryGoodsData
        $scope.baseData = {};
       // $scope.baseData.isAdd = true;
        $scope.baseData.companygoodsclassify = [];
        $scope.baseData.classify = [];
        $scope.baseData.goodsunit = [];
        $scope.failDeleteGoods=[];
        $scope.baseData.modelGoodsData = {
            goodsname:"",
            barcode:"",
            goodsspec:"",
            goodsunit:"",
            isClickToSubmit:false
        };

        $scope.baseData.activeClassifyItem = {
            companygoodsclassifyid: "",
            companygoodsclassifyname: "",
            id:"",
            name:""
        }
        
        $scope.companygoodsclassify_adbtree = [];

        //递归分类
        $scope.getRecursive = function (nodes, arrayData, propertyId, propertyPid, pId, level, parentNode) {
            if (angular.isArray(arrayData) && arrayData.length == 0) return;
            var filterData = [];
            var result = {};
            if (!angular.isDefined(parentNode)) parentNode = {};
            for (var i = 0; i < arrayData.length; i++) {
                if (arrayData[i][propertyPid] != pId) {
                    filterData.push(arrayData[i]);
                }
            }

            parentNode["" + nodes] = [];
            result["" + nodes] = [];
            for (var i = 0; i < arrayData.length; i++) {
                if (arrayData[i][propertyPid] == pId) {
                    var node = jQuery.extend({}, arrayData[i]);
                    arguments.callee(nodes, filterData, propertyId, propertyPid, node[propertyId], level + 1, node);
                    if (level == 0) {
                        result["" + nodes].push(node);
                    } else {
                        parentNode["" + nodes].push(node);
                    }
                }
            }
            if (level == 0)
                return result["" + nodes];
        }
        //树的展开名称
        $scope.RecursiveAbnTreeChangeName = function(classify){
            var combotree = [];
            angular.forEach(classify, function(value, index){
                value.label = value.companygoodsclassifyname;
                if(value.children != undefined && value.children.length > 0){
                    $scope.RecursiveAbnTreeChangeName(value.children);
                }
                this.push(value);
            }, combotree);
            return combotree;
        };

        $scope.RecursiveComboTreeChangeName = function(classify){
            var combotree = [];
            angular.forEach(classify, function(value, index){
                value.id = value.companygoodsclassifyid;
                value.name = value.companygoodsclassifyname;
                if(value.children != undefined && value.children.length > 0){
                    $scope.RecursiveComboTreeChangeName(value.children);
                }
                this.push(value);
            }, combotree);
            return combotree;
        };

        $scope.collection = [];

        $scope.initComboTree = function(){
            var combotree = $scope.RecursiveComboTreeChangeName(angular.copy($scope.baseData.classify));
            $scope.classifycombotree = combotree;
        }
        //初始化树
        $scope.initAbnTree = function(){
            var abntree = $scope.RecursiveAbnTreeChangeName(angular.copy($scope.baseData.classify));
            var companygoodsclassify_adbtree = {
                label:"全部",
                companygoodsclassifyid:0,
                children: abntree
            };
            $scope.companygoodsclassify_adbtree = [companygoodsclassify_adbtree];
        };

        $scope.init = function(){
        	
            $http({
                method : 'GET',
                url : "/jsbweb/enterprise/goodsclassify/get.do"
            }).success(function(data) {
                console.log(data);
                $scope.baseData.companygoodsclassify = data.data.rows;
                console.info();
                $scope.baseData.classify = $scope.getRecursive( "children", $scope.baseData.companygoodsclassify, 'companygoodsclassifyid', 'parentid', "0", 0);

                $scope.initComboTree();

                $scope.initAbnTree();
                
                $scope.getGoodsUnit();
            });
        };

        $scope.getGoodsUnit = function(){
        	var result = []
            $http({
                method : 'GET',
                async:false,
                url : "/jsbweb/enterprise/goodsunit/get.do"
            }).success(function(data) {
                console.log(data)

                if(data.ret == 0){
                    $scope.baseData.goodsunit = data.data.rows;
                    result = $scope.baseData.goodsunit;
                    angular.forEach($scope.baseData.goodsunit, function(value, index){
                        value.name = value.goodsunitname;
                    });
                    console.log($scope.baseData.goodsunit)
                }
            });
        };
        
        var paginationOptions = {
            sort: null
        };
        
        $scope.gridOptions = {
            paginationPageSizes: [10, 20, 50, 100],
            paginationPageSize: 20,
            useExternalPagination: true,
            useExternalSorting: true,
            enableColumnMenus: false,
            enableRowSelection: true,
            enableSelectAll: true,
            selectionRowHeaderWidth: 35,
            columnDefs: [
                { name:'操作',field:'action',width:70,
                    cellTemplate: '<div class="ui-grid-cell-contents">' +
                    '<a style="cursor:pointer; margin-left: 8px;" ng-click="grid.appScope.modifyGoods(grid, row.entity)" title="修改"><span class="glyphicon glyphicon-pencil"></span></a>' +
                    '<a style="cursor:pointer; margin-left: 8px;" ng-click="grid.appScope.deleteGoods(grid, row.entity)" title="删除"><span class="glyphicon glyphicon-trash"></span></a>' +
                            //'<a style="cursor:pointer; margin-left: 8px;" ng-click="grid.appScope.showGoodsPicture(grid, row)" title="商品图片"><span class="glyphicon glyphicon-picture"></span></a>' +
                    '</div>'},
                { name: '错误原因',field:'failMessage',width:150,visible:false},
                { name: '商品编码',field:'goodssn',width:120},
                { name: '商品条码',field:'barcode',width:110 },
                { name: '商品名称',field:'goodsname',width:140},
                { name: '规格',field:'goodsspec',width:60},
                { name: '商品分类',field:'companygoodsclassifyname',width:100},
                { name: '销售价',field:'shopprice',width:60},
                { name: '单位',field:'goodsunitname',width:60},
                { name: '产地',field:'origin',width:60},
                { name: '重量',field:'weight',width:60},
                { name: '备注',field:'description',width:60},
                //{ name: '商品图片',field:'image'},
                { name: '状态',field:'onlineflag',width:50,cellTemplate:
                '<div class="ui-grid-cell-contents">{{grid.appScope.getState(row.entity.onlineflag)}}</div>'
                }
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
        
        //删除勾选的商品
        $scope.deleteSelectedRows=function(){
        	
        	$scope.failDeleteGoods=[];
        	$scope.rowsToDelete=[];
        	$scope.rowsToDelete=$scope.gridApi.selection.getSelectedRows();
        	if($scope.rowsToDelete.length==0){
        		$.jBox.tip("请先勾选要删除的商品", 'warning');
        		return;
        	}
        	
        	$scope.goods=new Array();
        	angular.forEach($scope.rowsToDelete,function(item){
        		$scope.goods.push({goodsid:item.goodsid});
        	});
        	
        	$scope.data={};
        	$scope.data.goods=angular.toJson($scope.goods);
        	
        	$.jBox.confirm("确定要删除这 "+$scope.rowsToDelete.length+" 个商品吗", "温馨提示", function(v, h, f){
                if(v == "ok"){
                	$http({
                        method : 'POST',
                        url : "/jsbweb/enterprise/goods/deleteSelectedGoods.do",
                        data : $.param($scope.data),
                        headers : {
                            'Content-Type' : 'application/x-www-form-urlencoded'
                        }
                    }).success(function(data) {
                        if(data.ret==0&&data.data.successCount>0){
                        	$.jBox.tip("成功删除 "+data.data.successCount+" 个商品，"+data.data.failCount+" 个商品删除失败", 'success');
	                       	$scope.failDeleteGoods=data.data.failgoods;
	                       	$scope.getPage(1, $scope.gridOptions.paginationPageSize,true);
	                       	if($scope.failDeleteGoods!=null&&$scope.failDeleteGoods.length!=0){
	                    		$scope.gridApi.grid.columns[2].showColumn();
	                        	$scope.gridApi.grid.refresh();
	                    		angular.forEach($scope.failDeleteGoods,function(item){
	                    			angular.forEach($scope.gridOptions.data,function(goods){
	                    				if(item.goodsid==goods.goodsid){
	                    					goods.failMessage=item.message;
	                    				}
	                    			});
	                    		});
	                    	  }
	                        }
			                else if(data.ret==0&&data.data.successCount==0&&data.data.failCount>0){
			               	 	$.jBox.tip("删除失败", 'warning');
			               	 	$scope.failDeleteGoods=data.data.failgoods;
			               	 	$scope.getPage(1, $scope.gridOptions.paginationPageSize,true);
			                   	if($scope.failDeleteGoods!=null&&$scope.failDeleteGoods.length!=0){
			                 		$scope.gridApi.grid.columns[2].showColumn();
			                     	$scope.gridApi.grid.refresh();
			                 		angular.forEach($scope.failDeleteGoods,function(item){
			                 			angular.forEach($scope.gridOptions.data,function(goods){
			                 				if(item.goodsid==goods.goodsid){
			                 					goods.failMessage=item.message;
			                 				}
			                 			});
			                 		});
			                 	  }
			                }
                        else if(data.ret==10){
                            $.jBox.tip("请先登录", 'warning');
                        }
                    }).error(function(rep){
                        $.jBox.tip("删除失败", 'warning');
                    });
                }
                return true;
            });
        }
       
        $scope.getState = function(onlineflag){
            switch (onlineflag){
                case 1:
                {
                    return "已启用";
                }
                case 2:
                {
                    return "禁用";
                }
            }
        }
        
        var f=0;

        var getPage = function(pagenum, pagesize, sort,deleteFlag) {
        	
            //var params = {
            //    pagenum:pagenum,
            //    pagesize:pagesize,
            //    goodsname:queryParam.goodsname,
            //    companygoodsclassifyid:queryParam.companygoodsclassifyid,
            //
            //};
        	if($scope.gridApi!=null){
        		$scope.gridApi.grid.columns[2].hideColumn();
        		$scope.gridApi.grid.refresh();
        	}
        	
            $scope.queryParams.pagenum = pagenum;
            $scope.queryParams.pagesize = pagesize;

            $http({
                method : 'POST',
                url : "/jsbweb/enterprise/goods/getgoods_by_classify.do",
                data : $.param($scope.queryParams),
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
            }).success(function(data) {
                if(data.ret==0){
            		$scope.gridOptions.data = data.data.rows;
            		$scope.gridOptions.totalItems = data.data.total;
            		
                }else if(data.ret==10){
                    $.jBox.tip("请先登录", 'warning');
                }else{ 
                    $.jBox.tip("获取商品数据失败", 'warning');
                }
            }).error(function(rep){
                console.log(rep)
                $.jBox.tip("获取商品数据失败", 'warning');
            });
        };
        $scope.getPage = getPage;
        $scope.init();
    }])

    //商品查询输入和其他操作 控制器
    .controller('GoodsListQueryController',['$scope', '$timeout', '$http','Upload',
    function($scope, $timeout, $http ,Upload) {

        $scope.onClickToQuery = function(){
            $scope.queryParams.barcode = $scope.queryParams.goodsname;
            $scope.queryParams.goodsspec = $scope.queryParams.goodsname;
            $scope.getPage(1, $scope.gridOptions.paginationPageSize);
        }

        $scope.onBtnClickAddGoods = function(){
            $scope.baseData.modelGoodsData = {
                goodsunit:{}
            };
            $scope.baseData.modelGoodsData.title = "新增商品";
            $scope.baseData.modelGoodsData.isClickToSubmit = false;
            console.log($scope.baseData.modelGoodsData.selectedItem)
            if($scope.baseData.activeClassifyItem != undefined)
                $scope.baseData.modelGoodsData.companygoodsclassifyid = $scope.baseData.activeClassifyItem.companygoodsclassifyid;
            //$scope.initComboTree();
            $('#viewModal-add-goods').modal("show");
        }
        
        //导出
        $scope.onBtnClickexportGoods = function(){
        	
        	window.location.href="/jsbweb/enterprise/goods/export.do";
        	//window.open("/jsbweb/enterprise/goods/export.do");
        }
       
//        //导入
//        $scope.$watch('files', function () {
//            $scope.upload($scope.files);
//        });
//        $scope.upload = function (files) {
//        	
//            if (files && files.length) {
//                for (var i = 0; i < files.length; i++) {
//                    var file = files[i];
//                    var name = file.name;
//                    $scope.filename = name;
//                    var index = name.lastIndexOf(".");
//    	           	var ext = name.substring(index + 1, name.length);
//    	   
//    	           	if(ext !='xls'){
//    	           		$.jBox.tip("请选择Excel文件(*.xls)！", 'warning');
//    	           		return;
//    	           	}
//    	           //$scope.baseData.isAdd = false;
//                   Upload.upload({
//                        url: '/jsbweb/enterprise/goods/import.do',
//                        headers: {'Content-Type': file.type},
//                        file: file
//                    }).progress(function (evt) {
//                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
//                    }).success(function (data, status, headers, config) {
//                       // $scope.gridImportOptions.data = data.data;
//                    	console.info(data);
//                    	$('#goodsstockcheck-save').modal('hide');
//                    	$.jBox.tip("导入成功", 'success');
//                    }); 
//    	           	
//                }
//            }
//        };
    }])
    //商品列表控制器
    .controller('GoodsListGridController',
    ['$scope', 'uiGridConstants', '$http','i18nService',
    function($scope, uiGridConstants, $http, i18nService) {
        i18nService.setCurrentLang('zh-cn');


        $scope.modifyGoods = function( grid, myRow){
            $("#viewModal-add-goods").modal("show");
            $scope.baseData.modelGoodsData = angular.copy(myRow);
            $scope.baseData.modelGoodsData.title = "修改商品";
            $scope.baseData.modelGoodsData.isClickToSubmit = false;
            $scope.baseData.modelGoodsData.goodsunit = {
                    goodsunitid:$scope.baseData.modelGoodsData.goodsunitid,
                    goodsunitname:$scope.baseData.modelGoodsData.goodsunitname,
                    name: $scope.baseData.modelGoodsData.goodsunitname
            };

            //var activeClassifyItem = {};
            //activeClassifyItem.id =  $scope.baseData.modelGoodsData.companygoodsclassifyid;
            //activeClassifyItem.name =  $scope.baseData.modelGoodsData.companygoodsclassifyname;
            //activeClassifyItem.companygoodsclassifyid =  $scope.baseData.modelGoodsData.companygoodsclassifyid;
            //activeClassifyItem.companygoodsclassifyname =  $scope.baseData.modelGoodsData.companygoodsclassifyname;
            //$scope.activeClassifyItem = activeClassifyItem;
            //console.log($scope.activeClassifyItem)
        };

        $scope.deleteGoods = function( grid, myRow ){
            $.jBox.confirm("确定要删除商品:  " + myRow.goodsname + " 吗？", "温馨提示", function(v, h, f){
                if(v == "ok"){
                    $http({
                        method : 'POST',
                        url : "/jsbweb/enterprise/goods/deletegoods.do",
                        data : $.param({goodsid: myRow.goodsid}),
                        headers : {
                            'Content-Type' : 'application/x-www-form-urlencoded'
                        }
                    }).success(function(data) {
                        console.log(data)
                        if(data.ret == 0){
                            $.jBox.tip("商品删除成功", 'success');
                            $scope.getPage(1, $scope.gridOptions.paginationPageSize,true);
                        }else if(data.ret==10){
                            $.jBox.tip("请先登录", 'warning');
                        }else{
                            $.jBox.tip("商品删除失败", 'warning');
                        }
                    }).error(function(rep){
                        console.log(rep)
                        $.jBox.tip("商品删除失败", 'warning');
                    });
                }
                return true;
            });

        };

        $scope.getPage(1, $scope.gridOptions.paginationPageSize);
        //$scope.getPage = getPage;

    }])
    //商品分类树形结构 控制器
    .controller('GoodsClassifyController',['$scope', '$timeout','$http','utils','goodsClassifyService',
    function($scope, $timeout, $http, utils, goodsClassifyService) {
        $scope.my_tree_handler = function(branch) {
            console.log(branch)
            $scope.queryParams.companygoodsclassifyid = branch.companygoodsclassifyid;
            $scope.queryParams.barcode = $scope.queryParams.goodsname;
            $scope.queryParams.goodsspec = $scope.queryParams.goodsname;
            $scope.getPage(1, $scope.gridOptions.paginationPageSize);
        };
        
        $scope.showGoodsclassifyAddModal=function(){
        	$("#goodsClassifyModal").modal("show");
    		//关闭商品分类名称表单验证提示
        	$scope.myForm = {};
        	$scope.myForm.submitted = false;
            $scope.myForm.parentid = 0;
    		
    		$scope.sortGoodsClassify();
        };
        
        $scope.myForm={};
        
      //添加或编辑商品
    	$scope.addGoodsClassify = function(goodsClassifyFrom){
    		//判断表单验证是否通过
			if(goodsClassifyFrom.companygoodsclassifyname.$invalid){
				$scope.myForm.submitted = true;
			}else{
	            //请求后台处理操作
				var url = goodsClassifyService.getAddCompanyGoodsClassifyUrl();
				goodsClassifyService.httpPost(url,$scope.myForm,function(resp){
					if(resp.ret == 0){
						//添加成功后重新获取商品分类数据
//						$scope.searchGoodsClassify();
						//$scope.gridApi.grid.refresh();
						$('#goodsClassifyModal').modal('hide');
						$.jBox.tip("商品分类添加成功!", "success");
						$scope.init();
					}else if(resp.ret == 20019){
						$.jBox.tip("添加失败,同一级商品分类名称不能相同!", "success");
					}else if(resp.ret == 20020){
						$.jBox.tip(resp.message, "success");
					}
				});	
			}
    	};
    	
    	//判断节点是否含有子节点
    	function hasChildNodes(companygoodsclassifyid,arr,level){
    		angular.forEach($scope.copyData,function(data,index,array){
    			//判断节点的companygoodsclassifyid是否为其它节点的父节点,是则继续递归
    			if(companygoodsclassifyid == data.parentid){ 
    				//一级节点设置$$treeLevel为0,二级节点设置为1,以此类推
    				data.$$treeLevel = parseInt(level)+1;
    				$scope.gridOptions.data.push(data);
    				hasChildNodes(data.companygoodsclassifyid,$scope.gridOptions.data,data.$$treeLevel);
    			}
    		});
    	}
    	//商品分类信息首页展示
    	$scope.searchGoodsClassify = function(){
    	    var url = goodsClassifyService.getGetCompanyGoodsClassifyUrl()+"?parentid=";
    		goodsClassifyService.httpGet(url,function(data){
    			if(data.ret == 0){
    				//给商品分类增加一个默认分类
    				$scope.newObject = {
    						parentid:0,
    						companygoodsclassifyid:0,
    						companygoodsclassifyname:'(空)'
    				};
    				$scope.goodsClassifyLists = angular.copy(data.data.rows);
    				$scope.goodsClassifyLists.push($scope.newObject);
    			}else{
    				$.jBox.tip("请重新登录!", "success");
    			}
    		});	
    	};
    	//首次加载页面调用查询商品分类信息
    	$scope.searchGoodsClassify();
    	
    	//给弹窗的商品分类信息下拉列表进行排序整理
    	$scope.sortGoodsClassify = function(){
    		var classify = utils.arrayDataToTree($scope.goodsClassifyLists,'companygoodsclassifyid', 'parentid', "0", 0);
    		var array = [];
    		function text(classify){
    			for(var i=0; i<classify.length;i++){
    				var a = classify[i];
    				array.push({companygoodsclassifyname:getspace(a.level) + a.companygoodsclassifyname,companygoodsclassifyid:a.companygoodsclassifyid});
    				if(a.nodes && a.nodes.length>0)
    				{
    					text(a.nodes);
    				};
    			}
    		}
    		function getspace(count){
    			var space = '';
    			while(count--){
    				space += '--';
    			}
    			
    			return space;
    		}
    		text(classify);
    		$scope.additionGoodsClassifyLists  = array;
    	};
        
    }])
    .controller("GoodsAddController",["$scope", "$http", '$timeout', function($scope, $http, $timeout){

        $scope.init = function(){
            $scope.getGoodsUnit();

            $scope.$watch(function() {
                return $scope.baseData.modelGoodsData.goodsunit;
            }, function(newVal, oldVal) {
                $scope.baseData.modelGoodsData.goodsunitid = newVal.goodsunitid;
            });

        };

        $scope.changeItem = function (value) {

            $scope.baseData.activeClassifyItem = value;
            //$scope.modelGoodsData.selectedItem = value;
            $scope.baseData.modelGoodsData.companygoodsclassifyid = value.companygoodsclassifyid;
        };

        $scope.onClickShowAddGoodsUnitModel = function(){
            $("#viewModal-add-goodsunit").modal("show");
        };

        $scope.onClickToAddGoods = function() {
            console.log($scope.baseData.modelGoodsData)
            if($scope.modeladdgoodsForm.$invalid){
                $.jBox.tip("请检查输入数据是否正确", 'warning');
                $scope.baseData.modelGoodsData.isClickToSubmit = true;
                return;
            }

            if ($scope.baseData.modelGoodsData.goodsname == "") {
                $scope.baseData.modelGoodsData.isClickToSubmit = true;
                return;
            }
            if ($scope.baseData.modelGoodsData.shopprice == undefined || $scope.baseData.modelGoodsData.shopprice == "") {
                $scope.baseData.modelGoodsData.isClickToSubmit = true;
                return ;
            }
            if($scope.baseData.modelGoodsData.companygoodsclassifyid == undefined || $scope.baseData.modelGoodsData.companygoodsclassifyid == 0){
                $scope.baseData.modelGoodsData.isClickToSubmit = true;
                return;
            }

            if($scope.baseData.modelGoodsData.goodsid == undefined) {//新增
                $http({
                    method: 'POST',
                    url: "/jsbweb/enterprise/goods/addgoods.do",
                    data: $.param($scope.baseData.modelGoodsData),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (data) {
                    console.log(data)
                    if (data.ret == 0) {
                        //$scope.gridOptions.data = data.data.rows;
                        $scope.getPage(1, $scope.gridOptions.paginationPageSize);

                        $.jBox.tip("新增商品成功", 'success');
                        $("#viewModal-add-goods").modal("hide");
                    } else if (data.ret == 10) {
                        $.jBox.tip("请先登录", 'warning');
                    } else {
                        $.jBox.tip("获取商品数据失败", 'warning');
                    }
                }).error(function (rep) {
                    console.log(rep)
                    $.jBox.tip("新增商品失败", 'warning');
                });
            }else{
                $http({
                    method: 'POST',
                    url: "/jsbweb/enterprise/goods/modifygoods.do",
                    data: $.param($scope.baseData.modelGoodsData),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (data) {
                    console.log(data)
                    if (data.ret == 0) {
                        //$scope.gridOptions.data = data.data.rows;
                        $scope.getPage(1, $scope.gridOptions.paginationPageSize);
                        $.jBox.tip("商品修改成功", 'success');
                        $("#viewModal-add-goods").modal("hide");
                        
                    } else if (data.ret == 10) {
                        $.jBox.tip("请先登录", 'warning');
                    } else {
                        $.jBox.tip("商品修改失败", 'warning');
                    }
                }).error(function (rep) {
                    console.log(rep)
                    $.jBox.tip("商品修改失败", 'warning');
                });
            }
        };

        $timeout(function(){
            $scope.init();
        },100);

    }])
    .controller("GoodsAddGoodsUnitController",["$scope", "$http", function($scope, $http){

        $scope.modelGoodsUnitData = {};

        $scope.addGoodsUnit = function(){
            $http({
                method : 'POST',
                url : "/jsbweb/enterprise/goodsunit/add.do",
                data : $.param({goodsunitname : $scope.modelGoodsUnitData.goodsunitname}),
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
            }).success(function(data) {
                console.log(data)
                if (data.ret == 0) {
                    $.jBox.tip("添加计量单位成功", 'success');
                    $scope.getGoodsUnit();
                    $("#viewModal-add-goodsunit").modal("hide");
                }else{
                    $.jBox.tip("添加计量单位失败", 'error');
                }
            }).error(function(rep){
                console.log(rep)
                $.jBox.tip("添加计量单位失败", 'error');
            });
        };
    }]);

