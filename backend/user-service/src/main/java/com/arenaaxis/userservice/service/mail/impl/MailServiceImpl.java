package com.arenaaxis.userservice.service.mail.impl;

import com.arenaaxis.userservice.utility.MapperUtils;
import org.thymeleaf.context.Context;
import com.arenaaxis.userservice.service.mail.MailService;
import com.arenaaxis.userservice.service.mail.model.StoreApprovedEmailModel;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MailServiceImpl implements MailService {

  JavaMailSender mailSender;
  SpringTemplateEngine templateEngine;

  @Override
  public void sendStoreApprovedEmail(StoreApprovedEmailModel model, String to) {
    Context layoutCtx = new Context();
    layoutCtx.setVariables(MapperUtils.toMap(model));

    String finalHtml = templateEngine.process("email/store/approved", layoutCtx);

    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(
        message, true, StandardCharsets.UTF_8.name()
      );

      helper.setTo(to);
      helper.setSubject(model.getTitle());
      helper.setFrom("no-reply@arenaaxis.com", model.getBrandName());
      helper.setText(finalHtml, true);

      mailSender.send(message);
    } catch (Exception e) {
      throw new RuntimeException("Email sending error", e);
    }
  }
}