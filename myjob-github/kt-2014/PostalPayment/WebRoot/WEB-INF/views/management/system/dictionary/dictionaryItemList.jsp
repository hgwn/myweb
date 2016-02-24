<%@ page language="java" contentType="text/html; charset=UTF-8" trimDirectiveWhitespaces="true" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include.inc.jsp"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<script type="text/javascript">
	function back() {
		var url = "${contextPath }/management/system/dictionary/dictionaryList";
		navTab.getCurrentNavTab().attr("url", url);
		navTab.reload(url);
	}
</script>
<dwz:paginationForm action="${contextPath }/management/system/dictionary/dictionaryItemList?id=${dictionaryTitle.id }" page="${page }">
    <input type="hidden" name="search_LIKE_keyItem" value="${param['search_LIKE_keyItem']}" />
</dwz:paginationForm>

<form method="post" action="${contextPath }/management/system/dictionary/dictionaryItemList?id=${dictionaryTitle.id }" onsubmit="return navTabSearch(this)">
    <div class="pageHeader">
        <div class="searchBar">
        <c:if test="${!empty dictionaryTitle.keyItemName }">
           <div class="searchContent">
           <table class="h-table">
				<tr>
				<td width="110" align="right">${dictionaryTitle.keyItemName }：</td> 
				<td><input type="text" style="width:98%;" name="search_LIKE_keyItem" value="${param['search_LIKE_keyItem']}" /></td>
				<td width="110" align="right">&nbsp;</td>
				<td>&nbsp;</td>
				<td width="110" align="right">&nbsp;</td>
				<td>&nbsp;</td>
				</tr>
			</table>
           </div>
        </c:if>
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
                <li><a iconClass="book_add" target="dialog" mask="true" width="530" height="350" rel="TDictionary_save" href="${contextPath }/management/system/dictionary/createDictionaryItem?id=${dictionaryTitle.id }"><span>添加字典项</span></a></li>
            </shiro:hasPermission>
            <shiro:hasPermission name="TDictionary:edit">
                <li><a iconClass="book_edit" target="selectedOne" mask="true" width="530" height="350" rel="ids" href="${contextPath }/management/system/dictionary/updateDictionaryItem"><span>编辑字典项</span></a></li>
            </shiro:hasPermission>
            <shiro:hasPermission name="TDictionary:disable">
                <li><a iconClass="lock" target="selectedTodo" rel="ids" href="${contextPath }/management/system/dictionary/disableItem" title="确认要停用字典项?"><span>停用</span></a></li>
            </shiro:hasPermission>
            <shiro:hasPermission name="TDictionary:enable">
                <li><a iconClass="lock_open" target="selectedTodo" rel="ids" href="${contextPath }/management/system/dictionary/enableItem" title="确认要启用字典项?"><span>启用</span></a></li>
            </shiro:hasPermission>
        </ul>
    </div>

    <table class="table" layoutH="126" width="100%">
        <thead>
            <tr>
            	<th width="30">序号</th>
                <th width="22"><input type="checkbox" group="ids" class="checkboxCtrl"></th>
<!--                 <th width="180">${dictionaryTitle.name }</th> -->
                <th ${empty dictionaryTitle.keyItemName?"style='display: none;'":"" }>${dictionaryTitle.keyItemName }</th>
                <th ${empty dictionaryTitle.item1Name?"style='display: none;'":"" }>${dictionaryTitle.item1Name }</th>
                <th ${empty dictionaryTitle.item2Name?"style='display: none;'":"" }>${dictionaryTitle.item2Name }</th>
                <th ${empty dictionaryTitle.item3Name?"style='display: none;'":"" }>${dictionaryTitle.item3Name }</th>
                <th ${empty dictionaryTitle.parentDictionary.name?"style='display: none;'":""  }>${dictionaryTitle.parentDictionary.name }</th>
                <th width="50">状态</th>
                <th width="80">排列顺序</th>
                <th width="80">创建人</th>
                <th width="130" orderField="createdTime"
					class="${page.orderField eq 'createdTime' ? page.orderDirection : ''}">创建时间</th>
                <th width="80">最后修改人</th>
                <th width="130" orderField="updatedTime"
					class="${page.orderField eq 'updatedTime' ? page.orderDirection : ''}">最后修改时间</th>
            </tr>
        </thead>
        <tbody>
            <c:forEach var="item" items="${dictionaryItems}" varStatus="var">
                <tr target="slt_uid" rel="${item.id}">
                	<td align="center">${var.count}</td>
                    <td><input name="ids" value="${item.id}?dictionaryId=${dictionaryTitle.id }" type="checkbox"></td>
<!--                     <td></td> -->
                    <td ${empty dictionaryTitle.keyItemName?"style='display: none;'":"" }>${item.keyItem}</td>
                    <td ${empty dictionaryTitle.item1Name?"style='display: none;'":"" }>${item.item1}</td>
                    <td ${empty dictionaryTitle.item2Name?"style='display: none;'":"" }>${item.item2}</td>
                    <td ${empty dictionaryTitle.item3Name?"style='display: none;'":"" }>${item.item3}</td>
                    <td ${empty dictionaryTitle.parentDictionary.name?"style='display: none;'":""  }>${item.parentDictionaryItem.keyItem }</td>
                    <td>${item.status ?"启用":"停用"}</td>
                    <td>${empty item.displayOrder?"无排序": item.displayOrder}</td>
                    <td>${item.createdBy.username}</td>
                    <td><fmt:formatDate value='${item.createdTime}' pattern='yyyy-MM-dd HH:mm:ss' /></td>
                    <td>${item.updatedBy.username}</td>
                    <td><fmt:formatDate value='${item.updatedTime}' pattern='yyyy-MM-dd HH:mm:ss' /></td>
                </tr>
            </c:forEach>
        </tbody>
    </table>
    <!-- 分页 -->
    <dwz:pagination page="${page }" />
</div>