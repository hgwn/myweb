angular.module('masgetWebApp.Faccount')
    .controller('payaccountController',['$scope', '$state', 'utils','$modal','$alert','$http','$timeout','$window','session','uiGridConstants','i18nService',
        function ($scope, $state, utils,$modal,$alert,$http,$timeout,$window,session,uiGridConstants,i18nService) {
            $scope.session = session;
            if($state.broadCast != undefined){
                $scope.payData = $state.broadCast.item;
                $scope.payFlag = true;
            }else{
                $scope.payFlag = false;
            }
            //ui-grid 分页汉化
            i18nService.setCurrentLang('zh-cn');

            var dayTime=60*60*24*1000*30;
            var afTime=60*60*24*1000*1;
            var backTime=new Date().getTime()-dayTime;
            var afterTime=new Date().getTime()+afTime;
            $scope.payModel={
                begincreatedtime:new Date(backTime).format("yyyy-MM-dd"),
                endcreatedtime:new Date(afterTime).format("yyyy-MM-dd"),
                pagesize:15,
                pagenum:1,
                watertype:''
            }

            //收支明细查询
            $scope.check = function(){
                var obj = {
                    pagesize:$scope.payModel.pagesize,
                    pagenum:$scope.payModel.pagenum
                }
                if($scope.payFlag){
                    obj.objectid = $scope.payData.objectid;
                }
                obj.watertype = parseInt($scope.payModel.watertype);
                obj.begincreatedtime = $scope.payModel.begincreatedtime;
                obj.endcreatedtime = $scope.payModel.endcreatedtime;
                obj.objectname = $scope.payModel.objectname;
                var url = "/jsbweb/enterprise/FundAccount/waterget.do"
                utils.query(url,{method:'POST',data:{data:JSON.stringify(obj)}},true).then(function(resp){
                    angular.forEach(resp.data.rows,function(item,key){
                        if(item.watertype == 4 || item.watertype == 5 || item.watertype == 6){
                            item.income = item.amount;
                        }else{
                            item.pay = item.amount;
                        }
                    })
                    $scope.gridOptions.data = resp.data.rows;
                    $scope.gridOptions.totalItems = resp.data.total;
                },function(resp){
                    console.info(resp);
                });
            }
            $scope.check();

            $scope.gridOptions = {
                //显示table的th
                columnDefs: [
                    { name: '序号',field:'id', width:60,cellTemplate:
                        '<div class="ui-grid-cell-contents" style="text-align:center">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
                    },
                    { name: '流水号',field:'waternum'},
                    { name: '日期',field:'updatetime',
                        sort: {
                            direction: uiGridConstants.DESC,
                            priority: 1
                        }
                    },
                    { name: '摘要',field:'',
                        cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.watertypeToName(row.entity.watertype)}}</div>'
                    },
                    { name: '收款',field:'income'},
                    { name: '付款',field:'pay'},
                    { name: '余额',field:'usablebalance'},
                    { name: '充值凭证',field:'changedesc'}
                ],
                paginationPageSizes: [5, 10, 15,20,25,50,100],
                paginationPageSize: 15,
                useExternalPagination: true,
                enableGridMenu: true,
                enableColumnMenus: false,
                onRegisterApi: function(gridApi){
                    $scope.gridApi = gridApi;
                    $scope.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        if($scope.getPage) {
                            $scope.getPage(newPage, pageSize);
                        }
                    });
                }
            };

            if(!$scope.payFlag){
                $scope.gridOptions.columnDefs = [
                    { name: '序号',field:'id', width:60,cellTemplate:
                        '<div class="ui-grid-cell-contents" style="text-align:center">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
                    },
                    { name: '流水号',field:'waternum'},
                    { name: '经销商名称',field:'objectname'},
                    { name: '日期',field:'updatetime',
                        sort: {
                            direction: uiGridConstants.DESC,
                            priority: 1
                        }
                    },
                    { name: '摘要',field:'watertype',
                        cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.watertypeToName(row.entity.watertype)}}</div>'
                    },
                    { name: '收款',field:'income'},
                    { name: '付款',field:'pay'},
                    { name: '余额',field:'usablebalance'},
                    { name: '备注',field:'changedesc'}
                ]
            }

            $scope.watertypeToName = function(orderstate){
                switch (orderstate){
                    case 1:
                        return "提现";
                    case 2:
                        return "支付付款";
                    case 3:
                        return "转账付款";
                    case 4:
                        return "充值";
                    case 5:
                        return "支付收款";
                    case 6:
                        return "转账收款";
                    default :
                        return "";
                }
            };

            $scope.getPage = function(pagenum, pagesize, orders,orderkey) {
                $scope.payModel.pagenum = pagenum
                $scope.payModel.pagesize = pagesize;
                $scope.check();
            };

            //返回资金账户
            $scope.reset = function(){
                $state.go('list');
            }

        }
    ])
