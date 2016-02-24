<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>    
<div class="pageContent">
	<div class="tabs">
		<div class="tabsContent">
			<div>
				<div layoutH="5" id="jbsxBox2organizationTree" style="float:left; display:block; overflow:auto; width:280px; border:solid 1px #CCC; line-height:21px; background:#fff">
					<c:import url="/management/system/posTerminal/tree" charEncoding="UTF-8" />
				</div>
				
				<div layoutH="0" id="jbsxBox2TerminalnoList" class="unitBox" style="margin-left:282px;">
					<c:import url="/management/system/posTerminal/terminalno_list/null" charEncoding="UTF-8" />
				</div>
			</div>
		</div>
	</div>
</div>