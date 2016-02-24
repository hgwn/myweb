<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<script type="text/javascript">

	var nameValidFlag ;
	var msg ="" ;

	var isBusinessNameExist = function(){
		var name = encodeURI($.trim($("#businessName_2").val()));
		if(name !=""){
		$.get("${contextPath }/management/system/business/checkName",{"name": name},function(data){        
			
			if(data =="yes"){
		    	  $("#bus_nameMsg_2").attr("class","invalid");
				  msg = "<font color='green'>名字可用!</font>";
		      }else {
		    	  $("#bus_nameMsg_2").attr("class","");
				  msg = "<font color='red'>名字已存在！</font>";
		      }
		      $("#bus_nameMsg_2").html(msg);
			},"text");
		}
	}
	
	$(document).ready(function(){
		$("#businessName_2").blur(isBusinessNameExist);
	});
</script>

<div class="pageContent">     
<form method="post" action="${contextPath }/management/system/business/updateBusiness" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
		<input type="hidden"  name="id" value="${business.id}" />
		<input type="hidden"  name="createdBy" value="${business.createdBy}" />
		<input type="hidden"  name="updatedBy" value="${login_user.id}" />
		
	<div class="pageFormContent" layoutH="58">
		<p>
			<label>业务名字：</label>
			<input type="text" name="businessName" id="businessName_2" maxlength="64" value="${business.businessName}" class="w190 input-medium required validate[required]"/>
			&nbsp;&nbsp;<span id="bus_nameMsg_2"></span>
		</p>
	
		<p>
			<label>业务代码：</label>
			<input type="text" name="businessCode"  maxlength="64" value="${business.businessCode}" class="input-medium w190 " readonly="readonly"/>
		</p>
	
		<p>
				<label>状态：</label>
				<dwz:dicItem themeName="business_status"  className="required validate[required] re_select196" paramName="status" valueMember="keyItem"   displayMember="item1"  selectedValue="${business.status}"/>
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