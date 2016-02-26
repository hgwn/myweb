angular.module('masgetWebApp.contacts', [
    'ui.router'
])

    .config(
    [          '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
	            .state('home.contacts_blank', {
	                url: '/:path',
	                views: {
	                    'contentPanel_contact': {
	                        templateUrl: 'base/app/contacts/contacts.blank.html'
	                    }
	                }
	            })
            	
                .state('home.contacts_list', {
                    url: '/:path',
                    resolve: resolveDep({
                        files: [
                            'contacts/contacts.list.controller'
                        ]},'','contactsListDeps'),
                    views: {
                        'contentPanel_contact': {
                            templateUrl: 'base/app/contacts/contacts.list.html',
                            controller:'contactsListCtr'
                        }
                    }
                })
                
                .state('home.contacts_organize', {
                    url: '/:path',
                    resolve: resolveDep({
                        files: [
                            'contacts/contacts.organizeController'
                        ]},'','contactsOrganizeDeps'),
                    views: {
                        'contentPanel_contact': {
                            templateUrl: 'base/app/contacts/contacts.organize.html',
                            resolve: {
                            	contactsStation:['contacts',
                                     function (contacts) {
                                         return contacts.getStationtype();
                                     }]
                            	}, 
                            controller:'organizeController'
                        }
                    }
                })

                .state('home.contacts_detail', {

                    url: '/detail/:path',

                    views: {

                        'contentPanel_contact': {
                            templateUrl: 'base/app/contacts/contacts.detail.html',
                            controller: ['$scope', '$state', '$stateParams', 'utils','Upload',
                                function ($scope, $state, $stateParams, utils,Upload) {
                                    $scope.detail = $state.broadCast ? $state.broadCast.detail : "";
                                    $scope.toChat = function () {
                                        $scope.changeTo({currentTarget:$("#leftbar ul li a:first")}, 'buzcircle');
                                        $state.go("home.mgchat");
                                        $state.broadCast = {
                                            receiver:{
                                                title:$scope.detail.contactname,
                                                receiverid:$scope.detail.contactid,
                                                receiverName:$scope.detail.contactname
                                            },
                                            isGrouper:false
                                        }
                                        $scope.$emit('chatWithSomebody',{content:$scope.detail});
                                    }
                            }]
                        }
                    }
                })

                .state('home.contacts_find', {
                    url: '/find/:path',
                    resolve: resolveDep({
                        files: [
                            'contacts/contacts.find.controller',
                            'selectAddress/selectAddress'
                        ]},'','contactsFindDeps'),
                    views: {
                        'contentPanel_contact': {
                            resolve:{
                                pca:['contacts',function(contacts){
                                    return contacts.getPca();
                                }]
                            },
                            templateUrl: 'base/app/contacts/contacts.findfriends.html',
                            controller:'contactsFindCtr'
                        }
                    }
                })

                .state('home.contacts_add', {
                    url: '/add',
                    views: {
                        'contentPanel_contact': {
                            templateUrl: 'base/app/contacts/contacts.addfriends.html',
                            controller: ['$scope', '$stateParams', '$state', 'utils',
                                function ($scope, $stateParams, $state, utils) {
                                    $scope.items = $state.broadCast.items;
                                    $scope.title = "朋友列表";
                                }]
                        }
                    }
                })

                //新增/修改员工
                .state('home.contacts_addStaff',{
                    url:'/addStaff/:path',
                    resolve: resolveDep({
                        files: [
                            'contacts/contacts.staffController',
                            'static/css/base/addstaffstyle.css'
                        ]},'','contactsStaffDeps'),
                    views:{
                        'contentPanel_contact':{
                            templateUrl: '/jsbweb/base/companystaff/html/staffdatum.edit.html',
                            resolve: {
                            	contactsRoletype:['contacts',
                                     function (contacts) {
                                         return contacts.getRoletype();
                                     }]
                            },
                            controller: 'staffController'
                        }
                    }
                })
                
                //公司的修改
                .state('home.contacts_Company',{
                    url:'/Company/:path',
                    resolve: resolveDep({
                        files: [
                            'contacts/contacts.companyController'
                        ]},'','contactsCompanyDeps'),
                    views:{
                        'contentPanel_contact':{
                            templateUrl: '/jsbweb/base/companyinfo/html/companyInfo.edit.html',
                            controller: 'companyController'
                        }
                    }
                }) 
                
                //站点
                .state('home.contacts_Station',{
                    url:'/Station/:path',
                    resolve: resolveDep({
                        files: [
                            'contacts/contacts.stationController'
                        ]},'','buzcircleEditDeps'),
                    views:{
                        'contentPanel_contact':{
                            templateUrl: 'base/app/contacts/contacts.Station.html',
                            resolve: {
                            	contactsStation:['contacts',
                                     function (contacts) {
                                         return contacts.getStationtype();
                                     }]
                            	}, 
                            controller: 'stationController'
                        }
                    }
                });
        }
    ]
);
