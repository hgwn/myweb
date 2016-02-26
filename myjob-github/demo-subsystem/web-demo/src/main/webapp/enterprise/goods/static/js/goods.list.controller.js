
goodsModule.controller('goodslistController', ['$scope','$http','utils','$rootScope',
		function($scope, $http,utils,$rootScope) {
	
		$scope.formData = {};
		$scope.formData.pagesize = 5;
		$scope.formData.pagenum = 1;
		$scope.goodslist = {};
		$scope.currentPage = 1;
		$scope.numPages = [];
		$scope.pageSize = 5;
		
		//默认查询
		$http({
            method : 'POST',
            url :"/jsbweb/enterprise/goods/list.do",
            data : $.param($scope.formData),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {
        	$scope.goodslist = data;
        }).error(function(){
			console.log("error.....");
		});
		
		//条件查询
		$scope.isActive = true;
        $scope.queryGoods=function(order,orderkey){
			$scope.isActive = false;
        	if(order !=null && orderkey !=null){
       		var orders = [];
        		orders.push(order);
        		$scope.formData.orders = JSON.stringify(orders);
        		$scope.formData.orderkey = orderkey;
        	}
        	
            $http({
                method : 'POST',
                url :"/jsbweb/enterprise/goods/list.do",
                data : $.param($scope.formData),
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
            }).success(function(data) {
            	$scope.goodslist = data;
            	console.log("条件查询结果...")
            	console.log($scope.goodslist);
            }).error(function(){
				console.log("error.....");
			});
        };
      
	    //默认为升序
	    $scope.shopPriceSortFlag = "asc"; 
	    $scope.creatTimeSortFlag = "asc"; 
	    
		//默认排序事件
		$scope.goodsDefaultSort = function(){
			$scope.removeSortClass();
			$scope.queryGoods("createdtime","desc");
		};
		
		//售价排序事件
		$scope.shopPriceSort = function(){
			if($scope.shopPriceSortFlag == "asc"){
				 $scope.removeSortClass();
		         $("#shopPriceSortClassId").addClass("glyphicon glyphicon-arrow-down");
		         $scope.shopPriceSortFlag="desc";
			}
			else{
				$scope.removeSortClass();
		         $("#shopPriceSortClassId").addClass("glyphicon glyphicon-arrow-up");
		         $scope.shopPriceSortFlag="asc";
			}
			$scope.queryGoods("shopprice", $scope.shopPriceSortFlag);
			
		};
		
		//上架时间排序事件
		$scope.creatTimeSort = function(){
			if($scope.creatTimeSortFlag == "asc"){
				 $scope.removeSortClass();
		         $("#creatTimeSortClassId").addClass("glyphicon glyphicon-arrow-down");
		         $scope.creatTimeSortFlag="desc";
			}
			else{
				$scope.removeSortClass();
		         $("#creatTimeSortClassId").addClass("glyphicon glyphicon-arrow-up");
		         $scope.creatTimeSortFlag="asc";
			}
			$scope.queryGoods("createdtime", $scope.creatTimeSortFlag);
		};
		
		//清除排序按钮的箭头图标
	    $scope.removeSortClass = function(){
	        $("#shopPriceSortClassId").removeClass();
	        $("#creatTimeSortClassId").removeClass();
	    };
	    
	    
	    $http.get('/jsbweb/base/getSession.do').success(function(data){
	    	$scope.getSession = data;
	    	 var companyid = $scope.getSession.companyid;
    	 //查询商品分类
	 	    $scope.searchClass = function(){
	 			$http.get("searchclass.do?companyid="+companyid)
	 			.success(function(data) {
	 				//$scope.goodsClass = data;
	 				var classify = utils.arrayDataToTree(data.data.rows,'companygoodsclassifyid', 'parentid', "0", 0);
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
	 				$scope.goodsClass = array;	
	 			}).error(function(resp){
	 				console.log("error.....");
	 			});
	 		}
	 		$scope.searchClass();
	    });
	    
	  // 删除商品
        $scope.delGoods=function(item){
        	goodsid = parseInt(item.goodsid);
	    	var ary = [];
	    	var temp ={};
	    	temp.goodsid = goodsid;
	    	ary.push(temp);
	    	var data = {goods:JSON.stringify(ary)};
        	var submit = function (v, h, f) {
                if (v == 'ok') {
                    $.jBox.tip("正在删除数据...", 'loading');
                    $http({
                        method : 'POST',
                        url : "/jsbweb/enterprise/goods/del_goods.do",
                        data:$.param(data),
                        headers : {
                            'Content-Type' : 'application/x-www-form-urlencoded'
                        }
                    }).success(function(data) {

                        if(data.ret==0){
                            $.jBox.tip('删除成功', 'success');
                            $scope.queryGoods("createdtime","desc");
                        }

                        if(data.ret==10){
                            $.jBox.tip("请先登录", 'warning');
                        }
                    });
                }
                return true; //close
            };
            $.jBox.confirm("确定要删除商品名称为："+item.goodsname+" 的数据 吗？", "温馨提示", submit);
        };
	   
        //编辑商品
        /*$scope.editGoods = function(item){
        	goodsid = parseInt(item.goodsid);
        	console.log("商品id:"+goodsid);
        }*/

}]);


