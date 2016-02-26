angular.module('masgetWebApp.goodsAdd').directive('renderFinished',['$timeout',function ($timeout) {
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
