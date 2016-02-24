<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<script type="text/javascript">
//<!--
	var validFlag ;
	var repeatValid = function(){
		var validObj = $("#terminalnoAdd");
		var remote_url = validObj.attr("remote_url");
		var validAttrName = validObj.attr("id");
		var validAttrValue = encodeURI($.trim(validObj.attr("value")));
		var externalMernoId =$("#externalMernoId").val();
		var msgTip = validObj.attr("msgTip");
		if(externalMernoId.length!=0){
			if(validAttrValue!=""){
				var params = {};
				$.ajax({
					type:"post",
					async:false,
					url:remote_url,
					data:{"validWord":validAttrValue,"externalMernoId":externalMernoId},
					dataType:"text",
					success:function(data){
							if(data=="yes"){
								$("#"+validAttrName+"Msg").attr("class","invalid");
								msg = "<font color='red'>"+msgTip+"已存在</font>";
							}else if(data=="no"){
								$("#"+validAttrName+"Msg").attr("class","");
								msg = "<font color='green'>"+msgTip+"可用</font>";
							}else{
								$("#"+validAttrName+"Msg").attr("class","invalid");
								msg = "<font color='red'>"+msgTip+"长度不够</font>";
							}
							$("#"+validAttrName+"Msg").html(msg);
						},
					error:function(data){
						alert("调用失败");
					}});
			}
		}
	}
	
	var validCodeAndName = function(){
		var digitReg = /^\d{8}$/;
		if(!digitReg.test($(".terminalno").val())){
			alertMsg.warn("请输入合法的外部终端编号(8位数字)");
			return false;
		}
		repeatValid();
		if($(".invalid").length>0){
			return false;
		}else{
			return true;
		}
	}
	$(document).ready(function(){
		
		/*$(".repeatValid").keyup(function(){
			var v = $(this);
			clearTimeout(validFlag);
			validFlag = setTimeout(function(){
				repeatValid(v);
			},500);
		});*/
		$("#submBtn").click(function(){
			return validCodeAndName();
		}); 
		
	});
	
	function closeDialog(param){
	    $.pdialog._current.data("close",'');
	    $.pdialog.closeCurrent();
	    $("#dialogBackground").show();
	    return false;
	}
//-->
</script>
<div class="pageContent">
<form id="externalTerminalno_search_form" method="post" action="${contextPath }/management/security/externalTerminalno/create" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
	<div class="pageFormContent" layoutH="58">
		<p>
			<label>外部终端编号：</label>
			<input type="text" remote_url="${contextPath }/management/security/externalTerminalno/isTerminalnoExists" msgTip="外部终端编号"
				name="terminalno" id="terminalnoAdd" class="w190 terminalno validate[required,maxSize[32]] required" minlength="8" maxlength="8"/>
				&nbsp;&nbsp;<span id="terminalnoAddMsg"></span>
		</p>
		<p id="externalMerno_lookup">
			<label>外部商户编号：</label>
			<input id="externalMernoId" name="externalMerno.id" type="hidden"/>
			<input class="w190 validate[required] required" name="externalMerno.merno" type="text" readonly="readonly" data-prompt-position="centerRight:22,0"/>
			<a class="btnLook" href="${contextPath }/management/security/externalTerminalno/lookup2merno" lookupGroup="externalMerno" mask="true" target="dialog" title="外部商户编号" width="900" height="450" close="closeDialog">选择商户编号</a>	
		</p>
		<p>
			<label>外部商户名称：</label>
			<input class="w190" name="externalMerno.merName" type="text" readonly="readonly"/>
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