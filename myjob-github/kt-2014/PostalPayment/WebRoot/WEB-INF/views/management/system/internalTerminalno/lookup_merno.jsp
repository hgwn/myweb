<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<script type="text/javascript">
	function clickthis(id,merno,merName){
		$.bringBack({id:id, merno:merno, merName:merName});
		$(".clean-internalMerno").css("display","block");
		$("#internalMerno_create_id").trigger("blur");
	}
</script>

<dwz:paginationForm
	action="${contextPath }/management/system/internalTerminalno/lookup2merno"
	page="${merno_page }">
	<input type="hidden" name="search_LIKE_merno" value="${param.search_LIKE_merno }" />
	<input type="hidden" name="search_LIKE_merName" value="${param.search_LIKE_merName }" />
	<input type="hidden" name="areaCodeid" value="${areaCodeid }" />
</dwz:paginationForm>

<form method="post" action="${contextPath }/management/system/internalTerminalno/lookup2merno" onsubmit="return dialogSearch(this)">
		<div class="pageHeader">
			<div class="searchBar">
				<ul class="searchContent">
					<li>
						<label>商户编号：</label>
						<input type="text" name="search_LIKE_merno" value="${param.search_LIKE_merno}" />
					</li>
					<li>
						<label>商户名称：</label>
						<input type="text" name="search_LIKE_merName" value="${param.search_LIKE_merName}" />
					</li>
					<li>
						<label>地区名称：</label>
						<select style="width: 130px" name="areaCodeid" class="re_select196">
							<option value="">--选择--</option>
							<c:forEach var="province" items="${provinces }">
								<option value="${province.id }"
									<c:if test="${province.id eq areaCodeid }">
										selected="selected"
									</c:if>
								>${province.item1}(${province.keyItem})</option>
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
				<th width="130" orderField="merno" class="${merno_page.orderField eq 'merno' ? merno_page.orderDirection : ''}">内部商户编号</th>
				<th width="130">商户名称</th>
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
				<td>${item.merName}</td>
				<td>${item.acquirer.item1}(${item.acquirer.keyItem})</td>
				<td>${item.areaCode.item1}(${item.areaCode.keyItem})</td>
				<td>
					<dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.COMMON_STATUS %>" dataValue="${item.status}"/>
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
			<li><div class="button"><div class="buttonContent"><button class="close" type="button">关闭</button></div></div></li>
		</ul>
	</div>
</div>