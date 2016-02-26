angular.module('masgetWebApp.com.goodsstock').directive('renderFinished',['$timeout',function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
        	if(attrs.renderFinished == "htableBox"){
        		$timeout(function(){
        			 var body_st = document.body.scrollTop;
                     if(body_st == 0){
                      body_st = document.documentElement.scrollTop;
                     }
        			var h_height = ($(window.parent).height()+body_st-$('.h_formBox').height()-$('#dialog').height()-50)+"px";
        			$('.h_tableBox').css({"height":h_height,"background-color":"#fff"});
        			window.resize = function(){
        				var body_st = document.body.scrollTop;
                        if(body_st == 0){
                         body_st = document.documentElement.scrollTop;
                        }
           			    var h_height = ($(window.parent).height()+body_st-$('.h_formBox').height()-$('#dialog').height()-50)+"px";
           			    $('.h_tableBox').css({"height":h_height,"background-color":"#fff"});
        			}
        		})
        	}
        }
    };
}]);
