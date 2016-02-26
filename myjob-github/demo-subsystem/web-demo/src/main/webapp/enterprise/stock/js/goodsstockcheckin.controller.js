var changewarehouseModule= angular.module('changewarehousein',[]);

changewarehouseModule.controller('goodsstockcheckinController',['$scope','$http','Upload',function($scope,$http,Upload){
	//定义数据对象
    $scope.addFormData={};
    $scope.addFormData.goodsstockcheckinlist = [];

    $scope.formData={};
    $scope.formData.pagesize = 10;
    $scope.formData.pagenum = 1;
    $scope.IngridOptions={};
    
    //新增一行移库单数据
    $scope.addrecord=function(){
        var temp={};
        temp.goodsid=0; //默认值
        temp.goodsname="";
        temp.skuid="";
        temp.weight="";
        temp.goodsqty=0;
        temp.damageqty=0;
        $scope.addFormData.goodsstockcheckinlist.push(temp);
    };
    
    //删除一行移库单数据
    $scope.delHouseAddRecord=function(index){
        $scope.addFormData.goodsstockcheckinlist.splice(index, 1);
    };
    
        
    //goodsstockcheckAddQuery
    $scope.queryFormData={};
    $scope.goodsstockcheckAddQuery = function(){
    	
    	$http({
            method : 'POST',
            url :"/jsbweb/enterprise/com/getbycompany_goodssku.do",
            data : "goodsid="+$scope.queryFormData.keyWord,
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {
            $scope.goodsstockData=data;
           // console.log($scope.goodsstockData)
        }).error(function(){
			console.log("error.....");
		});
    }



    //查询实时库存信息
    /*$scope.queryForm = function(){
        $http({
            method:'POST',
            url:'/jsbweb/enterprise/com/get_goodsstock.do',
            data: $.param($scope.formData),
            headers:{ 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data){
            if(data.ret==100){
                $.jBox.tip("请先登录", 'warning');
                return;
            }
            $scope.goodsstockData=data;
            console.log("实时库存信息...");
            console.log($scope.goodsstockData);
        }).error(function(resp){
            console.log("error...");
        });
    }
    $scope.queryForm();*/

	 //showaddmodal函数 生成入库单号
    $scope.showaddmodal=function(){
    	if($scope.addFormData.warehouseinnum ==""||$scope.addFormData.warehouseinnum==undefined){
    		 var today = new Date();
             var year = today.getFullYear();
             var month = (today.getMonth()  + 1) < 10  ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
             var day      = (today.getDate())  < 10 ? '0' + (today.getDate()) : (today.getDate());
             var hours    = (today.getHours()) < 10 ? '0' + (today.getHours()) : (today.getHours());
             var minutes    = (today.getMinutes()) < 10 ? '0' + (today.getMinutes()) : (today.getMinutes());
             var seconds  = (today.getSeconds()) < 10 ? '0' + (today.getSeconds()) : (today.getSeconds());
             $scope.addFormData.warehouseinnum= "RK"+year +  month  + day +  hours +   minutes +  seconds;
    	}
    	//$scope.addFormData.changewarehouselist=[];
    	//$scope.addrecord();
       
    };
    $scope.showaddmodal();
	 $scope.datetimepickerInit = function () {
         $("#txt_createdtime").datetimepicker({
             language: 'zh-CN',
             autoclose: true,
             todayBtn: true,
             pickerPosition: "bottom-left",
             todayHighlight: true
         });
     };
     
     
     
     $scope.IngridOptions = { 
    		 enableCellEditOnFocus : true,
    		 enableColumnMenus: false,
    		 columnDefs : [
    		               	{ name:'操作',field:'action',
    		                    cellTemplate: '<div class="ui-grid-cell-contents">' +
    		                    //'<a style="cursor:pointer; margin-left: 8px;" ng-click="grid.appScope.addGoods(grid, row)" title="新增"><span class="glyphicon glyphicon-plus blue"></span></a>' +
    		                '<a style="cursor:pointer; margin-left: 8px;" ng-click="grid.appScope.deleteGoods(row.entity, $Index)" title="删除"><span class="glyphicon glyphicon-trash red"></span></a>' +
    		                '</div>',width:'80',enableCellEdit: false },
    		                { name: '商品名称',field:'goodsname',enableCellEdit: false},
    		             	{ name: '商品SKU',field:'skuid',enableCellEdit: false},
    		                { name: '商品货号',field:'barcode',enableCellEdit: false},
    		                { name: '进货价',field:'goodsunitprice',width:'100',enableCellEdit: false},
    		                { name: '完好数量',field:'goodssoundqty',width:'100',enableCellEdit: false},
    		                { name: '损坏数量',field:'goodsdamageqty',width:'100',enableCellEdit: false},
    		                { name: '商品重量',field:'weight',width:'100',enableCellEdit: false},
    		                /*{ name: '状态',field:'message',enableCellEdit: false, width: '15%' ,cellTemplate:
    			                   '<div class="ui-grid-cell-contents">{{grid.appScope.getState(row.entity.message)}}</div>'
    			               }*/
    		               ]
     };
     
     $scope.IngridOptions.data = top.transferDataIn;
      
       $scope.currentFocused = "";
    
       $scope.getCurrentFocus = function(){
         var rowCol = $scope.gridApi.cellNav.getFocusedCell();
         if(rowCol !== null) {
             $scope.currentFocused = 'Row Id:' + rowCol.row.entity.id + ' col:' + rowCol.col.colDef.name;
         }
       }
    
       $scope.IngridOptions.onRegisterApi = function(gridApi){
          $scope.gridApi = gridApi;
          
          gridApi.selection.on.rowSelectionChanged($scope,function(row){
       	   
          });
          gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
       	 
          });
       };
       
       
       
       
       //删除数据
       /*$scope.deleteGoods = function(grid,myRow){
           var rowCol = $scope.gridApi.cellNav.getFocusedCell();
           if(rowCol !== null) {
               console.log(rowCol.row.entity);
               console.log($scope.currentFocused);
           }
    	   var index = $scope.IngridOptions.data.indexOf(myRow.entity);
    	   $scope.IngridOptions.data.splice(index,1);
    	   //$.jBox.confirm("确定要删除  "+myRow.entity.goodsname+" 的数据 吗？", "温馨提示");
    	   
       };*/
       
       //导入数据的删除
       $scope.deleteGoods = function(row){
    	   console.warn(row);
       	angular.forEach($scope.IngridOptions.data, function(value, index){
       		if(row === value)
       			$scope.IngridOptions.data.splice(index, 1);
       	});
       };
       
       //新增一行
       $scope.addGoods = function(grid,myRow){
    	   var index = $scope.IngridOptions.data.indexOf(myRow.entity)+1;
    	   var temp={};
           temp.goodsname="";
           temp.barcode="";
           temp.skuid="";
           temp.weight="";
           temp.purchaseprice=0.00;
           temp.goodqty=1;
           temp.damageqty=0;
           //$scope.gridOptions.data.push(temp);
           $scope.IngridOptions.data.splice(index,0,temp)
       }
       
       
       //导入数据全选按钮的批量新增
      
       $scope.onClickImportAddGoods = function(){
       	var result = $scope.gridApi.selection.getSelectedRows();
       
       	console.warn(result); 
       	if(result==''){
       		$.jBox.tip("请选择要提交的商品", 'warning');
       		return;
       	}      	
	    	 $.jBox.confirm("确定要提交选中的"+result.length+"个商品吗？", "温馨提示", function(v, h, f){
	    		if(v == "ok"){
	    				$scope.addFormData.warehouseinlist = result;
	                    var data = { data: angular.toJson($scope.addFormData) };
		   	    		console.info(data);
		   	    		$http({
	                         method : 'POST',
	                         url : "/jsbweb/enterprise/com/add_stockin.do",
	                         data : $.param(data),
	                         headers : {
	                             'Content-Type' : 'application/x-www-form-urlencoded'
	                         }
	                     }).success(function(data) {
	                         console.info(data);
	                         
	                         if(data.ret == 0){
	                        	 $.jBox.tip("提交成功", 'success');
	                        	 	angular.forEach(result, function(value, index){
	                        		 $scope.deleteGoods(value);	
	                        	 })
	                         }else if(data.ret == 12){
	                        	 $.jBox.tip("提交失败,数据不能为空", 'warning');
	                         }
	                         
	                     }).error(function(rep){
	                    	 $.jBox.tip("提交失败", 'warning');
	                     });
				}
				return true;
	 		});
    	};

}]);

