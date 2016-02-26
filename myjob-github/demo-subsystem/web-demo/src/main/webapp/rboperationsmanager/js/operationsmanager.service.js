angular.module('operationsmanager.Service',[])
    .factory('operationsmanagerService',['$http',function($http){
        var factory = {};
        //系统环境
        var osenvinrmentUrl = '/masgetweb/rboperationsmanager/base/osenvinrment_get.do';
        //公司类型
        var companytypeUrl = '/masgetweb/rboperationsmanager/base/companytype_get.do';
        //角色
        var roletypeUrl = '/masgetweb/rboperationsmanager/base/roletype_get.do';
        //获取角色菜单资源
        var osroleresourceUrl ='/masgetweb/rboperationsmanager/com/osroleresource_query.do';
        //获取未配置基础资源
        var overageUrl = '/masgetweb/rboperationsmanager/com/overage_query.do';
        //设置角色菜单
        var osroleresourcesetUrl='/masgetweb/rboperationsmanager/com/osroleresource_set.do';
        //4.1.	查询划账信息数据
        var companytransferaccountinfoqueryUrl='/masgetweb/rboperationsmanager/com/companytransferaccountinfo_query.do';
        //4.2.	查询划账信息数据条数以及统计数据
        var companytransferaccountinfo_sumUrl='/masgetweb/rboperationsmanager/com/companytransferaccountinfo_sum.do';
        //2.4.	获取银联公司
        var awardcompanyUrl='/masgetweb/rboperationsmanager/com/awardcompany_get.do';
        //2.5.	获取银联下属收单行
        var acquirerinfobyawardcompanyUrl='/masgetweb/rboperationsmanager/com/acquirerinfobyawardcompany_query.do';
        factory.getosenvinrmentUrl = function(){
            return osenvinrmentUrl;  
        };
        factory.getcompanytypeUrl = function(){
            return companytypeUrl;  
        };
        factory.getroletypeUrl = function(){
            return roletypeUrl;  
        };
        //返回角色菜单资源url
        factory.getosroleresourceUrl = function(){
            return osroleresourceUrl;
        };
        //返回未配置基础资源url
        factory.getoverageUrl=function(){
            return overageUrl;
        }
        //返回设置角色菜单url
        factory.getosroleresourcesetUrl=function(){
            return osroleresourcesetUrl;
        }

        //返回查询划账信息数据
        factory.getcompanytransferaccountinfoqueryUrl=function(){
            return companytransferaccountinfoqueryUrl;
        }
        //返回查询划账信息数据条数以及统计数据
        factory.getcompanytransferaccountinfo_sumUrl=function(){
            return companytransferaccountinfo_sumUrl;
        }

        //返回2.5.获取银联下属收单行
        factory.getacquirerinfobyawardcompanyUrl=function(){
            return acquirerinfobyawardcompanyUrl;
        }

        //返回2.4.获取银联公司
        factory.getawardcompanyUrl=function(){
            return awardcompanyUrl;
        }
        //回调方式通过get方法获取数据
        factory.httpGet = function (url, callback) {
          $http.get(url)
          .success(function(data){
              callback(data);
          })

        };
        //回调方式通过post方法获取数据
        factory.httpPost = function (url,params,callback){
          $http({
                method : 'POST',
                url : url,
                data : $.param(params),
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
            }).success(function(data){
              callback(data);
            }).error(function(data){
              callback(data);
            });
        };
        return factory;
    }]);