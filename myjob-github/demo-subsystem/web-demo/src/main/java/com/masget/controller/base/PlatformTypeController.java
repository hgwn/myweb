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
 * 站点类型Controller
 *  
 *
 */
@Controller
@RequestMapping("platformType")
public class PlatformTypeController{

	
	/**
	 * 获取平台类型信息(联表查询)
	 * @param request
	 * @param response
	 */
	@RequestMapping("/list")
	public void list(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.base.type.platformtype.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
        
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 新增平台类型
	 * 
	 * @param request 请求对象
	 * @param response 响应对象
	 * @param data {platformtypeid:"",platformtypename:""}
	 */
	@RequestMapping(value = "/add", method = { RequestMethod.GET,RequestMethod.POST })
	public void add(
			@RequestParam(value = "data", required = true) String data,
			HttpServletRequest request, HttpServletResponse response) {

	
			String method = "masget.base.type.platformtype.add";
	
			String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,method, data);
	
			CommomUtil.writeResultBack(request, response, result);
	
			System.out.println(result);
	}
	
	/**
	 * 修改平台类型
	 * 
	 * @param request 请求对象
	 * @param response 响应对象
	 * @param data {platformtypeid:"",platformtypename:""}
	 */
	@RequestMapping(value = "/modify", method = { RequestMethod.GET,RequestMethod.POST })
	public void modify(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {

	
			String method = "masget.base.type.platformtype.modify";
	
			String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,method,data);
	
			CommomUtil.writeResultBack(request, response, result);
	
			System.out.println(result);
	}
	
	/**
	 * 删除平台类型
	 * 
	 * @param request 请求对象
	 * @param response 响应对象
	 * @param data {platformtypeid:""}
	 */
	@RequestMapping(value = "/delete", method = { RequestMethod.GET,RequestMethod.POST })
	public void delete(
			@RequestParam(value = "data", required = true) String data,
			HttpServletRequest request, HttpServletResponse response) {

	
			String method = "masget.base.type.platformtype.delete";
	
			String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,method, data);
	
			CommomUtil.writeResultBack(request, response, result);
	
			System.out.println(result);
	}
	
	
}
