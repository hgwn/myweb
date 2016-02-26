angular.module('masgetWebApp.schedule').controller("scheduleCtr", ['$scope', '$state', '$timeout', 'joblist', 'joblistHistory', function ($scope, $state, $timeout, joblist, joblistHistory) {

    var date = new Date("2014/7/15"),
        yearOrign = date.getFullYear(),
        monthOrign = date.getMonth() + 1,
        dateOrign = date.getDate();

    var now = new Date(),
        yearNow = now.getFullYear(),
        monthNow = now.getMonth() + 1,
        dateNow = now.getDate();

    $scope.todolistToday = [];
    $scope.todolistForward = [];
    $scope.donelistToday = [];
    $scope.donelistForward = [];

    $scope.historyShow = false;

    $scope.resolve = function (item) {

        $state.go("home.mgchat");
        $state.broadCast = {
            receiver: {
                title: item.context.sendstaffname,
                receiverid: item.context.sendstaffid,
                receiverName: item.context.sendstaffname
            },
            isGrouper: false,
            isSchedule: true,
            src: item.context.linkurl
        };

        $scope.$emit('chatWithSomebody', {
            content: {
                contactid: item.context.sendstaffid,
                contactname: item.context.sendstaffname,
                isSchedule: true,
                src: item.context.linkurl
            }
        });

    };

    $.each(joblist, function (key, item) {
        var item_time = new Date(item.createdtime),
            item_year = item_time.getFullYear(),
            item_month = item_time.getMonth() + 1,
            item_date = item_time.getDate();
        if (typeof item.context == "string")
            item.context = eval("(" + item.context + ")");
        if (item_year <= yearNow && item_month <= monthNow && item_date < dateNow) {
            $scope.todolistForward.push(item);
        } else {
            $scope.todolistToday.push(item);
        }
    });

    $.each(joblistHistory, function (key, item) {
        var item_time = new Date(item.createdtime),
            item_year = item_time.getFullYear(),
            item_month = item_time.getMonth() + 1,
            item_date = item_time.getDate();
        if (typeof item.context == "string")
            item.context = eval("(" + item.context + ")");
        if (item_year <= yearNow && item_month <= monthNow && item_date < dateNow) {
            $scope.donelistForward.push(item);
        } else {
            $scope.donelistToday.push(item);
        }
    });

    $scope.todolistpanels = [
        {
            "title": "今天",
            "active": true,
            "list": $scope.todolistToday
        },
        {
            "title": "更早",
            "active": true,
            "list": $scope.todolistForward
        }
    ];

    $scope.donelistpanels = [
        {
            "title": "今天",
            "active": true,
            "list": $scope.donelistToday
        },
        {
            "title": "更早",
            "active": true,
            "list": $scope.donelistForward
        }
    ];
    $scope.todolistpanels.activePanel = [0, 1];
    $scope.donelistpanels.activePanel = [0, 1];

    $scope.$on("messageArrived", function (event, data) {
        if (data.msgtype != 6) return;
        $scope.$apply(function () {
            $scope.todolistpanels[0].list.push({subject: data.msg});
        })

    })
}])