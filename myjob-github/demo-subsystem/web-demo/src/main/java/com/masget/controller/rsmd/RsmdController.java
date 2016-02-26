package com.masget.controller.rsmd;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.masget.util.CommomUtil;

@Controller
public class RsmdController {
	
	@RequestMapping("/rsmd.do")
	public void rsmd(String type,HttpServletRequest request, HttpServletResponse response)
	{
		JSONObject json = new JSONObject();
		String data = null;
		String result = "服务异常";
		if(type.equals("joblist")){
			//获取任务列表
			json.put("userid", request.getParameter("staffid"));
			json.put("tasktype", request.getParameter("tasktype"));
			json.put("companyid", request.getParameter("companyid"));
			json.put("ordertypeid", request.getParameter("ordertypeid"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "rsmdService", "masget.rsmd.com.joblist.get", data);
		}
		writetoPage(request,response,result);
	}
	
	@RequestMapping("/cors.do")
	public void cors(String type,HttpServletRequest request, HttpServletResponse response)
	{
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Credentials","true");
		response.setHeader("Access-Control-Allow-Methods", "POST");
		response.setCharacterEncoding("UTF-8");
		PrintWriter out;
		try {
			out = response.getWriter();
			out.print("{}");
			out.flush();
			out.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
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
