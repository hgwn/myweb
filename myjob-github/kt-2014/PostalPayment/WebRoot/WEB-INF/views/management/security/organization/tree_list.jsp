<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>    
<div class="pageContent">
	<div class="tabs">
		<div class="tabsContent">
			<div>
				<div layoutH="5" id="jbsxBox2organizationTree" style="float:left; display:block; overflow:auto; width:300px; border:solid 1px #CCC; line-height:21px; background:#fff">
					<c:import url="/management/security/organization/tree" charEncoding="UTF-8" />
				</div>
				
				<div layoutH="0" id="jbsxBox2organizationList" class="unitBox" style="margin-left:302px;">
					<c:import url="/management/security/organization/list/${rootId }" charEncoding="UTF-8" />
				</div>
			</div>
		</div>
	</div>
</div>