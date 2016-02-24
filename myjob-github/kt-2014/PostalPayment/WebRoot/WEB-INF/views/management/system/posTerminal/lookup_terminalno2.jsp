<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<script type="text/javascript">
	$(document).ready(function(){
	if($("input[name='internalMerno.merno']").val()==''){
		$(".h-cleanBtn-internalMerno").css("display","none");
	}
	$(".h-cleanBtn-internalMerno").click(function(){	
		$("input[name='internalMerno.id']").val("");
		$("input[name='internalMerno.merno']").val("");
		$(".h-cleanBtn-internalMerno").css("display","none");
	});
	});
	function closeDialog(param){
	    $.pdialog._current.data("close",'');
	    $.pdialog.closeCurrent();
	    $("#dialogBackground").show();
	    return false;
	}
	function clickthis(a,b){
		$.bringBack({id:a, terminalno:b});
		$(".h-cleanBtn-Terminalno2").css("display","block");
	}
</script>

<dwz:paginationForm
	action="${contextPath }/management/system/posTerminal/lookup2Terminalno"
	page="${terminal_page }">
	<input type="hidden" name="search_LIKE_terminalno" value="${param.search_LIKE_terminalno }" />
</dwz:paginationForm>
<form  method="post" action="${contextPath }/management/system/posTerminal/lookup2Terminalno" onsubmit="return dialogSearch(this)">
		<div class="pageHeader">
			<div class="searchBar">
				<ul class="searchContent">
					<li>
						<label>内部终端编号：</label>
						<input type="text" name="search_LIKE_terminalno" value="${param.search_LIKE_terminalno}" />
					</li>
					<li class="widthcols3" style="position:relative;">
						<label>内部商户编号：</label>
						<a class="h-cleanBtn h-cleanBtn-internalMerno" title="清空" style="right:46px;">X</a>
						<input name="internalMerno.id" id="internalMernoId_internal" type="hidden" value="${internalMernoId}"/>
						<input class=" textInput readonly fl"  name="internalMerno.merno" id="internalMernoName_internal" value="${internalMernoName}" type="text" readonly="readonly" data-prompt-position="centerRight:22,0"/>
						<a class="btnLook" href="${contextPath }/management/system/posTerminal/lookupmerno" rel="internalMerno_show"  mask="true" target="dialog"  close="closeDialog" title="内部商户编号"  width="650" height="450">查找带回</a>					
						<!--<input type="text" name="internalMerno.id" value="${internalMernoId}"/>-->
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
					<th width="200">商户所属地区代码(名称)</th>
					<th width="150">pos机身号</th>
					<th width="150">pos品牌</th>
					<th width="150">pos机型号</th>
					<th width="70" orderField="status" class="${terminal_page.orderField eq 'status' ? terminal_page.orderDirection : ''}">状态</th>
					<th width="90">选择终端编号</th>
				</tr>
			</thead>
			<tbody>
				<c:forEach var="item" items="${internalTerminalnos}">
				<tr target="slt_uid" rel="${item.id}">
					<td>${item.terminalno}</td>
					<td>${item.internalMerno.merno}</td>
					<td>${item.internalMerno.areaCode.keyItem}(${item.internalMerno.areaCode.item1})</td>
					<td>${item.posTerminal.code}</td>
					<td>${item.posTerminal.brandNo.keyItem}</td>
					<td>${item.posTerminal.modelNo.keyItem}</td>
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
			<li><div class="button"><div class="buttonContent"><button class="close" id="closeclose_terminalno" type="button">关闭</button></div></div></li>
		</ul>
	</div>
</div>