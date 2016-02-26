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
 * 车辆类型Controller
 * @author cxq
 *
 */
@Controller
@RequestMapping("vehicleType")
public class VehicleTypeController{

	
	/**
	 * 获取车辆类型信息(联表查询)
	 * @param request
	 * @param response
	 */
	@RequestMapping("/list")
	public void list(HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.base.com.vehicletype.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, "{}");
        
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}

	/**
	 * 获取车辆类型信息(单表查询)
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/gettype", method = { RequestMethod.GET,RequestMethod.POST })
	public void gettype(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {

			JSONObject obj = JSONObject.fromObject(data);
	
			String method = "masget.base.com.vehicletype.gettype";
	
			String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,method, obj.toString());
	
			CommomUtil.writeResultBack(request, response, result);
	
			System.out.println(result);
	}
	
	/**
	 * 新增车辆类型
	 * 
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value = "/add", method = { RequestMethod.GET,RequestMethod.POST })
	public void add(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {

			JSONObject obj = JSONObject.fromObject(data);
	
			String method = "masget.base.com.vehicletype.add";
	
			String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,method, obj.toString());
	
			CommomUtil.writeResultBack(request, response, result);
	
			System.out.println(result);
	}
	
	/**
	 * 修改车辆类型
	 * 
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value = "/modify", method = { RequestMethod.GET,RequestMethod.POST })
	public void modify(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {

			JSONObject obj = JSONObject.fromObject(data);
	
			String method = "masget.base.com.vehicletype.modify";
	
			String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,method, obj.toString());
	
			CommomUtil.writeResultBack(request, response, result);
	
			System.out.println(result);
	}
	
	/**
	 * 删除车辆类型
	 * 
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value = "/delete", method = { RequestMethod.GET,RequestMethod.POST })
	public void delete(
			@RequestParam(value = "vehicletypeid", required = false) String vehicletypeid,
			HttpServletRequest request, HttpServletResponse response) {

			Map<String, Object> dataMap=new HashMap<String, Object>();
			dataMap.put("vehicletypeid", vehicletypeid);
			
			String data=new Gson().toJson(dataMap);
	
			String method = "masget.base.com.vehicletype.delete";
	
			String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,method, data);
	
			CommomUtil.writeResultBack(request, response, result);
	
			System.out.println(result);
	}
	
	
}
