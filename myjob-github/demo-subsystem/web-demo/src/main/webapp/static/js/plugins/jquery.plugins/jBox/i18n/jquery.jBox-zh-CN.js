var jBoxConfig={};jBoxConfig.defaults={id:null,top:"15%",border:5,opacity:.1,timeout:0,showType:"fade",showSpeed:"fast",showIcon:!0,showClose:!0,draggable:!0,dragLimit:!0,dragClone:!1,persistent:!0,showScrolling:!0,ajaxData:{},iframeScrolling:"auto",title:"jBox",width:350,height:"auto",bottomText:"",buttons:{"确定":"ok"},buttonsFocus:0,loaded:function(o){},submit:function(o,t,e){return!0},closed:function(){}},jBoxConfig.stateDefaults={content:"",buttons:{"确定":"ok"},buttonsFocus:0,submit:function(o,t,e){return!0}},jBoxConfig.tipDefaults={content:"",icon:"info",top:"40%",width:"auto",height:"auto",opacity:0,timeout:3e3,closed:function(){}},jBoxConfig.messagerDefaults={content:"",title:"jBox",icon:"none",width:350,height:"auto",timeout:3e3,showType:"slide",showSpeed:600,border:0,buttons:{},buttonsFocus:0,loaded:function(o){},submit:function(o,t,e){return!0},closed:function(){}},jBoxConfig.languageDefaults={close:"关闭",ok:"确定",yes:"是",no:"否",cancel:"取消"},$.jBox.setDefaults(jBoxConfig);