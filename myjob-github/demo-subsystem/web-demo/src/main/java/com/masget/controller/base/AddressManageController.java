package com.masget.controller.base;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;
import com.masget.util.CommomUtil;
import com.masget.utils.MgException;

/**
 * 收/发货地址 Controller
 * @author chenjinxing
 * @since 2015-9-16
 */
@Controller
@RequestMapping("/base/addressManage")
public class AddressManageController {
	
	private static Logger logger = Logger.getLogger(AddressManageController.class);
	
	private Map<String,Object> dataMap = null;
	private String params = null;
	/**
	 * 添加地址 
	 * @param addresstype 1-收货地址 2-发货地址
	 * @param request
	 * @param response
	 */
	@RequestMapping("/addAddressManage")
	public void addAddressManage(
			@RequestParam(value="addresstype", required = true) String addresstype,
			@RequestParam(value="companyid", required = false) String companyid,
			@RequestParam(value="contactname", required = true) String contactname,
			@RequestParam(value="mobile", required = false) String mobile,
			@RequestParam(value="phonepostcode", required = false) String phonepostcode,
			@RequestParam(value="phone", required = false) String phone,
			@RequestParam(value="phonesubcode", required = false) String phonesubcode,
			@RequestParam(value="provinceid", required = true) String provinceid,
			@RequestParam(value="cityid", required = true) String cityid,
			@RequestParam(value="areaid", required = true) String areaid,
			@RequestParam(value="address", required = true) String address,
			@RequestParam(value="postcode", required = false) String postcode,
			@RequestParam(value="remark", required = false) String remark,
			HttpServletRequest request, HttpServletResponse response) {
		dataMap = new HashMap<String, Object>();
		
		dataMap.put("addresstype", Integer.parseInt(addresstype));
		dataMap.put("contactname", String.valueOf(contactname));
		if(companyid != null && !"".equals(companyid)){
			dataMap.put("companyid", Integer.parseInt(companyid));
		}
		if(mobile != null && !"".equals(mobile)){
			dataMap.put("mobile", String.valueOf(mobile));
		}
		if(phonepostcode != null && !"".equals(phonepostcode)){
			dataMap.put("phonepostcode", String.valueOf(phonepostcode));
		}
		if(phone != null && !"".equals(phone)){
			dataMap.put("phone", String.valueOf(phone));
		}
		if(phonesubcode != null && !"".equals(phonesubcode)){
			dataMap.put("phonesubcode", String.valueOf(phonesubcode));
		}
		dataMap.put("provinceid", Integer.parseInt(provinceid));
		dataMap.put("cityid", Integer.parseInt(cityid));
		dataMap.put("provinceid", Integer.parseInt(provinceid));
		dataMap.put("areaid", Integer.parseInt(areaid));
		dataMap.put("address", String.valueOf(address));
		dataMap.put("postcode", String.valueOf(postcode));
		if(remark != null && !"".equals(remark)){
			dataMap.put("remark", String.valueOf(remark));
		}
		params = new Gson().toJson(dataMap);
		String TAG = "masget.enterprise.baseline.addressmanage.add";
		String result = "";
		try{
			result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.baseline.addressmanage.add",params);
		}catch(Exception e){
			logger.info(TAG+ ":添加地址异常:" + dataMap.toString(), e); 
			new MgException(20095,"添加地址异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 查询地址 
	 * @param pagesize
	 * @param pagenum
	 * @param request
	 * @param response
	 */
	@RequestMapping("/getAddressManage")
	public void getAddressManage(
			@RequestParam(value="pagesize", required = true) String pagesize,
			@RequestParam(value="pagenum", required = true) String pagenum,
			@RequestParam(value="addresstype", required = true) String addresstype,
			@RequestParam(value="companyid", required = false) String companyid,
			HttpServletRequest request, HttpServletResponse response) {
		
		dataMap = new HashMap<String, Object>();
		
		dataMap.put("pagesize", Integer.parseInt(pagesize));
		dataMap.put("pagenum", Integer.parseInt(pagenum));
		dataMap.put("addresstype", Integer.parseInt(addresstype));
		if(companyid != null && !"".equals(companyid)){
			dataMap.put("companyid", Integer.parseInt(companyid));
		}
		params = new Gson().toJson(dataMap);
		String TAG = "masget.enterprise.baseline.addressmanage.get";
		String result = "";
		try{
			result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.baseline.addressmanage.get",params);
		}catch(Exception e){
			logger.info(TAG+ ":获取地址异常:" + dataMap.toString(), e); 
			new MgException(20095,"获取地址异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 删除地址 
	 * @param addressmanageid
	 * @param request
	 * @param response
	 */
	@RequestMapping("/deleteAddressManage")
	public void deleteAddressManage(
			@RequestParam(value="addressmanageid", required = true) String addressmanageid,
			HttpServletRequest request, HttpServletResponse response) {
		dataMap = new HashMap<String, Object>();
		dataMap.put("addressmanageid", Long.parseLong(addressmanageid));
		params = new Gson().toJson(dataMap);
		String TAG = "masget.enterprise.baseline.addressmanage.delete";
		String result = "";
		try{
			result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.baseline.addressmanage.delete",params);
		}catch(Exception e){
			logger.info(TAG+ ":删除地址异常:" + dataMap.toString(), e); 
			new MgException(20095,"删除地址异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	/**
	 * 修改地址 
	 * @param addressmanageid
	 * @param request
	 * @param response
	 */
	@RequestMapping("/modifyAddressManage")
	public void modifyAddressManage(
			@RequestParam(value="addressmanageid", required = true) String addressmanageid,
			@RequestParam(value="contactname", required = false) String contactname,
			@RequestParam(value="mobile", required = false) String mobile,
			@RequestParam(value="phonepostcode", required = false) String phonepostcode,
			@RequestParam(value="phone", required = false) String phone,
			@RequestParam(value="phonesubcode", required = false) String phonesubcode,
			@RequestParam(value="provinceid", required = false) String provinceid,
			@RequestParam(value="cityid", required = false) String cityid,
			@RequestParam(value="areaid", required = false) String areaid,
			@RequestParam(value="address", required = false) String address,
			@RequestParam(value="postcode", required = false) String postcode,
			@RequestParam(value="remark", required = false) String remark,
			HttpServletRequest request, HttpServletResponse response) {
		dataMap = new HashMap<String, Object>();
		dataMap.put("addressmanageid", Long.parseLong(addressmanageid));
		dataMap.put("contactname", String.valueOf(contactname));
		dataMap.put("mobile", String.valueOf(mobile));
		dataMap.put("phone", String.valueOf(phone));
		dataMap.put("phonesubcode", String.valueOf(phonesubcode));
		dataMap.put("provinceid", Integer.parseInt(provinceid));
		dataMap.put("cityid", Integer.parseInt(cityid));
		dataMap.put("areaid", Integer.parseInt(areaid));
		dataMap.put("address", String.valueOf(address));
		dataMap.put("postcode", String.valueOf(postcode));
		dataMap.put("remark", String.valueOf(remark));
		params = new Gson().toJson(dataMap);
		String TAG = "masget.enterprise.baseline.addressmanage.modify";
		String result = "";
		try{
			result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.baseline.addressmanage.modify",params);
		}catch(Exception e){
			logger.info(TAG+ ":修改地址异常:" + dataMap.toString(), e); 
			new MgException(20095,"修改地址异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	
	
	/**
	 * 添加外部地址 
	 * @param addresstype 1-收货地址 2-发货地址
	 * @param request
	 * @param response
	 */
	@RequestMapping("/addBaseAddressManage")
	public void addBaseAddressManage(
			
			@RequestParam(value="isdefault", required = true) String isdefault,
			@RequestParam(value="addresstype", required = true) String addresstype,
			@RequestParam(value="companyid", required = false) String companyid,
			@RequestParam(value="contactname", required = true) String contactname,
			@RequestParam(value="mobile", required = false) String mobile,
			@RequestParam(value="phonepostcode", required = false) String phonepostcode,
			@RequestParam(value="phone", required = false) String phone,
			@RequestParam(value="phonesubcode", required = false) String phonesubcode,
			@RequestParam(value="provinceid", required = true) String provinceid,
			@RequestParam(value="cityid", required = true) String cityid,
			@RequestParam(value="areaid", required = true) String areaid,
			@RequestParam(value="address", required = true) String address,
			@RequestParam(value="postcode", required = false) String postcode,
			@RequestParam(value="remark", required = false) String remark,
			HttpServletRequest request, HttpServletResponse response) {
		dataMap = new HashMap<String, Object>();
		
		dataMap.put("isdefault", isdefault);
		dataMap.put("addresstype", Integer.parseInt(addresstype));
		dataMap.put("contactname", String.valueOf(contactname));
		if(companyid != null && !"".equals(companyid)){
			dataMap.put("companyid", Integer.parseInt(companyid));
		}
		if(mobile != null && !"".equals(mobile)){
			dataMap.put("mobile", String.valueOf(mobile));
		}
		if(phonepostcode != null && !"".equals(phonepostcode)){
			dataMap.put("phonepostcode", String.valueOf(phonepostcode));
		}
		if(phone != null && !"".equals(phone)){
			dataMap.put("phone", String.valueOf(phone));
		}
		if(phonesubcode != null && !"".equals(phonesubcode)){
			dataMap.put("phonesubcode", String.valueOf(phonesubcode));
		}
		dataMap.put("provinceid", Integer.parseInt(provinceid));
		dataMap.put("cityid", Integer.parseInt(cityid));
		dataMap.put("provinceid", Integer.parseInt(provinceid));
		dataMap.put("areaid", Integer.parseInt(areaid));
		dataMap.put("address", String.valueOf(address));
		dataMap.put("postcode", String.valueOf(postcode));
		if(remark != null && !"".equals(remark)){
			dataMap.put("remark", String.valueOf(remark));
		}
		params = new Gson().toJson(dataMap);
		String TAG = "masget.enterprise.baseline.addressmanage.base.add";
		String result = "";
		try{
			result = CommomUtil.CallApi(request,CommomUtil.ENTERPRISE_SERVICE,"masget.enterprise.baseline.addressmanage.base.add",params);
		}catch(Exception e){
			logger.info(TAG+ ":添加地址异常:" + dataMap.toString(), e); 
			new MgException(20095,"添加地址异常",e);
		}
		CommomUtil.writeResultBack(request, response, result);
	}
	
	
}
