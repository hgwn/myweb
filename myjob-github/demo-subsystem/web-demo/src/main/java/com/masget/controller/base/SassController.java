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
 * sassController
 * @author lgn
 *
 */
@Controller
@RequestMapping("/base/SassController")
public class SassController {
	/**
	 * 探索服务
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/find",method={RequestMethod.GET,RequestMethod.POST})
	public void find(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
			JSONObject obj = JSONObject.fromObject(data);
			
			String method="masget.base.com.saas.find";
			
	        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
	        
			CommomUtil.writeResultBack(request, response, result);
			
			System.out.println(result);
	}
}
