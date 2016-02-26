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
@RequestMapping("/enterprise/FundAccount")
public class FundAccountController {
	
	/**
	 * 查询经销商钱包列表
	 * @param request
	 * @param response
	 */
	@RequestMapping("/providerget")
	public void providerget(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.prepaywallet.provider.wallet.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.PREPAYWALLET_SERVICE, method, data);
        
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 汇总所有经销商钱包数据
	 * @param request
	 * @param response
	 */
	@RequestMapping("/providersum")
	public void providersum(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.prepaywallet.provider.wallet.sum";
		
        String result = CommomUtil.CallApi(request, CommomUtil.PREPAYWALLET_SERVICE, method,data);
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 查询经销商钱包流水
	 * @param request
	 * @param response
	 */
	@RequestMapping("/waterget")
	public void waterget(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.prepaywallet.provider.water.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.PREPAYWALLET_SERVICE, method,data);
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 添加经销商线下充值记录
	 * @param request
	 * @param response
	 */
	@RequestMapping("/provideradd")
	public void provideradd(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.prepaywallet.provider.recharge.add";
		
        String result = CommomUtil.CallApi(request, CommomUtil.PREPAYWALLET_SERVICE, method,data);
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 经销商线下充值收款确认
	 * @param request
	 * @param response
	 */
	@RequestMapping("/providerconfirm")
	public void providerconfirm(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		
		String method="masget.prepaywallet.provider.wallet.confirm";
		
        String result = CommomUtil.CallApi(request, CommomUtil.PREPAYWALLET_SERVICE, method,obj.toString());
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 新增经销商钱包
	 * @param request
	 * @param response
	 */
	@RequestMapping("/walletadd")
	public void walletadd(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.prepaywallet.provider.wallet.add";
		
        String result = CommomUtil.CallApi(request, CommomUtil.PREPAYWALLET_SERVICE, method,data);
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 查询经销商充值记录
	 * @param request
	 * @param response
	 */
	@RequestMapping("/rechargeget")
	public void rechargeget(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		
		String method="masget.prepaywallet.provider.recharge.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.PREPAYWALLET_SERVICE, method,obj.toString());
        
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 查询子经销商
	 * @param request
	 * @param response
	 */
	@RequestMapping("/subcompanyget")
	public void subcompanyget(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
//		try {
//			data = Base64Method.EncryptBase64(data);
//		} catch (Exception e) {
//			// TODO: handle exception
//		}
		String method="masget.prepaywallet.wallet.subcompany.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.PREPAYWALLET_SERVICE, method,data);
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
}
