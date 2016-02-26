var subGoodstockModule = angular.module('subgoodsstock', [
    "util.pagination"
]);

subGoodstockModule.controller("goodstockListController",
    ['$scope', '$http', '$stateParams', '$state', function ($scope, $http, $stateParams, $state) {

        //定义表单数据对象
        $scope.formData = {};
        $scope.formData.pagesize=10;
        $scope.goodstock = {};

        $scope.enableflags = [
            { id: 1, value: "可用" },
            { id: 2, value: "不可用" }
        ];

        $scope.selectedItem = {};                           // 当前树选中节点
        $scope.options = {};
        $scope.treelist = [];								// 树

        $scope.toggle = function (item) {
            item.toggle();
        };
        //// 移除树节点
        //$scope.remove = function (item) {
        //    item.remove();
        //};
        //// 添加树节点
        //$scope.newSubItem = function (item) {
        //    var nodeData = item.$modelValue;
        //    nodeData.items.push({
        //        id: nodeData.id * 10 + nodeData.items.length,
        //        title: nodeData.title + '.' + (nodeData.items.length + 1),
        //        items: []
        //    });
        //};

        //加载数据源汇总
       /* $http.get("/jsbweb/enterprise/com/get_goodsstock.do?pagesize=10&pagenum=1&orders=goodsstockid&orderkey=asc")
            .success(function (data) {
                $scope.goodstocks = data;
                if (data.ret == 10) {
                    $.jBox.tip("请先登录", 'warning');
                }
            });*/
        
        //查询站点下所有仓库信息
        
        $http.get("/jsbweb/enterprise/com/query_goodsstock.do?pagesize=10&pagenum=1")
        .success(function (data) {
            $scope.goodstocks = data;
            if (data.ret == 10) {
                $.jBox.tip("请先登录", 'warning');
            }
            console.log("站点下所有仓库信息...");
            console.log(data);
        });
        
        
        // 加载树
         $http.get("/jsbweb/base/stationdatum/getrecusive.do?stationtypeid=3")
            .success(function (data) {
                console.warn(data);
                if (data.ret == 10) {
                    $.jBox.tip("请先登录", 'warning');
                    return;
                }
                if (data.ret == 0) {
                	console.log(data);
                    if (data.rows.length == 0) {
                        $scope.treelist = [{
                            "id": 0,
                            "title": "当前站点",
                            "items": []
                        }];
                    }
                    else {
                        $scope.treelist = data.rows;
                    }
                }
                else {
                    $scope.treelist = [{
                        "id": 0,
                        "title": "当前站点",
                        "items": []
                    }];
                }
            }).error(function (data) {
                $scope.treelist = [{
                    "id": 0,
                    "title": "当前站点",
                    "items": []
                }];
            });

        $scope.tree_check = function (item) {
            $scope.selectedItem = item;
            console.log("测试....")
            console.warn($scope.selectedItem);
            $scope.formData.warehouseid=$scope.selectedItem.id;
            $scope.queryForm();
        };

        //查询
        $scope.queryForm = function () {
            /*if ($scope.selectedItem != null && $scope.selectedItem != undefined && $scope.selectedItem.id != 0) {
                $scope.formData.warehouseid = $scope.selectedItem.id;
            }

            $scope.formData.orders = 'goodsstockid';
            $scope.formData.orderkey = 'asc';
*/
            $http({
                method: 'POST',
                url: "/jsbweb/enterprise/com/query_goodsstock.do",
                data: $.param($scope.formData),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (data) {
                if(data.ret==0){
                	 $scope.goodstocks = data;
                }
                else if(data.ret==10){
                	$.jBox.tip('请先登陆!','warning');
                }
                else{
                	$.jBox.tip('获取数据失败!','warning');
                }
            }).error(function (data) {
                $.jBox.tip(data.message, 'warning');
            });
        };

        //编辑
        $scope.edit = function (goodstock) {
            $scope.goodstock = goodstock;
        };

        $scope.submit = function () {

            $http({
                method: 'POST',
                url: "/jsbweb/enterprise/com/modify_goodsstock.do",
                data: $.param($scope.goodstock),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (data) {
                if (data.ret == 0) {
                    $.jBox.tip("修改成功", 'info');
                } else {
                    $.jBox.tip(data.message, 'info');
                }
                $('#myModal').modal('hide');
            });

        };
    }]);


