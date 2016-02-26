package com.masget.entity;

public class ReconciliationjournalEntity
{
	private String unionpaydealid = "";					// 交易流水号
	private String membername = "";						//商户名称
	private String bankcardno = "";						// 主账号，卡号
	private String merchantnumber= "";					// 商户编号
	private String terminalnumber= "";					// 终端标示码，终端编号
	private long transactionamount = 0;					// 交易金额，以分为单位
	private long merchantstoliquidatefundsmoney = 0;	//商户待清算金额
	private long creditcardfeerate = 0;					//手续费
	private long acquirebankmoney = 0;					//收单收益
	private long masgetprofitmoney = 0;					//荣邦收益
	private long unionpayfeeratemoney = 0;				//银联收益
	private long cardbankfeeratemoney = 0;				//发卡收益
	private String bussinesstime= "";					// 交易时间，格式为MMddHHmmss
	private long platformamount = 0;					// 荣邦平台溢出收益
	
	public String to_journal_excel_string()
	{
		String sTemp = String.format("%s|%s|%s|%s|%s|%.02f|%.02f|%.02f|%.02f|%.02f|%.02f|%.02f|%s|%.02f", 
				unionpaydealid,
				membername,
				bankcardno,
				merchantnumber,
				terminalnumber,
				(double)transactionamount / 100,
				(double)merchantstoliquidatefundsmoney / 100,
				(double)creditcardfeerate / 100,
				(double)acquirebankmoney / 100,
				(double)masgetprofitmoney / 100,
				(double)unionpayfeeratemoney / 100,
				(double)cardbankfeeratemoney / 100,
				bussinesstime,
				(double)platformamount / 100);
		return sTemp;
	}
	
	public void copyfrom(ReconciliationjournalEntity oItem)
	{
		unionpaydealid = oItem.unionpaydealid;					// 交易流水号
		membername = oItem.membername;						//商户名称
		bankcardno = oItem.bankcardno;						// 主账号，卡号
		merchantnumber= oItem.merchantnumber;					// 商户编号
		terminalnumber= oItem.terminalnumber;					// 终端标示码，终端编号
		transactionamount = oItem.transactionamount;					// 交易金额，以分为单位
		merchantstoliquidatefundsmoney = oItem.merchantstoliquidatefundsmoney;	//商户待清算金额
		creditcardfeerate = oItem.creditcardfeerate;					//手续费
		acquirebankmoney = oItem.acquirebankmoney;					//收单收益
		masgetprofitmoney = oItem.masgetprofitmoney;					//荣邦收益
		unionpayfeeratemoney = oItem.unionpayfeeratemoney;				//银联收益
		cardbankfeeratemoney = oItem.cardbankfeeratemoney;				//发卡收益
		bussinesstime= oItem.bussinesstime;					// 交易时间，格式为MMddHHmmss
		platformamount = oItem.platformamount;					// 荣邦平台溢出收益
	}
		
	public String getUnionpaydealid()
	{
		return unionpaydealid;
	}
	
	public String getMembername() {
		return membername;
	}
	public String getBankcardno() {
		return bankcardno;
	}
	public String getMerchantnumber() {
		return merchantnumber;
	}
	public String getTerminalnumber() {
		return terminalnumber;
	}
	public long getTransactionamount() {
		return transactionamount;
	}
	public long getMerchantstoliquidatefundsmoney() {
		return merchantstoliquidatefundsmoney;
	}
	public long getCreditcardfeerate() {
		return creditcardfeerate;
	}
	public long getAcquirebankmoney() {
		return acquirebankmoney;
	}
	public long getMasgetprofitmoney() {
		return masgetprofitmoney;
	}
	public long getUnionpayfeeratemoney() {
		return unionpayfeeratemoney;
	}
	public long getCardbankfeeratemoney() {
		return cardbankfeeratemoney;
	}
	public String getBussinesstime() {
		return bussinesstime;
	}
	public long getPlatformamount() {
		return platformamount;
	}
	public void setUnionpaydealid(String unionpaydealid) {
		this.unionpaydealid = unionpaydealid;
	}
	public void setMembername(String membername) {
		this.membername = membername;
	}
	public void setBankcardno(String bankcardno) {
		this.bankcardno = bankcardno;
	}
	public void setMerchantnumber(String merchantnumber) {
		this.merchantnumber = merchantnumber;
	}
	public void setTerminalnumber(String terminalnumber) {
		this.terminalnumber = terminalnumber;
	}
	public void setTransactionamount(long transactionamount) {
		this.transactionamount = transactionamount;
	}
	public void setMerchantstoliquidatefundsmoney(
			long merchantstoliquidatefundsmoney) {
		this.merchantstoliquidatefundsmoney = merchantstoliquidatefundsmoney;
	}
	public void setCreditcardfeerate(long creditcardfeerate) {
		this.creditcardfeerate = creditcardfeerate;
	}
	public void setAcquirebankmoney(long acquirebankmoney) {
		this.acquirebankmoney = acquirebankmoney;
	}
	public void setMasgetprofitmoney(long masgetprofitmoney) {
		this.masgetprofitmoney = masgetprofitmoney;
	}
	public void setUnionpayfeeratemoney(long unionpayfeeratemoney) {
		this.unionpayfeeratemoney = unionpayfeeratemoney;
	}
	public void setCardbankfeeratemoney(long cardbankfeeratemoney) {
		this.cardbankfeeratemoney = cardbankfeeratemoney;
	}
	public void setBussinesstime(String bussinesstime) {
		this.bussinesstime = bussinesstime;
	}
	public void setPlatformamount(long platformamount) {
		this.platformamount = platformamount;
	}
	
	
}
