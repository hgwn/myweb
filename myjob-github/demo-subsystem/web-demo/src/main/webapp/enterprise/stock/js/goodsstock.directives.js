


//日期1指令
comGoodstockModule.directive("date1",function(){
    return {
        restrict:"A",
        link:function(scope, element, attr){
            element.bind("click", function () {
                window.WdatePicker({maxDate:'#F{$dp.$D(\'ecreatedtime\')}',
                    onpicked: function () {
                        scope.$apply(scope.formData.screatedtime = this.value);
                    },oncleared:function(){
                        scope.$apply(scope.formData.screatedtime = "");
                    }
                });
            });
        }
    };
});

//日期2指令
comGoodstockModule.directive("date2",function(){
    return {
        restrict:"A",
        link:function(scope, element, attr){
            element.bind("click", function () {
                window.WdatePicker({minDate:'#F{$dp.$D(\'screatedtime\')}',
                    onpicked: function () {
                        scope.$apply(scope.formData.ecreatedtime = this.value);
                    },oncleared:function(){
                        scope.$apply(scope.formData.ecreatedtime = "");
                    }
                });
            });
        }
    };
});