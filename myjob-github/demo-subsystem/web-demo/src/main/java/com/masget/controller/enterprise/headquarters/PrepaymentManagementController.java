package com.masget.controller.enterprise.headquarters;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.masget.util.CommomUtil;

/**
 * 资金账户Controller
 * @author lgn
 *
 */
@Controller
@RequestMapping("/enterprise/PrepaymentManagement")
public class PrepaymentManagementController {
	
	/**
	 * 查询钱包数据
	 * @param request
	 * @param response
	 */
	@RequestMapping("/walletget")
	public void walletget(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.prepaywallet.com.wallet.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.PREPAYWALLET_SERVICE, method, data);
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 汇总钱包数据
	 * @param request
	 * @param response
	 */
	@RequestMapping("/walletsum")
	public void walletsum(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.prepaywallet.com.wallet.sum";
		
        String result = CommomUtil.CallApi(request, CommomUtil.PREPAYWALLET_SERVICE, method,data);
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 新增钱包流水
	 * @param request
	 * @param response
	 */
	@RequestMapping("/walletadd")
	public void walletadd(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.prepaywallet.com.water.add";
		
        String result = CommomUtil.CallApi(request, CommomUtil.PREPAYWALLET_SERVICE, method,data);
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 查询支付流水
	 * @param request
	 * @param response
	 */
	@RequestMapping("/waterget")
	public void waterget(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.prepaywallet.com.water.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.PREPAYWALLET_SERVICE, method,data);
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 添加充值记录
	 * @param request
	 * @param response
	 */
	@RequestMapping("/rechargeadd")
	public void rechargeadd(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.prepaywallet.com.recharge.add";
		
        String result = CommomUtil.CallApi(request, CommomUtil.PREPAYWALLET_SERVICE, method,data);
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 查询充值记录
	 * @param request
	 * @param response
	 */
	@RequestMapping("/rechargeget")
	public void rechargeget(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.prepaywallet.com.recharge.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.PREPAYWALLET_SERVICE, method,data);
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 充值支付成功回调
	 * @param request
	 * @param response
	 */
	@RequestMapping("/rechargenotify")
	public void rechargemodify(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.prepaywallet.com.recharge.notify";
		
        String result = CommomUtil.CallApi(request, CommomUtil.PREPAYWALLET_SERVICE, method,data);
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 充值清分完成回调
	 * @param request
	 * @param response
	 */
	@RequestMapping("/rechargesettlement")
	public void rechargesettlement(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.prepaywallet.com.recharge.settlement";
		
        String result = CommomUtil.CallApi(request, CommomUtil.PREPAYWALLET_SERVICE, method,data);
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 查询支付记录
	 * @param request
	 * @param response
	 */
	@RequestMapping("/paymentget")
	public void paymentget(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.prepaywallet.com.payment.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.PREPAYWALLET_SERVICE, method,data);
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 使用预付款钱包进行订单支付
	 * @param request
	 * @param response
	 */
	@RequestMapping("/paymentpay")
	public void paymentpay(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.prepaywallet.wallet.payment.pay";
		
        String result = CommomUtil.CallApi(request, CommomUtil.PREPAYWALLET_SERVICE, method,data);
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 支付结果回调
	 * @param request
	 * @param response
	 */
	@RequestMapping("/paynotify")
	public void paynotify(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.prepaywallet.com.payment.notify";
		
        String result = CommomUtil.CallApi(request, CommomUtil.PREPAYWALLET_SERVICE, method,data);
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	
	/**
	 * 消费交易接口
	 * @param request
	 * @param response
	 */
	@RequestMapping("/pay")
	public void pay(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
//		try {
//			data = Base64Method.EncryptBase64(data);
//		} catch (Exception e) {
//			// TODO: handle exception
//		}
		String method="masget.pay.com.acponlinepay.pay";
		
        String result = CommomUtil.CallApiHttp(request, CommomUtil.PAY_SERVICE, method,data);
        
        JSONObject obj = new JSONObject(); 
        obj.put("message", result);
        obj.put("ret", 0);
        
		CommomUtil.writeResultBack(request, response, obj.toString());
		
		System.out.println(result);
	}
	/**
	 * 使用预付款钱包进行采购单订单支付
	 * @param request
	 * @param response
	 */
	@RequestMapping("/payPrepaywallet")
	public void payPrepaywallet(
			@RequestParam(value = "data", required = true) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.enterprise.headquarters.orders.prepaywallet.pay";
		
        String result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method,data);
        
		CommomUtil.writeResultBack(request, response, result);
		
	}
}
