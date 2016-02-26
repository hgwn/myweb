angular.module('masgetWebApp.buzcircle').controller('buzCircleEditCtr', ['$scope', '$stateParams', '$state', '$sce', '$q', 'utils', '$modal', 'groupData', 'buzcircleType', '$popover', '$timeout', '$treeView',
    function ($scope, $stateParams, $state, $sce, $q, utils, $modal, groupData, buzcircleType, $popover, $timeout, $treeView) {

        $scope.selectedbuztype = 2 //商圈类型选择,默认商圈类型：自定义商圈
        $scope.buzcircletype = buzcircleType;

        $scope.contacts = [];
        var treeData = utils.arrayDataToTree(groupData, "addressgroupid", "addressgrouppid", "0", 0,{});

        $scope.type = $state.broadCast.type; //判断新增商圈还是编辑商圈

        if ($scope.type == 'edit') {
            $scope.autoGenerateCircleName = $state.broadCast.buzCircleInfo.commercialcirclename;
            $.each(treeData, function (key, item) {
                if (item.scenetypeid != 1 && item.scenetypeid == $state.broadCast.buzCircleInfo.scenetypeid) {
                    $scope.contacts.push(item);
                }
            })
        } else {
            $.each(treeData, function (key, item) {
                if (item.scenetypeid != 1) {
                    $scope.contacts.push(item);
                }
            })
        }


        $scope.$on("renderFinished", function ($event, data) {
            var forSearchList = '';
            $.each($scope.selectContacts, function (key, item) {
                $.extend(item, {nodeId: item.staffid, nodeName: item.staffnickname});
                forSearchList += '&' + item.staffid;
            });

            $scope.treeOptions = {
                color: "#428bca",
                showTags: true,
                levels: 0,
                showBorder: true,
                showCheckbox: true,
                pageSize:10,
                multiSelect: true,
                scope: $scope,
                template: 'base/app/common/treeView/buzcircleTreeView.html',
                data: $scope.contacts,
                isStepByStep: true,
                collapseGroup: true,
                forSearchList: forSearchList,
                showRightButtons: false,
                highlightSelected: false,
                highlightSearchResults: false,
                // Event handlers
                onNodeInit:function(node){
                    if (node.level == 1) return;
                    if (node.objecttypeid == 1) {
                        node.isCompany = true;
                    } else if (node.objecttypeid == 2) {
                        node.isStation = true;
                    }
                },
                onNodeCollapsed: function (event, node) {
                    if ($scope.type != "add") return;
                    $timeout(function () {
                        $scope.$broadcast("resetScrollBar");
                    },50);
                },
                onNodeExpanded: function (event, node) {
                    var defer = $q.defer();
                    defer.promise.then(function () {
                        if(node.isGroup&&node.nodes.length<$scope.treeOptions.pageSize) node.loadedAll = true;
                        if (node.level == 1 && $scope.scenetypeid != node.scenetypeid) {
                            $scope.oranginContactsTmp = $.extend(true, [], $scope.oranginContacts);
                            $scope.selectContacts = $.extend(true, [], $scope.oranginContacts);
                            if($scope.currentSceneTypeNode)
                            resetSelectedState($scope.currentSceneTypeNode);
                        }

                        if (node.hasOwnProperty("scenetypeid")) {
                            $scope.scenetypeid = node.scenetypeid;
                            $scope.currentSceneTypeNode = node;
                        }

                        $timeout(function () {
                            $scope.$broadcast("resetScrollBar");
                        });
                    });
                    if (node.isGroup && !node.isLoaded) {
                        if(node.scenetypeid == 1&&node.level == 1){
                        utils.httpGet("/jsbweb/contacts.do?type=getorganization"+utils.parseRequestData({
                            objecttypeid:0,
                            pagesize:this.pageSize,
                            pagenum:1
                        }), function (resp) {
                            if (resp.data.companys) {
                                $.each(resp.data.companys, function (key, item) {
                                    item.addressgroupname = item.companyname;
                                    item.isGroup = true;
                                    item.isCompany = true;
                                    item.parent = node;
                                    item.level = node.level+1;
                                });
                                node.nodes = resp.data.companys;
                            } else if (resp.data.stations) {
                                $.each(resp.data.stations, function (key, item) {
                                    item.addressgroupname = item.stationname;
                                    item.isStation = true;
                                    item.isGroup = true;
                                    item.parent = node;
                                    item.level = node.level+1;
                                });
                                node.nodes = resp.data.stations;
                            }
                            node.pagenum=1;
                            defer.resolve();
                        });
                    }else if (node.isCompany) {
                            utils.httpGet("/jsbweb/contacts.do?type=getorganization"+utils.parseRequestData({
                                objecttypeid:1,
                                companyid:node.companyid,
                                pagesize:this.pageSize,
                                pagenum:1
                            }), function (resp) {
                                if (resp.data.companys) {
                                    $.each(resp.data.companys, function (key, item) {
                                        item.addressgroupname = item.companyname;
                                        item.isGroup = true;
                                        item.isCompany = true;
                                        item.parent = node;
                                        item.level = node.level+1;
                                    });
                                    node.nodes = resp.data.companys;
                                } else if (resp.data.stations) {
                                    $.each(resp.data.stations, function (key, item) {
                                        item.addressgroupname = item.stationname;
                                        item.isStation = true;
                                        item.isGroup = true;
                                        item.parent = node;
                                        item.level = node.level+1;
                                    });
                                    node.nodes = resp.data.stations;
                                }
                                node.pagenum=1;
                                defer.resolve();
                            });
                        } else if (node.isStation) {
                            utils.httpGet("/jsbweb/contacts.do?type=getorganization"+utils.parseRequestData({
                                objecttypeid:2,
                                companyid:node.parent.companyid,
                                stationid:node.stationid,
                                pagesize:this.pageSize,
                                pagenum:1
                            }), function (resp) {
                                if (resp.data.stations) {
                                    $.each(resp.data.stations, function (key, item) {
                                        item.addressgroupname = item.stationname;
                                        item.isStation = true;
                                        item.isGroup = true;
                                        item.parent = node;
                                        item.level = node.level+1;
                                    });
                                    node.nodes = resp.data.stations;
                                }else if(resp.data.staffs){
                                    $.each(resp.data.staffs, function (_key0, _item0) {
                                        _item0.contactname = _item0.staffname;
                                        _item0.state = {selected: false};
                                        _item0.isLeaf = true;
                                        _item0.parent = node;
                                        _item0.isStaff = true;
                                        _item0.level = node.level+1;
                                    });
                                    node.nodes = resp.data.staffs;
                                }
                                node.pagenum=1;
                                $scope.$tree.refresh();
                                defer.resolve();
                            });
                        }else{
                            utils.httpGet("/jsbweb/contacts.do?type=list.get"+utils.parseRequestData({
                                addressgroupid:node.addressgroupid,
                                pagesize:this.pageSize,
                                pagenum:1
                            }),function(resp){
                                $.each(resp.data.rows,function(key,item){
                                    item.isLeaf = true;
                                    item.level = node.level+1;
                                    item.parent = node;
                                    if(item.platformuser == 2)
                                        item.tags = ['&nbsp;(非平台用户)']
                                })
                                node.pagenum = 1;
                                node.nodes = resp.data.rows;
                                defer.resolve();
                            });
                        }
                        node.isLoaded = true;
                    }else{
                        defer.resolve();
                    }
                },
                onNodeSelected: function (node) {
                    if (node.isLeaf) {
                        var isExists = false;
                        $.each($scope.oranginContactsTmp, function (key, item) {
                            if (node.contactid == item.staffid && !item.isPushed) {
                                item.isPushed = true;
                                isExists = true;
                                newNode = {twinkle: true, nodeId: node.contactid, nodeName: node.contactname, staffid: node.contactid, companyid: node.contactcompanyid};
                                $scope.selectContacts[key] = newNode;
                                return false;
                            }
                        })
                        if (!isExists) {
                            $scope.selectContacts.push({nodeId: node.contactid, nodeName: node.contactname, staffid: node.contactid, companyid: node.contactcompanyid});
                            if ($scope.type == "add") {
                                $scope.autoGenerateCircleName = utils.joinProperty($scope.selectContacts.length > 3 ? $scope.selectContacts.slice(0, 3) : $scope.selectContacts, "nodeName");
                            }
                        }
                    }
                },
                onNodeUnselected: function (node) {
                    if (node.isLeaf) {
                        $scope.selectContacts = utils.removeFromArrayByKeyValue($scope.selectContacts, 'nodeId', node.contactid);
                        if ($scope.type == "add") {
                            $scope.autoGenerateCircleName = utils.joinProperty($scope.selectContacts.length > 3 ? $scope.selectContacts.slice(0, 3) : $scope.selectContacts, "nodeName");
                        }
                    }
                }
            }

//          $scope.$tree = $('#selectContactsTreeView').treeview($scope.treeOptions);
            $scope.$tree = $treeView($('#selectContactsTreeView'), $scope.treeOptions);

            $scope.$on("pullToLoadingStart", function () {
                $scope.currentNodeScope.$element.siblings().children(":last").click()
                $timeout(function () {
                    $scope.$broadcast("pullToLoadingEnd");
                }, 1000);
            });

            $scope.loadMoreData = function (node) {
                if(node.loadedAll) return;
                node.isLoading = true;
                var initLength = node.nodes.length;
                var defer = $q.defer();
                defer.promise.then(function(){
                    if(initLength == node.nodes.length||node.nodes.length%$scope.treeOptions.pageSize != 0)
                        node.loadedAll = true;
                    $timeout(function(){
                        node.isLoading = false;
                    },1000);
                });
                if(node.scenetypeid == 1&&node.level == 1){
                    utils.httpGet("/jsbweb/contacts.do?type=getorganization"+utils.parseRequestData({
                        objecttypeid:0,
                        pagesize:this.pageSize,
                        pagenum:1
                    }), function (resp) {
                        if (resp.data.companys) {
                            $.each(resp.data.companys, function (key, item) {
                                item.addressgroupname = item.companyname;
                                item.isGroup = true;
                                item.isCompany = true;
                                item.parent = node;
                                item.level = node.level+1;
                            });
                            node.nodes = resp.data.companys;
                        } else if (resp.data.stations) {
                            $.each(resp.data.stations, function (key, item) {
                                item.addressgroupname = item.stationname;
                                item.isStation = true;
                                item.isGroup = true;
                                item.parent = node;
                                item.level = node.level+1;
                            });
                            node.nodes = resp.data.stations;
                        }
                        node.pagenum=1;
                        defer.resolve();
                    });
                }else if(node.isCompany){
                    utils.httpGet("/jsbweb/contacts.do?type=getorganization"+utils.parseRequestData({
                        objecttypeid:1,
                        companyid:node.companyid,
                        pagesize:$scope.treeOptions.pageSize,
                        pagenum:++node.pagenum
                    }), function (resp) {
                        if (resp.data.companys) {
                            if(resp.data.companys.length<$scope.treeOptions.pageSize)
                                node.loadedAll = true;
                            $.each(resp.data.companys, function (key, item) {
                                item.addressgroupname = item.companyname;
                                item.isGroup = true;
                                item.isCompany = true;
                                item.parent = node;
                                item.level = node.level+1;
                                node.nodes.push(item);
                            });
                        } else if (resp.data.stations) {
                            if(resp.data.stations.length<$scope.treeOptions.pageSize)
                                node.loadedAll = true;
                            $.each(resp.data.stations, function (key, item) {
                                item.addressgroupname = item.stationname;
                                item.isStation = true;
                                item.isGroup = true;
                                item.parent = node;
                                item.level = node.level+1;
                                node.nodes.push(item);
                            });
                        }
                        defer.resolve();
                    });
                }else if(node.isStation){
                    utils.httpGet("/jsbweb/contacts.do?type=getorganization"+utils.parseRequestData({
                        objecttypeid:2,
                        companyid:node.parent.companyid,
                        stationid:node.stationid,
                        pagesize:$scope.treeOptions.pageSize,
                        pagenum:++node.pagenum
                    }), function (resp) {
                        if (resp.data.stations) {
                            if(resp.data.stations.length<$scope.treeOptions.pageSize)
                                node.loadedAll = true;
                            $.each(resp.data.stations, function (key, item) {
                                item.addressgroupname = item.stationname;
                                item.isStation = true;
                                item.isGroup = true;
                                item.parent = node;
                                item.level = node.level+1;
                                node.nodes.push(item);
                            });

                        }else if(resp.data.staffs&&resp.data.staffs.length>0){
                            if(resp.data.companys.length<$scope.treeOptions.pageSize)
                                node.loadedAll = true;
                            $.each(resp.data.staffs, function (_key0, _item0) {
                                _item0.contactname = _item0.staffname;
                                _item0.state = {selected: false};
                                _item0.isLeaf = true;
                                _item0.parent = node;
                                _item0.isStaff = true;
                                _item0.state = {expanded: false, selected: false};
                                _item0.level = node.level+1;
                                node.nodes.push(_item0);
                            });
                        }
                        defer.resolve();
                    });
                }else{
                    utils.httpGet("/jsbweb/contacts.do?type=list.get"+utils.parseRequestData({
                        addressgroupid:node.addressgroupid,
                        pagesize:$scope.treeOptions.pageSize,
                        pagenum:++node.pagenum
                    }),function(resp){
                        if(resp.data.rows.length>0){
                            if(resp.data.rows.length<$scope.treeOptions.pageSize)
                            node.loadedAll = true;
                            $.each(resp.data.rows,function(key,item){
                                item.isLeaf = true;
                                item.level = node.level+1;
                                item.parent = node;
                                node.nodes.push(item);
                            });
                        }
                        defer.resolve();
                    });
                }
            }

            $scope.itemMouseOver = function (item) {
                $.each($scope.searchResult, function (key, _item) {
                    if (_item.isKeyOver) {
                        _item.isKeyOver = false;
                    }
                });
            }

            function resetSelectedState(node) {
                if (node.nodes&&node.nodes.length>0) {
                    $.each(node.nodes,function(key,item){
                        resetSelectedState(item);
                    });

                }else{
                    node.selected = false;
                }
            }

            var searchPopover = $popover($("#editBuzcircleSearchInput"), {contentTemplate: 'popover/contacts.searchResult.tpl.html', scope: $scope, html: true, placement: "bottom", trigger: "manual", container: "body"});

            $("#editBuzcircleSearchInput").unbind('keyup');
            $("#editBuzcircleSearchInput").keyup(function (event) {
                var b = document.all ? window.event : event;
                if (13 == b.keyCode) {
                    if (!searchPopover.$isShown) {
                        $scope.search();
                        return;
                    }
                    $.each($scope.searchResult, function (key, item) {
                        if (item.isKeyOver == true) {
                            $scope.searchResultSelected(item);
                        }
                    });
                }
                if (40 == b.keyCode && $scope.searchResult.length > 0) {
                    var isKeyExists = false;
                    var nextKeyToHightLight = false;
                    var index = 0;
                    $.each($scope.searchResult, function (key, item) {
                        if (item.isKeyOver == true) {
                            item.isKeyOver = false;
                            isKeyExists = true;
                            nextKeyToHightLight = true;
                            index = key;
                        } else if (nextKeyToHightLight) {
                            nextKeyToHightLight = false;
                            item.isKeyOver = true;
                            return false;
                        }
                    });
                    if (!isKeyExists || index == ($scope.searchResult.length - 1)) $scope.searchResult[0].isKeyOver = true;
                    $scope.$digest();
                }

                if (38 == b.keyCode && $scope.searchResult.length > 0) {
                    var isKeyExists = false;
                    var preKeyToHightLight = false;
                    var index = 0;
                    $.each($scope.searchResult, function (key, item) {
                        if (item.isKeyOver == true) {
                            item.isKeyOver = false;
                            isKeyExists = true;
                            nextKeyToHightLight = true;
                            index = key;
                        }
                    });

                    if (isKeyExists && index > 0)
                        $scope.searchResult[index - 1].isKeyOver = true;

                    if (!isKeyExists || index == 0) $scope.searchResult[$scope.searchResult.length - 1].isKeyOver = true;
                    $scope.$digest();
                }
            });

            $("#editBuzcircleSearchInput").blur(searchPopover.hide);
            $("#editBuzcircleSearchBtn").blur(searchPopover.hide);

            $scope.search = function () {
                var options = {
                    ignoreCase: true,
                    exactMatch: false
                };
                $scope.searchResult = $scope.$tree.search($scope.searchInput, options);
                searchPopover.show();
                if ($scope.searchResult.length == 0)
                    $timeout(function () {
                        searchPopover.hide();
                    }, 1000);
            };

            $scope.searchResultSelected = function (node) {
                $state.broadCast = {title: node.contactcompanyname, detail: node};
                $timeout(function () {
                    searchPopover.hide();
                    $scope.$broadcast("autoScroll", {element: $(".node-selectContactsTreeView[data-nodeid='" + node.nodeId + "']", data.element)});
                }, 200);
                $(".node-selectContactsTreeView[data-nodeid='" + node.nodeId + "']", data.element).trigger("click");
            }

        });
        //初始化加载的数据

        if ($scope.type == "add") {
            $scope.oranginContacts = [];
            $scope.oranginContactsTmp = [];
            $scope.selectContacts = [];
        } else {
            $scope.oranginContacts = utils.addPropertybyexsits($state.broadCast && $state.broadCast.items ? $state.broadCast.items : [], "staffnickname", "nodeName");
            $scope.oranginContactsTmp = $.extend(true, [], $scope.oranginContacts);
            $scope.selectContacts = $.extend(true, [], $scope.oranginContacts);
        }

        if ($scope.type == "add") {
            $scope.autoGenerateCircleName = utils.joinProperty($scope.selectContacts.length > 3 ? $scope.selectContacts.slice(0, 3) : $scope.selectContacts, "nodeName");
        }

        $scope.removeMember = function (nodeId) {
            $scope.selectContacts = utils.removeFromArrayByKeyValue($scope.selectContacts, 'nodeId', nodeId);

            if ($scope.type == "add") {
                $scope.autoGenerateCircleName = utils.joinProperty($scope.selectContacts.length > 3 ? $scope.selectContacts.slice(0, 3) : $scope.selectContacts, "nodeName");
            }

            $.each($scope.$tree.getNodes(), function (key, node) {
                if (node.addresslistid == nodeId) {
                    node.state.selected = false;
                    $scope.$tree.refresh();
                }
            })
        };

        $scope.$watch("autoGenerateCircleName", function (newVal) {

        });

        $scope.saveOrUpdate = function (event) {
            if ($scope.selectContacts.length == 0) {
                $alert("请选择商圈成员！");
                return;
            }

            $modal({
                scope: $scope,
                template: 'modal/modal.confirm.tpl.html',
                animation: 'am-fade-and-scale',
                html: true,
                placement: 'center',
                title: "提示",
                content: ($scope.type == 'add' ? "确认要创建圈子--<b>" + $("#autoGenerateCircleName").val() + "</b>" : "确认修改该商圈？"),
                callback: function (target, msg) {
                    $scope.submitting = true;
                    var formData = {
                        commercialcirclename: $("#autoGenerateCircleName").val(),
                        commercialicon: "",
                        commercialcirclemember: []
                    };
                    if ($scope.type == 'add') {
                        formData.scenetypeid = $scope.scenetypeid,
                            formData.commericalcircletypeid = $scope.selectedbuztype
                    } else if ($scope.type == 'edit') {
                        formData.commercialcircleid = $state.broadCast.buzCircleInfo.commercialcircleid;
                    }
                    $.each($scope.selectContacts, function (key, item) {
                        var action = 'add';
                        var commercialcirclememberid;
                        $.each($scope.oranginContacts, function (_key, _item) {
                            if (item.staffid == _item.staffid) {
                                _item.reserved = true;
                                action = 'modify';
                                commercialcirclememberid = _item.commercialcirclememberid;
                            }
                        })

                        var _node = {
                            staffnickname: item.nodeName,
                            staffid: item.staffid || item.contactid,
                            companyid: item.contactcompanyid || item.companyid,
                            action: action
                        }

                        if (action == "modify") {
                            _node.commercialcirclememberid = commercialcirclememberid;
                        }

                        formData.commercialcirclemember.push(_node);

                    });

                    $.each($scope.oranginContacts, function (key, item) {
                        if (!item.reserved) {
                            formData.commercialcirclemember.push({
                                action: 'delete',
                                staffnickname: item.nodeName,
                                staffid: item.staffid || item.contactid,
                                companyid: item.contactcompanyid || item.companyid,
                                commercialcirclememberid: item.commercialcirclememberid
                            });
                        }
                    })


                    utils.query("/jsbweb/buzCircle.do", {type: "post", method: "post", data: {type: $scope.type == 'add' ? "add" : "modify", formData: JSON.stringify(formData)}}).then(function (resp) {
                        $scope.submitting = false;
                        $alert($scope.type == "add" ? '成功创建商圈' : '修改成功');
                        if ($scope.type == "add") {
                            $scope.$parent.buzcircle.push($.extend(resp.data[0], {isGrouper: true}));
                        } else {
                            $.each($scope.$parent.buzcircle, function (key, item) {
                                if (item.commercialcircleid == $state.broadCast.buzCircleInfo.commercialcircleid) {
                                    item.commercialcirclename = formData.commercialcirclename;
                                }
                            })
                        }

                        $timeout(function(){
                            $("#creatorBuzCircle").children(":last").click();
                        },1000);
                    }, function (resp) {
                        $scope.submitting = false;
                    });
                }
            })
        }

        $scope.submitCachedData = function () {
            utils.query("/jsbweb/writeCacheData.do", {
                type: "POST",
                method: "POST",
                data: {cachedData: JSON.stringify(utils.cachedData)}
            }).then(function (result) {
                $alert(result.message ? result.message : '成功写入文件！');
            }, function (result) {
                $alert(result.message ? result.message : '写文件失败');
            });
        }
    }])