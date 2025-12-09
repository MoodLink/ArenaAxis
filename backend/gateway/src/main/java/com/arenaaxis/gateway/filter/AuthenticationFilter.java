package com.arenaaxis.gateway.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

  public AuthenticationFilter() {
    super(Config.class);
  }

  @Override
  public GatewayFilter apply(Config config) {
    return (exchange, chain) -> {
      ServerHttpRequest request = exchange.getRequest();

      return ReactiveSecurityContextHolder.getContext()
        .map(SecurityContext::getAuthentication)
        .defaultIfEmpty(new AnonymousAuthentication())
        .flatMap(authentication -> {
          if (authentication.isAuthenticated() &&
            !(authentication instanceof AnonymousAuthentication)) {

            ServerHttpRequest mutatedRequest = request.mutate()
              .header("X-User-Email", authentication.getName())
              .header("X-User-Authorities",
                String.join(",",
                  authentication.getAuthorities().stream()
                    .map(Object::toString)
                    .toList()))
              .build();

            log.debug("Forwarding authenticated request for user: {}",
              authentication.getName());

            return chain.filter(exchange.mutate()
              .request(mutatedRequest)
              .build());
          }

          return chain.filter(exchange);
        });
    };
  }

  public static class Config {

  }

  private static class AnonymousAuthentication implements Authentication {
    @Override
    public String getName() { return "anonymous"; }
    @Override
    public Object getCredentials() { return null; }
    @Override
    public Object getDetails() { return null; }
    @Override
    public Object getPrincipal() { return "anonymous"; }
    @Override
    public boolean isAuthenticated() { return false; }
    @Override
    public void setAuthenticated(boolean isAuthenticated) {}
    @Override
    public java.util.Collection<? extends org.springframework.security.core.GrantedAuthority>
    getAuthorities() { return java.util.Collections.emptyList(); }
  }
}
