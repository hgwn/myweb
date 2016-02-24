<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<%@page import="java.util.Date"%>

<script type="text/javascript">
function create(category,actionDate){
     if(category==2){
      // 执行重新生成对账文件的操作 首先判断 对账是否成功  假如没有 就提示不能操作
         var result = $("#action_result_1").text();
         if($.trim(result) != "成功"){
            alertMsg.info("邮储对账未成功，请先操作邮储对账，然后再执行此操作");
            return false;
         }
     }else if(category== 3){
       //执行清分操作 先判断上一级生成业务对账文件是否成功
         var result = $("#action_result_2").text();
         if($.trim(result) != "成功"){
            alertMsg.info("生成业务对账文件未成功，请先生成业务对账文件，然后再执行此操作");
            return false;
         }
     }else if(category==4){
      //执行生成划账文件操作 先判断上一级清分操作是否成功
       var result = $("#action_result_3").text();
       if($.trim(result) == "失败"){
            alertMsg.info("系统清分操作未成功，请先执行清分操作，然后再执行此操作");
            return false;
         }
     }
    $.get("${contextPath }/management/system/actionResult/create",{"category":category,"actionDate":actionDate},function(data){
         if(data.result=="success"){
           alertMsg.info("本次操作成功");
           //成功 重新加载数据
           $("#button_submit").click();
         }else{
           //失败
           alertMsg.info(data.text);
           $("#button_submit").click();
         }
    },"json");
}

</script>
<dwz:paginationForm action="${contextPath }/management/system/actionResult/list" page="${page }">
<input type="hidden" name="actionDate" value="${param.actionDate}"/>
</dwz:paginationForm>
                                           
<form method="post" action="${contextPath}/management/system/actionResult/list" onsubmit="return navTabSearch(this)">
	<div class="pageHeader">
		<div class="searchBar">
			<div class="searchContent">
			<table class="h-table">
				<tr>
				    <td width="110" align="right">选择账单日期：</td>
				    <td>
				    <div style="width:98%; position:relative;">	
					<input style="width:98%;" type="text" name="actionDate" maxDate="{%y}-%M-{%d-1}" id="actionDate" class="date required" readonly="readonly" style="float:left; width:95%;" value="${actionDate}"/>
					<a class="inputDateButton" href="javascript:;" style=" position:absolute; right:-1px; top:0;">选择</a>
					</div>
					</td>
					<td width="110" align="right">&nbsp;</td>
					<td>&nbsp;</td>
					<td width="110" align="right">&nbsp;</td>
					<td>&nbsp;</td>
				</tr>
			</table>
			</div>
			<div class="subBar">
				<ul>						
					<li><div class="button"><div class="buttonContent"><button id="button_submit" type="submit">搜索</button></div></div></li>
				</ul>
			</div>
		</div>
	</div>
</form>

<div class="pageContent">

	<div class="panelBar">
		<ul class="toolBar">
			<%--<shiro:hasPermission name="Account:save">
				<li><a iconClass="page_add" target="dialog" mask="true" width="550" height="350" rel="Account_save" href="${contextPath }/management/system/account/create"><span>添加账户</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="Account:edit">
				<li><a iconClass="page_edit" target="dialog" mask="true" width="550" height="350" rel="Account_edit" href="${contextPath }/management/system/account/update/{slt_accountid}"><span>编辑账户信息</span></a></li>
			</shiro:hasPermission>
			<%--<shiro:hasPermission name="Account:delete">
				<li><a iconClass="page_delete" target="selectedTodo" rel="ids" href="${contextPath }/management/system/account/delete" title="确认要删除选定数据字典词条?"><span>删除账户</span></a></li>
			</shiro:hasPermission>--%>
			
		</ul>
	</div>

	
	<table  class="table" layoutH="125" width="100%">
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="120">类型</th>
				<th width="60">状态</th>
				<th width="100">账单日期</th>
				<th width="140">开始时间</th>
				<th width="140">结束时间</th>
				<th >备注</th>
				<th width="60">生成方式</th>
				<th width="100">操作</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="item" items="${actionResults}" varStatus="var">
			<tr target="slt_accountid" rel="${item.id}" class="actionResult_tr">
				<td align="center">${var.count}</td>
				<td id="action_category_${item.category}"><c:if test="${item.category eq 1 }">邮储对账</c:if>
				    <c:if test="${item.category eq 2 }">生成业务对账文件</c:if>
				    <c:if test="${item.category eq 3 }">对账文件清分</c:if>
				    <c:if test="${item.category eq 4 }">生成划账文件</c:if>
				</td>
				<td id="action_result_${item.category}"  >
				    <c:if test="${item.result eq 'S'}">成功</c:if>
				    <c:if test="${item.result eq 'F'}"><label style="color:red;line-height: 22px;">失败</label></c:if>
				    <c:if test="${item.result eq 'H'}">处理中</c:if>
				    <c:if test="${item.result eq 'P'}">部分成功</c:if>
				    <c:if test="${item.result eq 'C'}">划帐成功,清分部分成功</c:if>
				</td>	
				<td><fmt:formatDate value="${item.actionDate}" pattern="yyyy-MM-dd"/></td>
				<td><fmt:formatDate value="${item.beginTime}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
				<td><fmt:formatDate value="${item.endTime }" pattern="yyyy-MM-dd HH:mm:ss"/></td>
				<%--<td><a class="actionResult_errorReason" href="javascript:void(0)" title="${item.errorReason}">${item.errorReason}</a></td>--%>
				<td class="actionResult_errorReason_td">${item.errorReason}</td>
				<td>${item.actionFlag eq 'A'? '自动生成' : '手动生成' }</td>
				<td>
				<input type="button" style="height:21px; margin-top:0; cursor:pointer;"  name="button" value="重新生成" <c:if test="${ item.result eq 'S'}">disabled</c:if> onclick="create('${item.category}','${item.actionDate}')" />
				</td>
			</tr>
			</c:forEach>
		</tbody>
	</table>
	<c:if test="${empty actionResults}">
		    	<div class="re_tips">没有搜到符合您条件的数据！</div>
   	</c:if>
</div>
