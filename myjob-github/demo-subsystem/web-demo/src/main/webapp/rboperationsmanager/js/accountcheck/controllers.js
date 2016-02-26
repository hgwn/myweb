angular.module('masgetWebApp.accountCheck').controller('accountCheckCtr', ['$scope', '$rootScope', 'Upload', '$state', 'i18nService', 'utils', function ($scope, $rootScope, Upload, $state, i18nService, utils) {
        i18nService.setCurrentLang("zh-cn");
        utils.query("/masgetweb/base/accountCheck/get.do?type=unionPay").then(function (resp) {
            $.each(resp.data.rows, function (key, item) {
                item.id = item.companyid;
                item.text = item.companyname;
            });
            $scope.nAwardcompanys = resp.data.rows;
        });

        $scope.$watch('nAwardcompanyid', function (newval, oldval) {
            if (!!newval)
                utils.query("/masgetweb/base/accountCheck/get.do?type=acquiringBank", {
                    method: 'post',
                    data: {
                        awardcompanyid: $scope.nAwardcompanyid
                    }
                }).then(function (resp) {
                    $.each(resp.data.rows, function (key, item) {
                        item.id = item.acquirerinfoid;
                        item.text = item.acquirebank;
                    });

                    $scope.nAcquirercompanys = resp.data.rows;
                });
        });


        utils.query("/masgetweb/base/accountCheck/get.do?type=clearingHouse").then(function (resp) {
            $.each(resp.data, function (key, item) {
                item.id = item.acquirebankid;
                item.text = item.acquirebank;
            });

            $scope.nSettlementcompanys = resp.data;
        });

        $scope.nObjectTypes = [
            {
                id: 1, text: '四川衫德'
            },
            {
                id: 2, text: '重庆衫德'
            },
            {
                id: 3, text: '湖北卡友'
            },
            {
                id: 4, text: '湖北中行'
            },
            {
                id: 5, text: '辽宁拉卡拉'
            },
            {
                id: 6, text: '宁波银商'
            }
        ]

        $scope.toResult = function () {
            $state.go("home.accountCheck.result");
        }

        $scope.ZSUMfileChange = function (file) {
            if (file && file.length > 0)
                Upload.upload({
                    url: 'base/accountCheck/upload.do',
                    file: file
                }).progress(function (evt) {

                }).success(function (data, status, headers, config) {
                    $scope.sZumFile = data.data.path+data.data.fileName;
                }).error(function (data, status, headers, config) {

                })
        };

        $scope.ACOMAfileChange = function (file) {
            if (file && file.length > 0)
                Upload.upload({
                    url: 'base/accountCheck/upload.do',
                    file: file
                }).progress(function (evt) {

                }).success(function (data, status, headers, config) {
                    $scope.sAcomaFile = data.data.path+data.data.fileName;
                }).error(function (data, status, headers, config) {

                })
        };


        $scope.submit = function(){
            utils.query("/masgetweb/base/accountCheck/submit.do",{method:'post',data:{
                nAwardcompanyid:$scope.nAwardcompanyid,
                nAcquirercompanyid:$scope.nAcquirercompanyid,
                nSettlementcompanyid:$scope.nSettlementcompanyid,
                sBegintime:$scope.sBegintime.Format("yyyy-MM-dd"),
                sEndtime:$scope.sEndtime.Format("yyyy-MM-dd"),
                nObjectType:$scope.nObjectType,
                sZumFile:$scope.sZumFile,
                sAcomaFile:$scope.sAcomaFile,
                sSavePath:'download/accountCheck',
                sPreUrl:window.location.origin+window.location.pathname
            }}).then(function(resp){
                $state.go("home.accountCheck.result");
                $state.broadCast = {
                    formData:{
                        nAcquirercompanyName:$('[name="nAcquirercompanyid"]').text(),
                        nSettlementcompanyName:$('[name="nSettlementcompanyid"]').text(),
                        nAwardcompanyName:$('[name="nAwardcompanyid"]').text(),
                        sBegintime:$scope.sBegintime.Format("yyyy-MM-dd hh:mm:ss"),
                        sEndtime:$scope.sEndtime.Format("yyyy-MM-dd hh:mm:ss")
                    },
                    result:resp.data
                }
            });
        }
    }]
).controller('accountCheckResultCtr', ['$scope', '$rootScope', '$state', 'utils', function ($scope, $rootScope, $state, utils) {
        $scope.result = $state.broadCast.result;
        $scope.form = $state.broadCast.formData;

        $scope.backTo = function () {
            $state.go("home.accountCheck.check");
        };

        $scope.ACOMADifference = {
            data: $scope.result.acoma,
            useExternalPagination: true,
            useExternalSorting: false,
            enableColumnResizing: true,
            enableRowSelection: true,
            enableSelectAll: true,
            enableColumnMenus: true,
            enableSorting: true,
            selectionRowHeaderWidth: 35,
            paginationPageSizes: [10, 25, 50, 75],
            paginationPageSize: 10,
            //点击展开时触发
            expandableRowCallBack: function (sc) {

            },
            onRegisterApi: function (gridApi) {

            },
            paginationPageSize: 10,
            //显示table的th
            columnDefs: [
                /* { name: '操作',cellTemplate: '<div class="btn-group text-center" style="padding: 2px;" role="group" aria-label="..."><button type="button" class="btn btn-sm btn-default" style="padding:3px 10px;" ng-click="grid.appScope.editItem(row);">编辑</button><button type="button" class="btn btn-sm btn-default" style="padding:3px 10px;" ng-click="grid.appScope.deleteItem(row);">删除</button></div>' ,cellClass:function(){
                 return 'text-center';
                 }},*/
                { name: '流水号', field: 'unionpaydealid' },
                { name: '商户名称', field: 'membername' },
                { name: '卡号', field: 'bankcardno' },
                { name: '商户编号', field: 'merchantnumber' },
                { name: '终端号', field: 'terminalnumber' },
                { name: '交易金额', field: 'transactionamount' },
                { name: '商户清算资金', field: 'merchantstoliquidatefundsmoney' },
                { name: '手续费', field: 'creditcardfeerate' },
                { name: '收单收益', field: 'acquirebankmoney' },
                { name: '荣邦收益', field: 'masgetprofitmoney' },
                { name: '银联收益', field: 'unionpayfeeratemoney' },
                { name: '发卡收益', field: 'cardbankfeeratemoney' }
            ]
        };

        $scope.clearDifference = {

            data: $scope.result.settlement,
            useExternalPagination: true,
            useExternalSorting: false,
            enableColumnResizing: true,
            enableRowSelection: true,
            enableSelectAll: true,
            enableColumnMenus: true,
            enableSorting: true,
            selectionRowHeaderWidth: 35,
            paginationPageSizes: [10, 25, 50, 75],
            paginationPageSize: 10,
            //点击展开时触发
            expandableRowCallBack: function (sc) {

            },
            onRegisterApi: function (gridApi) {

            },
            paginationPageSize: 10,
            //显示table的th
            columnDefs: [
                /* { name: '操作',cellTemplate: '<div class="btn-group text-center" style="padding: 2px;" role="group" aria-label="..."><button type="button" class="btn btn-sm btn-default" style="padding:3px 10px;" ng-click="grid.appScope.editItem(row);">编辑</button><button type="button" class="btn btn-sm btn-default" style="padding:3px 10px;" ng-click="grid.appScope.deleteItem(row);">删除</button></div>' ,cellClass:function(){
                 return 'text-center';
                 }},*/
                { name: '流水号', field: 'unionpaydealid' },
                { name: '商户名称', field: 'membername' },
                { name: '卡号', field: 'bankcardno' },
                { name: '商户编号', field: 'merchantnumber' },
                { name: '终端号', field: 'terminalnumber' },
                { name: '交易金额', field: 'transactionamount' },
                { name: '商户清算资金', field: 'merchantstoliquidatefundsmoney' },
                { name: '手续费', field: 'creditcardfeerate' },
                { name: '收单收益', field: 'acquirebankmoney' },
                { name: '荣邦收益', field: 'masgetprofitmoney' },
                { name: '银联收益', field: 'unionpayfeeratemoney' },
                { name: '发卡收益', field: 'cardbankfeeratemoney' }
            ]
        };

    }]
)