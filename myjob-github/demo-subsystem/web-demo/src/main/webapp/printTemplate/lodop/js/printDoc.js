function generateBarcode(value,btype,settings){
		if($("#ms").length<1){
		$("body").append('<div id="ms" style="display:none"><div id="barcodeTarget" class="barcodeTarget"></div></div>')}
		else{
		$("#ms").html('<div id="barcodeTarget" class="barcodeTarget"></div>')
		}
          $("#barcodeTarget").html("").show().barcode(value, btype, settings);
      }

function printDoc(){
		this.LODOP=getLodop();  	
	}
	printDoc.prototype={
		init:function(temp,tempinfo){
					var trow=temp.templatedataitem.rows;  //模板
					var goodInfo=tempinfo;		      //运单基本信息
					var goodList=tempinfo.list;		  //运单基本信息 需要循环的
					var today=new Date();
					var lodop=this.LODOP, _this=this;
				
					var paperWidth=210  //A4
			
					printSet(temp)   //打印设置
					
					printValue(goodInfo,trow)  //载入基本信息	  
				
					printList(goodList,trow); //载入列表信息
					
				function printSet(temp){  //打印的样式显示尺寸设置
					_this.LODOP.PRINT_INITA(0,0,temp.width+"mm",50+temp.hight+"mm",temp.tempname); //设置纸张大小，传入值单位是PX ,显示单位不变
					_this.LODOP.SET_SHOW_MODE("HIDE_ABUTTIN_SETUP",1);//隐藏应用按钮
					_this.LODOP.SET_PRINT_STYLE("FontSize",12);
					//this.LODOP.SET_PRINT_STYLE("FontName","微软雅黑");
					_this.LODOP.SET_PRINT_STYLEA(0,"Horient",2);
					if(temp.pictureurl&&temp.pictureurl!=" "){
						_this.LODOP.ADD_PRINT_SETUP_BKIMG("<img border='0' src="+temp.pictureurl+" />");
					}
					_this.LODOP.SET_SHOW_MODE("BKIMG_LEFT",0);
					_this.LODOP.SET_SHOW_MODE("BKIMG_TOP",0);
					_this.LODOP.SET_SHOW_MODE("BKIMG_WIDTH",temp.width+"mm");
					_this.LODOP.SET_SHOW_MODE("BKIMG_IN_PREVIEW",1);		//预览时显示背景
				}	
				function printValue(values,temp){  
					for(var i in values){
						var text=values[i]
						for(var j in temp){
								if(temp[j].isprint==1&&i==temp[j].linkparam){  				 //模板字段需要打印
									
											if(temp[j].datatype==1){    //转大写
												if(temp[j].typeparam){  //指定转换单位
														  _this.printVidw("text",temp[j],toChinesNum(text,temp[j].typeparam));
												}else{
													
														 _this.printVidw("text",temp[j],toChinesNum(text));
												}
											   
											}else if(temp[j].datatype==2){// 条形码
																						
											_this.printVidw("barcode",temp[j],text,temp[j].typeparam);
												
											}else if(temp[j].datatype==3){// 日期
												var dataText
												if(!text) dataText = today.format(temp[j].typeparam); 
												else{//			如果有日期传入
													today= new Date(text);	
													dataText=text												
												}
												if(today!="Invalid Date"){
														if(temp[j].displayname=="年")
															dataText=today.getFullYear();
														if(temp[j].displayname=="月")		
															dataText=today.getMonth()+1;
														if(temp[j].displayname=="日")		
															dataText=today.getDate();
															
														_this.printVidw("text",temp[j],dataText);
												}else{
													console.warn("日期格式非法"+dataText)
												}
													
											}else{
												_this.printVidw("text",temp[j],text);
											}
								}
					}}
				
				}
				function printList(lists,temp,space){ //打印列表字段
					if(temp&&lists){
								
						var space=space||2;    //循环Y轴间隔
						for(list in lists){
							var mgood={};           //货物列表字段位置
							var count=0; 		//计数
							for(key in lists[list][0]){
								for(var i=0;i<temp.length;i++){
									if(temp[i].linkparam==key){
										mgood[key]=	temp[i];    //取出字段坐标信息
									}}}
							for(i in lists[list]){
								
								for(key in lists[list][i]){
									if(mgood[key]){
										var topstep=0.0;
										if(mgood[key].intervals){
												topstep+=parseFloat(mgood[key].intervals)
											}		
										var margin_top=count*(mgood[key].cy+topstep+space);
										lodop.ADD_PRINT_TEXT(
												  mgood[key].y+ +margin_top+"mm",
												  mgood[key].x+"mm",
												  mgood[key].cx+"mm",
												  mgood[key].cy+"mm",
													lists[list][i][key]);
										
									lodop.SET_PRINT_STYLEA(0,"Alignment",2);	//居中
									
									if(!isNaN(mgood[key]["fontsize"]))
										lodop.SET_PRINT_STYLEA(0,"FontSize", mgood[key]["fontsize"]);
									if(mgood[key]["fontcolor"])
										lodop.SET_PRINT_STYLEA(0,"FontColor",mgood[key]["fontcolor"]);
								}}	
								count++;
							}
						}}
				}
			},
		printVidw: function(dataType,data,text,typeparam){
			var cx=1;
			var cy=0.5;
			var y=2.5  //位置校正
			
			if(dataType=="text"){
					this.LODOP.ADD_PRINT_TEXT(
						  data.y+"mm",
						  data.x+"mm",
						  cx+data.cx+"mm",
						  cy+data.cy+"mm",
						  text);  
					this.LODOP.SET_PRINT_STYLEA(0,"Alignment",2);	//居中
					
					if(data["fontsize"])
						this.LODOP.SET_PRINT_STYLEA(0,"FontSize", data["fontsize"]);
					if(data["fontcolor"])
						this.LODOP.SET_PRINT_STYLEA(0,"FontColor",data["fontcolor"]);
					
			}
			else if(dataType=="img"){
					this.LODOP.ADD_PRINT_IMAGE(
							   data.y+"mm",
						 	   data.x+"mm",
						 	   cx+data.cx+"mm",
						 	   cy+data.cy+"mm",
						 	   "<img border='0' src="+text+" width='200' height='250'/>");
					this.LODOP.SET_PRINT_STYLEA(0,"Stretch",1);}			//(可变形)扩展缩放模式	
			
			else if(dataType="barcode"){ 								//打印条形码 
			var setting=typeparam.split(",")
			//生成条形码
			 generateBarcode(text,setting[0],{barWidth:setting[3],fontSize:setting[2],barHeight:setting[1],output:"css"});
			 var strFormHtml=document.getElementById("ms").innerHTML;
			 this.LODOP.ADD_PRINT_HTM(  data.y+"mm",data.x+"mm", "100%","100%",strFormHtml);
			 
		/*	if(typeparam){
				  this.LODOP.ADD_PRINT_BARCODE(
				   data.y+"mm",
			 	   data.x+"mm",
			 	   cx+data.cx+"mm",
			 	   cy+data.cy+"mm",
			 	   typeparam,
					text);
			  }else
				this.LODOP.ADD_PRINT_BARCODE(
							   data.y+"mm",
						 	   data.x+"mm",
						 	   cx+data.cx+"mm",
						 	   cy+data.cy+"mm",
							   'Code39',
								text);*/
			}
			
			if(data["fontsize"]){
				if(data["fontsize"]>10)
					this.LODOP.SET_PRINT_STYLEA(0,"FontSize", 10);
				else
				this.LODOP.SET_PRINT_STYLEA(0,"FontSize", data["fontsize"]);
			}
					if(data["fontcolor"])
						this.LODOP.SET_PRINT_STYLEA(0,"FontColor",data["fontcolor"]);
		},
		setupModel:function(temp,tempinfo){
			this.init(temp,tempinfo);
			this.LODOP.PRINT_SETUP();	
			},
		viewModel:function(temp,tempinfo){
			this.init(temp,tempinfo);
			this.LODOP.PREVIEW();
			},
		designModel:function(temp,tempinfo){
			this.init(temp,tempinfo);
			//this.LODOP.PRINT_INITA(0,0,100+"mm",100+"mm","");
			this.LODOP.PRINT_DESIGN();
			},
		getValue:function(temp,tempinfo){ //获取代码
			this.init(temp,tempinfo);
			alert(this.LODOP.GET_VALUE("ProgramCodes",0))	
			}
		
}

//数字转中午大写
//console.log(toChinesNum("2000000.1","万"))
//console.log(toChinesNum("2000000.1"))
function toChinesNum(n,s) {
        if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
            return n;
        var unit = "仟佰拾亿仟佰拾万仟佰拾元角分", str = "",result="";
            n += "00";
        var p = n.indexOf('.');
        if (p >= 0)
            n = n.substring(0, p) + n.substr(p+1, 2);
            unit = unit.substr(unit.length - n.length);
        for (var i=0; i < n.length; i++)
            str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
        if(s){
		    var ut2="亿万仟佰拾元角分"
			if(str.lastIndexOf(s)){
				var end=str.lastIndexOf(s)
				var bg=str.indexOf(ut2.charAt(ut2.indexOf(s)-1))+1;
				result=str.substring(bg,end)
				if(result.length>1)
					result=result.replace(/(零)+/g, "")
			}else{
				result="零";
			}
		}else{
		 result= str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
		}  
	    return result;
}

//数字转大写结束

//日期格式
Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}  