angular.module('masgetWebApp.datum', [
    'ui.router',
    'ngTreetable',
    'ngMessages',
    'selectAddress'
])

	.run(['$templateCache',function ($templateCache) {
		$templateCache.put("tree_node",  '<tr  tt-node is-branch="node.type == \'folder\'">'+
				'<td ng-if="node.companyid == node.sessionid">'+
				'<a href="#" data-toggle="modal" data-target="#contractModal" class="link_edit" ng-click="edit(node)"><span class="glyphicon glyphicon-pencil blue"></span>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
				'<a href="" class="link_delete" ng-click="staffCheck(node)" ng-if="node.sessionStation != node.id"><span class="glyphicon glyphicon-trash blue"></span>删除</a></td>'+
				'<td ng-if="node.companyid != node.sessionid">'+
				'<a href="#" data-toggle="modal" data-target="#contractModal" class="link_edit" ng-click="checkData(node)"><span class="glyphicon glyphicon-check blue"></span>查看</a></td>'+
				'<td style="text-align:left;"><span ng-bind="node.text"></span></td><td ng-bind="node.companyname"></td>'+
				'<td ng-bind="node.stationcode"></td>' +
                //'<td ng-bind="node.shortening"></td>'+
				'<td ng-bind="node.stationtypename"></td>'+
				'<td >{{node.provincename}}{{node.cityname}}{{node.areaname}}{{node.address}}</td>'+
				'</tr>');
        }
	])
	
    .config(
    ['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state("list", {

                url: "/list",

                views: {

                    'content': {
                        templateUrl: 'app/datum/datum.list.html',
                        resolve: {
                            Session: ['example',
                                function (example) {
                                    return example.getSession();
                                }],
                        	companyData:['example',
                                function (example) {
                                    return example.getCompanyData();
                                }],
                        	stationtype:['example',
                                 function (example) {
                                     return example.getStationtype();
                                 }]
                        },

                        controller: 'datumCtr'
                    }
                }
            })
    }])
