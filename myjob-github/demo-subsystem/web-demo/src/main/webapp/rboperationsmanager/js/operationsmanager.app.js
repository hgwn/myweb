var operationsModule= angular.module('masgetWebApp.com.operationsmanager',[
       'ui.router',
        'ui.tree',
       'operationsmanager.Service',
       'ngMessages',
       'mgcrea.ngStrap',
       'util.pagination',
       'util.commobox',
       'util.comboxtable',
       'ngFileUpload',
       'ngTouch',
       "ui.grid",
       "ui.grid.edit",
       "ui.grid.cellNav",
       'ui.grid.selection',
       'ui.grid.pagination',
       'ui.grid.autoResize',
       'ui.grid.resizeColumns',
       'ui.grid.moveColumns',
       'ui.grid.grouping',
       'ui.grid.treeView',
       'ui.grid.i18n',
        'selectAddress',
        'ngFileUpload',
       'masgetWebApp.utils.service'
       ]);
/**
 * 把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
 * 这里的run方法只会在angular启动的时候运行一次。
 * @param  {[type]} $rootScope
 * @param  {[type]} $state
 * @param  {[type]} $stateParams
 * @return {[type]}
*/
operationsModule.run(['$rootScope','$state','$stateParams','$http','$timeout','$window','i18nService',
          function($rootScope, $state, $stateParams,$http,$timeout,$window,i18nService){
			$rootScope.$state = $state;
		    $rootScope.$stateParams = $stateParams;
            i18nService.setCurrentLang("zh-cn");
}]);

/**
 * 配置路由。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
operationsModule.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/auditcompany_query');
    $stateProvider
        .state('operation', {  
            url: '/operation',
            views: {
                'main': {
                    templateUrl: 'tpls/operation/operation.html' 
                }
            }
        })
        .state('osroleresource',{
            url:'/osroleresource',
            views:{
                'main':{
                    templateUrl:'tpls/operation/osroleresource.html',
                    controller:'ConnectedTreesCtrl'
                }
            }
        })
        .state('baseResource',{
            url:'/baseResource',
            views:{
                'main':{
                    templateUrl:'tpls/resources/resource.list.html',
                    controller:'resourceCtrl'
                }
            }
        })
        .state('membersImport',{
            url:'/membersImport',
            views:{
                'main':{
                    templateUrl:'tpls/membersImport/membersImport.html',
                    controller:'membersImportCtrl'
                }
            }
        })
        .state('transferaccountinfo',{
            url:'/transferaccountinfo',
            views:{
                'main':{
                    templateUrl:'tpls/companytransferaccountinfo/companytransferaccountinfo.query.html'
                }
            }
        })
        .state('serviceprovider',{
            url:'/serviceprovider',
            views:{
                'main':{
                    templateUrl:'tpls/serviceprovider/serviceprovider.html',
                    controller:'serviceproviderCtr'
                }
            }
        })
        .state('newcompany',{
            url:'/newcompany',
            views:{
                'main':{
                    templateUrl:'tpls/company/company-add.html',
                    controller:'newcompanyCtr'
                }
            }
        })
        .state('companyinfo',{
            url:'/companyinfo',
            views:{
                'main':{
                    templateUrl:'tpls/companyinfo/companyinfo.html',
                    controller:'companyinfoCtr'
                }
            }
        })
        .state('treedemo',{
            url:'/treedemo',
            views:{
                'main':{
                    templateUrl:'tpls/operation/uitree.html',
                    controller:'treedemoCtr'
                }
            }
        })
        .state('osroleresource_modify',{
            url:'/osroleresource_modify',
            views:{
                'main':{
                    templateUrl:'tpls/osroleresource/osroleresource.list.html',
                    controller:'osroleresource_modifyCtr'
                },
                'edit@osroleresource_modify':{
                    templateUrl: 'tpls/osroleresource/osroleresource.edit.html'
                }
            }
        })
        .state('auditcompany_query',{
            url:'/auditcompany_query',
            views:{
                'main':{
                    templateUrl:'tpls/auditcompany/auditcompany.query.html',
                    controller:'auditcompany_queryCtr'
                }
            }
        })
        .state('memberapply_query',{
            url:'/memberapply_query/{companyid}',
            views:{
                'main':{
                    templateUrl : function($stateParams){
                        return 'tpls/memberapply/memberapply.query.html';
                    }
                }
            }
        })
        .state('memberapply_audit',{
            url:'/memberapply_audit/{companyid}',
            views:{
                'main':{
                    templateUrl:function($stateParams){
                        return 'tpls/memberapply/memberapply.audit.html'
                    }
                }
            }
        })
        .state('modifyinfos3',{
            url:'/modifyinfos3/{companyid}',
            views:{
                'main':{
                    templateUrl:function($stateParams){
                        return 'tpls/memberapply/companymodify/modifyinfos3.html'
                    }
                }
            }
        })
        .state('modifyinfos5',{
            url:'/modifyinfos5/{companyid}',
            views:{
                'main':{
                    templateUrl:function($stateParams){
                        return 'tpls/memberapply/companymodify/modifyinfos5.html'
                    }
                }
            }
        })
});
