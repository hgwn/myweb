package com.masget.util;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.jasperreports.engine.JRExporterParameter;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JsonDataSource;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.JRPdfExporterParameter;
import net.sf.jasperreports.engine.export.JRXlsExporter;
import net.sf.jasperreports.engine.export.JRXlsExporterParameter;
import net.sf.jasperreports.engine.query.JsonQueryExecuterFactory;
import net.sf.json.JSONObject;

import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.masget.security.AesEncryption;
import com.masget.security.Base64Method;
import com.masget.security.MD5Util;


public class CommomUtil
{

	public final static String BASE_SERVICE = "baseService";
	public final static String LOGISTICS_SERVICE = "logisticsService";
	public final static String ENTERPRISE_SERVICE = "enterpriseService";
	public final static String SETTLEMENT_SERVICE = "settlementService";
	public final static String PAY_SERVICE = "payService";
	public final static String CHARGEBACK_SERVICE = "chargebackService";
	public final static String TRUSTFUNDS_SERVICE = "trustfundsService";
	public final static String RSMD_SERVICE = "rsmdService";
	public final static String WALLET_SERVICE = "walletService";
	public final static String ACCOUNT_SERVICE = "accountService";
	public final static String FINANCE_SERVICE = "financeService";
	public final static String PREPAYWALLET_SERVICE = "prepaywalletService";

	public static void writeResultBack(HttpServletRequest request, HttpServletResponse response, String data)
	{
		writeResultBack(request, response, data, false);
	}

	public static void writeResultBack(HttpServletRequest request, HttpServletResponse response, String data, boolean isJSONP)
	{
		try
		{
			/* response.setContentType("text/json; charset=utf-8"); */
			response.setCharacterEncoding("UTF-8");
			// response.setContentType("text/html;charset=utf-8");
			PrintWriter out = response.getWriter();
			String callback = request.getParameter("callback");
			if (callback != null)
			{
				// String callback = request.getParameter("callback");//callback=JSON_CALLBACK
				data = callback + "(" + data + ")";
			}
			System.out.print(data);
			out.write(data);
			out.flush();
			out.close();
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
	}

	public static void writetoPage(HttpServletRequest request, HttpServletResponse response, String result)
	{
		try
		{
			response.setCharacterEncoding("UTF-8");
			PrintWriter out = response.getWriter();
			out.print(result);
			out.flush();
			out.close();

		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	public static boolean CheckSession(HttpSession httpSession)
	{
		if (httpSession == null)
		{
			return false;
		}
		String session = (String) httpSession.getAttribute("session");
		String appkey = (String) httpSession.getAttribute("appkey");
		if (session == null || appkey == null)
		{
			return false;
		}
		return true;
	}

	public static String CallApi(HttpServletRequest request, String serviceName, String method, String data)
	{
		HttpSession httpSession = request.getSession(false);
		if (!CheckSession(httpSession))
		{
			return RetResponse(1000, "请先登录!");
		}
		String session = (String) httpSession.getAttribute("session");
		String appkey = (String) httpSession.getAttribute("appkey");

		String encryptiondata = "";
		try
		{
			encryptiondata = AesEncryption.Encrypt(data, appkey, appkey);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return RetResponse(10, "AES加密失败");
		}

		ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(request.getSession().getServletContext());
		mginterface myservice = (mginterface) ctx.getBean(serviceName);
		return myservice.doPostForWeb(session, method, encryptiondata);

		/*
		 * if(serviceName.equals("baseService")){ return CallBaseService(request, session, method,
		 * encryption); } else if(serviceName.equals("logisticsService")){ return
		 * CallLogisticsService(request, session, method, encryption); } else
		 * if(serviceName.equals("enterpriseService")){ return CallEnterpriseService(request,
		 * session, method, encryption); } else if(serviceName.equals("settlementService")){ return
		 * CallSettlementService(request, session, method, encryption); }else
		 * if(serviceName.equals("rsmdService")){ return
		 * CallRsmdService(request,session,method,encryption); }else
		 * if(serviceName.equals("payService")){ return
		 * CallPayService(request,session,method,encryption); }else
		 * if(serviceName.equals("tunnelmanagerService")){ return
		 * CallTunnelmanagerService(request,session,method,encryption); }else
		 * if(serviceName.equals("workflowService")){ return
		 * CallWorkflowService(request,session,method,encryption); }else{ return ""; }
		 */
	}
	
	public static String CallApiHttp(HttpServletRequest request , String serviceName, String method, String data)
	{
		HttpSession httpSession = request.getSession(false);
		if(!CheckSession(httpSession)){
			return RetResponse(1000, "请先登录!");
		}
		String session = (String) httpSession.getAttribute("session");
		String appkey = (String) httpSession.getAttribute("appkey");
		
		String encryptiondata = "";
		try {
			encryptiondata = AesEncryption.Encrypt(data, appkey, appkey);
		} catch (Exception e) {
			e.printStackTrace();
			return RetResponse(10, "AES加密失败");
		}
        JSONObject params = new JSONObject();
        params.put("data", encryptiondata);
        params.put("method", method);
        params.put("appid", "masget");
        params.put("format", "json");
        params.put("v", "1.0");
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
        String timestamp = df.format(new Date());
        params.put("timestamp", timestamp);
        //TODO: 在这里获取session和做MD5加密
        String md5sign = MD5Util.string2MD5("masget" + method + "json"
                + data + "1.0" + timestamp
                + session
                + appkey).toLowerCase();

        params.put("session", session);
        params.put("sign", md5sign);
        
        String result = "";
        result = ApiUtil.MethodInvoke("https://192.168.87.145:7373/openapi/rest", "masget", session, appkey, method, data);
//		try {
////			result = HttpsUtil.doSslGet("https://127.0.0.1:7373/openapi/rest?data="+encryptiondata+"&method="+method+"&appid=masget&format=json&v=1.0&session="+session+"&sign="+md5sign, "utf-8");
//		} catch (KeyManagementException e) {
//			e.printStackTrace();
//		} catch (NoSuchAlgorithmException e) {
//			e.printStackTrace();
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
		
		return result;
	}

	public static String CallApiWithoutEncrypt(HttpServletRequest request, String serviceName, String method, String data)
	{
		String datas = "";
		try
		{
			datas = Base64Method.EncryptBase64(data.toString());
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

		ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(request.getSession().getServletContext());
		mginterface myservice = (mginterface) ctx.getBean(serviceName);
		return myservice.doPostForWeb("", method, datas);
		/*
		 * if(serviceName.equals("baseService")){ return CallBaseService(request,"", method, datas);
		 * } else if(serviceName.equals("logisticsService")){ return CallLogisticsService(request,
		 * "", method, datas); } else if(serviceName.equals("enterpriseService")){ return
		 * CallEnterpriseService(request, "", method, datas); }else
		 * if(serviceName.equals("settlementService")){ return CallSettlementService(request, "",
		 * method, datas); }else if(serviceName.equals("rsmdService")){ return
		 * CallRsmdService(request,"",method,datas); }else
		 * if(serviceName.equals("workflowService")){ return
		 * CallWorkflowService(request,"",method,datas); }else{ return ""; }
		 */
	}

	public static String RetResponse(int ret, String message)
	{
		JSONObject obj = new JSONObject();
		obj.put("ret", ret);
		obj.put("message", message);
		return obj.toString();
	}

	public static String FileUpLoadAndGetParam(HttpServletRequest request, HttpServletResponse response)
	{
		return FileUpLoadAndGetParam(request, response, FileUpload.fileUploadDir);
	}

	public static String FileUpLoadAndGetParam(HttpServletRequest request, HttpServletResponse response, FileUpload.emFileType fileType)
	{
		FileUpload fu = new FileUpload();
		boolean bSetMap = fu.setMap(request);// 解析request
		if (!bSetMap)
		{
			return RetResponse(10, "获取数据失败");
		}
		if (!fu.writeFile(request, fileType))
		{
			return RetResponse(10, "写文件失败");
		}
		JSONObject obj = fu.getFilesUrlJson();
		JSONObject json = new JSONObject();
		json.put("ret", 0);
		json.put("message", "上传成功");
		json.put("data", obj);
		json.put("param", fu.getParamsJson());
		return json.toString();
	}

	public static String FileUpLoadAndGetParam(HttpServletRequest request, HttpServletResponse response, String fileDir)
	{
		FileUpload fu = new FileUpload();
		boolean bSetMap = fu.setMap(request);// 解析request
		if (!bSetMap)
		{
			return RetResponse(10, "获取数据失败");
		}
		if (!fu.writeFile(request, fileDir))
		{
			return RetResponse(10, "写文件失败");
		}
		JSONObject obj = fu.getFilesUrlJson();
		JSONObject json = new JSONObject();
		json.put("ret", 0);
		json.put("message", "上传成功");
		json.put("data", obj);
		json.put("param", fu.getParamsJson());
		return json.toString();
	}

	/**
	 * 
	 * @param firstTime
	 * @param secondTime
	 * @return
	 * @throws ParseException
	 */
	public static long checkDateTime(String firstTime, String secondTime) throws ParseException
	{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date firstDate = null;
		Date secondDate = null;
		try
		{
			firstDate = sdf.parse(firstTime);
			secondDate = sdf.parse(secondTime);
		}
		catch (ParseException e)
		{
			e.printStackTrace();
			throw e;
		}
		return (long) (firstDate.getTime() - secondDate.getTime()) / 1000;
	}

	/**
	 * 导出为pdf 以'打印预览'的形式呈现
	 * 
	 * @param jasperTemplateUrl 模板url
	 * @param JsonStr json数据源
	 * @param subReportMap 子报表map
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	public static void exportPdf(String reportTemplateUrl, String jsonStr, Map<String, String> subReportMap, HttpServletRequest request, HttpServletResponse response) throws Exception
	{

		String reportTemplateRealUrl = request.getServletContext().getRealPath(reportTemplateUrl);
		HashMap<String, Object> paramsMap = new HashMap<String, Object>();

		if (subReportMap != null)
		{
			for (Entry<String, String> entry : subReportMap.entrySet())
			{
				paramsMap.put(entry.getKey(), new JsonDataSource(new ByteArrayInputStream(jsonStr.getBytes("utf-8")), entry.getValue()));
			}
		}
		paramsMap.put("net.sf.jasperreports.json.source", jsonStr);
		paramsMap.put("JSON_INPUT_STREAM", new ByteArrayInputStream(jsonStr.getBytes("utf-8")));
		paramsMap.put(JsonQueryExecuterFactory.JSON_LOCALE, Locale.CHINESE);
		paramsMap.put(JRParameter.REPORT_LOCALE, Locale.CHINESE);
		// 填充数据
		response.setContentType("application/pdf");
		OutputStream outputStream = response.getOutputStream();

		JRPdfExporter pdfExporter = new JRPdfExporter();
		pdfExporter.setParameter(JRPdfExporterParameter.OUTPUT_STREAM, outputStream);
		// 设值jasperPrint
		JasperPrint jasperPrint = JasperFillManager.fillReport(reportTemplateRealUrl, paramsMap);
		pdfExporter.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
		pdfExporter.exportReport();

		outputStream.close();
	}

	/**
	 * 导出为excel文件
	 * 
	 * @param reportTemplateUrl 模板url
	 * @param jsonStr json数据源
	 * @param subReportMap 子报表map
	 * @param excelFileName 导出的excel文件名称
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	public static void exportExcel(String reportTemplateUrl, String jsonStr, Map<String, String> subReportMap, String excelFileName, HttpServletRequest request, HttpServletResponse response)
			throws Exception
	{

		String reportTemplateRealUrl = request.getServletContext().getRealPath(reportTemplateUrl);
		HashMap<String, Object> paramsMap = new HashMap<String, Object>();

		if (subReportMap != null)
		{
			for (Entry<String, String> entry : subReportMap.entrySet())
			{
				paramsMap.put(entry.getKey(), new JsonDataSource(new ByteArrayInputStream(jsonStr.getBytes("utf-8")), entry.getValue()));
			}
		}
		paramsMap.put("net.sf.jasperreports.json.source", jsonStr);
		paramsMap.put("JSON_INPUT_STREAM", new ByteArrayInputStream(jsonStr.getBytes("utf-8")));
		paramsMap.put(JsonQueryExecuterFactory.JSON_LOCALE, Locale.CHINESE);
		paramsMap.put(JRParameter.REPORT_LOCALE, Locale.CHINESE);
		// 填充数据
		OutputStream outputStream = response.getOutputStream();
		response.setHeader("Content-Disposition", "attachment;filename=" + excelFileName + ".xls");
		response.setContentType("application/vnd_ms-excel");

		JRXlsExporter xlsExporter = new JRXlsExporter();
		xlsExporter.setParameter(JRXlsExporterParameter.OUTPUT_STREAM, outputStream);
		// 设值jasperPrint
		JasperPrint jasperPrint1 = JasperFillManager.fillReport(reportTemplateRealUrl, paramsMap);
		xlsExporter.setParameter(JRXlsExporterParameter.JASPER_PRINT, jasperPrint1);
		xlsExporter.setParameter(JRXlsExporterParameter.IS_ONE_PAGE_PER_SHEET, Boolean.FALSE);
		xlsExporter.setParameter(JRXlsExporterParameter.IS_WHITE_PAGE_BACKGROUND, Boolean.FALSE);
		xlsExporter.exportReport();

		outputStream.close();
	}

	public static boolean checkLogin(HttpServletRequest request, HttpServletResponse response)
	{
		String login_data = (String) request.getSession().getAttribute("user_login_data");
		if (login_data == null)
		{
			writeResultBack(request, response, RetResponse(10, "请先登录"));
			return false;
		}
		return true;
	}
}
