<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<script type="text/javascript">
	$(document).ready(function(){
		$("#cleanData").click(function(){
			$.bringBack({id:'', merno:''});
			$("#closeOrg").click();
		})
	});
	
	function clickthis(a,b,c){
		$.bringBack({id:a, merno:b,merName:c});
		$("input[name='externalMerno.merno']").trigger("blur");
	}
</script>

<dwz:paginationForm
	action="${contextPath }/management/security/externalTerminalno/lookup2merno"
	page="${merno_page }">
	<input type="hidden" name="search_dalog_merno" value="${search_dalog_merno }" />
	<input type="hidden" name="terminal_businessid" value="${terminal_businessid}" />
	<input type="hidden" name="terminal_orgcode" value="${terminal_orgcode}" />
</dwz:paginationForm>

<form method="post" action="${contextPath }/management/security/externalTerminalno/lookup2merno" onsubmit="return dialogSearch(this)">
		<div class="pageHeader">
			<div class="searchBar">
				<ul class="searchContent">
					<li>
						<label>商户编号：</label>
						<input type="text" name="search_dalog_merno" value="${search_dalog_merno}" />
					</li>
					<li>
						<label>所属机构：</label>
						<select style="width:130px;" name="terminal_orgcode"  >
							<option value="" selected="selected">--请选择机构--</option>
							<c:forEach var="item" items="${organizations}">
								<option value="${item.code }"
								<c:if test="${terminal_orgcode eq item.code}">
									selected="selected" 
								</c:if>
								>${item.name }</option>
							</c:forEach>
						</select>
					</li>
					<li>
						<label>所属业务：</label>
						<select style="width:130px;" name="terminal_businessid">
							<option value="">--请选择业务--</option>
							<c:forEach items="${businesses}" var="bus">
								<option value="${bus.id}" <c:if test="${terminal_businessid eq bus.id}">selected="selected"</c:if>
								>${bus.businessName }</option>
							</c:forEach>
						</select>
					</li>
				</ul>
				<div class="subBar">
					<ul>						
						<li><div class="button"><div class="buttonContent"><button type="submit">搜索</button></div></div></li>
					</ul>
				</div>
			</div>
		</div>
	</form>


<div class="pageContent">
	<table class="table" layoutH="135" width="100%" targetType="dialog">
		<thead>
			<tr>
				<th width="130" orderField="merno" class="${merno_page.orderField eq 'merno' ? merno_page.orderDirection : ''}">商户编号</th>		
				<th width="150">商户名称</th>
				<th width="150">机构组织</th>
				<th width="100">业务种类</th>
				<th width="80" orderField="status" class="${merno_page.orderField eq 'status' ? merno_page.orderDirection : ''}">状态</th>
				<th width="80">选择商户编号</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="item" items="${externalMernoInfos}">
			<tr target="slt_uid" rel="${item.id}">
				<td>${item.merno}</td>
				<td>${item.merName}</td>
				<td>${item.organization.name}</td>
				<td>
					<c:forEach var="item2" items="${item.externalMernoBizs}" varStatus="var2">
						<c:if test="${var2.count eq 1}">${item2.businessId.businessName}</c:if>
						<c:if test="${var2.count ne 1}">,${item2.businessId.businessName}</c:if>
					</c:forEach>
				</td>
				<td>
					<dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.COMMON_STATUS %>" dataValue="${fn:trim(item.status)}"/>
				</td>
				<td>
					<a class="btnSelect" onclick="clickthis('${item.id}','${item.merno}','${item.merName}')" title="选择终端编号">选择</a>
				</td>
			</tr>			
			</c:forEach>
		</tbody>
	</table>
	<dwz:pagination page="${merno_page }" targetType="dialog" onchange="dialogPageBreak({numPerPage:this.value})"/>
<div class="formBar">
	<ul>
		<%--<li><div class="button"><div class="buttonContent"><button id="cleanData" type="button">清空00</button></div></div></li>
		--%><li><div class="button"><div class="buttonContent"><button class="close" type="button">关闭</button></div></div></li>
	</ul>
</div>
</div>