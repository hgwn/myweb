angular.module('masgetWebApp.contacts').controller('organizeController',['$scope', '$state', 'contacts', '$alert', 'utils', 'contactsStation','$modal',
  function ($scope, $state, contacts, $alert, utils,contactsStation,$modal) {
    if ($state.broadCast) {
    	var sessionRoletypeid = $scope.session.roletypeid;
        $scope.title = angular.isDefined($state.broadCast) ? $state.broadCast.title : '';
        $scope.count = $state.broadCast.count;
        $scope.items = angular.isArray($state.broadCast.items) ? $state.broadCast.items : [];
        $scope.showAdd = $state.broadCast.showAdd == false ? $state.broadCast.showAdd : true;
        $state.broadCast.showAdd = true;
        $scope.currentGroup = $state.broadCast.currentGroup;
        if($state.broadCast.type == "company"){
        	$scope.type = "company";
        }else if($state.broadCast.type == "station"){
        	$scope.type = "station";
        }else if($state.broadCast.type == "scenetype"){
        	if($scope.items[0].isCompany){
        		$scope.type = "scenetype";
        	}else{
        		$scope.type = "company";
        	}
        }
    }

    $scope.showFlag = true;
    $scope.toggleGroup = function (event) {
        $scope.showFlag = !$scope.showFlag
        $(event.target).toggleClass("masget-downArrow");
    }
    
    var sessionStaffid =  $scope.session.staffid;
    var sessionid = $scope.session.companyid;
    //公司
    $scope.companyEdit = function(item){
    	if(item.isCompany){
    		utils.httpGet("/jsbweb/base/companyinfo/getOneCompany.do?companyid="+item.companyid,function(resp){
				 if(resp.ret==0){
					 if(sessionid == item.companyid&&sessionRoletypeid == 1){
						 $state.broadCast = {item: resp.data[0],node:item,type:"edit"};
					 }else{
						 $state.broadCast = {item: resp.data[0],node:item,type:"check"};
					 }
					 $state.go("home.contacts_Company",{path:utils.uuid()});
				 }else{
					 console.info("查询失败");
				 }
			 })
    	}else{
    		$scope.stationEdit(item);
    	}
    }
    
    //员工
    $scope.staffAdd = function () {
        $state.broadCast = {item: $scope.currentGroup,type:"add"};
        $state.go("home.contacts_addStaff",{path:utils.uuid()});
    }
    
    $scope.staffEdit = function(item){
    	utils.httpGet("/jsbweb/base/companystaff/getonestaff.do?staffid="+item.staffid,function(resp){
			if(resp.ret==0){
				if(resp.data.companyid == sessionid){
					if(sessionRoletypeid == 1){
						$state.broadCast = {item: resp.data,node:item,sessionStaffid:sessionStaffid,type:"edit"};
					}else{
						 if(sessionStaffid == resp.data.staffid){
							 $state.broadCast = {item: resp.data,node:item,sessionStaffid:sessionStaffid,type:"edit"};
						 }else{
							 $state.broadCast = {item: resp.data,node:item,sessionStaffid:sessionStaffid,type:"check"};
						 }
					}
				}else{
					$state.broadCast = {item: resp.data,node:item,sessionStaffid:sessionStaffid,type:"check"};
				}
				$state.go("home.contacts_addStaff",{path:utils.uuid()});
			}else{
				console.info("查询失败");
			}
		})
    }
    
//    $scope.deleteStaff = function (item) {
//    	$modal({title: "提示", content: "确认要删除站点为"+item.stationname+"?",template:'modal/modal.confirm.tpl.html',animation:'am-fade-and-scale',callback: function(){
//    		utils.httpGet("/jsbweb/base/stationdatum/delete.do?mstationid="+item.stationid,function(resp){
//    			if(resp.ret==0){
//    				$alert({title: '提示：', content: '删除成功', placement: 'masget-top',duration:1,type: 'info', show: true});
//    			}else{
//    				$alert({title: '提示：', content: resp.message, placement: 'masget-top',duration:1,type: 'info', show: true});
//    			}
//    		})
//    		}
//    	})
//    }
    
    //站点
    $scope.stationAdd = function () {
        $state.broadCast = {node: $scope.currentGroup,type:"add"};
        $state.go("home.contacts_Station",{path:utils.uuid()});
    }
    
    $scope.stationEdit = function(item){
    	utils.httpGet("/jsbweb/base/stationdatum/getOneStation.do?stationid="+item.stationid,function(resp){
			 if(resp.ret==0){
				 var data = resp.data.rows[0];
				 $state.broadCast = {item: data,node:item};
				 if(data.companyid == sessionid){
					 $state.broadCast.type = "edit";
				 }else{
					 $state.broadCast.type = "check";
				 }
				 $state.go("home.contacts_Station",{path:utils.uuid()});
			 }else{
				 console.info("查询失败");
			 }
    	})
    }
    
    $scope.deleteStation = function (item) {
    	$modal({title: "提示", content: "确认要删除站点为"+item.stationname+"?",template:'modal/modal.confirm.tpl.html',animation:'am-fade-and-scale',callback: function(){
    		utils.httpGet("/jsbweb/base/stationdatum/delete.do?mstationid="+item.stationid,function(resp){
    			if(resp.ret==0){
    				$alert({title: '提示：', content: '删除成功', placement: 'masget-top',duration:1,type: 'info', show: true});
    				$scope.reloadStationNode(item.parent.nodeId);
    				$state.go("home.contacts_blank", {path:utils.uuid()});
    			}else{
    				$alert({title: '提示：', content: resp.message, placement: 'masget-top',duration:1,type: 'info', show: true});
    			}
    		})
    		}
    	})
    }
}])