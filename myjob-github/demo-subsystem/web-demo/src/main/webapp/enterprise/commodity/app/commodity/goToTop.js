$(function () {
    $("#sidepanel").fadeOut(10);
    $(window).scroll(function(){
    	//当滚动条的位置处于距顶部100像素以下时，跳转链接出现，否则消失
        if ($(window).scrollTop()>100){
            $("#sidepanel").fadeIn(500);
        }else{
            $("#sidepanel").fadeOut(500);
        }
    }); 
    //当点击跳转链接后，回到页面顶部位置
 
    $("#sidepanel").click(function(){
	    $('body,html').animate({scrollTop:0},300);
	    return false;
    });
});