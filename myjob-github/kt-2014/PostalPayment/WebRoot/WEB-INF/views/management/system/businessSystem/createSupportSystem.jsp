<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<script type="text/javascript">

	var codeValidFlag ;
	var nameValidFlag ;
	var msg ="" ;
	var isSuppNameExist = function(){
		var name = encodeURI($.trim($("#systemName_1").val()));
		
		if(name !=""){
		$.get("${contextPath }/management/system/supportSystem/checkName",{"systemName": name , "isUpdate":"no"},function(data){        
			
			if(data =="yes"){
		    	  $("#sup_nameMsg_1").attr("class","invalid");
				  msg = "<font color='green'>业务名字可用!</font>";
		      }else {
		    	  $("#sup_nameMsg_1").attr("class","");
				  msg = "<font color='red'>业务名字已存在！</font>";
		      }
		      $("#sup_nameMsg_1").html(msg);
			},"text");
		}
	}
	var isSuppCodeExist = function(){
		var code = encodeURI($.trim($("#systemCode_1").val()));
		if(code != ""){
		$.get("${contextPath }/management/system/supportSystem/checkCode",{"code": code},function(data){        
		      if(data=="yes"){
		    	  $("#sup_codeMsg_1").attr("class","invalid");
					msg = "<font color='green'>业务代码可用!</font>";
		      }else {
		    	  $("#sup_codeMsg_1").attr("class","");
					msg = "<font color='red'>业务代码已存在！</font>";
		      }
		      $("#sup_codeMsg_1").html(msg);
			},"text");
		}
	}
	
	
	$(document).ready(function(){
		
		
	
		
		
		
		/*
		$("#systemName_1").keyup(function(){
			clearTimeout(nameValidFlag);
			codeValidFlag = setTimeout(isSuppNameExist,800);
		});
		$("#systemCode_1").keyup(function(){
			clearTimeout(codeValidFlag);
			nameValidFlag = setTimeout(isSuppCodeExist,800);
		});
		*/
		$("#systemName_1").blur(isSuppNameExist) ;
		$("#systemCode_1").blur(isSuppCodeExist) ;
		
		/*$("#supportsystemCreat_form").validationEngine({ 
			validationEventTriggers:"keyup",  //触发的事件  validationEventTriggers:"keyup blur",   
            inlineValidation: false,//是否即时验证，false为提交表单时验证,默认true   
            success :  false,//为true时即使有不符合的也提交表单,false表示只有全部通过验证了才能提交表单,默认false   
            promptPosition: "topRight"//提示所在的位置，topLeft, topRight, bottomLeft,  centerRight, bottomRight   
            //failure : function() { alert("验证失败，请检查。");  }//验证失败时调用的函数   
            //success : function() { callSuccessFunction() },//验证通过时调用的函数   
			})
		*/
		//提交验证
		$("#supportsystemCreate_form button[type='submit']").click(function(){
			//debugger;
			$("#supportsystemCreate_form :input.required").trigger("blur");
			var expiryDateVo = $("#supportsystemCreate_form input[name='expiryDateVo']");
			var activeDateVo = $("#supportsystemCreate_form input[name='activeDateVo']");
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
			var error = $("#supportsystemCreate_form .error_tip").length;
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
		$("#supportsystemCreate_form input[name='activeDateVo']").bind("blur",function(){	
				$(this).parent().find(".error_tip").remove();
		});
		//expiryDateVo隐藏提示
		$("#supportsystemCreate_form input[name='expiryDateVo']").bind("blur",function(){
				$(this).parent().find(".error_tip").remove();
		});
	});
</script>


<div class="pageContent">
<form id="supportsystemCreate_form" method="post" action="${contextPath }/management/system/supportSystem/createSupportSystem" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadNavTab)  ;">
		<input type="hidden" name="createdBy" value = "${login_user.id} " />
		<input type="hidden" name="updatedBy" value = "${login_user.id} " />
	<%--	 bank_id  关联 ,  所属机构ID organization_id , 业务系统ID business_system_id 页面暂时不写--%>
	<div class="pageFormContent" layoutH="58">
		<p>
			<label>系统名字：</label>
			<input type="text" name="systemName" id="systemName_1" maxlength="64" value="" class="w190 required validate[required]"/>
			&nbsp;&nbsp;<span id="sup_nameMsg_1" ></span>
		</p>
	
		<p>
			<label>系统代码：</label>
			<input type="text" name="systemCode" id="systemCode_1" maxlength="2" value="" class="w190 required validate[required,custom[onlyLetterNumber] "/>
			&nbsp;&nbsp;<span id="sup_codeMsg_1" ></span>
		</p>
		
		<p>
			<label>生效日期</label>
     		<input type="text" name="activeDateVo" class="date required " dateFmt="yyyy-MM-dd" data-prompt-position="centerRight:22,0"  readonly="true" style="width:174px;"/>
			<a class="inputDateButton" href="javascript:;">选择</a>
		</p>
		
		<p>
			<label>失效日期</label>
			<input type="text" name="expiryDateVo" class="date required" data-prompt-position="centerRight:22,0" dateFmt="yyyy-MM-dd"   readonly="true" style="width:174px;"/>
			<a class="inputDateButton" href="javascript:;">选择</a>
		</p>
		
		
		<p>
			<label>鉴权账号：</label>
			<input type="text" name="account" class="w190"  maxlength="64" value="" />
		</p>
		
		<p>
			<label>鉴权密码：</label>
			<input type="text" name="password" class="w190" maxlength="64" value=""/>
		</p>
		
		<p>
			<label>状态</label>
			<dwz:dicItem className="re_select196 validate[required] required" themeName="businessSystem_status" paramName="status" valueMember="keyItem"   displayMember="item1"  />
		</p>	
		
	</div>
	
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button type="submit" >确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button type="button" class="close">关闭</button></div></div></li>
		</ul>
	</div>
</form>
</div>