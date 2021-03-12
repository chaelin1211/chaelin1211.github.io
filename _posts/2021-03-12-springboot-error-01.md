---
layout: post
title: "[Error] Docker Run 시에 발생한 오류"
subtitle: "no main manifest attribute"
date: 2021-03-12 18:28:00 +0900
background: '/img/posts/game_over.jpg'
category: Study
tags: [spring, error, docker]
---
안녕하세요.

현재 진행 중인 실습(미니 프로젝트) 중 발생한 오류에 대해 정리해보겠습니다.

### 1. 발생 상황
docker build 후 docker run 실행 시 발생하였습니다.

### 2. 발생 오류
```
no main manifest attribute, in /restful_springboot.jar
```
"기본 manifest 속성이 없습니다"

이 오류가 발생한 이유는 JVM이 jar 파일에서 가장 처음 실행할 Main class를 찾지 못해 발생하는 오류입니다.

이에 대한 설정은 jar 파일 내부의의 META-INF/MANIFEST.MF 파일에 등록되어 있어야 하는데 등록해주지 않았기 때문에 이 오류가 발생한 것입니다. (메모장으로 열어 보시면 확인할 수 있습니다..)

기존 pom.xml을 변경없이 package를 수행해 jar 파일을 생성할 경우, MANIFEST.MF의 내용은 다음과 같습니다.

#### MANIFEST.MF
```
Manifest-Version: 1.0
Created-By: Maven Jar Plugin 3.2.0
Build-Jdk-Spec: 15
Implementation-Title: demo
Implementation-Version: 0.0.1-SNAPSHOT
```

### 3. 해결
pom.xml에 내용 추가를 위한 plugin을 추가해줍니다.

spring-boot-maven-plugin입니다.

#### spring-boot-maven-plugin
MANIFEST.MF에 추가적인 정보를 등록해줄 뿐 아니라 Packaging 시 실행 가능한 jar 파일로 구조를 변경해줍니다.

#### 수정된 pom.xml
```
<?xml version="1.0" encoding="UTF-8"?>
<project>
    ...
	<dependencies>
        ...
	</dependencies>
	<build>
  		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>
</project>
```

추가할 위치를 확인할 수 있게 대략적인 구조와 함께 가져왔습니다.

```<build>```부터 내용을 ```<dependencies>```뒤에 추가해 주시면 됩니다.

#### 수정된 MANIFEST.MF
```
Manifest-Version: 1.0
Created-By: Maven Jar Plugin 3.2.0
Build-Jdk-Spec: 15
Implementation-Title: demo
Implementation-Version: 0.0.1-SNAPSHOT
Main-Class: org.springframework.boot.loader.JarLauncher
Start-Class: com.example.demo.DemoApplication
Spring-Boot-Version: 2.4.2
Spring-Boot-Classes: BOOT-INF/classes/
Spring-Boot-Lib: BOOT-INF/lib/
Spring-Boot-Classpath-Index: BOOT-INF/classpath.idx
Spring-Boot-Layers-Index: BOOT-INF/layers.idx
```

* Main-Class: Springboot 어플리케이션이기 때문에 Main-class의 값은 Springboot의 org.springframework.boot.loader.JarLauncher로 지정되어야 합니다.
* Start-Class: 어플리케이션의 MainClass입니다. (이 MainClass를 위 Main-Class의 Value로 지정하는 것이 아님을 주의합시다.)
* Spring-Boot-Classes: 컴파일 된 Class 파일들이 위치한 경로입니다.
* Spring-Boot-Lib: pom.xml에 추가한 의존하고 있는 라이브러리들이 위차한 경로를 정의합니다.

### 4. 또 다른 방법?
이 방법 또한 같은 내용을 검색해서 발견했던 방법입니다. 마찬가지로 해당 오류는 해결이 됩니다만 차이점이 있습니다.

#### 해결하고자 하는 오류 내용
```
no main manifest attribute, in /restful_springboot.jar
```

#### pom.xml에 추가한 내용
```
<build>
	<plugins>
		<plugin>
			<groupId>org.apache.maven.plugins</groupId>
			<artifactId>maven-jar-plugin</artifactId>
			<configuration> 
				<archive> 
					<manifest> 
					    <addClasspath>true</addClasspath>
						<mainClass>com.example.demo.DemoApplication</mainClass> 
					</manifest> 
				</archive> 
			</configuration>
		</plugin>
	</plugins>
</build>
```

이 방법도 앞서 말씀드렸듯이 위 오류를 해결해 줍니다. 다만 docker run을 했을 때 다음 오류가 발생합니다.
```
Exception in thread "main" java.lang.NoClassDefFoundError: org/springframework/boot/SpringApplication
        at com.example.demo.DemoApplication.main(DemoApplication.java:10)
Caused by: java.lang.ClassNotFoundException: org.springframework.boot.SpringApplication
        at java.net.URLClassLoader.findClass(URLClassLoader.java:381)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:424)
        at sun.misc.Launcher$AppClassLoader.loadClass(Launcher.java:331)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:357)
        ... 1 more
```

#### MANIFEST.MF
```
Manifest-Version: 1.0
Created-By: Maven Jar Plugin 3.2.0
Build-Jdk-Spec: 15
Class-Path: [생략]
Implementation-Title: demo
Implementation-Version: 0.0.1-SNAPSHOT
Main-Class: com.example.demo.DemoApplication
```
위에서와 차이점은 Start-Class에 들어갔던 MainClass가 Main-Class 값으로 들어가 있다는 것입니다.

처음 저는 Main-Class에 당연히 MainClass의 경로가 들어가야 한다 생각했습니다. 

하지만 Main-Class에 JVM이 jar 파일에서 가장 처음 실행할 Main class가 들어가야 하기 때문에 위의 경우 또 다른 오류가 발생하게 되는 것입니다.


### 끝
이 두 부분 때문에 Docker에 엄청 시간이 들었네요ㅎㅎ 원인을 찾게 되어 속이 시원합니다.

많은 도움 되었으면 좋겠습니다!

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>
