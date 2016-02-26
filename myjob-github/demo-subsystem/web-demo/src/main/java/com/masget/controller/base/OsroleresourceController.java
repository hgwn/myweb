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
 * 资源Controller
 * @author lgn
 *
 */
@Controller
@RequestMapping("/base/osroleresource")
public class OsroleresourceController {
	
	/**
	 * 根据条件 公司角色查询
	 */
	@RequestMapping(value="/find",method={RequestMethod.POST,RequestMethod.GET})
	public void find(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request, HttpServletResponse response)
	{
		
		JSONObject obj = JSONObject.fromObject(data);
		
		String serviceName="baseService";
		
		String method="masget.base.com.rolescenetype.find";
		
        String result = CommomUtil.CallApi(request, serviceName, method, obj.toString());
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 根据条件 平台公司角色管理-查询
	 */
	@RequestMapping(value="/get",method={RequestMethod.POST,RequestMethod.GET})
	public void get(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request, HttpServletResponse response)
	{
		
		JSONObject obj = JSONObject.fromObject(data);
		
		String serviceName="baseService";
		
		String method="masget.base.com.osroleresource.find";
		
        String result = CommomUtil.CallApi(request, serviceName, method, obj.toString());
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 修改资源信息
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/update",method={RequestMethod.GET,RequestMethod.POST})
	public void update(
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request, HttpServletResponse response) 
	{
		
			JSONObject obj = JSONObject.fromObject(data);
			
			String method="masget.base.com.osroleresource.modify";
			
	        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
	        
			CommomUtil.writeResultBack(request, response, result);
			
			System.out.println(result);
	}
	
	/**
	 * 平台公司角色管理-add
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/add",method={RequestMethod.GET,RequestMethod.POST})
	public void add(
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request, HttpServletResponse response) 
	{
		
		JSONObject obj = JSONObject.fromObject(data);
		
		String method="masget.base.com.osroleresource.add";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 删除资源信息
	 */
	@RequestMapping(value="/delete",method={RequestMethod.POST,RequestMethod.GET})
	public void delete(
			@RequestParam(value="osresourceid",required=true) String osresourceid,
			HttpServletRequest request, HttpServletResponse response) 
	{
		
		Map<String,Object> dataMap = new HashMap<String,Object>();
		dataMap.put("osresourceid", osresourceid);
		
		String data = new Gson().toJson(dataMap);
		
		String serviceName="baseService";
		
		String method="masget.base.com.osroleresource.delete";
		
        String result = CommomUtil.CallApi(request, serviceName, method, data);
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
}

