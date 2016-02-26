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
import com.masget.entity.RetStruct;
import com.masget.util.CommomUtil;
import com.masget.utils.MgException;

/**
 * 合作公司站点Controller
 * @author cxq
 *
 */
@Controller
@RequestMapping("companyrelation")
public class CompanyRelationController{

	
	/**
	 * 获取合作公司站点信息
	 * @param condition 关键字
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/list",method={RequestMethod.GET,RequestMethod.POST})
	public void list(
			@RequestParam(value="q",required=false) String condition,
			HttpServletRequest request, HttpServletResponse response) {
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		dataMap.put("pagesize", 10);
		dataMap.put("pagenum", 1);
		if(condition!=null&&!condition.trim().equals("")){
			dataMap.put("condition", condition);
		}
		
		String data=new Gson().toJson(dataMap);
		
		String method="masget.base.com.companyrelation.getstation";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
        
        RetStruct retStruct=new Gson().fromJson(result, RetStruct.class);
        
        String str=new Gson().toJson(retStruct.getData().getRows());
		
		CommomUtil.writeResultBack(request, response, str);
		
		System.out.println(str);
	}
	
	/**
	 * 获取合作公司站点信息
	 * @param condition 关键字
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/query",method={RequestMethod.GET,RequestMethod.POST})
	public void query(
			@RequestParam(value="condition",required=false) String condition,
			HttpServletRequest request, HttpServletResponse response) {
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		dataMap.put("pagesize", 10);
		dataMap.put("pagenum", 1);
		if(condition!=null&&!condition.trim().equals("")){
			dataMap.put("condition", condition);
		}
		
		String data=new Gson().toJson(dataMap);
		
		String method="masget.base.com.companyrelation.getstation";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
		
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	
	/**
	 * 获取合作公司信息
	 * @param condition 关键字
	 * @param request 请求对象
	 * @param response 响应对象
	 */
	@RequestMapping(value="/get",method={RequestMethod.GET,RequestMethod.POST})
	public void get(
			@RequestParam(value="cooperanttypeid",required=false) String cooperanttypeid,
			@RequestParam(value="rcompanyid",required=false) String rcompanyid,
			HttpServletRequest request, HttpServletResponse response) {
		
		Map<String, Object> dataMap=new HashMap<String, Object>();
		
		if(cooperanttypeid!=null&&!cooperanttypeid.equals("")){
			dataMap.put(cooperanttypeid, cooperanttypeid);
		}
		if(rcompanyid!=null&&!rcompanyid.equals("")){
			dataMap.put(rcompanyid, rcompanyid);
		}
		
		String data=new Gson().toJson(dataMap);
		
		String method="masget.base.com.companyrelation.get";
		
        String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, data);
        
		CommomUtil.writeResultBack(request, response, result);
		
		System.out.println(result);
	}
	/**
	 * 查询上级公司
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/reverse/get", method = { RequestMethod.POST,RequestMethod.GET })
	public void getreverse(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		String method="masget.base.com.companyrelation.reverse.get";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
		}catch(Exception e){
			new MgException(10558,"查询上级公司时异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
}
