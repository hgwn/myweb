package com.masget.controller.jobSchedule;

import java.io.PrintWriter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.masget.util.CommomUtil;

@Controller
public class JobScheduleController {

	/*
	 * 消息
	 * */
	@RequestMapping("/jobSchedule.do")
	public void jobSchedule(String type,HttpServletRequest request, HttpServletResponse response)
	{
		JSONObject json = new JSONObject();
		String data = null;
		String result = "服务异常";
		if(type.equals("createnew")){
			//创建任务
			result = CommomUtil.CallApi(request, "jobschedulingService", "masget.jobscheduling.com.config.createnew", request.getParameter("data"));
		}else if(type.equals("list")){
			//获取任务
			data = json.toString();
			result = CommomUtil.CallApi(request, "jobschedulingService", "masget.jobscheduling.com.config.query", data);
		}else if(type.equals("detail")){
			//查看任务
			json.put("job_id",request.getParameter("jobId"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "jobschedulingService", "masget.jobscheduling.com.config.queryentity", data);
		}else if(type.equals("del")){
			//删除任务
			json.put("ids",request.getParameter("ids"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "jobschedulingService", "masget.jobscheduling.com.config.delete", data);
		}else if(type.equals("run")){
			//立即运行一次
			json.put("job_id",request.getParameter("jobId"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "jobschedulingService", "masget.jobscheduling.com.config.runnow", data);
		}else if(type.equals("use")){
			//启用任务
			json.put("job_id",request.getParameter("jobId"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "jobschedulingService", "masget.jobscheduling.com.config.usejob", data);
		}else if(type.equals("stop")){
			//停用任务
			json.put("job_id",request.getParameter("jobId"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "jobschedulingService", "masget.jobscheduling.com.config.stopjob", data);
		}else if(type.equals("pause")){
			//暂停任务
			json.put("job_id",request.getParameter("jobId"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "jobschedulingService", "masget.jobscheduling.com.config.pause", data);
		}else if(type.equals("resume")){
			//恢复任务
			json.put("job_id",request.getParameter("jobId"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "jobschedulingService", "masget.jobscheduling.com.config.resume", data);
		}else if(type.equals("update")){
			//更新任务
			json.put("job_id",request.getParameter("jobId"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "jobschedulingService", "masget.jobscheduling.com.config.updatejob", data);
		}else if(type.equals("updatejobcron")){
			//更新任务时间表达式
			json.put("job_id",request.getParameter("jobId"));
			json.put("job_cron",request.getParameter("jobCron"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "jobschedulingService", "masget.jobscheduling.com.config.updatejobcron", data);
		}else if(type.equals("writeback")){
			//回写作业实际完成时间
			json.put("job_id",request.getParameter("jobId"));
			json.put("end_time",request.getParameter("endTime"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "jobschedulingService", "masget.jobscheduling.com.config.writeback", data);
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
