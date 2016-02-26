package com.masget.util.settlement;

import java.util.ArrayList;
import java.util.List;

import com.masget.entity.AcomaEntity;

public class MasgetInCome extends AcomaEntity
{
	private String membername = "";						// 商户名称
	private double feerate = 0;							// 费率
	private double merchantstoliquidatefundsmoney = 0;	// 商户待清算金额	
	private double masgetprofitmoney = 0;				// 荣邦收益
	private double cardbankfeeratemoney = 0;			// 发卡收益
	private double unionpayfeeratemoney = 0;			// 银联收益
	private double cupprofitmoney = 0;					// 银联分润
	private double awardprofitmoney = 0;				// 机具提供方分润
	private double platformamount = 0;					// 荣邦平台溢出收益
	private double creditcardfeerate = 0;				// 手续费
	
	public double getCreditcardfeerate() {
		return creditcardfeerate;
	}

	public void setCreditcardfeerate(double creditcardfeerate) {
		this.creditcardfeerate = creditcardfeerate;
	}

	public String to_acoma_excel_string()
	{
		String sTemp = String.format("%s|%s|%s|%s|%s|%.02f|%.02f|%.02f|%.02f|%.02f|%.02f|%.02f|%s|%.02f", 
				unionpaydealid,
				membername,
				bankcardno,
				merchantnumber,
				terminalnumber,
				(double)transactionamount / 100,
				merchantstoliquidatefundsmoney,
				creditcardfeerate,
				(double)acquirebankmoney / 100,
				masgetprofitmoney,
				unionpayfeeratemoney,
				cardbankfeeratemoney,
				bussinesstime,
				feerate);
		return sTemp;
	}
	
	public List<Object> to_acoma_excel_cell()
	{
		List<Object> oCells = new ArrayList<Object>();
		oCells.add(unionpaydealid);
		oCells.add(membername);
		oCells.add(bankcardno);
		oCells.add(merchantnumber);
		oCells.add(terminalnumber);
		oCells.add((double)transactionamount / 100);
		oCells.add(merchantstoliquidatefundsmoney);
		oCells.add(creditcardfeerate);
		oCells.add(acquirebankmoney);
		oCells.add(masgetprofitmoney);
		oCells.add(unionpayfeeratemoney);
		oCells.add(cardbankfeeratemoney);
		oCells.add(bussinesstime);
		oCells.add(feerate);
		
		return oCells;
	}
	
	public void copyfrom(MasgetInCome oItem)
	{
		transactionamount = oItem.transactionamount;					// 交易金额，以分为单位
		merchantcategorycode = oItem.merchantcategorycode;			// 商户类型
		terminalnumber = oItem.terminalnumber;					// 终端标示码，终端编号
		bussinesstime = oItem.bussinesstime;					// 交易时间，格式为MMddHHmmss
		merchantnumber = oItem.merchantnumber;					// 商户编号
		bankcardno = oItem.bankcardno;						// 主账号，卡号
		unionpaydealid = oItem.unionpaydealid;
		membername = oItem.membername;						// 商户名称
		feerate = oItem.feerate;							// 费率
		merchantstoliquidatefundsmoney = oItem.merchantstoliquidatefundsmoney;	// 商户待清算金额
		creditcardfeerate = oItem.creditcardfeerate;				// 手续费
		acquirebankmoney = oItem.acquirebankmoney;				// 收单收益
		masgetprofitmoney = oItem.masgetprofitmoney;				// 荣邦收益
		cardbankfeeratemoney = oItem.cardbankfeeratemoney;			// 发卡收益
		unionpayfeeratemoney = oItem.unionpayfeeratemoney;			// 银联收益
		cupprofitmoney = oItem.cupprofitmoney;					// 银联分润
		awardprofitmoney = oItem.acquirebankmoney;				// 机具提供方分润
		platformamount = oItem.platformamount;
	}
	
	public double getPlatformamount() {
		return platformamount;
	}

	public void setPlatformamount(double platformamount) {
		this.platformamount = platformamount;
	}

	public MasgetInCome()
	{
		
	}

	public String getMembername() {
		return membername;
	}

	public void setMembername(String membername) {
		this.membername = membername;
	}

	public double getFeerate() {
		return feerate;
	}

	public void setFeerate(double feerate) {
		this.feerate = feerate;
	}

	public double getMerchantstoliquidatefundsmoney() {
		return merchantstoliquidatefundsmoney;
	}

	public void setMerchantstoliquidatefundsmoney(
			double merchantstoliquidatefundsmoney) {
		this.merchantstoliquidatefundsmoney = merchantstoliquidatefundsmoney;
	}
	
	public double getMasgetprofitmoney() {
		return masgetprofitmoney;
	}

	public void setMasgetprofitmoney(double masgetprofitmoney) {
		this.masgetprofitmoney = masgetprofitmoney;
	}

	public double getCardbankfeeratemoney() {
		return cardbankfeeratemoney;
	}

	public void setCardbankfeeratemoney(double cardbankfeeratemoney) {
		this.cardbankfeeratemoney = cardbankfeeratemoney;
	}

	public double getUnionpayfeeratemoney() {
		return unionpayfeeratemoney;
	}

	public void setUnionpayfeeratemoney(double unionpayfeeratemoney) {
		this.unionpayfeeratemoney = unionpayfeeratemoney;
	}

	public double getCupprofitmoney() {
		return cupprofitmoney;
	}

	public void setCupprofitmoney(double cupprofitmoney) {
		this.cupprofitmoney = cupprofitmoney;
	}

	public double getAwardprofitmoney() {
		return awardprofitmoney;
	}

	public void setAwardprofitmoney(double awardprofitmoney) {
		this.awardprofitmoney = awardprofitmoney;
	}
	
	
}
