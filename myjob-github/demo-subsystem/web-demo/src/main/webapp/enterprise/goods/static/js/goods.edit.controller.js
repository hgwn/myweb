//商品编辑页面 总控制器
goodsModule.controller('goodseditController', ['$scope','$http','utils','$rootScope','$state','$timeout',
		function($scope, $http,utils,$rootScope,$state,$timeout) {
	
		//定义数据对象
		$scope.formdata = {
				isCommitted:false
		};
		
		$scope.categoryAttrib = [];     //定义商品非销售属性 数组
		$scope.categorySKUAttrib = [];  //定义商品销售属性数组
		
		$scope.goodsku = {};           //定义sku对象
		$scope.goodsku.oldsku = [];    //定义原有的sku数组
		$scope.goodsku.newsku = [];    //定义新增的sku数组
		
		$scope.goodspicture = {};              //定义图片对象
		$scope.goodspicture.oldpicture = [];   //定义原有图片数组
		$scope.goodspicture.newpicture = [];   //定义新增图片数组
	    //将获取当前编辑商品的数据 赋值给 formdata
		$scope.formdata = $rootScope.editGoodsData;
		console.log("图片.....");
		console.log($scope.formdata.goodspicture);
		
		$scope.goodspicture.oldpicture = $scope.formdata.goodspicture;
		
		//设置原有的图片action值为modify
		if($scope.goodspicture.oldpicture){
			for(var i=0; i<$scope.goodspicture.oldpicture.length; i++){
				$scope.goodspicture.oldpicture[i].action="modify";
				$scope.goodspicture.oldpicture[i].picIndex = 99+i;
			}
		}
		
		$scope.formdata.goodsunit ={
				goodsunitid : $scope.formdata.goodsunitid,
				goodsunitname: $scope.formdata.goodsunitname
		}
		
		
		
		console.log("...获取编辑商品数据.....");
		console.log($scope.formdata);
		
		//提交编辑商品数据
		$scope.goodseditSubmit = function(){
			$scope.formdata.isCommitted = true;
        	if($scope.goodseditForm.$invalid){
        		$.jBox.tip('请检查输入的数据是否正确!', 'warning');
        		return;
        	}
        	$scope.formdata.goodsunitid = $scope.formdata.goodsunit.goodsunitid;
        	$scope.formdata.goodsunitname = $scope.formdata.goodsunit.goodsunitname;
        	//console.log("...商品属性.....")
        	//console.log($scope.categoryAttrib);
        	$scope.formdata.companygoodsattrib = $scope.categoryAttrib;   //商品属性
        	
        	
        	
        	console.log("old");
        	console.log($scope.goodspicture.oldpicture);
        	console.log("new");
        	console.log($scope.goodspicture.newpicture);
        	console.log("...合并.....");
        	$scope.formdata.goodspicture = $scope.goodspicture.oldpicture.concat($scope.goodspicture.newpicture);
        	console.log($scope.formdata.goodspicture);
        	
        	//return;
        	
        	//new sku 赋值
        	var tem_attribproperties = {};
        	for(i=0;i<$scope.goodsku.newsku.length;i++){
        		var tempGookssku = $scope.goodsku.newsku[i]; //Object1
        		var temp_properties = tempGookssku.properties;
        		var temp_selected_properties = tempGookssku.selected_properties;
        		for(var x=0;x<temp_properties.length;x++){
        			temp_properties[x].attribproperties = temp_selected_properties[temp_properties[x].attribsid];
        		}
        	}
        	
        	$scope.formdata.goodssku = $scope.goodsku.oldsku.concat($scope.goodsku.newsku);         //原有的sku+ 新增的sku (销售属性  )
        	
        	
        	$("#goodseditBtn").button("loading");
        	console.log(".....提交编辑商品数据......");
			console.log($scope.formdata);
        	var data = {data:JSON.stringify($scope.formdata)};
        	$http({
    	        method  : 'POST',
    	        url     : 'edit_modifygoods.do',
    	        data    : $.param(data), 
    	        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
    	    }).success(function(data) {
	            if(data.ret == 0){
	            	$.jBox.tip('编辑商品成功!', 'success');
	            	
	            	$timeout(function(){
	            		$state.go('list');
	            	},2000);
	            }
	            else if(data.ret == 10){
	            	$.jBox.tip('请先登陆!','warning');
	            }
	            else{
	            	$.jBox.tip('编辑商品失败!', 'warning');
	            }
	            $("#goodseditBtn").button("reset");
	        }).error(function(resp){
	    		console.log("error.....");
	    		 $("#goodseditBtn").button("reset");
	    	});
		}
		
		
		$scope.modelAddGoodsClassifyData = {};
		
		
		//获取单位商品数据
		 $scope.getGoodsUnit = function(){
	         $http({
	             method : 'GET',
	             url : "/jsbweb/enterprise/goodsunit/get.do"
	         }).success(function(data) {
	             if(data.ret == 0){
	                 $scope.goodsunit = data.data.rows;
	             }
	         });
	     };
	     
	     $scope.getGoodsUnit();
	     $scope.modelGoodsUnitData = {};
		 //新增商品单位
        $scope.addGoodsUnit = function(){
        	if($scope.modelGoodsUnitData.goodsunitname==null||$scope.modelGoodsUnitData.goodsunitname==""){
        		$.jBox.tip("商品计量单位名称不能为空", 'error');
        		return;
        	}
            $http({
                method : 'POST',
                url : "/jsbweb/enterprise/goodsunit/add.do",
                data : $.param({goodsunitname : $scope.modelGoodsUnitData.goodsunitname}),
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
            }).success(function(data) {
            	console.log("新增商品单位...")
                console.log(data)
                if (data.ret == 0) {
                    $.jBox.tip("添加计量单位成功", 'success');
                    $scope.getGoodsUnit();
                    $("#goodsEditUnit-viewModal").modal("hide");
                }
                else if(data.ret ==20002){
                	 $.jBox.tip("商品计量单位名称已存在", 'error');
                }
                else{
                    $.jBox.tip("添加计量单位失败", 'error');
                }
            }).error(function(rep){
                console.log(rep)
                $.jBox.tip("添加计量单位失败", 'error');
            });
        };
        
        $scope.onClickShowGoodsUnitModel = function(){
    		$("#goodsUnit-viewModal").modal("show");
    	}

}]);

//商品分类控制器
goodsModule.controller('goodsEditClassCtr',['$scope','$http','utils','$state','$timeout',function($scope, $http,utils,$state,$timeout){
	//获取商品分类数据
	$scope.searchClass = function(){
		$http.get("/jsbweb/enterprise/goodsclassify/get.do")
		.success(function(data) {
			//console.log("...商品分类.");
			//console.log(data);
			var classify = utils.arrayDataToTree(data.data.rows,'companygoodsclassifyid', 'parentid', "0", 0);
			var array = [];
			//console.log(classify);
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
			$scope.goodsClass = array;	
	
		}).error(function(resp){
			console.log("error.....");
		});
	}
	
	$scope.searchClass();
	
	//添加商品分类
	$scope.goodsClassAddSubmit = function(){
		
		if(!$scope.add_companygoodsclassify_parentid){
			$.jBox.tip("上级分类不能为空", 'error');
			return;
		}
		else if(!$scope.add_companygoodsclassify_companygoodsclassifyname) {
			$.jBox.tip("分类名称不能为空", 'error');
			return;
		}
		
		$http({
	        method  : 'GET',
	        url     : 'goodsClassAdd.do?'+'parentid=' + $scope.add_companygoodsclassify_parentid 
	        		+ '&companygoodsclassifyname=' + $scope.add_companygoodsclassify_companygoodsclassifyname,
	        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
	    })
	        .success(function(data) {
	        	$.jBox.tip("添加商品分类成功", 'success');
	            $scope.searchClass();
	            $('#hmodal-container').modal('hide');
	        }).error(function(resp){
	    		console.log("error.....");
	    	});
	}
	
}]);

// 商品类目、销售属性控制器  goodsEditCategoryCtr

goodsModule.controller('goodsEditCategoryCtr',['$scope','$http','utils','$state','$timeout',function($scope, $http,utils,$state,$timeout){
	
	//赋值商品类目id
	var categoryid =  $scope.formdata.categoryid;
	
	//根据parentid，查询商品类目属性
	$scope.getCategoryAttrib = function(categoryid){
		$http.get("categoryattrib.do?categoryid="+categoryid)
		.success(function(response) {
			for(var index=0; index<response.data.rows.length; index++){
				var row = response.data.rows[index];
				if(row.inputtype != 1){//属性输入类型1-手动输入    2-单选
					var properties = row.attribproperties.split(",");  //销售属性值
					row.properties = properties;
					delete row.attribproperties;
				}
				if(row.attribtype != 3){ //非销售属性(商品属性)
					$scope.categoryAttrib.push(row);
					
				}
				else{ //销售属性 
					row.attribproperties = row.attribsid;
					$scope.categorySKUAttrib.push(row);
					
				}
			}
			
			//将获取当前编辑商品的数据 销售属性值  赋值给 categorySKUAttrib数组
			for(var i=0; i<$scope.formdata.companygoodsattrib.length; i++){
				//console.log($scope.formdata.companygoodsattrib[i].attribname);
				var temp_attribname =  $scope.formdata.companygoodsattrib[i].attribname;
				var temp_attribproperties = $scope.formdata.companygoodsattrib[i].attribproperties;
				for( var x=0; x<$scope.categoryAttrib.length; x++){
					$scope.categoryAttrib[x].action="modify";
					if($scope.categoryAttrib[x].attribname == temp_attribname){
						$scope.categoryAttrib[x].attribproperties = temp_attribproperties;
					}
				}
			}
			
			
			//$scope.categoryAttrib.action="modify";
			if($scope.oldsku[0].tempproperties){
				var tempproperties = $scope.oldsku[0].tempproperties;
				for(var index=0; index < tempproperties.length; index++){
					for(var y=0; y < $scope.categorySKUAttrib.length; y++){
						if(tempproperties[index].attribsid == $scope.categorySKUAttrib[y].attribsid){
							$scope.skuattribs.push($scope.categorySKUAttrib[y]);
						}
					}
				}
			}
			
			
			//console.log("销售属性....");
			//console.log($scope.categorySKUAttrib);
			
		}).error(function(){
			console.log("error.....");
		});
	}
	
	//新增一行
	$scope.h_addRow = function(){
		var sku = {};
		sku.action="add";
		sku.id = $scope.goodssku_id++;
		sku.price = "";
		sku.barcode ="";
		sku.skuname = "";
		var properties = [];
		sku.selected_properties = {};
		console.log("....22222.....");
		console.log($scope.skuattribs);
		for(var i = 0; i<$scope.skuattribs.length; i++){
			var tempproperties_row = {};
			sku.selected_properties[$scope.skuattribs[i].attribproperties] = "";
			tempproperties_row.attribsid = $scope.skuattribs[i].attribsid;
			tempproperties_row.attribtype = $scope.skuattribs[i].attribtype;
			tempproperties_row.attribname = $scope.skuattribs[i].attribname;
			properties.push(tempproperties_row);
		}
		sku.properties = properties; 
		sku.tempproperties = $scope.skuattribs;
		$scope.goodssku.push(sku);
		$scope.goodsku.newsku = $scope.goodssku;
		
		//console.log(".....新增sku....");
		//console.log($scope.goodssku);

	}
	
	
	//删除
	$scope.h_delRow = function(id){
		for(var i =0; i<$scope.goodssku.length;i++){
			if($scope.goodssku[i].id == id){
				$scope.goodssku.splice(i,1);//删除sku
			}
		}
	}
	
	//显示原有的sku数据
	$scope.getoldsku = function(){
		if(!$scope.oldsku) return;
		for(var i=0; i<$scope.oldsku.length; i++){
			var arr_properties = JSON.parse($scope.oldsku[i].properties);
			$scope.oldsku[i].tempproperties = arr_properties;
			$scope.oldsku[i].action="modify";
			delete $scope.oldsku[i].properties; 
		}
		console.log("oldsku....");
		console.log($scope.oldsku);
		$scope.goodsku.oldsku = $scope.oldsku;
	}
	
	$scope.init = function(){
		$scope.goodssku = [];
		$scope.oldsku = $scope.formdata.goodssku;
		$scope.goodssku_id = 0;
		$scope.skuattribs = [];
		$scope.getoldsku();
		$scope.getCategoryAttrib(categoryid);
		
	}
	
	$scope.init();
}]);

//编辑图片控制器  picUploadCtr

goodsModule.controller('picUploadCtr',['$scope','$http','Upload',function($scope,$htttp,Upload){
	
	$scope.pics=[];
	$scope.replaceFiles="";
	$scope.$watch('replaceFiles', function () {
	        $scope.updatePic($scope.replaceIndex,$scope.replaceFiles);
	    });
	 
    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });
  //删除图片
    $scope.deletePic = function(picIndex){    	
    	$.jBox.confirm("确定要删除 吗？", "温馨提示", function(v, h, f){
            if(v == "ok"){
            console.log("....44...");	
            console.log(picIndex);
            console.log($scope.formdata.goodspicture[picIndex]);
           	$scope.formdata.goodspicture.splice(picIndex, 1);
            //$scope.formdata.goodspicture[picIndex].action = 'delete';
           //	if($scope.goodspicture.oldpicture)
            	$scope.$digest();

            }
            return true;
        });    	 	
    }
    
    //新增图片上传
	$scope.upload = function (files) {
	if (files && files.length) {
	    for (var i = 0; i < files.length; i++) {
	        var file = files[i];
	        Upload.upload({
	            url: '../../base/fileUpload.do',
	            fields: {'username': $scope.username},
	            file: file
	        }).progress(function (evt) {
	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
	        }).success(function (data, status, headers, config) {
	        	console.log(data);
	        	var picture = {};
	        	picture.pictureurl = data.data.file;
	        	picture.pictureIndex  = $scope.goodspicture.newpicture.length;
	        	picture.picturedescription = '';
	        	$scope.goodspicture.newpicture.push(picture);
	        	for(var index=0; index<$scope.goodspicture.newpicture.length;index++){
	        		$scope.goodspicture.newpicture[index].action = "add";
	        	}
	            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
	        }).error(function(){
	        	console.log("error");
	        });
	    }
	}
	};
   
	
	//替换图片
	$scope.updatePic = function(picIndex,files){
		if (files && files.length) {
		    for (var i = 0; i < files.length; i++) {
		        var file = files[i];
		        Upload.upload({
		            url: '../../base/fileUpload.do',
		            file: file
		        }).success(function (data, status, headers, config) {
		        	console.log("updatePic...")
		        	console.log(data);
		        	var picture = {};
		        	picture.pictureurl = data.data.file;
		        	if($scope.goodspicture.oldpicture[0].action=="modify"){
		        		picture.pictureIndex = $scope.goodspicture.oldpicture.length;
			        	picture.picturedescription = '';
			        	$scope.goodspicture.oldpicture[picIndex].pictureurl = picture.pictureurl;
			        	$scope.goodspicture.oldpicture[picIndex].action = 'modify';
		        	}
		        	
		        
		        }).error(function(){
		        	console.log("error");
		        });
		    }
		}
	}
	
}]);
