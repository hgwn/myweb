//相当于整个应用程序的入口
angular.module('masgetWebApp', [
    //下方增加依赖模块
    //演示模块
    'masgetWebApp.goodsAdd',
    'ngMessages',
    'masgetWebApp.utils.service',
    'ngFileUpload',
    'mgcrea.ngStrap',
    'ui.router',
    'ngAnimate',
    'ui.select','ngSanitize'
])

    .run(
    [          '$rootScope', '$state', '$stateParams','$http', '$sce', 'utils', '$modal','$alert','$timeout','$window',
        function ($rootScope, $state, $stateParams,$http, $sce, utils, $modal,$alert,$timeout,$window) {

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            
            $rootScope.formdata = {
            		goodsname:'',  //商品名称
            		description:'', //商品描述
            		companygoodsclassifyid:'', //商品分类
            		categoryid:'', //商品类目
            		brandid:'0', //默认为0
            		virtualflag:'1',
            		barcode:'',  //条形码
            		marketprice:'',//市场价
            		shopprice:'', //售价
            		goodspicture:[
//            		              { 
//            			pictureurl:"http://localhost:8080/jsbweb/static/img/base/contact.jpg",
//            			pictureindex:0,
//            			picturedescription:''
//            		}
            		],
            		goodssku:[], //sku 
            		companygoodsattrib:[],  //商品属性（非销售属性）
            		isCommitted:false  //表单提交标识，默认为否
            };
            
            
            //表单提交
            $rootScope.accountShow = function () {
            	$rootScope.formdata.isCommitted = true;
            	if($rootScope.addgoodsForm.$invalid){
            		$.jBox.tip("请检查输入的数据是否正确！", 'error');
            		return;
            	}
            	
            	
            	//goodsskun 赋值
            	var tem_attribproperties = {};
            	for(i=0;i<$rootScope.formdata.goodssku.length;i++){
            		var tempGookssku = $rootScope.formdata.goodssku[i]; //Object1
            		var temp_properties = tempGookssku.properties;
            		var temp_selected_properties = tempGookssku.selected_properties;
            		for(var x=0;x<temp_properties.length;x++){
            			temp_properties[x].attribproperties = temp_selected_properties[temp_properties[x].attribsid];
            		}
            	}
            	console.log(temp_properties);
            	
            	//过滤 companygoodsattrib空值
            	for(i=0; i<$rootScope.formdata.companygoodsattrib.length;i++){
            		
            		if($rootScope.formdata.companygoodsattrib[i].attribproperties == ""){
            			 delete $rootScope.formdata.companygoodsattrib[i]["attribproperties"]; 
            		}
            	}
            	//delete $rootScope.formdata.goodsunit;
            	console.log("提交添加商品数据.....")
            	console.log($rootScope.formdata);
            	var data = {data:JSON.stringify($rootScope.formdata)};
            	$http({
        	        method  : 'POST',
        	        url     : 'goodsFormData.do',
        	        data    : $.param(data),  // pass in data as strings
        	        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
        	    }).success(function(data) {
    	            console.log(data);
    	            if(data.ret == 0){
    	            	$.jBox.tip("添加商品成功！", 'success');
    	            	//$alert({title: '提示：', content: '商品添加成功！', placement: 'masget-top',duration:2, type: 'info', show: true});
    	            	$timeout(function(){
    						$window.location.reload();
    					},2000);
    	            	
    	            }else{
    	            	//$alert({title: '提示：', content: '商品添加失败！', placement: 'masget-top',duration:2, type: 'info', show: true});
    	            	$.jBox.tip("添加商品失败!",'error');
    	            }
    	        }).error(function(resp){
    	    		console.log("error.....");
    	    	});
            }

        }
    ]
)

    .config(
    [          '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider
              .otherwise('/home');

        }
    ]
);
