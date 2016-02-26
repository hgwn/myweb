angular.module('masgetWebApp.contacts').controller('contactsFindCtr', ['$scope', '$stateParams', '$state', '$sce', '$modal', 'utils', 'pca','$timeout',
    function ($scope, $stateParams, $state, $sce,$modal, utils, pca,$timeout) {
        $scope.items = [];
        $scope.title = "朋友列表";
        $scope.showFlag = true;
        $scope.toggleGroup = function (event) {
            $scope.showFlag = !$scope.showFlag
            $(event.target).toggleClass("masget-downArrow");
        }
        $scope.selectedCompanyType = "";
        $scope.selectedProvince = "";
        $scope.selectedCity = "";
        $scope.selectedArea = "";

        $scope.companytype = utils.companytype;
        $scope.pca = pca;
        $scope.cities = [];
        $scope.areas = [];


        $scope.$watch("selectedProvince", function (newValue, oldValue, scope) {
            if (newValue != oldValue)
                utils.httpGet("/jsbweb/commonUtils.do?type=district&provinceid=" + newValue, function (resp) {
                    $scope.cities = resp.data.rows;
                    $scope.areas = [];
                })
            if(typeof newValue === "undefined"){
                $scope.selectedCity = "";
                $scope.selectedArea = "";
                $scope.cities = [];
                $scope.areas = [];
            }
        })

        $scope.$watch("selectedCity", function (newValue, oldValue, scope) {
            if (newValue != oldValue)
                utils.httpGet("/jsbweb/commonUtils.do?type=district&cityid=" + newValue, function (resp) {
                    $scope.areas = resp.data.rows;
                })

            if(typeof newValue === "undefined"){
                $scope.selectedArea = "";
                $scope.areas = [];
            }

        })

        $scope.selectAll = function () {
            $.each($scope.items, function (key, item) {
                item.checked = true;
            })
        };

        $scope.unSelectAll = function () {
            $.each($scope.items, function (key, item) {
                item.checked = false;
            })
        }

        $scope.condition = "";

        $scope.searchFriends = function (event) {
            $scope.searching = true;
            $timeout(function(){
                utils.query("/jsbweb/contacts.do?type=find" + utils.parseRequestData({
                    condition: $scope.condition,
                    companytypeid: $scope.selectedCompanyType,
                    provinceid: $scope.selectedProvince,
                    cityid: $scope.selectedCity,
                    areaid: $scope.selectedArea})).then( function (resp) {
                    $.each(resp.data.rows,function(key,item){
                        item.checked = false;
                    })
                    $scope.items = resp.data.rows;
                    $scope.searching = false;
                },function(){
                    $scope.searching = false;
                })
            })
        }

        if($state.broadCast!=null){
        	$scope.addContactModel = {scenetypeid: $state.broadCast.currentGroup.scenetypeid};
        }
        $scope.addnewfriend = true;
        $scope.scenetype = [
            {id: 2, name: "供应商"},
            {id: 3, name: "客户"},
            {id: 4, name: "渠道商"},
            {id: 5, name: "自定义场景"}
        ];

        $scope.$watch("addContactModel.scenetypeid", function (newVal, oldVal) {
        	if(newVal!=null){
        		utils.query("/jsbweb/contacts.do?type=group.getbyscenetype&scenetypeid=" + newVal).then(function (resp) {
        			$scope.addContactModel.optionGroups = resp.data.rows;
        		})
        	}
        })

        $scope.addNewFriends = function (event) {
        	$scope.addressgroupModel = false;
            $scope.modalFooterHide = true;
            $modal({
                scope: $scope,
                template: 'modal/modal.confirm.tpl.html',
                animation: 'am-fade-and-scale',
                html: true,
                placement: 'center',
                title: "添加新朋友",
                contentTemplate: "base/app/contacts/contacts.addnewfriend.html",
                callback: function (target, msg) {

                    var pcaIds = $scope.addContactModel.addressids.split("&");
                    var pcaNames = $scope.addContactModel.pca.split(" ");
                    if (pcaIds.length == 3) {
                        $scope.addContactModel.provinceid = pcaIds[0];
                        $scope.addContactModel.cityid = pcaIds[1];
                        $scope.addContactModel.areaid = pcaIds[2]
                    }

                    if (pcaNames.length == 3) {
                        $scope.addContactModel.provincename = pcaNames[0];
                        $scope.addContactModel.cityname = pcaNames[1];
                        $scope.addContactModel.areaname = pcaNames[2]
                    }

                    utils.query("/jsbweb/contractor.do?type=add", {type: "post", method: "post", data: {formData: JSON.stringify($scope.addContactModel)}}).then(function (resp) {
                        if (resp.ret == 0) {
                            $alert("新增成功！");
                            $scope.addNodes($state.broadCast.currentGroup,resp.data.rows,"person");
                        } else {
                            $alert('新增失败！');
                        }
                    });

                    /*
                     * 将后台省市区数据加载到本地
                     * */
                    /*var pca = [];
                     utils.query("/jsbweb/commonUtils.do?type=district_NOS").then(function (resp) {
                     pca = resp.data.rows;
                     for (var i = 0; i < pca.length; i++) {
                     pca[i].p = pca[i].provincename;
                     delete pca[i].provincename;
                     $.ajax({type:"get",url:"/jsbweb/commonUtils.do?type=district_NOS&provinceid=" + pca[i].provinceid,async:false}).success(function (resp) {
                     resp = eval("("+resp+")");
                     var cities = resp.data.rows;
                     pca[i].c = cities;
                     for (var j = 0; j < cities.length; j++) {
                     cities[j].n = cities[j].cityname;
                     delete cities[j].cityname;
                     $.ajax({type:"get",url:"/jsbweb/commonUtils.do?type=district_NOS&cityid=" + cities[j].cityid,async:false}).success(function(resp){
                     resp = eval("("+resp+")");
                     var areas = resp.data.rows;
                     cities[j].a = areas;
                     for(var k=0;k<areas.length;k++){
                     areas[k].s = areas[k].areaname;
                     delete areas[k].areaname;
                     }
                     })
                     }
                     })
                     }
                     console.log(JSON.stringify(pca));
                     })*/

                }
            })
        }

        $scope.addmember = function () {
            $scope.modalFooterHide = false;
            var selectContacts = $.grep($scope.items, function (item) {
                return item.checked == true;
            });

            if (selectContacts.length == 0) {
                $alert('请选择要添加的人员');
                return;
            }

            $confirm("确认要添加?",function(){
            var formData = {
                addressgroupid: $state.broadCast.currentGroup.addressgroupid,
                contactlist: []
            };

            $.each(selectContacts, function (key, item) {
                formData.contactlist.push({
                    contactid: item.staffid,
                    concompanyid: item.companyid,
                    platformuser:item.platformuser,
                    scenetypeid:$state.broadCast.currentGroup.scenetypeid,
                    remark: "remark"
                })
            })

            utils.query("/jsbweb/contacts.do?type=addPerson",{type:"post",method:"post",data:{formData: JSON.stringify(formData)}}).then(function (resp) {
                $alert('添加成功');
                $scope.items = $.grep($scope.items,function(item){
                    return !!item.checked;
                })
                $scope.addNodes($state.broadCast.currentGroup,resp.data.rows,"person");
            });
        },{scope:$scope});
        }
    }])