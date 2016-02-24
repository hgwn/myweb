<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<script type="text/javascript">
$(document).ready(function(){
	$('#search_dic_key').autocomplete({
		serviceUrl: '${contextPath }/management/system/dictionary/getDic_key'	 
	});
	$('#search_dic_name').autocomplete({
		serviceUrl: '${contextPath }/management/system/dictionary/getDic_name'	
	});
	
});
</script>

<dwz:paginationForm action="${contextPath }/management/system/dictionary/dictionaryList" page="${page }">
    <input type="hidden" name="search_LIKE_name" value="${param['search_LIKE_name']}" />
</dwz:paginationForm>

<form method="post" action="${contextPath }/management/system/dictionary/dictionaryList" onsubmit="return navTabSearch(this)">
    <div class="pageHeader">
        <div class="searchBar">
			<div class="searchContent" style="height:auto; width:90%; position:relative;">
             <table class="h-table">
				<tr>
				<td width="110" align="right">字典Key：</td> 
				<td>
					<input id="search_dic_key" style="width:98%;" type="text" name="search_LIKE_dictKey" value="${param['search_LIKE_dictKey']}" />
				</td>
                <td width="110" align="right">字典名称：</td> 
                <td><input id="search_dic_name" style="width:98%;" type="text" name="search_LIKE_name" value="${param['search_LIKE_name']}" /></td>
                <td width="110" align="right">&nbsp;</td>
                <td>&nbsp;</td>
                </tr>
            </table>
            </div>
            <div class="subBar">
                <ul>
                    <li><div class="button">
                            <div class="buttonContent">
                                <button type="submit">搜索</button>
                            </div>
                        </div></li>
                </ul>
            </div>
        </div>
    </div>
</form>

<div class="pageContent">

    <div class="panelBar">
        <ul class="toolBar">
            <shiro:hasPermission name="TDictionary:save">
                <li><a iconClass="book_add" target="dialog" mask="true" width="550" height="450" rel="TDictionary_save" href="${contextPath }/management/system/dictionary/createDictionary"><span>添加字典字段</span></a></li>
            </shiro:hasPermission>
            <shiro:hasPermission name="TDictionary:edit">
                <li><a iconClass="book_edit" target="selectedOne" mask="true" width="550" height="450" rel="ids" href="${contextPath }/management/system/dictionary/updateDictionary"><span>编辑字典字段</span></a></li>
            </shiro:hasPermission>
            <shiro:hasPermission name="TDictionary:disable">
                <li><a iconClass="lock" target="selectedTodo" rel="ids" href="${contextPath }/management/system/dictionary/disable" title="确认要停用字典?"><span>停用</span></a></li>
            </shiro:hasPermission>
            <shiro:hasPermission name="TDictionary:enable">
                <li><a iconClass="lock_open" target="selectedTodo" rel="ids" href="${contextPath }/management/system/dictionary/enable" title="确认要启用字典?"><span>启用</span></a></li>
            </shiro:hasPermission>
        </ul>
    </div>

    <table class="table" layoutH="125" width="1622">
        <thead>
            <tr>
            	<th width="30">序号</th>
                <th width="22"><input type="checkbox" group="ids" class="checkboxCtrl"></th>
                <th width="180">字典key</th>
                <th width="180">字典名称</th>
                <th width="180">关联字典类型</th>
                <th width="55">可维护</th>
                <th width="45">状态</th>
                <th width="180">字典值名称</th>
                <th width="180">备用值1</th>
                <th width="180">备用值2</th>
                <th width="180">备用值3</th>
                <th width="130" orderField="createdTime" class="${page.orderField eq 'createdTime' ? page.orderDirection : ''}">创建时间</th>
                <th width="40">操作</th>
            </tr>
        </thead>
        <tbody>
            <c:forEach var="item" items="${dictionarys}" varStatus="var">
                <tr target="slt_uid" rel="${item.id}">
                	<td align="center">${var.count}</td>
                    <td><input name="ids" value="${item.id}" type="checkbox"></td>
                    <td>${item.dictKey}</td>
                    <td><a href="${contextPath }/management/system/dictionary/dictionaryItemList?id=${item.id}" target="navTab">${item.name}</a></td>
                    <td>${item.parentDictionary.name}</td>
                    <td>${item.canAdmin ?"是":"否"}</td>
                    <td>${item.canDisplay ?"启用":"停用"}</td>
                    <td>${item.keyItemName}</td>
                    <td>${item.item1Name}</td>
                    <td>${item.item2Name}</td>
                    <td>${item.item3Name}</td>
                    <td><fmt:formatDate value='${item.createdTime}' pattern='yyyy-MM-dd HH:mm:ss' /></td>
                    <td><a iconClass="book_open" href="${contextPath }/management/system/dictionary/dictionaryItemList?id=${item.id}" target="navTab" title="字典项维护">字典项维护</a></td>
                </tr>
            </c:forEach>
        </tbody>
    </table>
    <!-- 分页 -->
    <dwz:pagination page="${page }" />
</div>