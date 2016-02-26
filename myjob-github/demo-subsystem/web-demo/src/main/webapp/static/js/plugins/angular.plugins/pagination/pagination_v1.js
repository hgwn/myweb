/**
 * 分页指令 v1
 *
 * author:chenxiaoqun
 * date：20150526
 */
var paginationModule=angular.module("util.pagination",[]);
paginationModule.directive("pagination",["$timeout",function($timeout){
	
	//分页指令关键代码
    return{
    	//只匹配元素
        restrict: "E",
        replace:true,
        templateUrl:"/masgetweb/static/js/plugins/angular.plugins/pagination/template/pagination_v1.html",
        scope:{
            recordcount:"@",
            curpagenum:"=pagenum",
            curpagesize:"=pagesize",
            onselect:"&"
        },
        link:function(scope,element,attrs){
        	//将paging对象的pageNum和pageSize的值同步到curpagenum和curpagesize变量
        	scope.$watch("paging.pageNum",function(newValue){
        		scope.curpagenum=newValue;
        	});
        	scope.$watch("paging.pageSize",function(newValue){
        		scope.curpagesize=newValue;
        	});
        	
            //分页工具对象
            scope.paging={
                pageNum:1,
                pageSize:5,
                pageSizeList:[5,10,15,20,25,50,100],
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
                        	scope.onselect();
                        },0.1);
                    }
                },
                //跳转到上一页
                skipToPrevious:function(){
                    if(this.pageNum>1){
                        this.pageNum=this.pageNum-1;
                        $timeout(function(){
                        	scope.onselect();
                        },1);
                    }
                },
                //跳转到下一页
                skipToNext:function(){
                    if(this.pageNum<this.getPageCount()){
                        this.pageNum=this.pageNum+1;
                        $timeout(function(){
                        	scope.onselect();
                        },0.1);
                    }
                },
                //跳转到末页
                skipToLast:function(){
                    if(this.pageNum!=this.getPageCount()){
                        this.pageNum=this.getPageCount();
                        $timeout(function(){
                        	scope.onselect();
                        },0.1);
                    }
                }
            };
        }
    }
}]);