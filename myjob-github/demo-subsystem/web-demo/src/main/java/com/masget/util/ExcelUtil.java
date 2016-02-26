package com.masget.util;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.model.Workbook;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.CellRangeAddress;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.hssf.util.Region;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class ExcelUtil {

	/**
	 * 读取Excel的内容，第一维数组存储的是一行中格列的值，二维数组存储的是多少个行
	 * 
	 * @param file
	 *            读取数据的源Excel
	 * @param ignoreRows
	 *            读取数据忽略的行数，比喻行头不需要读入 忽略的行数为1
	 * @return 读出的Excel中数据的内容
	 * @throws FileNotFoundException
	 * @throws IOException
	 */
	public static List<Map<String, Object>> readExcelData(File file,
			int ignoreRows, List<String> keyList) throws FileNotFoundException,
			IOException {
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		int rowSize = 0;
		BufferedInputStream in = new BufferedInputStream(new FileInputStream(
				file));
		// 打开HSSFWorkbook
		POIFSFileSystem fs = new POIFSFileSystem(in);
		HSSFWorkbook wb = new HSSFWorkbook(fs);
		HSSFCell cell = null;
		for (int sheetIndex = 0; sheetIndex < wb.getNumberOfSheets(); sheetIndex++) {
			HSSFSheet st = wb.getSheetAt(sheetIndex);
			// 第一行为标题，不取
			for (int rowIndex = ignoreRows; rowIndex <= st.getLastRowNum(); rowIndex++) {
				HSSFRow row = st.getRow(rowIndex);
				if (row == null) {
					continue;
				}
				int tempRowSize = row.getLastCellNum() + 1;
				if (tempRowSize > rowSize) {
					rowSize = tempRowSize;
				}
				Map<String, Object> values = new HashMap<String, Object>();
				boolean hasValue = false;
				int columnIndex = 0;
				for (String keyItem : keyList) {
					String value = "";
					cell = row.getCell(columnIndex);
					if (cell != null) {
						value = ExcelUtil.getCellValue(cell);
					}
					if (columnIndex++ == 0 && value.trim().equals("")) {
						break;
					}
					values.put(keyItem, value);
					hasValue = true;
				}
				if (hasValue) {
					result.add(values);
				}
			}
		}
		in.close();
		return result;
	}

	public static String getCellValue(HSSFCell cell) {
		if (cell == null)
			return "";

		String value = "";
		switch (cell.getCellType()) {
		case HSSFCell.CELL_TYPE_STRING:
			value = cell.getStringCellValue();
			break;
		case HSSFCell.CELL_TYPE_NUMERIC:
			if (HSSFDateUtil.isCellDateFormatted(cell)) {
				Date date = cell.getDateCellValue();
				if (date != null) {
					value = new SimpleDateFormat("yyyy-MM-dd").format(date);
				} else {
					value = "";
				}
			} else {
				value = new DecimalFormat("0").format(cell
						.getNumericCellValue());
			}
			break;
		case HSSFCell.CELL_TYPE_FORMULA:
			// 导入时如果为公式生成的数据则无值
			if (!cell.getStringCellValue().equals("")) {
				value = cell.getStringCellValue();
			} else {
				value = cell.getNumericCellValue() + "";
			}
			break;
		case HSSFCell.CELL_TYPE_BLANK:
			break;
		case HSSFCell.CELL_TYPE_ERROR:
			value = "";
			break;
		case HSSFCell.CELL_TYPE_BOOLEAN:
			value = (cell.getBooleanCellValue() == true ? "Y" : "N");
			break;
		default:
			value = "";
		}

		return value;
	}

	public static void writeDataToExcel(List<Map<String, Object>> list,
			List<String> headList, List<String> keyList, String path,
			String sheetName) throws Exception {
		// 第一步，创建一个webbook，对应一个Excel文件
		HSSFWorkbook wb = new HSSFWorkbook();
		// 第二步，在webbook中添加一个sheet,对应Excel文件中的sheet
		HSSFSheet sheet = wb.createSheet(sheetName);
		// 第三步，在sheet中添加表头第0行,注意老版本poi对Excel的行数列数有限制short
		HSSFRow row = sheet.createRow((int) 0);
		// 第四步，创建单元格，并设置值表头 设置表头居中
		HSSFCellStyle style = wb.createCellStyle();
		style.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 创建一个居中格式

		int headIndex = 0;
		for (String headItem : headList) {
			HSSFCell cell = row.createCell(headIndex++);
			cell.setCellValue(headItem);
			cell.setCellStyle(style);
		}

		try {
			for (int i = 0; i < list.size(); i++) {
				row = sheet.createRow((int) i + 1);
				Map<String, Object> stu = (Map<String, Object>) list.get(i);
				// 第四步，创建单元格，并设置值
				int keyIndex = 0;
				for (String keyItem : keyList) {
					String value="";
					if(stu.containsKey(keyItem)){
						value=stu.get(keyItem).toString();
					}
					row.createCell(keyIndex++).setCellValue(value);
				}
			}
		} catch (Exception e) {
			throw e;
		}
		// 第六步，将文件存到指定位置
		try {
			FileOutputStream fout = new FileOutputStream(path);
			wb.write(fout);
			fout.close();
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}
	
	/**
	 * 满足销售单的excel导出
	 * @param list
	 * @param headList
	 * @param keyList
	 * @param path
	 * @param sheetName
	 * @throws Exception
	 */
	public static void writeDataToExcelOrders(List<Map<String, Object>> list,Integer sum,
			List<String> headList, List<String> keyList, String path,String ordernum,String createdtime,
			String buyername,String buyerphone, String buyeraddress,String buyercompanyname,
			String totgoodsqty,String totgoodsmoney,
			String sheetName) throws Exception {
		// 第一步，创建一个webbook，对应一个Excel文件
		HSSFWorkbook wb = new HSSFWorkbook();
		
		// 第二步，在webbook中添加一个sheet,对应Excel文件中的sheet
		HSSFSheet sheet = wb.createSheet(sheetName);
		
		//设置列宽6000  （从0开始数） 
        sheet.setColumnWidth(0, 6000);  
        sheet.setColumnWidth(1, 6000);  
        sheet.setColumnWidth(2, 6000);  
        sheet.setColumnWidth(3, 6000);  
        sheet.setColumnWidth(4, 6000); 
        sheet.setColumnWidth(5, 6000);  
        sheet.setColumnWidth(6, 6000);  
        sheet.setColumnWidth(7, 6000); 
        
        // 第三步，创建单元格，并设置值表头 设置表头居中 （设置总格式）
 		HSSFCellStyle style = wb.createCellStyle();
 		style.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 创建一个居中格式
 		style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);//垂直居中  
 		
        //创建第一页的第一行  
        HSSFRow row = sheet.createRow((short) 0);   
        //设置行高500    
        row.setHeight((short)900);  
        //合并单元格，参数依次为起始行，结束行，起始列，结束列  
        sheet.addMergedRegion(new CellRangeAddress(0, (short) 0, 0, (short) 7)); 
        
        //设置单个属性
        HSSFCellStyle style2 = wb.createCellStyle();
        
        style2.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());//背景颜色
        style2.setFillPattern(CellStyle.SOLID_FOREGROUND);//背景颜色
        
        style2.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 创建一个居中格式
 		style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);//垂直居中  
 		
 		//生成一个字体
        HSSFFont font=wb.createFont();
        font.setColor(HSSFColor.BLACK.index);//HSSFColor.VIOLET.index //字体颜色
        font.setFontHeightInPoints((short)20);//字体大小
        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);         //字体增粗
       //把字体应用到当前的样式
        style2.setFont(font);
        /**字体end*/
        
        //创建第一行的第一个单元格  
        HSSFCell ce = row.createCell(0); 
        ce.setCellValue("销售单"); // 表格的第一行第一列显示的数据      
        ce.setCellStyle(style2); // 样式，居中 ，背景颜色，字体
        
		
        //创建第一页的第2行 
        HSSFRow row2 = sheet.createRow((short) 1); 
        
        row2.setHeight((short)500);
        sheet.addMergedRegion(new CellRangeAddress(1, (short) 1, 0, (short) 1));
        sheet.addMergedRegion(new CellRangeAddress(1, (short) 1, 6, (short) 7));
        
        HSSFCell ce21 = row2.createCell(0);     
        ce21.setCellValue("订单号"); // 表格的第二行第一列显示的数据      
        ce21.setCellStyle(style); // 样式，居中  
        HSSFCell ce22 = row2.createCell(2);     
        
            ce22.setCellValue(ordernum); // 表格的第二行第二列显示的数据    
        
        HSSFCell ce23 = row2.createCell(3);     
        ce23.setCellValue("下单日期"); // 表格的第二行第三列显示的数据      
        ce23.setCellStyle(style); // 样式，居中  
        HSSFCell ce24 = row2.createCell(4);     
       
            ce24.setCellValue(createdtime); // 表格的第二行第四列显示的数据      
        
        
        HSSFCell ce25 = row2.createCell(5);     
        ce25.setCellValue("公司名称"); // 表格的第二行第五列显示的数据      
        ce25.setCellStyle(style); // 样式，居中  
        HSSFCell ce26 = row2.createCell(6);     
       
            ce26.setCellValue(buyercompanyname); // 表格的第二行第六列显示的数据    
          
          
        //创建第一页的第3行 
        HSSFRow row3 = sheet.createRow((short) 2); 
        
        row3.setHeight((short)500);
        sheet.addMergedRegion(new CellRangeAddress(2, (short) 2, 0, (short) 1)); 
        sheet.addMergedRegion(new CellRangeAddress(2, (short) 2, 6, (short) 7));
        
        HSSFCell ce31 = row3.createCell(0);     
        ce31.setCellValue("收件人"); // 表格的第3行第一列显示的数据      
        ce31.setCellStyle(style); // 样式，居中  
        HSSFCell ce32 = row3.createCell(2);     
       
            ce32.setCellValue(buyername); // 表格的第3行第二列显示的数据      
        
        HSSFCell ce33 = row3.createCell(3);     
        ce33.setCellValue("联系电话"); // 表格的第三行第三列显示的数据      
        ce33.setCellStyle(style); // 样式，居中  
        HSSFCell ce34 = row3.createCell(4);     
       
            ce34.setCellValue(buyerphone); // 表格的第三行第四列显示的数据     
        
        
        HSSFCell ce35 = row3.createCell(5);     
        ce35.setCellValue("收货地址"); // 表格的第三行第5列显示的数据      
        ce35.setCellStyle(style); // 样式，居中  
        HSSFCell ce36 = row3.createCell(6);     
      
            ce36.setCellValue(buyeraddress); // 表格的第三行第6列显示的数据     
        
        
        //创建第一页的第4行  
        HSSFRow row4 = sheet.createRow((short) 3);   
        //设置行高500    
        row4.setHeight((short)700);  
        //合并单元格，参数依次为起始行，结束行，起始列，结束列  
        sheet.addMergedRegion(new CellRangeAddress(3, (short) 3, 0, (short) 7)); 
        
        HSSFCellStyle style3 = wb.createCellStyle();
        
        style3.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style3.setFillPattern(CellStyle.SOLID_FOREGROUND);
        style3.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 创建一个居中格式
        style3.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);//垂直居中  
        
        //生成一个字体
        HSSFFont font2=wb.createFont();
        font2.setColor(HSSFColor.BLACK.index);//HSSFColor.VIOLET.index //字体颜色
        font2.setFontHeightInPoints((short)16);
        //font2.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);         //字体增粗
       //把字体应用到当前的样式
        style3.setFont(font2);
        /**字体end*/
        
        //创建第一行的第一个单元格  
        HSSFCell ce41 = row4.createCell(0);     
        ce41.setCellValue("销售单明细"); // 表格的第4行第一列显示的数据      
        ce41.setCellStyle(style3); // 样式，居中 
        
        
        
        
        //创建第一页的第5行 
        HSSFRow row5 = sheet.createRow((short) 4); 
        
        row5.setHeight((short)500);
        sheet.addMergedRegion(new CellRangeAddress(4, (short) 4, 0, (short) 0)); 
        sheet.addMergedRegion(new CellRangeAddress(4, (short) 4, 1, (short) 1));
        sheet.addMergedRegion(new CellRangeAddress(4, (short) 4, 2, (short) 2)); 
        sheet.addMergedRegion(new CellRangeAddress(4, (short) 4, 3, (short) 3)); 
        sheet.addMergedRegion(new CellRangeAddress(4, (short) 4, 4, (short) 4)); 
        sheet.addMergedRegion(new CellRangeAddress(4, (short) 4, 5, (short) 5));
        sheet.addMergedRegion(new CellRangeAddress(4, (short) 4, 6, (short) 7)); 
        
        HSSFCell ce51 = row5.createCell(0);     
        ce51.setCellValue("序号"); // 表格的第5行第一列显示的数据      
        ce51.setCellStyle(style); // 样式，居中  
        
        HSSFCell ce52 = row5.createCell(1);     
        ce52.setCellValue("商品名称及规格"); // 表格的第5行第2列显示的数据      
        ce52.setCellStyle(style); // 样式，居中  
        
        HSSFCell ce53 = row5.createCell(2);     
        ce53.setCellValue("单位"); // 表格的第5行第三列显示的数据      
        ce53.setCellStyle(style); // 样式，居中  
        
        HSSFCell ce54 = row5.createCell(3);     
        ce54.setCellValue("价格（元）"); // 表格的第5行第4列显示的数据      
        ce54.setCellStyle(style); // 样式，居中 
        
        HSSFCell ce55 = row5.createCell(4);     
        ce55.setCellValue("折扣%"); // 表格的第5行第5列显示的数据      
        ce55.setCellStyle(style); // 样式，居中  
        
        HSSFCell ce56 = row5.createCell(5);     
        ce56.setCellValue("数量"); // 表格的第5行第6列显示的数据      
        ce56.setCellStyle(style); // 样式，居中  
        
        HSSFCell ce57 = row5.createCell(6);     
        ce57.setCellValue("折扣后金额（元）"); // 表格的第5行第7列显示的数据      
        ce57.setCellStyle(style); // 样式，居中  
        
        //遍历创建第一页的第i + 5行 
        try {
			for (int i = 0; i < list.size(); i++) {
				row = sheet.createRow((short) i + 5);
				
				row.setHeight((short)500);
				sheet.addMergedRegion(new CellRangeAddress(i + 5, (short) i + 5, 0, (short) 0));  
				sheet.addMergedRegion(new CellRangeAddress(i + 5, (short) i + 5, 1, (short) 1));
				sheet.addMergedRegion(new CellRangeAddress(i + 5, (short) i + 5, 2, (short) 2)); 
		        sheet.addMergedRegion(new CellRangeAddress(i + 5, (short) i + 5, 3, (short) 3)); 
		        sheet.addMergedRegion(new CellRangeAddress(i + 5, (short) i + 5, 4, (short) 4));
		        sheet.addMergedRegion(new CellRangeAddress(i + 5, (short) i + 5, 5, (short) 5)); 
		        sheet.addMergedRegion(new CellRangeAddress(i + 5, (short) i + 5, 6, (short) 7)); 
				Map<String, Object> stu = (Map<String, Object>) list.get(i);
				// 第四步，创建单元格，并设置值
				int keyIndex = -1;
				for (String keyItem : keyList) {
					String value="";
					if(stu.containsKey(keyItem)){
						value=stu.get(keyItem).toString();
					}
					row.createCell(keyIndex += 1).setCellValue(value);
				}
			}
			
		} catch (Exception e) {
			throw e;
		}
        
        //总计
        HSSFRow rowN = sheet.createRow((short) 5+sum); 
        rowN.setHeight((short)500);
		sheet.addMergedRegion(new CellRangeAddress(5+sum, (short) 5+sum, 0, (short) 4));
		sheet.addMergedRegion(new CellRangeAddress(5+sum, (short) 5+sum, 6, (short) 7));
		
		HSSFCell cen1 = rowN.createCell(0);     
		cen1.setCellValue("合计"); // 表格的第n行第一列显示的数据      
		cen1.setCellStyle(style); // 样式，居中  
        
        HSSFCell cen5 = rowN.createCell(5);
        cen5.setCellValue(totgoodsqty); // 表格的第n行第5列显示的数据      
        
        HSSFCell cen6 = rowN.createCell(6);
        cen6.setCellValue(totgoodsmoney); // 表格的第n行第6列显示的数据   
		
        
		// 第六步，将文件存到指定位置
		try {
			FileOutputStream fout = new FileOutputStream(path);
			wb.write(fout);
			fout.close();
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}
}
