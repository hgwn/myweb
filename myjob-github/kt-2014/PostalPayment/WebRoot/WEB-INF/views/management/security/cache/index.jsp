<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<div class="pageContent">
	<div class="panelBar">
		<ul class="toolBar">
			<shiro:hasPermission name="Cache:delete">
				<li><a class="delete" target="ajaxTodo" href="${contextPath }/management/security/cache/clear" title="确认要清空缓存?"><span>清空缓存</span></a></li>
			</shiro:hasPermission>
		</ul>
	</div>
	<div class="list" layoutH="120" width="100%">		
				
				<p style="padding:10px;">清除系统所有缓存。</p>

	</div>	
</div>
