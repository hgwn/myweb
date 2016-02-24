<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<script type="text/javascript">
	function selectBack(id,name){
		document.getElementById("internalMernoId_internal").value=id;
		document.getElementById("internalMernoName_internal").value=name;
		$(".h-cleanBtn-internalMerno").css("display","block");
		$("#close_merno").click();
		return false;
		
	}
</script>

<dwz:paginationForm
	action="${contextPath }/management/system/posTerminal/lookupmerno"
	page="${merno_page }">
	<input type="hidden" name="search_LIKE_merno"
		value="${param.search_LIKE_merno }" />
</dwz:paginationForm>

<form method="post" action="${contextPath }/management/system/posTerminal/lookupmerno" onsubmit="return dialogSearch(this)">
		<div class="pageHeader">
			<div class="searchBar">
				<ul class="searchContent">
					<li>
						<label>商户编号：</label>
						<input type="text" name="search_LIKE_merno" value="${param.search_LIKE_merno}" />
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
				<th width="130" orderField="merno" class="${merno_page.orderField eq 'merno' ? merno_page.orderDirection : ''}">内部商户编号</th>
				<th width="200">收单行名称(代码)</th>
				<th width="120">地区名称(代码)</th>
				<th width="80" orderField="status" class="${merno_page.orderField eq 'status' ? merno_page.orderDirection : ''}">状态</th>
				<th width="80">选择商户编号</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="item" items="${internalMernoInfos}">
			<tr target="slt_uid" rel="${item.id}">
				<td>${item.merno}</td>
				<td>${item.acquirer.item1}(${item.acquirer.keyItem})</td>
				<td>${item.areaCode.item1}(${item.areaCode.keyItem})</td>
				<td>
					<dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.COMMON_STATUS %>" dataValue="${item.status}"/>
				</td>
				<td>
					<a class="btnSelect"  href="javascript:void(0)" onclick="selectBack('${item.id}', '${item.merno}')" title="选择商户编号">选择</a>
	            </td>
			</tr>			
			</c:forEach>
		</tbody>
	</table>
	<dwz:pagination page="${merno_page }" targetType="dialog" onchange="dialogPageBreak({numPerPage:this.value})"/>
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button class="close" id="close_merno" type="button">关闭</button></div></div></li>
		</ul>
	</div>
</div>