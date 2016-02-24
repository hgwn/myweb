<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@page import="java.util.Date"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">
externalTerminalExport = function(type){
alertMsg.confirm("确认导出吗？", {okCall: function(){
	$("#externalTerminal_selectType").val(type);
	$("#externalTerminal_selectForm").submit();
			return true;
		}
	})
}

var click_check=function(clickid){
	var $box = navTab.getCurrentPanel();
		var ids=$box.find("input:checked").filter("[name='ids']");
		if(ids.length<1){
			alertMsg.warn("请选择信息");
			return false;
		}
		if(ids.length>1){
			alertMsg.warn("只能选择一条数据进行操作！");
			return false;
		}
		$.post("${contextPath }/management/security/externalTerminalno/checkisUpdate",{"id":ids.val()},function(data){
					if(data.statusCode==200){
						$("#"+clickid).click();
					}else{
						alertMsg.error(data.message);
					}
				},"json");
}

$(function(){
	if($("#cleaData-externalMerno-list input[name='externalMerno.merno']").val()==''){
		$("#cleaData-externalMerno-list .cleaData-externalMerno").css("display","none");
	}
	$("#cleaData-externalMerno-list .cleaData-externalMerno").click(function(){	
		$("#cleaData-externalMerno-list input[name='externalMerno.id']").val("");
		$("#cleaData-externalMerno-list input[name='externalMerno.merno']").val("");
		$("#cleaData-externalMerno-list .cleaData-externalMerno").css("display","none");
	});
});	
var externalTerminal_click=function(){
		var $box = navTab.getCurrentPanel();
		var ids=$box.find("input:checked").filter("[name='ids']");
		if(ids.length<1){
			alertMsg.warn("请选择信息");
			return false;
		}
		alertMsg.confirm("确认注销吗？注销后不能再启用", {okCall: function(){
				$("#cancel_externalTerminal").click();
				return true;
			}
		});
		return true;
	};
	
	$(document).ready(function(){
		$('#search_Terminal_externalMerno').autocomplete({
			 serviceUrl: '${contextPath }/management/security/externalMerno/getExternal_merno'
		});
		$('#search_Terminal_externalMerName').autocomplete({
			 serviceUrl: '${contextPath }/management/security/externalMerno/getExternal_merName'
		});
		//$('#search_externalTerminal_merno').autocomplete({
		//	 serviceUrl: '${contextPath }/management/security/externalTerminalno/getExternalTerminal_merno'
		//});
	});
	
</script>
<dwz:paginationForm action="${contextPath }/management/security/externalTerminalno/list" page="${page }">
	<input type="hidden" name="search_LIKE_terminalno" value="${param.search_LIKE_terminalno }"/>
	<input type="hidden" name="merno_no" value="${merno_no }"/>
	<input type="hidden" name="merno_name" value="${merno_name }"/>
	<input type="hidden" name="status" value="${status }"/>
</dwz:paginationForm>

<form id="externalTerminal_selectForm" action="${contextPath }/management/security/externalTerminalno/export">
	<input type="hidden" name="selectType" id="externalTerminal_selectType"/>
	<input type="hidden" name="search_LIKE_terminalno" value="${param.search_LIKE_terminalno }"/>
	<input type="hidden" name="merno_no" value="${merno_no }"/>
	<input type="hidden" name="merno_name" value="${merno_name }"/>
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

<form id="cleaData-externalMerno-list" method="post" action="${contextPath }/management/security/externalTerminalno/list" onsubmit="return navTabSearch(this)">
	<div class="pageHeader">
		<div class="searchBar">
			<div class="searchContent" style="height:auto; width:90%; position:relative;">
			<table class="h-table">
				<tr>
				<td width="110" align="right">外部终端编号：</td>
				<td>
					<input id="search_externalTerminal_merno" style="width:95.5%;" type="text" name="search_LIKE_terminalno" maxlength="8" value="${param.search_LIKE_terminalno}"/>
				</td>
				<td width="110" align="right">外部商户编号：</td>
				<td>
					<input id="search_Terminal_externalMerno" style="width:98%;" name="merno_no" type="text" value="${merno_no}" maxlength="15"/>
				</td>
				<td width="110" align="right">外部商户名称：</td>
				<td>
					<input id="search_Terminal_externalMerName" style="width:98%;" name="merno_name" type="text" value="${merno_name}" maxlength="200"/>
				</td>
				</tr>
				<tr>
				<td width="110" align="right">状态：</td>
				<td>
					<select style="width:98%;" name="status" class="re_select">
						<option selected="selected" value="0">--请选择--</option>
						<option value="E" <c:if test="${status eq 'E'}">selected</c:if>>启用</option>
						<option value="D" <c:if test="${status eq 'D'}">selected</c:if>>停用</option>
						<option value="C" <c:if test="${status eq 'C'}">selected</c:if>>注销</option>
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
			<shiro:hasPermission name="ExternalTerminalno:save">
				<li><a iconClass="book_add" target="dialog" rel="externalTerminalno_add" mask="true" width="550" height="250" href="${contextPath }/management/security/externalTerminalno/create"><span>添加</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="ExternalTerminalno:edit">
			<a style="display:none;" id="externalTerminalno_update" target="selectedOne" rel="ids" mask="true" width="550" height="250" href="${contextPath }/management/security/externalTerminalno/update"></a>
				<li><a iconClass="book_edit" onclick="click_check('externalTerminalno_update');"><span>编辑</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="ExternalTerminalno:disable">
				<li><a iconClass="lock" target="selectedTodo" rel="ids" href="${contextPath }/management/security/externalTerminalno/disable" title="确认要停用吗?"><span>停用</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="ExternalTerminalno:enable">
				<li><a iconClass="lock_open" target="selectedTodo" rel="ids" href="${contextPath }/management/security/externalTerminalno/enable" title="确认要启用吗?"><span>启用</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="ExternalTerminalno:cancel">
				<a style="display:none;" target="selectedTodo" rel="ids" href="${contextPath }/management/security/externalTerminalno/cancel" id="cancel_externalTerminal" title="确认要注销吗?"></a>
				<li><a iconClass="delete" onclick="externalTerminal_click();"><span>注销</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="ExternalTerminalno:import">
				<li><a iconClass="page_white_excel" rel="externalTerminalno_export" href="${contextPath }/template/external-terminalno-template.xls"><span>下载模板</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="ExternalTerminalno:import">
				<li><a iconClass="basket_put" target="dialog" rel="externalTerminalno_import" mask="true"  width="480" height="280" href="${contextPath }/management/security/externalTerminalno/upload"><span>导入终端编号</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="ExternalTerminalno:export">
				<li><a iconClass="page_excel" href="javascript:externalTerminalExport('1');"><span>导出当前页</span></a></li>
				<li><a iconClass="page" href="javascript:externalTerminalExport('0');"><span>导出所有页</span></a></li>
			</shiro:hasPermission>
		</ul>
	</div>
	
	<table class="table" layoutH="147" width="100%">
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="22"><input type="checkbox" group="ids" class="checkboxCtrl"></th>			
				<th>外部终端编号</th>
				<th>外部商户编号</th>
				<th>外部商户名称</th>
				<th width="100" orderField="status" class="${page.orderField eq 'status' ? page.orderDirection : ''}">状态</th>
				<th width="130" orderField="createdTime" class="${page.orderField eq 'createdTime' ? page.orderDirection : ''}">创建时间</th>
				<th width="80">创建人</th>
				<th width="130" orderField="updatedTime" class="${page.orderField eq 'updatedTime' ? page.orderDirection : ''}">修改时间</th>
				<th width="80">修改人</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="item" items="${externalTerminalnos}" varStatus="var">
			<tr target="slt_uid" rel="${item.id}">
				<td align="center">${var.count}</td>
				<td><input name="ids" value="${item.id}" type="checkbox"></td>
				<td>${item.terminalno}</td>
				<td>${item.externalMerno.merno}</td>
				<td>${item.externalMerno.merName}</td>
				<td>
					<dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.COMMON_STATUS %>" dataValue="${fn:trim(item.status)}"/>
				</td>
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