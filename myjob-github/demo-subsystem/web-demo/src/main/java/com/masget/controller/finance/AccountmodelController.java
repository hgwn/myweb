package com.masget.controller.finance;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.masget.util.CommomUtil;
import com.masget.util.ObjectParser;

/**
 * 提供记账模型相关功能实现
 * @author 黄永丰
 * @createtime 2015年11月19日
 * @version 1.0
 */
@Controller
@RequestMapping("/finance")
public class AccountmodelController
{
	/**
	 * 提供记账模型相关功能实现
	 * @author 黄永丰
	 * @createtime 2015年11月20日
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/accountmodel.do")
	public void accountmodel(HttpServletRequest request, HttpServletResponse response)
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
		// 记账模型查询(模型加载到redis时应用)
		if ("getAccountmodel".equals(cmd))
			result = getAccountmodel(obj, request);
		// 增加记账模型
		else if ("addAccountmodel".equals(cmd))
			result = addAccountmodel(obj, request);
		// 修改记账模型
		else if ("modifyAccountmodel".equals(cmd))
			result = modifyAccountmodel(obj, request);
		// 删除记账模型
		else if ("deleteAccountmodel".equals(cmd))
			result = deleteAccountmodel(obj, request);
		// 获取订单费用类型信息
		else if ("getOrderchargetype".equals(cmd))
			result = getOrderchargetype(obj, request);
		// 获取结算类型信息
		else if ("getSettlementtype".equals(cmd))
			result = getSettlementtype(obj, request);
		// 查询记账模型动作
		else if ("getAccountmodelAction".equals(cmd))
			result = getAccountmodelAction(obj, request);
		// 查询记账模型订单类型
		else if ("getAccountmodelOrdertype".equals(cmd))
			result = getAccountmodelOrdertype(obj, request);
		//  删除记账模型明细
		else if ("deleteAccountmodelEntrydetail".equals(cmd))
			result = deleteAccountmodelEntrydetail(obj, request);		
		// 增加记账模型明细
		else if ("addAccountmodelEntrydetail".equals(cmd))
			result = addAccountmodelEntrydetail(obj, request);		
		// 增加记账模型动作
		else if ("addAccountmodelAction".equals(cmd))
			result = addAccountmodelAction(obj, request);		
		// 删除记账模型动作
		else if ("deleteAccountmodelAction".equals(cmd))
			result = deleteAccountmodelAction(obj, request);		
		// 获取公司费用类型
		else if ("getChargetype".equals(cmd))
			result = getChargetype(obj, request);
		else
		{
			result = "没有对应的cmd请求.";
			return;
		}
		// 返回json数据
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 记账模型查询(模型加载到redis时应用)
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String getAccountmodel(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.accountmodel.get";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 增加记账模型
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String addAccountmodel(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.accountmodel.add";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 修改记账模型
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String modifyAccountmodel(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.accountmodel.modify";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 删除记账模型
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String deleteAccountmodel(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.accountmodel.delete";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 *  获取订单费用类型信息
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String getOrderchargetype(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.logistic.com.orderchargetype.get";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.LOGISTICS_SERVICE, method, obj.toString());
	}
	
	/**
	 *  获取结算类型信息
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String getSettlementtype(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.base.com.settlementtype.get";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
	}
	
	/**
	 *  查询记账模型动作
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String getAccountmodelAction(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.accountmodel.action.get";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 *  查询记账模型订单类型
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String getAccountmodelOrdertype(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.accountmodel.ordertype.get";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 *  删除记账模型明细
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String deleteAccountmodelEntrydetail(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.accountmodel.entrydetail.delete";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 *  增加记账模型明细
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String addAccountmodelEntrydetail(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.accountmodel.entrydetail.add";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 增加记账模型动作
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String addAccountmodelAction(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.accountmodel.action.add";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 删除记账模型动作
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String deleteAccountmodelAction(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.accountmodel.action.delete";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 获取公司费用类型
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String getChargetype(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.base.com.chargetype.get";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
	}
	
	
	
}
