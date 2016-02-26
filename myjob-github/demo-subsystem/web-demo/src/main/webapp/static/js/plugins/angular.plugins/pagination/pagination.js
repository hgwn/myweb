 /* 分页指令 v2
 *
 * author:chenxiaoqun
 * date：20150609
 */
var paginationModule=angular.module("util.pagination",[]);
paginationModule.directive("pagination",["$timeout",function($timeout){
	var flag=false;
	//分页指令关键代码
    return{
        restrict: "E",
        replace:true,
        templateUrl:'/masgetweb/static/js/plugins/angular.plugins/pagination/template/pagination_v2.html',
        scope:{
            recordcount:"@",
            curpagenum:"=pagenum",
            curpagesize:"=pagesize",
            onselect:"&",
            maxSize:"@",
            isHidePagesizeList:"@",
            isHidePagenumInput:"@",
            isHideSummaryInfo:"@",
            isHidePrePageLink:"@",
            isHideNextPageLink:"@",
            pagesizeSelectStyle:"="
        },
        
        link:function(scope,element,attrs){
        	
        	//分页工具对象
            scope.paging={
                maxSize:7,
                pages:[],
                pageNum:1,
                pageSize:5,
                num:1,
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
                        },0.1);
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
                },
                //跳转到指定页数
                skipToPage:function(page){
                    this.pageNum=page.pageNum;
                    $timeout(function(){
                        scope.onselect();
                    },0.1);
                },
                changePageNum:function(){
                    this.pageNum=this.num;
                    $timeout(function(){
                        scope.onselect();
                    },0.1);
                }
            };
            
            scope.$watch("curpagesize",function(newValue){
    			if(newValue!=null){
    				scope.paging.pageSize=newValue;
            	}
    		});
            
            scope.$watch("curpagenum",function(newValue){
            	if(newValue!=null){
            		scope.paging.pageNum=newValue;
            	}
    		});
        	
        	//将paging对象的pageNum和pageSize的值同步到curpagenum和curpagesize变量
        	scope.$watch("paging.pageNum",function(newValue){
        		if(newValue!=null){
        			scope.curpagenum=newValue;
        		}
        	});
        	scope.$watch("paging.pageSize",function(newValue){
        		if(newValue==null) return;
        		scope.curpagesize=newValue;
                angular.forEach(scope.paging.pages, function (page) {
                    if (page.pageNum == scope.paging.pageNum) {
                        page.isActive = true;
                    } else {
                        page.isActive = false;
                    }
                });
        	});
        	
        	//构建分页列表
        	var bulid=function(){
        		
        		var p=scope.paging;
        		p.pages=[];
    			var maxSize=0;
    			if(!angular.isUndefined(scope.maxSize)&&scope.maxSize!=''){
    				maxSize= parseInt(scope.maxSize);
    			}else{
    				maxSize= parseInt(p.maxSize);
    			}
    			var pageCount=p.getPageCount();
    			
    			if(maxSize>=pageCount){
    				for(var i=1;i<=pageCount;i++){
    					p.pages.push({pageNum:i,isActive:false});
    				}
    				angular.forEach(p.pages, function (page) {
    					if (page.pageNum == p.pageNum) {
    						page.isActive = true;
    					} else {
    						page.isActive = false;
    					}
    				});
    				return;
    			}
    			
    			if(p.pageNum>=1&&p.pageNum<= Math.ceil(maxSize/2)){
    				for(var i=1;i<=(pageCount>maxSize?maxSize:pageCount);i++){
    					p.pages.push({pageNum:i,isActive:false});
    				}
    				angular.forEach(p.pages, function (page) {
    					if (page.pageNum == p.pageNum) {
    						page.isActive = true;
    					} else {
    						page.isActive = false;
    					}
    				});
    				
    			}else if(p.pageNum>= (pageCount-Math.floor(maxSize/2))&&p.pageNum<= pageCount){
    				for(var i=(pageCount- maxSize+1);i<= pageCount;i++){
    					p.pages.push({pageNum:i,isActive:false});
    				}
    				angular.forEach(p.pages, function (page) {
    					if (page.pageNum == p.pageNum) {
    						page.isActive = true;
    					} else {
    						page.isActive = false;
    					}
    				});
    				
    			}else{
    				for(var i=(p.pageNum-Math.floor(maxSize/2));i<=(p.pageNum-Math.floor(maxSize/2)+ maxSize-1);i++){
    					p.pages.push({pageNum:i,isActive:false});
    				}
    				angular.forEach(p.pages, function (page) {
    					if (page.pageNum == p.pageNum) {
    						page.isActive = true;
    					} else {
    						page.isActive = false;
    					}
    				});
    			}
        	}

        	scope.$watch("recordcount",function(){
        		scope.$watch("paging.pageNum",function(value){
        			
        			var p=scope.paging;
        			p.num=value;
        			if(!angular.isUndefined(scope.curpagesize)){
        				scope.pageSize=scope.curpagesize;
                	}
        			if(!angular.isUndefined(scope.curpagenum)){
                		p.pageNum=scope.curpagenum;
                	}
        			bulid();
        			
        		});
        		
        		scope.$watch("paging.pageSize",function(value){
        			
        			var p=scope.paging;
        			p.num=p.pageNum;
        			if(!angular.isUndefined(scope.curpagesize)){
        				scope.pageSize=scope.curpagesize;
                	}
        			if(!angular.isUndefined(scope.curpagenum)){
                		p.pageNum=scope.curpagenum;
                	}
        			bulid();
        			
        		});
        	});
        	
        	scope.onChange=function(){
        		$timeout(function(){
                    scope.onselect();
                },0.1);
        	};
        }
    }
}]);