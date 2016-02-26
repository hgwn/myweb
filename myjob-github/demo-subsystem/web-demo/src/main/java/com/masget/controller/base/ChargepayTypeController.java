package com.masget.controller.base;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.google.gson.Gson;
import com.masget.util.CommomUtil;

/**
 * 支付类型Controller
 * @author cxq
 *
 */
@Controller
@RequestMapping("/chargepayType")
public class ChargepayTypeController{
	
	/**
	 * 获取可用的支付类型信息
	 * @param request
	 * @param response
	 */
	@RequestMapping("/list")
	public void list(HttpServletRequest request, HttpServletResponse response){
		
		String loginData = (String) request.getSession().getAttribute("user_login_data");
		JSONObject jsonObject=JSONObject.fromObject(loginData);
		String logisticid=jsonObject.get("selfcompanyid").toString();
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		dataMap.put("logisticid", logisticid);
		String data=new Gson().toJson(dataMap);
		
		String method="masget.base.com.chargepaytype.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}

}
