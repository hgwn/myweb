package com.masget.entity;

/**
 * 将解析出来的字段用于请求对账数据
 * @author cao
 */
public class AcomaEntity
{
	protected long transactionamount = 0;					// 交易金额，以分为单位
	protected String merchantcategorycode = "";				// 商户类型
	protected String terminalnumber= "";					// 终端标示码，终端编号
	protected String bussinesstime= "";						// 交易时间，格式为MMddHHmmss
	protected String merchantnumber= "";					// 商户编号
	protected String bankcardno = "";						// 主账号，卡号
	protected String unionpaydealid = "";					// 交易流水号	
	protected long acquirebankmoney = 0;					// 收单收益
	protected String cancelflag = "";						// 退单标志

	public AcomaEntity()
	{
		
	}
	
	public AcomaEntity(long nTransactionamount, String sMerchantcategorycode, String sTerminalnumber, 
			String sBussinesstime, String sMerchantnumber, String sBankcardno, String sUnionpaydealid, 
			long nAcquirebankmoney, String sCancelflag)
	{
		transactionamount = nTransactionamount;					// 交易金额，以分为单位
		merchantcategorycode = sMerchantcategorycode;			// 商户类型
		terminalnumber= translate_number_string(sTerminalnumber);					// 终端标示码，终端编号
		bussinesstime= translate_number_string(sBussinesstime);					// 交易时间，格式为MMddHHmmss
		merchantnumber= translate_number_string(sMerchantnumber);					// 商户编号
		bankcardno = translate_number_string(sBankcardno);						// 主账号，卡号
		unionpaydealid = translate_number_string(sUnionpaydealid);					// 交易流水号
		acquirebankmoney = nAcquirebankmoney;
		cancelflag = sCancelflag;
	}
	
	private String translate_number_string(String sParams)
	{
		String sTemp = "";
		Double fTemp = Double.parseDouble(sParams);
		sTemp = String.valueOf(fTemp.longValue());
		return sTemp;
	}
	
	public long getTransactionamount()
	{
		return transactionamount;
	}
	
	public String getMerchantcategorycode()
	{
		return merchantcategorycode;
	}
	
	public String getTerminalnumber()
	{
		return terminalnumber;
	}
	
	public String getBussinesstime()
	{
		return bussinesstime;
	}
	
	public String getMerchantnumber()
	{
		return merchantnumber;
	}
	
	public String getBankcardno()
	{
		return bankcardno;
	}
	
	public String getUnionpaydealid()
	{
		return unionpaydealid;
	}
	
	public String getCancelflag() {
		return cancelflag;
	}

	public void setCancelflag(String cancelflag) {
		this.cancelflag = cancelflag;
	}

	public long getAcquirebankmoney() {
		return acquirebankmoney;
	}

	public void setAcquirebankmoney(long acquirebankmoney) {
		this.acquirebankmoney = acquirebankmoney;
	}
}
