<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">
	var isCodeExist = function(code){
		var status = true;
		$.ajax({
			type:"post",
			url:"${contextPath}/management/security/organization/isCodeExist",
			data:{"code":code},
			async:false,
			success:function(data){
				if(data=="yes"){
					alert("机构代码已存在，请重新选择！");
					status = false;
				}
			}
		});
		return status;
	}
	
	var bringBackValid = function(area_code,code){
		if(isCodeExist(code)){
			$.bringBack({'area_code':area_code});
		}
	}
</script>

<div class="pageContent">

<div class="pageFormContent" layoutH="58">
<%-- 	<ul class="tree expand">
		<li><a href="javascript:"><%=organization.getName() %></a>
			<%=tree(organization, organizationCode) %>
		</li>
	</ul> --%>

	<table class="table" layoutH="118" targetType="dialog" width="100%">
		<thead>
			<tr>
				<th orderfield="orgName">机构名称</th>
				<th orderfield="orgNum">机构代码</th>
				<th orderfield="leader">机构联系人</th>
				<th orderfield="creator">地区代码</th>
				<th width="80">查找带回</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>技术部</td>
				<td>1001</td>
				<td>administrator</td>
				<td>100001</td>
				<td>
					<a class="btnSelect" href="javascript:bringBackValid('A100001','C1001')" title="查找带回">选择</a>
				</td>
			</tr>
			<tr>
				<td>人事部</td>
				<td>1002</td>
				<td>test</td>
				<td>100002</td>
				<td>
					<a class="btnSelect" href="javascript:bringBackValid('A100002','C1002')" title="查找带回">选择</a>
				</td>
			</tr>
			<tr>
				<td>运营部</td>
				<td>1003</td>
				<td>test</td>
				<td>100003</td>
				<td>
					<a class="btnSelect" href="javascript:bringBackValid('A100003','C1003')" title="查找带回">选择</a>
				</td>
			</tr>
			<tr>
				<td>销售部</td>
				<td>1004</td>
				<td>test</td>
				<td>100004</td>
				<td>
					<a class="btnSelect" href="javascript:bringBackValid('A100004','C1004')" title="查找带回">选择</a>
				</td>
			</tr>
		</tbody>
	</table>

</div>
	<div class="formBar">
		<ul>
			<li><div class="button"><div class="buttonContent"><button class="close" type="button">关闭</button></div></div></li>
		</ul>
	</div>
</div>