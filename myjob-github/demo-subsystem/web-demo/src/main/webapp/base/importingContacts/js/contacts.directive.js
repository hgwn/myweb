angular.module('masgetWebApp.contacts')
.directive('onFinishRenderFilters', function ($timeout, $q, $sce, utils, $state, $popover,$http,Upload) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
        	 if(attr.onFinishRenderFilters == "list"){
        		 $scope.$watch("addContactModel.scenetypeid", function (newVal, oldVal) {
        			 if(newVal!=null){
        				 utils.query("/jsbweb/contacts.do?type=group.getbyscenetype&scenetypeid=" + newVal).then(function (resp) {
        					 $scope.addContactModel.optionGroups = resp.data.rows;
        				 })
        			 }
        		 })
        		 if($scope.importType == "import"){
        			 $scope.$watch('files', function () {
        				 $scope.upload($scope.files);
        			 });
        		 }
				 $(window).resize(function () {
					 var height = $('#stationForm',element).height();
					 $("#LchargeModel", element).css("height", (document.documentElement.clientHeight - 40 - height) + "px");
				 });
				 $timeout(function(){
					 var height = $('#stationForm',element).height();
					 $("#LchargeModel", element).css("height", (document.documentElement.clientHeight -  40 - height) + "px");
				 })
        	 }else if(attr.onFinishRenderFilters == "import"){
				 $(window).resize(function () {
					 $("#ImportModel", element).css("height", (document.documentElement.clientHeight -  80) + "px");
				 });
				 $timeout(function(){
					 $("#ImportModel", element).css("height", (document.documentElement.clientHeight - 80) + "px");
				 })
			 }
        }
    };
})