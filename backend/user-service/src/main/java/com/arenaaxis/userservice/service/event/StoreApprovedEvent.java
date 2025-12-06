package com.arenaaxis.userservice.service.event;

import com.arenaaxis.userservice.entity.Store;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class StoreApprovedEvent extends ApplicationEvent {
  private final Store store;

  public StoreApprovedEvent(Object source, Store store) {
    super(source);
    this.store = store;
  }
}
