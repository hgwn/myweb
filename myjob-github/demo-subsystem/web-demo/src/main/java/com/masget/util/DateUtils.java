package com.masget.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang.time.DateFormatUtils;

/**
 * 日期工具类, 继承org.apache.commons.lang.time.DateUtils类
 */
public class DateUtils extends org.apache.commons.lang.time.DateUtils {
	
	private static String[] parsePatterns = {
		"yyyy-MM-dd", "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd HH:mm", "yyyy-MM", 
		"yyyy/MM/dd", "yyyy/MM/dd HH:mm:ss", "yyyy/MM/dd HH:mm", "yyyy/MM",
		"yyyy.MM.dd", "yyyy.MM.dd HH:mm:ss", "yyyy.MM.dd HH:mm", "yyyy.MM"};

	/**
	 * 得到当前日期字符串 格式（yyyy-MM-dd）
	 */
	public static String getDate() {
		return getDate("yyyy-MM-dd");
	}
	
	/**
	 * 得到当前日期字符串 格式（yyyy-MM-dd） pattern可以为："yyyy-MM-dd" "HH:mm:ss" "E"
	 */
	public static String getDate(String pattern) {
		return DateFormatUtils.format(new Date(), pattern);
	}
	
	/**
	 * 得到日期字符串 默认格式（yyyy-MM-dd） pattern可以为："yyyy-MM-dd" "HH:mm:ss" "E"
	 */
	public static String formatDate(Date date, Object... pattern) {
		String formatDate = null;
		if (pattern != null && pattern.length > 0) {
			formatDate = DateFormatUtils.format(date, pattern[0].toString());
		} else {
			formatDate = DateFormatUtils.format(date, "yyyy-MM-dd");
		}
		return formatDate;
	}
	
	/**
	 * 得到日期时间字符串，转换格式（yyyy-MM-dd HH:mm:ss）
	 */
	public static String formatDateTime(Date date) {
		return formatDate(date, "yyyy-MM-dd HH:mm:ss");
	}

	/**
	 * 得到当前时间字符串 格式（HH:mm:ss）
	 */
	public static String getTime() {
		return formatDate(new Date(), "HH:mm:ss");
	}

	/**
	 * 得到当前日期和时间字符串 格式（yyyy-MM-dd HH:mm:ss）
	 */
	public static String getDateTime() {
		return formatDate(new Date(), "yyyy-MM-dd HH:mm:ss");
	}

	/**
	 * 得到当前年份字符串 格式（yyyy）
	 */
	public static String getYear() {
		return formatDate(new Date(), "yyyy");
	}

	/**
	 * 得到当前月份字符串 格式（MM）
	 */
	public static String getMonth() {
		return formatDate(new Date(), "MM");
	}

	/**
	 * 得到当天字符串 格式（dd）
	 */
	public static String getDay() {
		return formatDate(new Date(), "dd");
	}

	/**
	 * 得到当前星期字符串 格式（E）星期几
	 */
	public static String getWeek() {
		return formatDate(new Date(), "E");
	}
	
	/**
	 * 日期型字符串转化为日期 格式
	 * { "yyyy-MM-dd", "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd HH:mm", 
	 *   "yyyy/MM/dd", "yyyy/MM/dd HH:mm:ss", "yyyy/MM/dd HH:mm",
	 *   "yyyy.MM.dd", "yyyy.MM.dd HH:mm:ss", "yyyy.MM.dd HH:mm" }
	 */
	public static Date parseDate(Object str) {
		if (str == null){
			return null;
		}
		try {
			return parseDate(str.toString(), parsePatterns);
		} catch (ParseException e) {
			return null;
		}
	}
	
	/**
	 * 得到日期字符串 ,格式自定义
	 */
	public static String getDateStr(Date date,String pattern) {
		return DateFormatUtils.format(date, pattern);
	}

	/**
	 * 获取过去的天数
	 * @param date
	 * @return
	 */
	public static long pastDays(Date date) {
		long t = new Date().getTime()-date.getTime();
		return t/(24*60*60*1000);
	}

	/**
	 * 获取过去的小时
	 * @param date
	 * @return
	 */
	public static long pastHour(Date date) {
		long t = new Date().getTime()-date.getTime();
		return t/(60*60*1000);
	}
	
	/**
	 * 获取过去的分钟
	 * @param date
	 * @return
	 */
	public static long pastMinutes(Date date) {
		long t = new Date().getTime()-date.getTime();
		return t/(60*1000);
	}
	
	/**
	 * 转换为时间（天,时:分:秒.毫秒）
	 * @param timeMillis
	 * @return
	 */
    public static String formatDateTime(long timeMillis){
		long day = timeMillis/(24*60*60*1000);
		long hour = (timeMillis/(60*60*1000)-day*24);
		long min = ((timeMillis/(60*1000))-day*24*60-hour*60);
		long s = (timeMillis/1000-day*24*60*60-hour*60*60-min*60);
		long sss = (timeMillis-day*24*60*60*1000-hour*60*60*1000-min*60*1000-s*1000);
		return (day>0?day+",":"")+hour+":"+min+":"+s+"."+sss;
    }
	
	/**
	 * 获取两个日期之间的天数
	 * 
	 * @param before
	 * @param after
	 * @return
	 */
	public static double getDistanceOfTwoDate(Date before, Date after) {
		long beforeTime = before.getTime();
		long afterTime = after.getTime();
		return (afterTime - beforeTime) / (1000 * 60 * 60 * 24);
	}
	
	/**
	 * 获取当前日期往后推 指定天数的日期
	 * @param day 天数
	 * @return
	 */
	public static String getDateOfBackDay(long day) {
		long dayTime=60*60*24*1000*day;
		long hh=new Date().getTime();
		long backTime=new Date().getTime()-dayTime;
		Date backDate=new Date(backTime);
		return formatDate(backDate);
	}
	
	/**
	 * 获取指定日期的
	 * @param date
	 * @return
	 */
	public static String getDateLastSecondTime(Date date) {
		long daytime=date.getTime()+60*60*24*1000-1000;
		return formatDateTime(new Date(daytime));
		
	}
	
	/**
	 * 获取指定日期的
	 * @param date
	 * @return
	 */
	public static String getDateLastSecondTime(String dateStr) {
		long daytime=parseDate(dateStr).getTime()+60*60*24*1000-1000;
		return formatDateTime(new Date(daytime));
		
	}
	
	/**
	 * 获取指定日期的最后一天
	 * @param date
	 * @return
	 */
	public static String getLastDay(Date date) {
		Calendar calendar = Calendar.getInstance();  
		calendar.setTime(date);  
		calendar.set(Calendar.DATE, calendar.getActualMaximum(Calendar.DATE));  
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd");  
		return format.format(calendar.getTime());
	}
	
	
	/**
	 * 设置开始日期，获取从该日期到当前日期的所有期间
	 * @return
	 */
	public static String getDateTerm(){
		String statTimeJson = "";
		Date startDate=DateUtils.parseDate("2014-01");
		Date nowDate=new Date();
		Calendar calender = Calendar.getInstance();
		while (startDate.before(nowDate)) {
			statTimeJson = "{\"id\":\""+DateUtils.formatDate(startDate, "yyyy-M")+"\""
            		+",\"value\":\""+DateUtils.formatDate(startDate, "yyyy年M期")+"\"},"+statTimeJson;  
			calender.setTime(startDate);
            calender.add(Calendar.MONTH, 1);
            startDate=calender.getTime();
		}
        statTimeJson = "["+statTimeJson.substring(0, statTimeJson.length()-1)+"]";
		return statTimeJson;
	}
	
	 /**
     *  比较两个字符串日期的大小
     * 
     * @param before
     * @param after
     * @return
     */
    public static int compareDateStr(String dateStr1, String dateStr2) {
        try
        {
            Date date1;
            date1 = parseDate(dateStr1, parsePatterns);
            Date date2 = parseDate(dateStr2, parsePatterns);
            return date1.compareTo(date2);
        }
        catch (ParseException e)
        {
            // TODO Auto-generated catch block 
        }
        return 0;
    }
	/**
	 * @param args
	 * @throws ParseException
	 */
	public static void main(String[] args) throws ParseException {
//		System.out.println(formatDate(parseDate("2010/3/6")));
//		System.out.println(getDate("yyyy年MM月dd日 E"));
//		long time = new Date().getTime()-parseDate("2012-11-19").getTime();
//		System.out.println(time/(24*60*60*1000));
		System.out.println(getDateTerm());
		
	}
}
