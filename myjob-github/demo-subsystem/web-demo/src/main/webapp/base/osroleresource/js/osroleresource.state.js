angular.module('masgetWebApp.osroleresource', [
    'ui.router',
    'ngTreetable',
    'ngMessages'
])

	.run(['$templateCache',function ($templateCache) {
		$templateCache.put("tree_node",  '<tr  tt-node is-branch="node.type == \'folder\'">'+
				'<td style="text-align:left;" ng-click="rowClicked(node)"><span ng-bind="node.text"></span></td>'+
				'<td >{{node.childnodetype ==100?"打开功能":(node.childnodetype ==101?"分组无动作":(node.childnodetype ==102?"取资源":(node.childnodetype ==103?"取商圈节点":(node.childnodetype ==104?"取人脉节点":(node.childnodetype ==105?"虚拟账号":"")))))}}</td>'+
				'<td >'+
				'<a href="#" ng-if="node.isOperation && node.children.length != 0 && node.children != undefined && node.childnodetype != 100" style="text-decoration: none;"  class="link_edit" ng-click="edit(node,this)"><span class="glyphicon glyphicon-pencil blue"></span>编辑</a>'+
				'<a href="#" ng-if="node.isAdd && node.children.length == 0 || node.children == undefined && node.childnodetype != 100" style="text-decoration: none;" class="link_delete" ng-click="add(node,this)" >&nbsp;&nbsp;&nbsp;&nbsp;<span class="glyphicon glyphicon-plus blue"></span>新增</a>'+
				'<a href="#" ng-if="node.isDelete && node.children.length == 0 || node.children == undefined" style="text-decoration: none;" class="link_delete" ng-click="deleteDatum(node,this)" >&nbsp;&nbsp;&nbsp;&nbsp;<span class="glyphicon glyphicon-trash blue"></span>删除</a></td>'+
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
                        templateUrl: 'html/osroleresource.list.html',
                        resolve: {
                        	contactsRoletype:['example',
                                 function (example) {
                                     return example.getRoletype();
                                 }],
                            companytype:['example',
	                             function (example) {
	                                 return example.getCompanytype();
	                             }]
                        },

                        controller: 'osroleresourceCtr'
                    }
                }
            })
    }])
