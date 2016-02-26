package com.masget.controller.rboperationsmanager;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.google.gson.Gson;
import com.masget.util.CommomUtil;
import com.masget.util.FileUpload;
import com.masget.util.settlement.Reconciliation;

/**
 * 资源Controller
 * 
 * @author lgn
 *
 */
@Controller
@RequestMapping("/base/accountCheck")
public class AccountCheckController {
	Gson gson;

	/**
	 * 根据条件 查询资源信息
	 */
	@RequestMapping(value = "/get", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void get(String type, HttpServletRequest request,
			HttpServletResponse response) {

		JSONObject json = new JSONObject();
		String data = null;
		String result = "服务异常";
		if (type.equals("unionPay")) {
			// 银联
			data = json.toString();
			result = CommomUtil.CallApi(request, "rboperationsmanagerService",
					"masget.rboperationsmanager.com.awardcompany.get", data);
		} else if (type.equals("acquiringBank")) {
			// 收单行
			json.put("awardcompanyid", request.getParameter("awardcompanyid"));
			data = json.toString();
			result = CommomUtil
					.CallApi(
							request,
							"rboperationsmanagerService",
							"masget.rboperationsmanager.com.acquirerinfobyawardcompany.query",
							data);
		} else if (type.equals("clearingHouse")) {
			// 结算行
			data = json.toString();
			result = CommomUtil.CallApi(request, "rboperationsmanagerService",
					"masget.rboperationsmanager.com.acquirerinfo.get", data);
		}
		CommomUtil.writeResultBack(request, response, result);
	}

	@RequestMapping(value = "/submit", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void submit(String type, HttpServletRequest request,
			HttpServletResponse response) {
		
		Reconciliation oData = new Reconciliation();
		long nAwardcompanyid  = Long.parseLong(request.getParameter("nAwardcompanyid"));
		long nAcquirercompanyid  = Long.parseLong(request.getParameter("nAcquirercompanyid"));
		long nSettlementcompanyid  = Long.parseLong(request.getParameter("nSettlementcompanyid"));
		String sBegintime  = request.getParameter("sBegintime");
		String sEndtime  = request.getParameter("sEndtime");
		int nObjectType  = Integer.parseInt(request.getParameter("nObjectType"));
		String sZumFile  = request.getParameter("sZumFile");
		String sAcomaFile  = request.getParameter("sAcomaFile");
		String sSavePath  = request.getParameter("sSavePath");
		String sPreUrl  = request.getParameter("sPreUrl");
		JSONObject obj = JSONObject.fromObject(request.getSession(false).getAttribute("user_login_data"));
		long nStaffid  = Long.parseLong(obj.get("staffid").toString()) ;

		String sResult = oData.requestReconciliation(request,nAwardcompanyid,
				nAcquirercompanyid, nSettlementcompanyid, sBegintime, sEndtime,
				nObjectType, sZumFile, sAcomaFile,sSavePath,sPreUrl,nStaffid);
		
		CommomUtil.writeResultBack(request, response, sResult);
	}

	@RequestMapping(value = "/upload")
	public void upload(HttpServletRequest request, HttpServletResponse response) {
		String fileuploadResult = CommomUtil.FileUpLoadAndGetParam(request,
				response, FileUpload.accountCheckFilesSavePath);
		CommomUtil.writeResultBack(request, response, fileuploadResult);
	}

}
