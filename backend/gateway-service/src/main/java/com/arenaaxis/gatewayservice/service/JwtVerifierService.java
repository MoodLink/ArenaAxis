package com.arenaaxis.gatewayservice.service;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;

import java.text.ParseException;

public interface JwtVerifierService {
  SignedJWT parseAndVerify(String token) throws ParseException, JOSEException;
}
