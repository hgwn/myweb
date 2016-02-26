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
 * 平台管理Controller
 * @author lgn
 *
 */
@Controller
@RequestMapping("/base/platform")
public class PlatformController {
	/**
	 * 已加盟平台查询
	 */
	@RequestMapping(value="/get",method={RequestMethod.POST,RequestMethod.GET})
	public void getplat(
			@RequestParam(value="data",required=false) String data,
			HttpServletRequest request, HttpServletResponse response)
	{
		
		JSONObject obj = JSONObject.fromObject(data);
		
		String serviceName="baseService";
		
		String method="masget.base.com.platform.get";
		
        String result = CommomUtil.CallApi(request, serviceName, method, obj.toString());
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
}
