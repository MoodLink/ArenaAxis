package com.arenaaxis.userservice.service.mail;

import com.arenaaxis.userservice.service.mail.model.StoreApprovedEmailModel;

public interface MailService {
  void sendStoreApprovedEmail(StoreApprovedEmailModel store, String email);
}
