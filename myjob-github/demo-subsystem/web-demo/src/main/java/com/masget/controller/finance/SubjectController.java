package com.masget.controller.finance;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.masget.util.CommomUtil;
import com.masget.util.ObjectParser;

/**
 * 提供科目相关功能实现
 * @author 黄永丰
 * @createtime 2015年11月19日
 * @version 1.0
 */
@Controller
@RequestMapping("/finance")
public class SubjectController
{
	/**
	 * 提供科目相关功能实现
	 * @author 黄永丰
	 * @createtime 2015年11月20日
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/subject.do")
	public void accountset(HttpServletRequest request, HttpServletResponse response)
	{
		String result = "服务异常";
		String data = request.getParameter("data");// 获取页面传入的json数据
		if (data == null)
		{
			CommomUtil.writeResultBack(request, response, "请输入data参数为空.");
			return;
		}
		JSONObject obj = JSONObject.fromObject(data);
		String cmd = ObjectParser.toString(obj.get("cmd"));
		if (cmd == null || "".equals(cmd.trim()))
		{
			CommomUtil.writeResultBack(request, response, "请输入cmd参数为空.");
			return;
		}
		// 查询科目
		if ("getSubject".equals(cmd))
			result = getSubject(obj, request);
		// 查询辅助类别
		else if ("getAuxiliary".equals(cmd))
			result = getAuxiliary(obj, request);
		// 增加科目
		else if ("addSubject".equals(cmd))
			result = addSubject(obj, request);
		// 删除科目
		else if ("deleteSubject".equals(cmd))
			result = deleteSubject(obj, request);
		// 修改科目
		else if ("modifySubject".equals(cmd))
			result = modifySubject(obj, request);
		// 查询科目分类类型
		else if ("getSubjectCategorytype".equals(cmd))
			result = getSubjectCategorytype(obj, request);		
		// 查询科目分类
		else if ("getSubjectCategory".equals(cmd))
			result = getSubjectCategory(obj, request);
		// 模糊查询科目
		else if ("searchSubject".equals(cmd))
			result = searchSubject(obj, request);
		// 检查科目是否已有凭证数据
		else if ("checkSubject".equals(cmd))
			result = checkSubject(obj, request);
		// 科目余额(查询科目余额表)
		else if ("getSubjectBalance".equals(cmd))
			result = getSubjectBalance(obj, request);
		// 科目明细(查询科目明细帐)
		else if ("getSubjectDetail".equals(cmd))
			result = getSubjectDetail(obj, request);
		// 查询所有科目
		else if ("getSubjectTree".equals(cmd))
			result = getSubjectTree(obj, request);
		// 总帐(查询总帐)
		else if ("getSubjectLedger".equals(cmd))
			result = getSubjectLedger(obj, request);
		// 项目余额(核算项目余额表)
		else if ("getItemBalance".equals(cmd))
			result = getItemBalance(obj, request);
		// 项目明细(核算项目明细账)
		else if ("getItemBalanceDetail".equals(cmd))
			result = getItemBalanceDetail(obj, request);
		else
		{
			result = "没有对应的cmd请求.";
			return;
		}
		// 返回json数据
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 查询科目
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String getSubject(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.subject.get";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 查询辅助类别
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String getAuxiliary(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.subject.category.auxiliary.get";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 新增科目
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String addSubject(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.subject.operation";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 删除科目
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String deleteSubject(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.subject.operation";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 修改科目
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String modifySubject(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.subject.operation";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 查询科目分类类型
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String getSubjectCategorytype(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.subject.categorytype.get";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 查询科目分类
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String getSubjectCategory(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.subject.category.get";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 模糊查询科目
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String searchSubject(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.subject.search";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 检查科目是否已有凭证数据
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String checkSubject(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.subject.check";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 科目余额查询
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String getSubjectBalance(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.subject.balance.get";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 科目明细(查询科目明细帐)
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String getSubjectDetail(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.subject.detail.get";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 查询所有科目
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String getSubjectTree(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.subject.all.get";
		// 调用接口
		String result = CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
		result=result.replaceAll("pid", "pId");//ztree父节点属性是pId，要大写i才行
		return result;
	}
	
	
	/**
	 * 总帐(查询总帐)
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String getSubjectLedger(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.subject.ledger.get";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 项目余额(核算项目余额表)
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String getItemBalance(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.subject.balance.item.get";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 项目明细(核算项目明细账)
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String getItemBalanceDetail(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.subject.detail.balance.item.get";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	
}
