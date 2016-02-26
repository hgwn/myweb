/*
 * 添加商品页面    李鸿文   2015-05-28 
 * */

var goodsAdd = angular.module('masgetWebApp.goodsAdd');
goodsAdd.controller('fileUploadCtr', ['$scope', '$rootScope','Upload','utils','$modal','$alert', function ($scope, $rootScope, Upload,utils,$modal,$alert) {
	$scope.pics=[];
	$scope.replaceFiles="";
    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });
    
    $scope.$watch('replaceFiles', function () {
        $scope.updatePic($scope.replaceIndex,$scope.replaceFiles);
    });
    
    //删除图片
    $scope.deletePic = function(picIndex){
    	
    	$.jBox.confirm("确定要删除 吗？", "温馨提示", function(v, h, f){
            if(v == "ok"){
            	$scope.formdata.goodspicture.splice(picIndex, 1);
            	$scope.$digest();

            }
            return true;
        });    	 	
    }
    
    //图片上传
	$scope.upload = function (files) {
	console.log(files);
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
	        	picture.pictureIndex = $scope.formdata.goodspicture.length;
	        	picture.picturedescription = '';
	        	$scope.formdata.goodspicture.push(picture);
	           // console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
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
		        	var picture = {};
		        	picture.pictureurl = data.data.file;
		        	picture.pictureIndex = $scope.formdata.goodspicture.length;
		        	picture.picturedescription = '';
		        	$scope.formdata.goodspicture[picIndex].pictureurl = picture.pictureurl
		        }).error(function(){
		        	console.log("error");
		        });
		    }
		}
	}
}]);

//var app = angular.module('form-example1', []);
var INTEGER_REGEXP = /^\-?\d*$/;
goodsAdd.directive('integer', function() {
    return {
        require : 'ngModel',
        link : function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                if (INTEGER_REGEXP.test(viewValue)) {
                    ctrl.$setValidity('integer', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('integer', false);
                    return undefined;
                }
            });
        }
    };
});

//商品类目
goodsAdd.controller('goodsAddCategoryCtr', ['$scope', '$state','utils','$modal','$http',function ($scope, $state, utils,$modal,$http) {
	
	//加载一级商品类目
	$scope.categorylist = [];       //定义商品类目数组
	$scope.categoryAttrib = [];     //定义商品非销售属性 数组
	$scope.categorySKUAttrib = [];  //定义商品销售属性数组
	$scope.formdata.companygoodsattrib = $scope.categoryAttrib;
	$scope.cateflag = false;
		$http.get("category.do?parentid=0")
		.success(function(response) {
			$scope.categorylist.push(response.data);
			//console.log(response);
		}).error(function(){
			console.log("error.....");
		});
		
		//select onchang事件  下拉联动
		$scope.categoryOnSelect=function(category){
			//$scope.cateflag = false;
			
			$scope.categoryAttrib_flag = false;  //设置商品非销售属性是否显示的 标志  默认为false 
			$scope.categorySKUAttrib_flag = false; //设置商品销售属性是否显示的 标志  默认为false 
			$scope.goodsspec_flag = false;         //设置商品规格是否显示的标志 默认为false
			for(var i=0; i<$scope.categorylist.length; i++){
				if($scope.categorylist[i].selected == category){
					var j = $scope.categorylist.length-i;
						//console.log(j + ":" + i);
						$scope.categorylist.splice(i+1, j);
						
				}
				
			}
			console.log("dd:"+$scope.categorylist[$scope.categorylist.length-1].selected);
			//根据parentid查询下一级
			$http.get("category.do?parentid="+category)
			.success(function(response) {
				if(response.data.total != 0){
					$scope.categorylist.push(response.data);
					
				}
				else{
					
					$scope.getCategoryAttrib(category);
				}
				
			}).error(function(){
				console.log("error.....");
			});

		}
		
		//根据parentid，查询商品类目属性
		$scope.getCategoryAttrib = function(categoryid){
			console.log("111:"+categoryid)
			$scope.formdata.categoryid = categoryid; //赋值
			
			//debugger;
			$scope.categorySKUAttrib.splice(0,$scope.categorySKUAttrib.length);
			$scope.categoryAttrib.splice(0,$scope.categoryAttrib.length);  
			$http.get("categoryattrib.do?categoryid="+categoryid)
			.success(function(response) {
				//console.log("查询商品类目属性....")
				//console.log(response);
				if(response.data.total==0){
					$scope.goodsspec_flag = true;   
				}
				for(var index=0; index<response.data.rows.length; index++){
					var row = response.data.rows[index];
					if(row.inputtype != 1){//属性输入类型1-手动输入 2-单选
						var properties = row.attribproperties.split(",");  //销售属性值
						
						row.properties = properties;
						row.attribproperties = "";
					}
					if(row.attribtype != 3){ //非销售属性
						$scope.categoryAttrib.push(row);
						$scope.categoryAttrib_flag = true;
					}
					else{ //销售属性 
						row.attribproperties = row.attribsid;
						$scope.categorySKUAttrib.push(row);
						$scope.categorySKUAttrib_flag = true;
					}
				}
				
			}).error(function(){
				console.log("error.....");
			});
		}
		$scope.goodssku=[];
		$scope.goodssku_id = 0;
		//新增
		$scope.formdata.goodssku = $scope.goodssku;
		$scope.h_addRow = function(){
			var sku = {};
			sku.id = $scope.goodssku_id++;
			var properties = [];
			sku.selected_properties = {};
			for(var i=0; i < $scope.categorySKUAttrib.length; i++){
				if($scope.categorySKUAttrib[i].ddchecked){
					var tempproperties_row = {};
					sku.selected_properties[$scope.categorySKUAttrib[i].attribproperties] = "";
					tempproperties_row.attribsid = $scope.categorySKUAttrib[i].attribsid;
					tempproperties_row.attribtype = $scope.categorySKUAttrib[i].attribtype;
					tempproperties_row.attribname = $scope.categorySKUAttrib[i].attribname;
					tempproperties_row.attribproperties = "";
					
					properties.push(tempproperties_row);
				}
			}
			sku.tempproperties = $scope.categorySKUAttrib;
			sku.properties = properties; 
			$scope.goodssku.push(sku);

		}
		//删除
		$scope.h_delRow = function(id){
			$scope.id =id;
			for(var i =0; i<$scope.goodssku.length;i++){
				if($scope.goodssku[i].id == id){
			    	 					
				$scope.goodssku.splice(i,1);//删除sku
				}
			}
			//提示询问框
		/*	$modal({html:true,scope:$scope,title:"提示",content:"确定要删除数据吗？",template:'modal/modal.confirm.tpl.html',animation:'am-fade-and-scale',callback:function(){
				for(var i =0; i<$scope.goodssku.length;i++){
					if($scope.goodssku[i].id == id){
				    	 					
					$scope.goodssku.splice(i,1);//删除sku
					}
				}
			}});*/
			
			console.log($scope.goodssku)
		}
    }]);

//查询商品分类 
goodsAdd.controller('goodsAddClassCtr', ['$scope', '$state','utils','$http',function ($scope, $state, utils,$http) {
	
	var ObjaddClass ={};
	
	$scope.searchClass = function(){
		$http.get("searchclass.do?companyid="+utils.session.data.companyid)
		.success(function(data) {
	
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
			//console.log($scope.goodsClass);
			
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

//商品单位
goodsAdd.controller('goodsUnitCtr', ['$scope', '$state','$http',function ($scope, $state, $http) {
	

	$scope.tempgoodsunit = {};
	//获取单位商品数据
	 $scope.getGoodsUnit = function(){
         $http({
             method : 'GET',
             url : "/jsbweb/enterprise/goodsunit/get.do"
         }).success(function(data) {
        	 console.log("获取单位商品数据.....")
             console.log(data)

             if(data.ret == 0){
                 $scope.goodsunit = data.data.rows;
                 
             }
         });
     };
     
     $scope.getGoodsUnit();
	
        $scope.modelGoodsUnitData = {};
        
        //新增商品单位
        $scope.addGoodsUnit = function(){
        	if($scope.modelGoodsUnitData.goodsunitname==undefined||$scope.modelGoodsUnitData.goodsunitname==""){
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
                    $("#viewModal-add-goodsunit").modal("hide");
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
        
        $scope.init = function(){
            $scope.getGoodsUnit();

            $scope.$watch(function() {
                return $scope.formdata.goodsunit;
            }, function(newVal, oldVal) {
            	if(newVal==null) return;
                $scope.formdata.goodsunitid = newVal.goodsunitid;
            });

        };
        
        $scope.init();
        
        $scope.onClickShowGoodsUnitModel = function(){
            $("#goodsUnit-viewModal").modal("show");
        };
        
}]);

