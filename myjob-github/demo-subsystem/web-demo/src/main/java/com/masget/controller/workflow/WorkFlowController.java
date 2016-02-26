package com.masget.controller.workflow;

import java.io.PrintWriter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.masget.util.CommomUtil;

@Controller
public class WorkFlowController {
	
	@RequestMapping("/workflow.do")
	public void mgchat(String type,HttpServletRequest request, HttpServletResponse response)
	{
		JSONObject json = new JSONObject();
		String data = null;
		String result = "服务异常";
		if(type.equals("processmodelsel")){
			//查询平台流程列表
			data = json.toString();
			result = CommomUtil.CallApi(request, "workflowService", "masget.workflow.com.config.processmodelsel", data);
		}else if(type.equals("processsel")){
			//查询用户流程列表
			json.put("company_id", request.getParameter("companyid"));
			json.put("business_id", request.getParameter("businessid"));
			json.put("pagesize",100);
			json.put("pagenum",1);
			data = json.toString();
			result = CommomUtil.CallApi(request, "workflowService", "masget.workflow.com.config.processsel", data);
		}else if(type.equals("processnodelsel")){
			//查询平台使用流程的节点列表
			json.put("business_id", request.getParameter("businessid"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "workflowService", "masget.workflow.com.config.processnodelsel", data);
		}else if(type.equals("userprocessnodes")){
			//查询用户使用使用流程的节点列表
			json.put("user_process_id", request.getParameter("user_process_id"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "workflowService", "masget.workflow.com.config.nodebasesel", data);
		}else if(type.equals("save")){
			//保存用户流程配置
			data = request.getParameter("data");
			result = CommomUtil.CallApi(request, "workflowService", "masget.workflow.com.config.save", data);
		}else if(type.equals("delete")){
			//删除用户流程配置
			json.put("user_process_id",request.getParameter("user_process_id"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "workflowService", "masget.workflow.com.config.delete", data);
		}else if(type.equals("getUsers")){
			//删除用户流程配置
			json.put("companystaff",request.getParameter("users"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.companystaff.batch.get", data);
		}
		writetoPage(request,response,result);
	}

	public void writetoPage(HttpServletRequest request, HttpServletResponse response, String result) {
		try {
			response.setCharacterEncoding("UTF-8");
			PrintWriter out = response.getWriter();
			out.print(result);
			out.flush();
			out.close();

		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}
}
