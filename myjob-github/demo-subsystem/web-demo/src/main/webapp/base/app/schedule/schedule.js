angular.module('masgetWebApp.schedule',[
    'ui.router'])
    .config(
    ['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("home.schedule",{
                url:"/schedule",
                views:{
                    'contentPanel_buzcircle':{
                        templateUrl:'base/app/schedule/schedule.html',
                        resolve:{
                            joblist:['schedule',function(schedule){
                                return schedule.jobList();
                            }],
                            joblistHistory:['schedule',function(schedule){
                                return schedule.jobListHistory();
                            }]
                        },
                        controller:'scheduleCtr'
                    }
                }
            })
    }]).service('schedule',['utils',function(utils){
        var factory={};
        factory.jobList = function(){
            return utils.query("/jsbweb/rsmd.do?type=joblist"+utils.parseRequestData({
                staffid:utils.session.staffid,
                companyid:utils.session.companyid,
                tasktype:21
            })).then(function(resp){
                if($.isArray(resp.data.rows))
                return resp.data.rows;
                else return [];
            })
        };

        factory.jobListHistory = function(){
            return utils.query("/jsbweb/rsmd.do?type=joblist"+utils.parseRequestData({
                staffid:utils.session.staffid,
                companyid:utils.session.companyid,
                tasktype:22
            })).then(function(resp){
                if($.isArray(resp.data.rows))
                    return resp.data.rows;
                else return [];
            })
        };
        return factory;
    }])