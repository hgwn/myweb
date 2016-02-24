/**
 * 角色管理 树结构公共js hg2014-7-16
 */
function HTree_select(str){
		  var cpermissonTree_1_ul =$("ul"+str);
		  var cpermissonTree_1_ul_li =cpermissonTree_1_ul.children().find("li");
		  var cpermissonTree_1_ul_li_select =cpermissonTree_1_ul_li.find(".selDemo");
		  var select_pli =cpermissonTree_1_ul_li_select.parent();
		  $("ul"+str+" > li > ul >li:even").addClass("hg-bgcolor");
		  $("ul"+str+" > li > ul >li").children(".selDemo ").css("left","31%");
		  select_pli.click(function(){
			  select_pli.removeClass("hg-selected");
			  $(this).addClass("hg-selected");
		  });  
	  }


//查找带回 清空风控管理、订单查询hg2014-8-26
function lookup_org(str){
	var formId = $(str).val();
	$(".cleanButt_org").click(function(){
		$("#"+formId+" [name='organization.name']").val("");
		$("#"+formId+" [name='organization.code']").val("");
		$("#"+formId+" [name='organization.orgLevel']").val("");
	});
};

function lookup_cleanbtn(str){
	$("#"+str+" .h-cleanBtn").click(function(){
		$("#"+str+" [name='organization.name']").val("");
		$("#"+str+" [name='organization.code']").val("");
		$("#"+str+" [name='organization.orgLevel']").val("");
		$("#"+str+" .h-cleanBtn").css("display","none");
	});
};

//搜索按钮
$(document).ready(function(){
	$(".button .buttonContent button").live({
		mouseover:function(){
			$(this).css("background-position","0 -144px");
		},
		mouseout:function(){
			$(this).css("background-position","0 0");
		}
	});	
	//$(".button .buttonContent #orgAssina-treeBtn").die("mouseover","mouseout");
	$(".button .buttonContent #orgAssina-treeBtn").live({
		mouseover:function(){
			$(this).css("background-position","0 -362px");
		},
		mouseout:function(){
			$(this).css("background-position","0 -362px");
		}
	});	
	$(".button4 .buttonContent button").live({
		mouseover:function(){
			$(this).css("background-position","0 -216px");
		},
		mouseout:function(){
			$(this).css("background-position","0 -72px");
		}
	});
	$(".button8 .buttonContent button").live({
		mouseover:function(){
			$(this).css("background-position","0 -253px");
		},
		mouseout:function(){
			$(this).css("background-position","0 -106px");
		}
	});
	
});
