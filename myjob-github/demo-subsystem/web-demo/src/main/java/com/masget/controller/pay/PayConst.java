package com.masget.controller.pay;

public class PayConst {
	/**
	 * 磁条卡交易常量
	 * @author Administrator
	 *
	 */
	public static class StripConsumeConst{
		public static final String Processing_Code="190000";//缴费、缴费冲正、消费、消费冲正、IC卡脱机消费通知
		public static final String Entry_Mode_Code_Nopin="022";//刷卡 无pin
		public static final String Entry_Mode_Code_pin="021";//刷卡有pin
		public static final String Condition_Mode="82";//消费、消费冲正、消费撤销、消费撤销冲正、IC卡脱机消费通知、消费退货
		public static final String Pin_apture_Code="06";//该域描述了服务点设备接受PIN 的最大长度
		public static final String Currency_Code="156";//人民币的货币代码为156
		public static final String Control_Information="2600000000000000";//安全控制信息 有pin 3dex算法
		public static final String Mac="FAA1B488EDD5A5D4";//mac密钥，在服务器填充 此处只是站位
		public static final String hex8Zero="0000000000000000";
	}
}