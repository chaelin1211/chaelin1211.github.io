---
layout: post
title: "[설정] myBatis generator plugin"
subtitle: "myBatis를 사용하기 편리하도록 도와주는 자동 생성기 입니다."
date: 2021-07-07 22:03:00 +0900
background: '/img/posts/plugin.jpg'
category: Study
tags: [database]
---
### myBatis generator
myBatis를 사용하기 편리하도록 도와주는 자동 생성기 입니다.

생성되는 항목은 다음과 같습니다.

* DAO(Data Access Object): DB를 사용해 데이터 조회/조작 등의 기능을 담당
* DTO(Data Transfer Object): 계층간 데이터 교환을 위해 필요한 데이터 객체로, Table의 각 Column 별로 Data를 가지며 getter/setter를 포함 
* SQL (.xml): 기본적인 CRUD를 수행할 수 있도록 쿼리를 제공

*****

### 환경
* Spring Boot
* Maven
* IntelliJ
* Java 8

*****

### Directory

```
- main
    - java/com/example/demo
        - controller
        - domain (=dto)
        - dao
        - mapper
        - service
    - resources
        - mapper
        
```

*****

### pom.xml
root에 존재하는 pom.xml에 plugin을 추가해 줍니다.

myBatis generator plugin을 다음과 같이 추가합니다.

```
<build>
    <plugins>
        <plugin>  
            <groupId>org.mybatis.generator</groupId>  
            <artifactId>mybatis-generator-maven-plugin</artifactId>  
            <version>1.4.0</version>  
        </plugin>  
    </plugins>
</build>

```

이 부분을 추가한 후에 maven에 이 플러그인이 추가되었는지 확인합니다.

* mybatis-generator
    * mybatis-generator:generate
    * mybatis-generator:help

위와 같은 내용이 추가되어야 실행 가능합니다. (이미지는 추후에 첨부하도록 하겠습니다.)

### generatorConfig.xml 파일 생성
resources 디렉토리 아래에 generatorConfig.xml을 생성하여 다음 내용을 입력합니다.

```
<!DOCTYPE generatorConfiguration PUBLIC
        "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd"
        >
<generatorConfiguration>
    <context id="~~" targetRuntime="MyBatis3">
        <jdbcConnection driverClass="~~~"
                        connectionURL="jdbc:mariadb://<IP>:<port>/<DB 명>" userId="~~"
                        password="~~"/>
 
        <!-- DTO -->
        <javaModelGenerator targetPackage="com.example.demo.domain" targetProject="src/main/java">
            <property name="enableSubPackages" value="true"/>
        </javaModelGenerator>
 
        <!-- DAO -->
        <javaClientGenerator type="XMLMAPPER" targetPackage="com.example.demo.mapper"  targetProject="src/main/java">
            <property name="enableSubPackages" value="true" />
        </javaClientGenerator>

        <!-- SQL -->
        <sqlMapGenerator targetPackage="mapper"  targetProject="src/main/resources">
            <property name="enableSubPackages" value="true" />
        </sqlMapGenerator>
        
        <table tableName="~~" schema="~~"></table>
    </context>
</generatorConfiguration>

```
'~~' 부분은 본인의 DB id, pw와 table 이름, 스키마 이름으로 채우면 됩니다.

* ```<property name="enableSubPackages" value="true" />``` : 스키마가 복수일 경우 각각의 스키마 서브 디렉터리에 넣어주는 것입니다. 추가적인 디렉터리 생성을 방지하고자 할 경우 삭제하면 됩니다. (default: false)
* javaModelGenerator: Table 구조로 DTO를 생성하는 부분의 설정입니다.
* javaClientGenerator: DAO를 생성하는 부분의 설정입니다.
* sqlMapGenerator: SQL(.xml)파일을 생성하는 부분의 설정입니다.

위와 같이 설정 후, 위에서 보았던 ```mybatis-generator:generate```를 더블 클릭해주면 위 파일에 설정한 디렉터리에 DAO, DTO, SQL 파일이 생성되는 것을 확인할 수 있습니다.

*****

위와 같이 수행 후, 필요에 따라 Service와 Controller를 작성하면 됩니다.

*****

> 참고
* <a href="https://lazymankook.tistory.com/30">DAO, DTO, Service</a>
* <a href="https://byeongkwandev.tistory.com/6">https://byeongkwandev.tistory.com/6</a>

*****

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>