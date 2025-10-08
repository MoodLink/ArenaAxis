package com.arenaaxis.userservice.utility;

import com.arenaaxis.userservice.entity.Media;
import com.arenaaxis.userservice.entity.enums.MediaType;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class            MediaUtility {
  private final Cloudinary cloudinary;

  public Media upload(MultipartFile file) {
    try {
      String contentType = file.getContentType();
      String resourceType = "raw";

      if (contentType != null) {
        String VIDEO_RESOURCE_TYPE = "video";
        String IMAGE_RESOURCE_TYPE = "image";
        if (contentType.startsWith(IMAGE_RESOURCE_TYPE)) {
          resourceType = IMAGE_RESOURCE_TYPE;
        } else if (contentType.startsWith(VIDEO_RESOURCE_TYPE)) {
          resourceType = VIDEO_RESOURCE_TYPE;
        }
      }

      Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(),
        ObjectUtils.asMap("resource_type", resourceType));
      String url = (String) result.get("secure_url");

      return Media.builder()
        .url(url)
        .mediaType(resolveMediaType(Objects.requireNonNull(contentType)))
        .build();
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  public void delete(Media media) {
    String resourceType = "image";
    if (MediaType.VIDEO.equals(media.getMediaType())) {
      resourceType = "video";
    }
    String publicId = UrlUtility.extractPublicId(media.getUrl());

    try {
      cloudinary.uploader().destroy(
        publicId,
        ObjectUtils.asMap("resource_type", resourceType)
      );
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  private MediaType resolveMediaType(String mimeType) {
    if (mimeType.startsWith("image/")) return MediaType.IMAGE;
    return MediaType.VIDEO;
  }
}
