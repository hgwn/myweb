package com.masget.util;

import com.masget.security.AesEncryption;
import com.masget.security.MD5Util;
import com.masget.utils.HttpsUtil;
import com.masget.utils.TimeUtil;





public class ApiUtil {

	public static String login(String OpenApiUrl, String AppId,
			String AppPwd, String AppKey){
		
		String result = "";

		try {
			String method = "masget.base.safe.user.login";
			String format = "json";
			String encryptdata = AesEncryption.Encrypt("{\"loginname\":\""
					+ AppId + "\",\"loginpwd\":\""
					+ MD5Util.string2MD5(AppPwd) + "\"}", AppKey, AppKey);
			String v = "1010";
			String time = TimeUtil.getTime();
			String signstr = MD5Util.string2MD5(AppId + method + format
					+ encryptdata + v + time + AppKey);
			String getdata = "appid=" + AppId + "&method=" + method
					+ "&format=" + format + "&data=" + encryptdata + "&v=" + v
					+ "&timestamp=" + time + "&sign=" + signstr;
			String url = OpenApiUrl + "?" + getdata;
			result = HttpsUtil.doSslGet(url, "utf-8");
		} catch (Exception ex) {
			ex.printStackTrace();
			result = ex.getMessage();
		}

		return result;
		
	}
	
	/*
	 * ��ȡ���ýӿ�Ȩ�� /// <param name="OpenApiUrl">�����Խӿڵ�ַ</param> /// <param
	 * name="AppId">�ӿ�ID</param> /// <param name="AppKey">��Կ</param>
	 */
	public static String GetToken(String OpenApiUrl, String AppId,
			String AppPwd, String AppKey) {
		String result = "";

		try {
			String method = "masget.base.safe.user.token.get";
			String format = "json";
			String encryptdata = AesEncryption.Encrypt("{\"loginname\":\""
					+ AppId + "\",\"loginpwd\":\""
					+ MD5Util.string2MD5(AppPwd) + "\"}", AppKey, AppKey);
			String v = "1010";
			String time = TimeUtil.getTime();
			String signstr = MD5Util.string2MD5(AppId + method + format
					+ encryptdata + v + time + AppKey);
			String getdata = "appid=" + AppId + "&method=" + method
					+ "&format=" + format + "&data=" + encryptdata + "&v=" + v
					+ "&timestamp=" + time + "&sign=" + signstr;
			String url = OpenApiUrl + "?" + getdata;
			result = HttpsUtil.doSslGet(url, "utf-8");
		} catch (Exception ex) {
			ex.printStackTrace();
			result = ex.getMessage();
		}

		return result;
	}

	public static String MethodInvoke(String OpenApiUrl, String AppId, 
			String Session, String AppKey, String Method, String data) {
		String result = "";

		try {
			String format = "json";
			String encryptdata = AesEncryption.Encrypt(data, AppKey, AppKey);
			String v = "1010";
			String time = TimeUtil.getTime();
			String signstr = MD5Util.string2MD5(AppId + Method + format
					+ encryptdata + v + time + Session + AppKey);
			String getdata = "appid=" + AppId + "&method=" + Method
					+ "&format=" + format + "&data=" + encryptdata + "&v=" + v
					+ "&timestamp=" + time + "&session=" + Session + "&sign="
					+ signstr;
			String url = OpenApiUrl + "?" + getdata;
			System.out.println(url);
			result = HttpsUtil.doSslGet(url, "utf-8");
		} catch (Exception ex) {
			ex.printStackTrace();
			result = ex.getMessage();
		}

		return result;
	}
}
