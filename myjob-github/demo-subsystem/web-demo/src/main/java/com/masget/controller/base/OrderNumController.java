package com.masget.controller.base;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.masget.util.CommomUtil;

/**
 * 订单号Controller
 * @author cxq
 *
 */
@Controller
@RequestMapping("orderNum")
public class OrderNumController{

	/**
	 * 根据订单类型id获取订单号
	 * @param ordertypeid 订单类型id
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping("/get")
	public void get(
			@RequestParam(value="ordertypeid",required=true) String ordertypeid,
			HttpServletRequest request, HttpServletResponse response) {
		
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		dataMap.put("ordertypeid", ordertypeid);
		String data=new Gson().toJson(dataMap);
		
		String method="masget.base.com.order.getordernum";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
        
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}

}
