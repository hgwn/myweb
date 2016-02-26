var unitApp = angular.module('masgetWebApp.enterprise.unit',[]);
unitApp.controller("unitCtr", [ '$scope', '$http', "$timeout",
		function($scope, $http, $timeout) {		
		//查询
		$http
		.get("/jsbweb/enterprise/unit/listGoodsUnit.do?pagesize=100&pagenum=1")
				.success(function(data) {
					$scope.unit = data.data.rows;
				});
		
		var row = {};
		//新增
		$scope.add=function(){
			var isok= true;
		    row.id ="";
			row.goodsunitname ="";
			row.isok=true;
			if($scope.unit == undefined){
				$scope.unit = [];
			}
			$scope.unit.push(row);
			$scope.$watch(function() {
                return row.goodsunitname;
                
            },function(goodsunitname, oldVal) {
            	row.goodsunitname = goodsunitname
				if (goodsunitname != oldVal) {
					$scope.addunit=function(){
						if(goodsunitname==''){
							$.jBox.tip('计量名称不能为空！', 'warning');
						}else{
						
						$http({
				            method : 'POST',
				            url : "/jsbweb/enterprise/unit/addGoodsUnit.do",
				            data : 'goodsunitname=' + goodsunitname,
				            headers : {
				                'Content-Type' : 'application/x-www-form-urlencoded'
				            }
				        }).success(function(data){
				        	
					        	if (data.ret == 0) {
					        		$.jBox.tip('新增成功', 'success');
					        		setTimeout("location.reload()",1000);
								} else {
									$.jBox.tip('新增失败', 'success');
									setTimeout("location.reload()",1000);
								}
				        	}).error(function(){
				        		$.jBox.tip('操作失败', 'success');
				        		setTimeout("location.reload()",1000);
				        	});
						}
					}
				}
			});
		}
	
		// 删除
		$scope.delItem = function(item) {
			var goodsunitid = item.goodsunitid;
			if(item.goodsunitid == undefined){
				$scope.unit.splice(-1);
			}else{
					$http(
							{
								method : 'POST',
								url : "/jsbweb/enterprise/unit/delete.do",
								data : 'goodsunitid=' + goodsunitid,
								headers : {
									'Content-Type' : 'application/x-www-form-urlencoded'
								}
							}).success(function(data) {
						if (data.ret == 0) {
							$.jBox.tip('删除成功', 'success');
							setTimeout("location.reload()",1000);
						} else {
							$.jBox.tip("删除失败!", 'warning');
						}

					});
				}
		};
} ]);