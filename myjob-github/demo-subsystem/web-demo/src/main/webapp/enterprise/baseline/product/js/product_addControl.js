/**
 * Created by Administrator on 2015-10-14.
 */
entProductsModule.controller("productAddController",
    ['$scope','$rootScope','$http',"$stateParams","$state","Upload","utils",
        function($scope, $rootScope, $http,$stateParams,$state,Upload,utils) {
    	$scope.formData = {};
    	$scope.goods = [];
    	$scope.categorynamesOption = [];
    	$scope.formData.goods = [];
    	$scope.temp_picture = [];
    	$scope.formData.productstockconfig = {};
    	
    	
    	$scope.myForm = {};
    	
    	
    	$scope.formData.goodspicture = [];
    	
    	$scope.pics=[];
    	$scope.replaceFiles="";
    	
    	//默认
    	$scope.formData.onlineflag = 1;
    	$scope.formData.usesku = 1;
    	$scope.formData.virtualflag = 2;
    	  
    	//商品子表
    	var temp = {};
		temp.barcode="";
		temp.thumb = "";
		
		temp.specificationoptionid ="";
		
		//temp.action = "add";
		$scope.goods.push(temp);
		
		//添加一行
        $scope.addNewRow = function(){
        	var temp = {};
    		temp.barcode="";
    		temp.thumb = "";
    		//temp.action = "add";
    		$scope.goods.push(temp);
        }
    	
    	//上架标识
    	$scope.type = [
  	                 { id: 1, value: "上架" },
  	                 { id: 2, value: "下架" }
  	             ];
    	
    	//虚拟商品标识
    	$scope.typeVirtualflag = [
    	                 { id: 1, value: "是" },
    	                 { id: 2, value: "不是" }
    	             ];
	 	
	 	//初始方法
        $scope.init = function(){
        	
        	
	        if($stateParams.goodssn != null){
	        	
	        	//修改界面的查询
	    	 	$http({
	                method : 'POST',
	                url : "/jsbweb/enterprise/baseline/product/getgoods_list.do",
	                data : $.param($stateParams),
	                headers : {
	                    'Content-Type' : 'application/x-www-form-urlencoded'
	                }
	            }).success(function(data) {
	                if(data.ret==0){
	                	
	                	$scope.formData = data.data.rows[0];
	                	
	                	console.log($scope.formData);
	                	if($scope.formData.thumb){
		    				$scope.file = true;
				    	}else{
				    		$scope.file = false;
				    	}
	                	
	                	
	                	$scope.goods[0].goodsid = $scope.formData.goodsid;
	                	$scope.goods[0].barcode = $scope.formData.barcode;
	                	$scope.goods[0].goodssn = $scope.formData.goodssn;
	                	$scope.goods[0].shopprice = $scope.formData.shopprice;
	                	$scope.goods[0].goodsspec = $scope.formData.goodsspec;
	                	$scope.goods[0].thumb = $scope.formData.thumb;
	                	
	                	
	                	//库存信息
	                	$scope.formData.productstockconfigid = $scope.formData.productstockconfig.productstockconfigid;
                		$scope.formData.maxinventory = $scope.formData.productstockconfig.maxinventory;
                		$scope.formData.mininventory = $scope.formData.productstockconfig.mininventory;
                		$scope.formData.advanceday = $scope.formData.productstockconfig.advanceday;
                		$scope.formData.safeday = $scope.formData.productstockconfig.safeday;
                		//$scope.formData.isbatchcode = $scope.formData.productstockconfig.isbatchcode;
                		//$scope.formData.issernum = $scope.formData.productstockconfig.issernum;
                		
                		if($scope.formData.productstockconfig.isbatchcode == 2){
                			$scope.formData.isbatchcode = true;
                		}else{
                			$scope.formData.isbatchcode = false;
                		}
                		
                		/*if($scope.formData.issernum == 2){
                			$scope.formData.issernum = true;
                		}*/
                		
	                	
	                	$scope.formData.edit = "修改";
	                	
	                	if($scope.formData.usesku == 2){
	                		$scope.usesku = true;
	                	}else{
	                		$scope.usesku = false;
	                	}
	                	
	                	//图片
	                	angular.forEach($scope.formData.goodspicture, function (value, key) {
	                		$scope.formData.pictureurl = value.pictureurl;
	            		});
	                	
	                	$scope.temp_picture = angular.copy($scope.formData.goodspicture);
	                	
	                	//修改界面 多规格显示
	                	var goodsspecification = $scope.formData.goodsspecification;
	                	var specOption = $scope.specOption;
	                	
	                	angular.forEach(goodsspecification, function (value, key) {
	                		
	                		angular.forEach(specOption, function (Dvalue, Dkey) {
		                		
		                		angular.forEach(Dvalue.specificationoption, function (svalue, skey) {
			                		
			                		if(svalue.specificationoptionid == value.specificationoptionid){
			                			svalue.checked = true;
			                			Dvalue.checked = true;
			                			Dvalue.specificationoption.specificationoptionid=value.specificationoptionid;
			                		}
			                	});
		                	});
	                	});
	                		                	
	                }else if(data.ret==10){
	                    $.jBox.tip("请先登录", 'warning');
	                }else{ 
	                    $.jBox.tip("获取数据失败", 'warning');
	                }
	            }).error(function(rep){
	                $.jBox.tip("获取数据失败", 'warning');
	            });
	    	 	
	        }else{
	        	//新增界面
	        	$scope.formData.edit = "新增";
	        	
	        }
	        
	     }
	 	//初始方法
        $scope.init();
    	
    	
    	//加载绑定分类
        $scope.getCategory = function(){
	    	$http({
	            method: 'POST',
	            url: "/jsbweb/enterprise/category/find_category.do?pagesize=30&pagenum=1",
	            headers: {
	                'Content-Type': 'application/x-www-form-urlencoded'
	            }
	        }).success(function (data) {
	            if (data.ret == 0) {
	            	//给商品分类增加一个默认分类
	            	
	            	if($scope.formData.productid == undefined){
	            		$scope.newObject = {
		 						parentid:0,
		 						categoryid:0,
		 						categoryname:'(空)'
		 				};
	            	}
	 				
	                $scope.categorynamesOption = data.data.rows;
	                
	                if($scope.formData.productid == undefined){
	                	$scope.categorynamesOption.push($scope.newObject);
	                }
	                
	                
	                
	                console.info($scope.categorynamesOption);
	                $scope.sortCategory();
	                
	                if($scope.formData.productid == undefined){
	                	angular.forEach($scope.categorynamesOption, function(value, index){
		                	$scope.formData.categoryid = value.categoryid;
		                	$scope.formData.categoryname =value.categoryname;
		                });
	                }
	            }
	            if (data.ret == 10) {
	                $.jBox.tip("请先登录", 'warning');
	            }
	        });
        }
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
    				space += "--";
    			}
    			return space;
    		}
    		text(classify);
    		$scope.categorynames  = array;
    	};
    	
    	$scope.getCategory();
        
        //加载品牌 
        $http({
            method: 'POST',
            url: "/jsbweb/enterprise/brand/find_brand.do?pagesize=30&pagenum=1",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function (data) {
            if (data.ret == 0) {
                $scope.brandOption = data.data.rows;
                
                angular.forEach($scope.brandOption, function(value, index){
                	$scope.formData.brandid = value.brandid;
                	$scope.formData.brandname =value.brandname;
                });
            }
            if (data.ret == 10) {
                $.jBox.tip("请先登录", 'warning');
            }
        });
        
      //加载规格
        $scope.getSpecification = function(){
	        $http({
	            method: 'POST',
	            url: "/jsbweb/enterprise/specification/find_specification.do?pagesize=30&pagenum=1",
	            headers: {
	                'Content-Type': 'application/x-www-form-urlencoded'
	            }
	        }).success(function (data) {
	            if (data.ret == 0) {
	                $scope.specOption = data.data.rows;
	            }
	            if (data.ret == 10) {
	                $.jBox.tip("请先登录", 'warning');
	            }
	        });
        }
        $scope.getSpecification();
          
        //给弹窗的商品分类信息下拉列表进行排序整理
    	/*$scope.sortCategory = function(){
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
    				space += '--';
    			}
    			
    			return space;
    		}
    		text(classify);
    		$scope.categorynames  = array;
    	};*/
        $scope.tempgoodsspecification = [];
        $scope.specification_select=function(specificationid,specificationoptionid){
        	if(specificationoptionid !=undefined){
        		for(var i=0; i<$scope.specOption.length; i++){
        			if($scope.specOption[i].specificationid == specificationid){
        				for(var j=0; j<$scope.specOption[i].specificationoption.length; j++){
        					$scope.specOption[i].specificationoption[j].checked=false;
        					if($scope.specOption[i].specificationoption[j].specificationoptionid == specificationoptionid){
        						$scope.specOption[i].specificationoption[j].checked=true;
        					}
        				}
        			}
        		}
        	};
//        	console.log(tempOjb);
        };
        
        //加载计量单位
        $scope.getGoodsUnit = function(){
	        $http({
	            method: 'POST',
	            url: "/jsbweb/enterprise/baseline/product/find_goodsunit.do?pagesize=30&pagenum=1",
	            headers: {
	                'Content-Type': 'application/x-www-form-urlencoded'
	            }
	        }).success(function (data) {
	            if (data.ret == 0) {
	                $scope.goodsunitOption = data.data.rows;
	                
	                angular.forEach($scope.goodsunitOption, function(value, index){
	                	$scope.formData.goodsunitid = value.goodsunitid;
	                	$scope.formData.goodsunitname =value.goodsunitname;
	                });
	            }
	            if (data.ret == 10) {
	                $.jBox.tip("请先登录", 'warning');
	            }
	        });
        }
        $scope.getGoodsUnit();
    	
    	//保存 	
    	$scope.addFormDataSumbit = function(){
    		
    		if ($scope.formData.productname == undefined || $scope.formData.productname == "") {
                $.jBox.tip('商品名称不能为空', 'warning');
                return ;
            }
    		
    		if ($scope.formData.categoryid == undefined || $scope.formData.categoryid == "" || $scope.formData.categoryid == 0) {
                $.jBox.tip('商品分类不能为空', 'warning');
                return ;
            }
    		
    		if ($scope.formData.marketprice == undefined || $scope.formData.marketprice == "") {
                $.jBox.tip('市场价不能为空', 'warning');
                return ;
            }
    		
    		//分类id与分类名
    		angular.forEach($scope.categorynamesOption, function (value, key) {
    			if($scope.formData.categoryid == value.categoryid){
    				$scope.formData.categoryname = value.categoryname;
    			}
    		});
    
			//商品子表
    		$scope.formData.goods = $scope.goods;
    		
    		if ($scope.formData.goods[0].goodssn == undefined || $scope.formData.goods[0].goodssn == "") {
                $.jBox.tip('商品编码不能为空', 'warning');
                return ;
            }
    		if ($scope.formData.goods[0].shopprice == undefined || $scope.formData.goods[0].shopprice == "") {
                $.jBox.tip('商品金额不能为空', 'warning');
                return ;
            }
    		
    		//商品库存设置
    		var config = {};
    		//var stockconfig = [];
    		if($scope.formData.issernum == true){
    			config.issernum = 2;
    		}else{
    			config.issernum = 1;
    		}
    		
    		if($scope.formData.isbatchcode == true){
    			config.isbatchcode = 2;
    		}else{
    			config.isbatchcode = 1;
    		}
    		
    		config.mininventory = $scope.formData.mininventory;
    		config.maxinventory = $scope.formData.maxinventory;
    		config.safeday = $scope.formData.safeday;
    		config.advanceday = $scope.formData.advanceday;
    		
    		if($scope.formData.mininventory > $scope.formData.maxinventory){
    			$.jBox.tip('最小库存不能大于最大库存', 'warning');
    			return ;
    		}
    		
    		if($scope.formData.safeday < $scope.formData.advanceday){
    			$.jBox.tip('保质期天数不能小于报警天数', 'warning');
    			return ;
    		}
    		
    		//stockconfig.push(config);
    		$scope.formData.productstockconfig = config;
    		
    		$scope.arry_goodsspecification=[];
    		
    		for(var i=0; i<$scope.specOption.length; i++){
    			var obj={};
    			if($scope.specOption[i].checked==true){
    				obj.specificationid=$scope.specOption[i].specificationid;
    				obj.specificationname=$scope.specOption[i].specificationname;
    				for(var j=0; j<$scope.specOption[i].specificationoption.length; j++){
        				if($scope.specOption[i].specificationoption[j].checked == true){
        					obj.specificationoptionid=$scope.specOption[i].specificationoption[j].specificationoptionid;
            				obj.specificationoptionname=$scope.specOption[i].specificationoption[j].specificationoptionname;
        				}
        			}
    				$scope.arry_goodsspecification.push(obj);
    			}
    		}
    		
    		$scope.formData.goods[0].goodsspecification=$scope.arry_goodsspecification;
    		$scope.formData.goods.goodsspecification=$scope.arry_goodsspecification;
    		
    		//多规格
			if($scope.usesku == true){
				$scope.formData.usesku = 2;
				$scope.formData.productspecification = $scope.formData.goods.goodsspecification;
			}
			
    		//新增界面保存操作
    		if($scope.formData.productid == undefined) {
    			
    		var data = { data: angular.toJson($scope.formData)};
    		
	    		$http({
	                method: 'POST',
	                url: "/jsbweb/enterprise/baseline/product/add_product.do",
	                data: $.param(data),
	                headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded'
	                }
	            }).success(function (data) {
	
	                if (data.ret == 0) {
	                    $.jBox.tip('添加成功', 'success');  
	                    $state.go("entry");
	                    
	                } else if(data.ret == 20039) {
	                    $.jBox.tip('添加失败,已经存在相同编码的商品', 'warning');
	                }else{
	                	$.jBox.tip('添加失败', 'warning');
	                }
	
	                if (data.ret == 10) {
	                    $.jBox.tip("请先登录", 'warning');
	                }
	            }).error(function(data){
	                $.jBox.tip("连接服务器失败", "warning");
	            });
    		}else{
    			
    			$scope.formData.productstockconfig.productstockconfigid = $scope.formData.productstockconfigid;
    			
    			//修改时图片的操作
    			var gpZh = [];
    			var goodspictureZh = angular.copy($scope.formData.goodspicture);
    			angular.forEach(goodspictureZh, function (value, key) {
        			switch(value.action)
        			{
        				case "add":
	        				value.action = "add";
	        				value.goodspictureid= 0;
	        				value.goodsid = $scope.formData.productid;
	        				break;
	        				
        				default: value.action = "modify";
        			}
        			gpZh.push(value);
        		});
    			
    			angular.forEach($scope.temp_picture,function(dvalue,dkey){
        			if(dvalue.action=="delete"){
        				gpZh.push(dvalue);
        			}
        		});
    			
    			$scope.formData.goodspicture = gpZh;
    			
    			//修改界面保存操作
    			var tempparameter = [];
    			var resulte = angular.copy($scope.goods);	
        		angular.forEach(resulte, function (value, key) {
        			switch(value.action)
        			{
        				case "add":
	        				value.action = "add";
	        				value.goodsid= 0;
	        				break;
        				default: value.action = "modify";
        			}
        			tempparameter.push(value);
        		});
    			
        		$scope.formData.goods = tempparameter;
        		var data = { data: angular.toJson($scope.formData)};
    			$http({
                    method: 'POST',
                    url: "/jsbweb/enterprise/baseline/product/modify_product.do",
                    data: $.param(data),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (data) {
                	
                    if (data.ret == 0) {
                    	
                        $.jBox.tip("修改成功", 'success');
                        $state.go("entry");
                        
                    } else if (data.ret == 10) {
                        $.jBox.tip("请先登录", 'warning');
                    } else {
                        $.jBox.tip("修改失败", 'warning');
                    }
                }).error(function (rep) {
                    console.log(rep)
                    $.jBox.tip("修改失败", 'warning');
                });
    		}	
    	};
    	
    	//缩略图的图片上传监听
    	$scope.fileChange = function(){
    		$scope.uploadThumb($scope.thumbfiles);
    	};	
    	
    	//多图片的上传监听
        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });
        
        //删除缩略图
        $scope.deleteThumb = function(){
        	//删除图片
			$scope.file = false;
			$scope.goods[0].thumb = '';
        }
        
        //删除图片
        $scope.deletePic = function(pictureIndex){
        	
        	$scope.formData.goodspicture.splice(pictureIndex, 1);
        	
        	angular.forEach($scope.temp_picture, function (value, key) {
    			if(value.pictureIndex ==  pictureIndex){
    				value.action="delete";
    			}
    		});
        }
        
        //缩略图的图片上传
    	$scope.uploadThumb = function (files) {
    	console.warn(files);
    	if (files && files.length) {
    	    for (var i = 0; i < files.length; i++) {
    	        var file = files[i];
    	        Upload.upload({
    	            url: '/jsbweb/base/fileUpload.do',
    	            fields: {'username': $scope.username},
    	            file: file
    	        }).progress(function (evt) {
    	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    	            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
    	        }).success(function (data, status, headers, config) {
    	        	console.log(data);
    	        	$scope.goods[0].thumb = data.data.file;
    	        	$scope.file = true;
    	           // console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
    	        }).error(function(){
    	        	console.log("error");
    	        });
    	    }
    	}
    };
        
        
        //图片上传
    	$scope.upload = function (files) {
    	console.log(files);
    	if (files && files.length) {
    	    for (var i = 0; i < files.length; i++) {
    	        var file = files[i];
    	        Upload.upload({
    	            url: '/jsbweb/base/fileUpload.do',
    	            fields: {'username': $scope.username},
    	            file: file
    	        }).progress(function (evt) {
    	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    	            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
    	        }).success(function (data, status, headers, config) {
    	        	
    	        	if($scope.formData.goodspicture.length > 9){
    	        		$.jBox.tip("图片不能上传超过10张", 'warning');
    	        		return;
    	        	}
    	        	var picture = {};
    	        	picture.pictureurl = data.data.file;
    	        	picture.pictureIndex = $scope.formData.goodspicture.length;
    	        	picture.picturedescription = '';
    	        	picture.action = 'add';
    	        	$scope.formData.goodspicture.push(picture);
    	        	console.warn(picture);
    	           // console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
    	        }).error(function(){
    	        	console.log("error");
    	        });
    	    }
    	}
    };
    
    
    //弹出计量单位模态框
    $scope.onClickShowAddGoodsUnitModel = function(){
        $("#viewModal-add-goodsunit").modal("show");
    };
    
    $scope.modelGoodsUnitData = {};

    //新增计量单位
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
                
                $("#viewModal-add-goodsunit").modal("hide");
                $scope.getGoodsUnit();
            }else if(data.ret == 20002){
            	
            	$.jBox.tip("计量单位名称已存在", 'error');
            }
            else{
                $.jBox.tip("添加计量单位失败", 'error');
            }
        }).error(function(rep){
            console.log(rep)
            $.jBox.tip("添加计量单位失败", 'error');
        });
    };
    
  //弹出分类模态框
    $scope.showGoodsclassifyAddModal=function(){
    	$("#goodsClassifyModal").modal("show");
    };
    
    //新增分类
    
    $scope.addGoodsClassify = function(myForm){
    	
		if($scope.myForm.categoryname == undefined){
			$.jBox.tip('分类名不能为空', 'warning');
			return;
		}
		
		var data = { data: angular.toJson($scope.myForm)};
        $http({
            method : 'POST',
            url : "/jsbweb/enterprise/category/add_category.do",
            data : $.param(data),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {
            if (data.ret == 0) {
                $.jBox.tip("添加成功", 'success');
                
                $("#goodsClassifyModal").modal("hide");
                $scope.getCategory();
            }else{
                $.jBox.tip("添加失败", 'error');
            }
        }).error(function(rep){
            $.jBox.tip("添加失败", 'error');
        });
    };
    
  //弹出规格模态框
    $scope.onClickShowAddGoodsSpecModel = function(){
        $("#viewModal-add-goodsSpec").modal("show");
    };
    
    $scope.specification = [];
	$scope.temp_specification=[]; 
    
  //添加临时参数记录
	$scope.add_record = function () {
		var temp = {};
		temp.specification="";
		temp.action = "add";
		$scope.temp_specification.push(temp);
	};
	$scope.add_record();
	
	//删除临时参数记录
	$scope.delrecord = function (index) {
        $scope.temp_specification.splice(index, 1);
    };
    
  //新增规格 	
	$scope.addFormDataSumbitSpc = function(){
		
		var tempparameter = [];
		
		angular.forEach($scope.temp_specification, function (value, key) {
			tempparameter.push(value);
		});
		
		 if (tempparameter.length == 0) {
             $.jBox.tip('请添加参数名称', 'warning');
             return;
         }
		
		$scope.formData.specificationoption = tempparameter;
		var data = { data: angular.toJson($scope.formData)};
		
    		$http({
                method: 'POST',
                url: "/jsbweb/enterprise/specification/add_specification.do",
                data: $.param(data),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (data) {

                if (data.ret == 0) {
                    $.jBox.tip('添加成功', 'success');  
                    $("#viewModal-add-goodsSpec").modal("hide");
                    $scope.getSpecification();
                } else {
                    $.jBox.tip('添加失败', 'warning');
                }

                if (data.ret == 10) {
                    $.jBox.tip("请先登录", 'warning');
                }
            }).error(function(data){
                $.jBox.tip("连接服务器失败", "warning");
            });
		}
 }]);