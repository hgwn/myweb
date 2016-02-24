<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>    
<div class="pageContent">
	<div class="tabs">
		<div class="tabsContent">
			<div>
				<div id="jbsxBox2organizationTree2" style="float:left; display:block;width:280px; overflow:hidden; border:solid 1px #CCC; line-height:21px; background:#fff; position:relative;">
					<div style="height:32px; line-height:30px; background-color:#f5f5f5; border-bottom:1px solid #ddd;"><img style="vertical-align:middle;" src="${contextPath}/styles/dwz/themes/css/images/icons/bullet_error.png"/>请选择&nbsp;省&nbsp;>&nbsp;市&nbsp;>&nbsp;县&nbsp;>&nbsp;分局&nbsp;>&nbsp;<strong>网点</strong>
					<div class="button" style="position:absolute; right:2px; top:2px;"><div class="buttonContent"><button type="button" onclick="open_assignTerminal();" id="orgAssina-treeBtn" style="background-position:0 -362px; color:#999; cursor:default; " disabled="disabled">分配</button></div></div>
					</div>
					<c:import url="/management/system/posTerminal/tree" charEncoding="UTF-8" />
				</div>
				
				<div layoutH="0" id="jbsxBox2TerminalnoList2" class="unitBox" style="margin-left:284px;">
					<c:import url="/management/system/posTerminal/terminalno_list/0" charEncoding="UTF-8" />
				</div>
			</div>
		</div>
	</div>
</div>