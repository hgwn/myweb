<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<%@page import="java.util.Date"%>

<script type="text/javascript">
internalTerminalExport = function(type){
alertMsg.confirm("确认导出吗？", {okCall: function(){
	$("#internalTerminal_selectType").val(type);
	$("#internalTerminal_selectForm").submit();
			return true;
		}
	});
	
}

	$(document).ready(function(){
	
	//$('#search_Internal_terminal').autocomplete({
	//	serviceUrl: '${contextPath }/management/system/internalTerminalno/getInternal_terminal'	 
	//});
	$('#search_terminal_internalMerno').autocomplete({
		serviceUrl: '${contextPath }/management/system/internalMerno/getInternal_merno'	
	});
	$('#search_terminal_internalMerName').autocomplete({
		serviceUrl: '${contextPath }/management/system/internalMerno/getInternal_merName'
	});
	$('#search_terminal_posCode').autocomplete({
		serviceUrl: '${contextPath }/management/system/posTerminal/getPos_code'
	});
		
});
	
	var key_click=function(){
		var $box = navTab.getCurrentPanel();
		var Currentselected=$box.find("input:checked").filter("[name='ids']")
		var terminalKey=Currentselected.attr("key");
		var id=Currentselected.val();
		if(id==null || id==""){
			alertMsg.warn("请先选择信息");
			return false;
		}
		if(Currentselected.length>1){
			alertMsg.warn("只能选择一条数据进行操作！");
			return false;
		}
		var title="";
		if(terminalKey=="" || terminalKey==null){
			title="确认要生成密钥吗?";	
		}else{
			title="本次操作将生成新的主密钥覆盖原来的主密钥"+terminalKey+"是否继续？";
		}
		alertMsg.confirm(title,{
		okCall:function(){
				$.post("${contextPath }/management/system/internalTerminalno/genKey",{"id":id},function(data){
					if(data.statusCode==200){
						alertMsg.correct(data.message);
					}else{
						alertMsg.error(data.message);
					}
					return navTabSearch(this);
				},"json");
				}
		});	
	}
	
	var internalTerminal_click=function(){
		var $box = navTab.getCurrentPanel();
		var ids=$box.find("input:checked").filter("[name='ids']");
		if(ids.length<1){
			alertMsg.warn("请选择信息");
			return false;
		}
		alertMsg.confirm("确认注销吗？注销后不能再启用", {okCall: function(){
				$("#cancel_internalTerminal").click();
				return true;
			}
		});
		return true;
	};
</script>

<dwz:paginationForm action="${contextPath }/management/system/internalTerminalno/list?1112121" page="${page }">
    <input type="hidden" name="flag" value="${flag }"/>
    <input type="hidden" name="terminalno" value="${terminalno }"/>
    <input type="hidden" name="internalMerno_no" value="${internalMerno_no }"/>
    <input type="hidden" name="internalMerno_name" value="${internalMerno_name }"/>
    <input type="hidden" name="status" value="${status }"/>
    <input type="hidden" name="pos_code" value="${pos_code }"/>
</dwz:paginationForm>

<form id="internalTerminal_selectForm" action="${contextPath }/management/system/internalTerminalno/export">
	<input type="hidden" name="selectType" id="internalTerminal_selectType"/>
	 <input type="hidden" name="flag" value="${flag }"/>
    <input type="hidden" name="terminalno" value="${terminalno }"/>
    <input type="hidden" name="internalMerno_no" value="${internalMerno_no }"/>
    <input type="hidden" name="internalMerno_name" value="${internalMerno_name }"/>
    <input type="hidden" name="status" value="${status }"/>
    <input type="hidden" name="pos_code" value="${pos_code }"/>
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

<form method="post" action="${contextPath }/management/system/internalTerminalno/list" onsubmit="return navTabSearch(this)">
	<div class="pageHeader">
		<div class="searchBar">
			<div class="searchContent" id="ces" style="height:auto; width:90%; position:relative;">
			<table class="h-table">
				<tr>
				<td width="110" align="right">内部终端编号：</td>
				<td>
					<input id="search_Internal_terminal" style="width:98%;" type="text" name="terminalno" value="${terminalno}" maxlength="8"/>
				</td>
				<td width="110" align="right">内部商户编号：</td>
				<td>
					<input id="search_terminal_internalMerno" style="width:95.5%;" name="internalMerno_no" type="text" value="${internalMerno_no}" maxlength="15"/>
				</td>
				<td width="110" align="right">内部商户名称：</td>
				<td>
					<input id="search_terminal_internalMerName" style="width:98%;" name="internalMerno_name" value="${internalMerno_name}" type="text" maxlength="200"/>
				</td>
				</tr>
				<tr>
				<td width="110" align="right">pos机身号：</td>
				<td>
					<input id="search_terminal_posCode" style="width:98%;" type="text" name="pos_code" value="${pos_code}" maxlength="20"/>
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
				<td colspan="2"></td>
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
			<shiro:hasPermission name="InternalTerminalno:save">
				<li><a iconClass="user_add" target="dialog" rel="externalTerminalno_add" mask="true" width="550" height="250" href="${contextPath }/management/system/internalTerminalno/create"><span>添加</span></a></li>
			</shiro:hasPermission>
			<%-- <shiro:hasPermission name="InternalTerminalno:edit">
				<li><a iconClass="user_edit" target="dialog" rel="externalTerminalno_edit" mask="true" width="550" height="300" href="${contextPath }/management/system/internalTerminalno/update/{slt_uid}"><span>编辑内部终端编号</span></a></li>
			</shiro:hasPermission> --%>
			<shiro:hasPermission name="InternalTerminalno:createkey">
				<li><a iconClass="arrow_refresh" onclick="key_click()"><span>生成主密钥</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="InternalTerminalno:disable">
				<li><a iconClass="lock" target="selectedTodo" rel="ids" href="${contextPath }/management/system/internalTerminalno/disable" title="确认要停用吗?"><span>停用</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="InternalTerminalno:enable">
				<li><a iconClass="lock_open" target="selectedTodo" rel="ids" href="${contextPath }/management/system/internalTerminalno/enable" title="确认要启用吗?"><span>启用</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="InternalTerminalno:cancel">
				<a style="display:none;" id="cancel_internalTerminal" target="selectedTodo" rel="ids" href="${contextPath }/management/system/internalTerminalno/cancel" title="确认要注销吗?"></a>
				<li><a iconClass="delete" onclick="internalTerminal_click();"><span>注销</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="InternalTerminalno:export">
				<li><a iconClass="page_excel" href="javascript:internalTerminalExport('1');"><span>导出当前页</span></a></li>
				<li><a iconClass="page" href="javascript:internalTerminalExport('0');"><span>导出所有页</span></a></li>
			</shiro:hasPermission>
		</ul>
	</div>
	
	<table class="table" layoutH="147" width="2002">
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="22"><input type="checkbox" group="ids" class="checkboxCtrl"></th>			
				<th width="150">内部终端编号</th>
				<th width="150">内部商户编号</th>
				<th width="150">内部商户名称</th>
				<th width="200">内部商户所在地区</th>
				<th width="150">pos机身号</th>
				<th width="150">pos品牌</th>
				<th width="200">pos机型号</th>
				<th width="250">主密钥</th>
				<th width="200">主密钥校检码</th>
				<th width="60" orderField="status" class="${page.orderField eq 'status' ? page.orderDirection : ''}">状态</th>
				<th width="130" orderField="createdTime" class="${page.orderField eq 'createdTime' ? page.orderDirection : ''}">创建时间</th>
				<th width="80">创建人</th>
				<th width="130" orderField="updatedTime" class="${page.orderField eq 'updatedTime' ? page.orderDirection : ''}">修改时间</th>
				<th width="80">修改人</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="item" items="${internalTerminalnos}" varStatus="var">
			<tr target="slt_uid" rel="${item.id}">
				<td align="center">${var.count}</td>
				<td><input name="ids" value="${item.id}" key="${item.terminalKey}" type="checkbox"></td>
				<td>${item.terminalno}</td>
				<td>${item.internalMerno.merno}</td>
				<td>${item.internalMerno.merName}</td>
				<td>${item.internalMerno.areaCode.item1}</td>
				<td>${item.posTerminal.code}</td>
				<td>${item.posTerminal.brandNo.keyItem}</td>
				<td>${item.posTerminal.modelNo.keyItem}</td>
				<td>${item.terminalKey}</td>				
				<td>${item.checkValue}</td>				
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
	<c:if test="${page.totalCount eq 0}">
		    	<div class="re_tips">没有搜到符合您条件的数据！</div>
   	</c:if>
	<!-- 分页 -->
	<dwz:pagination page="${page }" />
</div>