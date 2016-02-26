package com.masget.entity;

/*
 * 接口回应给WEB的controller层的数据结构 
 */

public class ZHAcomaItem
{
	private long transactionamount = 0;				// 交易金额，以分为单位
	private String merchantcategorycode = "";		// 商户类型
	private String terminalnumber= "";				// 终端标示码，终端编号
	private String bussinesstime= "";				// 交易时间，格式为MMddHHmmss
	private String merchantnumber= "";				// 商户编号
	private String bankcardno = "";					// 主账号，卡号
	private String unionpaydealid = "";				// 交易流水号	
	
	private String membername = "";					//商户名称
	private double feerate = 0;						//费率
	private double creditcardfeerate = 0;			//手续费
	private double bankfee;							// 银行入账数
	private double creditcardcost;					// 手续费成本
	private double incoming;						// 收入
	private double zhincoming;						// 中行（0.11%）
	private double pfincoming;						// 浦发（0.01%）
	
	public void init_by_acomaentity(AcomaEntity oItem)
	{
		transactionamount = oItem.getTransactionamount();		// 交易金额，以分为单位
		merchantcategorycode = oItem.getMerchantcategorycode();	// 商户类型
		terminalnumber = oItem.getTerminalnumber();				// 终端标示码，终端编号
		bussinesstime = oItem.getBussinesstime();				// 交易时间，格式为MMddHHmmss
		merchantnumber = oItem.getMerchantnumber();				// 商户编号
		bankcardno = oItem.getBankcardno();						// 主账号，卡号
		unionpaydealid = oItem.getUnionpaydealid();				// 交易流水号
	}
	
	public String to_acoma_excel_string(long nCostRate)
	{
		// 交易流水号|商户名称|主账号(卡号)|商户编号|终端标示码|交易金额|银联费率|手续费|银行入账数|成本费率|手续费成本|收入|中行|浦发
		return String.format("%s|%s|%s|%s|%s|%.02f|%.4f|%.2f|%.2f|%.4f|%.2f|%.2f|%.2f|%.2f", 
				unionpaydealid, membername, bankcardno, merchantnumber, terminalnumber, (double)transactionamount / 100,
				feerate, creditcardfeerate, bankfee, (double)nCostRate / 10000, creditcardcost,
				incoming, zhincoming, pfincoming);
	}
	
	public void copyfrom(ZHAcomaItem oItem)
	{
		transactionamount = oItem.transactionamount;				// 交易金额，以分为单位
		merchantcategorycode = oItem.merchantcategorycode;		// 商户类型
		terminalnumber= oItem.terminalnumber;				// 终端标示码，终端编号
		bussinesstime= oItem.bussinesstime;				// 交易时间，格式为MMddHHmmss
		merchantnumber= oItem.merchantnumber;				// 商户编号
		bankcardno = oItem.bankcardno;					// 主账号，卡号
		unionpaydealid = oItem.unionpaydealid;				// 交易流水号			
		membername = oItem.membername;					//商户名称
		feerate = oItem.feerate;						//费率
		creditcardfeerate = oItem.creditcardfeerate;			//手续费
		bankfee = oItem.bankfee;							// 银行入账数
		creditcardcost = oItem.creditcardcost;					// 手续费成本
		incoming = oItem.incoming;						// 收入
		zhincoming = oItem.zhincoming;						// 中行（0.11%）
		pfincoming = oItem.pfincoming;						// 浦发（0.01%）
	}
	
	public long getTransactionamount() {
		return transactionamount;
	}
	public String getMerchantcategorycode() {
		return merchantcategorycode;
	}
	public String getTerminalnumber() {
		return terminalnumber;
	}
	public String getBussinesstime() {
		return bussinesstime;
	}
	public String getMerchantnumber() {
		return merchantnumber;
	}
	public String getBankcardno() {
		return bankcardno;
	}
	public String getUnionpaydealid() {
		return unionpaydealid;
	}
	public String getMembername() {
		return membername;
	}
	public double getFeerate() {
		return feerate;
	}
	public double getCreditcardfeerate() {
		return creditcardfeerate;
	}
	public double getBankfee() {
		return bankfee;
	}
	public double getCreditcardcost() {
		return creditcardcost;
	}
	public double getIncoming() {
		return incoming;
	}
	public double getZhincoming() {
		return zhincoming;
	}
	public double getPfincoming() {
		return pfincoming;
	}
	public void setTransactionamount(long transactionamount) {
		this.transactionamount = transactionamount;
	}
	public void setMerchantcategorycode(String merchantcategorycode) {
		this.merchantcategorycode = merchantcategorycode;
	}
	public void setTerminalnumber(String terminalnumber) {
		this.terminalnumber = terminalnumber;
	}
	public void setBussinesstime(String bussinesstime) {
		this.bussinesstime = bussinesstime;
	}
	public void setMerchantnumber(String merchantnumber) {
		this.merchantnumber = merchantnumber;
	}
	public void setBankcardno(String bankcardno) {
		this.bankcardno = bankcardno;
	}
	public void setUnionpaydealid(String unionpaydealid) {
		this.unionpaydealid = unionpaydealid;
	}
	public void setMembername(String membername) {
		this.membername = membername;
	}
	public void setFeerate(double feerate) {
		this.feerate = feerate;
	}
	public void setCreditcardfeerate(double creditcardfeerate) {
		this.creditcardfeerate = creditcardfeerate;
	}
	public void setBankfee(double bankfee) {
		this.bankfee = bankfee;
	}
	public void setCreditcardcost(double creditcardcost) {
		this.creditcardcost = creditcardcost;
	}
	public void setIncoming(double incoming) {
		this.incoming = incoming;
	}
	public void setZhincoming(double zhincoming) {
		this.zhincoming = zhincoming;
	}
	public void setPfincoming(double pfincoming) {
		this.pfincoming = pfincoming;
	}
	
	
}
