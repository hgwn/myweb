<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<%@page import="java.util.Date"%>
<script type="text/javascript">
$("#MernoBiz_BusinessId").remoteChained("#MernoBiz_SystemId", "${contextPath }/management/system/business/select");

	function unAssigned_save(id){
			$.ajax({
				type:"post",
				url:"${contextPath }/management/security/externalMernoBiz/delete",
				data:{"id":id},
				success:function(msg){
					var json = jQuery.parseJSON(msg);
					navTabAjaxDone(json);
					$("#externalMernoBiz_form").submit();
					//$("#terminalno_list").loadUrl("${contextPath }/management/system/posTerminal/terminalno_list/${code }");
				},
				error:function(msg){
					var json = jQuery.parseJSON(msg);
					navTabAjaxDone(json);
				}
			}); 
	}
	function Assigned_save(id){
		var busId=$("#MernoBiz_BusinessId").val();
		$.ajax({
			type:"post",
			url:"${contextPath }/management/security/externalMernoBiz/create",
			data:{"businessId":busId,"externalMernoId":id},
			success:function(msg){
				var json = jQuery.parseJSON(msg);
				navTabAjaxDone(json);
				$("#externalMernoBiz_form").submit();
			//$("#terminalno_list").loadUrl("${contextPath }/management/system/posTerminal/terminalno_list/${code }");
			},
			error:function(msg){
				var json = jQuery.parseJSON(msg);
				navTabAjaxDone(json);
			}
		}); 
	}
</script>
<form method="post" id="externalMernoBiz_form" action="${contextPath }/management/security/externalMernoBiz/getExternalMernoList" onsubmit="return dialogSearch(this)">
	<div class="pageHeader">
		<div class="searchBar">
			<div class="searchContent" style="height:auto; width:90%; position:relative;">
			<table class="h-table">
				<tr>
					<td width="110" align="right">业务系统：</td>
					<td> 
						<select id="MernoBiz_SystemId"  name="systemId"  style="width:98%;"  class="re_select"     >
							<option value="0" selected="selected">--请选择系统--</option>
							<c:forEach items="${supportSystems}" var="supp">
								<option value="${supp.id}" <c:if test="${MernoBiz_SystemId eq supp.id }">selected</c:if>
								>${supp.systemName }</option>
							</c:forEach>
						</select>
					</td>
					<td width="110" align="right">业务种类：</td>
					<td>
						<select style="width:98%;"  class="re_select " name="MernoBiz_BusinessId"  id="MernoBiz_BusinessId"  >
							<option value="0">--请选择业务--</option>
							<c:forEach items="${businessInfos}" var="bus">
								<option value="${bus.id}" <c:if test="${MernoBiz_BusinessId eq bus.id}">selected="selected"</c:if>
								>${bus.businessName }</option>
							</c:forEach>
						</select>
					</td>
					<td width="110" align="right">机构组织：</td>
					<td>
						<select class="re_select" name="MernoBiz_OrgCode"  >
						<option value="0" selected="selected">--请选择机构--</option>
							<c:forEach var="item" items="${organizations}">
								<option value="${item.code }"
								<c:if test="${MernoBiz_OrgCode eq item.code}">
									selected="selected" 
								</c:if>
								>${item.name }</option>
							</c:forEach>
						</select>
					</td>
					
				</tr>
			</table>
			</div>
			<div class="subBar">
				<ul>						
					<li><div class="button"><div class="buttonContent"><button type="submit">搜索</button></div></div></li>
				</ul>
			</div>
		</div>
	</div>
</form>	
<div class="pageContent">
	<table class="table" layoutH="308" width="450">
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="100" class="red" align="center">可关联的外部商户</th>			
				<th width="150">外部商户编号</th>
				<th width="200" class="h-externalMerno-th">外部商户名称</th>
				<th width="200">所属机构</th>
				<th width="100">手续费率</th>
				<th width="80" orderField="status" class="${page.orderField eq 'status' ? page.orderDirection : ''}">状态</th>
				<th width="130" orderField="createdTime" class="${page.orderField eq 'createdTime' ? page.orderDirection : ''}">创建时间</th>
			</tr>
		</thead>
		<tbody id="unAssigned">
			<c:forEach var="item" items="${ExternalMernos}" varStatus="var">
			<tr target="slt_uid" rel="${item.id}">
				<td align="center">${var.count}</td>
				<td align="center"><input type="button" style="height:21px; margin-left:10px; cursor:pointer;" value="关联" onclick="Assigned_save(${item.id});"></td>
				<td>${item.merno}</td>
				<td>${item.merName}</td>
				<td>${item.organization.name}</td>
				<td><fmt:formatNumber value="${item.feeRate}" type="percent" minFractionDigits="2" /><br/></td>
				<td>
					<dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.COMMON_STATUS %>" dataValue="${item.status}"/>
				</td>
				<td><fmt:formatDate value="${item.createdTime}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
			</tr>			
			</c:forEach>
		</tbody>
	</table>
	<!-- 分页 -->
</div>	
<div class="pageContent" style="position:relative; height:240px;  overflow:auto; padding:0;">
	<table class="table" style="height:240px; overflow:auto;" width="902">
	<thead>
			<tr>
				<th width="30">序号</th>
				<th width="100" class="blue" align="center">已关联的外部商户</th>			
				<th width="150">外部商户编号</th>
				<th width="200" class="h-externalMerno-th">外部商户名称</th>
				<th width="200">所属机构</th>
				<th width="100">手续费率</th>
				<th width="80" orderField="status" class="${page.orderField eq 'status' ? page.orderDirection : ''}">状态</th>
				<th width="130" orderField="createdTime" class="${page.orderField eq 'createdTime' ? page.orderDirection : ''}">创建时间</th>
			</tr>
	</thead>
	<tbody id="Assigned">
			<c:forEach var="item" items="${ExternalMernoBizs}" varStatus="var">
			<tr target="slt_uid" rel="${item.id}">
				<td align="center">${var.count}</td>
				<td align="center"><input type="button" style="height:21px; margin-left:10px; cursor:pointer;" value="解除关联" onclick="unAssigned_save(${item.id});"></td>
				<td>${item.externalMernoId.merno}</td>
				<td>${item.externalMernoId.merName}</td>
				<td>${item.externalMernoId.organization.name}</td>
				<td><fmt:formatNumber value="${item.externalMernoId.feeRate}" type="percent" minFractionDigits="2" /><br/></td>
				<td>
					<dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.COMMON_STATUS %>" dataValue="${item.externalMernoId.status}"/>
				</td>
				<td><fmt:formatDate value="${item.externalMernoId.createdTime}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
			</tr>			
			</c:forEach>
	</tbody>
	</table>
</div>
