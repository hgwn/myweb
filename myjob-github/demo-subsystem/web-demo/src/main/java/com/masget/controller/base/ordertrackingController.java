package com.masget.controller.base;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.masget.util.CommomUtil;

@Controller
@RequestMapping("ordertrack")
public class ordertrackingController {

	/**
	 * 根据托运单号获取托运单状态
	 * @param ordernum 运单号
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping("/get")
	public void get(
			@RequestParam(value="relationnum",required=true) String relationnum,
			HttpServletRequest request, HttpServletResponse response) {
		
		//获取登陆对象判断是否登录
				String login_data = (String) request.getSession().getAttribute("user_login_data");
				if (login_data == null) {
					CommomUtil.writeResultBack(request, response,CommomUtil.RetResponse(10, "请先登录"));
					return;
				}
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		dataMap.put("relationnum", 2015070912);
		
		String data=new Gson().toJson(dataMap);
		
		String method="masget.base.com.ordertracking.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
        
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}

}
