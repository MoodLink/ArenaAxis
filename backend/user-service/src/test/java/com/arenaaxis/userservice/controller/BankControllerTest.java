package com.arenaaxis.userservice.controller;

import com.arenaaxis.userservice.dto.request.BankRequest;
import com.arenaaxis.userservice.dto.response.BankResponse;
import com.arenaaxis.userservice.service.BankService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BankControllerTest {
  @Mock
  BankService bankService;

  @InjectMocks
  BankController bankController;

  MockMvc mockMvc;

  String id;
  MockMultipartFile logo;
  String name;
  String logoUrl;
  BankResponse resp;

  @BeforeEach
  void setup() {
    mockMvc = MockMvcBuilders.standaloneSetup(bankController).build();
    logo = new MockMultipartFile(
      "logo", "logo.png", "image/png", "logo".getBytes()
    );
    id = UUID.randomUUID().toString();
    name = "MB-Bank";
    logoUrl = "https://cloudinary.com/logo.png";
    resp = BankResponse.builder().id(id).name(name).logoUrl(logoUrl).build();
  }

  @Test
  void create_should_callService_and_returnOk() throws Exception {
    when(bankService.create(any(BankRequest.class))).thenReturn(resp);
    mockMvc.perform(MockMvcRequestBuilders.multipart("/banks")
        .file(logo)
        .param("name", name)
        .contentType(MediaType.MULTIPART_FORM_DATA))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.name").value(name))
      .andExpect(jsonPath("$.id").value(id));

    ArgumentCaptor<BankRequest> captor = ArgumentCaptor.forClass(BankRequest.class);
    verify(bankService, times(1)).create(captor.capture());
    assertEquals(name, captor.getValue().getName());
    assertNotNull(captor.getValue().getLogo());
  }

  @Test
  void update_should_callService_and_returnOk() throws Exception {
    when(bankService.updateBankById(eq(id), any(BankRequest.class))).thenReturn(resp);

    var builder = MockMvcRequestBuilders.multipart("/banks/{id}", id)
      .file(logo)
      .param("name", name)
      .contentType(MediaType.MULTIPART_FORM_DATA);

    builder.with(request -> { request.setMethod("PUT"); return request; });
    mockMvc.perform(builder)
      .andExpect(jsonPath("$.name").value(name))
      .andExpect(jsonPath("$.id").value(id));

    ArgumentCaptor<BankRequest> captor = ArgumentCaptor.forClass(BankRequest.class);
    verify(bankService, times(1)).updateBankById(eq(id), captor.capture());
    assertEquals(name, captor.getValue().getName());
    assertNotNull(captor.getValue().getLogo());
  }

  @Test
  void getAll_should_returnListOfBanks() throws Exception {
    when(bankService.getAllBanks()).thenReturn(List.of(resp));

    mockMvc.perform(MockMvcRequestBuilders.get("/banks"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$[0].name").value(name))
      .andExpect(jsonPath("$[0].id").value(id));

    verify(bankService, times(1)).getAllBanks();
  }

  @Test
  void getById_should_callService() throws Exception {
    when(bankService.getBankById(id)).thenReturn(resp);

    mockMvc.perform(MockMvcRequestBuilders.get("/banks/{id}", id))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.name").value(name))
      .andExpect(jsonPath("$.id").value(id));

    verify(bankService).getBankById(id);
  }

  @Test
  void deleteById_should_callService() throws Exception {
    when(bankService.deleteBankById(id)).thenReturn(resp);

    mockMvc.perform(MockMvcRequestBuilders.delete("/banks/{id}", id))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.name").value(name))
      .andExpect(jsonPath("$.id").value(id));

    verify(bankService).deleteBankById(id);
  }
}