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
 * IM模块->'我的'模块Controller
 *@author chenjinxing
 */
@Controller
@RequestMapping("/UserResource")
public class UserResourceController {
	
	/**获取IM'我的'模块列表信息
	 *@param request
	 *@param response
	 */
	@RequestMapping("/my")
	public void getMy(HttpServletRequest request,HttpServletResponse response){
    	String opt_Type = request.getParameter("optType");
    	String posresourceid = request.getParameter("posresourceid");
    	String childnodetype = request.getParameter("childnodetype");
    	String ostype = request.getParameter("ostype");
    	Map<String,Object> dataMap = new HashMap<String,Object>();
    	if("getMy".equals(opt_Type)){
    		if(posresourceid!=null&&childnodetype!=null&&ostype!=null){
    			dataMap.put("posresourceid", posresourceid);
    			dataMap.put("childnodetype", childnodetype);
    			dataMap.put("ostype", ostype);
    		}else{
    			
    		}
    	}
		String data = new Gson().toJson(dataMap);
		String result = CommomUtil.CallApi(request,CommomUtil.BASE_SERVICE, "masget.base.com.userresource.get", data);
		CommomUtil.writeResultBack(request, response, result);
		
	}  
	
	/**
	 * 查询公司追加资源
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/get",method={RequestMethod.GET,RequestMethod.POST})
	public void get(
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		String method="masget.base.com.userresource.get";
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
		
}
