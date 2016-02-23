angular.module('tunnelmanager.Service',[])
    .factory('tunnelmanagerService',['$http',function($http){
        var factory = {};
        /*
           *
           *内部组管理接口
           *======================
        */

        //增加内部终端号组
        var addinterterminalgroupUrl = '/masgetweb/tunnelmanager/interGroup/interterminalgroup_add.do';
        //修改内部终端号组
        var modifyinterterminalgroupUrl = '/masgetweb/tunnelmanager/interGroup/interterminalgroup_modify.do';
        //查询内部终端号组
        var queryinterterminalgroupUrl = '/masgetweb/tunnelmanager/interGroup/interterminalgroup_query.do';
        //查询内部终端号组里面的内部商户号
        var queryintergroupsinterterminalUrl = '/masgetweb/tunnelmanager/interGroup/intergroupsinterterminal_query.do';
        //增加内部组里面的内部商户号
        var addintergroupsinterterminalUrl = '/masgetweb/tunnelmanager/interGroup/intergroupsinterterminal_add.do';
        //根据内部终端号组去关联外部终端号组  根据内部终端号组去删除外部终端号组
        var intergroupsrelationextergroupsUrl = '/masgetweb/tunnelmanager/interGroup/intergroupsrelationextergroups_add.do';
        //根据内部终端号组去查询关联外部终端号组
        var queryintergroupsrelationextergroupsUrl = '/masgetweb/tunnelmanager/interGroup/intergroupsrelationextergroups_query.do';
        //查询内部终端号
        var queryinternalmernoUrl = '/masgetweb/tunnelmanager/interGroup/get_internalmerno.do';
        //操作内部终端号接口—暂时只能修改状态
        var operateinternalmernoUrl = '/masgetweb/tunnelmanager/interGroup/internalmerno_operate.do';
        //查询内部商户号接口
        var queryInternalmercodeUrl = '/masgetweb/tunnelmanager/interGroup/internalmercode_query.do';
        //操作内部商户号接口—暂时只是修改状态
        var operateInternalmercodeUrl = '/masgetweb/tunnelmanager/interGroup/internalmercode_operate.do';


         /*
           *
           *外部组管理接口
           *======================
        */

        //增加外部终端号组
        var addexterterminalgroupUrl = '/masgetweb/tunnelmanager/extergroup/exterterminalgroup_add.do';
        //修改外部终端号组
        var modifyexterterminalgroupUrl = '/masgetweb/tunnelmanager/extergroup/exterterminalgroup_modify.do';
        //查询外部终端号组
        var queryexterterminalgroupUrl = '/masgetweb/tunnelmanager/extergroup/exterterminalgroup_query.do';
        //查询外部终端号组里面的外部商户号
        var queryextergroupsexterterminalUrl = '/masgetweb/tunnelmanager/extergroup/extergroupsexterterminal_query.do';
        //增加外部组里面的外部商户号
        var addextergroupsexterterminalUrl = '/masgetweb/tunnelmanager/extergroup/extergroupsextertermina_add.do';
        //根据外部终端号组去关联内部终端号组  根据外部终端号组去删除内部终端号组
        var extergroupsrelationintergroupsUrl = '/masgetweb/tunnelmanager/extergroup/extergroupsrelationintergroups_add.do';
        //根据外部终端号组去查询关联内部终端号组
        var queryextergroupsrelationintergroupsUrl = '/masgetweb/tunnelmanager/extergroup/extergroupsrelationintergroups_query.do';
        //查询外部终端号
        var queryexternalmernoUrl = '/masgetweb/tunnelmanager/extergroup/get_externalmerno.do';
        //操作外部终端号接口—暂时只能修改状态
        var operateexternalmernoUrl = '/masgetweb/tunnelmanager/extergroup/externalmerno_operate.do';
        //查询外部商户号接口
        var queryExternalmercodeUrl = '/masgetweb/tunnelmanager/extergroup/externalmercode_query.do';
        //操作外部商户号接口—暂时只能修改状态
        var operateExternalmercodeUrl = '/masgetweb/tunnelmanager/extergroup/externalmercode_operate.do';


        /*
           *
           *公共管理接口
           *======================
        */
        //删除内外部终端号组
        var deletegroupUrl = '/masgetweb/tunnelmanager/com/group_delete.do';
        //删除组里面的内外部商户号
        var deletetunnelreflectUrl = '/masgetweb/tunnelmanager/com/tunnelreflect_delete.do';
        //根据内部终端号查询所有关于终端号的关联信息
        var allbyinterterminalUrl = '/masgetweb/tunnelmanager/com/allbyinterterminal_query.do';
        //根据外部终端号查询所有关于终端号的关联信息
        var allbyexterterminalUrl = '/masgetweb/tunnelmanager/com/allbyexterterminal_query.do';
        //查询支付通道
        var queryPaymentchannelcodeUrl ='/masgetweb/tunnelmanager/com/paymentchannelcode_query.do';
        //操作支付通道
        var operatePaymentchannelcodeUrl ='/masgetweb/tunnelmanager/com/paymentchannelcode_operate.do';

         /*
           *
           *一对一绑定接口
           *======================
        */
        //查询一对一绑定
        var queryInterterminal1to1exterterminalUrl = '/masgetweb/tunnelmanager/oneToOne/interterminal1to1exterterminal_query.do';
        //添加/删除一对一绑定
        var interterminal1to1exterterminalUrl = '/masgetweb/tunnelmanager/oneToOne/interterminal1to1exterterminal.do';

        factory.getAddinterterminalgroupUrl = function(){
        	return addinterterminalgroupUrl;
        }
        factory.getAddexterterminalgroupUrl = function(){
        	return addexterterminalgroupUrl;
        };
        factory.getModifyinterterminalgroupUrl = function(){
        	return modifyinterterminalgroupUrl;
        };
        factory.getModifyexterterminalgroupUrl = function(){
        	return modifyexterterminalgroupUrl;
        };
        factory.getQueryinterterminalgroupUrl = function(){
            return queryinterterminalgroupUrl;   //查询内部终端号组
        };
        factory.getQueryexterterminalgroupUrl = function(){
            return queryexterterminalgroupUrl;   //查询外部终端号组
        };
        factory.getDeletegroupUrl = function(){
            return deletegroupUrl;
        };
        factory.getQueryintergroupsinterterminalUrl = function(){
            return queryintergroupsinterterminalUrl;
        };
        factory.getQueryextergroupsexterterminalUrl = function(){
            return queryextergroupsexterterminalUrl;
        };
        factory.getAddintergroupsinterterminalUrl = function(){
            return addintergroupsinterterminalUrl;
        };
        factory.getAddextergroupsexterterminalUrl = function(){
            return addextergroupsexterterminalUrl;
        };
        factory.getIntergroupsrelationextergroupsUrl = function(){
            return intergroupsrelationextergroupsUrl;
        };
        factory.getExtergroupsrelationintergroupsUrl = function(){
            return extergroupsrelationintergroupsUrl;
        };
        factory.getQueryintergroupsrelationextergroupsUrl = function(){
            return queryintergroupsrelationextergroupsUrl;
        };
        factory.getQueryextergroupsrelationintergroupsUrl = function(){
            return queryextergroupsrelationintergroupsUrl;
        };
        factory.getDeletetunnelreflectUrl = function(){
            return deletetunnelreflectUrl;
        };
        factory.getQueryinternalmernoUrl = function(){
            return queryinternalmernoUrl;    //查询内部终端号
        };
        factory.getOperateinternalmernoUrl = function(){
            return operateinternalmernoUrl;    //操作内部终端号
        };
        factory.getQueryexternalmernoUrl = function(){
            return queryexternalmernoUrl;    //查询外部终端号
        };
        factory.getOperateexternalmernoUrl = function(){
            return operateexternalmernoUrl;    //操作外部终端号
        };
        factory.getAllbyinterterminalUrl = function(){
            return allbyinterterminalUrl;    //根据内部终端号查询所有关于终端号的关联信息
        };
        factory.getAllbyexterterminalUrl = function(){
        	return allbyexterterminalUrl;    //根据外部终端号查询所有关于终端号的关联信息
        };
        factory.getInterterminal1to1exterterminalUrl = function(){
            return interterminal1to1exterterminalUrl;     //绑定一对一
        };
        factory.getQueryInterterminal1to1exterterminalUrl = function(){
            return queryInterterminal1to1exterterminalUrl;  //查询绑定一对一
        };

        factory.getQueryPaymentchannelcodeUrl = function(){
            return queryPaymentchannelcodeUrl;  //查询支付通道
        };
        factory.getPaymentchannelcodeUrl = function(){
            return operatePaymentchannelcodeUrl;  //操作支付通道
        };
        factory.getQueryExternalmercodeUrl = function(){
            return queryExternalmercodeUrl;  //查询外部商户号
        };
        factory.getOperateExternalmercodeUrl = function(){
            return operateExternalmercodeUrl;  //操作外部商户号
        };
        factory.getQueryInternalmercodeUrl = function(){
            return queryInternalmercodeUrl; //查询内部商户号
        };
        factory.getOperateInternalmercodeUrl = function(){
            return operateInternalmercodeUrl;    //操作内部商户号
        };
        //回调方式通过get方法获取数据
        factory.httpGet = function (url, callback) {
            $http.get(url).then(function (data) {
                //console.log(data);
                if(data.status==500){
                    $.jBox.info("服务器繁忙，请重新刷新页面！","温馨提示");
                    return;
                }
                callback(data.data);
            });
           /* $http.get(url)
            .success(function(data){
                callback(data);
            })*/

        };
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