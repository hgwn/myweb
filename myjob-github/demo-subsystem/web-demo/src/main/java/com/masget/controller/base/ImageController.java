package com.masget.controller.base;

import java.awt.image.BufferedImage;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.masget.util.ImageUtil;
@Controller
@Scope("prototype")
public class ImageController {
	
	/**
	 * 生成验证码图片，然后交给stream 的result返回
	 * @param request
	 * @param response
	 */
	@RequestMapping("base/findImageCode.do")
	public void findImageCode(HttpServletRequest request, HttpServletResponse response){
		Map<String,BufferedImage> map =ImageUtil.createImage();
		//获取图片字符
		String code =map.keySet().iterator().next();
		// 将四位数字的验证码保存到Session中。  
        HttpSession session = request.getSession(); 
        session.setAttribute("imageCode", code); 
		//获取图片
		BufferedImage image = map.get(code);
		try {
	        // 将图像输出到Servlet输出流中。  
	        ServletOutputStream sos = response.getOutputStream();
	        ImageIO.write(image, "jpeg", sos);
	        sos.close(); 
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
