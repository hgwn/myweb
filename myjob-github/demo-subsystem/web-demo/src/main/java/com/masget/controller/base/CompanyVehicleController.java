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
import com.masget.entity.RetStruct;
import com.masget.util.CommomUtil;

/**
 * 车辆Controller
 * @author cxq
 *
 */
@Controller
@RequestMapping("base/companyvehicle")
public class CompanyVehicleController{

	
	/**
	 * 获取车辆信息
	 * @param request
	 * @param response
	 */
	@RequestMapping("/list")
	public void list(
			@RequestParam(value="licensenumber", required = false) String licensenumber,
			@RequestParam(value="vehicletypename", required = false) String vehicletypename,
			HttpServletRequest request, HttpServletResponse response) {
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		
		if(licensenumber!=null&&!licensenumber.trim().equals("")){
			dataMap.put("licensenumber", licensenumber);
		}
		
		if(vehicletypename!=null&&!vehicletypename.trim().equals("")){
			dataMap.put("vehicletypename", vehicletypename);
		}
		
		String data=new Gson().toJson(dataMap);
		
		String method="masget.base.com.companyvehicle.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
        
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 新增车辆
	 * 
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value = "/add", method = { RequestMethod.GET,RequestMethod.POST })
	public void add(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {

			JSONObject obj = JSONObject.fromObject(data);
	
			String method = "masget.base.com.companyvehicle.add";
	
			String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,method, obj.toString());
	
			CommomUtil.writeResultBack(request, response, result);
	
			System.out.println(result);
	}
}
