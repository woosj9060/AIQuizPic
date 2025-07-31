package com.woosj9060.aiquizpic.quiz;

import java.util.List;

// Request Body
class GeminiRequest {
    public List<Content> contents;

    public GeminiRequest(List<Content> contents) {
        this.contents = contents;
    }
}

// Content
class Content {
    public List<Part> parts;

    public Content(List<Part> parts) {
        this.parts = parts;
    }
}

// Part (Abstract class or interface for commonality)
interface Part {}

// Text Part
class TextPart implements Part {
    public String text;

    public TextPart(String text) {
        this.text = text;
    }
}

// Image Part
class ImagePart implements Part {
    public InlineData image;

    public ImagePart(InlineData image) {
        this.image = image;
    }
}

// Inline Data for Image
class InlineData {
    public String mimeType;
    public String data;

    public InlineData(String mimeType, String data) {
        this.mimeType = mimeType;
        this.data = data;
    }
}