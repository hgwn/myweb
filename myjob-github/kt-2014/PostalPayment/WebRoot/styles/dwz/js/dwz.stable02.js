/**
 * @author Roger Wu v1.0
 * @author ZhangHuihua@msn.com 2011-4-1
 */
(function($){
	$.fn.jTable = function(options){
		return this.each(function(){
		 	var $table = $(this), nowrapTD = $table.attr("nowrapTD");
		 	var tlength = $table.width();
			var aStyles = [];
			var $tc = $table.parent().addClass("j-resizeGrid"); // table parent container
			var layoutH = $(this).attr("layoutH");

			var oldThs = $table.find("thead>tr:last-child").find("th");

			for(var i = 0, l = oldThs.size(); i < l; i++) {
				var $th = $(oldThs[i]);
				var style = [], width = $th.innerWidth() - (100 * $th.innerWidth() / tlength)-2;
				style[0] = parseInt(width);
				style[1] = $th.attr("align");
				aStyles[aStyles.length] = style;
			}
			$(this).wrap("<div class='grid'></div>");
			var $grid = $table.parent().html($table.html());
			var thead = $grid.find("thead");
			thead.wrap("<div class='gridHeader'><div class='gridThead'><table style='width:" + (tlength - 0) + "px;'></table></div></div>");

			var lastH = $(">tr:last-child", thead);
			var ths = $(">th", lastH);
			$("th",thead).each(function(){
				var $th = $(this);
				//$th.html("<div class='gridCol' title='"+$th.text()+"'>"+ $th.html() +"</div>");
				$th.html("<div class='gridCol'>"+ $th.html() +"</div>");
				var item_b = $th.filter("#item_bizMoney");
				if(item_b.length > 0){
					item_b.mouseover(function(e){
						//alert("item_bizMoney");
						$("#item_bizMoney_tip").css({"left":(e.pageX-250) + "px","top":(e.pageY-200)  + "px"}).show();
					}).mouseout(function(){
						$("#item_bizMoney_tip").hide();
					}).mousemove(function(e){
						$("#item_bizMoney_tip").css({"left":(e.pageX-250) + "px","top":(e.pageY-200)  + "px"}).show();
					});
				}
				var item_m = $th.filter("#item_money");
				if(item_m.length > 0){
					item_m.mouseover(function(e){
						//alert("item_bizMoney");
						$("#item_money_tip").css({"left":(e.pageX-250) + "px","top":(e.pageY-200)  + "px"}).show();
					}).mouseout(function(){
						$("#item_money_tip").hide();
					}).mousemove(function(e){
						$("#item_money_tip").css({"left":(e.pageX-250) + "px","top":(e.pageY-200)  + "px"}).show();
					});
				}
			});
			
			ths.each(function(i){
				var $th = $(this), style = aStyles[i];
				$th.addClass(style[1]).hoverClass("hover").removeAttr("align").removeAttr("width").width(style[0]);
			}).filter("[orderField]").orderBy({
				targetType: $table.attr("targetType"),
				rel:$table.attr("rel"),
				asc: $table.attr("asc") || "asc",
				desc:  $table.attr("desc") || "desc"
			});

			var tbody = $grid.find(">tbody");
			var layoutStr = layoutH ? " layoutH='" + layoutH + "'" : "";
			
			tbody.wrap("<div class='gridScroller'" + layoutStr + " style='width:" + $tc.width() + "px;'><div class='gridTbody'><table style='width:" + (tlength - 0) + "px;'></table></div></div>");
			var ftr = $(">tr:first-child", tbody);
			var $trs = tbody.find('>tr');
			
			$trs.hoverClass().each(function(index){
				var $tr = $(this);
				//对账清分备注提示
				var tip = $(this).find("td.actionResult_errorReason_td");
				tip_base(tip,'tooltip');
				//异常信息查询提示
				var tip2 = $(this).find("td.exceptionInfo_td");
				tip_base(tip2,'tooltip2');
				//外部商户号管理
				var htip = $(this).find("td.externalMerno-lookup-td");
				tip_base(htip,'htooltip');
				//
				var $ftds = $(">td", this);
				if(index % 2 ==1){
					$tr.addClass("back1");
				}
				for (var i=0; i < $ftds.size(); i++) {
					var $ftd = $($ftds[i]);
					if (nowrapTD != "false") $ftd.html("<div>" + $ftd.html() + "</div>");
					if (i < aStyles.length) $ftd.addClass(aStyles[i][1]);
				}		
				$tr.click(function(index){
					if($(this).find(':checkbox').length > 0){
						//alert("true");
						if ($(this).hasClass('selected2')) {
							$(this)
								.removeClass('selected2')
								.find(':checkbox').attr('checked',false);
						}else{
							$(this)
								.addClass('selected2')
								.find(':checkbox').attr('checked',true);
						}
					}
					else{
						//alert("false");
						$trs.filter(".selected2").removeClass("selected2");
						$tr.addClass("selected2");
						
					}	
					var sTarget = $tr.attr("target");
					if (sTarget) {
						if ($("#"+sTarget, $grid).size() == 0) {
							$grid.prepend('<input id="'+sTarget+'" type="hidden" />');
						}
						$("#"+sTarget, $grid).val($tr.attr("rel"));
					}
				});
				
			});
			
			$(">td",ftr).each(function(i){
				if (i < aStyles.length) $(this).width(aStyles[i][0]);
			});			
			$grid.append("<div class='resizeMarker' style='height:300px; left:57px;display:none;'></div><div class='resizeProxy' style='height:300px; left:377px;display:none;'></div>");
	
			var scroller = $(".gridScroller", $grid);
			scroller.scroll(function(event){
				var header = $(".gridThead", $grid);
				if(scroller.scrollLeft() > 0){
					header.css("position", "relative");
					var scroll = scroller.scrollLeft();
					header.css("left", scroller.cssv("left") - scroll);
				}
				if(scroller.scrollLeft() == 0) {
					header.css("position", "relative");
					header.css("left", "0px");
				}
		        return false;
			});		
			
			
			$(">tr", thead).each(function(){

				$(">th", this).each(function(i){
					var th = this, $th = $(this);
					$th.mouseover(function(event){
						var offset = $.jTableTool.getOffset(th, event).offsetX;
						if($th.outerWidth() - offset < 5) {
							$th.css("cursor", "col-resize").mousedown(function(event){
								$(".resizeProxy", $grid).show().css({
									left: $.jTableTool.getRight(th)- $(".gridScroller", $grid).scrollLeft(),
									top:$.jTableTool.getTop(th),
									height:$.jTableTool.getHeight(th,$grid),
									cursor:"col-resize"
								});
								$(".resizeMarker", $grid).show().css({
										left: $.jTableTool.getLeft(th) + 1 - $(".gridScroller", $grid).scrollLeft(),
										top: $.jTableTool.getTop(th),
										height:$.jTableTool.getHeight(th,$grid)									
								});
								$(".resizeProxy", $grid).jDrag($.extend(options, {scop:true, cellMinW:20, relObj:$(".resizeMarker", $grid)[0],
										move: "horizontal",
										event:event,
										stop: function(){
											var pleft = $(".resizeProxy", $grid).position().left;
											var mleft = $(".resizeMarker", $grid).position().left;
											var move = pleft - mleft - $th.outerWidth() -9;

											var cols = $.jTableTool.getColspan($th);
											var cellNum = $.jTableTool.getCellNum($th);
											var oldW = $th.width(), newW = $th.width() + move;
											var $dcell = $(">td", ftr).eq(cellNum - 1);
											
											$th.width(newW + "px");
											$dcell.width(newW+"px");
											
											var $table1 = $(thead).parent();
											$table1.width(($table1.width() - oldW + newW)+"px");
											var $table2 = $(tbody).parent();
											$table2.width(($table2.width() - oldW + newW)+"px");
											
											$(".resizeMarker,.resizeProxy", $grid).hide();
										}
									})
								);
							});
						} else {
							$th.css("cursor", $th.attr("orderField") ? "pointer" : "default");
							$th.unbind("mousedown");
						}
						return false;
					});
				});
			});
		
			function _resizeGrid(){
				$("div.j-resizeGrid").each(function(){
					var width = $(this).innerWidth();
					if (width){
						$("div.gridScroller", this).width(width+"px");
					}
				});
			}
			//提示函数
			function tip_base(tip,tipId){
				if(tip.length > 0){	
					var x = 5;  
					var y = 20;
					tip.mouseover(function(e){
						var myTitle = $(this).text();
						//alert("text:"+myTitle);
						if($.trim(myTitle)=="") return;
						var tooltip = "<div id="+tipId+">"+ myTitle +"<\/div>"; 
						$("body").append(tooltip);
						$("#"+tipId)
						.css({
							"top": (e.pageY+y) + "px",
							"left": (e.pageX+x)  + "px"
						}).show();
					}).mouseout(function(){
						$("#"+tipId).remove();  
					}).mousemove(function(e){
						$("#"+tipId)
						.css({
							"top": (e.pageY+y) + "px",
							"left": (e.pageX+x)  + "px"
						});
				});
				}
				
			}
			$(window).unbind(DWZ.eventType.resizeGrid).bind("resizeGrid", _resizeGrid);
		});
	};
	
	
	$.jTableTool = {
		getLeft:function(obj) {
			var width = 0;
			$(obj).prevAll().each(function(){
				width += $(this).outerWidth();
			});
			return width - 1;
		},
		getRight:function(obj) {
			var width = 0;
			$(obj).prevAll().andSelf().each(function(){
				width += $(this).outerWidth();
			});
			return width - 1;
		},
		getTop:function(obj) {
			var height = 0;
			$(obj).parent().prevAll().each(function(){
				height += $(this).outerHeight();
			});
			return height;
		},
		getHeight:function(obj, parent) {
			var height = 0;
			var head = $(obj).parent();
			head.nextAll().andSelf().each(function(){
				height += $(this).outerHeight();
			});
			$(".gridTbody", parent).children().each(function(){
				height += $(this).outerHeight();
			});
			return height;
		},
		getCellNum:function(obj) {
			return $(obj).prevAll().andSelf().size();
		},
		getColspan:function(obj) {
			return $(obj).attr("colspan") || 1;
		},
		getStart:function(obj) {
			var start = 1;
			$(obj).prevAll().each(function(){
				start += parseInt($(this).attr("colspan") || 1);
			});
			return start;
		},
		getPageCoord:function(element){
			var coord = {x: 0, y: 0};
			while (element){
			    coord.x += element.offsetLeft;
			    coord.y += element.offsetTop;
			    element = element.offsetParent;
			}
			return coord;
		},
		getOffset:function(obj, evt){
			if($.browser.msie ) {
				var objset = $(obj).offset();
				var evtset = {
					offsetX:evt.pageX || evt.screenX,
					offsetY:evt.pageY || evt.screenY
				};
				var offset ={
			    	offsetX: evtset.offsetX - objset.left,
			    	offsetY: evtset.offsetY - objset.top
				};
				return offset;
			}
			var target = evt.target;
			if (target.offsetLeft == undefined){
			    target = target.parentNode;
			}
			var pageCoord = $.jTableTool.getPageCoord(target);
			var eventCoord ={
			    x: window.pageXOffset + evt.clientX,
			    y: window.pageYOffset + evt.clientY
			};
			var offset ={
			    offsetX: eventCoord.x - pageCoord.x,
			    offsetY: eventCoord.y - pageCoord.y
			};
			return offset;
		}
	};
})(jQuery);
