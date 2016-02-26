package com.masget.controller.enterprise.base;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.masget.util.CommomUtil;
import com.masget.utils.MgException;

/**
 * 经销商Controller
 * @author chenjinxing
 * @since 2015-11-2
 */
@Controller
@RequestMapping("/enterprise/contactor")
public class ContactorController {
	private static Logger logger = Logger.getLogger(ContactorController.class);
	
	/**
	 * 添加经销商
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/regSubcompany", method = { RequestMethod.POST,RequestMethod.GET })
	public void regSubcompany(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		//String method="masget.base.com.subcompany.reg";
        String method = "masget.enterprise.base.subcompany.add";
        String TAG = "/masgetweb/enterprise/contactor/regSubcompany";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		}catch(Exception e){
			logger.info(TAG+ ":添加经销商发生异常:" + obj.toString(), e); 
			new MgException(10555,"添加经销商发生异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 查询经销商
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/getSubcompany", method = { RequestMethod.POST,RequestMethod.GET })
	public void getSubcompany(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		//String method="masget.base.com.subcompany.reg";
        String method = "masget.base.com.subcompany.get";
        String TAG = "/masgetweb/enterprise/contactor/getSubcompany";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
		}catch(Exception e){
			logger.info(TAG+ ":添加经销商发生异常:" + obj.toString(), e); 
			new MgException(10555,"添加经销商发生异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 修改经销商
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/modifySubcompany", method = { RequestMethod.POST,RequestMethod.GET })
	public void modifySubcompany(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		//String method="masget.base.com.subcompany.reg";
        String method = "masget.base.com.subcompany.modify";
        String TAG = "/masgetweb/enterprise/contactor/modifySubcompany";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.BASE_SERVICE, method, obj.toString());
		}catch(Exception e){
			logger.info(TAG+ ":修改经销商发生异常:" + obj.toString(), e); 
			new MgException(10555,"修改经销商发生异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	
}
