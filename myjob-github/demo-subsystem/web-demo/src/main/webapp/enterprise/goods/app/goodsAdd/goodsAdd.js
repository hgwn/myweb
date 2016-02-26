angular.module('masgetWebApp.goodsAdd', [
    'ui.router', 'ui.select','ngSanitize'
])
    .config(
    ['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("home", {
                url: "/home",
                views: {
                    'picUpload': {
                        templateUrl: 'static/tpls/goods.common.picUpload.html',
                        controller:'fileUploadCtr'
                    },
                    'goodsAddCategory':{
                        templateUrl: 'app/goodsAdd/goodsAdd.categoryAttr.html',
                        controller: 'goodsAddCategoryCtr'
                    }
                    ,
                    'goodsAddClass':{
                        templateUrl: 'static/tpls/goods.common.goodsClass.html',
                        controller: 'goodsAddClassCtr'
                    },
                    'goodsUnit':{
                    	templateUrl:'static/tpls/goods.common.goodsunit.html',
                    	controller:'goodsUnitCtr'
                    }
                }
            })
    }]);