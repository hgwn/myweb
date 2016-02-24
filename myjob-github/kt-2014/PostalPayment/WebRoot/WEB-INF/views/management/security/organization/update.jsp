<%@page import="com.rongbang.utils.PlatformConstants"%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">

	var nameValidFlag;
	
	var isNameExist = function(){
		var originName = $("#organ_name").attr("originName"),
			organ_name = $.trim($("#organ_name").val());
		if($.trim(originName)==$.trim(organ_name)){
			$("#nameMsg").attr("class","");
			$("#nameMsg").html("");
			return;
		}
		var name = encodeURI($.trim($("#organ_name").val()));
		if(name!=""){
			$.ajax({
				type:"post",
				url:"${contextPath }/management/security/organization/isNameExist",
				data:{"name":name},
				dataType:"text",
				success:function(data){
						if(data=="yes"){
							$("#nameMsg").attr("class","invalid");
							msg = "<font color='red'>机构名称已存在!</font>";
						}else{
							$("#nameMsg").attr("class","");
							msg = "<font color='green'>机构机构可用！</font>";
						}
						$("#nameMsg").html(msg);
					},
				error:function(data){
					alertMsg.error("调用失败");
				}
				});
		}
	}
	
	var validCodeAndName = function(){
		
		if($(".invalid").length>0){
			return false;
		}else{
			return true;
		}
	}
	$(document).ready(function(){
		
		$("#organ_name").keyup(function(){
			clearTimeout(nameValidFlag);
			nameValidFlag = setTimeout(isNameExist,800);
		});
		
	});
</script>
<a id="refreshJbsxBox2organizationTree" rel="jbs xBox2organizationTree" target="ajax" href="${request.contextPath}/management/security/organization/tree" style="display:none;"></a>
<div class="pageContent">
<form method="post" action="${contextPath }/management/security/organization/update" class="required-validate pageForm" onsubmit="return validateCallback(this, dialogReloadRel2Org);">	<input type="hidden" name="parent.code" value="${organization.parent.code }"/>
	<input type="hidden" name="orgLevel" value="${organization.orgLevel }" />
	<div class="pageFormContent" layoutH="58">
		<p>
			<label>机构代码：</label>
			<input type="text" name="code" class="w190" readonly="readonly" value="${organization.code }" maxlength="20"/>
		</p>
		<p>
			<label>机构名称：</label>
			<input type="text" name="name" id="organ_name" originName="${organization.name}" class="w190 validate[required]  required" maxlength="64" value="${organization.name }"/>
			&nbsp;&nbsp;<span id="nameMsg" ></span>
		</p>
		<p>
			<label>机构简称：</label>
			<input type="text" name="shortName" value="${organization.shortName }"  class="w190 validate[maxSize[10]]" maxlength="20"/>
		</p>
		<p>
			<label>地域：</label>
			<select name="zoneNo" class="re_select196">
				<c:forEach var="province" items="${provinces }">
					<option value="${province.keyItem }"
						<c:if test="${province.keyItem eq organization.zoneNo }">
							selected="selected"
						</c:if>
					>${province.item1 }</option>
				</c:forEach>
			</select>
		</p>
		<p>
			<label>机构地址：</label>
			<input type="text" name="address" class="w190"  value="${organization.address }" maxlength="256"/>
		</p>
		<p>
			<label>机构状态：</label>
			<select name="status" id="status" class="re_select196">
				<option value="1" <c:if test="${organization.status==1 }">selected</c:if>>正常</option>
				<option value="0" <c:if test="${organization.status==0 }">selected</c:if>>注销</option>
			</select>
		</p>
		<p>
			<label>负责人姓名：</label>
			<input type="text" name="leadName" class="w190 "  value="${organization.leadName }" maxlength="50"/>
		</p>
		<p>
			<label>联系人电话：</label>
			<input type="text" name="phoneNo" class="w190 validate[custom[phone]]"   value="${organization.phoneNo }" maxlength="30"/>
		</p>
		<c:set var="siteLevel" scope="page" value="<%=PlatformConstants.ORG_LEVEL_SITE %>"/>
		<c:if test="${organization.orgLevel ==siteLevel }">
			<p>
				<label>机构属性：</label>
				<select name="orgCategory" class="re_select190">
					<option value="1" 
						<c:if test="${organization.orgCategory==1}">
							selected="selected"
						</c:if>
					>邮政营业网点</option>
					<option value="2"
						<c:if test="${organization.orgCategory==2}">
							selected="selected"
						</c:if>
					>便民服务站</option>
				</select>
			</p>
		</c:if>	
		<p >
			<label>机构性质：</label>
			<select name="workType" class="re_select196" >
				<option value="0"
					<c:if test="${organization.workType==0}">
						selected="selected"
					</c:if>>
					代办
				</option>
				<option value="1"
					<c:if test="${organization.workType==1}">
						selected="selected"
					</c:if>>
					自办
				</option>
			</select>
		</p>		
		<p>
			<label>排序：</label>
			<input type="text" name="priority" class="w190 validate[required,custom[integer],min[1],max[999]] required" value="${organization.priority }" maxlength="3"/>
			<span class="info">（越小越靠前）</span>
		</p>				
		<p class="nowrap">
			<label>描述：</label>
			<textarea name="description" cols="29" rows="3" maxlength="256" class="w190 input-medium textarea-scroll">${organization.description }</textarea>
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