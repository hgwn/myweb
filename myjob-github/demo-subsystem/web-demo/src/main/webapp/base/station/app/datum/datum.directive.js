angular.module('masgetWebApp.datum')
.directive('onFinishRenderFilters', function ($timeout, $q, $sce, utils, $state, $popover,$http) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
        	
            if(attr.onFinishRenderFilters == "edit"){
                $timeout(function(){
                	
                	 var companyid = utils.session.data.companyid;
                	 var stationid = utils.session.data.stationid;
                	 if($state.broadCast!=null&&$state.broadCast!=''&&$state.broadCast!=undefined&&$state.broadCast.detail!=null){
	        	        	 var id = $state.broadCast.detail.id;
	        	        	 $('#comtree').combotree({
	       	        		    url: '/jsbweb/base/stationdatum/plistData.do?id='+id,
	       	        		 });
	        	         }else{
	        	        	 $('#comtree').combotree({
	    	        		    url: '/jsbweb/base/stationdatum/plistData.do',
	    	        		 });
	        	         }
        	         
        	         if($state.broadCast!=null&&$state.broadCast!=''&&$state.broadCast!=undefined&&$state.broadCast.detail!=null){
        	        	 if($state.broadCast.detail.pstationid==0){
        	        		 $('#comtree').combotree('setValue',  ""); 
        	        	 }else{
        	        		 $('#comtree').combotree('setValue',  $state.broadCast.detail.pstationid); 
        	        	 }
        	         }else{
        	        	 $('#comtree').combotree('setValue',stationid); 
        	         }
        	         
        	         $state.broadCast={};
        	         
                });
            }else{
				$(window).resize(function () {
					$("#stationModel", element).css("height", (document.documentElement.clientHeight - 60) + "px");
				});
				$timeout(function(){
					$("#stationModel", element).css("height", (document.documentElement.clientHeight - 60) + "px");
				})
			}
        }
    };
})