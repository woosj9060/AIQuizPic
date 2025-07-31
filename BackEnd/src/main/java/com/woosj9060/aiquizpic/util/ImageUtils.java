package com.woosj9060.aiquizpic.util;

import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.MemoryCacheImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.Base64;
import java.util.Iterator;

public class ImageUtils {

    // PNG 파일 경로를 받아서 Base64(JPEG 압축 + 리사이즈) 문자열로 반환
    public static String convertToBase64Compressed(String imagePath, int width, int height, float jpegQuality) throws IOException {
        BufferedImage originalImage = ImageIO.read(new File(imagePath));
        BufferedImage resizedImage = resizeImage(originalImage, width, height);
        byte[] compressedBytes = compressToJPEG(resizedImage, jpegQuality);
        return Base64.getEncoder().encodeToString(compressedBytes);
    }

    // 이미지 리사이즈 (고정 크기)
    private static BufferedImage resizeImage(BufferedImage originalImage, int width, int height) {
        Image scaledImage = originalImage.getScaledInstance(width, height, Image.SCALE_SMOOTH);
        BufferedImage resized = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = resized.createGraphics();
        g2d.drawImage(scaledImage, 0, 0, null);
        g2d.dispose();
        return resized;
    }

    // JPEG 압축 (품질 설정 가능)
    private static byte[] compressToJPEG(BufferedImage image, float quality) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpg");
        if (!writers.hasNext()) throw new IllegalStateException("No JPEG writer found");

        ImageWriter writer = writers.next();
        ImageWriteParam param = writer.getDefaultWriteParam();
        param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
        param.setCompressionQuality(quality); // 0.0f ~ 1.0f

        writer.setOutput(new MemoryCacheImageOutputStream(baos));
        writer.write(null, new javax.imageio.IIOImage(image, null, null), param);
        writer.dispose();

        return baos.toByteArray();
    }
    
}