angular.module('masgetWebApp.goodsClassify', ['ui.router'])
.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
		$stateProvider.state(
            "goodsClassifyList",
            {
                url:"/goodsClassifyList",
                views : {
                    'mainContent' : {
                        templateUrl : 'template/goodsclassify.list.html',
                        controller : 'goodsClassifyController'
                    }
                }
            });
	 }]);