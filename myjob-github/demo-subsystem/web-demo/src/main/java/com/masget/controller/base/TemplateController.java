package com.masget.controller.base;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.masget.util.CommomUtil;

@Controller
public class TemplateController
{
	
	/**
	 * 获取模板
	 * @param tempname
	 * @param temptype
	 */
	@RequestMapping("printTemplate/getTemp.do")
	public void getTemp(@RequestParam(value="tempname",required=false) String tempname,
			        @RequestParam(value = "temptype", required = false)Long temptype,
			HttpServletRequest request, HttpServletResponse response)
	{
		Map<String, Object> dataMap = new HashMap<String, Object>();
		
		if(tempname != null&& tempname != "")
		{
			dataMap.put("tempname", tempname);
		}
		if(temptype != null)
		{
			dataMap.put("temptype", temptype);
		}
		String obj = JSONObject.fromObject(dataMap).toString();

        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, "masget.base.com.templatedataitem.get", obj);
		
		CommomUtil.writeResultBack(request, response, result);
		
	}

	/**
	 * 删除模板
	 * @param tempid
	 */
	@RequestMapping("printTemplate/onDeleteTemplate.do")
	public void dealTemp(@RequestParam(value="tempid",required=true) Long tempid,	      
			HttpServletRequest request, HttpServletResponse response)
	{
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		dataMap.put("tempid", tempid);
		
		String data=new Gson().toJson(dataMap);
		
		String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, "masget.base.com.templateinfo.delete", data); 
			
	    CommomUtil.writeResultBack(request, response, result);
	}
	
	
	/**
	 * 保存模板
	 * @param data
	 */
	@RequestMapping(value="printTemplate/onSaveTemplate.do",method={RequestMethod.GET,RequestMethod.POST})
	public void saveTemp(
			@RequestParam(value="data",required=true) String data,
			HttpServletRequest request, HttpServletResponse response)
	{
		HttpSession httpSession = request.getSession(false);
		JSONObject user = JSONObject.fromObject(httpSession.getAttribute("user_login_data"));
		int  companyid=user.getInt("companyid");
		
		JSONObject obj = JSONObject.fromObject(data);
		obj.put("createdby", companyid);
		String result =null;
		
		if(obj.get("tempid")!=null){
			
			  result= CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, "masget.base.com.templateinfo.modify", obj.toString()); 
			
		}else{
			
			 result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, "masget.base.com.templateinfo.add", obj.toString()); 
			
		}
        CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	
	/**
	 * 获取栏目列表 
	 * @param templatetype
	 */
	@RequestMapping("printTemplate/getPlaform.do")
	public void getPlaform(@RequestParam(value="tempname",required=false) String templatetype,
			        
			HttpServletRequest request, HttpServletResponse response)
	{
		
		HttpSession httpSession = request.getSession(false);
		
		String result="";
		
		if(null!=httpSession){
			String user = (String) httpSession.getAttribute("user_login_data");
			if(user!=null){
				
				Long  companytypeid=Long.valueOf(""+JSONObject.fromObject(user).get("companytypeid"));	
				
				Map<String, Object> dataMap = new HashMap<String, Object>();
				dataMap.put("companytypeid", companytypeid);
				
				if(templatetype != null&& templatetype != ""){
					dataMap.put("templatetype", templatetype);
				}
				
				String obj = JSONObject.fromObject(dataMap).toString();
				
		        result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, "masget.base.com.plaformtemplate.get", obj);
		    
		        CommomUtil.writeResultBack(request, response, result);
		        
			}else{
				CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "请先登录"));
			}
		}else{
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "请先登录"));
		}
		
	}
}
