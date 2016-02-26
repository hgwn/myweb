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
 * 员工类型Controller
 *  
 *
 */
@Controller
@RequestMapping("staffType")
public class StaffTypeController{

	
	/**
	 * 获取员工类型信息(联表查询)
	 * @param request
	 * @param response
	 */
	@RequestMapping("/list")
	public void list(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.base.type.stafftype.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
        
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 新增员工类型
	 * 
	 * @param request 请求对象
	 * @param response 响应对象
	 * @param data {stafftypeid:"",stafftypename:""}
	 */
	@RequestMapping(value = "/add", method = { RequestMethod.GET,RequestMethod.POST })
	public void add(
			@RequestParam(value = "data", required = true) String data,
			HttpServletRequest request, HttpServletResponse response) {

	
			String method = "masget.base.type.stafftype.add";
	
			String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,method, data);
	
			CommomUtil.writeResultBack(request, response, result);
	
			System.out.println(result);
	}
	
	/**
	 * 修改员工类型
	 * 
	 * @param request 请求对象
	 * @param response 响应对象
	 * @param data {stafftypeid:"",stafftypename:""}
	 */
	@RequestMapping(value = "/modify", method = { RequestMethod.GET,RequestMethod.POST })
	public void modify(
			@RequestParam(value = "data", required = true) String data,
			HttpServletRequest request, HttpServletResponse response) {

	
			String method = "masget.base.type.stafftype.modify";
	
			String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,method,data);
	
			CommomUtil.writeResultBack(request, response, result);
	
			System.out.println(result);
	}
	
	/**
	 * 删除员工类型
	 * 
	 * @param request 请求对象
	 * @param response 响应对象
	 * @param data {stafftypeid:""}
	 */
	@RequestMapping(value = "/delete", method = { RequestMethod.GET,RequestMethod.POST })
	public void delete(
			@RequestParam(value = "data", required = true) String data,
			HttpServletRequest request, HttpServletResponse response) {

	
			String method = "masget.base.type.stafftype.delete";
	
			String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,method, data);
	
			CommomUtil.writeResultBack(request, response, result);
	
			System.out.println(result);
	}
	
	
}
