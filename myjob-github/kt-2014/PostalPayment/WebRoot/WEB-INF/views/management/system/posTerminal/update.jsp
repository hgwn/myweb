<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<script type="text/javascript">
$("#model_no_add").remoteChained("#brand_id", "${contextPath }/management/system/posTerminal/create_getModelNo");
	function closeDialog(param){
	   	$.pdialog._current.data("close",'');
	    $.pdialog.closeCurrent();
	    $("#dialogBackground").show();
	    repeatValid2();
	    return false;
	}
	
	function repeatValid2(){
		var internalTerminalnoId = encodeURI($.trim($("#internalTerminalnoId").val()));
		var sitecode =encodeURI($.trim($("#sitecode").val()));
		if(internalTerminalnoId!=""){
			$("#pos_update_site").attr("readOnly",false);
			$("#pos_update_site").removeClass("readonly");
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
		var internalTerminalnoId = encodeURI($.trim($("#internalTerminalnoId").val()));
		var sitecode = encodeURI($.trim($("#sitecode").val()));	
		if(sitecode!=""){
			if(internalTerminalnoId==""){
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
		}else{
			return true;
		}
	}
	
	function empty_sitecode(name){
		var sitecode = encodeURI($.trim($("#sitecode").val()));	
		if(sitecode==""){
			$("#pos_update_site").val("");
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
		$("#submBtn").click(function(){
			return validCodeAndName();
		}); 
		
		$("#pos_update_site").autocomplete({
			serviceUrl: '${contextPath }/management/system/posTerminal/getsite_name',
			params : {	internalTerminalid : function() {
							if(	$("#internalTerminalnoId")!=""){ 
								return 	$("#internalTerminalnoId").val();
								}
							else{return '';}},
						posTerminalId : function() {
							if(	$("#posTerminalId")!=""){ 
								return 	$("#posTerminalId").val();
								}
							else{return '';}}
					},
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
		
		if($("input[name='internalTerminalno.terminalno']").val()==''){
		$(".h-cleanBtn-Terminalno").css("display","none");
		$("#pos_update_site").attr("readOnly",true);
		}
		$(".h-cleanBtn-Terminalno").click(function(){	
			$("input[name='internalTerminalno.id']").val("");
			$("input[name='internalTerminalno.terminalno']").val("");
			$(".h-cleanBtn-Terminalno").css("display","none");
			$("#sitecode").val("");
			$("#pos_update_site").val("");
			$("#pos_update_site").attr("readOnly",true);
			$("#pos_update_site").addClass("readonly");
		});
	});
</script>
<style type="text/css">
.combox{ width:196px!important;}
#combox_brand_id a,#combox_model_no_add a{ width:168px;}
</style>
<div class="pageContent">
<form id="posTerminalForm_update" method="post" action="${contextPath }/management/system/posTerminal/update" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
	<input type="hidden" name="id" id="posTerminalId" value="${posTerminal.id }" />
	<div class="pageFormContent" layoutH="58">
		<p>
			<label>机身号：</label>
			<input type="text" name="code" class="w190" value="${posTerminal.code }" readonly="readonly"/>
		</p>
		<p>
			<label>品牌：</label>
			<select name="brandNo.id" id="brand_id" class="re_select196 required">
				<option value="0">--请选择--</option>
				<c:forEach var="item" items="${brandNos }">
					<option value="${item.id }" 
						<c:if test="${item.id eq posTerminal.brandNo.id}">
							selected="selected"
						</c:if>
					>${item.keyItem }</option>
				</c:forEach>
			</select>
		</p>
		<p>
			<label>终端型号：</label>
			<select name="modelNo.id" id="model_no_add" class="re_select196 required">
				<option value="">--请选择--</option>
				<c:forEach var="item" items="${modelNos }">
					<option value="${item.id }" 
						<c:if test="${item.id eq posTerminal.modelNo.id}">
							selected="selected"
						</c:if>
					>${item.keyItem }</option>
				</c:forEach>
			</select>
		</p>
		<p>
			<label>软件版本：</label>
			<select name="softVersion.id" class="re_select196">
				<c:forEach var="item" items="${softVersions }">
					<option value="${item.id }" 
						<c:if test="${item.id eq posTerminal.softVersion.id}">
							selected="selected"
						</c:if>
					>${item.keyItem }</option>
				</c:forEach>
			</select>
		</p>
		<p>
			<label>终端类型：</label>
			<select name="posType.id" class="re_select196">
				<c:forEach var="item" items="${posTypes }">
					<option value="${item.id }" 
						<c:if test="${item.id eq posTerminal.posType.id}">
							selected="selected"
						</c:if>
					>${item.item1 }</option>
				</c:forEach>
			</select>
		</p>
		<p style="position:relative; width:370px;">
			<label>内部终端编号：</label>
			<a class="h-cleanBtn h-cleanBtn-Terminalno" title="清空" style="right:50px; top:8px;">X</a>
			
			<input name="idCheck" id="internalTerminalnoIdCheck" type="hidden" value="${posTerminal.internalTerminalno.id }"/>
			<input name="internalTerminalno.id" id="internalTerminalnoId" type="hidden" value="${posTerminal.internalTerminalno.id }"/>
			<input  name="internalTerminalno.terminalno" value="${posTerminal.internalTerminalno.terminalno }" type="text" readonly="readonly" class="w190"/>
			<a class="btnLook" href="${contextPath }/management/system/posTerminal/lookupTerminalno/${posTerminal.provinceCode eq null ? 0 : posTerminal.provinceCode}" lookupGroup="internalTerminalno" title="内部终端编号" close="closeDialog" mask="true" target="dialog" width="900" height="500">查找带回</a>	
			&nbsp;&nbsp;<span id="internalTerminalnoNameMsg" ></span>
		</p>
		<p style="position:relative; width:370px;">
			<label>所属网点：</label>
			<input name="siteCheck" type="hidden" value="${posTerminal.site.code }"/>
			<input name="site.code" id="sitecode" type="hidden" value="${posTerminal.site.code}"/>
			<input class="w190" name="site.name" onblur="empty_sitecode(value);" id="pos_update_site" value="${posTerminal.site.name}" type="text" data-prompt-position="centerRight:22,0"/>
			<a class="btnLook" href="${contextPath }/management/system/posTerminal/lookup2org/posTerminalForm_update/${posTerminal.createdOrgCode.code}/{internalTerminalnoId}" warn="请先选择内部终端编号！"  lookupGroup="site" title="所属网点" mask="true" target="dialog" width="650" height="450">选择网点</a>
			&nbsp;&nbsp;<span style="color:#999; line-height:25px; padding-left:5px; position:absolute; right:-104px; top:4px; display:block;">请先选择内部终端编号</span>
		</p>
		
		
		<p>
			<label>财产编号：</label>
			<input class="w190"  name="propertyNo" type="text" value="${posTerminal.propertyNo }" maxlength="30"/>
		</p>
		<p>
			<label>供应商名称：</label>
			<input class="w190" name="provider" type="text"  value="${posTerminal.provider }" maxlength="100"/>
		</p>
		<p>
			<label>状态：</label>
			<select name="status" class="re_select196">								
				<option value="E" <c:if test="${posTerminal.status eq 'E'}">selected</c:if>	>正常</option>
				<option value="D" <c:if test="${posTerminal.status eq 'D'}">selected</c:if>	>故障</option>			
			</select>
		</p>
		<p class="nowrap">
			<label>备注：</label>
			<textarea name="remark" cols="29" rows="3" maxlength="100">${posTerminal.remark }</textarea>
		</p>
	</div>
			
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button type="submit" id="submBtn">确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
		</ul>
	</div>
</form>
</div>