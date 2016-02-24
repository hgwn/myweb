<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<%--<script type="text/javascript">

	var codeValidFlag ;
	var nameValidFlag ;
	var msg ="" ;
	var isBusinessNameExist = function(){
		var name = encodeURI($.trim($("#businessName").val()));
		
		if(name !=""){
		$.get("${contextPath }/management/systen/business/checkName",{"name": name},function(data){        
			
			if(data =="yes"){
		    	  $("#bus_nameMsg").attr("class","invalid");
				  msg = "<font color='green'>业务名字可用!</font>";
		      }else {
		    	  $("#bus_nameMsg").attr("class","");
				  msg = "<font color='red'>业务名字已存在！</font>";
		      }
		      $("#bus_nameMsg").html(msg);
			},"text");
		}
	}
	var isBusinessCodeExist = function(){
		var code = encodeURI($.trim($("#businessCode").val()));
		if(code != ""){
		$.get("${contextPath }/management/systen/business/checkCode",{"code": code},function(data){        
		      if(data=="yes"){
		    	  $("#bus_codeMsg").attr("class","invalid");
					msg = "<font color='green'>业务代码可用!</font>";
		      }else {
		    	  $("#bus_codeMsg").attr("class","");
					msg = "<font color='red'>业务代码已存在！</font>";
		      }
		      $("#bus_codeMsg").html(msg);
			},"text");
		}
	}
	
	$(document).ready(function(){
		
		$("#businessName").keyup(function(){
			clearTimeout(codeValidFlag);
			nameValidFlag = setTimeout(isBusinessNameExist,800);
		});
		
		$("#businessCode").keyup(function(){
			clearTimeout(nameValidFlag);
			codeValidFlag = setTimeout(isBusinessCodeExist,800);
		});
	});
</script>
--%><div class="pageContent">
<form method="post" action="${contextPath }/management/system/business/createBusiness" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
		<input type="hidden" name="createdBy" value = "${login_user.id}" />
		<input type="hidden" name="updatedBy" value = "${login_user.id}" />
		<input type="hidden" name="supportSystem.id" value = "${supID}" />
		
	<%--	 bank_id  关联 ,  所属机构ID organization_id , 业务系统ID business_system_id 页面暂时不写--%>
	<div class="pageFormContent" layoutH="58">
		<p>
				<label>业务名字：</label>
				<input type="text" name="businessName" id="businessName"  maxlength="64" value="" class="w190 input-medium required validate[required]"/>
				&nbsp;&nbsp;<span id="bus_nameMsg" ></span>
		</p>
	
		<p>
				<label>业务代码：</label>
				<input type="text" name="businessCode" id="businessCode"  maxlength="2" value="" class="w190 input-medium required validate[required,custom[onlyLetterNumber]] alphanumeric"/>
				&nbsp;&nbsp;<span id="bus_codeMsg" ></span>
		</p>
		
		<p>
				<label>状态：</label>
				<dwz:dicItem className="validate[required] required re_select196"  themeName="business_status" paramName="status" valueMember="keyItem"   displayMember="item1" />
		</p>	
		
	</div>
	
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button type="submit">确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
		</ul>
	</div>
</form>
</div>