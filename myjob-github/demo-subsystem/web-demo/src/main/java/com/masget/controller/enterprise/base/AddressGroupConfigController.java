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
 * 经销商级别配置Controller
 * @author chenjinxing
 *
 */
@Controller
@RequestMapping("/enterprise/addressgroupconfig")
public class AddressGroupConfigController {
	private static Logger logger = Logger.getLogger(AddressGroupConfigController.class);
	/**
	 * 查询经销商级别
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/getAddressgroupconfig", method = { RequestMethod.POST,RequestMethod.GET })
	public void getAddressgroupconfig(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		String method="masget.enterprise.base.addressgroupconfig.get";
        
        String TAG = "/masgetweb/enterprise/addressgroupconfig/getAddressgroupconfig";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		}catch(Exception e){
			logger.info(TAG+ ":查询经销商级别发生异常:" + obj.toString(), e); 
			new MgException(20282,"查询经销商级别发生异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 修改经销商级别
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/modifyAddressgroupconfig", method = { RequestMethod.POST,RequestMethod.GET })
	public void modifyAddressgroupconfig(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		String method="masget.enterprise.base.addressgroupconfig.modify";
        
        String TAG = "/masgetweb/enterprise/addressgroupconfig/modifyAddressgroupconfig";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		}catch(Exception e){
			logger.info(TAG+ ":更新经销商级别发生异常:" + obj.toString(), e); 
			new MgException(20284,"更新经销商级别发生异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 添加经销商级别
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/addAddressgroupconfig", method = { RequestMethod.POST,RequestMethod.GET })
	public void addAddressgroupconfig(
			@RequestParam(value = "data", required = false) String data,
			HttpServletRequest request, HttpServletResponse response) {
		
		JSONObject obj = JSONObject.fromObject(data); 
		String method="masget.enterprise.base.addressgroupconfig.add";
        
        String TAG = "/masgetweb/enterprise/addressgroupconfig/addAddressgroupconfig";
		String result = "";
		try{
			result = CommomUtil.CallApi(request, CommomUtil.ENTERPRISE_SERVICE, method, obj.toString());
		}catch(Exception e){
			logger.info(TAG+ ":添加经销商级别发生异常:" + obj.toString(), e); 
			new MgException(20281,"添加新经销商级别发生异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	
}
