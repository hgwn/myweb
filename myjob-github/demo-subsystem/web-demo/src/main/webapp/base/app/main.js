requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'static/js',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        jquery:'base/jquery/jquery.min',
        angularUIRouter: 'base/angular-ui.router',
        angularJs: 'base/angularjs/v.1.3.15',
        angularStrap: 'base/angularstrap',
        bootStrap: 'base/bootstrap/v3.3.4/js/',
        angularUiGrid:'plugins//angular.plugins/angular-ui-grid',
        angularUiTree:'plugins//angular.plugins/angular-ui-tree',
        NgFileUpload:'plugins/angular.plugins/ng-file-upload',
        selectAddress:'plugins/angular.plugins/address-selector',
        scrollBar:'plugins/angular.plugins/scrollBar',
        jqueryPlugin:'plugins/jquery.plugins',
        app:'../../base/app',
        utils:'../../base/app/common/utils',
        login:'../../base/login',
        home:'../../base/app/home',
        buzcircle:'../../base/app/buzCircle',
        contacts:'../../base/app/contacts',
        my:'../../base/app/my',
        find:'../../base/app/find',
        mgchat:'../../base/app/mgchat',
        emojify:'plugins/jquery.plugins/emojify',
        Long:'plugins/jquery.plugins/mqtt/Long.min',
        mqtt:'plugins/jquery.plugins/mqtt/mqtt',
        MQTT:'plugins/jquery.plugins/mqtt',
        ByteBuffer:'plugins/jquery.plugins/mqtt/ByteBufferAB',
        treeView:'../../base/app/common/treeView/treeView',
        schedule:'../../base/app/schedule',
        notice:'../../base/app/notice',
        rboperationsmanager:'../../rboperationsmanager/js',
        accountCheck:'../../rboperationsmanager/js/accountcheck',
        workflow:'../../base/workflow/js',
        scheduleManage:'../../base/scheduleManage/js'
    },

    //缓存控制

//    urlArgs: "bust=" +  (new Date()).getTime(),

    //Remember: only use shim config for non-AMD scripts,
    //scripts that do not already call define(). The shim
    //config will not work correctly if used on AMD scripts,
    //in particular, the exports and init config will not
    //be triggered, and the deps config will be confusing
    //for those cases.
    shim: {
    }
});

requirejs.onError = function (err) {
    console.log(err.requireType);
    if (err.requireType === 'timeout') {
        console.log('modules: ' + err.requireModules);
    }
    throw err;
};

requirejs.onResourceLoad = function (context, map, depArray) {

};

// Start the main app logic.
requirejs([
        'scrollBar/ngscrollbar',
        'angularJs/angular-animate',
        'angularJs/angular-messages',
        'angularJs/angular-locale_zh',
        'angularStrap/angular-strap',
        'jqueryPlugin/jQuery.md5'
    ],
    function   (app) {
        //jQuery, canvas and the app/sub module are all
        //loaded and can be used here now.
        requirejs(['app/app','angularStrap/angular-strap.tpl'],function(app){
            app.bootstrap();
        });
    });