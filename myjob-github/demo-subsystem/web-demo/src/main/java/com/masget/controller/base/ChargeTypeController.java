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
 * 费用类型Controller
 * @author cxq
 *
 */
@Controller
@RequestMapping("/chargeType")
public class ChargeTypeController{
	
	/**
	 * 获取可用的费用类型信息
	 * @param request
	 * @param response
	 */
	@RequestMapping("/list")
	public void list(HttpServletRequest request, HttpServletResponse response){
		
		String method="masget.base.com.chargetype.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, "{}");
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	
	/**
	 * 获取可用的费用类型信息
	 * @param request
	 * @param response
	 */
	@RequestMapping("/getlist")
	public void getlist(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
			JSONObject obj = JSONObject.fromObject(data);
			
			String method="masget.base.com.chargetype.get";
			
	        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
			
			CommomUtil.writeResultBack(request, response, result);
			
			System.out.println(result);
	}
	
	/**
	 * 查询基础费用类型
	 * @param request
	 * @param response
	 */
	@RequestMapping("/getbase")
	public void getbase(
		HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.base.com.basechargetype.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, "{}");
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 查询公司未应用基础费用类型
	 * @param request
	 * @param response
	 */
	@RequestMapping("/getnotuse")
	public void getnotuse(
		HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.base.com.basechargetype.getnotuse";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, "{}");
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 增加费用类型信息
	 * @param request
	 * @param response
	 */
	@RequestMapping("/add")
	public void add(
		@RequestParam(value = "data", required = false) String data,
		HttpServletRequest request, HttpServletResponse response) {

		JSONObject obj = JSONObject.fromObject(data);
		
		String method="masget.base.com.chargetype.add";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 修改费用类型信息
	 * @param request
	 * @param response
	 */
	@RequestMapping("/modify")
	public void modify(
		@RequestParam(value = "data", required = false) String data,
		HttpServletRequest request, HttpServletResponse response) {

		JSONObject obj = JSONObject.fromObject(data);
		
		String method="masget.base.com.chargetype.modify";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 删除费用类型信息
	 * 
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value = "/delete", method = { RequestMethod.GET,RequestMethod.POST })
	public void delete(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {

			JSONObject obj = JSONObject.fromObject(data);
			
			String method = "masget.base.com.chargetype.delete";
	
			String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,method, obj.toString());
	
			CommomUtil.writeResultBack(request, response, result);
	
			System.out.println(result);
	}

}
