package com.masget.controller.base;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.masget.util.CommomUtil;

/**
 * 企业提货类型Controller
 *  
 *
 */
@Controller
@RequestMapping("deliveryType")
public class DeliveryTypeController{

	
	/**
	 * 获取企业提货类型信息(联表查询)
	 * @param request
	 * @param response
	 */
	@RequestMapping("/list")
	public void list(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.base.type.deliverytype.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
        
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 新增企业提货类型
	 * 
	 * @param request 请求对象
	 * @param response 响应对象
	 * @param data {deliverytypeid:"",deliverytypename:""}
	 */
	@RequestMapping(value = "/add", method = { RequestMethod.GET,RequestMethod.POST })
	public void add(
			@RequestParam(value = "data", required = true) String data,
			HttpServletRequest request, HttpServletResponse response) {

	
			String method = "masget.base.type.deliverytype.add";
	
			String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,method, data);
	
			CommomUtil.writeResultBack(request, response, result);
	
			System.out.println(result);
	}
	
	/**
	 * 修改企业提货类型
	 * 
	 * @param request 请求对象
	 * @param response 响应对象
	 * @param data {deliverytypeid:"",deliverytypename:""}
	 */
	@RequestMapping(value = "/modify", method = { RequestMethod.GET,RequestMethod.POST })
	public void modify(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {

	
			String method = "masget.base.type.deliverytype.modify";
	
			String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,method,data);
	
			CommomUtil.writeResultBack(request, response, result);
	
			System.out.println(result);
	}
	
	/**
	 * 删除企业提货类型
	 * 
	 * @param request 请求对象
	 * @param response 响应对象
	 * @param data {deliverytypeid:""}
	 */
	@RequestMapping(value = "/delete", method = { RequestMethod.GET,RequestMethod.POST })
	public void delete(
			@RequestParam(value = "data", required = true) String data,
			HttpServletRequest request, HttpServletResponse response) {

	
			String method = "masget.base.type.deliverytype.delete";
	
			String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,method, data);
	
			CommomUtil.writeResultBack(request, response, result);
	
			System.out.println(result);
	}
	
	
}
