<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>

<dwz:paginationForm action="${contextPath }/management/risk/organizationBusiness/list" page="${page }">
	<input type="hidden" name="businessId" value="${businessId}"/>
	<input type="hidden" name="systemId" value="${param.systemId}"/>
	<input type="hidden" name="organization.orgLevel" value="${orgLevel}"/>
	<input type="hidden" name="organization.code" value="${orgCode}"/>
	<input type="hidden" name="organization.name" value="${orgName}"/>
	<input type="hidden" name="siteName" value="${param.siteName }"/>
	<input type="hidden" name="onlySubstation" value="${onlySubstation }"/>
</dwz:paginationForm>

<script type="text/javascript">
	$("#businessId_business").remoteChained("#systemId_business", "${contextPath }/management/order/getBusiness");
	 /* var  serchSub_businessBlack = function(){
			var systemId_business = $("#systemId_business").val();
			var businessId_business = $("#businessId_business").val();
			if(systemId_business != "0" && businessId_business== "0" ){
				alertMsg.info("请选择业务种类！");
				return false ;
			}	
			return true;
		} */
		
		//网点补全
		$('#orgName_businessBlack').autocomplete({
			serviceUrl: '${contextPath }/management/security/organization/getOrgName',
	 		onSelect: function (suggestion) {
	        	//alert(JSON.stringify(suggestion)  );
	 			var data = suggestion.data ;
	        	var levels=	suggestion.levels;
	 			$("#orgCode_businessBlack").val(data);
	        	$("#orgLevels_businessBlack").val(levels);
	       
	        	//等级40是支局 , 如果自动填充时,判断是否选中的机构是支局,如果是则"只选支局"点掉disabled属性
	        	if(levels==40){
	        		$("#onlySubstation").removeAttr("disabled");
	        	}else{
	        		$("#onlySubstation").attr("disabled",true);
	        	}
	     	},
	     	onSearchStart: function (query) {
			 	$("#orgCode_businessBlack").val("");
			 	$("#orgLevels_businessBlack").val("");
 	 	 	},
	     	onSearchComplete: function (query) {
		 		$("#orgCode_businessBlack").val("");
		 		$("#orgLevels_businessBlack").val("");
	 	  	}
		});
		//如果自动填充(网点补全)时没有选择查询结果,查看范围的输入框将会清空内容
		$('#orgName_businessBlack').blur(function(){
			var code =$("#orgCode_businessBlack").val() ;
			var levels =$("#orgLevels_businessBlack").val();
			if(!code || !levels){
				$('#orgName_businessBlack').val("");
			}
		});
		
	$(function(){
		lookup_cleanbtn("form_businessBlack_serch");
		if($("#form_businessBlack_serch [name='organization.name']").val()==''){
			$("#form_businessBlack_serch .h-cleanBtn").css("display","none");
		}
	});
</script>

<form id="form_businessBlack_serch" method="post" action="${contextPath }/management/risk/organizationBusiness/list" onsubmit="return navTabSearch(this)">
	<div class="pageHeader">
		<div class="searchBar">
			<div class="searchContent" style=" height:auto; width:90%; position:relative;">
			<table class="h-table">
			<tr>
				<td width="110" align="right">业务系统：</td>
				<td>
					<select style="width:98%;"   id="systemId_business" name="systemId" class="re_select">
						<option value="0" selected="selected">--请选择系统--</option>
						<c:forEach items="${supportSystems}" var="supp">
							<option value="${supp.id}" <c:if test="${param.systemId eq supp.id }">selected</c:if>
							>${supp.systemName }</option>
						</c:forEach>
					</select>
				</td>
				<td width="110" align="right">业务种类：</td>
				<td>
					<select style="width:98%;"  class="re_select" name="businessId"  id="businessId_business">
						<option value="0" selected="selected">--请选择业务--</option>
						<c:forEach items="${businesses}" var="bus">
							<option value="${bus.id}" <c:if test="${param.businessId eq bus.id}">selected="selected"</c:if>
							>${bus.businessName }</option>
						</c:forEach>
					</select>
				</td>
				<td width="110" align="right">查看范围：</td>
				<td style="position:relative;">
					<a class="h-cleanBtn" title="清空" style="right:10px;">X</a>
					<input id="orgCode_businessBlack" name="organization.code" type="hidden" value="${orgCode}"/>
					<input id="orgLevels_businessBlack" name="organization.orgLevel" type="hidden" value="${orgLevel}"/>
					<input id="orgName_businessBlack"   name="organization.name"  class="textInput" style="width:95%;" type="text"   value="${orgName}"/>
				</td>
				<td width="100"><a class="btnLook" lookupgroup="organization" href="${contextPath }/management/security/organization/lookup2org/form_businessBlack_serch?selectAll=true&permissionKey=<%=com.rongbang.utils.PlatformConstants.PERMISSION_BUSINESSBLACKLIST_SHOW %>" width="400">选择组织机构</a>
					&nbsp;&nbsp;<input style="vertical-align:middle;" name="onlySubstation" id="onlySubstation" type="checkbox" value="1" <c:if test="${orgLevel!=40}">disabled</c:if><c:if test="${onlySubstation==1}">checked</c:if> >只查支局</td>
				</tr>
				<%--
				<tr>
				<td width="110" align="right">网点名称：</td>
				<td>
					<input style="width:95%;" type="text" name="siteName" value="${param.siteName }" maxlength="64"/>
				</td>
				<td colspan="5">&nbsp;</td>
				</tr>--%>
			</table>	
			</div>
			<div class="subBar">
				<ul>						
					<li><div class="button"><div class="buttonContent"><button type="submit">搜索</button></div></div></li>
				</ul>
			</div>
		</div>
	</div>
</form>

<div class="pageContent">

	<div class="panelBar">
		<ul class="toolBar">
			<shiro:hasPermission name="BusinessBlacklist:save">
				<li><a iconClass="application_add" rel="BusinessBlacklist_navTab" target="navTab" href="${contextPath }/management/risk/organizationBusiness/create"><span>添加业务黑名单</span></a></li>
			</shiro:hasPermission>
			<shiro:hasPermission name="BusinessBlacklist:delete">
				<li><a iconClass="application_delete" target="selectedTodo" rel="ids" href="${contextPath }/management/risk/organizationBusiness/delete" title="确认要删除?"><span>删除黑名单</span></a></li>
			</shiro:hasPermission>
		</ul>
	</div>
	
	<table class="table" layoutH="128" width="1372">
		<thead>
			<tr>
				<th width="30">序号</th>
				<th width="22"><input type="checkbox" group="ids" class="checkboxCtrl"></th>	
				<th width="200">网点</th>
				<th width="125">业务种类</th>
				<th width="125">业务系统</th>
				<th width="200">所属支局</th>
				<th width="200">所属县机构</th>
				<th width="170">所属市机构</th>
				<th width="150">所属省机构</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="item" items="${blackLists}" varStatus="var">
			<tr target="slt_uid"  rel="${item.id}">
				<td align="center">${var.count}</td>
				<td><input name="ids" value="${item.id}" type="checkbox"></td>
				<td>${item.organization.name}</td>
				<td>${item.business.businessName}</td>
				<td>${item.business.supportSystem.systemName}</td>
				<td>${item.orgFull.substationOrg.name}</td>
				<td>${item.orgFull.countryOrg.name}</td>
				<td>${item.orgFull.cityOrg.name}</td>
				<td>${item.orgFull.provinceOrg.name}</td>
			</tr>
			</c:forEach>
		</tbody>
	</table>
	<c:if test="${page.totalCount eq 0 }">
		    	<div class="re_tips">没有搜到符合您条件的数据！</div>
   	</c:if>
	<!-- 分页 -->
	<dwz:pagination page="${page }"/>
</div>