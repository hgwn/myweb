package com.masget.controller.enterprise.pay;

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
 * 分期数配置Controller
 * @author chenjinxing
 * @since 2015-10-30
 */
@Controller
@RequestMapping("/enterprise/installmentsconfig")
public class InstallmentsConfigController {
	private static Logger logger = Logger.getLogger(InstallmentsConfigController.class);
	/**
	 * 查询经销商级别
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/getInstallmentsconfig", method = { RequestMethod.POST,RequestMethod.GET })
	public void getInstallmentsconfig(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		String method="masget.enterprise.pay.installmentsconfig.get";
        
        String TAG = "/masgetweb/enterprise/installmentsconfig/getInstallmentsconfig";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		}catch(Exception e){
			logger.info(TAG+ ":查询分期数配置记录数时异常:" + obj.toString(), e); 
			new MgException(20289,"查询分期数配置记录数时异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 新增经销商级别
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/addInstallmentsconfig", method = { RequestMethod.POST,RequestMethod.GET })
	public void addInstallmentsconfig(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		String method="masget.enterprise.pay.installmentsconfig.add";
        
        String TAG = "/masgetweb/enterprise/installmentsconfig/addInstallmentsconfig";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		}catch(Exception e){
			logger.info(TAG+ ":添加分期数配置记录数时异常:" + obj.toString(), e); 
			new MgException(20288,"添加分期数配置记录数时异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 修改经销商级别
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/modifyInstallmentsconfig", method = { RequestMethod.POST,RequestMethod.GET })
	public void modifyInstallmentsconfig(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		String method="masget.enterprise.pay.installmentsconfig.modify";
        
        String TAG = "/masgetweb/enterprise/installmentsconfig/modifyInstallmentsconfig";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		}catch(Exception e){
			logger.info(TAG+ ":修改分期数配置记录数时异常:" + obj.toString(), e); 
			new MgException(20292,"修改分期数配置记录数时异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
}
