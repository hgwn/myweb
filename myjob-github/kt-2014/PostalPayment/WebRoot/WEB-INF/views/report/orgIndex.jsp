<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true"
    pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>  
<script type="text/javascript">
	$(document).ready(function(){
		$(".org_exportPdf").click(function(){
			window.open("${contextPath }/report/exportOrgReport?format=pdf");
		});
		$(".org_exportExcel").click(function(){
			window.open("${contextPath }/report/exportOrgReport?format");
		});
	});
</script>
<dwz:paginationForm action="${contextPath }/report/orgIndex" page="${page }">
	<input type="hidden" name="search_LIKE_name" value="${param.search_LIKE_name }"/>
	<input type="hidden" name="search_LIKE_level" value="${param.search_LIKE_level }"/>
</dwz:paginationForm>
<form method="post" action="${contextPath }/report/orgIndex" onsubmit="return navTabSearch(this);">  
<div class="pageHeader">
		<div class="searchBar">
			<ul class="searchContent">
				<li>
					<label>机构名称：</label>
					<input type="text" name="search_LIKE_name" value="${param.search_LIKE_name}"/>
				</li>
				<li>
					<label>级别：</label>
					<input type="text" name="search_LIKE_level"  value="${param.search_LIKE_level}"/>
				</li>
			</ul>
			<div class="subBar">
				<ul>						
					<li>
						<div class="button">
							<div class="buttonContent">
								<button type="submit">搜索</button>
								<button type="button" id="org_exportPdf">导出PDF</button>
								<button type="button" id="org_exportExcel">导出Excel</button>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>  
</form> 
<div class="panelBar">
		<ul class="toolBar">
				<li><a iconClass="report" class="org_exportPdf" id="org_exportPdf"><span>导出PDF</span></a></li>
				<li><a iconClass="page_white_excel" class="org_exportExcel"><span>导出Excel</span></a></li>
		</ul>
	</div>
<div class="pageContent">
		<div layoutH="90" id="orgReportContent" class="unitBox" >
			<c:import url="/report/orgReport?orgLevel=${param.search_LIKE_level }&name=${param.search_LIKE_name }&pageNum=${page.pageNum }&numPerPage=${page.numPerPage }" charEncoding="UTF-8" />
			
		</div>
		<dwz:pagination page="${page }"/>
</div>