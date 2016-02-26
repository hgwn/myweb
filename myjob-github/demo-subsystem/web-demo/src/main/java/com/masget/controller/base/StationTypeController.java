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
@RequestMapping("stationType")
public class StationTypeController{

	
	/**
	 * 获取站点类型信息(联表查询)
	 * @param request
	 * @param response
	 */
	@RequestMapping("/list")
	public void list(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.base.com.stationtype.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
        
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 新增站点类型
	 * 
	 * @param request 请求对象
	 * @param response 响应对象
	 * @param data {stationtypeid:"",stationtypename:""}
	 */
	@RequestMapping(value = "/add", method = { RequestMethod.GET,RequestMethod.POST })
	public void add(
			@RequestParam(value = "data", required = true) String data,
			HttpServletRequest request, HttpServletResponse response) {

	
			String method = "masget.base.type.stationtype.add";
	
			String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,method, data);
	
			CommomUtil.writeResultBack(request, response, result);
	
			System.out.println(result);
	}
	
	/**
	 * 修改站点类型
	 * 
	 * @param request 请求对象
	 * @param response 响应对象
	 * @param data {stationtypeid:"",stationtypename:""}
	 */
	@RequestMapping(value = "/modify", method = { RequestMethod.GET,RequestMethod.POST })
	public void modify(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {

	
			String method = "masget.base.type.stationtype.modify";
	
			String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,method,data);
	
			CommomUtil.writeResultBack(request, response, result);
	
			System.out.println(result);
	}
	
	/**
	 * 删除站点类型
	 * 
	 * @param request 请求对象
	 * @param response 响应对象
	 * @param data {stationtypeid:""}
	 */
	@RequestMapping(value = "/delete", method = { RequestMethod.GET,RequestMethod.POST })
	public void delete(
			@RequestParam(value = "data", required = true) String data,
			HttpServletRequest request, HttpServletResponse response) {

	
			String method = "masget.base.type.stationtype.delete";
	
			String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,method, data);
	
			CommomUtil.writeResultBack(request, response, result);
	
			System.out.println(result);
	}
	
	
}
