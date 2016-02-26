goodsModule.directive('renderFinished',['$timeout',function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
        	if(attrs.renderFinished == "productShow"){
        		$timeout(function(){
        			 var body_st = document.body.scrollTop;
                     if(body_st == 0){
                      body_st = document.documentElement.scrollTop;
                     }
        			var h_height = ($(document.body).height()+body_st-$('.h_goodsQuery').height())+"px";
        			$('.h-productShow').css({"height":h_height,"background-color":"#fff"});
        			window.resize = function(){
        				 var body_st = document.body.scrollTop;
                         if(body_st == 0){
                          body_st = document.documentElement.scrollTop;
                         }
            			var h_height = ($(document.body).height()+body_st-$('.h_goodsQuery').height())+"px";
            			$('.h-productShow').css({"height":h_height,"background-color":"#fff"});
        			}
        		})
        	}
        }
    };
}]);

goodsModule.directive('renderFinished',['$timeout',function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
        	if(attrs.renderFinished == "picture"){
        		$timeout(function(){
        			$("#goodsAdd-imgUl  div.goodsAdd-img").hover(function(){
        				$(this).find("div.goodsAdd-imgaction").show();	
        			},function(){
        				$(this).find("div.goodsAdd-imgaction").hide();
        			})
        		})
        	}
        }
    };
}]);
