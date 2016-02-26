angular.module('masgetWebApp.buzcircle').controller('buzCircleGroupCtr',['$scope', '$state', '$modal', 'buzcircle', 'utils','$sce','$popover','$timeout',
    function ($scope, $state, $modal, buzcircle, utils,$sce,$popover,$timeout) {
        if(!$state.broadCast){
            return;
        }
        $scope.buzCircleInfo = $state.broadCast.buzCircleInfo;
        $scope.title = $scope.buzCircleInfo.commercialcirclename;
        $scope.showFlag = true;
        $scope.showAdd = $scope.buzCircleInfo.staffid == $scope.session.staffid ? true : false;

        $scope.toggleGroup = function (event) {
            $scope.showFlag = !$scope.showFlag
            $(event.target).toggleClass("masget-downArrow");
        }

        $scope.editBuzCircle = function () {
            $state.go("home.buzcircle_edit", {path: $scope.buzCircleInfo.commercialcircleid});
            $state.broadCast = {type:"edit",items:$scope.items,buzCircleInfo:$scope.buzCircleInfo};
        };

        $scope.modifyNickName = function(item){
            $scope.nickName = item.staffnickname;
            $modal({callback: function (element,msg) {
                utils.httpGet("/jsbweb/buzCircle.do?type=modify&formData="+JSON.stringify({
                    commercialcircleid:$scope.buzCircleInfo.commercialcircleid,
                    commercialcirclemember:[{
                        commercialcirclememberid:item.commercialcirclememberid,
                        staffid:item.staffid,
                        staffnickname:$scope.nickName,
                        permission:3,
                        action:'modify'
                    }]
                }),function(resp){
                    item.staffnickname = $scope.nickName;
                    $alert('修改成功');
                })
            },
                scope:$scope,
                html: true,
                title: '修改商圈成员名片',
                template: 'modal/modal.confirm.tpl.html',
                contentTemplate: 'buzCircle/modifyName.tpl.html'
            });
        }


        $scope.deleteMember = function(memberid){
            $modal({callback: function (element,msg) {
                utils.query("/jsbweb/buzCircle.do?type=deleteMember&commercialcirclememberid="+JSON.stringify([memberid])).then(function(resp){
                    if(resp.ret == 0){
                        $scope.items = utils.removeFromArrayByKeyValue($scope.items,'commercialcirclememberid',memberid);
                        $alert('成功删除!');
                    }
                })
            },
                scope:$scope,
                html: true,
                title: '提示',
                template: 'modal/modal.confirm.tpl.html',
                content: '确定删除？'
            });
        };

        $scope.$on("renderFinished",function(event,data){
            utils.httpGet("/jsbweb/buzCircle.do?type=getmember&commercialcircleid=" + $scope.buzCircleInfo.commercialcircleid, function (resp) {
                if(resp.ret == 0){
                    $scope.items = resp.data.rows;
                }
            });
        });

    }])