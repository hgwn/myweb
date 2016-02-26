/**
 * 下拉表格指令
 *
 * author:chenxiaoqun
 * date：20150605
 */
angular.module("util.comboxtable", [])
    .directive("comboxtable", ["$timeout", function ($timeout) {
        return {
            restrict: 'E',
            templateUrl: "/jsbweb/static/js/plugins/angular.plugins/comboxtable/template/box.html",
            replace: false,
            scope: {
                name: "@",
                modelObj: "=ngModel",
                keyWord: "=keyWord",
                columnNames: "=columnNames",
                columnFields: "=columnFields",
                textField: "@",
                datas: "=",
                onChange: "&onChange", 
                onReset: "&onReset", 
                isRequired: "@", //标示是否必填
                isDisabled:"=", //标示可不可用
                isAlwaysRepsClick:"=isAlwaysRepsClick",
                contentStyle:"@",
                isShowIndex: "@",
                inputClass: "@",
                inputStyle: "@",
                inputHeight:"@",
                inputPlaceholder:"@",
                isShowPagination:"@",
                recordcount:"@",
                curpagenum:"=pagenum",
                curpagesize:"=pagesize"
            },
            compile: function (tEle, tAttrs, linker) {
            	if (tAttrs.isRequired == 'true') {
                    tEle.find(".model-input").attr("required", "required");
                } 
                tEle.find(".comboxtable-container").attr("style", tAttrs.contentStyle);
                tEle.find(".model-input").attr("name", tAttrs.name);
                tEle.find(".model-input").attr("style", tAttrs.inputStyle+";width:100%");
                tEle.find(".model-input").addClass(tAttrs.inputClass);
                if(tAttrs.inputHeight!=null&&tAttrs.inputHeight!=''){
                    tEle.find(".model-input").css("height",tAttrs.inputHeight);
                    tEle.find(".comboxtable-container-icon").css("height", tAttrs.inputHeight);
                    tEle.find(".comboxtable-list").css("top", tAttrs.inputHeight);
                    
                }

                return function (scope, element, attrs) {
                	var interval=[];
                	var flag=false;
                    var checkFlag = true;
                	scope.$watch("keyWord",function(newVal,oldVal){
                		scope.newKeyWord=newVal;
                		scope.oldKeyWord=oldVal;
                	});
                	scope.query = function () {
                         if(scope.isDisabled!=true){
                             $timeout(function () {
                                 scope.onChange();
                             }, 10);
                             flag=false;
                         }
                     };
                     scope.reset = function () {
                    	 $timeout(function () {
                    		 scope.onReset();
                    	 },10);
                     };
                     
                     scope.iconClick = function () {
                    	setTimeout(function(){
                    		console.log("tes")
                    		console.log($(".model-input",tEle).html())
                    		console.log(tEle.find(".model-input").val())
                    		tEle.find(".model-input").click();
                    		tEle.find(".model-input").focus();
                    	},1000) 
                         if(scope.isDisabled!=true){
                        	 if(scope.isShowList!=true){
                        		 if(scope.isAlwaysRepsClick){
                        			 $timeout(function () {
                                             scope.onChange();
                                     }, 0.1);
                        		 }
                        		 else if(scope.datas==null||scope.datas.length==0){
                                	 $timeout(function () {
                                         scope.onChange();
                                     }, 0.1);
                                 }
                        	 }
                             scope.showList();
                         }
                     };
                     
                     $(document).click(function(event){
                         if(element.find(event.target).length==0){
                        	 if(scope.isShowList == true){
                        		 scope.$apply(scope.hideList());
                        	 }
                         }
                     });
                     
                     scope.onSelect = function (obj) {
                         scope.hideList();
                         scope.modelObj = obj;
                         scope.keyWord = obj[scope.textField];

                         angular.forEach(scope.datas, function (data) {
                             data.isSelected = false;
                         });
                         obj.isSelected = true;
                         flag=true;
                     };
                     scope.showList = function () {
                         if(scope.isDisabled!=true){
                             scope.isShowList = true;
                         }
                         if(checkFlag){
                             checkFlag = false;
                             scope.query()
                         }
                     };
                     scope.hideList = function () {
                         scope.isShowList = false;
                     };
                     
                     if(scope.isShowPagination=="true"){
                    	 scope.$watch("paging.pageNum",function(newValue){
                        	 scope.curpagenum=newValue;
                     	 });
                     	 scope.$watch("paging.pageSize",function(newValue){
                     		scope.curpagesize=newValue;
                     	 });
                     }
                     scope.selectNext =function(event){
                    	 console.log(event)
                    	//向下按键
                     if(event.keyCode==40){
                    	 scope.showList()
                    	 angular.forEach(scope.datas, function (data,index) {	 
                   			 if(data.isSelected){
                   				scope.selectIndex=index
                   			 }
                                data.isSelected = false;
                            });
                   		 if(typeof scope.selectIndex=="undefined" ){
                   			 scope.selectIndex=-1;
                   		
                   		 }
                   		 else  if((scope.selectIndex+1)>=scope.datas.length){
                   			scope.selectIndex=-1;
                   		 }
                   		 scope.datas[++scope.selectIndex].isSelected=true
                    	}
                    	//向上按键
	                    if(event.keyCode==38){
	                    	scope.selectIndex=0
		                   	 scope.showList()
	                    	 angular.forEach(scope.datas, function (data,index) {	 
	                   			 if(data.isSelected){
	                   				scope.selectIndex=index
	                   			 }
	                                data.isSelected = false;
	                            });
	                   		 if(typeof scope.selectIndex=="undefined" ){
	                   			 scope.selectIndex=1;
	                   		
	                   		 }
	                   		 else  if((scope.selectIndex-1)<0){
	                   			scope.selectIndex=scope.datas.length;
	                   		 }
	                   		 scope.datas[--scope.selectIndex].isSelected=true
                    	}
	                   //向右按键 --下一页
	                    if(event.keyCode==39){
	                    	scope.selectIndex=-1
		                   	 scope.showList()
	                    	if( scope.paging.pageNum+1<=scope.paging.pageSize){
	                    		scope.paging.skipToNext()
	                    	}
	                    	
                    	}
	                     //向左按键 --上一页
	                    if(event.keyCode==37){
		                   	 scope.showList()
	                    	   	 scope.showList()
	                    	if( scope.paging.pageNum-1>0){
	                    		scope.oldKeyWord=""
	                    		scope.paging.skipToPrevious()
	                    	}
                    	}
	                    //回车键
	                    if(event.keyCode==13 && typeof scope.selectIndex!="undefined"){
	                    		scope.onSelect(scope.datas[scope.selectIndex]);
	                    }
                     }
                     
                     //分页工具对象
                     scope.paging={
                         pageNum:1,
                         pageSize:5,
                         //获取总条目数
                         getRecordCount:function(){
                             if(scope.recordcount==null||scope.recordcount==''){
                                 return 0;
                             }
                             return scope.recordcount;
                         },
                         //根据总条目数getRecordCount和每页条目数pageSize计算出总页数
                         getPageCount:function(){
                             var pageCount;
                             if(this.getRecordCount()%this.pageSize==0){
                                 pageCount=this.getRecordCount()/this.pageSize;
                             }else{
                                 pageCount=Math.floor(this.getRecordCount()/this.pageSize)+1;
                             }
                             if(pageCount<this.pageNum){
                                 this.pageNum=1;
                             }
                             return pageCount==0?1:pageCount;
                         },
                         //跳转到首页
                         skipToFirst:function(){
                             if(this.pageNum!=1){
                                 this.pageNum=1;
                                 $timeout(function(){
                                     scope.onChange();
                                 },0.1);
                             }
                         },
                         //跳转到上一页
                         skipToPrevious:function(){
                             if(this.pageNum>1){
                                 this.pageNum=this.pageNum-1;
                                 
                                 if(flag==true){
                                	 scope.keyWord=scope.oldKeyWord;
                                 }else{
                                	 scope.keyWord=scope.newKeyWord;
                                 }
                                    
                                 $timeout(function(){
                                     scope.onChange();
                                 },0.1);
                             }
                         },
                         //跳转到下一页
                         skipToNext:function(){
                             if(this.pageNum<this.getPageCount()){
                                 this.pageNum=this.pageNum+1;
                                 
                                 if(flag==true){
                                	 scope.keyWord=scope.oldKeyWord;
                                 }else{
                                	 scope.keyWord=scope.newKeyWord;
                                 }
                                	 
                                 
                                 $timeout(function(){
                                     scope.onChange();
                                 },0.1);
                             }
                         },
                         //跳转到末页
                         skipToLast:function(){
                             if(this.pageNum!=this.getPageCount()){
                                 this.pageNum=this.getPageCount();
                                 $timeout(function(){
                                     scope.onChange();
                                 },0.1);
                             }
                         },
                         //跳转到指定页数
                         skipToPage:function(page){
                             this.pageNum=page.pageNum;
                             $timeout(function(){
                                 scope.onChange();
                             },0.1);
                         }
                     };
                }
            }
        }
    }]);
