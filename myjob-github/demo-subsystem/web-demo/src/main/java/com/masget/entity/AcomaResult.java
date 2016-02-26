package com.masget.entity;

import java.util.ArrayList;
import java.util.List;

import com.masget.util.settlement.MasgetInCome;

public class AcomaResult
{
	private long run_time = 0;
	
	// ACOMA统计
	private long acoma_acquirebankmoney = 0;					// 收单收益
	private long acoma_masgetprofitmoney = 0;					//　荣邦收益
	private long acoma_bankfeeratemoney = 0;					// 收单行收益

	// 平台清算统计
	private long platform_acquirebankmoney = 0;					// 收单收益
	private long platform_masgetprofitmoney = 0;				// 荣邦收益
	private long platform_platformamount = 0;					// 荣邦平台溢出收益

	// ZSUM统计
	private long acoma_transactionamount = 0;					// 交易金额
	private long acoma_creditcardfeerate = 0;					// 手续费
	private long acoma_merchantstoliquidatefundsmoney = 0;	// 商户待清算金额

	// 平台清算统计
	private long platform_transactionamount = 0;				// 交易金额
	private long platform_creditcardfeerate = 0;				// 手续费
	private long platform_merchantstoliquidatefundsmoney = 0;	// 商户待清算金额
	
	// 下载文件字段：
	private String acoma_file_1 = "";							// ACOMA数据文件下载URL
	private String acoma_file_2 = "";							// ACOMA差异文件下载URL
	private String platform_file_1 = "";						// 平台清算流水记录文件下载URL
	private String platform_file_2 = "";						// 平台清算差异文件下载URL
	
	// 湖北中行的统计	
	public String zh_transactionamount = ""; // 刷卡总额
	public String zh_creditcardfeerate = ""; // 商户手续费
	public String zh_incoming = ""; // 银行入账金额
	public String zh_merchantstoliquidatefundsmoney = ""; // 应清分商户金额
	public String zh_platformamount = ""; // 平台收益
	public String zh_acquirebankmoney = ""; // 收单收益（中行0.11%）
	public String zh_mount = ""; // 中行（0.11%）
	public String zh_pf_mount = ""; // 浦发（0.01%）
	
	private List<MasgetInCome> acoma = null;
	private List<ZHAcomaItem> zhacoma = null;
	private List<ReconciliationjournalEntity> settlement = null;
	
	public AcomaResult()
	{
		acoma = new ArrayList<MasgetInCome>();
		settlement = new ArrayList<ReconciliationjournalEntity>();
	}
	
	public long getRun_time() {
		return run_time;
	}

	public void setRun_time(long run_time) {
		this.run_time = run_time;
	}
	
	public void addZHAcoma(ZHAcomaItem oItem)
	{
		/*
		ZHAcomaItem oTemp = new ZHAcomaItem();
		oTemp.copyfrom(oItem);
		
		try
		{
			String sTempMembername = new String(oItem.getMembername().getBytes("GBK"), "utf-8");
			oTemp.setMembername(sTempMembername);
		}
		catch (Exception ex){}
		*/
		
		this.zhacoma.add(oItem);
	}
	
	public void addAcoma(MasgetInCome oItem)
	{
		/*
		MasgetInCome oTemp = new MasgetInCome();
		oTemp.copyfrom(oItem);
		
		try
		{
			String sTempMembername = new String(oItem.getMembername().getBytes("GBK"), "utf-8");
			oTemp.setMembername(sTempMembername);
		}
		catch (Exception ex){}
		*/
		this.acoma.add(oItem);
	}
	
	public void addSettlement(ReconciliationjournalEntity oItem)
	{
		/*
		ReconciliationjournalEntity oTemp = new ReconciliationjournalEntity();
		oTemp.copyfrom(oItem);
		
		try
		{
			String sTempMembername = new String(oItem.getMembername().getBytes("GBK"), "utf-8");
			oTemp.setMembername(sTempMembername);
		}
		catch (Exception ex){}
		*/
		
		this.settlement.add(oItem);
	}

	public long getAcoma_acquirebankmoney() {
		return acoma_acquirebankmoney;
	}

	public void setAcoma_acquirebankmoney(long acoma_acquirebankmoney) {
		this.acoma_acquirebankmoney = acoma_acquirebankmoney;
	}

	public double getAcoma_masgetprofitmoney() {
		return acoma_masgetprofitmoney;
	}

	public void setAcoma_masgetprofitmoney(long acoma_masgetprofitmoney) {
		this.acoma_masgetprofitmoney = acoma_masgetprofitmoney;
	}

	public long getAcoma_bankfeeratemoney() {
		return acoma_bankfeeratemoney;
	}

	public void setAcoma_bankfeeratemoney(long acoma_bankfeeratemoney) {
		this.acoma_bankfeeratemoney = acoma_bankfeeratemoney;
	}

	public long getPlatform_acquirebankmoney() {
		return platform_acquirebankmoney;
	}

	public void setPlatform_acquirebankmoney(long platform_acquirebankmoney) {
		this.platform_acquirebankmoney = platform_acquirebankmoney;
	}

	public long getPlatform_masgetprofitmoney() {
		return platform_masgetprofitmoney;
	}

	public void setPlatform_masgetprofitmoney(long platform_masgetprofitmoney) {
		this.platform_masgetprofitmoney = platform_masgetprofitmoney;
	}

	public long getPlatform_platformamount() {
		return platform_platformamount;
	}

	public void setPlatform_platformamount(long platform_platformamount) {
		this.platform_platformamount = platform_platformamount;
	}

	public long getAcoma_transactionamount() {
		return acoma_transactionamount;
	}

	public void setAcoma_transactionamount(long acoma_transactionamount) {
		this.acoma_transactionamount = acoma_transactionamount;
	}

	public long getAcoma_creditcardfeerate() {
		return acoma_creditcardfeerate;
	}

	public void setAcoma_creditcardfeerate(long acoma_creditcardfeerate) {
		this.acoma_creditcardfeerate = acoma_creditcardfeerate;
	}

	public long getAcoma_merchantstoliquidatefundsmoney() {
		return acoma_merchantstoliquidatefundsmoney;
	}

	public void setAcoma_merchantstoliquidatefundsmoney(
			long acoma_merchantstoliquidatefundsmoney) {
		this.acoma_merchantstoliquidatefundsmoney = acoma_merchantstoliquidatefundsmoney;
	}

	public long getPlatform_transactionamount() {
		return platform_transactionamount;
	}

	public void setPlatform_transactionamount(long platform_transactionamount) {
		this.platform_transactionamount = platform_transactionamount;
	}

	public long getPlatform_creditcardfeerate() {
		return platform_creditcardfeerate;
	}

	public void setPlatform_creditcardfeerate(long platform_creditcardfeerate) {
		this.platform_creditcardfeerate = platform_creditcardfeerate;
	}

	public long getPlatform_merchantstoliquidatefundsmoney() {
		return platform_merchantstoliquidatefundsmoney;
	}
	
	public void setPlatform_merchantstoliquidatefundsmoney()
	{
		platform_merchantstoliquidatefundsmoney = platform_transactionamount - platform_creditcardfeerate;
	}

	public String getAcoma_file_1() {
		return acoma_file_1;
	}

	public void setAcoma_file_1(String acoma_file_1) {
		this.acoma_file_1 = acoma_file_1;
	}

	public String getAcoma_file_2() {
		return acoma_file_2;
	}

	public void setAcoma_file_2(String acoma_file_2) {
		this.acoma_file_2 = acoma_file_2;
	}

	public String getPlatform_file_1() {
		return platform_file_1;
	}

	public void setPlatform_file_1(String platform_file_1) {
		this.platform_file_1 = platform_file_1;
	}

	public String getPlatform_file_2() {
		return platform_file_2;
	}

	public void setPlatform_file_2(String platform_file_2) {
		this.platform_file_2 = platform_file_2;
	}

	public List<MasgetInCome> getAcoma() {
		return acoma;
	}

	public void setAcoma(List<MasgetInCome> acoma) {
		this.acoma = acoma;
	}

	public List<ReconciliationjournalEntity> getSettlement() {
		return settlement;
	}

	public void setSettlement(List<ReconciliationjournalEntity> settlement) {
		this.settlement = settlement;
	}
	
	
}
