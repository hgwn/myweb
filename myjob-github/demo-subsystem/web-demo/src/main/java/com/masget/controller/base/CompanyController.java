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
 * 公司Controller
 * @author lyt
 *
 */
@Controller
@RequestMapping("/base/company")
public class CompanyController {
	
	/**
	 * 根据条件 查询公司信息
	 */
	@RequestMapping(value="/list",method={RequestMethod.POST,RequestMethod.GET})
	public void list(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request, HttpServletResponse response)
	{
		
		String serviceName="baseService";
		
		String method="masget.base.com.companyinfo.find";
		
        String result = CommomUtil.CallApi(request, serviceName, method,data);
		
		CommomUtil.writeResultBack(request, response, result);
		
	}
	
	
}

