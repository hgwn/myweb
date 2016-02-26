operationsModule.controller('membersImportCtrl', ['$scope', '$http', '$state', '$sce','utils','Upload', function ($scope, $http, $state, $sce,utils,Upload) {
// upload later on form submit or something similar
    $scope.submit = function(event) {
        $scope.uploadComplete = false;
        var target = $(event.target);
        var progressBar = $("#fileUploadProgress");
        target.attr("disabled","disabled");
        target.text("开始上传...")
        Upload.upload({
            url: '/masgetweb/rboperationsmanager/base/import.do',
            file: $scope.file
        }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            progressBar.css("width",progressPercentage+"%");
            progressBar.text(progressPercentage+"%");
            if(progressPercentage == 100){
                target.text("上传完成，正在导入...");
                $scope.uploadComplete = true;
            }
            }).success(function (data, status, headers, config) {
                target.removeAttr("disabled");
                target.text("导入完成");

                $scope.path = data.excelPath;
                $scope.erroMsg = data.message;
                $scope.errorList = data.fails;
            }).error(function (data, status, headers, config) {
                target.removeAttr("disabled");
                target.text("导入失败");
            })
    };

    $scope.downloadExcel = function(){
        if($scope.errorList.length == 0){
            $alert("无错误记录！");
            return;
        }
        window.open("/masgetweb/rboperationsmanager/base/downloadExcel.do?path="+$scope.path);
    }

    $scope.fileChange = function(){
        if($scope.file.length>0)
        $scope.fileName = $scope.file[0].name;
    }

    $scope.fileDrop = function(){
        $scope.fileName = $scope.file[0].name;
    }
}])