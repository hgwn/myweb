/**
 * Created by Administrator on 2015-06-18.
 */
var comGoodsListApp = angular.module('masgetWebApp.enterprise.goodslist', [
    "ui.router",
    'ngTouch','ngAnimate','angularBootstrapNavTree', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.exporter',
    'ui.grid', 'ui.grid.pinning', 'ui.grid.resizeColumns', 'ui.grid.saveState', 'ui.grid.pagination', 'ui.grid.selection',
    'ui.nested.combobox',"util.commobox", 'ui.select','ngSanitize','ngMessages',  'ngFileUpload','masgetWebApp.utils.service','goodsClassify.Service'
]);


comGoodsListApp.run(function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

comGoodsListApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/goodslist');

    $stateProvider
        .state('goodslist', {
            url: '/goodslist',
            views: {
                'main': {
                    templateUrl: 'tpls/goods.html'
                },
                "query@goodslist": {
                    templateUrl: 'tpls/goods.query.html'
                },
                "grid@goodslist": {
                    templateUrl: 'tpls/goods.grid.html'
                },
                "tree@goodslist": {
                    templateUrl: 'tpls/goodsclassify.tree.html'
                },
                "add@goodslist":{
                    templateUrl: "tpls/goods.add.html",
                    controller: "GoodsAddController"
                },
                "addgoodsunit@goodslist":{
                    templateUrl: "tpls/goods.addgoodsunit.html",
                    controller: "GoodsAddGoodsUnitController"
                },
                "addGoodsClassify@goodslist":{
                    templateUrl: "tpls/goodsclassify.add.html",
                    controller: "GoodsAddGoodsUnitController"
                }/*,
                "main":{
                    templateUrl: "tpls/goods.goodsImport.html",
                }*/
            }
        })
    .state('goodsImport',{
			url : '/goodsImport',
			views : {
				"main" : {
					templateUrl: "tpls/goods.goodsImport.html"
				},
				"selectFile@goodsImport":{
					templateUrl: "tpls/select_excel_file_modal.html"
				}
			}
		})
});
