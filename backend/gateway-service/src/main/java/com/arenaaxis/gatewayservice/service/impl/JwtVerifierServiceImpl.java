package com.arenaaxis.gatewayservice.service.impl;

import com.arenaaxis.gatewayservice.service.JwtVerifierService;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.ParseException;

@Service
public class JwtVerifierServiceImpl implements JwtVerifierService {
  private final String signerKey;

  public JwtVerifierServiceImpl(@Value("${jwt.signer_key}") String signerKey) {
    this.signerKey = signerKey;
  }

  @Override
  public SignedJWT parseAndVerify(String token) throws ParseException, JOSEException {
    SignedJWT signedJWT = SignedJWT.parse(token);
    JWSVerifier verifier = new MACVerifier(signerKey.getBytes());
    boolean ok = signedJWT.verify(verifier);
    if (!ok) throw new JOSEException("Invalid JWT");
    return signedJWT;
  }
}
