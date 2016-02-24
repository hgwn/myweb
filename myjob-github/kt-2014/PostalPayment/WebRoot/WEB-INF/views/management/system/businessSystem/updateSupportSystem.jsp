<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>


<script type="text/javascript">

	var nameValidFlag ;
	var msg ="" ;
	
	var isSuppNameExist = function(){
		var name = encodeURI($.trim($("#systemName_2").val()));
		var scode = $("#systemCode_2").val();
		if(name !=""){
		$.get("${contextPath }/management/system/supportSystem/checkName",{"systemName": name , "isUpdate":"yes", "code":scode},function(data){        
			if(data =="yes"){
		    	  $("#sys_nameMsg_2").attr("class","invalid");
				  msg = "<font color='green'>名字可用!</font>";
		      }else {
		    	  $("#sys_nameMsg_2").attr("class","");
				  msg = "<font color='red'>名字已存在！</font>";
		      }
		      $("#sys_nameMsg_2").html(msg);
			},"text");
		}
	}
	
	$(document).ready(function(){
		$("#systemName_2").blur(isSuppNameExist);
		//提交验证
		$("#supportsystemUpdate_form button[type='submit']").click(function(){
			//debugger;
			$("#supportsystemUpdate_form :input.required").trigger("blur");
			var expiryDateVo = $("#supportsystemUpdate_form input[name='expiryDateVo']");
			var activeDateVo = $("#supportsystemUpdate_form input[name='activeDateVo']");
			var expiryDateVo_val = expiryDateVo.val();
			var activeDateVo_val = activeDateVo.val();
			
			expiryDateVo.parent().find(".error_tip").remove();
			activeDateVo.parent().find(".error_tip").remove();
			if(expiryDateVo_val ==""){
				var error_tip = "<div class='error_tip' style='right:93px; top:9px;'>*此处不可为空</div>";
				expiryDateVo.parent().append(error_tip);
			}
			if(activeDateVo_val==""){
				var error_tip = "<div class='error_tip' style='right:93px; top:12px;'>*此处不可为空</div>";
				activeDateVo.parent().append(error_tip);
			}
			var error = $("#supportsystemUpdate_form .error_tip").length;
			if(error){
				return false;
			}
			//对比生效日期和失效日期
			var aDate =  new Date(Date.parse(activeDateVo_val.replace(/-/g,   "/"))); //转换成Data();
		 	var eDate =  new Date(Date.parse(expiryDateVo_val.replace(/-/g,   "/"))); //转换成Data();
		 	var times =eDate.getTime() - aDate.getTime() ;
		 	if(times == 0){
		 		alertMsg.info("生效日期和失效日期不能是同一天 !");
		 		return false ;
		 	}
		 	if(times < 0){
		 		alertMsg.info("生效日期不能比失效日期迟!");
		 		return false ;
		 	}
		});
	});
</script>

<div class="pageContent">     
<form id="supportsystemUpdate_form"  method="post" action="${contextPath }/management/system/supportSystem/updateSupportSystem" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab);">
		<input type="hidden"   name="id" value="${supportSystem.id}" />
		<input type="hidden"  name="createdBy" value="${supportSystem.createdBy}" />
		<input type="hidden"  name="updatedBy" value="${login_user.id}" />	
		<input type="hidden"  name="createdTimeVo" value="${supportSystem.createdTime}"  />
	<div class="pageFormContent" layoutH="58">
		<p>
			<label>系统名字：</label>
			<input type="text" name="systemName"  id="systemName_2" maxlength="64" value="${supportSystem.systemName}" class="w190 required validate[required]"/>
			&nbsp;&nbsp;<span id="sys_nameMsg_2"></span>
		</p>
	
		<p>
			<label>系统代码：</label>
			<input type="text" name="systemCode" id="systemCode_2" maxlength="64" value="${supportSystem.systemCode}" class="w190"  readonly="readonly"/>
		</p>
		
	
		<p>
			<label>生效日期</label>
     		<input type="text" name="activeDateVo" class="date validate[required] required" dateFmt="yyyy-MM-dd" value="${supportSystem.activeDate}" data-prompt-position="centerRight:22,0" readonly="true" style="width:174px;"/>
			<a class="inputDateButton" href="javascript:;">选择</a>
		</p>
		
		<p>
			<label>失效日期</label>
			<input type="text" name="expiryDateVo" class="date validate[required] required" dateFmt="yyyy-MM-dd"  value="${supportSystem.expiryDate}" data-prompt-position="centerRight:22,0" readonly="true" style="width:174px;"/>
			<a class="inputDateButton" href="javascript:;">选择</a>
		</p>
		
		<p>
			<label>鉴权账号：</label>
			<input type="text" name="account"  maxlength="64" value="${supportSystem.account}" class="w190" />
		</p>
		
		<p>
			<label>鉴权密码：</label>
			<input type="text" name="password"  maxlength="64" value="${supportSystem.password}" class="w190"/>
		</p>
		
		<p>
			<label>状态</label>
			<dwz:dicItem  className="re_select196 validate[required] required" themeName="businessSystem_status" selectedValue="${supportSystem.status}" paramName="status" valueMember="keyItem"   displayMember="item1" />
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