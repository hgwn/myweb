package com.masget.controller.base;

import com.google.gson.Gson;
import com.masget.command.security.Base64Method;
import com.masget.command.security.MD5Util;
import com.masget.provider.webinterface.base;
import com.masget.util.CommomUtil;
import com.masget.util.FileUpload;
import com.masget.util.ResetPasswordUtil;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

//import org.jasig.cas.client.authentication.AttributePrincipal;

@Controller
public class BaseImpl
{
	private static final Logger log = LoggerFactory.getLogger(BaseImpl.class);

	/**
	 * 发邮件找回密码 data{"mailAddress":"test@masget.com"}
	 * @param request
	 * @param response
	 */
	@RequestMapping("base/sendMail.do")
	public void sendMail(HttpServletRequest request, HttpServletResponse response)
	{
		String data = request.getParameter("data");
		if (data == null || "".equals(data))
		{
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "传入数据为空！"));
			return;
		}
		JSONObject json = JSONObject.fromObject(data);
		String email = json.get("mailAddress").toString();
		String check = "^\\s*\\w+(?:\\.{0,1}[\\w-]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\\.[a-zA-Z]+\\s*$";
		Pattern regex = Pattern.compile(check);
		Matcher matcher = regex.matcher(email);
		if (!matcher.matches())
		{
			return;
		}
		try
		{
			// {"mailAddress":"test@masget.com","mailTitle":"邮件的标题","mailContent":"邮件内容","key":"uuid码email_邮箱地址"}
			// 这里邮件的内容，发一个连接还是。。 链接的有效性时间，待沟通
			String mailTitle = "重设您的密码(重要)";
			String mailContent = "Hi,亲爱的用户:<br/>";
			mailContent += "&nbsp;&nbsp;您好！<br/><br/>";
			mailContent += "&nbsp;&nbsp;&nbsp;&nbsp;如果您需要重设密码，请点击以下链接进行修改：<br/><br/>";
			// uuid生成key
			String uuid = UUID.randomUUID().toString();
			// href=url?key=uuid值email_邮箱地址
			String key = uuid + "email_" + email;
			mailContent += "&nbsp;&nbsp;&nbsp;&nbsp;<a href='" + ResetPasswordUtil.resetPasswordHref + "?key="
					+ Base64Method.EncryptBase64(key) + "'>" + ResetPasswordUtil.resetPasswordHref + "?key="
					+ Base64Method.EncryptBase64(key) + "</a><br/>";
			mailContent += "&nbsp;&nbsp;&nbsp;&nbsp;(如果您无法点击此链接，请将它复制到浏览器地址栏后访问)<br/><br/>";
			// 邮箱链接的有效性
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日HH点mm分");
			long outtime = System.currentTimeMillis() + ResetPasswordUtil.outtime * 24 * 60 * 60 * 1000;// 设置过期过期
			mailContent += "&nbsp;&nbsp;&nbsp;&nbsp;该链接将在 " + sdf.format(outtime) + " 过期，如果链接过期，请重新打开系统的   <a href='"
					+ ResetPasswordUtil.forgetpassword + "'>找回密码</a>  页面，再次发送邮件。<br/><br/>";
			mailContent += "&nbsp;&nbsp;&nbsp;&nbsp;如果您没有发起任何修改密码的操作，可以忽略本条信息，原密码将不会被修改。<br/><br/>";
			mailContent += ResetPasswordUtil.systemAddress;
			json.put("mailTitle", mailTitle);
			json.put("mailContent", mailContent);
			json.put("key", key);
			data = Base64Method.EncryptBase64(json.toString());
			base service = (base) WebApplicationContextUtils
					.getWebApplicationContext(request.getSession().getServletContext())
					.getBean(CommomUtil.BASE_SERVICE);
			String result = service.doPostForWeb("", "masget.base.com.sendMail.send", data);
			CommomUtil.writeResultBack(request, response, result);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "系统繁忙，请稍后重试！"));
		}

	}

	/**
	 * 重置密码 data{"key":"uuid码email_邮箱地址","newpassword":xxx}
	 * @param request
	 * @param response
	 */
	@RequestMapping("base/resetPassword.do")
	public void resetPassword(HttpServletRequest request, HttpServletResponse response)
	{
		String data = request.getParameter("data");
		if (data == null || "".equals(data))
		{
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "传入数据为空"));
			return;
		}
		try
		{
			data = Base64Method.EncryptBase64(data);
			base service = (base) WebApplicationContextUtils
					.getWebApplicationContext(request.getSession().getServletContext())
					.getBean(CommomUtil.BASE_SERVICE);
			String result = service.doPostForWeb("", "masget.base.com.sendMail.resetPassword", data);
			CommomUtil.writeResultBack(request, response, result);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "系统繁忙，请稍后重试！"));
		}
	}

	/**
	 * 点击注册时，获取公司类型
	 * @param request
	 * @param response
	 */
	@RequestMapping("base/getPaymenttype.do")
	public void getPaymenttype(HttpServletRequest request, HttpServletResponse response)
	{
		String data = request.getParameter("data");
		try
		{
			data = Base64Method.EncryptBase64(data);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		base service = (base) WebApplicationContextUtils
				.getWebApplicationContext(request.getSession().getServletContext()).getBean(CommomUtil.BASE_SERVICE);
		String result = service.doPostForWeb("", "masget.base.com.companytype.get", data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 发送短信
	 * @param request
	 * @param response
	 */
	@RequestMapping("base/sendSMS.do")
	public void sendSMS(HttpServletRequest request, HttpServletResponse response)
	{
		String data = request.getParameter("data");
		if (data == null || "".equals(data))
		{
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "传入数据为空！"));
			return;
		}
		try
		{
			data = Base64Method.EncryptBase64(data.toString());
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		base service = (base) WebApplicationContextUtils
				.getWebApplicationContext(request.getSession().getServletContext()).getBean(CommomUtil.BASE_SERVICE);
		// 如果用户存在就不发短信，并提示用户
		String userResult = service.doPostForWeb("", "masget.base.com.companystaff.uservalidation", data);
		JSONObject resultObj = JSONObject.fromObject(userResult);
		boolean isExist = JSONObject.fromObject(resultObj.get("data")).getBoolean("isExist");
		if (isExist)
		{
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "用户已注册！"));
			return;
		}
		String result = service.doPostForWeb("", "masget.base.com.sendsms.sendVerificationCode", data);
		CommomUtil.writeResultBack(request, response, result);

	}

	/**
	 * 注册时验证注册用户是否存在
	 * @param request
	 * @param response
	 */
	@RequestMapping("base/findLoginName.do")
	public void findLoginName(HttpServletRequest request, HttpServletResponse response)
	{
		String data = request.getParameter("data");
		if (data == null || "".equals(data))
		{
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "传入数据为空！"));
			return;
		}
		try
		{
			data = Base64Method.EncryptBase64(data);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		base service = (base) WebApplicationContextUtils
				.getWebApplicationContext(request.getSession().getServletContext()).getBean(CommomUtil.BASE_SERVICE);
		String result = service.doPostForWeb("", "masget.base.com.companystaff.uservalidation", data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 公司注册
	 * @param request
	 * @param response
	 */
	@RequestMapping("base/register_past.do")
	public void register_past(HttpServletRequest request, HttpServletResponse response)
	{
		String data = request.getParameter("data");
		if (data == null || "".equals(data))
		{
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "传入数据为空！"));
			return;
		}
		// 判断手机验证码是否过时或是否存在
		HttpSession session = request.getSession(true);
		String smsCode = (String) session.getAttribute("smsCode");
		String mobilephone = (String) session.getAttribute("mobilephone");
		Long currTime = (Long) session.getAttribute("currTime");
		Long nowTime = System.currentTimeMillis();
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		if (currTime == null)
		{
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "系统繁忙！"));
			return;
		}
		Date curr = new Date(currTime);
		Date now = new Date(nowTime);
		// 比较时间差是否在60s内
		try
		{
			Date currDate = df.parse(df.format(curr));
			Date nowDate = df.parse(df.format(now));
			Long timeDifference = (nowDate.getTime() - currDate.getTime()) / 1000;// 相差多少秒
			// 设置短信验证码有效时间为60s
			if (timeDifference > 60)
			{
				CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "手机验时间已过，请重新发送！"));
				return;
			}
		}
		catch (ParseException ex)
		{
			ex.printStackTrace();
		}

		if (smsCode == null || "".equals(smsCode) || mobilephone == null || "".equals(mobilephone))
		{
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "手机验证码已失效！"));
			return;
		}
		// 手机验证码是否相同
		JSONObject obj = JSONObject.fromObject(data);
		String code = obj.get("smsCode").toString();
		String phone = obj.getString("mobilephone").toString();
		if (!smsCode.equals(code) || !mobilephone.equals(phone))
		{
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "手机验证码错误！"));
			return;
		}
		try
		{
			data = Base64Method.EncryptBase64(data);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		ApplicationContext ctx = WebApplicationContextUtils
				.getWebApplicationContext(request.getSession().getServletContext());
		base service = (base) ctx.getBean(CommomUtil.BASE_SERVICE);

		String result = service.doPostForWeb("", "masget.base.com.companystaff.reg", data);
		CommomUtil.writeResultBack(request, response, result);

	}

	@RequestMapping("base/register.do")
	public void register(HttpServletRequest request, HttpServletResponse response)
	{
		String result = "服务异常";
		String data = request.getParameter("data");
		result = CommomUtil.CallApiWithoutEncrypt(request, "baseService", "masget.base.com.companystaff.reg", data);
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 判断是否出现登录验证码
	 * @param request
	 * @param response
	 */
	@RequestMapping("base/appearImageCode.do")
	public void appearImageCode(HttpServletRequest request, HttpServletResponse response)
	{
		HttpSession session = request.getSession();
		Integer loginErrorCount = (Integer) session.getAttribute("login_error_count");
		if (loginErrorCount == null)
		{
			// 没有登录过
			session.setAttribute("login_error_count", 1);// 设置下登录错误的次数
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(0, "第一次访问！"));
			return;
		}
		else
		{
			session.setAttribute("login_error_count", ++loginErrorCount);
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "第" + loginErrorCount + "次访问！"));
		}
	}

	@RequestMapping("base/codeValidation.do")
	public void codeValidation(HttpServletRequest request, HttpServletResponse response)
	{
		HttpSession session = request.getSession();
		String imageCode = (String) session.getAttribute("imageCode");
		String code = request.getParameter("code");
		if (!code.equalsIgnoreCase(imageCode) || code == null || "".equals(code))
		{
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(14, "验证码不正确！"));
		}
		else
		{
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(0, "验证码正确！"));
		}
	}

	@RequestMapping("base/loginOut.do")
	public void loginOut(HttpServletRequest request, HttpServletResponse response)
	{
		request.getSession().removeAttribute("user_login_data");
		CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(0, "success!"));
	}

	@RequestMapping("base/login.do")
	public void login(HttpServletRequest request, HttpServletResponse response)
	{
		try
		{
			HttpSession session = request.getSession();
			String imageCode = (String) session.getAttribute("imageCode");
			Integer loginErrorCount = (Integer) session.getAttribute("login_error_count");
			if (loginErrorCount == null)
			{
				// 没有登录过
				session.setAttribute("login_error_count", 1);// 设置下登录错误的次数
			}

			String data = request.getParameter("data");
			if (data == null || "".equals(data))
			{
				session.setAttribute("login_error_count", ++loginErrorCount);// 设置下登录错误的次数
				CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "传入数据为空。"));
				return;
			}
			JSONObject json = JSONObject.fromObject(data);
			if (json.get("loginname") == null || "".equals(json.get("loginname").toString())
					|| json.get("loginpwd") == null || "".equals(json.get("loginpwd").toString()))
			{
				session.setAttribute("login_error_count", ++loginErrorCount);// 设置下登录错误的次数
				CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "用户名或密码不能为空！"));
				return;
			}
			// 用户输入的
			String code = "";
			if (null != json.get("code"))
			{
				code = json.get("code").toString();
			}

			if (null != loginErrorCount && loginErrorCount > 1)
			{
				// 验证码验证
				if (!code.equalsIgnoreCase(imageCode) || code == null || "".equals(code))
				{
					session.setAttribute("login_error_count", ++loginErrorCount);// 设置下登录错误的次数
					CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "验证码不正确！"));
					return;
				}
			}
			
			try
			{
				data = Base64Method.EncryptBase64(data);
			}
			catch (Exception e)
			{
				e.printStackTrace();
				session.setAttribute("login_error_count", ++loginErrorCount);// 设置下登录错误的次数
			}
			ApplicationContext ctx = WebApplicationContextUtils
					.getWebApplicationContext(request.getSession().getServletContext());
			base service = (base) ctx.getBean(CommomUtil.BASE_SERVICE);
			String result = service.doPostForWeb("", "masget.base.com.user.login", data);
			JSONObject obj = JSONObject.fromObject(result);
			if (obj.getInt("ret") == 0)
			{
				session.removeAttribute("login_error_count");
				obj.put("login_error_count", loginErrorCount);
				session.setAttribute("session", obj.getString("session"));
				session.setAttribute("appkey", obj.getString("appkey"));
				// obj.remove("session");
				obj.remove("appkey");
				session.setAttribute("user_login_data", obj.toString());
				result = obj.toString();
			}
			else
			{
				session.setAttribute("login_error_count", ++loginErrorCount);// 设置下登录错误的次数
			}
			CommomUtil.writeResultBack(request, response, result);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "服务繁忙！请稍后重试。"));
			throw new RuntimeException("登录失败" + e.getMessage(), e);
		}
	}

	@RequestMapping("base/login1.do")
	public void login1(HttpServletRequest request, HttpServletResponse response)
	{
		JSONObject json = new JSONObject();
		json.put("loginname", "15889824643");
		json.put("loginpwd", MD5Util.string2MD5("888888"));
		json.put("devicename", "pc");
		json.put("devicetype", 1);

		String data = json.toString();
		if (data == null)
		{
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "传入数据为空。"));
		}
		try
		{
			data = Base64Method.EncryptBase64(data);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		System.out.println("--login-----" + data);
		ApplicationContext ctx = WebApplicationContextUtils
				.getWebApplicationContext(request.getSession().getServletContext());
		base service = (base) ctx.getBean(CommomUtil.BASE_SERVICE);
		String result = service.doPostForWeb("", "masget.base.com.user.login", data);
		JSONObject obj = JSONObject.fromObject(result);
		if (obj.getInt("ret") == 0)
		{
			HttpSession session = request.getSession(true);
			session.setAttribute("session", obj.getString("session"));
			session.setAttribute("appkey", obj.getString("appkey"));
			obj.remove("session");
			obj.remove("appkey");
			session.setAttribute("user_login_data", obj.toString());
			result = obj.toString();
		}
		CommomUtil.writeResultBack(request, response, result);
	}

	@RequestMapping("base/login2.do")
	public void login2(HttpServletRequest request, HttpServletResponse response)
	{
		JSONObject json = new JSONObject();
		json.put("loginname", "jsbzc001");
		json.put("loginpwd", MD5Util.string2MD5("888888"));
		json.put("devicename", "pc");
		json.put("devicetype", 1);

		String data = json.toString();
		if (data == null)
		{
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "传入数据为空。"));
		}
		try
		{
			data = Base64Method.EncryptBase64(data);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		System.out.println("--login-----" + data);
		ApplicationContext ctx = WebApplicationContextUtils
				.getWebApplicationContext(request.getSession().getServletContext());
		base service = (base) ctx.getBean(CommomUtil.BASE_SERVICE);
		String result = service.doPostForWeb("", "masget.base.com.user.login", data);
		JSONObject obj = JSONObject.fromObject(result);
		if (obj.getInt("ret") == 0)
		{
			HttpSession session = request.getSession(true);
			session.setAttribute("session", obj.getString("session"));
			session.setAttribute("appkey", obj.getString("appkey"));
			obj.remove("session");
			obj.remove("appkey");
			session.setAttribute("user_login_data", obj.toString());
			result = obj.toString();
		}
		CommomUtil.writeResultBack(request, response, result);
	}

	@RequestMapping("base/test.do")
	public void test(HttpServletRequest request, HttpServletResponse response)
	{
		String data = "";
		JSONObject obj = new JSONObject();
		obj.put("enableflag", 1);

		String result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, "masget.base.com.chargepaytype.get",obj.toString());

		// JSONObject resultObj = JSONObject.fromObject(result);

		CommomUtil.writeResultBack(request, response, result);

	}

	@RequestMapping("base/getSession.do")
	public void getSession(HttpServletRequest request, HttpServletResponse response)
	{
		HttpSession httpSession = request.getSession(false);
		String result = null;
		if (null != httpSession)
		{
			result = (String) httpSession.getAttribute("user_login_data");
			if (result == null)
			{
				CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "请先登录"));
				return;
			}
			CommomUtil.writeResultBack(request, response, result);
		}
		else
		{
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "请先登录"));
		}
	}

	@RequestMapping("base/setSession.do")
	public void setSession(HttpServletRequest request, HttpServletResponse response)
	{
		HttpSession httpSession = request.getSession(false);

		if (null != httpSession)
		{
			httpSession.setAttribute("user_login_data", request.getParameter("session"));
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(0, "修改成功"));
		}
		else
		{
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "请先登录"));
		}
	}

	@RequestMapping("base/fileUpload.do")
	public void fileUpload(HttpServletRequest request, HttpServletResponse response)
	{
		String result = CommomUtil.FileUpLoadAndGetParam(request, response);
		CommomUtil.writeResultBack(request, response, result);
	}

	@RequestMapping("base/pdaFileUpload.do")
	public void pdaFileUpload(HttpServletRequest request, HttpServletResponse response) {
		String result = CommomUtil.FileUpLoadAndGetParam(request, response, FileUpload.emFileType.PDA_FILE_UPLOAD);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	@RequestMapping("base/fileDelete.do")
	public void fileDelete(HttpServletRequest request, HttpServletResponse response)
	{
		String fileName = request.getParameter("fileName");
		log.info("获取删除文件的文件名:[{}]",fileName);
		String result = FileUpload.fileDelete(fileName);
		CommomUtil.writeResultBack(request, response, result);
	}

	@RequestMapping("base/fileUploadStatus.do")
	public void fileUploadStatus(HttpServletRequest request, HttpServletResponse response)
	{
		response.setContentType("text/html;charset=utf-8");
		PrintWriter out = null;
		try
		{
			out = response.getWriter();
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		HttpSession session = request.getSession();

		String status = (String) session.getAttribute("read");// 获取上传进度百分比
		System.out.println("FileUploadStatus: " + status);
		out.println(status);// 响应
	}

	/**
	 * 修改员工信息发送信息
	 * @author lgn
	 * @param request
	 * @param response
	 */
	@RequestMapping("base/modifySendSms.do")
	public void sendSms(@RequestParam(value = "mobilephone", required = true) String mobilephone,
			HttpServletRequest request, HttpServletResponse response)
	{

		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("mobilephone", mobilephone);
		String data = new Gson().toJson(dataMap);
		String method = "masget.base.com.sendsms.sendVerificationCode";
		String result = "";
		try
		{
			String SMSdata = Base64Method.EncryptBase64(data);
			// result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,method, SMSdata);
			base service = (base) WebApplicationContextUtils
					.getWebApplicationContext(request.getSession().getServletContext())
					.getBean(CommomUtil.BASE_SERVICE);
			result = service.doPostForWeb("", method, SMSdata);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		CommomUtil.writeResultBack(request, response, result);
	}

	/**
	 * 修改员工信息验证
	 * @author lgn
	 * @param request
	 * @param response
	 */
	@RequestMapping("base/verification.do")
	public void verification(@RequestParam(value = "data", required = true) String data, HttpServletRequest request,
			HttpServletResponse response)
	{

		JSONObject obj = JSONObject.fromObject(data);
		String method = "masget.base.com.sendsms.verificationCode";
		String result = "";
		try
		{
			String SMSdata = Base64Method.EncryptBase64(obj.toString());
			// result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE,method, SMSdata);
			base service = (base) WebApplicationContextUtils
					.getWebApplicationContext(request.getSession().getServletContext())
					.getBean(CommomUtil.BASE_SERVICE);
			result = service.doPostForWeb("", method, SMSdata);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	
	/**
	 * cas登录成功后调用些方法,查询用户信息返回给页面
	 * @author HuangYongFeng
	 * @createtime 2015年9月16日
	 * @param request
	 * @param response
	 */
	@RequestMapping("base/session.do")
	public void session(HttpServletRequest request, HttpServletResponse response)
	{
		try
		{
			String data = request.getParameter("data");
			//通过这个类获取cas服务器登录后的返回信息
//	    	AttributePrincipal principal = (AttributePrincipal) request.getUserPrincipal();
//	    	if (principal == null)
//			{
//	    		CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "用户名或密码不正确."));
//				throw new RuntimeException("登录失败,用户名或密码不正确.");
//			}
//	    	String loginname = principal.getName();
//	    	JSONObject json = JSONObject.fromObject(data);
			JSONObject json = new JSONObject();
			json.put("devicename", "pc");
			json.put("devicetype", 1);
	    	json.put("loginname", "15989129182");
			data = Base64Method.EncryptBase64(json.toString());
			ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(request.getSession().getServletContext());
			base service = (base) ctx.getBean(CommomUtil.BASE_SERVICE);
			String result = service.doPostForWeb("", "masget.base.com.user.getlogin",data);
			JSONObject obj = JSONObject.fromObject(result);
			if (obj.getInt("ret") == 0)
			{
				HttpSession session = request.getSession();
				session.setAttribute("session", obj.getString("session"));
				session.setAttribute("appkey", obj.getString("appkey"));
				session.setAttribute("user_login_data", obj.toString());
				// obj.remove("session");
				obj.remove("appkey");
				CommomUtil.writeResultBack(request, response,obj.toString());
			}
			else
			{
				CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "服务繁忙,请稍后重试."));
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
			CommomUtil.writeResultBack(request, response, CommomUtil.RetResponse(10, "服务繁忙,请稍后重试."));
			throw new RuntimeException("登录失败." + e.getMessage(), e);
		}
	}
	
	
}
