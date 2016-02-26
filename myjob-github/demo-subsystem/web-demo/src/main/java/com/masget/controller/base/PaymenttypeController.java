package com.masget.controller.base;

import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import com.google.gson.Gson;
import com.masget.util.CommomUtil;

@Controller
@RequestMapping("base/paymenttype")
public class PaymenttypeController {
	
	/**
	 * 获取车辆信息
	 * @param request
	 * @param response
	 */
	@RequestMapping("/list")
	public void list(
			HttpServletRequest request, HttpServletResponse response) {
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		
		String data=new Gson().toJson(dataMap);
		
		String method="masget.base.com.paymenttype.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
        
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}

}
