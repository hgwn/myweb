/**
 * 小数及精度指令
 * 主要用于使表单input控件的model值以小数形式展现,效果为:当输入框失去焦点时，输入框的值变为含指定精度的小数。
 * 注:input的类型只能为text
 * 
 * author:chenxiaoqun
 * date：20150821
 */
var decimalModule = angular.module("util.decimal",[]);
decimalModule.directive("decimal",[function(){
	return {
        require: 'ngModel',
        scope:{
        	ngModel:"=",
        	precision:"@" //精度值
        },
        link: function(scope, element, attrs) {
        	//若页面没有赋予precision精度值，则取默认精度值2
        	var precision = 2;
        	if(angular.isUndefined(scope.precision) == false&&!isNaN(scope.precision)){
        		precision = parseInt(scope.precision);
        	}
        	//初始化input显示形式--保留precision位精度的小数
        	if(!isNaN(scope.ngModel)){
				 scope.ngModel = parseFloat(scope.ngModel).toFixed(precision);
			}
			
        	//如果input可输入，则在input失去焦点时，将model的值转化为保留precision位精度的小数
			if(attrs.readonly != true&&attrs.disabled != true) {
				element.bind("blur", function() {
					if (!isNaN(scope.ngModel) && scope.ngModel != null && scope.ngModel != '') {
						scope.$apply(scope.ngModel = parseFloat(scope.ngModel).toFixed(precision));
					}
				});
			}
			//如果input为只读或不可用，则实时捡测model的值并转化为保留precision位精度的小数
			else{
				scope.$watch("ngModel",function() {
					if(!isNaN(scope.ngModel)){
						scope.ngModel = parseFloat(scope.ngModel).toFixed(precision);
					}
				});
			}
        }
    };
}]);