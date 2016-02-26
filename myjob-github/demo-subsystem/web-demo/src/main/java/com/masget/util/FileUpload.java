package com.masget.util;

import net.sf.json.JSONObject;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.ProgressListener;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.text.NumberFormat;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;


public class FileUpload {
	private static final Logger log = LoggerFactory.getLogger(FileUpload.class);
	public static String fileUploadSavePath = "fileUploadSavePath";
	public static String fileUploadDir = "fileUploadDir";
	public static String fileUploadDirBackUrl = "fileUploadDirBackUrl";
	public static String exportDir = "exportDir";
	public static String importDir = "importDir";
	public static String companycontractno = "companycontractno";
	public static String goodsPictureDir = "goodsPictureDir";
	public static String paySignOrderDir = "paySignOrderDir";
	public static String otherFileDir = "otherFileDir";
	public static String fileDocumentTemplateDir = "fileDocumentTemplateDir";
	public static String resourceIconFileSavePath = "resourceIconFileSavePath";
	public static String accountCheckFilesSavePath = "accountCheckFilesSavePath";
	public static String pdaFileUploadDir = "pdaFileUploadDir";
	
	static {
		InputStream is = null;
		try {
			Properties pro = new Properties();
			is = FileUpload.class.getResourceAsStream("/config.properties");
			pro.load(is);
			fileUploadSavePath = pro.getProperty("fileUploadSavePath");
			fileUploadDir = pro.getProperty("fileUploadDir");
			fileUploadDirBackUrl = pro.getProperty("fileUploadDirBackUrl");
			exportDir = pro.getProperty("exportDir");
			importDir = pro.getProperty("importDir");
			goodsPictureDir = pro.getProperty("goodsPictureDir");
			paySignOrderDir = pro.getProperty("paySignOrderDir");
			companycontractno = pro.getProperty("companycontractno");
			otherFileDir = pro.getProperty("otherFileDir");
			fileDocumentTemplateDir = pro.getProperty("fileDocumentTemplateDir");
			resourceIconFileSavePath = pro.getProperty("resourceIconFileSavePath");
			accountCheckFilesSavePath = pro.getProperty("accountCheckFilesSavePath");
			pdaFileUploadDir = pro.getProperty("pdaFileUploadDir");
			// File file = new File(fileUploadSavePath + fileUploadDir);
			// if(!file.exists()){
			// file.mkdir();
			// }
			is.close();

		} catch (IOException e) {
			e.printStackTrace();
			if (is != null) {
				try {
					is.close();
				} catch (IOException e1) {
					e1.printStackTrace();
				}
			}
		}
	}

	private Map<String, String> params;
	private Map<String, FileItem> files;
	private JSONObject mFilesUrlJSON;
	private String mPath = "";
	private String mUrl = "";

	public FileUpload() {
		params = new HashMap<String, String>();
		files = new HashMap<String, FileItem>();
		mFilesUrlJSON = new JSONObject();
	}

	public enum emFileType {
		GOODS_EXPORT, GOODS_IMPORT, GOODS_PICTURE, PAY_SIGNORDER, COMPANY_CONTRACT_NO,DOCUMENT_TEMPLATE, PDA_FILE_UPLOAD
	}

	public static String getFileDir(emFileType fileType) {
		String fileDir = "";
		switch(fileType){
		case GOODS_EXPORT:
			fileDir = exportDir;
			break;
		case GOODS_IMPORT:
			fileDir = importDir;
			break;
		case GOODS_PICTURE:
			fileDir = goodsPictureDir;
			break;
		case PAY_SIGNORDER:
			fileDir = paySignOrderDir;
			break;
		case COMPANY_CONTRACT_NO:
			fileDir = companycontractno;
			break;
		case DOCUMENT_TEMPLATE:
			fileDir = fileDocumentTemplateDir;
			break;
		case PDA_FILE_UPLOAD:
			fileDir = pdaFileUploadDir;
			break;
		default:
			fileDir = otherFileDir;
			break;
		}
		return fileDir;
	}

	public static String getFilePath(emFileType fileType){
		return fileUploadSavePath + getFileDir(fileType);
	}
	
	public boolean setMap(HttpServletRequest request) {
		// Create a factory for disk-based file items
		FileItemFactory factory = new DiskFileItemFactory();
		// Create a new file upload handler
		ServletFileUpload upload = new ServletFileUpload(factory);
		upload.setHeaderEncoding("utf-8");
		upload.setProgressListener(new myProgressListener(request));// 设置进度监听器

		// Parse the request
		try {
			List<FileItem> items = (List<FileItem>) upload
					.parseRequest(request);
			Iterator<FileItem> iter = items.iterator();
			while (iter.hasNext()) {
				FileItem item = (FileItem) iter.next();
				if (item.isFormField()) {
					String name = item.getFieldName();
					String value = item.getString();
					params.put(name, value);
				} else {
					String name = item.getFieldName();
					files.put(name, item);
				}
			}
		} catch (FileUploadException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public Map<String, String> getParams() {
		return params;
	}

	public JSONObject getParamsJson() {
		return JSONObject.fromObject(params);
	}

	public JSONObject getFilesUrlJson() {
		return mFilesUrlJSON;
	}

	public Map<String, FileItem> getFiles() {
		return files;
	}

	// 用来获取文件的名字
	public String getFileName(FileItem item) {
		String fName = item.getName();
		int lastIndex = fName.lastIndexOf("\\");
		fName = fName.substring(lastIndex + 1);
		return fName;
	}
	
	public boolean writeFile(HttpServletRequest request, emFileType fileType) {
		return writeFile(request, getFileDir(fileType));
	}
	public boolean writeFile(HttpServletRequest request, String fileDir) {
		mUrl = fileUploadDirBackUrl + fileDir;
		mPath = fileUploadSavePath + fileDir;
		File fileExists = new File(fileUploadSavePath + fileDir);
		try {
			if (!fileExists.exists()) {
				fileExists.mkdir();
			}
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}

		String newFileName = params.get("fileName");

		Set<String> set = files.keySet();
		for (Iterator<String> iter = set.iterator(); iter.hasNext();) {
			String suffix = "";
			
			String key = (String) iter.next();
			FileItem fileItem = files.get(key);
			String oldFileName = (String) getFileName(fileItem);
			
			// 不是所有的上传文件都有扩展名，需要允许上传的文件没有扩展名
			// cndemo 2015-11-24 修改
			int index = oldFileName.lastIndexOf(".");
			if (index != -1)
			{
				suffix = oldFileName.substring(index);
			}
			
			String fileName;
			if (newFileName.isEmpty()) {
				fileName = System.currentTimeMillis() + suffix;
			} else {
				fileName = newFileName + suffix;
			}
			mFilesUrlJSON.put(key, mUrl + fileName);
			mFilesUrlJSON.put("fileName", fileName);
			mFilesUrlJSON.put("path", mPath);				// 存储的目录
			File file = new File(mPath, fileName);
			try {
				fileItem.write(file);
			} catch (Exception e) {
				e.printStackTrace();
				return false;
			}
		}
		return true;
	}

	public class myProgressListener implements ProgressListener {
		private double megaBytes = -1;
		private HttpSession session;

		public myProgressListener(HttpServletRequest request) {
			session = request.getSession();
		}

		public void update(long pBytesRead, long pContentLength, int pItems) {

			double mBytes = pBytesRead / 1000000;
			double total = pContentLength / 1000000;
			if (megaBytes == mBytes) {
				return;
			}

			megaBytes = mBytes;
			if (pContentLength == -1) {
				System.out.println("So far, " + pBytesRead
						+ " bytes have been read.");
			} else {
				System.out.println("So far, " + pBytesRead + " of "
						+ pContentLength + " bytes have been read.");
				double read = (mBytes / total);
				NumberFormat nf = NumberFormat.getPercentInstance();
				System.out.println("read===>" + nf.format(read));// 生成读取的百分比
																	// 并放入session中
				session.setAttribute("read", nf.format(read));
			}
		}
	}
	
	/**
	 * 删除上传文件
	 * @param fileName
	 */
	public static String fileDelete(String fileName){
		File file = new File(fileUploadSavePath+FileUpload.fileUploadDir,fileName);
		// 如果文件路径所对应的文件存在，并且是一个文件，则直接删除  
		JSONObject obj = new JSONObject();
		int ret = 12;
		String message = "删除文件失败";
		
		if(file.exists() && file.isFile()){
			boolean flag = file.delete();
			if(flag){
				log.info("删除路径[{}] 下面的 文件 [{}]成功" ,fileUploadSavePath+FileUpload.fileUploadDir ,fileName);
				ret = 0 ;
				message = "删除文件成功";
			}else{
				log.info("删除路径[{}] 下面的 文件 [{}]失败" ,fileUploadSavePath+FileUpload.fileUploadDir ,fileName);
			}
		}else{
			log.info("删除路径[{}] 下面的 文件 [{}]失败 ,因为该路径下面的文件不存在" ,fileUploadSavePath+FileUpload.fileUploadDir ,fileName);
		}
		obj.put("ret", ret);
		obj.put("message", message);
		return obj.toString();
	}

}