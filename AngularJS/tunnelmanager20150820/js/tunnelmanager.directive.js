tunnelmanagerModule.directive('renderFinished',['$timeout',function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
        	if(attrs.renderFinished == "htableHeight"){
        		$timeout(function(){
        			 var body_st = document.body.scrollTop;
                     if(body_st == 0){
                      body_st = document.documentElement.scrollTop;
                     }
        			var h_height = ($(document.body).height()+body_st-200)+"px";
        			$('.h_tableHeight').css({"height":h_height});
        			window.onresize = function(){
        				 var body_st = document.body.scrollTop;
                         if(body_st == 0){
                          body_st = document.documentElement.scrollTop;
                         }
                         var h_height = ($(document.body).height()+body_st-200)+"px";
             			$('.h_tableHeight').css({"height":h_height});
        			}
        		})
        	}
        }
    };
}]);

//切换 <li toggle-class="classname"></li>
tunnelmanagerModule.directive('toggleClass', function(){
    return {
        restrict: 'A',
        scope: {
            toggleClass: '@'
        },
        link: function($scope, $element){
            $element.on('click', function(){
                $element.toggleClass($scope.toggleClass);
            });
        }
    };
});

//切换选项卡
tunnelmanagerModule.directive('activeClass', function(){
    return {
        restrict: 'A',
        scope: {
            activeClass: '@'
        },
        link: function($scope, $element){
            $element.on('click', function(){
                $element.addClass($scope.activeClass).siblings().removeClass($scope.activeClass);
            });
        }
    };
});

//<div ui-grid="gridOptions"  class="grid"  myuigrid-height="gridHeight"></div>
/*tunnelmanagerModule.directive('myuigridHeight',['$timeout',function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            if(attrs.myuigridHeight == "gridHeight"){
                $timeout(function(){
                   // var body_st = document.body.offsetHeight;
                    //var h_height = (body_st-20)+"px";
                    var body_st = document.body.scrollTop;
                     if(body_st == 0){
                      body_st = document.documentElement.scrollTop;
                     }
                    var h_height = ($(document.body).height()+body_st-100)+"px";
                    element.css({"height":h_height});
                    window.resize = function(){
                       var body_st = document.body.scrollTop;
                        if(body_st == 0){
                          body_st = document.documentElement.scrollTop;
                        }
                        var h_height = ($(document.body).height()+body_st-100)+"px";
                        element.css({"height":h_height});
                    }
                })
            }
        }
    };
}]);*/