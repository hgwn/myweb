package com.masget.util.file;

import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

/**
 * 用于写本地excel文件
 * @author cao
 *
 */
public class LocalXls
{
	private Integer nSheetIndex = 1;
	private String sColumnTitle = "";
	private Integer nCurRowIndex = 0;
	
	private HSSFWorkbook oWorkbook = new HSSFWorkbook();
	HSSFCellStyle oCellStyle = null;
	private HSSFSheet oCurSheet = null;
	
	public LocalXls()
	{
		oCellStyle = oWorkbook.createCellStyle();
		if (oCellStyle != null) oCellStyle.setAlignment(HSSFCellStyle.ALIGN_LEFT);
	}
	
	/**
	 * 创建excel内存文件
	 * @param sColumnTitle	采用|符号分割
	 * @return
	 */
	public boolean create_local_excel(String sColumnTitle)
	{
		if (oCurSheet == null)
		{
			oCurSheet = oWorkbook.createSheet("sheet" + String.valueOf(nSheetIndex));
			nSheetIndex++;
		}
		if (oCurSheet == null) return false;
		
		this.sColumnTitle = sColumnTitle;
		set_column_titles(sColumnTitle);
		
		return true;
	}
	
	/**
	 * 增加一行数据 
	 * @param sRowData 每列的数据采用|符号分割
	 */
	public void insert_row_data(String sRowData)
	{
		try
		{
			String[] arrDatas = sRowData.split("\\|");
			if (arrDatas != null && arrDatas.length > 0)
			{
				HSSFRow oRow = oCurSheet.createRow(nCurRowIndex);
				
				for (int i = 0; i < arrDatas.length; i++)
				{
					HSSFCell cell = oRow.createCell(i);
					cell.setCellValue(arrDatas[i]);
					//cell.setCellStyle(oCellStyle);
				}
				
				nCurRowIndex++;
				if (nCurRowIndex > 65535)
				{
					oCurSheet = oWorkbook.createSheet("sheet" + String.valueOf(nSheetIndex));
					set_column_titles(this.sColumnTitle);
					nSheetIndex++;
				}
			}
		}
		catch (Exception ex)
		{
			
		}
	}
	
	public void save(String sFileName)
	{
		FileOutputStream oFileOutputStream = null;
		
		try
		{
			oFileOutputStream = new FileOutputStream(sFileName);
			oWorkbook.write(oFileOutputStream);			
		}
		catch (Exception e)
		{
		}
		
		try { if (oFileOutputStream != null) oFileOutputStream.close(); } catch (Exception ex){}
	}
	
	private void set_column_titles(String sColumnTitle)
	{
		try
		{
			HSSFCellStyle oCellStyle = oWorkbook.createCellStyle();
			oCellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
			
			String[] arrTitle = sColumnTitle.split("\\|");
			if (arrTitle != null && arrTitle.length > 0)
			{
				HSSFRow oRow = oCurSheet.createRow((int) 0);
				for (int i = 0; i < arrTitle.length; i++)
				{
					HSSFCell cell = oRow.createCell(i);
					cell.setCellValue(arrTitle[i]);
					cell.setCellStyle(oCellStyle);
				}
				
				nCurRowIndex = 1;
			}
		}
		catch (Exception ex)
		{
			
		}
	}

}

/*
public static void writeDataToExcel(List<Map<String, Object>> list,
		List<String> headList, List<String> keyList, String path, String sheetName) throws Exception {
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
}*/