<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@page import="java.util.Date"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">

</script>
<div id="terminalTable_jsp">
	<p>
			<label style="width:78px;">pos机身号：</label>
			<input type="text" name="assign_code" id="assign_code" value="${assign_code}" onkeydown="javascript:if(event.keyCode==13) return false;" onkeyup="javascript:if(event.keyCode==13) assign_add();" />
			<button type="button" onclick="assign_add();" style="cursor:pointer;">加入</button>
	</p>
		<div layoutH="200">
		<table class="list" width="100%" rel="assignTerminalTable">
			<thead>
				<tr>
					<th width="30">序号</th>		
					<th>pos机身号</th>
					<th width="80" class="red" align="center">操作</th>	
				</tr>
			</thead>
			<tbody>
				<c:forEach var="item" items="${pList}" varStatus="var">
				<tr id="${item.id}">
					<input type="hidden" name="assgin_ids" value="${item.id}"/>
					<td align="center">${var.count}</td>
					<td>${item.code}</td>
					<td align="center"><input type="button" style="height:21px; margin-left:10px; cursor:pointer;" value="删除" onclick="assign_del('${item.code}');"></td>
					
				</tr>			
				</c:forEach>
			</tbody>
		</table>
		</div>	
</div>