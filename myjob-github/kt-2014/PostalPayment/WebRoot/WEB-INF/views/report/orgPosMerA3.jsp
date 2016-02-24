<%@ page language="java" contentType="text/html; charset=UTF-8"
	trimDirectiveWhitespaces="true" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<script type="text/javascript">
	var a1_url_params = "";
	var setParamsWhenSubmitA3 = function() {
		a1_url_params="";
		var transId_a3 = $("#transId_a3").val(), orgId_a3 =$("#orgId_a3").val(), category_a3 = $("#category_a3").val(),year_a3=$("#year_a3").val(),season_a3 = $("#season_a3").val(),month_a3 = $("#month_a3").val(),monthOrseason_a3 = $("#monthOrseason_a3").val();
		
		if(!transId_a3){
			alertMsg.info("请选择交易类型！");
			return false;
		}
		
		
		a1_url_params = a1_url_params+"&transId_a3="+transId_a3+"&orgId_a3=" + orgId_a3 + "&category_a3=" + category_a3 + "&year_a3=" + year_a3 + "&season_a3=" + season_a3 + "&month_a3=" + month_a3 + "&monthOrseason_a3=" + monthOrseason_a3;
		//alert("orgId_a3:"+orgId_a3+"--------category_a3:"+category_a3+"------season_a3:"+season_a3+"-------month_a3:"+month_a3+"-------monthOrseason_a3:"+monthOrseason_a3+"-------year_a3:"+year_a3);
		//alert(a1_url_params);
		
		
		
		
		return true;
	}
	$(document).ready(function() {
						
		//用于搜索回显
		var key_a3 = $("#monthOrseason_a3").val();
		if (key_a3 == 1) {
			$("#month_a3").show();
			$("#season_a3").hide();
		}
		if (key_a3 == 2) {
			$("#season_a3").show();
			$("#month_a3").hide();
		}
		
		$("#a3_exportPdf").click(function() {
			setParamsWhenSubmitA3();
			
			//导出前先判断是否有点击'搜索'查出出数据
			var haveSerch =${isFirst != null} ;
			if(!haveSerch){
				alertMsg.info("请选择搜索条件,点击'搜索'按钮查询数据");
				return false ;
			}
			var text = $("#orgPosTerReportA3").text();
			if(text.indexOf("没有符合条件的信息")>=0){
				alertMsg.info("请查询出数据再导出");
				return false;
			}
			
			var url = "${contextPath }/report/orgPosMerReportA3?format=pdf&transMoney=${transMoney }&countNumber=${countNumber }";
			url = url + a1_url_params;
			window.open(url);
		});
		
		$("#a3_exportExcel").click(function() {
			setParamsWhenSubmitA3();

			//导出前先判断是否有点击'搜索'查出出数据
			var haveSerch =${isFirst != null} ;
			if(!haveSerch){
				alertMsg.info("请选择搜索条件,点击'搜索'按钮查询数据");
				return false ;
			}
			var text = $("#orgPosTerReportA3").text();
			if(text.indexOf("没有符合条件的信息")>=0){
				alertMsg.info("请查询出数据再导出");
				return false;
			}
			
			var url = "${contextPath }/report/orgPosMerReportA3?format=xls&transMoney=${transMoney }&countNumber=${countNumber }";
			url = url + a1_url_params;
			window.open(url);
		});
		$("#monthOrseason_a3").click(function() {
			var key_a3 = $("#monthOrseason_a3").val();
			if (key_a3 == 1) {
				$("#month_a3").show();
				$("#season_a3").hide();
		    }
			if (key_a3 == 2) {
				$("#season_a3").show();
				$("#month_a3").hide();
			}
		});
	});
</script>
<dwz:paginationForm action="${contextPath }/report/orgPosMerIndexA3" page="${page }">
	<input name="orgId_a3" type="hidden" value="${org_id}"/>
	<input type="hidden" name="category_a3"  value="${category}"/>
	<input type="hidden" name="transId_a3" value="${transId }"/>
	<input type="hidden" name="year_a3" value="${year }"/>
	<input type="hidden" name="monthOrseason_a3" value="${monthOrSeason}"/>
	<input type="hidden" name="month_a3" value="${month}"/>
	<input type="hidden" name="season_a3" value="${season}"/>
	<input name="isFirst_a3" type="hidden" value="1"/>
	<input name="transMoney" type="hidden" value="${transMoney }"/>
	<input name="countNumber" type="hidden" value="${countNumber }"/>
</dwz:paginationForm> 
<div class="pageContent">
	<div class="tabs">
		<div class="tabsContent re_tabsContent">
			<div>
				<form method="post" action="${contextPath }/report/orgPosMerIndexA3"
					class="required-validate pageForm"
					onsubmit="return setParamsWhenSubmitA3() && navTabSearch(this);">
					<input type="hidden"  name="isFirst_a3" value="1" />
					<div class="pageHeader re_pageHeader">
						<div class="searchBar repeat_searchBar">
							<div class="searchContent repeat_searchContent">
								<input type="hidden" name="isFrist_a3"  value="1" />
							<table class="h-table" style="width:90%;">
								<tr>
								<td width="90px" align="right">选择机构：</td> 
								<td><select id="orgId_a3" name="orgId_a3" style="width:98%;">
										<option value="${sameOrg.code }" <c:if test="${org_id eq sameOrg.code}">selected</c:if> >本级机构</option>
										<c:forEach var="lowerOrg" items="${lowerOrgs}">
											<option value="${lowerOrg.code }" <c:if test="${org_id eq lowerOrg.code}">selected</c:if> >${lowerOrg.name}</option>
										</c:forEach>
								</select></td>
								
								<td width="90px" align="right">机构属性：</td> 
								<td><select id="category_a3"
									name="category_a3" style="width:98%;">
										<option value="0" <c:if test="${category eq 0}">selected</c:if>>全部</option>
										<option value="1" <c:if test="${category eq 1}">selected</c:if>>邮政网点</option>
										<option value="2" <c:if test="${category eq 2}">selected</c:if>>便民服务站</option>
								</select></td>
								
								<td width="90px" align="right">交易类型：</td> 
								<td><%--<select id="transId_a3"
									name="transId_a3" style="width:98%;">
										<option value="200022" <c:if test="${transId eq '200022'}">selected</c:if>>消费</option>
										<option value="200023" <c:if test="${transId eq '200023'}">selected</c:if>>消费撤消</option>
										<option value="200024" <c:if test="${transId eq '200024'}">selected</c:if>>退货</option>
								</select>
								--%>
								<dwz:dicItem themeName="payment_transId" id="transId_a3" style="width:98%;" paramName="transId_a3" selectedValue="${transId}" />
								</td>
								
								
								<td width="90px" align="right">统计周期：</td> 
								<td><select
									name="year_a3" id="year_a3">
										<option value="2014" <c:if test="${year eq 2014}">selected</c:if>>2014</option>
										<option value="2015" <c:if test="${year eq 2015}">selected</c:if>>2015</option>
										<option value="2016" <c:if test="${year eq 2016}">selected</c:if>>2016</option>
										<option value="2017" <c:if test="${year eq 2017}">selected</c:if>>2017</option>
										<option value="2018" <c:if test="${year eq 2018}">selected</c:if>>2018</option>
										<option value="2019" <c:if test="${year eq 2019}">selected</c:if>>2019</option>
										<option value="2020" <c:if test="${year eq 2020}">selected</c:if>>2020</option>
										<option value="2021" <c:if test="${year eq 2021}">selected</c:if>>2021</option>
										<option value="2022" <c:if test="${year eq 2022}">selected</c:if>>2022</option>
										<option value="2023" <c:if test="${year eq 2023}">selected</c:if>>2023</option>
										<option value="2024" <c:if test="${year eq 2024}">selected</c:if>>2024</option>
								</select> <select id="monthOrseason_a3" name="monthOrseason_a3">
										<option value="1" <c:if test="${monthOrSeason eq '1'}">selected</c:if>>月份</option>
										<option value="2" <c:if test="${monthOrSeason eq '2'}">selected</c:if>>季度</option>
								</select> <select id="month_a3" name="month_a3">
										<option value="01" <c:if test="${month eq '01'}">selected</c:if>>1月</option>
										<option value="02" <c:if test="${month eq '02'}">selected</c:if>>2月</option>
										<option value="03" <c:if test="${month eq '03'}">selected</c:if>>3月</option>
										<option value="04" <c:if test="${month eq '04'}">selected</c:if>>4月</option>
										<option value="05" <c:if test="${month eq '05'}">selected</c:if>>5月</option>
										<option value="06" <c:if test="${month eq '06'}">selected</c:if>>6月</option>
										<option value="07" <c:if test="${month eq '07'}">selected</c:if>>7月</option>
										<option value="08" <c:if test="${month eq '08'}">selected</c:if>>8月</option>
										<option value="09" <c:if test="${month eq '09'}">selected</c:if>>9月</option>
										<option value="10" <c:if test="${month eq '10'}">selected</c:if>>10月</option>
										<option value="11" <c:if test="${month eq '11'}">selected</c:if>>11月</option>
										<option value="12" <c:if test="${month eq '12'}">selected</c:if>>12月</option>
								</select> <select id="season_a3" name="season_a3" style="display:none;">
										<option value="01" <c:if test="${season eq '01'}">selected</c:if>>第一季</option>
										<option value="04" <c:if test="${season eq '04'}">selected</c:if>>第二季</option>
										<option value="07" <c:if test="${season eq '07'}">selected</c:if>>第三季</option>
										<option value="10" <c:if test="${season eq '10'}">selected</c:if>>第四季</option>
								</select></td>
								</tr>
							</table>
							</div>
							<div class="subBar repeat_subBar">
								<ul>
									<li>
										<div class="button">
											<div class="buttonContent">
												<button type="submit">搜索</button>
											</div>
										</div></li>
								</ul>
							</div>
						</div>
					</div>
				</form>
				<div class="panelBar">
					<ul class="toolBar">		   
							<li><a iconClass="report" id="a3_exportPdf"><span>导出PDF</span>
							</a>
							</li>
							<li><a iconClass="page_white_excel" id="a3_exportExcel"><span>导出Excel</span>
							</a>
							</li>
					</ul>
				</div>
								
					<c:if test="${isFirst==null||isFisrt=='' }">
						<div layoutH="90" id="orgPostTerA3Content" class="unitBox">
							<br>	
							<p style="color:#999; padding:10px; text-align:center; font-size:14px;">温馨提示：请先输入查询条件！</p>
						</div>
					</c:if>
					
					<c:if test="${isFirst != null}">
						<div layoutH="100" id="orgPosTerReportA3" class="unitBox" >
							<c:import url="/report/orgPosMerReportA3?pageNum=${page.pageNum }&numPerPage=${page.numPerPage }&transMoney=${transMoney }&countNumber=${countNumber }&totalPage=${page.totalPage }" charEncoding="UTF-8" />
						</div>
						<dwz:pagination page="${page }"/>
					</c:if>	
			</div>
		</div>
	</div>
</div>