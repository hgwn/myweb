(function(){
    $.mockjax({
        url: '/restful/api',
        responseTime: 10,
        isTimeout: true
    });

  /*  $.mockjax({
        url: "/masgetweb/commonUtils.do?type=district",

        proxy: "/masgetweb/com/assets/district.json"
    });

    $.mockjax({
        url: "/masgetweb/commonUtils.do?type=companytype",

        proxy: "/masgetweb/com/assets/companytype.json"
    });*/
//    $.mockjax.clear();
}())