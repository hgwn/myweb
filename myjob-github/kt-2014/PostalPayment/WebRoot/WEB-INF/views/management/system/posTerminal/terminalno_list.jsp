<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<%@page import="java.util.Date"%>
<script type="text/javascript">
	function savePos(){
		var ids="";
		var $box = $.pdialog.getCurrent();
		$box.find("input:checked").filter("[name='ids_terminalno']").each(function(i){
			var val = $(this).val();
			ids += i==0 ? val : ","+val;
		});
		if(ids==''||ids==null){
			alertMsg.warn("请选择要分配的内部终端！");
			return;
		}
		alertMsg.confirm("确认要分配吗？", {
			okCall: function(){
				$.ajax({
					type:"post",
					url:"${contextPath }/management/system/posTerminal/org_relevance/${code}",
					data:{"ids_terminalno":ids},
					success:function(msg){
						var json = jQuery.parseJSON(msg);
						navTabAjaxDone(json);
						$("#terminalnoForm").submit();
					},
					error:function(msg){
						var json = jQuery.parseJSON(msg);
						navTabAjaxDone(json);
					}
				}); 
			}
		});
	}
</script>
<dwz:paginationForm
	action="${contextPath }/management/system/posTerminal/terminalno_list/${code }"
	page="${terminalno_list_page }"
	onsubmit="return divSearch(this, 'jbsxBox2TerminalnoList');">
</dwz:paginationForm>

<form id="terminalnoForm" method="post" action="${contextPath }/management/system/posTerminal/terminalno_list/${code }" onsubmit="return divSearch(this,'jbsxBox2TerminalnoList')">	</form>
<div class="pageContent">
	<div class="panelBar2">
		<a  href="javascript:void(0);" onclick="savePos()"><div class="button"><div class="buttonContent"><button id="submit" type="button">分配</button></div></div></a>

	</div>
	<table class="table" layoutH="105" width="872" >
		<thead>
			<tr>
				<th width="22"><input type="checkbox" group="ids_terminalno" class="checkboxCtrl"></th>			
				<th width="100">内部终端编号</th>
				<th width="120">所属商户编号</th>
				<th width="140">商户所属地区代码(名称)</th>
				<th width="100">pos机身号</th>
				<th width="100">pos品牌</th>
				<th width="100">pos机型号</th>
				<th width="60" orderField="status" class="${page.orderField eq 'status' ? page.orderDirection : ''}">状态</th>
				<th width="130" orderField="createdTime" class="${page.orderField eq 'createdTime' ? page.orderDirection : ''}">创建时间</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="item" items="${internalTerminalnos}">
			<tr target="slt_uid" rel="${item.id}">
				<td><input name="ids_terminalno" value="${item.id}" type="checkbox"></td>
				<td>${item.terminalno}</td>
				<td>${item.internalMerno.merno}</td>
				<td>${item.internalMerno.areaCode.keyItem}(${item.internalMerno.areaCode.item1})</td>
				<td>${item.posTerminal.code}</td>
				<td>${item.posTerminal.brandNo.keyItem}</td>
				<td>${item.posTerminal.modelNo.keyItem}</td>
				<td>
					<dwz:dataConvert name="<%=com.rongbang.utils.PlatformConstants.COMMON_STATUS %>" dataValue="${fn:trim(item.status)}"/>
				</td>
				<td><fmt:formatDate value="${item.createdTime}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
			</tr>			
			</c:forEach>
		</tbody>
	</table>
	<!-- 分页 -->
	<dwz:pagination page="${terminalno_list_page }" rel="jbsxBox2TerminalnoList" targetType="dialog" onchange="dialogPageBreak({numPerPage:this.value},'jbsxBox2TerminalnoList')"/>
</div>