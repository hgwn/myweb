var tunnelmanagerModule= angular.module('masgetWebApp.com.tunnelmanager',[
       "ui.router",
       'tunnelmanager.Service',
       "ngMessages",
       'mgcrea.ngStrap',
       "util.pagination",
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
       'ui.grid.treeView'
       ]);
/**
 * 把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
 * 这里的run方法只会在angular启动的时候运行一次。
 * @param  {[type]} $rootScope
 * @param  {[type]} $state
 * @param  {[type]} $stateParams
 * @return {[type]}
*/
tunnelmanagerModule.run(['$rootScope','$state','$stateParams','$http','$timeout','$window',
          function($rootScope, $state, $stateParams,$http,$timeout,$window){
			$rootScope.$state = $state;
		    $rootScope.$stateParams = $stateParams;
}]);

/**
 * 配置路由。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
tunnelmanagerModule.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/searchTunnel/tabIn');
    $stateProvider
        .state('interGroup', {  //内部组管理
            url: '/interGroup',
            views: {
                'main': {
                    templateUrl: 'tpls/interGroup/interGroup.html' //内部组管理 主界面
                },
        		'interGroupListgrid@interGroup':{
        			templateUrl:'tpls/common/interGroup.list.grid.html' // 内部组管理--公共table部分
        		},
                'edit@interGroup':{
                	templateUrl: 'tpls/interGroup/interGroup.edit.html',
                	controller:'editInterGrouprCtr'
                },
                'add@interGroup':{
                	templateUrl:'tpls/interGroup/interGroup.add.html',
                	controller:'addInterGrouprCtr'
                }
            }
        })
        .state('interGroupTunnel',{   //内部组绑定内部终端号
        	url:'/interGroupTunnel',
        	views:{
        		'main':{
        			templateUrl:'tpls/interGroup/interGroup.tunnelmanager.html' // 内部组绑定内部终端号主界面
        		},
        		'internalGroupHeader@interGroupTunnel':{
        			templateUrl:'tpls/common/tunnelGroup.inter.header.html', //内部组名称-- 公共部分
        		},
        		'internalGroup@interGroupTunnel':{
        			templateUrl:'tpls/interGroup/interGroup.tunnelmanager.internal.html',  //内部组绑定内部终端号管理
        			controller:'internalGroupCtr'
        		},
        		'internalGroupModal@interGroupTunnel':{
        			templateUrl:'tpls/interGroup/interGroup.tunnelmanager.viewmodal.html'  //内部终端号模块框
        		}
        	}
        })
        .state('interToexterGroup',{   //内部组绑定外部组
        	url:'/interToexterGroup',
        	views:{
        		'main':{
        			templateUrl:'tpls/interGroup/interGroup.exterGroup.html'  //内部组绑定外部组主界面
        		},
        		'internalGroupHeader@interToexterGroup':{
        			templateUrl:'tpls/common/tunnelGroup.inter.header.html', //内部组名称-- 公共部分
        		},
				'exterGroupListgrid@interToexterGroup':{
					templateUrl:'tpls/common/exterGroup.list.grid.html'  //公用了--外部组table部分
				},
				'inToexterGroupViewmodal@interToexterGroup':{
					templateUrl:'tpls/interGroup/interGroup.exterGroup.viewmodal.html' //外部组模态框
				}
        	}
        })
        .state('exterGroup',{    //外部组管理
        	url:'/exterGroup',
        	views:{
        		'main':{
        			templateUrl:'tpls/exterGroup/exterGroup.html'    //外部组管理主界面
        		},
        		'exterGroupListgrid@exterGroup':{
        			templateUrl:'tpls/common/exterGroup.list.grid.html' //外部组 和 内部组绑定外部组--table公共部分
        		},
                'edit@exterGroup':{
                	templateUrl: 'tpls/exterGroup/exterGroup.edit.html',
                	controller:'editExterGrouprCtr'
                },
                'add@exterGroup':{
                	templateUrl:'tpls/exterGroup/exterGroup.add.html',
                	controller:'addExterGrouprCtr'
                }
        	}
        })
        .state('exterGroupTunnel',{   //外部组绑定外部终端号
        	url:'/exterGroupTunnel',
        	views:{
        		'main':{
        			templateUrl:'tpls/exterGroup/exterGroup.tunnelmanager.html'  //外部组绑定外部终端号主界面
        		},
        		'externalGroupHeader@exterGroupTunnel':{
        			templateUrl:'tpls/common/tunnelGroup.exter.header.html',    //外部组名称--公共部分
        		},
        		'externalGroup@exterGroupTunnel':{
        			templateUrl:'tpls/exterGroup/exterGroup.tunnelmanager.external.html',  //外部组绑定外部终端号管理
        			controller:'externalGroupCtr'
        		},
        		'externalGroupModal@exterGroupTunnel':{
        			templateUrl:'tpls/exterGroup/exterGroup.tunnelmanager.viewmodal.html'  //外部终端号模态框
        		}
        	}
        })
        .state('exterTointerGroup',{   //外部组绑定内部组
        	url:'/exterTointerGroup',
        	views:{
        		'main':{
        			templateUrl:'tpls/exterGroup/exterGroup.interGroup.html'  //外部组绑定内部组主界面
        		},
        		'externalGroupHeader@exterTointerGroup':{
        			templateUrl:'tpls/common/tunnelGroup.exter.header.html', //外部组名称-- 公共部分
        		},
				'interGroupListgrid@exterTointerGroup':{
					templateUrl:'tpls/common/interGroup.list.grid.html'  //公用了--内部组table部分
				},
				'exTointerGroupViewmodal@exterTointerGroup':{
					templateUrl:'tpls/exterGroup/exterGroup.interGroup.viewmodal.html' //内部组模态框
				}
        	}
        })
        .state('inSearchTunnel',{      //内部终端号绑定查询
            url:'/inSearchTunnel',
            views:{
                'main':{
                    templateUrl:'tpls/inSearchTunnel/inSearchTunnel.html'
                }
            }
        })
        .state('exSearchTunnel',{      //外部终端号绑定查询
        	url:'/exSearchTunnel',
        	views:{
        		'main':{
        			templateUrl:'tpls/exSearchTunnel/exSearchTunnel.html'
        		}
        	}
        })
        .state('externalterminal',{      //外部终端号管理
            url:'/externalterminal',
            views:{
                'main':{
                    templateUrl:'tpls/externalterminal/externalterminal.html'
                }
            }
        })
        .state('internalterminal',{      //内部终端号管理
            url:'/internalterminal',
            views:{
                'main':{
                    templateUrl:'tpls/internalterminal/internalterminal.html'
                }
            }
        })
        .state('internalmer',{      //内部商户号号管理
            url:'/internalmer',
            views:{
                'main':{
                    templateUrl:'tpls/internalmer/internalmer.html'
                }
            }
        })
        .state('externalmer',{      //外商户号号管理
            url:'/externalmer',
            views:{
                'main':{
                    templateUrl:'tpls/externalmer/externalmer.html'
                }
            }
        })
        .state('paymentchannel',{      //支付通道管理  
            url:'/paymentchannel',
            views:{
                'main':{
                    templateUrl:'tpls/paymentchannel/paymentchannel.html'
                }
            }
        })
        .state('oneToOne',{      //一对一绑定管理
            url:'/oneToOne',
            views:{
                'main':{
                    templateUrl:'tpls/oneToOne/oneToOne.html'
                },
                'oneToOneListgrid@oneToOne':{
                    templateUrl:'tpls/oneToOne/oneToOne.list.grid.html'
                }
            }
        })
        .state('oneToOneTab',{      //一对一绑定选项卡
            url:'/oneToOneTab',
            views:{
                'main':{
                    templateUrl:'tpls/oneToOne/oneToOne.Tab.html'
                }
            }
        })
        .state('oneToOneTab.Page1', {   //卡1
            url:'/tabInternal',
            templateUrl: 'tpls/oneToOne/oneToOne.Tab.internal.html'
        })
        .state('oneToOneTab.Page2', {  //卡2
            url:'/tabExternal',
            templateUrl: 'tpls/oneToOne/oneToOne.Tab.external.html'
        })
        .state('searchTunnel',{      // 终端绑定定选项卡
            url:'/searchTunnel',
            views:{
                'main':{
                    templateUrl:'tpls/searchTunnel/searchTunnel.html'
                }
            }
        })
        .state('searchTunnel.inSearch', {   //卡1
            url:'/tabIn',
            templateUrl: 'tpls/searchTunnel/inSearchTunnel.html'
        })
        .state('searchTunnel.exSearch', {  //卡2
            url:'/tabEx',
            templateUrl: 'tpls/searchTunnel/exSearchTunnel.html'
        })
        
});
