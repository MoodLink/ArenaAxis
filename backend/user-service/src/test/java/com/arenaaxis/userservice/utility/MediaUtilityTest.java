package com.arenaaxis.userservice.utility;

import com.arenaaxis.userservice.entity.Media;
import com.arenaaxis.userservice.entity.enums.MediaType;
import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class MediaUtilityTest {
  @Mock
  Cloudinary cloudinary;
  @Mock
  Uploader uploader;

  MediaUtility mediaUtility;

  @BeforeEach
  void setUp() {
    when(cloudinary.uploader()).thenReturn(uploader);
    mediaUtility = new MediaUtility(cloudinary);
  }

  @Test
  void upload_imageMimeType_should_returnMediaWithImageType() throws Exception {
    MockMultipartFile file = new MockMultipartFile("file", "a.png", "image/png", "bytes".getBytes());
    Map<String, Object> cloudRes = new HashMap<>();
    cloudRes.put("secure_url", "https://cdn.example.com/a.png");

    when(uploader.upload(any(byte[].class), anyMap())).thenReturn(cloudRes);

    Media out = mediaUtility.upload(file);
    assertEquals("https://cdn.example.com/a.png", out.getUrl());
    assertEquals(MediaType.IMAGE, out.getMediaType());
  }

  @Test
  void upload_videoMimeType_should_returnVideoType() throws IOException {
    MockMultipartFile file = new MockMultipartFile("file", "v.mp4", "video/mp4", "bytes".getBytes());
    Map<String, Object> cloudRes = new HashMap<>();
    cloudRes.put("secure_url", "https://cdn.example.com/v.mp4");

    when(uploader.upload(any(byte[].class), anyMap())).thenReturn(cloudRes);

    Media out = mediaUtility.upload(file);
    assertEquals("https://cdn.example.com/v.mp4", out.getUrl());
    assertEquals(MediaType.VIDEO, out.getMediaType());
  }

  @Test
  void delete_should_callCloudinaryDestroy_withCorrectResourceType() throws Exception {
    Media media = Media.builder()
      .id("m1")
      .url("https://res.cloudinary.com/demo/image/upload/v1/sample")
      .mediaType(MediaType.IMAGE)
      .build();

    try (MockedStatic<UrlUtility> utilities = mockStatic(UrlUtility.class)) {
      utilities.when(() -> UrlUtility.extractPublicId(media.getUrl())).thenReturn("sample");
      when(uploader.destroy(eq("sample"), anyMap())).thenReturn(new HashMap<String,Object>());
      mediaUtility.delete(media);
      verify(uploader).destroy(eq("sample"), argThat(m -> m.toString().contains("resource_type")));
    }
  }
}