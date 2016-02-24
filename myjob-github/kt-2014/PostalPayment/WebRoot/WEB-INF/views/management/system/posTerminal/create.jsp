<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">
$("#model_no_add").remoteChained("#brand_id", "${contextPath }/management/system/posTerminal/create_getModelNo");
	var validFlag ;
	var repeatValid = function(){
		var validObj = $("#posCode");
		var remote_url = validObj.attr("remote_url");
		var validAttrName = validObj.attr("id");
		var validAttrValue = encodeURI($.trim(validObj.attr("value")));
		var msgTip = validObj.attr("msgTip");
		if(validAttrValue!=""){
			var params = {};
			$.ajax({
				global:false,
				type:"post",
				url:remote_url,
				data:{"validWord":validAttrValue},
				dataType:"text",
				success:function(data){
						if(data=="yes"){
							$("#"+validAttrName+"Msg").attr("class","invalid");
							msg = "<font color='red'>"+msgTip+"已存在!</font>";
						}else{
							$("#"+validAttrName+"Msg").attr("class","");
							msg = "<font color='green'>"+msgTip+"可用!</font>";
						}
						$("#"+validAttrName+"Msg").html(msg);
					},
				error:function(data){
					alertMsg.error("调用失败");
				}});
		}
	}
	
	function repeatValid2(){
		var internalTerminalnoId = encodeURI($.trim($("#internalTerminalnoId").val()));
		var sitecode =encodeURI($.trim($("#sitecode").val()));
		if(internalTerminalnoId!=""){
			$("#pos_create_site").attr("readOnly",false);
			$("#pos_create_site").removeClass("readonly");
		}
		if(sitecode!=""){
			if(internalTerminalnoId!=""){
				  $.get("${contextPath }/management/system/posTerminal/isMernoExist",{"internalTerminalnoId": internalTerminalnoId,"sitecode":sitecode},function(data){        
			      if(data=="no"){
			      	  $("input[name='site.code']").val("");
					  $("input[name='site.name']").val("");
					  $(".h-cleanBtn-wd").css("display","none");
			    	  alertMsg.warn("网点和内部终端编号没有在同一个省");
			      }
				},"text");
			}
		}	
	}
	
	var validCodeAndName = function(){
		repeatValid();
		repeatValid2();
		var internalTerminalnoId = encodeURI($.trim($("#internalTerminalnoId").val()));
		var sitecode = encodeURI($.trim($("#sitecode").val()));	
		if(sitecode!=""){
			if(internalTerminalnoId==""){
				$("input[name='site.code']").val("");
				$("input[name='site.name']").val("");
				$(".h-cleanBtn-wd").css("display","none");
				alertMsg.warn("网点不能直接关联pos终端，需先选择内部终端编号");
				return false;
			}
		}
		
		var brand_id = encodeURI($.trim($("#brand_id").val()));	
		if(brand_id==""||brand_id==0){
			alertMsg.warn("请选择品牌");
			return false;
		}
		var model_no_add = encodeURI($.trim($("#model_no_add").val()));	
		if(model_no_add==""){
			alertMsg.warn("请选择终端型号");
			return false;
		}
		 
		if($(".invalid").length>0){
			return false;
		}
		return true;
	}
	
	function empty_sitecode(name){
		var sitecode = encodeURI($.trim($("#sitecode").val()));	
		if(sitecode==""){
			$("#pos_create_site").val("");
			autocomplete({
			lookupFilter:function() {
                	return null;
                }
			});
		}
		if(name==""){
			$("#sitecode").val("");
		}
	}
	
	$(document).ready(function(){
		$(".repeatValid").keyup(function(){
			var v = $(this);
			clearTimeout(validFlag);
			validFlag = setTimeout(function(){
				repeatValid();
			},500);
		});
		$("#posTerminal_add_submit").click(function(){
			return validCodeAndName();
		}); 
		
		$("#pos_create_site").autocomplete({
			serviceUrl: '${contextPath }/management/system/posTerminal/getsite_name',
			params : {internalTerminalid : function() {
					if(	$("#internalTerminalnoId")!=""){ 
						return 	$("#internalTerminalnoId").val();
						}
					else{return '';}
				}},
			 onSelect: function (suggestion) {
		         var data = suggestion.data ;
		     	 $("#sitecode").val(data);
		     		
		      },
		      onSearchStart: function (query) {
		 		 $("#sitecode").val("");
		  	  },
		      onSearchComplete: function (query) {
		 		 $("#sitecode").val("");
		  	  }
		});
		
	});
	
	function closeDialog(param){
	    $.pdialog._current.data("close",'');
	    $.pdialog.closeCurrent();
	    $("#dialogBackground").show();
	    repeatValid2();
	    return false;
	}
	
$(function(){

	if($("input[name='internalTerminalno.terminalno']").val()==''){
		$(".h-cleanBtn-Terminalno").css("display","none");
		$("#pos_create_site").attr("readOnly",true);
	}
	$(".h-cleanBtn-Terminalno").click(function(){	
		$("input[name='internalTerminalno.id']").val("");
		$("input[name='internalTerminalno.terminalno']").val("");
		$(".h-cleanBtn-Terminalno").css("display","none");
		$("#sitecode").val("");
		$("#pos_update_site").val("");
		$("#pos_create_site").attr("readOnly",true);
		$("#pos_create_site").addClass("readonly");
	});
});	
</script>
<style type="text/css">
.combox{ width:196px!important;}
#combox_brand_id a,#combox_model_no_add a{ width:168px;}
</style>
<div class="pageContent">
<form id="posTerminalForm_clear" method="post" action="${contextPath }/management/system/posTerminal/create" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
	<div class="pageFormContent" layoutH="58">
		<p>
			<label>机身号：</label>
			<input type="text" name="code" id="posCode" class="w190 required repeatValid validate[required]" maxlength="20" minlength="20"
				remote_url="${contextPath }/management/system/posTerminal/isCodeExist" msgTip="机身号"/>
			&nbsp;&nbsp;<span id="posCodeMsg" ></span>
		</p>
		<p>
			<label>品牌：</label>
			<select name="brandNo.id" id="brand_id" class="re_select196 required">
				<option value="0">--请选择--</option>
				<c:forEach var="item" items="${brandNos }">
					<option value="${item.id }" >${item.keyItem }</option>
				</c:forEach>
			</select>
		</p>
		<p>
			<label>终端型号：</label>
			<select name="modelNo.id" id="model_no_add" class="re_select196 required">
				<option value="">--请选择--</option>
				<c:forEach var="item" items="${modelNos }">
					<option value="${item.id }" >${item.keyItem }</option>
				</c:forEach>
			</select>
		</p>
		<p>
			<label>软件版本：</label>
			<select name="softVersion.id" class="re_select196">
				<c:forEach var="item" items="${softVersions }">
					<option value="${item.id }" >${item.keyItem }</option>
				</c:forEach>
			</select>
		</p>
		<p>
			<label>终端类型：</label>
			<select name="posType.id" class="re_select196">
				<c:forEach var="item" items="${posTypes }">
					<option value="${item.id }" >${item.item1 }</option>
				</c:forEach>
			</select>
		</p>
		<p style="position:relative; width:370px;">
		<label>内部终端编号：</label>
			<a class="h-cleanBtn h-cleanBtn-Terminalno" title="清空" style="right:50px; top:8px;">X</a>
			<input name="internalTerminalno.id" id="internalTerminalnoId" type="hidden"/>
			<input class="w190" name="internalTerminalno.terminalno" type="text" readOnly="readonly" data-prompt-position="centerRight:22,0"/>
			<a class="btnLook" href="${contextPath }/management/system/posTerminal/lookupTerminalno/0" lookupGroup="internalTerminalno" title="内部终端编号" close="closeDialog" mask="true" target="dialog" width="900" height="500">查找带回</a>			
		</p>
		<p style="position:relative; width:370px;">
			<label>所属网点：</label>
			<input name="site.code" id="sitecode" type="hidden"/>
			<input class="w190 repeatValid2" id="pos_create_site" name="site.name"  onblur="empty_sitecode(value);"  type="text" data-prompt-position="centerRight:22,0"/>
			<a class="btnLook" id="btnLook"  href="${contextPath }/management/system/posTerminal/lookup2org/posTerminalForm_clear/create/{internalTerminalnoId}" warn="请先选择内部终端编号！" lookupGroup="site" title="所属网点" mask="true" target="dialog" width="650" height="450">选择网点</a>
			&nbsp;&nbsp;<span style="color:#999; line-height:25px; padding-left:5px; position:absolute; right:-104px; top:4px; display:block;">请先选择内部终端编号</span>
		</p>
		<p>
			<label>财产编号：</label>
			<input class="w190"  name="propertyNo" type="text" maxlength="30"/>
		</p>
		<p>
			<label>供应商名称：</label>
			<input class="w190" name="provider" type="text" maxlength="100"/>
		</p>
		<p class="nowrap">
			<label>备注：</label>
			<textarea name="remark" cols="29" rows="3" maxlength="100"></textarea>
		</p>
	</div>
			
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button type="submit" id="posTerminal_add_submit">确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
		</ul>
	</div>
</form>
</div>