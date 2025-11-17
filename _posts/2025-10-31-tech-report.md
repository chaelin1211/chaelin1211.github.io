---
layout: post
title: "Spring Security와 JWT로 안전한 API 구축하기"
subtitle: "클라이언트-서버 인증의 핵심, JWT 기반 인증 완벽 가이드"
date: 2025-10-31 00:53:26.370Z +0900
background: '/img/posts/pattern01.jpg'
category: Study
tags: [spring,spring_security,jwt,java,security]
---

현대의 웹 애플리케이션, 특히 RESTful API 기반의 서비스들은 효율적이고 확장 가능한 인증 메커니즘을 필요로 합니다. 전통적인 세션 기반 인증 방식은 분산 시스템이나 모바일/SPA 클라이언트 환경에서 스케일링 및 관리가 복잡할 수 있습니다. 이러한 한계를 극복하기 위해 JSON Web Token(JWT)이 강력한 대안으로 떠오르고 있습니다. JWT는 정보를 안전하게 전송하며, 서버가 클라이언트의 상태를 유지할 필요 없는 **무상태(Stateless)** 인증을 가능하게 합니다.

이번 포스트에서는 Spring 애플리케이션의 사실상 표준 보안 프레임워크인 Spring Security와 JWT를 통합하여 안전한 API를 구축하는 방법에 대해 자세히 알아보겠습니다.

## JWT란 무엇인가?

JWT는 클레임(Claim) 기반의 토큰으로, 당사자들 간에 정보를 안전하게 전송하기 위한 간결하고 URL-safe한 방법입니다. JWT는 주로 세 부분으로 구성됩니다:

*   **헤더 (Header)**: 토큰의 타입(`JWT`)과 서명에 사용된 알고리즘(예: `HS256`)을 정의합니다.
*   **페이로드 (Payload)**: 실제 정보를 담는 부분으로, 사용자 ID, 역할, 만료 시간 등의 클레임(Claims)을 포함합니다.
*   **서명 (Signature)**: 인코딩된 헤더와 페이로드, 그리고 서버의 비밀 키를 조합하여 생성됩니다. 이를 통해 토큰의 무결성을 검증하고 변조 여부를 확인할 수 있습니다.

JWT는 서버가 클라이언트의 상태를 저장할 필요가 없어 마이크로서비스 아키텍처나 서버리스 환경에 특히 적합합니다.

## 왜 Spring Security와 JWT인가?

Spring Security는 Java 기반 애플리케이션의 인증 및 인가에 대한 광범위하고 유연한 기능을 제공합니다. JWT는 토큰 기반 인증의 핵심으로, Spring Security의 강력한 필터 체인(Filter Chain)과 긴밀하게 통합될 수 있습니다. Spring Security의 `AuthenticationProvider`, `UserDetailsService`, 그리고 커스텀 필터 구현을 통해 JWT를 효율적으로 활용하여 견고한 보안 시스템을 구축할 수 있습니다.

## JWT 기반 인증 흐름

일반적인 JWT 기반 인증의 과정을 살펴보겠습니다.

1.  **로그인 요청**: 클라이언트가 사용자 ID와 비밀번호로 로그인 요청을 보냅니다.
2.  **인증 및 토큰 발급**: 서버는 사용자 정보를 검증하고, 인증에 성공하면 JWT를 생성하여 클라이언트에게 응답으로 반환합니다.
3.  **토큰 저장**: 클라이언트는 받은 JWT를 로컬 스토리지 또는 쿠키에 안전하게 저장합니다.
4.  **자원 요청**: 이후 클라이언트는 보호된 자원에 접근할 때마다 HTTP 요청 헤더의 `Authorization: Bearer <JWT>` 형식으로 JWT를 담아 보냅니다.
5.  **토큰 검증**: 서버는 요청 헤더의 JWT를 추출하여 서명, 만료 시간 등을 검증합니다.
6.  **자원 응답**: 토큰이 유효하면 요청된 자원을 제공하고, 유효하지 않으면 접근을 거부합니다.

## Spring Security JWT 구현 단계

이제 Spring Security와 JWT를 통합하는 구체적인 구현 단계를 살펴보겠습니다.

### 1. 의존성 추가

`pom.xml` (Maven) 또는 `build.gradle` (Gradle)에 필요한 의존성을 추가합니다. `jjwt` 라이브러리는 JWT를 다루는 데 사용됩니다.

```xml
<!-- Maven (pom.xml) -->
<dependencies>
    <!-- Spring Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <!-- JWT Library (jjwt) -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <!-- Spring Boot Web Starter (컨트롤러 등) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

### 2. JWT 토큰 생성 및 검증 유틸리티 (`JwtTokenProvider`)

JWT의 생성, 파싱, 유효성 검증 등의 핵심 로직을 담당하는 클래스입니다.

```java
// src/main/java/.../jwt/JwtTokenProvider.java
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration-time}")
    private long expirationTime; // 밀리초 단위 (예: 30분 = 1800000)

    private Key key;

    // 객체 초기화, secretKey를 Base64로 인코딩하여 키 생성
    @PostConstruct
    protected void init() {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    // JWT 토큰 생성
    public String createToken(Authentication authentication) {
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        Date now = new Date();
        Date validity = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .setSubject(authentication.getName()) // 토큰 제목 (사용자 ID)
                .claim("auth", authorities) // 정보 저장 (권한)
                .setIssuedAt(now) // 발행 시간
                .setExpiration(validity) // 만료 시간
                .signWith(key, SignatureAlgorithm.HS256) // 사용할 암호화 알고리즘과 secret key
                .compact();
    }

    // JWT 토큰으로 인증 정보 조회
    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        Collection<? extends GrantedAuthority> authorities =
                Arrays.stream(claims.get("auth").toString().split(","))
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

        UserDetails principal = new User(claims.getSubject(), "", authorities);
        return new UsernamePasswordAuthenticationToken(principal, "", authorities);
    }

    // JWT 토큰 유효성 검사
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            // 잘못된 JWT 서명
        } catch (ExpiredJwtException e) {
            // 만료된 JWT 토큰
        } catch (UnsupportedJwtException e) {
            // 지원되지 않는 JWT 토큰
        } catch (IllegalArgumentException e) {
            // JWT 토큰이 잘못됨
        }
        return false;
    }
}
```

`application.properties` 또는 `application.yml`에 JWT 비밀 키와 만료 시간을 설정합니다.

```properties
# application.properties
jwt.secret=yourVeryStrongAndLongSecretKeyForJWTGenerationAndValidationThatMustBeAtLeast32Bytes
jwt.expiration-time=1800000 # 30분 (밀리초)
```

### 3. Custom `UserDetailsService`

Spring Security가 사용자 인증을 위해 사용자 정보를 로드할 때 사용하는 인터페이스입니다. 실제 데이터베이스에서 사용자 정보를 조회하는 로직을 구현해야 합니다.

```java
// src/main/java/.../service/CustomUserDetailsService.java
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 실제 데이터베이스에서 사용자 정보를 조회하는 로직을 구현합니다.
        // 여기서는 예시를 위해 하드코딩된 사용자 정보를 반환합니다.
        if ("user".equals(username)) {
            // "{noop}"은 PasswordEncoder를 사용하지 않고 평문 비밀번호를 사용하겠다는 의미.
            // 실제 프로덕션에서는 BCryptPasswordEncoder 등을 사용해야 합니다.
            return new User("user", "{noop}password", Collections.singletonList(() -> "ROLE_USER"));
        } else if ("admin".equals(username)) {
            return new User("admin", "{noop}password", Collections.singletonList(() -> "ROLE_ADMIN"));
        }
        throw new UsernameNotFoundException("User not found with username: " + username);
    }
}
```

### 4. JWT 인증 필터 (`JwtAuthenticationFilter`)

모든 요청에 대해 JWT 토큰의 유효성을 검사하고, 유효한 토큰이면 Spring Security의 `SecurityContext`에 인증 정보를 설정하는 필터입니다.

```java
// src/main/java/.../filter/JwtAuthenticationFilter.java
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String jwt = resolveToken(request); // HTTP 요청에서 JWT 토큰 추출

        // 토큰이 존재하고 유효한 경우
        if (StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {
            Authentication authentication = jwtTokenProvider.getAuthentication(jwt);
            SecurityContextHolder.getContext().setAuthentication(authentication); // SecurityContext에 인증 정보 설정
        }
        filterChain.doFilter(request, response);
    }

    // Request Header에서 토큰 정보 추출
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 접두사 제거
        }
        return null;
    }
}
```
**참고**: `javax.servlet` 대신 `jakarta.servlet` 패키지를 사용한 것은 Spring Boot 3.x 이상 환경을 기준으로 합니다.

### 5. Spring Security 설정 (`SecurityConfig`)

Spring Security의 핵심 설정 파일입니다. JWT 필터를 등록하고, 세션 정책을 무상태(STATELESS)로 설정합니다.

```java
// src/main/java/.../config/SecurityConfig.java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import ...jwt.JwtTokenProvider;
import ...service.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(JwtTokenProvider jwtTokenProvider, CustomUserDetailsService customUserDetailsService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.customUserDetailsService = customUserDetailsService;
    }

    // 비밀번호 암호화를 위한 Encoder 빈 등록
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // AuthenticationManager 빈 등록 (Spring Security 2.7+ 권장 방식)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // REST API이므로 csrf 비활성화
            .formLogin().disable() // 폼 로그인 비활성화
            .httpBasic().disable() // HTTP Basic 인증 비활성화
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // 세션 사용 안 함 (무상태)
            .and()
            .authorizeHttpRequests(authorize -> authorize // Spring Security 5.7+ 권장 방식
                .requestMatchers("/api/auth/**").permitAll() // 로그인/회원가입 경로는 인증 없이 접근 허용
                .requestMatchers("/api/admin/**").hasRole("ADMIN") // 'ADMIN' 역할만 접근 가능
                .anyRequest().authenticated() // 나머지 모든 요청은 인증 필요
            )
            .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
                    UsernamePasswordAuthenticationFilter.class); // JWT 필터 등록

        return http.build();
    }
}
```
**참고**: Spring Boot 2.7 이상 및 Spring Security 5.7 이상에서는 `WebSecurityConfigurerAdapter` 대신 `SecurityFilterChain`을 빈으로 등록하는 방식을 권장합니다. 위 코드는 최신 버전에 맞춰 작성되었습니다. `AuthenticationManager`도 별도의 빈으로 등록해야 합니다.

### 6. 로그인 API 구현

사용자 인증에 성공하면 JWT를 발행하여 클라이언트에게 응답하는 컨트롤러입니다.

```java
// src/main/java/.../controller/AuthController.java
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ...jwt.JwtTokenProvider;
import ...dto.LoginRequest; // 로그인 요청 DTO

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );
        String token = jwtTokenProvider.createToken(authentication); // JWT 토큰 생성
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return response;
    }
}
```
로그인 요청을 위한 DTO는 다음과 같이 정의할 수 있습니다.

```java
// src/main/java/.../dto/LoginRequest.java
public class LoginRequest {
    private String username;
    private String password;

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
```

### 7. 보호된 API 예시

JWT가 유효한 사용자만 접근할 수 있는 API를 구현합니다.

```java
// src/main/java/.../controller/UserController.java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping("/me")
    public String getUserInfo() {
        // 현재 인증된 사용자 정보 가져오기
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return "Hello, " + userDetails.getUsername() + "! You have " + userDetails.getAuthorities() + " roles.";
    }
}

// src/main/java/.../controller/AdminController.java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/dashboard")
    public String getAdminDashboard() {
        return "Welcome to the admin dashboard! Only accessible by ADMIN role.";
    }
}
```
`SecurityConfig`에서 `.requestMatchers("/api/admin/**").hasRole("ADMIN")`와 같이 URL 기반으로 인가 설정을 했으므로, 해당 API는 ADMIN 역할 사용자만 접근 가능합니다.

## 결론

Spring Security와 JWT를 활용한 인증 구현은 현대 웹 애플리케이션의 보안 요구사항을 충족시키는 강력하고 유연한 방법입니다. 무상태(stateless) 인증은 서버의 확장성을 높이고, 클라이언트-서버 간의 분리된 아키텍처를 지원하여 모바일 앱이나 SPA(Single Page Application)와 같은 다양한 클라이언트 환경에 유연하게 대응할 수 있게 합니다.

이 가이드에서 제시된 단계별 구현을 통해 여러분의 Spring Boot 애플리케이션에 JWT 기반의 안전한 인증 시스템을 구축할 수 있을 것입니다. 하지만 프로덕션 환경에서는 토큰 만료 관리, 리프레시 토큰(Refresh Token) 전략, 블랙리스트(Blacklist) 또는 화이트리스트(Whitelist) 관리, HTTPS 적용 등 추가적인 보안 고려사항들을 반드시 적용해야 한다는 점을 기억해 주세요. 안전하고 견고한 API를 만들기 위한 여정에 이 글이 도움이 되기를 바랍니다.

<p class = "placeholder">Text by Chaelin & Gemini. Photographs by Chaelin, Unsplash.</p>