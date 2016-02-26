package com.masget.util;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGImageEncoder;

/**
 * 验证码工具类
 */
public class ImageUtil {
	//ABCDEFGHIJKLMNOPQRSTUVWXYZ
	//abcdefghijklmnopqrstuvwxyz
	private static final char[] chars = { '0', '1', '2', '3', '4', '5', '6','7', '8', '9', 
										'a', 'b', 'c', 'd', 'e', 'f', 'g','h', 'i', 'j',
										'k', 'l', 'm', 'n', 'o', 'p', 'q','r', 's', 't',
										'u', 'v', 'w', 'x', 'y', 'z', 
										'A', 'B', 'C', 'D', 'E', 'F', 'G','H', 'I', 'J', 
										'K', 'L', 'M', 'N', 'O', 'P', 'Q','R', 'S', 'T', 
										'U', 'V', 'W', 'X', 'Y', 'Z'};
	private static final int SIZE = 4;// 验证码数量
	private static final int LINES = 10;// 干扰线数量
	private static final int WIDTH = 100;// 图片宽
	private static final int HEIGHT = 45;// 图片高
	private static final int FONT_SIZE = 28;// 字体大小

	/**
	 * 生成随机的验证码
	 */
	public static Map<String, BufferedImage> createImage() {
		// 用于存储随机生成的验证码
		StringBuffer sb = new StringBuffer();
		// 图片的内存映像
		BufferedImage image = new BufferedImage(WIDTH, HEIGHT,
				BufferedImage.TYPE_INT_RGB);
		// 获得画笔对象
		Graphics graphic = image.getGraphics();
		graphic.setColor(Color.white);
		graphic.fillRect(0, 0, WIDTH, HEIGHT);
		Random r = new Random();
		// 画随机字符
		for (int i = 0; i < SIZE; i++) {
			int c = r.nextInt(chars.length);
			graphic.setColor(getRandomColor());
			graphic.setFont(new Font(null, Font.BOLD + Font.ITALIC, FONT_SIZE));
			graphic.drawString(chars[c] + "", i * WIDTH / SIZE, HEIGHT / 2 + 5);
			sb.append(chars[c]);// 将字符保存，存入Session
		}
		// 画干扰线
		for (int i = 0; i < LINES; i++) {
			graphic.setColor(getRandomColor());
			graphic.drawLine(r.nextInt(WIDTH), r.nextInt(HEIGHT), r
					.nextInt(WIDTH), r.nextInt(HEIGHT));
		}
		// 验证码保存在map里
		Map<String, BufferedImage> map = new HashMap<String, BufferedImage>();
		map.put(sb.toString(), image);
		return map;
	}

	/**
	 * 获取验证码
	 * 
	 * @param image
	 * @return
	 * @throws IOException
	 */
	public static InputStream getImageCode(BufferedImage image)
			throws IOException {
		// 压缩成jpeg格式
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(bos);
		// 把BufferedImage对象中的图像信息编码后
		// 向创建该对象(encoder)时指定的输出流输出
		encoder.encode(image);
		InputStream is = new ByteArrayInputStream(bos.toByteArray());
		return is;
	}

	/**
	 * 随机生成颜色
	 * 
	 * @return
	 */
	public static Color getRandomColor() {
		Random r = new Random();
		return new Color(r.nextInt(225), r.nextInt(225), r.nextInt(225));
	}
}
