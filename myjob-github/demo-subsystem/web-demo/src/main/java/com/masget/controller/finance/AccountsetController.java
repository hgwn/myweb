package com.masget.controller.finance;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import net.sf.json.JSONObject;

import com.masget.util.CommomUtil;
import com.masget.util.ObjectParser;

/**
 * 提供账套相关功能实现
 * @author 黄永丰
 * @createtime 2015年11月19日
 * @version 1.0
 */
@Controller
@RequestMapping("/finance")
public class AccountsetController
{

	/**
	 * 提供凭证相关功能实现
	 * @author 黄永丰
	 * @createtime 2015年11月20日
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/accountset.do")
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
		// 获取套账
		if ("getAccountset".equals(cmd))
			result = getAccountset(obj, request);
		// 修改套账
		else if ("modifyAccountset".equals(cmd))
			result = modifyAccountset(obj, request);
		// 修改套账
		else if ("addAccountset".equals(cmd))
			result = addAccountset(obj, request);
		else
		{
			result = "没有对应的cmd请求.";
			return;
		}

		// 返回json数据
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 获取套账
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String getAccountset(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.accountset.get";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}

	/**
	 * 修改套账
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String modifyAccountset(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.accountset.modify";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 增加套账
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String addAccountset(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.accountset.add";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	

}
