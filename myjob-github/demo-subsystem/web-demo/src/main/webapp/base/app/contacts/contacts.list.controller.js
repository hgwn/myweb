angular.module('masgetWebApp.contacts').controller('contactsListCtr',['$scope', '$state', 'contacts', '$modal','$popover','$sce','$timeout','utils', function ($scope, $state, contacts,$modal,$popover,$sce,$timeout,utils) {
    if ($state.broadCast) {
        $scope.title = angular.isDefined($state.broadCast) ? $state.broadCast.title : '';
        $scope.count = $state.broadCast.count;
        $scope.items = angular.isArray($state.broadCast.items) ? $state.broadCast.items : [];
        $scope.showAdd = $state.broadCast.showAdd == false ? $state.broadCast.showAdd : true;
        $state.broadCast.showAdd = true;
        $scope.currentGroup = $state.broadCast.currentGroup;
    }
    $scope.findFriends = function () {
        $state.broadCast = {items: $scope.items};
        $state.broadCast.currentGroup = $scope.currentGroup;
        $state.go("home.contacts_find");
    }

    $scope.showFlag = true;
    $scope.toggleGroup = function (event) {
        $scope.showFlag = !$scope.showFlag
        $(event.target).toggleClass("masget-downArrow");
    }

    $scope.contactDetail = function(item){
        var scope = $state.broadCast.currentNodeScope;
        var index = $scope.items.indexOf(item);
        var target = $("[ng-id='"+index+"']",scope.$element.next());
        scope.$nodeScope.expand();
        $timeout(function(){
            target.click();
            $timeout(function(){
                target.focus();
                $scope.resetScrollBar();
            })
        })
    }

    $scope.deleteItem = function (item) {
        $modal({callback: function (element,msg) {

            if(item.isGroup){
                if (item.saasaddressgrouptypeid == 1){
                    $alert('您没有权限删除该分组');
                    return;
                }

                utils.query("/jsbweb/contacts.do?type=deleteGroup&addressgroupid=" + item.addressgroupid).then(function (resp) {
                    if (resp.ret == 0) {
                        $scope.items = utils.removeFromArrayByKeyValue(item.parent.nodes, 'addressgroupid', item.addressgroupid);
                        item.parent.nodes = $scope.items;
                        $alert('成功删除分组！');
                    }
                });
            }else{
                var contactlist = [
                    {addresslistid: item.addresslistid, contactid: item.contactid}
                ];
                if(item.platformuser == 2){
                    utils.query("/jsbweb/contractor.do?type=delete&contractorinfoid="+item.contractorinfoid).then(function(resp){
                        $alert('删除成功！');
                        $scope.items= utils.removeFromArrayByProperty($scope.items, item, "contactid");
                        $state.broadCast.currentGroup.nodes = $scope.items;
                    })
                }else{
                    utils.httpGet("/jsbweb/contacts.do?type=deletePerson&contactlist=" + JSON.stringify(contactlist), function (resp) {
                        $alert('删除成功！');
                        $scope.items= utils.removeFromArrayByProperty($scope.items, item, "contactid");
                        $state.broadCast.currentGroup.nodes = $scope.items;                  })
                }

            }

        },
            scope:$scope,
            html: true,
            title: '提示',
            template: 'modal/modal.confirm.tpl.html',
            content: '确定删除？'
        });
    }

}])