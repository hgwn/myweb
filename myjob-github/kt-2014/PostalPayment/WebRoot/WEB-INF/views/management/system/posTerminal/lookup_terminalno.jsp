<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<script type="text/javascript">
	$(document).ready(function(){
		$('#search_dialog_terminal').autocomplete({
		serviceUrl: '${contextPath }/management/system/internalTerminalno/getInternal_terminal'	 
		});
		$('#search_dialog_internalMerno').autocomplete({
			serviceUrl: '${contextPath }/management/system/internalMerno/getInternal_merno'	
		});
		$('#search_dialog_internalMerName').autocomplete({
			serviceUrl: '${contextPath }/management/system/internalMerno/getInternal_merName'
		});
		
	});
	function closeDialog2(param){
	    $.pdialog._current.data("close",'');
	    $.pdialog.closeCurrent();
	    $("#dialogBackground").show();
	 	  return false;
	}
	function clickthis(a,b){
		$.bringBack({id:a, terminalno:b});
		$(".h-cleanBtn-Terminalno").css("display","block");
	}
</script>

<dwz:paginationForm
	action="${contextPath }/management/system/posTerminal/lookupTerminalno/${mngr_provinceCode}"
	page="${terminal_page }">
	<input type="hidden" name="terminalno" value="${terminalno }"/>
    <input type="hidden" name="internalMerno_no" value="${internalMerno_no }"/>
    <input type="hidden" name="internalMerno_name" value="${internalMerno_name }"/>
</dwz:paginationForm>
<form method="post" action="${contextPath }/management/system/posTerminal/lookupTerminalno/${mngr_provinceCode}" onsubmit="return dialogSearch(this)">
		<div class="pageHeader">
			<div class="searchBar">
				<ul class="searchContent">
					<li>
						<label>内部终端编号：</label>
						<input id="search_dialog_terminal" type="text" name="terminalno" value="${terminalno}" maxlength="8"/>
					</li>
					<li class="widthcols3" style="position:relative;">
						<label>内部商户编号：</label>
						<input id="search_dialog_internalMerno" name="internalMerno_no" type="text" value="${internalMerno_no}" maxlength="15"/>
					</li>
					<li class="widthcols3" style="position:relative;">
						<label>内部商户名称：</label>
						<input id="search_dialog_internalMerName" name="internalMerno_name" value="${internalMerno_name}" type="text" maxlength="200"/>
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
		<table class="table"  layoutH="135" width="100%" targetType="dialog">
			<thead>
				<tr>
					<th width="80" orderField="terminalno" class="${terminal_page.orderField eq 'terminalno' ? terminal_page.orderDirection : ''}">内部终端编号</th>
					<th width="120" orderField="internalMerno.merno" class="${terminal_page.orderField eq 'internalMerno.merno' ? terminal_page.orderDirection : ''}">内部商户编号</th>
					<th width="200">内部商户名称</th>
					<th width="150">商户所属地区代码(名称)</th>
					<th width="150">pos机身号</th>
					<th width="70" orderField="status" class="${terminal_page.orderField eq 'status' ? terminal_page.orderDirection : ''}">状态</th>
					<th width="90">选择终端编号</th>
				</tr>
			</thead>
			<tbody>
				<c:forEach var="item" items="${internalTerminalnos}">
				<tr target="slt_uid" rel="${item.id}">
					<td>${item.terminalno}</td>
					<td>${item.internalMerno.merno}</td>
					<td>${item.internalMerno.merName}</td>
					<td>${item.internalMerno.areaCode.keyItem}(${item.internalMerno.areaCode.item1})</td>
					<td>${item.posTerminal.code}</td>
					<td>
						<dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.COMMON_STATUS %>" dataValue="${fn:trim(item.status)}"/>
					</td>
					<td>
						<a class="btnSelect" onclick="clickthis('${item.id}','${item.terminalno}')" title="选择终端编号">选择</a>
					</td>
				</tr>			
				</c:forEach>
			</tbody>
		</table>
		<dwz:pagination page="${terminal_page }" targetType="dialog" onchange="dialogPageBreak({numPerPage:this.value})"/>
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button class="close" type="button">关闭</button></div></div></li>
		</ul>
	</div>
</div>