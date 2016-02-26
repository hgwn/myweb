angular.module('masgetWebApp.commodity', [ 'ui.router' ])
		.config(['$stateProvider','$urlRouterProvider',
						function($stateProvider, $urlRouterProvider) {
							$stateProvider
							.state(
                                    "supplyList",
                                    {
                                        url:"/supplyList",
                                        views : {
                                        	'headContent' : {
												templateUrl : '',
									        	controller : ''
									        },
                                            'mainContent' : {
                                                templateUrl : 'app/commodity/commodity.supply.html',
                                                controller : 'supplyController'
                                            }
                                        }
                                    })
							.state(
									"list",
									{
										url : "/list/:path",
										views : {
											'headContent' : {
												templateUrl : 'app/commodity/commodity.header.html',
									        	controller : 'commodityHeadController'
									        },
											'mainContent' : {
												templateUrl : 'app/commodity/commodity.list.html',
												controller : 'commodityController'
											}
										}
									})
							.state(
									"detail",
									{
										url : "/detail/:path",
										views : {
											'headContent' : {
												templateUrl : 'app/commodity/commodity.header.html',
									        	controller : 'commodityHeadController'
									        },
											'mainContent' : {
												templateUrl : 'app/commodity/commodity.detail.html',
												controller : 'commodityDetailController'
											}
										}
							})
							.state(
									"goodscart",
									{
										url : "/goodscart",
										cache:'true', 
										views : {
											'headContent' : {
												templateUrl : '',
									        	controller : ''
									        },
											'mainContent' : {
												templateUrl : 'app/commodity/commodity.goodscart.list.html',
												controller : 'commodityGoodscartController'												
											}
										}
							}).state(
									"billing",
									{
										url : "/billing",
										views : {
											'headContent' : {
												templateUrl : '',
									        	controller : ''
									        },
											'mainContent' : {
												templateUrl : 'app/commodity/commodity-billing.html',

												controller : 'commodityBillingController'												
											}
										}
							});
						} ]);