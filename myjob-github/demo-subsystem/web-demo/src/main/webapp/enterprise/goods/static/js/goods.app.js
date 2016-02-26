
var goodsModule= angular.module('masgetWebApp.enterprise.goodsApp',[
       "ui.router",
       "ngMessages",
       "util.pagination",
       "masgetWebApp.utils.service",
       'ui.select',
       'ngSanitize',
       'ngFileUpload'
       ]);
/**
 * 把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
 * 这里的run方法只会在angular启动的时候运行一次。
 * @param  {[type]} $rootScope
 * @param  {[type]} $state
 * @param  {[type]} $stateParams
 * @return {[type]}
*/
goodsModule.run(['$rootScope','$state','$stateParams','$http','$timeout','$window',
          function($rootScope, $state, $stateParams,$http,$timeout,$window){
			$rootScope.$state = $state;
		    $rootScope.$stateParams = $stateParams;
		    
		    //定义数据对象
		    $rootScope.editGoodsData = {};
		    
		    //获取当前编辑的商品数据
		    $rootScope.editGoods =function(item){
		    	$rootScope.editGoodsData = item;
		    }
}]);

/**
 * 配置路由。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
goodsModule.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/list');
    $stateProvider
        .state('list', {
            url: '/list',
            views: {
                'main': {
                    templateUrl: 'static/tpls/goods.list.html'
                }
            }
        })
        .state('edit',{
        	url:'/edit',
        	views:{
        		'main':{
        			templateUrl:'static/tpls/goods.edit.html'
        		},
        		'picUpload@edit':{
        			templateUrl:'static/tpls/goods.edit.picUpload.html',
        			controller:'picUploadCtr'
        		},
        		'goodsAddClass@edit':{
        			templateUrl:'static/tpls/goods.common.goodsClass.html',
        			controller: 'goodsEditClassCtr'
        		},
        		'goodsUnit@edit':{
        			templateUrl:'static/tpls/goods.common.goodsunit.html'
        		},
        		'goodsEditCategory@edit':{
        			templateUrl:'static/tpls/goods.edit.categoryAttr.html',
        			controller: 'goodsEditCategoryCtr'
        		}
        	}
        })
});
