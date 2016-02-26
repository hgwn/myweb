/**
 * 省市县选择器指令
 *
 * author:chenxiaoqun
 * date：201501113
 */
angular.module("util.selectAddress", [])
    .directive("selectAddress", ["$http","$compile", function ($http,$compile) {
    	var pcaUrl = '/masgetweb/static/js/plugins/angular.plugins/pca-selector/data/pca.json';
    	
        return {
            restrict: 'A',
            templateUrl: "/masgetweb/static/js/plugins/angular.plugins/pca-selector/template/box.html",
			replace:false,
            scope: {
            	ngModel: '=',
                provinceid:"=",
                cityid:"=",
                areaid:"="
            },
            link:function(scope,element,attrs){
				element.css("cursor","pointer");
            	var container=element.find(".pca-selector-container");
				container=$compile(container)(scope);
				var stylelink=element.find("link");
				
				//设置'省市县下拉框'起始位置
            	var setPosition=function(){
            		var inputHeight=element.outerHeight();
            		var inputTop=element.offset().top;
                	var inputLeft=element.offset().left;
                	container.css("position","absolute");
                	container.css("top",inputTop+inputHeight+2);
                	container.css("left",inputLeft);
                	console.log(inputHeight);
            	}
            	
            	setPosition();
            	
				$("body").append(stylelink);
				$("body").append(container);
            	
				//浏览器页面大小变化时触发--重新调整'省市县下拉框'起始位置
            	$(window).resize(function(){
            		setPosition();
            	});
            	
            	
            	//默认不显示'省市县下拉框'
				scope.isShowContainer=false;
				
				scope.selectedProvince={};
				scope.selectedCity={};
				scope.selectedArea={};
				
				scope.temp_provinceid=scope.provinceid;
				scope.temp_cityid=scope.cityid;
				scope.temp_areaid=scope.areaid;
            	
            	
            	//建立省市县选中状态
            	var buildSelectedState=function(){
            		angular.forEach(scope.pcaData,function(province){
            			province.selected=false;
            			if(province.provinceid==scope.temp_provinceid){
            				province.selected=true;
            				scope.selectedProvince=province;
            			}
					});
            		
            		angular.forEach(scope.selectedProvince.c,function(city){
    					city.selected=false;
    					if(city.cityid==scope.temp_cityid){
    						city.selected=true;
    						scope.selectedCity=city;
    					}
    				});
            		
            		angular.forEach(scope.selectedCity.a,function(area){
            			area.selected=false;
    					if(area.areaid==scope.temp_areaid){
    						area.selected=true;
    						scope.selectedArea=area;
    					}
    				});
            	};
            	
            	//加载省市县数据
            	$http.get(pcaUrl).success(function(data){
            		scope.pcaData=data;
            		buildSelectedState();
            		scope.initData();
            	}); 	
            	
            	//定义省市县页签
            	scope.tabs=[{id:1,name:"省份",selected:true},{id:2,name:"城市"},{id:3,name:"县区"}];
				scope.tabIndex=1;

				//定义页签改变事件
				scope.onTabChange=function(tabid){
					angular.forEach(scope.tabs,function(item){
						item.selected=false;
						if(item.id==tabid){
							item.selected=true;
							scope.tabIndex=tabid;
						}
					});
				};

				//点击'省'时触发
				//1、保存当前选中的省份
				//2、'省'不同时移除掉前一个选中的省的城市的选中状态,'省'相同时不变
				scope.onSelectProvinceChange=function(province){
					//移除'省份'的选中状态
					removeSelectedProvince();
					province.selected=true;
					
					if(scope.selectedProvince.provinceid!=province.provinceid){
						removeSelectedCity();
						removeSelectedArea();
						
						scope.selectedCity={};
						scope.selectedArea={};
					}
					
					scope.selectedProvince=province;
					
					scope.onTabChange(2);

				};

				//点击'市'时触发
				//1、保存当前选中的城市
				//2、'市'不同时移除掉前一个选中的市的县区的选中状态,'市'相同时不变
				scope.onSelectCityChange=function(city){
					//移除'城市'的选中状态
					removeSelectedCity();
					city.selected=true;
					
					if(scope.selectedCity.cityid!=city.cityid){
						removeSelectedArea();
						scope.selectedArea={};
					}
					
					scope.selectedCity=city;

					scope.onTabChange(3);
				};

				//点击'县'时触发--保存当前选中的县区
				scope.onSelectAreaChange=function(area){
					//移除'县区'的选中状态
					removeSelectedArea();
					area.selected=true;
					scope.selectedArea=area;
				};

				//点击文本框时触发--显示'省市县选择器'
				element.click(function(){
					if(scope.isShowContainer==false){
						setPosition();
						scope.$apply(scope.isShowContainer=true);
					}
				});
				
				//移除'省份'的选中状态
				var removeSelectedProvince=function(){
					angular.forEach(scope.pcaData,function(province){
						province.selected=false;
					});
				};
				
				//移除'城市'的选中状态
				var removeSelectedCity=function(){
					angular.forEach(scope.selectedProvince.c,function(city){
						city.selected=false;
					});
				};
				
				//移除'县区'的选中状态
				var removeSelectedArea=function(){
					angular.forEach(scope.selectedCity.a,function(area){
						area.selected=false;
					});
				};
				
				//点击'确定'按钮时触发
				scope.confirm=function(){
					
					if(attrs.provinceid!=null){
						scope.provinceid=scope.selectedProvince.provinceid;
					}
					if(attrs.cityid!=null){
						scope.cityid=scope.selectedCity.cityid;
					}
					if(attrs.areaid!=null){
						scope.areaid=scope.selectedArea.areaid;
					}
					
					scope.temp_provinceid=scope.selectedProvince.provinceid;
					scope.temp_cityid=scope.selectedCity.cityid;
					scope.temp_areaid=scope.selectedArea.areaid;
    				
    				
					scope.ngModel="";
    				if(scope.selectedProvince.p!=null){
    					scope.ngModel+=scope.selectedProvince.p;
    				}
    				
    				if(scope.selectedCity.n!=null){
    					scope.ngModel+=" "+scope.selectedCity.n;
    				}
    				
    				if(scope.selectedArea.s!=null){
    					scope.ngModel+=" "+scope.selectedArea.s;
    				}
    				
    				scope.isShowContainer=false;
				};
				
				//初始化选中的数据结果
				scope.initData=function(){
					
					if(attrs.provinceid!=null){
						scope.provinceid=scope.selectedProvince.provinceid;
					}
					if(attrs.cityid!=null){
						scope.cityid=scope.selectedCity.cityid;
					}
					if(attrs.areaid!=null){
						scope.areaid=scope.selectedArea.areaid;
					}
					
					scope.temp_provinceid=scope.selectedProvince.provinceid;
					scope.temp_cityid=scope.selectedCity.cityid;
					scope.temp_areaid=scope.selectedArea.areaid;
    				
    				if(scope.selectedProvince.p!=null){
    					scope.ngModel="";
    					scope.ngModel+=checkNull(scope.selectedProvince.p);
    				}
    				
    				if(scope.selectedCity.n!=null){
    					scope.ngModel+=" "+checkNull(scope.selectedCity.n);
    				}
    				
    				if(scope.selectedArea.s!=null){
    					scope.ngModel+=" "+checkNull(scope.selectedArea.s);
    				}
    				
    				scope.isShowContainer=false;
				};
				
				//点击'取消'按钮时触发
				scope.cancle=function(){
					buildSelectedState();
					scope.isShowContainer=false;
					scope.onTabChange(1);
				};
				
				//点击'清空'按钮时触发
				scope.clear=function(){
					
					removeSelectedProvince();
					removeSelectedCity();
					removeSelectedArea();
					
					scope.temp_provinceid=0;
					scope.temp_cityid=0;
					scope.temp_areaid=0;
					
					scope.selectedProvince={};
					scope.selectedCity={};
					scope.selectedArea={};
					
					buildSelectedState();
					
					scope.onTabChange(1);
					scope.isShowContainer=false;
					
					scope.ngModel="";
					
					if(attrs.provinceid!=null){
						scope.provinceid=0;
					}
					if(attrs.cityid!=null){
						scope.cityid=0;
					}
					if(attrs.areaid!=null){
						scope.areaid=0;
					}
					
				};

				//点击页面任何位置时触发--主要用来控制'省市县控件的显示与隐藏'
				//当点击范围在省市区区域内(文本框和省市县下拉框)时,显示省市县下拉框,否则隐藏
				$(window).click(function(event){
					var isIn=element[0]==event.target||container.find(event.target).size()>0;
					if(!isIn&&scope.isShowContainer==true){
						scope.$apply(scope.isShowContainer=false);
					}
				});
				
				//变量为null时转换为空字符串""
				var checkNull=function(v){
					if(v==null){
						v="";
					}
					return v;
				};
            }
        }
    }]);
