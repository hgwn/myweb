package com.masget.util.settlement;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.masget.entity.AcomaEntity;
import com.masget.entity.AcomaResult;
import com.masget.entity.AcomaZHEntity;
import com.masget.entity.ReconciliationjournalEntity;
import com.masget.entity.ZHAcomaItem;
import com.masget.util.CommomUtil;
import com.masget.util.file.LocalXls;

public class Reconciliation
{
	private Integer request_result = 0;
	private String last_error = "";
	private String save_path = "";
	private String pre_url = "";
	private long staffid = 0;
	private AcomaResult acoma_result = new AcomaResult();
	private Logger logger = Logger.getLogger(Reconciliation.class);
	
	private Map<String, MasgetInCome> mapAcoma = new HashMap<String, MasgetInCome>();
	private Map<String, ReconciliationjournalEntity> mapPlatform = new HashMap<String, ReconciliationjournalEntity>();
	
	// 用于中行
	private Map<String, ZHAcomaItem> mapZh = new HashMap<String, ZHAcomaItem>();
	
	public String format_datetime(Date date, String sFormat)  
    {  
        return date == null ? " " : new SimpleDateFormat(sFormat).format(date);  
    }
	
	public String string_2_datetime(String sTime, String sFormat, String sOutFormat)
	{
		String sDate = "";
		
		try  
		{  
		    SimpleDateFormat oFormat = new SimpleDateFormat(sFormat);  
		    Date date = oFormat.parse(sTime);
		    sDate = format_datetime(date, sOutFormat);
		}  
		catch (Exception e)  
		{  
		    System.out.println(e.getMessage());  
		}
		
		return sDate;
	}
	
	/**
	 * 请求对账的接口
	 * @param nAwardcompanyid			银联公司id
	 * @param nAcquirercompanyid		收单行公司id
	 * @param nSettlementcompanyid		结算行公司id
	 * @param sBegintime				清算开始时间
	 * @param sEndtime					清算结束时间
	 * @param nObjectType				对账的对象
	 * @param sZumFile					zsum上传到服务器的文件，包含完整路径
	 * @param sAcomaFile				acoma上传到服务器的文件，包含完整路径
	 * @param sSavePath					下载文件保存的目录，例如：/home/.../download/
	 * @param sPreUrl					构造下载文件URL的前面部分，例如：http://xxx:xxx/masgetweb/download/
	 * @param nStaffid					登录员工id
	 * @return HTTP的响应内容，json格式，web的controller层可以将此结构直接回应给浏览器
	 * 
	 * nObjectType的取值（1～6）：
	 * 		1 - 四川衫德
     * 		2 - 重庆衫德
     *　		3 - 湖北卡友
     *　		4 - 湖北中行
     * 		5 - 辽宁拉卡拉
     * 		6 - 宁波银商
	 */
	public String requestReconciliation(HttpServletRequest request, long nAwardcompanyid, long nAcquirercompanyid, long nSettlementcompanyid, 
			String sInBegintime, String sInEndtime, Integer nObjectType, String sZumFile, String sAcomaFile,
			String sInSavePath, String sInPreUrl, long nStaffid)
	{
		Map<String, Object> oResult = new HashMap<String, Object>();
		List<AcomaEntity> arrEntity = null;
		ACOMADatas oAcoma = new ACOMADatas();
		Gson gson = new Gson();
		long nOldTime = 0;
		ZSUMDatas oZsum = new ZSUMDatas();
		
		String sBegintime = sInBegintime + " 00:00:00";
		String sEndtime = sInEndtime + " 23:59:59";
		String sPreUrl = String.format("%s%s/", sInPreUrl, sInSavePath); 
		String sSavePath = String.format("%s%s/", request.getSession().getServletContext().getRealPath(""), sInSavePath);
		
		try
		{
			if (nObjectType == 4)
			{
				/*
				long nCost = 32;
				long nZhCost = 11;
				long nPfCost = 1;
				return requestZHReconciliation(request, nAwardcompanyid, nAcquirercompanyid, nSettlementcompanyid, 
						sBegintime, sEndtime, sAcomaFile,
						sSavePath, sPreUrl, nStaffid, fMerchantstoliquidatefundsmoney, nCost, nZhCost, nPfCost);
				*/
				return "";
			}
			
			nOldTime = System.currentTimeMillis();
			logger.error("requestReconciliation ObjectType(" + String.valueOf(nObjectType) + ") staffid(" + String.valueOf(nStaffid) + ")");

			save_path = sSavePath;
			pre_url = sPreUrl;
			this.staffid = nStaffid;
			
			if (nObjectType == 1 || nObjectType == 2)
			{
				// 四川衫德文件类型：文本文件
				// 四川衫德文件编码：ASNI
				oAcoma.parseFile(sAcomaFile, "ISO8859-1");
				oZsum.parseFile(sZumFile, "ISO8859-1");
			}
			else if (nObjectType == 3)
			{
				// 湖北卡友文件类型：文本文件
				// 湖北卡友文件编码：Unicode
				oAcoma.parseFile(sAcomaFile, "Unicode");
				oZsum.parseFile(sZumFile, "Unicode");
			}
			else if (nObjectType == 5)
			{
				//oAcoma.parseExcel5(sAcomaFile, 56, 0);
				//oZsum.parseExcel5(sZumFile, 0);
				oAcoma.parseFile(sAcomaFile, "ISO8859-1");
				oZsum.parseFile(sZumFile, "ISO8859-1");
			}
			else if (nObjectType == 6)
			{
				oAcoma.parseExcel6(sAcomaFile, 56, 0);
				oZsum.parseExcel6(sZumFile, 1);
			}
			
			acoma_result.setAcoma_transactionamount(oZsum.getTotal_businessamount());
			acoma_result.setAcoma_creditcardfeerate(oZsum.getTotal_possettlement());
			acoma_result.setAcoma_merchantstoliquidatefundsmoney(oZsum.getTotal_unionpaysettlement());
			
			arrEntity = oAcoma.getAcomaEntitys();
			if (arrEntity == null || arrEntity.size() == 0)
			{
				// acoma文件为空，或者解析有问题，不再对账
				oResult.put("ret", 1);
				oResult.put("message", oAcoma.getLastError());
				
				logger.error("requestReconciliation run time(" + String.valueOf(System.currentTimeMillis() - nOldTime) + ") message(" + oAcoma.getLastError() + ")");
				return oResult.toString();
			}
			String sRequest = gson.toJson(arrEntity);
			
			// 请求解析acoma的数据
			String serviceName = "rboperationsmanagerService";
			String method = "masget.rboperationsmanager.com.acoma.parse";
			String sResult = CommomUtil.CallApi(request, serviceName, method, sRequest);
			List<MasgetInCome> oAcomaMasgetInCome = get_acoma_datas(gson, sResult);
			if (oAcomaMasgetInCome == null)
			{
				oResult.put("ret", request_result);
				oResult.put("message", last_error);
				
				logger.error("requestReconciliation run time(" + String.valueOf(System.currentTimeMillis() - nOldTime) + ") message(" + last_error + ")");
				return oResult.toString();
			}
			
			// 将结构转成HashMap，便于对账，同时对记录进行统计，准备excel的文件
			if (prepaid_acoma_datas(oAcomaMasgetInCome) == false)
			{
				oResult.put("ret", request_result);
				oResult.put("message", last_error);
				
				logger.error("requestReconciliation run time(" + String.valueOf(System.currentTimeMillis() - nOldTime) + ") message(" + last_error + ")");
				return oResult.toString();
			}
			
			// 获取清算数据
			serviceName = "rboperationsmanagerService";
			method = "masget.rboperationsmanager.com.reconciliationjournal.query";
			
			Map<String, Object> mapData = new HashMap<String, Object>();
			mapData.put("cupcompanyid", nAwardcompanyid);
			mapData.put("acquirebankid", nAcquirercompanyid);
			mapData.put("settlementbankid", nSettlementcompanyid);
			mapData.put("begintime", sBegintime);
			mapData.put("endtime", sEndtime);
			sRequest = gson.toJson(mapData);
			
			sResult = CommomUtil.CallApi(request, serviceName, method, sRequest);
			List<ReconciliationjournalEntity> oReconciliationjournalEntity = get_journal_datas(gson, sResult);
			if (oReconciliationjournalEntity == null)
			{
				oResult.put("ret", request_result);
				oResult.put("message", last_error);
				
				logger.error("requestReconciliation run time(" + String.valueOf(System.currentTimeMillis() - nOldTime) + ") message(" + last_error + ")");
				return oResult.toString();
			}
			
			// 将结构转成HashMap，便于对账，同时对记录进行统计，准备excel的文件
			if (prepaid_journal_datas(oReconciliationjournalEntity) == false)
			{
				oResult.put("ret", request_result);
				oResult.put("message", last_error);
				
				logger.error("requestReconciliation run time(" + String.valueOf(System.currentTimeMillis() - nOldTime) + ") message(" + last_error + ")");
				return oResult.toString();
			}
			
			// 在收单行的数据文件中存在，但是在数据库中不存在			
			record_acoma_data_but_settlement(oAcomaMasgetInCome);
			
			// 在数据库中存在，但是在收单行数据文件中不存在
			record_settlement_data_but_acoma(oReconciliationjournalEntity);
			
			oResult.put("ret", 0);
			
			this.acoma_result.setRun_time(System.currentTimeMillis() - nOldTime);
			oResult.put("data", this.acoma_result);
		}
		catch (Exception ex)
		{
			logger.error("requestReconciliation exception(" + ex.toString() + ")");
		}
		
		String sJson = gson.toJson(oResult);
		logger.error("requestReconciliation run result(" + sJson + ")");
		return sJson;
	}
	
	// 获取存在于acoma文件中但不存在清分记录中的数据，并且将这些记录写入excel文件以便提供下载
	private void record_acoma_data_but_settlement(List<MasgetInCome> oAcomaMasgetInCome)
	{
		try
		{
			LocalXls oLocalXls = new LocalXls();
			oLocalXls.create_local_excel("交易流水号|商户名称|主账号(卡号)|商户编号|终端标示码|交易金额|商户待清算金额|手续费|收单收益|荣邦收益|银联收益|发卡收益|交易时间|费率");
			
			for (int i = 0; i < oAcomaMasgetInCome.size(); i++)
			{
				MasgetInCome oItem = oAcomaMasgetInCome.get(i);
				if (mapPlatform.containsKey(oItem.getUnionpaydealid()) == false)
				{
					this.acoma_result.addAcoma(oItem);
					
					// 将记录写入excel文件
					oLocalXls.insert_row_data(oItem.to_acoma_excel_string());
				}
				else
				{
					// 存在，比较交易金额是否正确?
				}
			}
			
			// 保存excel文件
			String sName = String.format("acomabutsettlement_%s_%s.xls", String.valueOf(this.staffid), get_now_format_datetime("yyyyMMddHHmmss"));
			String sFile = String.format("%s%s", save_path, sName);
			oLocalXls.save(sFile);
			
			String sUrl = String.format("%s%s", this.pre_url, sName);
			acoma_result.setAcoma_file_2(sUrl);
		}
		catch (Exception ex)
		{
			this.last_error = ex.toString();
			this.request_result = 1;
		}
	}
	
	private void record_zh_acoma_data_but_settlement(long nCostRate, List<ZHAcomaItem> oAcomaMasgetInCome)
	{
		try
		{
			LocalXls oLocalXls = new LocalXls();
			oLocalXls.create_local_excel("交易流水号|商户名称|主账号(卡号)|商户编号|终端标示码|交易金额|银联费率|手续费|银行入账数|成本费率|手续费成本|收入|中行|浦发");
			
			for (int i = 0; i < oAcomaMasgetInCome.size(); i++)
			{
				ZHAcomaItem oItem = oAcomaMasgetInCome.get(i);
				if (mapPlatform.containsKey(oItem.getUnionpaydealid()) == false)
				{
					this.acoma_result.addZHAcoma(oItem);
					
					// 将记录写入excel文件
					oLocalXls.insert_row_data(oItem.to_acoma_excel_string(nCostRate));
				}
				else
				{
					// 存在，比较交易金额是否正确?
				}
			}
			
			// 保存excel文件
			String sName = String.format("acomabutsettlement_%s_%s.xls", String.valueOf(this.staffid), get_now_format_datetime("yyyyMMddHHmmss"));
			String sFile = String.format("%s%s", save_path, sName);
			oLocalXls.save(sFile);
			
			String sUrl = String.format("%s%s", this.pre_url, sName);
			acoma_result.setAcoma_file_2(sUrl);
		}
		catch (Exception ex)
		{
			this.last_error = ex.toString();
			this.request_result = 1;
		}
	}
	
	private void record_settlement_data_but_acoma(List<ReconciliationjournalEntity> oReconciliationjournalEntity)
	{
		try
		{
			LocalXls oLocalXls = new LocalXls();
			oLocalXls.create_local_excel("交易流水号|商户名称|主账号(卡号)|商户编号|终端标示码|交易金额|商户待清算金额|手续费|收单收益|荣邦收益|银联收益|发卡收益|交易时间|荣邦平台溢出收益");
			
			for (ReconciliationjournalEntity oItem : oReconciliationjournalEntity)
			{
				if (mapAcoma.containsKey(oItem.getUnionpaydealid()) == false)
				{			
					this.acoma_result.addSettlement(oItem);
					
					// 写入excel文件
					oLocalXls.insert_row_data(oItem.to_journal_excel_string());
				}
				else
				{
					// 存在，比较交易金额是否正确?
				}
			}
			
			// 保存excel文件
			String sName = String.format("settlementbutacoma_%s_%s.xls", String.valueOf(this.staffid), get_now_format_datetime("yyyyMMddHHmmss"));
			String sFile = String.format("%s%s", save_path, sName);
			oLocalXls.save(sFile);
			
			String sUrl = String.format("%s%s", this.pre_url, sName);
			acoma_result.setPlatform_file_2(sUrl);
		}
		catch (Exception ex)
		{
			this.last_error = ex.toString();
			this.request_result = 1;
		}
	}
	
	private void record_zh_settlement_data_but_acoma(List<ReconciliationjournalEntity> oReconciliationjournalEntity)
	{
		try
		{
			LocalXls oLocalXls = new LocalXls();
			oLocalXls.create_local_excel("交易流水号|商户名称|主账号(卡号)|商户编号|终端标示码|交易金额|商户待清算金额|手续费|收单收益|荣邦收益|银联收益|发卡收益|交易时间|荣邦平台溢出收益");
			
			for (ReconciliationjournalEntity oItem : oReconciliationjournalEntity)
			{
				if (mapZh.containsKey(oItem.getUnionpaydealid()) == false)
				{
					//ReconciliationjournalEntity oTemp = new ReconciliationjournalEntity();
					//oTemp.copyfrom(oItem);					
					this.acoma_result.addSettlement(oItem);
					
					// 写入excel文件
					oLocalXls.insert_row_data(oItem.to_journal_excel_string());
				}
				else
				{
					// 存在，比较交易金额是否正确?
				}
			}
			
			// 保存excel文件
			String sName = String.format("settlementbutacoma_%s_%s.xls", String.valueOf(this.staffid), get_now_format_datetime("yyyyMMddHHmmss"));
			String sFile = String.format("%s%s", save_path, sName);
			oLocalXls.save(sFile);
			
			String sUrl = String.format("%s%s", this.pre_url, sName);
			acoma_result.setPlatform_file_2(sUrl);
		}
		catch (Exception ex)
		{
			this.last_error = ex.toString();
			this.request_result = 1;
		}
	}
	
	private List<MasgetInCome> get_acoma_datas(Gson gson, String sDatas)
	{
		List<MasgetInCome> oOut = null;
		
		try
		{
			request_result = 0;
			last_error = "";
			
			oOut = (List<MasgetInCome>)gson.fromJson(sDatas, new TypeToken<List<MasgetInCome>>(){}.getType());
			if (oOut == null || oOut.size() == 0)
			{
				request_result = 14;
				last_error = "get_acoma_datas 返回JSON内容中data数据不存在";
			}
		}
		catch (Exception ex)
		{
			this.last_error = ex.toString();
			this.request_result = 1;
		}
		
		return oOut;
	}
	
	private List<ZHAcomaItem> get_zh_acoma_datas(Gson gson, String sDatas)
	{
		List<ZHAcomaItem> oOut = null;
		
		try
		{
			request_result = 0;
			last_error = "";
			
			oOut = (List<ZHAcomaItem>)gson.fromJson(sDatas, new TypeToken<List<ZHAcomaItem>>(){}.getType());
			if (oOut == null || oOut.size() == 0)
			{
				request_result = 14;
				last_error = "get_zh_acoma_datas 返回JSON内容中data数据不存在";
			}
		}
		catch (Exception ex)
		{
			this.last_error = ex.toString();
			this.request_result = 1;
		}
		
		return oOut;
	}
	
	private List<ReconciliationjournalEntity> get_journal_datas(Gson gson, String sDatas)
	{
		List<ReconciliationjournalEntity> oOut = null;
		
		try
		{
			request_result = 0;
			last_error = "";
			
			oOut = (List<ReconciliationjournalEntity>)gson.fromJson(sDatas, new TypeToken<List<ReconciliationjournalEntity>>(){}.getType());
			if (oOut == null || oOut.size() == 0)
			{
				request_result = 14;
				last_error = "get_journal_datas 返回JSON内容中data数据不存在";
			}
		}
		catch (Exception ex)
		{
			this.last_error = ex.toString();
			this.request_result = 1;
		}
		
		return oOut;
	}
	
	/**
	 * 准备对账的HashMap、统计ACOMA数据、写ACOMA流水数据excel文件
	 * @param oAcomaMasgetInCome
	 * @return
	 */
	private boolean prepaid_journal_datas(List<ReconciliationjournalEntity> oReconciliationjournalEntity)
	{
		if (oReconciliationjournalEntity.size() == 0)
		{
			this.last_error = "journal data is null";
			this.request_result = 3;
			return false;
		}
		
		try
		{
			LocalXls oLocalXls = new LocalXls();
			oLocalXls.create_local_excel("交易流水号|商户名称|主账号(卡号)|商户编号|终端标示码|交易金额|商户待清算金额|手续费|收单收益|荣邦收益|银联收益|发卡收益|交易时间|荣邦平台溢出收益");
	
			mapPlatform.clear();
			for (ReconciliationjournalEntity oItem : oReconciliationjournalEntity)
			{
				// 写入excel文件
				oLocalXls.insert_row_data(oItem.to_journal_excel_string());
				
				// 加入HashMap表
				mapPlatform.put(oItem.getUnionpaydealid(), oItem);
							
				// platform_acquirebankmoney　统计收单收益
				acoma_result.setPlatform_acquirebankmoney(acoma_result.getPlatform_acquirebankmoney() + oItem.getAcquirebankmoney());
				
				// acoma_masgetprofitmoney　统计荣邦收益
				acoma_result.setPlatform_masgetprofitmoney(acoma_result.getPlatform_masgetprofitmoney() + oItem.getMasgetprofitmoney());
				
				// acoma_bankfeeratemoney　统计荣邦平台溢出收益
				acoma_result.setPlatform_platformamount(acoma_result.getPlatform_platformamount() + oItem.getPlatformamount());
				
				// 交易总额
				acoma_result.setPlatform_transactionamount(acoma_result.getPlatform_transactionamount() + oItem.getTransactionamount());
				
				// 手续费
				acoma_result.setPlatform_creditcardfeerate(acoma_result.getPlatform_creditcardfeerate() + oItem.getCreditcardfeerate());
				
				// 商户待清算资金
				acoma_result.setPlatform_merchantstoliquidatefundsmoney();
			}
			
			// 保存excel文件
			String sName = String.format("platform_%s_%s.xls", String.valueOf(this.staffid), get_now_format_datetime("yyyyMMddHHmmss"));
			String sFile = String.format("%s%s", save_path, sName);
			oLocalXls.save(sFile);
			
			String sUrl = String.format("%s%s", this.pre_url, sName);
			acoma_result.setPlatform_file_1(sUrl);
		}
		catch (Exception ex)
		{
			this.last_error = ex.toString();
			this.request_result = 1;
		}
		
		return true;
	}
	
	private double round2(double d)
	{
		return Double.parseDouble(String.format("%.2f",d));
	}
	
	/**
	 * 准备对账的HashMap、统计清算数据、写清算流水数据excel文件
	 * @param oAcomaMasgetInCome
	 * @return
	 */
	private boolean prepaid_acoma_datas(List<MasgetInCome> oAcomaMasgetInCome)
	{
		Double fTemp = 0.0;
		if (oAcomaMasgetInCome.size() == 0)
		{
			this.last_error = "acoma data is null";
			this.request_result = 2;
			return false;
		}
		
		try
		{
			LocalXls oLocalXls = new LocalXls();
			oLocalXls.create_local_excel("交易流水号|商户名称|主账号(卡号)|商户编号|终端标示码|交易金额|商户待清算金额|手续费|收单收益|荣邦收益|银联收益|发卡收益|交易时间|费率");
	
			mapAcoma.clear();
			for (MasgetInCome oItem : oAcomaMasgetInCome)
			{
				// 写入excel文件
				oLocalXls.insert_row_data(oItem.to_acoma_excel_string());
				
				// 加入HashMap表
				mapAcoma.put(oItem.getUnionpaydealid(), oItem);
							
				// acoma_acquirebankmoney　统计收单收益
				acoma_result.setAcoma_acquirebankmoney(acoma_result.getAcoma_acquirebankmoney() + oItem.getAcquirebankmoney());
				
				// acoma_masgetprofitmoney　统计荣邦收益
				fTemp += oItem.getMasgetprofitmoney();
			}
			
			acoma_result.setAcoma_masgetprofitmoney((long)(fTemp * 100));
			
			// acoma_bankfeeratemoney　统计收单行收益
			acoma_result.setAcoma_bankfeeratemoney(acoma_result.getAcoma_acquirebankmoney() - (long)(fTemp * 100));
			
			// 保存excel文件
			String sName = String.format("acoma_%s_%s.xls", String.valueOf(this.staffid), get_now_format_datetime("yyyyMMddHHmmss"));
			String sFile = String.format("%s%s", save_path, sName);
			oLocalXls.save(sFile);
			
			String sUrl = String.format("%s%s", this.pre_url, sName);
			acoma_result.setAcoma_file_1(sUrl);
		}
		catch (Exception ex)
		{
			this.last_error = ex.toString();
			this.request_result = 1;
		}
		
		return true;
	}
	
	private boolean prepaid_zh_acoma_datas(long nCostRate, List<ZHAcomaItem> oAcomaMasgetInCome)
	{
		if (oAcomaMasgetInCome.size() == 0)
		{
			this.last_error = "acoma data is null";
			this.request_result = 2;
			return false;
		}
		
		try
		{
			LocalXls oLocalXls = new LocalXls();
			oLocalXls.create_local_excel("交易流水号|商户名称|主账号(卡号)|商户编号|终端标示码|交易金额|银联费率|手续费|银行入账数|成本费率|手续费成本|收入|中行|浦发");
			
			mapAcoma.clear();
			for (ZHAcomaItem oItem : oAcomaMasgetInCome)
			{
				// 写入excel文件
				oLocalXls.insert_row_data(oItem.to_acoma_excel_string(nCostRate));
				
				// 加入HashMap表
				mapZh.put(oItem.getUnionpaydealid(), oItem);
			}
			
			// 保存excel文件
			String sName = String.format("acoma_%s_%s.xls", String.valueOf(this.staffid), get_now_format_datetime("yyyyMMddHHmmss"));
			String sFile = String.format("%s%s", save_path, sName);
			oLocalXls.save(sFile);
			
			String sUrl = String.format("%s%s", this.pre_url, sName);
			acoma_result.setAcoma_file_1(sUrl);
		}
		catch (Exception ex)
		{
			this.last_error = ex.toString();
			this.request_result = 1;
		}
		
		return true;
	}
	
	public String get_now_format_datetime(String sFormat)
	{
	    String temp_str="";
	    Date dt = new Date();
	    SimpleDateFormat sdf = new SimpleDateFormat(sFormat);	    
	    temp_str=sdf.format(dt);
	    
	    return temp_str;
	}
	
	/**
	 * 湖北中行文本对账
	 * @param request
	 * @param nAwardcompanyid 银联公司编号
	 * @param nAcquirercompanyid 收单行公司编号
	 * @param nSettlementcompanyid 结算行公司编号
	 * @param sBegintime 清分开始时间
	 * @param sEndtime 清分结束时间
	 * @param sFile excel文件
	 * @param sSavePath 存储目录
	 * @param sPreUrl url前缀目录
	 * @param nStaffid 员工编号
	 * @param fMerchantstoliquidatefundsmoney 用户输入，平台清分总金额
	 * @param nCost 用户输入，成本费率
	 * @param nZhCost 用户输入，中行比率
	 * @param nPfCost 用户输入，浦发比率
	 * @return
	 */
	public String requestZHReconciliation(HttpServletRequest request, long nAwardcompanyid, long nAcquirercompanyid, long nSettlementcompanyid, 
			String sBegintime, String sEndtime, String sFile,
			String sSavePath, String sPreUrl, long nStaffid, double fMerchantstoliquidatefundsmoney, long nCost, long nZhCost, long nPfCost)
	{
		ACOMADatas oAcoma = new ACOMADatas();
		ZSUMDatas oZsum = new ZSUMDatas();
		Map<String, Object> oResult = new HashMap<String, Object>();
		long nOldTime = System.currentTimeMillis();;
		Gson gson = new Gson();
		
		oAcoma.parseExcel4(sFile, 56, 0);
		oZsum.parseExcel4(sFile, 1, fMerchantstoliquidatefundsmoney, nZhCost, nPfCost);
		
		acoma_result.zh_transactionamount = String.format("%.2f", oZsum.zh_transactionamount); // 刷卡总额
		acoma_result.zh_creditcardfeerate = String.format("%.2f", oZsum.zh_creditcardfeerate); // 商户手续费
		acoma_result.zh_incoming = String.format("%.2f", oZsum.zh_incoming); // 银行入账金额
		acoma_result.zh_merchantstoliquidatefundsmoney = String.format("%.2f", oZsum.zh_merchantstoliquidatefundsmoney); // 应清分商户金额
		acoma_result.zh_platformamount = String.format("%.2f", oZsum.zh_platformamount); // 平台收益
		acoma_result.zh_mount = String.format("%.2f", oZsum.zh_mount); // 中行（0.11%）
		acoma_result.zh_pf_mount = String.format("%.2f", oZsum.zh_pf_mount); // 浦发（0.01%）
		
		List<AcomaEntity> arrEntity = oAcoma.getAcomaEntitys();
		if (arrEntity == null || arrEntity.size() == 0)
		{
			// acoma文件为空，或者解析有问题，不再对账
			oResult.put("ret", 1);
			oResult.put("message", oAcoma.getLastError());
			
			logger.error("requestReconciliation run time(" + String.valueOf(System.currentTimeMillis() - nOldTime) + ") message(" + oAcoma.getLastError() + ")");
			return oResult.toString();
		}
		AcomaZHEntity oRequest = new AcomaZHEntity();
		oRequest.setCost(nCost);
		oRequest.setZhratio(nZhCost);
		oRequest.setPfratio(nPfCost);
		oRequest.setAcomaentity(arrEntity);
		String sRequest = gson.toJson(oRequest);
		
		// 请求解析acoma的数据
		String serviceName = "rboperationsmanagerService";
		String method = "masget.rboperationsmanager.com.acoma.parseZH";
		String sResult = CommomUtil.CallApi(request, serviceName, method, sRequest);
		List<ZHAcomaItem> oAcomaMasgetInCome = get_zh_acoma_datas(gson, sResult);
		if (oAcomaMasgetInCome == null)
		{
			oResult.put("ret", request_result);
			oResult.put("message", last_error);
			
			logger.error("requestReconciliation run time(" + String.valueOf(System.currentTimeMillis() - nOldTime) + ") message(" + last_error + ")");
			return oResult.toString();
		}
		
		// 将结构转成HashMap，便于对账，同时对记录进行统计，准备excel的文件
		if (prepaid_zh_acoma_datas(nCost, oAcomaMasgetInCome) == false)
		{
			oResult.put("ret", request_result);
			oResult.put("message", last_error);
			
			logger.error("requestReconciliation run time(" + String.valueOf(System.currentTimeMillis() - nOldTime) + ") message(" + last_error + ")");
			return oResult.toString();
		}
		
		// 获取清算数据
		serviceName = "rboperationsmanagerService";
		method = "masget.rboperationsmanager.com.reconciliationjournal.query";
		
		Map<String, Object> mapData = new HashMap<String, Object>();
		mapData.put("cupcompanyid", nAwardcompanyid);
		mapData.put("acquirebankid", nAcquirercompanyid);
		mapData.put("settlementbankid", nSettlementcompanyid);
		mapData.put("begintime", sBegintime);
		mapData.put("endtime", sEndtime);
		sRequest = gson.toJson(mapData);
		
		sResult = CommomUtil.CallApi(request, serviceName, method, sRequest);
		List<ReconciliationjournalEntity> oReconciliationjournalEntity = get_journal_datas(gson, sResult);
		if (oReconciliationjournalEntity == null)
		{
			oResult.put("ret", request_result);
			oResult.put("message", last_error);
			
			logger.error("requestReconciliation run time(" + String.valueOf(System.currentTimeMillis() - nOldTime) + ") message(" + last_error + ")");
			return oResult.toString();
		}
					
		// 将结构转成HashMap，便于对账，同时对记录进行统计，准备excel的文件
		if (prepaid_journal_datas(oReconciliationjournalEntity) == false)
		{
			oResult.put("ret", request_result);
			oResult.put("message", last_error);
			
			logger.error("requestReconciliation run time(" + String.valueOf(System.currentTimeMillis() - nOldTime) + ") message(" + last_error + ")");
			return oResult.toString();
		}
					
		// 在收单行的数据文件中存在，但是在数据库中不存在			
		record_zh_acoma_data_but_settlement(nCost, oAcomaMasgetInCome);
					
		// 在数据库中存在，但是在收单行数据文件中不存在
		record_zh_settlement_data_but_acoma(oReconciliationjournalEntity);
					
		oResult.put("ret", 0);
		
		this.acoma_result.setRun_time(System.currentTimeMillis() - nOldTime);
		oResult.put("data", this.acoma_result);
		return gson.toJson(oResult);
	}
}
