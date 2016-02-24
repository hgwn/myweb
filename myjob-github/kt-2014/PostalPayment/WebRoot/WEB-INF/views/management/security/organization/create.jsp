<%@page import="com.rongbang.utils.PlatformConstants"%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">

	var validFlag ;
	var repeatValid = function(obj){
		var validObj = $(obj);
		var remote_url = validObj.attr("remote_url");
		var validAttrName = validObj.attr("id");
		var validAttrValue = encodeURI($.trim(validObj.attr("value")));
		var msgTip = validObj.attr("msgTip");
		if(validAttrValue!=""){
			var params = {};
			$.ajax({
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
	
	var validCodeAndName = function(){
		
		if($(".invalid").length>0){
			return false;
		}else{
			return true;
		}
	}
	
	var parent_callback = function(){
		var levels = $("#parentLevel").val();
		if(parseInt(levels) == <%=PlatformConstants.ORG_LEVEL_SUBSTATION%>
		||parseInt(levels) == <%=PlatformConstants.ORG_LEVEL_COUNTRY%> ){
			$("#category").attr("disabled",false);
			$("#organ_category").show();
		}else{
			$("#category").attr("disabled",true);
			$("#organ_category").hide();
		}
	}
	$(document).ready(function(){
		
		$(".repeatValid").keyup(function(){
			var v = $(this);
			clearTimeout(validFlag);
			validFlag = setTimeout(function(){
				repeatValid(v);
			},500);
		});
		$("#org_create_submBtn").click(function(){
			return validCodeAndName();
		}); 
		parent_callback();
	});
	
	
</script>

<a id="refreshJbsxBox2organizationTree" rel="jbsxBox2organizationTree" target="ajax" href="${request.contextPath}/management/security/organization/tree" style="display:none;"></a>
<div class="pageContent">
<form method="post" action="${contextPath }/management/security/organization/create" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadRel2Org);">
	<input type="hidden" name="parent.code" value="${parentOrganizationCode }"/>
	<input type="hidden" name="parent.orgLevel" id="parentLevel" value="${parentLevel}"/>
	<div class="pageFormContent" layoutH="58">
		<p>
			<label>机构代码：</label>
			<input name="code" id="orgCode" type="text" class="w190 repeatValid validate[required] required" maxlength="20"
				remote_url="${contextPath }/management/security/organization/isCodeExist" msgTip="机构代码" />
			&nbsp;&nbsp;<span id="orgCodeMsg" ></span>
			<!--  <a class="btnLook" href="${contextPath }/management/security/organization/lookup2code" lookupGroup="" title="机构代码" width="400">查找带回</a>-->
		</p>
		<p>
			<label>机构名称：</label>
			<input type="text" name="name" id="orgName" class="w190 repeatValid required validate[required]" maxlength="64"
			remote_url="${contextPath }/management/security/organization/isNameExist" msgTip="机构名称"/>
			&nbsp;&nbsp;<span id="orgNameMsg" ></span>
		</p>
		<p>
			<label>机构简称：</label>
			<input type="text" name="shortName"  class="w190 validate[maxSize[20]]" maxlength="20"/>
		</p>
		<%-- <p>
			<label>隶属机构：</label>
			<input name="parent.id"  type="hidden"/>
			<input name="parent.orgLevel" type="hidden" id="levels" />
			<input class="validate[required] required" name="parent.name" type="text" readonly="readonly" style="width: 140px;"/>
			<a class="btnLook" href="${contextPath}/management/security/organization/lookupParent" 
				callback="parent_callback" lookupGroup="parent" mask="true" title="选择隶属机构" width="400">查找带回</a>
		</p> --%>
		<p>
			<label>地域：</label>
			<select name="zoneNo" class="re_select196">
				<c:forEach var="province" items="${provinces }">
					<option value="${province.keyItem }">${province.item1 }</option>
				</c:forEach>
			</select>
		</p>
		<p>
			<label>机构地址：</label>
			<input type="text" name="address" class="w190" maxlength="256"/>
		</p>
		<p>
			<label>机构状态：</label>
			<select name="status" id="status" class="re_select196">
				<option value="1">正常</option>
				<option value="0">注销</option>
			</select>
		</p>
		<p>
			<label>负责人姓名：</label>
			<input type="text" name="leadName" class="w190 " maxlength="50"/>
		</p>
		<p>
			<label>联系人电话：</label>
			<input type="text" name="phoneNo" class="phone w190 validate[custom[phone]]" maxlength="30"/>
		</p>
		<p id="organ_category" style="display:none;">
			<label>机构属性：</label>
			<select name="orgCategory" id="category" class="re_select196">
				<option value="1">
					邮政营业网点
				</option>
				<option value="2">
					便民服务站
				</option>
			</select>
		</p>
		<p >
			<label>机构性质：</label>
			<select name="workType" class="re_select196">
				<option value="0">
					代办
				</option>
				<option value="1">
					自办
				</option>
			</select>
		</p>		
		<p>
			<label>排序：</label>
			<input type="text" name="priority" class="w190 validate[required,custom[integer],min[1],max[999]] required" value="999" maxlength="3" />
			<span class="info">（越小越靠前）</span>
		</p>				
		<p class="nowrap">
			<label>描述：</label>
			<textarea name="description" cols="29" rows="3" maxlength="256" class="w190"></textarea>
		</p>	
	</div>
			
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button id="org_create_submBtn" type="submit">确定</button></div></div></li>
			<li><div class="button"><div class="buttonContent"><button type="button" id="org_create_closeBtn" class="close">关闭</button></div></div></li>
		</ul>
	</div>
</form>
</div>
