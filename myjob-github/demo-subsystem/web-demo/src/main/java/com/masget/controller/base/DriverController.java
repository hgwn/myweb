package com.masget.controller.base;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.masget.util.CommomUtil;

/**
 * 司机Controller
 * @author lgn
 *
 */
@Controller
@RequestMapping("/base/driver")
public class DriverController {

	/**
	 * 获取司机
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/get",method={RequestMethod.GET,RequestMethod.POST})
	public void get(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
			JSONObject obj = JSONObject.fromObject(data);
			obj.put("indicate", 3);
			
			String method="masget.logistic.customer.contract.get";
			
	        String result = CommomUtil.CallApi(request, CommomUtil.LOGISTICS_SERVICE, method, obj.toString());
	        
			CommomUtil.writeResultBack(request, response, result);
			
			System.out.println(result);
	}
}
