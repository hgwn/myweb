/**
 * 下拉选择框指令
 *
 * author:chenxiaoqun
 * date：20150611
 */
angular.module("util.commobox", [])
    .directive("commobox", ["$timeout", function ($timeout) {
        return {
            restrict: 'E',
            templateUrl: "/masgetweb/static/js/plugins/angular.plugins/commobox/template/box.html",
            replace: false,
            scope: {
                name: "@",
                modelObj: "=ngModel",
                keyWord: "=keyWord",
                valueField:"@",
                textField: "@",
                datas: "=",
                onChange: "&onChange",
                isRequired: "@", //标示是否必填
                isDisabled:"=", //标示可不可用
                contentStyle:"@",
                isShowIndex: "@",
                inputClass: "@",
                inputStyle: "@",
                inputPlaceholder:"@",
                hasLink:"@",
                linkText:"@",
                findDate:"@",
                linkAction:"&"
            },
            compile: function (tEle, tAttrs, linker) {
                if (tAttrs.isRequired == 'true') {
                    tEle.find("input").attr("required", "required");
                }
                tEle.find(".commobox-container").attr("style", tAttrs.contentStyle);
                tEle.find("input").attr("name", tAttrs.name);
                tEle.find("input").attr("style", tAttrs.inputStyle+";width:100%");
                tEle.find("input").attr("class", tAttrs.inputClass);
                if(tAttrs.inputHeight!=''){
                    tEle.find("input").css("height",tAttrs.inputHeight);
                    tEle.find(".commobox-list").css("top", tAttrs.inputHeight);
                }
                if(tAttrs.hasLink=='true'){
                    tEle.find(".content").css("margin-bottom", 30);
                }

                return function (scope, element, attrs) {
                    scope.query = function (event) {
                        if(scope.isDisabled!=true){
                        	if(event.keyCode!=13)
                        		scope.showList();
                        	
                            $timeout(function () {
                                scope.onChange();
                            }, 0.1);
                        }
                    };

                    $(document).click(function(event){
                        if(element.find(event.target).length==0){
                            scope.$apply(scope.hideList());
                        }
                    });

                    scope.onSelect = function (obj) {
                        scope.hideList();
                        if(scope.valueField!=null){
                            scope.modelObj=obj[scope.valueField];
                        }else{
                            scope.modelObj = obj;
                        }
                        scope.keyWord = obj[scope.textField];

                        angular.forEach(scope.datas, function (data) {
                            data.isSelected = false;
                        });
                        obj.isSelected = true;
                    };

                    scope.$watch("modelObj",function(){
                        if(scope.valueField!=null){
                            angular.forEach(scope.datas, function (data) {
                                data.isSelected=false;
                                if(data[scope.valueField]==scope.modelObj){
                                    data.isSelected = true;
                                    scope.keyWord = data[scope.textField];
                                }
                            });
                        }
                    });
                    
                    scope.selectNext =function(event){
                    	//向下按键
                    	if(event.keyCode==40){
                   		 angular.forEach(scope.datas, function (data,index) {	 
                   			 if(data.isSelected){
                   				scope.selectIndex=index
                   			 }
                                data.isSelected = false;
                            });
                   		 if(typeof scope.selectIndex=="undefined" || scope.selectIndex>(scope.datas.length-2)){
                   			 scope.selectIndex=-1;
                   			$(".commobox-list .content").scrollTop(0)
                   		 }
                   		 else  if(scope.selectIndex>6){
                        	 $(".commobox-list .content").scrollTop( $(".commobox-list .content").scrollTop()+24)
                         }
                   		 scope.datas[++scope.selectIndex].isSelected=true
                        
                    	}
                    	
                    	//向上按键
	                    if(event.keyCode==38){
	                 		 angular.forEach(scope.datas, function (data,index) {	
	                 			 if(data.isSelected){
	                    				scope.selectIndex=index
	                    		 }
	                             data.isSelected = false;
	                            
	                         });
                   	 	 if(typeof scope.selectIndex=="undefined" || scope.selectIndex<1) {
                   	 		 scope.selectIndex=scope.datas.length;
                   	 		$(".commobox-list .content").scrollTop($(".commobox-list .content ul").height()-$(".commobox-list .content").height())
                   	 	 }
                   	 	 else if(scope.selectIndex>6){
                             	 $(".commobox-list .content").scrollTop( $(".commobox-list .content").scrollTop()-24)
                              }
                   	 	 scope.datas[--scope.selectIndex].isSelected=true
                    	}
	                   
	                    //回车键
	                    if(event.keyCode==13 && typeof scope.selectIndex!="undefined"){
	                    		scope.onSelect(scope.datas[scope.selectIndex]);
	                    }
	                 
                    }       
                    scope.showList = function () {
                    	if(scope.findDate){
                    		scope.isShowList = true;
                    		scope.onChange();
                    	}else
                        if(scope.isDisabled!=true && scope.datas && scope.datas.length>0){
                            scope.isShowList = true;
                        }
                    };
                    scope.hideList = function () {
                        scope.isShowList = false;
                    };

                    scope.changeBgColor=function(obj){
                        angular.forEach(scope.datas, function (data) {
                            data.isSelected = false;
                        });
                        obj.isSelected = true;
                    }
                }
            }
        }
    }]);
