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
public class CompanytransferaccountinfoController {
	Gson gson;
	@SuppressWarnings("unused")
	private static Logger logger =Logger.getLogger(CompanytransferaccountinfoController.class);
	public CompanytransferaccountinfoController() {
		gson = new GsonBuilder().serializeNulls()
				.setDateFormat("yyyy-MM-dd HH:mm:ss").create();
	}

	
	/**
	 * 4.3.	生成划账信息数据文件
	 * 
	 * @param    i_awardcompanyid  --  p_unionpayid 
	 * @param p_acquirebankid  
	 * @param p_targetcompanyname  
	 * @param p_bankaccount
	 * @param p_accountname
	 * @param p_accounttype
	 * @param p_begindate
	 * @param p_enddate
	 * @param p_serviceflag
	 * @param p_ordertype
	 */
	@RequestMapping(value = "/companytransferaccountinfo_makefile", method = { RequestMethod.POST,
			RequestMethod.GET })
	public void companytransferaccountinfo_makefile(
			@RequestParam(value = "i_awardcompanyid", required = false) Integer i_awardcompanyid,
			@RequestParam(value = "i_acquirebankid", required = false) Integer i_acquirebankid,
			@RequestParam(value = "i_targetcompanyname", required = false) Integer i_targetcompanyname,
			@RequestParam(value = "i_accountname", required = false) String i_accountname,
			@RequestParam(value = "i_bankaccount", required = false) String i_bankaccount,
			@RequestParam(value = "i_accounttype", required = false) Integer i_accounttype,
			@RequestParam(value = "i_begintransfertime", required = false) String i_begintransfertime,
			@RequestParam(value = "i_endtransfertime", required = false) String i_endtransfertime,
			@RequestParam(value = "i_serviceflag", required = false) Integer i_serviceflag,
			@RequestParam(value = "p_ordertype", required = false) Integer p_ordertype,
			HttpServletRequest request, HttpServletResponse response) {

		Map<String, Object> dataMap = new HashMap<String, Object>();

		if (i_awardcompanyid != null && !i_awardcompanyid.equals("")) {
			dataMap.put("p_unionpayid", i_awardcompanyid);
		}

		if (i_acquirebankid != null && !i_acquirebankid.equals("")) {
			dataMap.put("p_acquirebankid", i_acquirebankid);
		}

		if (i_targetcompanyname != null && !i_targetcompanyname.equals("")) {
			dataMap.put("p_targetcompanyname", i_targetcompanyname);
		}

		if (i_accountname != null && !i_accountname.equals("")) {
			dataMap.put("p_accountname", i_accountname);
		}
		if (i_bankaccount != null && !i_bankaccount.equals("")) {
			dataMap.put("p_bankaccount", i_bankaccount);
		}

		if (i_accounttype != null && !i_accounttype.equals("")) {
			dataMap.put("p_accounttype", i_accounttype);
		}

		if (i_begintransfertime != null && !i_begintransfertime.equals("")) {
			dataMap.put("p_begindate", i_begintransfertime);
		}

		if (i_endtransfertime != null && !i_endtransfertime.equals("")) {
			dataMap.put("p_enddate", i_endtransfertime);
		}
		
		if (i_serviceflag != null && !i_serviceflag.equals("")) {
			dataMap.put("p_serviceflag", i_serviceflag);
		}
		if (p_ordertype != null && !p_ordertype.equals("")) {
			dataMap.put("p_ordertype", p_ordertype);
		}

		Gson gson = new Gson();
		String data = gson.toJson(dataMap);
		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.bank.companytransferaccountinfo.makefile";
		String result = CommomUtil.CallApi(request, serviceName, method, data);
		CommomUtil.writeResultBack(request, response, result);
	}
	

}
