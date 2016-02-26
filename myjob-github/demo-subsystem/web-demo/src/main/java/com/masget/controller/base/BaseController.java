package com.masget.controller.base;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.masget.util.CommomUtil;
import com.masget.util.FileUpload;

@Controller
public class BaseController {

	/*
	 * 消息
	 * */
	@RequestMapping("/mgchat.do")
	public void mgchat(String type,HttpServletRequest request, HttpServletResponse response)
	{
		JSONObject json = new JSONObject();
		String data = null;
		String result = "服务异常";
		if(type.equals("getrecentmsg")){
			//查询最近聊天记录
			json.put("pagesize",100);
			json.put("pagenum",1);
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.chatlog.getrecentmsg", data);
		}else if(type.equals("getDetail")){
			//查询聊天记录
			json.put("objectid",request.getParameter("objectid"));
			json.put("companyid",request.getParameter("objectcompanyid"));
			json.put("pagesize",100);
			json.put("pagenum",1);
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.chatlog.get", data);
		}else if(type.equals("getscenetresource")){
			//查询角色场景资源
			json.put("scenetypeid",request.getParameter("scenetypeid"));
			json.put("companytypeid",request.getParameter("companytypeid"));
			json.put("roletypeid",request.getParameter("roletypeid"));
			json.put("pagesize",100);
			json.put("pagenum",1);
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.osroleresource.getscenetresource", data);
		}
		writetoPage(request,response,result);
	}

	/*
	 * 商圈
	 * */
	@RequestMapping("/buzCircle.do")
	public void buzCircle(String type,HttpServletRequest request, HttpServletResponse response)
	{
		JSONObject json = new JSONObject();
		String data = null;
		String result = "服务异常";
		if(type.equals("get")){
			//获取商圈列表
			json.put("objectid",request.getParameter("objectid"));
			json.put("objectcompanyid",request.getParameter("objectcompanyid"));
			json.put("pagesize",100);
			json.put("pagenum",1);
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.commercialcircle.get", data);
			
		}else if(type.equals("getmember")){
			//获取商圈下的成员
			json.put("pagesize",100);
			json.put("pagenum",1);
			json.put("commercialcircleid",request.getParameter("commercialcircleid"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.commercialcircle.getmember", data);
		}else if(type.equals("find")){
			//商圈搜索
			String commercialcirclename = request.getParameter("commercialcirclename");
			json.put("commercialcirclename",commercialcirclename );
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.commercialcircle.find", data);
		}else if(type.equals("circleType")){
			//获取商圈类型
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.commericalcircletype.get", data);
		}else if(type.equals("add")){
			//创建新的商圈
			data = request.getParameter("formData");
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.commercialcircle.add", data);
		}else if(type.equals("modify")){
			//修改商圈信息
			data = request.getParameter("formData");
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.commercialcircle.modify", data);
		}else if(type.equals("getbymember")){
			//获取自己加入的商圈
			json.put("commercialcircleid",request.getParameter("commercialcircleid"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.commercialcircle.find", data);
		}else if(type.equals("modifyNickName")){
			//修改自己所在的群信息
			json.put("commercialcircleid",request.getParameter("commercialcircleid"));
			json.put("staffnickname",request.getParameter("staffnickname"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.commercialcircle.businesscard", data);
		}else if(type.equals("join")){
			//添加进商圈
			json.put("commercialcircleid",request.getParameter("commercialcircleid"));
			json.put("commercialcirclemember",request.getParameter("commercialcirclemember"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.commercialcircle.join", data);
		}else if(type.equals("delete")){
			//删除商圈
			json.put("commercialcircleid", request.getParameter("commercialcircleid"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.commercialcircle.delete", data);
		}else if(type.equals("deleteMember")){
			//删除商圈成员
			json.put("commercialcirclememberid", request.getParameter("commercialcirclememberid"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.commercialcirclemember.delete", data);
		}
		writetoPage(request,response,result);
	}
		
	/*
	 * 人脉
	 * */
	@RequestMapping("/contacts.do")
	public void contacts(String type,HttpServletRequest request, HttpServletResponse response)
	{
		JSONObject json = new JSONObject();
		String data = null;
		String result = "服务异常";
		if(type.equals("getall")){
			//获取所有联系人
			json.put("pagesize",100);
			json.put("pageNum",1);
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.addresslist.getall", data);
		}else if(type.equals("group.get")){
			//获取所有分组masget.base.com.addressgroup.getbyscenetype
//			json.put("addressgroupname","sss");
			json.put("pagesize",100);
			json.put("pagenum",1);
			json.put("addressgroupname", request.getParameter("addressgroupname"));
			json.put("scenetypeid", request.getParameter("scenetypeid"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.addressgroup.get", data);
		}else if(type.equals("group.getbyscenetype")){
			//根据场景类型获取分组
			json.put("pagesize",100);
			json.put("pagenum",1);
			json.put("scenetypeid", request.getParameter("scenetypeid"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.addressgroup.getbyscenetype", data);
		}else if(type.equals("list.get")){
			//获取某个分组下的所有联系人
			json.put("addressgroupid",request.getParameter("addressgroupid"));
			json.put("pagesize",request.getParameter("pagesize"));
			json.put("pagenum",request.getParameter("pagenum"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.addresslist.get", data);
		}else if(type.equals("find")){
			//在平台寻找联系人
			json.put("condition",request.getParameter("condition"));
			json.put("companytypeid", request.getParameter("companytypeid"));
			json.put("provinceid",request.getParameter("provinceid"));
			json.put("cityid",request.getParameter("cityid"));
			json.put("areaid",request.getParameter("areaid"));
			json.put("pagesize",100);
			json.put("pagenum",1);
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.companystaff.find", data);
		}else if(type.equals("getbyscenetype")){
			//根据场景和公司类型查找通讯录分组下的人
			json.put("scenetypeid",request.getParameter("scenetypeid"));
			json.put("companytypeid",request.getParameter("companytypeid"));
			json.put("pagesize",100);
			json.put("pagenum",1);
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.addresslist.getbyscenetype", data);			
		}else if(type.equals("addPerson")){
			//添加分组下的联系人
			data = request.getParameter("formData");
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.addresslist.add", data);
		}else if(type.equals("deletePerson")){
			//删除分组通讯人
			json.put("contactlist",request.getParameter("contactlist"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.addresslist.delete", data);
		}else if(type.equals("modifyGroup")){
			//编辑通讯分组
			json.put("addressgroupid",request.getParameter("addressgroupid"));
			json.put("addressgrouppid",request.getParameter("addressgrouppid"));
			json.put("addressgroupname",request.getParameter("addressgroupname"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.addressgroup.modify", data);
		}else if(type.equals("addGroup")){
			//编辑通讯分组
			json.put("addressgrouppid",request.getParameter("addressgrouppid"));
			json.put("addressgroupname",request.getParameter("addressgroupname"));
			json.put("scenetypeid",request.getParameter("scenetypeid"));
			json.put("saasgrouptypeid",request.getParameter("saasgrouptypeid"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.addressgroup.add", data);
		}else if(type.equals("deleteGroup")){
			//删除通讯分组 同时删除分组下的所有人
			json.put("addressgroupid",request.getParameter("addressgroupid"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.addressgroup.delete", data);
		}else if(type.equals("getorganization")){
			json.put("objecttypeid", request.getParameter("objecttypeid"));
			json.put("companyid", request.getParameter("companyid"));
			json.put("stationid", request.getParameter("stationid"));
			json.put("pagesize",request.getParameter("pagesize"));
			json.put("pagenum",request.getParameter("pagenum"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.companyrelation.getorganization", data);
		}else if(type.equals("search")){
			json.put("staffname", request.getParameter("staffname"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.addresslist.find", data);
		}else if(type.equals("dragTo")){
			json.put("addresslistid", request.getParameter("addresslistid"));
			json.put("addressgroupid", request.getParameter("addressgroupid"));
			json.put("contactid", request.getParameter("contactid"));
			json.put("staffnickname", request.getParameter("staffnickname"));
			json.put("remark", request.getParameter("remark"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.addresslist.modify", data);
		}
		writetoPage(request,response,result);
	}
	
	/*
	 * 不在平台联系人
	 * */
	
	@RequestMapping("/contractor.do")
	public void contractor(String type,HttpServletRequest request,HttpServletResponse response){
		JSONObject json = new JSONObject();
		String data = null;
		String result = "服务异常";
		if(type.equals("add")){
			data = request.getParameter("formData");
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.contractorinfo.add", data);
		}else if(type.equals("delete")){
			json.put("contractorinfoid",request.getParameter("contractorinfoid"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.contractorinfo.delete", data);
		}else if(type.equals("list")){
			//查询供应商/客户/渠道商 和 不在平台的商户/客户/渠道商
			json.put("scenetypeid", request.getParameter("scenetypeid"));
			json.put("companyname", request.getParameter("companyname"));
			json.put("mobilephone", request.getParameter("mobilephone"));
			json.put("addressgroupid",request.getParameter("addressgroupid"));
			json.put("companytypeid",request.getParameter("companytypeid"));
			json.put("pagesize",100);
			json.put("pagenum",1);
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.contractorinfo.find", data);
		}
		writetoPage(request,response,result);
	}
	
	/*
	 * 公司员工站点管理
	 * */
	@RequestMapping("/company.do")
	
	public void company(String type,HttpServletRequest request, HttpServletResponse response){
		JSONObject json = new JSONObject();
		String data = null;
		String result = "服务异常";
		if(type.equals("reg")){
			//注册公司
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.company.reg", data);
		
		}else if(type.equals("modify")){
			//修改公司
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.company.modify", data);
		}else if(type.equals("getCompany")){
			//修改公司
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.company.get", data);  
		}else if(type.equals("switch")){
			//切换工作站点
			json.put("newstationid", request.getParameter("newstationid"));
			json.put("newstationname", request.getParameter("newstationname"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.staffstations.switch", data);  
		}else if(type.equals("getswitchable")){
			//查询可切换站点
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.staffstations.getswitchable", data);  
		}else if(type.equals("passwordModify")){
			json.put("oldpassword", request.getParameter("originPwd"));
			json.put("newpassword", request.getParameter("newPwd"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.companystaff.passwordmodify", data);
		}
		writetoPage(request,response,result);
	}
	

	/*
	 * 公共服务接口
	 * */
	@RequestMapping("/commonUtils.do")
	public void commonsUtils(String type,HttpServletRequest request, HttpServletResponse response)
	{
		JSONObject json = new JSONObject();
		String data = null;
		String result = "服务异常";
		
		if(type.equals("district")){
			//获取省市区信息
			json.put("provinceid",request.getParameter("provinceid"));
			json.put("cityid",request.getParameter("cityid"));
			json.put("areaid",request.getParameter("areaid"));
			data = json.toString();
			result = CommomUtil.CallApi(request,"baseService", "masget.base.com.district.get", data);
			
		}else if(type.equals("district_NOS")){
			//获取省市区信息
			json.put("provinceid",request.getParameter("provinceid"));
			json.put("cityid",request.getParameter("cityid"));
			json.put("areaid",request.getParameter("areaid"));
			data = json.toString();
			result = CommomUtil.CallApiWithoutEncrypt(request,"baseService", "masget.base.com.district.find", data);
		}else if(type.equals("companytype")){
			//获取公司类型
//			json.put("addressgroupname","sss");
			data = json.toString();
			result = CommomUtil.CallApiWithoutEncrypt(request,"baseService", "masget.base.com.companytype.get", data);
			
		}else if(type.equals("companytypeindustry")){
			json.put("industryid", request.getParameter("industryid"));
			data = json.toString();
			result = CommomUtil.CallApiWithoutEncrypt(request,"baseService", "masget.base.com.companytypeindustry.get", data);
		}else if(type.equals("industries")){
			//获取行业类型
			data = json.toString();
			result = CommomUtil.CallApiWithoutEncrypt (request, "baseService", "masget.base.com.industry.get", data);
		}else if(type.equals("userResource")){
			//获取用户资源
			json.put("posresourceid",request.getParameter("posresourceid"));
			json.put("childnodetype",100);
			json.put("devicetype",1);
			json.put("ostype",1);
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.userresource.get", data);
		}else if(type.equals("chatServerInfo")){
			InputStream is = null;
			Properties pro = new Properties();
			is = FileUpload.class.getResourceAsStream("/config.properties");
			try {
				pro.load(is);
				json.put("url", pro.getProperty("chat.server.url"));
				json.put("port", pro.getProperty("chat.server.port"));
				json.put("path", pro.getProperty("chat.server.path"));
				result = "{\"data\": "+json.toString()+",\"ret\": 0}";
			} catch (IOException e) {
				result = "{\"message\": \"失败\",\"ret\": 10}";
			}
		}else if(type.equals("sendEmail")){
			//发送Email
			json.put("mailAddress",request.getParameter("mailAddress"));
			json.put("mailTitle",request.getParameter("mailTitle"));
			json.put("mailContent",request.getParameter("mailContent"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.userresource.get", data);
		}else if(type.equals("sendEmailForPwd")){
			json.put("mailAddress",request.getParameter("mailAddress"));
			json.put("mailTitle",request.getParameter("mailTitle"));
			json.put("mailContent",request.getParameter("mailContent"));
			json.put("key",request.getParameter("key"));
			data = json.toString();
			result = CommomUtil.CallApiWithoutEncrypt(request, "baseService", "masget.base.com.sendMail.send", data);
		}else if(type.equals("resetPwd")){
			json.put("newpassword",request.getParameter("newpassword"));
			json.put("key",request.getParameter("key"));
			data = json.toString();
			result = CommomUtil.CallApiWithoutEncrypt(request, "baseService", "masget.base.com.sendMail.resetPassword", data);
		}else if(type.equals("businessTypes")){
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.ordertype.get", data);
		}else if(type.equals("orderState")){
			json.put("ordertypeid",request.getParameter("ordertypeid"));
			data = json.toString();
			result = CommomUtil.CallApi(request, "baseService", "masget.base.com.orderstate.get", data);
		}
		writetoPage(request,response,result);
	}
	
	
	/*
	 * saas服务配置
	 * */
	@RequestMapping("/saas.do")
	public void saas(String type,HttpServletRequest request, HttpServletResponse response)
	{
		JSONObject json = new JSONObject();
		String data = null;
		String result = "服务异常";
		
		if(type.equals("addressgrouptype")){
			//saas分组类型查询
			json.put("saasid",request.getParameter("companytypeid"));
			data = json.toString();
			result = CommomUtil.CallApi(request,"baseService", "masget.base.com.saasaddressgrouptype.get", data);
		}
		
		writetoPage(request,response,result);
	}
	
	@RequestMapping("/writeCacheData.do")
	public void writeCacheData(HttpServletRequest request, HttpServletResponse response){
		String cachedData = request.getParameter("cachedData");
		File file = new File("D:\\masget\\svn\\masget4.0\\masgetweb Maven Webapp\\src\\main\\webapp\\base\\assets\\cachedData.json");
		if(file.isFile()){
			FileWriter fw = null;
			try {
			fw = new FileWriter(file);
			BufferedWriter out = new BufferedWriter(fw);
			out.write(cachedData, 0, cachedData.length());
			out.close();
			} catch (IOException e) {
				writetoPage(request,response,"{\"message\": \"失败\",\"ret\": 10}");
			}
		}
		writetoPage(request,response,"{\"message\": \"成功\",\"ret\": 0}");
	}
	
	@RequestMapping("/fisReceiver.do")
	public void fisReceiver(HttpServletRequest request, HttpServletResponse response){
		
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
