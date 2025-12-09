package com.arenaaxis.userservice.service.event.listener;

import com.arenaaxis.userservice.entity.Store;
import com.arenaaxis.userservice.service.event.StoreApprovedEvent;
import com.arenaaxis.userservice.service.mail.MailService;
import com.arenaaxis.userservice.service.mail.model.StoreApprovedEmailModel;
import com.arenaaxis.userservice.utility.TimeFormatter;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;

import java.time.LocalDate;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StoreApprovedListener {
  MailService mailService;

  @Async
  @EventListener
  public void handleStoreApproved(StoreApprovedEvent event) {
    Store store = event.getStore();
    StoreApprovedEmailModel model = StoreApprovedEmailModel.builder()
      .title("Trung tâm thể thao của bạn đã được duyệt")
      .brandName("Arena Axis")
      .brandLogoUrl("https://cdn.example.com/logo.png")
      .companyAddress("Hanoi, Vietnam")
      .supportEmail("support@arenaaxis.com")
      .supportEmailUrl("mailto:support@arenaaxis.com")
      .termsUrl("https://arenaaxis.com/terms")
      .year(String.valueOf(LocalDate.now().getYear()))

      .ownerName(store.getOwner().getName())
      .storeName(store.getName())
      .storeId(store.getId())
      .approvedAt(TimeFormatter.convertDateFormatToString(store.getApprovedAt()))
      .ctaUrl("https://arena-axis-omega.vercel.app/list-store/" + store.getId())
      .build();

    mailService.sendStoreApprovedEmail(model, store.getOwner().getEmail());
  }
}
