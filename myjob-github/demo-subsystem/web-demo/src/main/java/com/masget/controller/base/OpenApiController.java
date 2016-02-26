package com.masget.controller.base;

import java.net.URLDecoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
@RequestMapping("/openApi")
public class OpenApiController {

	/**
	 * 调用api--需要登录
	 * @param request 请求对象
	 * @param response 响应对象
	 * @throws Exception 
	 */
	@RequestMapping(value="/call",method={RequestMethod.GET,RequestMethod.POST})
	public void call(
			@RequestParam(value="method",required=true) String method,
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		    
		    String serviceName="";
		
		    String[] ary=method.split("\\.");
		    
		    if(ary[1].equals("base")){
		    	serviceName=CommomUtil.BASE_SERVICE;
		    }
		    if(ary[1].equals("logistic")){
		    	serviceName=CommomUtil.LOGISTICS_SERVICE;
		    }
		    if(ary[1].equals("enterprise")){
		    	serviceName=CommomUtil.ENTERPRISE_SERVICE;
		    }
			
	        String result = CommomUtil.CallApi(request, serviceName, method, data);
	        
			CommomUtil.writeResultBack(request, response, result);
			
			System.out.println(result);
	}
}
