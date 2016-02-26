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
 * 公司Controller
 * @author lgn
 *
 */
@Controller
@RequestMapping("/base/companyinfo")
public class CompanyInfoController {
	
	/**
	 * 根据条件 查询公司信息
	 */
	@RequestMapping(value="/list",method={RequestMethod.POST,RequestMethod.GET})
	public void list(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request, HttpServletResponse response)
	{
		
		JSONObject obj = JSONObject.fromObject(data);
		
		String serviceName="baseService";
		
		String method="masget.base.com.companyinfo.get";
		
        String result = CommomUtil.CallApi(request, serviceName, method, obj.toString());
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(data);
		
		System.out.println(result);
	}
	
	/**
	 * 修改公司信息
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/update",method={RequestMethod.GET,RequestMethod.POST})
	public void update(
		@RequestParam(value="data",required=true) String data,
		HttpServletRequest request, HttpServletResponse response) {

		JSONObject obj = JSONObject.fromObject(data);
		
		String method="masget.base.com.companyinfo.modify";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 查询单个公司的信息
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/getOneCompany",method={RequestMethod.GET,RequestMethod.POST})
	public void getOneCompany(
		@RequestParam(value="companyid",required=true) String companyid,
		HttpServletRequest request, HttpServletResponse response) {

		Map<String, Object> dataMap=new HashMap<String, Object>();
		dataMap.put("companyid",companyid);
		
		String data=new Gson().toJson(dataMap);
		
		String method="masget.base.com.companyinfo.getone";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
}

