package com.masget.controller.rboperationsmanager;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.masget.util.CommomUtil;

@Controller
@RequestMapping("/rboperationsmanager/com")
public class operationResourceController {
	Gson gson;
	@SuppressWarnings("unused")
	private static Logger logger =Logger.getLogger(operationResourceController.class);
	public operationResourceController() {
		gson = new GsonBuilder().serializeNulls()
				.setDateFormat("yyyy-MM-dd HH:mm:ss").create();
	}

	/**
	 * 获取角色菜单资源
	 * 
	 * @param osenvirnmentid
	 * @param companytypeid
	 * @param roletypeid
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/resource_query", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void resource_query(
			@RequestParam(value = "osenvirnmentid", required = true) Long osenvirnmentid,
			@RequestParam(value = "companytypeid", required = true) Long companytypeid,
			@RequestParam(value = "roletypeid", required = true) Long roletypeid,
			HttpServletRequest request, HttpServletResponse response) {

		String login_data = (String) request.getSession().getAttribute(
				"user_login_data");
		if (login_data == null) {
			CommomUtil.writeResultBack(request, response,
					CommomUtil.RetResponse(10, "请先登录"));
			return;
		}

		Map<String, Object> dataMap = new HashMap<String, Object>();

		if (osenvirnmentid != null && !osenvirnmentid.equals("")) {
			dataMap.put("osenvirnmentid", osenvirnmentid);
		}

		if (companytypeid != null && !companytypeid.equals("")) {
			dataMap.put("companytypeid", companytypeid);
		}

		if (roletypeid != null && !roletypeid.equals("")) {
			dataMap.put("roletypeid", roletypeid);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "baseService";
		String method = "masget.base.com.resource.query";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	
	

}
