package com.masget.controller.finance;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.masget.util.CommomUtil;
import com.masget.util.ObjectParser;

/**
 * 提供凭证相关功能实现
 * @author 黄永丰
 * @createtime 2015年11月19日
 * @version 1.0
 */
@Controller
@RequestMapping("/finance")
public class VoucherController
{

	/**
	 * 提供凭证相关功能实现
	 * @author 黄永丰
	 * @createtime 2015年11月20日
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/voucher.do")
	public void voucher(HttpServletRequest request, HttpServletResponse response)
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
		// 查询凭证
		if ("getVoucherDetail".equals(cmd))
			result = getVoucherDetail(obj, request);
		// 增加凭证
		else if ("addVoucher".equals(cmd))
			result = addVoucher(obj, request);
		// 修改凭证
		else if ("modifyVoucher".equals(cmd))
			result = modifyVoucher(obj, request);
		// 删除凭证
		else if ("deleteVoucher".equals(cmd))
			result = deleteVoucher(obj, request);
		// 审核凭证
		else if ("modifyVoucherVerifyflag".equals(cmd))
			result = modifyVoucherVerifyflag(obj, request);
		// 获取凭证号
		else if ("getVoucherNum".equals(cmd))
			result = getVoucherNum(obj, request);
		// 获取公司订单
		else if ("getOrder".equals(cmd))
			result = getOrder(obj, request);
		// 查询凭证字
		else if ("getVoucherWord".equals(cmd))
			result = getVoucherWord(obj, request);
		// 增加凭证字
		else if ("addVoucherWord".equals(cmd))
			result = addVoucherWord(obj, request);
		// 删除凭证字
		else if ("deleteVoucherWord".equals(cmd))
			result = deleteVoucherWord(obj, request);
		// 修改凭证字
		else if ("modifyVoucherWord".equals(cmd))
			result = modifyVoucherWord(obj, request);
		else
		{
			result = "没有对应的cmd请求.";
			return;
		}
		// 返回json数据
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 查询凭证
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String getVoucherDetail(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.voucher.detail.get";
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}

	/**
	 * 增加凭证
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String addVoucher(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.rabbitmq.voucher.add.send";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}

	/**
	 * 修改凭证
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String modifyVoucher(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.rabbitmq.voucher.modify.send";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}

	/**
	 * 删除凭证
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String deleteVoucher(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.rabbitmq.voucher.delete.send";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}

	/**
	 * 审核凭证
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String modifyVoucherVerifyflag(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.voucher.verifyflag.modify";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 获取凭证号
	 * @author 黄永丰
	 * @createtime 2015年11月20日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String getVoucherNum(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.base.com.order.getordernum";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
	}

	/**
	 * 获取公司订单
	 * @author 黄永丰
	 * @createtime 2015年11月20日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String getOrder(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.base.account.order.get";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 查询凭证字
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String getVoucherWord(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.voucher.word.get";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}

	/**
	 * 增加凭证字
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String addVoucherWord(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.voucher.word.add";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 删除凭证字
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String deleteVoucherWord(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.voucher.word.delete";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	
	/**
	 * 修改凭证字
	 * @author 黄永丰
	 * @createtime 2015年11月19日
	 * @param obj 传入json数据
	 * @param request
	 */
	private String modifyVoucherWord(JSONObject obj, HttpServletRequest request)
	{
		String method = "masget.finance.voucher.word.modify";
		// 调用接口
		return CommomUtil.CallApi(request, CommomUtil.FINANCE_SERVICE, method, obj.toString());
	}
	

}
