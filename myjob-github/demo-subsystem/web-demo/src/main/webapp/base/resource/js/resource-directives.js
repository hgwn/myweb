angular.module('masgetWebApp.resource')
.directive('onFinishRenderFilters', function ($timeout, $q, $sce, utils, $state, $popover,$http,Upload) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
        	if(attr.onFinishRenderFilters == "edit"){
                $scope.$watch('files', function () {
                	$scope.upload($scope.files);
            	});
                $timeout(function(){
                	$('#authenModel').combotree({
                		data: [{ "id":1, "text": "读取"},
                		       { "id":2, "text": "创建"},
                		       { "id":3, "text": "编辑"},
                		       { "id":4, "text": "删除"},
                		       { "id":5, "text": "审核"},
                		       { "id":6, "text": "导入"},
                		       { "id":7, "text": "导出"},
                		       { "id":8, "text": "支付"}],
                		       onChange:function(val){
                		    	   var authenText = [];
                		    	   angular.forEach(val,function(authenitem,key){
                		    		   if(authenitem == "1"){
                		    			   authenitem = 'r';
                		    		   }else if(authenitem == "2"){
                		    			   authenitem = 'c';
                		    		   }else if(authenitem == "3"){
                		    			   authenitem = 'u';
                		    		   }else if(authenitem == "4"){
                		    			   authenitem = 'd';
                		    		   }else if(authenitem == "5"){
                		    			   authenitem = 'a';
                		    		   }else if(authenitem == "6"){
                		    			   authenitem = 'i';
                		    		   }else if(authenitem == "7"){
                		    			   authenitem = 'e';
                		    		   }else if(authenitem == "8"){
                		    			   authenitem = 'p';
                		    		   }
                		    		   authenText.push(authenitem);
                		    	   })
                		    	   var auText = authenText.join();
                		    	   $scope.$parent.authen = auText;
                		    	   if($scope.type == "edit"){
                		    		   angular.forEach($scope.EditOsRourceData,function(val,index){
                		    			   if(item.resourceid == val.resourceid && item.authen != val.authen){
                		    				   val.authen = item.authen;
                		    			   }
                		    		   })
                		    	   }
                		       }
                	})
                	
                	$('#authenModel').combotree('setValues',   $scope.authenText);
                })
            }
        }
    };
})