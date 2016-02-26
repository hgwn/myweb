package com.masget.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 *加载邮箱修改密码发送内容 
 */
public class ResetPasswordUtil {
	/**修改密码链接*/
	public static String resetPasswordHref;
	/**找回密码链接*/
	public static String forgetpassword;
	/**找回密码链接过期时间*/
	public static int outtime;
	/**系统地址*/
	public static String systemAddress;
	
	static{
		try {
			Properties pro = new Properties();
			InputStream is = ResetPasswordUtil.class.getResourceAsStream("/resetpassword.properties");
			pro.load(is);
			resetPasswordHref = pro.getProperty("resetPasswordHref");
			forgetpassword = pro.getProperty("forgetpassword");
			outtime = Integer.parseInt(pro.getProperty("outtime"));
			systemAddress = pro.getProperty("systemAddress");
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}

}
