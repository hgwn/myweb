package com.masget.controller.base;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.masget.util.CommomUtil;

/**
 * 
 * @author lh
 *
 */
@Controller
@RequestMapping("base")
public class CustomerController {
	
	/**
	 * 查询供应商
	 */
	@RequestMapping(value = "/getcustomer", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void getcustomer(
			@RequestParam(value = "scenetypeid", required = false) String scenetypeid,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}
		Map<String, Object> dataMap = new HashMap<String, Object>();		
		dataMap.put("scenetypeid", scenetypeid);
		
		Gson gson = new Gson();
		String data = gson.toJson(dataMap);

		String method = "masget.base.com.contractorinfo.find";
		String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
}

