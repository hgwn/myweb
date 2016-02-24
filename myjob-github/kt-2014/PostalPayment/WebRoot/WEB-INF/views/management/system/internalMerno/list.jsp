<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<%@page import="java.util.Date"%>
<script type="text/javascript">
internalMernoExport = function(type){
alertMsg.confirm("确认导出吗？", {okCall: function(){
	$("#internalMerno_selectType").val(type);
	$("#internalMerno_selectForm").submit();
			return true;
		}
	});
	
}

var internalMerno_click=function(){
		var $box = navTab.getCurrentPanel();
		var ids=$box.find("input:checked").filter("[name='ids']");
		if(ids.length<1){
			alertMsg.warn("请选择信息");
			return false;
		}
		alertMsg.confirm("确认注销吗？注销后不能再启用", {okCall: function(){
				$("#cancel_internalMerno").click();
				return true;
			}
		});
		return true;
	};
	
	$(document).ready(function(){
		//$('#search_internal_merno').autocomplete({
		//	serviceUrl: '${contextPath }/management/system/internalMerno/getInternal_merno'
		//});
		//$('#search_internal_merName').autocomplete({
		//	serviceUrl: '${contextPath }/management/system/internalMerno/getInternal_merName'
		//});
	});
	
</script>
<dwz:paginationForm action="${contextPath }/management/system/internalMerno/list" page="${page }">
	<input type="hidden" name="search_LIKE_merno" value="${param.search_LIKE_merno }"/>
	<input type="hidden" name="search_LIKE_merName" value="${param.search_LIKE_merName }"/>
	<input type="hidden" name="areaCode_id" value="${areaCode_id }"/>
	<input type="hidden" name="status" value="${status }"/>
</dwz:paginationForm>

<form id="internalMerno_selectForm" action="${contextPath }/management/system/internalMerno/export">
	<input type="hidden" name="selectType" id="internalMerno_selectType"/>
	<input type="hidden" name="search_LIKE_merno" value="${param.search_LIKE_merno }"/>
	<input type="hidden" name="search_LIKE_merName" value="${param.search_LIKE_merName }"/>
	<input type="hidden" name="areaCode_id" value="${areaCode_id }"/>
	<input type="hidden" name="status" value="${status }"/>
	<input type="hidden" name="plainPageNum" value="${page.plainPageNum }"/>
	<input type="hidden" name="pageNum" value="${page.pageNum }"/>
	<input type="hidden" name="numPerPage" value="${page.numPerPage }"/>
	<input type="hidden" name="orderField" value="${page.orderField }"/>
	<input type="hidden" name="orderDirection" value="${page.orderDirection }"/>
	<input type="hidden" name="totalPage" value="${page.totalPage }"/>
	<input type="hidden" name="prePage" value="${page.prePage }"/>
	<input type="hidden" name="nextPage" value="${page.nextPage }"/>
	<input type="hidden" name="totalCount" value="${page.totalCount }"/>
</form>

<form method="post" action="${contextPath }/management/system/internalMerno/list" onsubmit="return navTabSearch(this)">
	<div class="pageHeader">
		<div class="searchBar">
			<div class="searchContent" style="height:auto; width:90%; position:relative;">
			<table class="h-table">
				<tr>
				<td width="110" align="right">内部商户编号：</td>
				<td>
					<input id="search_internal_merno" style="width:95.5%;" type="text" name="search_LIKE_merno" maxlength="15" value="${param.search_LIKE_merno}"/>
				</td>
				<td width="110" align="right">内部商户名称：</td>
				<td>
					<input id="search_internal_merName" style="width:98%;" type="text" name="search_LIKE_merName" maxlength="200" value="${param.search_LIKE_merName}"/>
				</td>
				<td width="110" align="right">状态：</td>
				<td>
					<select style="width:98%;" name="status" class="re_select ">
						<option selected="selected" value="0">--请选择--</option>
						<option value="E" <c:if test="${status eq 'E'}">selected</c:if>>启用</option>
						<option value="D" <c:if test="${status eq 'D'}">selected</c:if>>停用</option>
						<option value="C" <c:if test="${status eq 'C'}">selected</c:if>>注销</option>
					</select>
				</td>
				</tr>
				<tr>
					<td width="110" align="right">地区名称：</td>
					<td>
						<select style="width:98%;" name="areaCode_id" class="re_select">
							<option selected="selected" value="0">--请选择--</option>
							<c:forEach var="areaCode" items="${areaCodes }">
								<option value="${areaCode.id }"
									<c:if test="${areaCode.id eq areaCode_id }">
										selected="selected"
									</c:if>
								>${areaCode.item1}</option>
							</c:forEach>
						</select>
					</td>
					<td colspan="4"></td>
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

	<div class="panelBar">
		<ul class="toolBar">
			<shiro:hasPermission name="InternalMerno:save">
				<li><a iconClass="user_add" target="dialog" rel="externalMerno_add" mask="true" width="550" height="300" href="${contextPath }/management/system/internalMerno/create"><span>添加</span></a></li>
			</shiro:hasPermission>
			<%-- <shiro:hasPermission name="InternalMerno:edit">
				<li><a iconClass="user_edit" target="dialog" rel="externalMerno_edit" mask="true" width="550" height="300" href="${contextPath }/management/system/internalMerno/update/{slt_uid}"><span>编辑内部商户编号</span></a></li>
			</shiro:hasPermission> --%>
			<shiro:hasPermission name="InternalMerno:disable">
				<li><a iconClass="lock" target="selectedTodo" rel="ids" href="${contextPath }/management/system/internalMerno/disable" title="确认要停用吗?"><span>停用</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="InternalMerno:enable">
				<li><a iconClass="lock_open" target="selectedTodo" rel="ids" href="${contextPath }/management/system/internalMerno/enable" title="确认要启用吗?"><span>启用</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="InternalMerno:cancel">
				<li><a iconClass="delete" onclick="internalMerno_click();"><span>注销</span></a></li>
				<a style="display:none;" id="cancel_internalMerno" target="selectedTodo" rel="ids" href="${contextPath }/management/system/internalMerno/cancel" title="确认要注销吗?"></a>
			</shiro:hasPermission>
			<shiro:hasPermission name="InternalMerno:export">
				<li><a iconClass="page_excel" href="javascript:internalMernoExport('1');"><span>导出当前页</span></a></li>
				<li><a iconClass="page" href="javascript:internalMernoExport('0');"><span>导出所有页</span></a></li>
			</shiro:hasPermission>
		</ul>
	</div>
	
	<table class="table" layoutH="147" width="1700">
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="22"><input type="checkbox" group="ids" class="checkboxCtrl"></th>			
				<th width="150">商户编号</th>
				<th width="150">商户名称</th>
				<th width="150">收单行代码</th>
				<th width="150">收单行名称</th>
				<th width="100">地区代码</th>
				<th width="150">地区名称</th>
				<th width="150">商户类别代码(MCC)</th>
				<th width="150">商户类别名称</th>
				<th width="80" orderField="status" class="${page.orderField eq 'status' ? page.orderDirection : ''}">状态</th>
				<th width="128">所属POSP</th>
				<th width="130" orderField="createdTime" class="${page.orderField eq 'createdTime' ? page.orderDirection : ''}">创建时间</th>
				<th width="80">创建人</th>
				<th width="130" orderField="updatedTime" class="${page.orderField eq 'updatedTime' ? page.orderDirection : ''}">修改时间</th>
				<th width="80">修改人</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="item" items="${internalMernos}" varStatus="var">
			<tr target="slt_uid" rel="${item.id}">
				<td align="center">${var.count}</td>
				<td><input name="ids" value="${item.id}" type="checkbox"></td>
				<td>${item.merno}</td>
				<td>${item.merName}</td>
				<td>${item.acquirer.keyItem}</td>
				<td>${item.acquirer.item1}</td>
				<td>${item.areaCode.keyItem}</td>
				<td>${item.areaCode.item1}</td>
				<td>${item.mcc.keyItem}</td>
				<td>${item.mcc.item1}</td>
				<td>
					<dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.COMMON_STATUS %>" dataValue="${item.status}"/>
				</td>
				<td>${item.pospId eq 1 ? "邮储" : item.pospId eq 2 ? "银联" : "未指定" }</td>
				<td><fmt:formatDate value="${item.createdTime}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
				<td>${item.createdBy.realname}</td>
				<td><fmt:formatDate value="${item.updatedTime}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
				<td>${item.updatedBy.realname}</td>
			</tr>			
			</c:forEach>
		</tbody>
	</table>
	<!-- 分页 -->
	<c:if test="${page.totalCount eq 0}">
		    	<div class="re_tips">没有搜到符合您条件的数据！</div>
   	</c:if>
	<dwz:pagination page="${page }"/>
</div>