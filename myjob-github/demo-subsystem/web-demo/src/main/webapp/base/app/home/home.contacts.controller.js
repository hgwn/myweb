angular.module('masgetWebApp.home').controller('contactsCtr', ['$scope', '$state', '$popover', '$sce', '$timeout', '$rootScope', 'groupData', '$modal','utils', '$q', '$treeView',
    function ($scope, $state, $popover, $sce, $timeout, $rootScope, groupData, $modal, utils, $q, $treeView) {

        $scope.contacts = utils.arrayDataToTree(groupData, "addressgroupid", "addressgrouppid", "0", 0, {});
        $scope.menuEnum = {addGroup: "addGroup", renameGroup: "renameGroup", delGroup: "delGroup", addPerson: "addPerson", getCompany: 'getCompany', modifyCompany: 'modifyCompany', addStation: 'addStation', getStation: 'getStation', delStation: 'delStation', addStaff: 'addStaff', editStation: 'editStation'}
        $scope.isSysGroup = true;
        $scope.searchInput = '';

        var sessionStaffid = $scope.session.staffid;
        var roletypeid = $scope.session.roletypeid;
        var sessionCompanyid = $scope.session.companyid;
        var sessionStationid = $scope.session.stationid;

        //添加按钮的事件
        $scope.add = false;
        $scope.toggle = function (element, event) {
            $scope.add = !$scope.add;
            $(obj).toggleClass(0)
        };

        $scope.addFriends = function () {
            $state.broadCast.showAdd = false;
            $state.go("home.contacts_list", {path: "add"});
        }

        $scope.toBuzCircle = function () {
            $state.go("buzcircle");
        }

        $scope.findFriends = function () {
            $state.go("home.contacts_find");
        }

        $scope.contactsMenuButtonClick = function (node, type) {
            if (type == "renameGroup") {
                $modal({callback: function (element, msg) {
                    utils.httpGet("/jsbweb/contacts.do?type=modifyGroup" + utils.parseRequestData({
                        addressgroupid: node.addressgroupid,
                        addressgrouppid: node.addressgrouppid,
                        addressgroupname: $("#modifyName").val()
                    }), function (resp) {
                        if (resp.ret == 0) {
                            utils.httpGet("/jsbweb/contacts.do?type=group.get", function (resp) {
                                node.addressgroupname = $("#modifyName").val();
                            })
                        } else if (resp.ret == 12) {
                            $alert('重命名失败');
                        }
                    })
                },
                    cancelCallback:function(){

                    },
                    html: true,
                    title: '重命名',
                    template: 'modal/modal.confirm.tpl.html',
                    content: '<div class="input-group"><span class="input-group-addon" id="basic-addon2">分组名称：</span><input id="modifyName" type="text" class="form-control" value="' + node.addressgroupname + '" aria-describedby="basic-addon2"></div>'
                });
            } else if (type == "addGroup") {
                if (node.level >= 2)
                    $alert('该分组下不允许添加分组');
                $scope.addressgrouptypes = [];
                $scope.selectedgrouptype = 0;
                utils.query("/jsbweb/saas.do?type=addressgrouptype&companytypeid="+$scope.session.companytypeid).then(function(resp){
                    $scope.addressgrouptypes = resp.data.rows;
                })
                $modal({callback: function (element, msg) {
                    utils.query("/jsbweb/contacts.do?type=addGroup" + utils.parseRequestData({
                        addressgrouppid: node.addressgroupid,
                        addressgroupname: $("#addGroupName").val(),
                        scenetypeid: node.scenetypeid,
                        saasgrouptypeid:$scope.selectedgrouptype
                    })).then(function (resp) {
                        $scope.addNodes(node, resp.data.rows, "group");
                        $alert('添加成功');
                    });
                },
                    html: true,
                    title: '添加分组',
                    scope:$scope,
                    template: 'modal/modal.confirm.tpl.html',
                    contentTemplate: 'contacts/addGroup.tpl.html'
                });
            } else if (type == "addPerson") {
                $state.go("home.contacts_find", {path: utils.uuid(4, 16)});
                $state.broadCast = {currentGroup: node};
            } else if (type == "delGroup") {
                if (node.saasaddressgrouptypeid == 1){
                    $alert('您没有权限删除该分组');
                    return;
                }

                utils.query("/jsbweb/contacts.do?type=deleteGroup&addressgroupid=" + node.addressgroupid).then(function (resp) {
                    if (resp.ret == 0) {
                        node.parent.nodes = utils.removeFromArrayByKeyValue(node.parent.nodes, 'addressgroupid', node.addressgroupid);
                        $alert('成功删除分组！');
                    }
                });
            } else if (type == 'getCompany') {
                utils.httpGet("/jsbweb/base/companyinfo/getOneCompany.do?companyid=" + node.companyid, function (resp) {
                    if (resp.ret == 0) {
                        $state.broadCast = {item: resp.data[0], type: "check"};
                        $state.go("home.contacts_Company", {path: utils.uuid(4, 16)});
                    } else {
                        console.info("查询失败");
                    }
                })
            } else if (type == 'modifyCompany') {
                if (node.companyid == sessionCompanyid) {
                    utils.httpGet("/jsbweb/base/companyinfo/getOneCompany.do?companyid=" + node.companyid, function (resp) {
                        if (resp.ret == 0) {
                            $state.broadCast = {item: resp.data[0], node: node, type: "edit"};
                            $state.go("home.contacts_Company", {path: utils.uuid(4, 16)});
                        } else {
                            console.info("查询失败");
                        }
                    })
                } else {
                    $alert('此账号没有对该功能进行编辑的权限');
                }
            } else if (type == 'addStation') {
                if (node.companyid == sessionCompanyid) {
                    $state.broadCast = {item: node, node: node, type: "add"};
                    $state.go("home.contacts_Station", {path: utils.uuid(4, 16)});
                } else {
                    $alert('此账号没有对该功能进行编辑的权限');
                }
            } else if (type == 'getStation') {
                utils.httpGet("/jsbweb/base/stationdatum/getOneStation.do?stationid=" + node.stationid, function (resp) {
                    if (resp.ret == 0) {
                        $state.broadCast = {item: resp.data.rows[0], type: "check"};
                        $state.go("home.contacts_Station", {path: utils.uuid(4, 16)});
                    } else {
                        $alert("查询失败");
                    }
                })
            } else if (type == 'delStation') {
                if (node.parent.companyid == sessionCompanyid) {
                    if (node.nodes.length == 0 && node.isLoaded == true) {
                        if (node.sessionStationid != node.stationid) {
                            $modal({title: "提示", content: "确认要删除站点为" + node.stationname + "?", template: 'modal/modal.confirm.tpl.html', animation: 'am-fade-and-scale', callback: function () {
                                utils.httpGet("/jsbweb/base/stationdatum/delete.do?mstationid=" + node.stationid, function (resp) {
                                    if (resp.ret == 0) {
                                        $alert('删除成功');
                                        angular.forEach(node.parent.nodes,function(item,key){
                							if(item.stationid == node.stationid){
                								node.parent.nodes.splice(key,1);
                							}
                						})
                                    } else {
                                        $alert(resp.message);
                                    }
                                })
                            }
                            })
                        } else {
                            $alert('此站点不能删除');
                        }
                    } else {
                        $alert('请检查该站点是否存在员工，如有，则不能删除该站点');
                    }
                } else {
                    $alert('此账号没有对该功能进行编辑的权限');
                }
            } else if (type == 'addStaff') {
                if (node.parent.companyid == sessionCompanyid) {
                    $state.broadCast = {item: node, node: node, type: "add"};
                    $state.go("home.contacts_addStaff", {path: utils.uuid(4, 16)});
                } else {
                    $alert('此账号没有对该功能进行编辑的权限');
                }
            } else if (type == 'editStation') {
                if (node.parent.companyid == sessionCompanyid) {
                    utils.httpGet("/jsbweb/base/stationdatum/getOneStation.do?stationid=" + node.stationid, function (resp) {
                        if (resp.ret == 0) {
                            $state.broadCast = {item: resp.data.rows[0], node: node, type: "edit"};
                            $state.go("home.contacts_Station", {path: utils.uuid(4, 16)});
                        } else {
                            $alert("查询失败");
                        }
                    })
                } else {
                    $alert('此账号没有对该功能进行编辑的权限');
                }
            }

        }

        $scope.$on("renderFinished", function (event, data) {
            if (data.type != "leftBar_contacts") return;
            $scope.treeOptions = {
                color: "#428bca",
                showTags: true,
                showBorder: true,
                showCheckbox: false,
                pageSize: 10,
                multiSelect: false,
                template: 'base/app/common/treeView/contactsTreeView.html',
                data: $scope.contacts,
                $defer: $q,
                scope: $scope,
                isStepByStep: true,
                highlightSearchResults: false,

                // Event handlers
                onNodeInit: function (node) {
                    if (node.level == 1) return;
                    if (node.objecttypeid == 1) {
                        node.isCompany = true;
                    } else if (node.objecttypeid == 2) {
                        node.isStation = true;
                    }
                },
                onNodeCollapsed: function (target, node) {
                    $timeout(function () {
                        $scope.$broadcast("resetScrollBar");
                    });
                },
                onNodeExpanded: function (target, node) {
                    $timeout(function () {
                        $scope.$broadcast("resetScrollBar");
                    });
                },
                onTargetFocused: function (target, node, scope) {

                    var defer = $q.defer();

                    defer.promise.then(function () {
                        if (node.isGroup && node.nodes.length < $scope.treeOptions.pageSize) node.loadedAll = true;
                        if (node.scenetypeid == 1 && node.level == 1 && node.isLoaded) {
                            $state.broadCast = {title: node.addressgroupname, count: node.nodes.length, items: node.nodes};
                            $state.go("home.contacts_organize", {path: utils.uuid(4, 16)});
                            $state.broadCast.currentGroup = node;
                            $state.broadCast.type = "scenetype";
                        } else if (node.isCompany && node.isLoaded) {
                            $state.broadCast = {title: node.addressgroupname, count: node.nodes.length, items: node.nodes};
                            $state.go("home.contacts_organize", {path: utils.uuid(4, 16)});
                            $state.broadCast.currentGroup = node;
                            $state.broadCast.type = "company";
                        } else if (node.isGroup && node.isLoaded) {
                            if (node.isStation) {
                                $state.broadCast = {title: node.addressgroupname, count: node.nodes.length, items: node.nodes};
                                $state.go("home.contacts_organize", {path: utils.uuid(4, 16)});
                                $state.broadCast.currentGroup = node;
                                $state.broadCast.type = "station";
                            } else {
                                $state.broadCast = {title: node.addressgroupname, count: node.nodes.length, items: node.nodes};
                                $state.go("home.contacts_list", {path: node.addressgroupid});
                                $state.broadCast.currentGroup = node;
                                $state.broadCast.currentNodeScope = scope;
                            }

                        }
                    });

                    if (node.isGroup && !node.isLoaded) {
                        if (node.scenetypeid == 1 && node.level == 1) {
                            utils.httpGet("/jsbweb/contacts.do?type=getorganization" + utils.parseRequestData({
                                objecttypeid: 0,
                                pagesize: this.pageSize,
                                pagenum: 1
                            }), function (resp) {
                                if (resp.data.companys) {
                                    $.each(resp.data.companys, function (key, item) {
                                        item.addressgroupname = item.companyname;
                                        item.isGroup = true;
                                        item.isCompany = true;
                                        item.parent = node;
                                        item.level = node.level + 1;
                                    });
                                    node.nodes = resp.data.companys;
                                } else if (resp.data.stations) {
                                    $.each(resp.data.stations, function (key, item) {
                                        item.addressgroupname = item.stationname;
                                        item.isStation = true;
                                        item.isGroup = true;
                                        item.parent = node;
                                        item.level = node.level + 1;
                                    });
                                    node.nodes = resp.data.stations;
                                }
                                node.pagenum = 1;
                                defer.resolve();
                            });
                        } else if (node.isCompany) {
                            utils.httpGet("/jsbweb/contacts.do?type=getorganization" + utils.parseRequestData({
                                objecttypeid: 1,
                                companyid: node.companyid,
                                pagesize: this.pageSize,
                                pagenum: 1
                            }), function (resp) {
                                if (resp.data.companys) {
                                    $.each(resp.data.companys, function (key, item) {
                                        item.addressgroupname = item.companyname;
                                        item.isGroup = true;
                                        item.isCompany = true;
                                        item.parent = node;
                                        item.level = node.level + 1;
                                    });
                                    node.nodes = resp.data.companys;
                                } else if (resp.data.stations) {
                                    $.each(resp.data.stations, function (key, item) {
                                        item.addressgroupname = item.stationname;
                                        item.isStation = true;
                                        item.isGroup = true;
                                        item.parent = node;
                                        item.level = node.level + 1;
                                    });
                                    node.nodes = resp.data.stations;
                                }
                                node.pagenum = 1;
                                defer.resolve();
                            });
                        } else if (node.isStation) {
                            utils.httpGet("/jsbweb/contacts.do?type=getorganization" + utils.parseRequestData({
                                objecttypeid: 2,
                                companyid: node.parent.companyid,
                                stationid: node.stationid,
                                pagesize: this.pageSize,
                                pagenum: 1
                            }), function (resp) {
                                if (resp.data.stations) {
                                    $.each(resp.data.stations, function (key, item) {
                                        item.addressgroupname = item.stationname;
                                        item.isStation = true;
                                        item.isGroup = true;
                                        item.parent = node;
                                        item.level = node.level + 1;
                                    });
                                    node.nodes = resp.data.stations;
                                } else if (resp.data.staffs) {
                                    $.each(resp.data.staffs, function (_key0, _item0) {
                                        _item0.contactname = _item0.staffname;
                                        _item0.isLeaf = true;
                                        _item0.parent = node;
                                        _item0.isStaff = true;
                                        _item0.level = node.level + 1;
                                    });
                                    node.nodes = resp.data.staffs;
                                }
                                node.pagenum = 1;
                                $scope.$tree.refresh();
                                defer.resolve();
                            });
                        } else {
                            utils.httpGet("/jsbweb/contacts.do?type=list.get" + utils.parseRequestData({
                                addressgroupid: node.addressgroupid,
                                pagesize: this.pageSize,
                                pagenum: 1
                            }), function (resp) {
                                $.each(resp.data.rows, function (key, item) {
                                    item.isLeaf = true;
                                    item.level = node.level + 1;
                                    item.parent = node;
                                    if (item.platformuser == 2)
                                        item.tags = ['&nbsp;(非平台用户)']
                                })
                                node.pagenum = 1;
                                node.nodes = resp.data.rows;
                                defer.resolve();
                            });
                        }
                        node.isLoaded = true;
                    } else if (node.isStaff) {
                        utils.httpGet("/jsbweb/base/companystaff/getonestaff.do?staffid=" + node.staffid + "&companyid=" + node.parent.parent.companyid, function (resp) {
                            if (resp.ret == 0) {
                                if (node.parent.parent.companyid == sessionCompanyid) {
                                    if (roletypeid == 1) {
                                        $state.broadCast = {item: resp.data, node: node, sessionStaffid: sessionStaffid, type: "edit"};
                                    } else {
                                        if (sessionStaffid == node.staffid) {
                                            $state.broadCast = {item: resp.data, node: node, sessionStaffid: sessionStaffid, type: "edit"};
                                        } else {
                                            $state.broadCast = {item: resp.data, sessionStaffid: sessionStaffid, type: "check"};
                                        }
                                    }
                                }else{
                                    $state.broadCast = {item: resp.data, sessionStaffid: sessionStaffid, type: "check"};
                                }
                                $state.go("home.contacts_addStaff", {path: utils.uuid(4, 16)});
                            } else {
                                console.info("查询失败");
                            }
                        })
                    } else if (node.isLeaf) {
                        $state.broadCast = {title: node.contactcompanyname, detail: node};
                        $state.go("home.contacts_detail", {path: node.contactid});
                    } else {
                        defer.resolve();
                    }
                },
                onMenuClicked: function (target, node, type) {
                    $scope.isSysGroup = node.addressgrouptypeid == 1 ? true : false;
                    if (node.scenetypeid == 1 && type == "refresh") {
                        $(target).button("loading");
                        $(target).removeClass("glyphicon-refresh");
                        utils.httpGet("/jsbweb/contacts.do?type=getorganization&objecttypeid=0&companyid=" + node.companyid, function (resp) {
                            if (resp.data.companys) {
                                node.isLastGroup = false;
                                $.each(resp.data.companys, function (key, item) {
                                    item.addressgroupname = item.companyname;
                                    item.isGroup = true;
                                    item.isLastGroup = false;
                                    item.level = node.level + 1;
                                    item.parent = node;
                                    item.isCompany = true;
                                });
                                node.nodes = resp.data.companys;
                            } else if (resp.data.stations) {
                                node.isLastGroup = false;
                                $.each(resp.data.stations, function (key, item) {
                                    item.addressgroupname = item.stationname;
                                    item.isLastGroup = true;
                                    item.isStation = true;
                                    item.parent = node;
                                    item.level = node.level + 1;
                                    item.isGroup = true;
                                });
                                node.nodes = resp.data.stations;
                            }
                            node.isLoaded = true;
                            node.state.expanded = true;
                            $timeout(function () {
                                $(target).siblings(".glyphicon-plus").click();
                                $(target).button("reset");
                                $(target).addClass("glyphicon glyphicon-refresh");
                            })
                        });
                    }
                },

                onSearchComplete: function (event, node) {
                },
                onSearchCleared: function (event, node) {
                }
            }

            $scope.contactsUiTree = {
                accept: function (sourceNodeScope, destNodesScope, destIndex) {
                    if (destNodesScope.isParent(sourceNodeScope) || sourceNodeScope.$parentNodesScope.isSibling(destNodesScope)) {
                        return true;
                    } else {
                        return false;
                    }
                },
                beforeDrag: function (sourceNodeScope) {
                    return true;
                },
                dropped: function (event) {
                    return false;
                },
                dragStart: function (event) {
                    return true;
                },
                dragMove: function (event) {
                    return true;
                },
                dragStop: function (event) {
                    return false;
                },
                beforeDrop: function (event, callback) {
                    if(event.dest.nodesScope == event.source.nodesScope){
                        callback&&callback();
                    }else{
                        event.source.nodeScope.$$apply = false;
                        $modal({callback: function (element, msg) {
                            event.source.nodeScope.$$apply = true;
                            utils.query("/jsbweb/contacts.do?type=dragTo"+utils.parseRequestData({
                                addresslistid:event.source.nodeScope.node.addresslistid,
                                addressgroupid:event.dest.nodesScope.node.addressgroupid,
                                contactid:event.source.nodeScope.node.contactid,
                                staffnickname:event.source.nodeScope.node.staffnickname,
                                remark:""
                            })).then(function(resp){
                                callback && callback();
                            });
                        },
                            html: true,
                            title: '重命名',
                            template: 'modal/modal.confirm.tpl.html',
                            content: '确认要移动员工位置？'
                        });
                    }
                }
            }

            $scope.$tree = $treeView($('#contactsTreeView'), $scope.treeOptions);

            $scope.$on("pullToLoadingStart", function () {
                $scope.currentNodeScope.$element.siblings().children(":last").click()
                $timeout(function () {
                    $scope.$broadcast("pullToLoadingEnd");
                }, 1000);
            });

            $scope.loadMoreData = function (node) {
                if (node.loadedAll) return;
                node.isLoading = true;
                var initLength = node.nodes.length;
                var defer = $q.defer();
                defer.promise.then(function () {
                    if (initLength == node.nodes.length || node.nodes.length % $scope.treeOptions.pageSize != 0)
                        node.loadedAll = true;
                    $timeout(function () {
                        node.isLoading = false;
                    }, 1000);
                });
                if (node.scenetypeid == 1 && node.level == 1) {
                    utils.httpGet("/jsbweb/contacts.do?type=getorganization" + utils.parseRequestData({
                        objecttypeid: 0,
                        pagesize: this.pageSize,
                        pagenum: ++node.pagenum
                    }), function (resp) {
                        if (resp.data.companys) {
                            $.each(resp.data.companys, function (key, item) {
                                item.addressgroupname = item.companyname;
                                item.isGroup = true;
                                item.isCompany = true;
                                item.parent = node;
                                item.level = node.level + 1;
                            });
                            node.nodes = resp.data.companys;
                        } else if (resp.data.stations) {
                            $.each(resp.data.stations, function (key, item) {
                                item.addressgroupname = item.stationname;
                                item.isStation = true;
                                item.isGroup = true;
                                item.parent = node;
                                item.level = node.level + 1;
                            });
                            node.nodes = resp.data.stations;
                        }
                        defer.resolve();
                    });
                } else if (node.isCompany) {
                    utils.httpGet("/jsbweb/contacts.do?type=getorganization" + utils.parseRequestData({
                        objecttypeid: 1,
                        companyid: node.companyid,
                        pagesize: $scope.treeOptions.pageSize,
                        pagenum: ++node.pagenum
                    }), function (resp) {
                        if (resp.data.companys) {
                            $.each(resp.data.companys, function (key, item) {
                                item.addressgroupname = item.companyname;
                                item.isGroup = true;
                                item.isCompany = true;
                                item.parent = node;
                                item.level = node.level + 1;
                                node.nodes.push(item);
                            });
                        } else if (resp.data.stations) {
                            $.each(resp.data.stations, function (key, item) {
                                item.addressgroupname = item.stationname;
                                item.isStation = true;
                                item.isGroup = true;
                                item.parent = node;
                                item.level = node.level + 1;
                                node.nodes.push(item);
                            });
                        }
                        defer.resolve();
                    });
                } else if (node.isStation) {
                    utils.httpGet("/jsbweb/contacts.do?type=getorganization" + utils.parseRequestData({
                        objecttypeid: 2,
                        companyid: node.parent.companyid,
                        stationid: node.stationid,
                        pagesize: $scope.treeOptions.pageSize,
                        pagenum: ++node.pagenum
                    }), function (resp) {
                        if (resp.data.stations) {
                            $.each(resp.data.stations, function (key, item) {
                                item.addressgroupname = item.stationname;
                                item.isStation = true;
                                item.isGroup = true;
                                item.parent = node;
                                item.level = node.level + 1;
                                node.nodes.push(item);
                            });

                        } else if (resp.data.staffs && resp.data.staffs.length > 0) {
                            $.each(resp.data.staffs, function (_key0, _item0) {
                                _item0.contactname = _item0.staffname;
                                _item0.isLeaf = true;
                                _item0.parent = node;
                                _item0.isStaff = true;
                                _item0.level = node.level + 1;
                                node.nodes.push(_item0);
                            });
                        }
                        defer.resolve();
                    });
                } else {
                    utils.httpGet("/jsbweb/contacts.do?type=list.get" + utils.parseRequestData({
                        addressgroupid: node.addressgroupid,
                        pagesize: $scope.treeOptions.pageSize,
                        pagenum: ++node.pagenum
                    }), function (resp) {
                        if (resp.data.rows.length > 0) {
                            $.each(resp.data.rows, function (key, item) {
                                item.isLeaf = true;
                                item.level = node.level + 1;
                                item.parent = node;
                                if (item.platformuser == 2)
                                    item.tags = ['&nbsp;(非平台用户)']
                                node.nodes.push(item);
                            });
                        }
                        defer.resolve();
                    });
                }
            };

            $scope.showSearch =false;
            $scope.$watch("searchInput",function(newVal,oldVal){
                if(newVal.length>0){
                    $scope.showSearch =true;
                    $scope.search();
                }else{
                    $scope.showSearch =false;
                }
            });

            $scope.enterToSearch = function(event){
                return event.keyCode == 13?$scope.search():void 0;
            }

            $scope.search = function () {
                $scope.searchResult = [];
                $scope.resultTotalNum = 0;

                $.each($scope.contacts,function(key,item){
                    $scope.searchResult.push({
                        scenetypeid:item.scenetypeid,
                        scenetypename:item.scenetypename,
                        items:[]
                    })
                });
                utils.query("/jsbweb/contacts.do?type=search&staffname="+$scope.searchInput).then(function(resp){
                    $scope.showSearch = true;
                    $.each(resp.data.rows,function(key,item){
                        $.each($scope.searchResult,function(key,_item){
                            if(item.scenetypeid === _item.scenetypeid){
                                _item.items.push(item);
                                $scope.resultTotalNum++;
                                return false;
                            }
                        })
                    })

                })
            };

            $scope.itemMouseOver = function(item){
                item.isHover = true;
            }

            $scope.itemMouseLeave = function(item){
                item.isHover =false;
            }

            $scope.searchResultSelected = function (node) {
                if (node.scenetypeid == 1) {
                    utils.httpGet("/jsbweb/base/companystaff/getonestaff.do?staffid=" + node.staffid + "&companyid=" + node.companyid, function (resp) {
                        if (resp.ret == 0) {
                            if (node.companyid == sessionCompanyid) {
                                if (roletypeid == 1) {
                                    $state.broadCast = {item: resp.data, node: node, sessionStaffid: sessionStaffid, type: "edit"};
                                } else {
                                    if (sessionStaffid == node.staffid) {
                                        $state.broadCast = {item: resp.data, node: node, sessionStaffid: sessionStaffid, type: "edit"};
                                    } else {
                                        $state.broadCast = {item: resp.data, sessionStaffid: sessionStaffid, type: "check"};
                                    }
                                }
                            }
                            $state.go("home.contacts_addStaff", {path: utils.uuid(4, 16)});
                        } else {
                            console.info("查询失败");
                        }
                    })
                } else {
                    $state.broadCast = {title: node.contactcompanyname, detail: node};
                    $state.go("home.contacts_detail", {path: utils.uuid(4, 16)});
                }
            }

            $scope.backToContacts = function(){
                $scope.showSearch =false;
            }

            $scope.addNodes = function (node, toAddNodes, type) {
                if (node.isCompany) {
                    if (type == "company") {
                        $.each(toAddNodes, function (key, item) {
                            item.addressgroupname = item.companyname;
                            item.isGroup = true;
                            item.isCompany = true;
                            item.parent = node;
                            item.level = node.level + 1;
                            node.nodes.push(item);
                        });
                    } else if (type == "station") {
                        $.each(toAddNodes, function (key, item) {
                            item.addressgroupname = item.stationname;
                            item.isStation = true;
                            item.isGroup = true;
                            item.parent = node;
                            item.level = node.level + 1;
                            node.nodes.push(item);
                        });
                    }
                } else if (node.isStation) {
                    if (type == "station") {
                        $.each(toAddNodes, function (key, item) {
                            item.addressgroupname = item.stationname;
                            item.isStation = true;
                            item.isGroup = true;
                            item.parent = node;
                            item.level = node.level + 1;
                            node.nodes.push(item);
                        });
                    } else if (type == "staff") {
                        $.each(toAddNodes, function (_key0, _item0) {
                            _item0.contactname = _item0.staffname;
                            _item0.isLeaf = true;
                            _item0.parent = node;
                            _item0.isStaff = true;
                            _item0.level = node.level + 1;
                            node.nodes.push(_item0);
                        });
                    }
                } else if (type == "group") {
                    $.each(toAddNodes, function (key, item) {
                        item.isGroup = true;
                        item.level = node.level + 1;
                        item.parent = node;
                        node.nodes.push(item);
                    });
                } else if (type == "person") {
                    $.each(toAddNodes, function (key, item) {
                        item.isLeaf = true;
                        item.level = node.level + 1;
                        item.parent = node;
                        if (item.platformuser == 2)
                            item.tags = ['&nbsp;(非平台用户)']
                        node.nodes.push(item);
                    });
                }
            }

            $scope.resetScrollBar = function () {
                $scope.$broadcast("resetScrollBar");
            };
        })

    }])