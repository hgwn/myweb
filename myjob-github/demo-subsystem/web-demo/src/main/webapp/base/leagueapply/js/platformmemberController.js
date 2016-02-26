angular.module('masgetWebApp.leagueapply')
    .controller('platCtr',['$scope', '$state', 'utils','$modal','$alert','$http','$timeout','session','platformData','i18nService',
        function ($scope, $state, utils,$modal,$alert,$http,$timeout,session,platformData,i18nService) {
            $scope.platFlag = false;
            //ui-grid 分页汉化
            i18nService.setCurrentLang('zh-cn');
            //判断是否平台管理员
            angular.forEach(platformData,function(item,key){
                if(session.companyid == item.platformcompanyid && session.stationid == item.platformstationid){
                    $scope.platFlag = true;
                }
            })

            //时间戳的计算
            var dayTime=60*60*24*1000*1;
            var beforeTime=60*60*24*1000*30;
            var backTime=new Date().getTime()+dayTime;
            var backbeTime = new Date().getTime()-beforeTime;

            $scope.plat = {
                screatedtime:new Date(backbeTime).format("yyyy-MM-dd"),
                ecreatedtime:new Date(backTime).format("yyyy-MM-dd"),
                companyname:"",
                enableflag:"",
                pageSize:15,
                pageNum:1
            }

            $scope.Check = function(){
                var obj = {};
                obj.pagenum = $scope.plat.pageNum;
                obj.pagesize = $scope.plat.pageSize;
                if($scope.plat.companyname != null && $scope.plat.companyname != ""){
                    obj.companyname = $scope.plat.companyname;
                }
                if($scope.plat.enableflag != null && $scope.plat.enableflag != ""){
                    obj.enableflag = $scope.plat.enableflag;
                }
                if($scope.plat.screatedtime != null ){
                    obj.screatedtime = $scope.plat.screatedtime;
                }else{
                    obj.screatedtime = new Date(backbeTime).format("yyyy-MM-dd");
                }
                if($scope.plat.ecreatedtime != null ){
                    obj.ecreatedtime = $scope.plat.ecreatedtime;
                }else{
                    obj.ecreatedtime = new Date(backTime).format("yyyy-MM-dd");
                }
                var data ={};
                data.data = JSON.stringify(obj);
                var url = "/jsbweb/base/leagueapply/getplat.do";
                utils.query(url,{method:'POST',data:data}).then(function(resp){
                    $scope.gridOptions.data = resp.data.rows;
                    $scope.gridOptions.totalItems = resp.data.total;
                });
            }
            $scope.Check();

            $scope.gridOptions = {
                //显示table的th
                columnDefs: [
                    { name: '序号',field:'id', width:60,cellTemplate:
                        '<div class="ui-grid-cell-contents" style="text-align:center">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
                    },
                    {name:'操作', field:'',
                        cellTemplate: '<div class="ui-grid-cell-contents">' +
                        '<a ng-if="row.entity.enableflag == 1" href="" ng-click="grid.appScope.platDelete(row.entity)">解盟</a>' +
                        '</div>'
                    },
                    { name: '平台名称',field:'platformname' },
                    { name: '公司名称',field:'companyname'},
                    { name: '站点名称',field:'stationname'},
                    { name: '状态',field:'enableflag',cellTemplate:
                        '<div class="ui-grid-cell-contents">{{grid.appScope.enableflagToName(row.entity.enableflag)}}</div>'
                    },
                    { name: '备注',field:'remark'}
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

            if(!$scope.platFlag){
                $scope.gridOptions.columnDefs = [
                    { name: '平台名称',field:'platformname' },
                    { name: '公司名称',field:'companyname'},
                    { name: '站点名称',field:'stationname'},
                    { name: '状态',field:'enableflag',cellTemplate:
                        '<div class="ui-grid-cell-contents">{{grid.appScope.enableflagToName(row.entity.enableflag)}}</div>'
                    },
                    { name: '备注',field:'remark'}
                ]
            }

            $scope.getPage = function(pagenum, pagesize, orders,orderkey) {
                $scope.plat.pageNum = pagenum
                $scope.plat.pageSize = pagesize;
                $scope.Check();
            };

            $scope.enableflagToName = function(orderstate){
                switch (orderstate){
                    case 1:
                        return "已加盟";
                    case 2:
                        return "解盟";
                    default :
                        return "";
                }
            };

            //解盟
            $scope.platDelete = function(item){
                $scope.platData = angular.copy(item);
                $modal({html:true,scope:$scope,title:"解盟操作",
                        template:'html/leagueapply.modal.html',
                        contentTemplate:'html/plat.modal.html',
                        animation:'am-fade-and-scale',
                        callback:function(a,b,c){
                            $scope.button = true;
                            $scope.iconFlag = 'add';
                            $scope.context = "正在解盟中...";
                            var objAdd = {};
                            var obj = {};
                            $scope.auditArray = new Array();
                            obj.platformmemberid = $scope.platData.platformmemberid;
                            obj.platformid = $scope.platData.platformid;
                            obj.appcompanyid = $scope.platData.companyid;
                            obj.appstationid = $scope.platData.stationid;
                            if($scope.platData.remark != null && $scope.platData.remark !=""){
                                obj.remark = $scope.platData.remark;
                            }
                            $scope.auditArray.push(obj);
                            objAdd.platformmember = $scope.auditArray;
                            var data = {};
                            data.data = JSON.stringify(objAdd);
                            var url = "/jsbweb/base/leagueapply/leave.do";
                            utils.query(url, {method: 'POST', data: data}).then(function (resp) {
                                if (resp.ret == 0) {
                                    $alert({title: '提示：',content: '解盟成功',placement: 'masget-top',duration: 1,type: 'info',show: true });
                                    $scope.iconFlag = '';
                                    $scope.Check();
                                }else{
                                    $alert({title: '提示：',content: '解盟失败',placement: 'masget-top',duration: 1,type: 'info',show: true });
                                }
                                return true;
                            });
                        }
                })
            }
        }
    ])