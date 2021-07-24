---
layout: post
title: "ModelMapper"
subtitle: "REST API에서 Entity와 DTO 사이의 Adapter를 찾을 때"
date: 2021-07-24 17:38:00 +0900
background: '/img/posts/plugin.jpg'
category: Study
tags: [library, spring]
---
### ModelMapper
Simple, Intelligent, Object Mapping.

modelmapper 사이트의 메인 로고입니다. 

Object Mapping이란 기능은 무엇이고 언제, 왜 써야 할까요?

*****

#### REST API
서버에서 데이터를 화면에 출력하고자 할 때, 받아온 데이터(Entity)를 그대로가 아닌 수정/파싱이 필요한 경우가 있습니다. 

이런 경우, 별도의 DTO를 만들어 사용합니다.

> 예로는 response로는 error에 관한 정보를 추가적으로 제공하고자 할 때가 있습니다. 그런 경우 error list를 가지는 response DTO를 생성합니다.

> 또는 데이터를 받아온 것 중에서, 일부는 절차상 사용하고, 일부만 화면에 띄우고자 할 때 response DTO를 생성합니다.

최초 생성시에 이런 데이터 수정/파싱이 필요하지 않다고 하더라도 일단은 Entity와 분리해 Response DTO를 따로 만드는 것이 좋습니다. 

추후의 기능 변경시를 대비해 유지보수의 편리함을 위해서도 있고 비즈니스 로직의 노출을 최소화하고자 할 때 사용할 수 도 있습니다.

자세한 부분은 생략하고 이때 왜 model mapper가 필요한지 알아보겠습니다.

*****

### Modelmapper
단순하게 생각하면 비슷한 객체 간의 데이터 매핑을 도와주는 것입니다.

예를들어, A객체를 subA객체로 매핑해 subA객체를 반환하는 로직이 있을 때, modelmapper는 이 매핑을 도와줍니다.

<img class="img-fluid" src="/img/posts/inPost/modelMapper-01.png">

그래서 Entity와 Response에서의 다음과 같이 번거로운 과정을 간단히 변화시켜 줍니다.


```
response.setName(entity.getName());
response.setEmail(entity.getEmail());
response.setGender(entity.getGender());
response.setId(entity.getId());
response.setUpdateDate(entity.getUpdateDate());
```

위처럼 줄줄이 set, get 하던 부분을 아래처럼 간단히 할 수 있게 됩니다.

```
response = modelmapper.map(entity, Response.class);
```

그렇다면 어떻게 사용할까요?

*****

### ModelMapper Setting

* Java 1.8
* Spring boot 
* Maven

#### dependency 설정

```
<dependency>
  <groupId>org.modelmapper</groupId>
  <artifactId>modelmapper</artifactId>
  <version>2.4.2</version>
</dependency>
```

끝입니다!

사용을 위한 설정은 dependency 설정만 끝내면 됩니다.

*****

### ModelMapper 사용법
위에서도 잠깐 나온 방법인데 다음처럼 하면 modelmapper 객체 외에 다른 설정 없이 사용 가능합니다.

단! 매핑될 클래스 간의 멤버 필드의 이름이 유사할 때의 이야기입니다.

```
ModelMapper modelMapper = new ModelMapper();
Response response = modelmapper.map(entity, Response.class);
```

우선 modelmapper 객체를 생성하고, map 메소드에 (원본 객체, 매핑 목적지 클래스)를 파라미터로 넣으면 매핑되어진 객체를 반환합니다.

*****

### Configuration

위에선 이름이 서로 유사할 때 바로 map 메소드를 사용할 수 있다고 했는데 이는 modelmapper 공식 사이트에 나온 가이드에서 확인한 내용입니다.

저는 동일해야 한다고 생각했지만 아니더라고요!

> Even when the source and destination objects and their properties are different, as in the example above, ModelMapper will do its best to determine reasonable matches between properties according to the configured matching strategy.

matching strategy에 따라 최선의 매핑을 해준다고 합니다!

그렇다면 필드간 이름이 전혀 다르면 어떻게 해야할까요?

``` java
modelMapper.typeMap(Entity.class, Response.class)
    .addMappings(mapper -> {
        mapper.map(src -> src.getA(), Destination::setB);
        mapper.map(src -> src.getC(), Destination::setD);
        }
    );
```
위처럼 설정을 해주어야 합니다!

미리 Entity의 A는 Response의 B와, Entity의 C는 Response의 D와 매핑해야 한다는 것을 알리는 것입니다.

```이 부분은 Configuration 파일에 작성해 Bean으로 model mapper를 사용하면 편리합니다.```

``` java
@Configuration
public class ResponseMapper {
    private final ModelMapper modelMapper = new ModelMapper();

    @Bean
    public ModelMapper responseMapper() {
        modelMapper.createTypeMap(Entity.class, Response.class)
            .addMappings(mapper -> {
                mapper.map(Entity::getA, Destination::setB);
                mapper.map(Entity::getC, Destination::setD);
                }
            );
        return modelMapper;
    }
}

```

이런 식으로 설정해서 사용한다면 매번 Entity -> Response 간의 mapping을 위한 설정을 할 필요없이 Autowired로 ResponseMapper 객체를 생성해 사용하면 원하는 설정 값의 modelmapper를 이용할 수 있습니다.

*****

### Matching Strategies
Matching Strategies의 다양한 버전이 있습니다. 이것 또한 설정을 해줄 수 있습니다.

그 전에 토큰이란 해당 이름을 이루고 있는 단어들 입니다.
ex) lastName -> last, name

#### STANDARD
default로, 다음과 같은 기준이 있습니다.
* 토큰 순서에 상관없이 매핑을 해준다.
* 모든 목적지의 필드 이름 토큰들은 매치되어야 한다. 
* 모든 근원지의 필드 이름들에는 적어도 하나의 매치되는 토큰이 있어야 한다.

예로 A(city```Name```), B(name)이 있을때 매핑이 가능합니다.

이외에도 LOOSE, STRICT가 있습니다.

#### LOOSE
계층적인 구조가 존재해 이를 유연하게 매핑하고 싶을 때 사용합니다.

예로 Entity 내에 Name이라는 객체가 존재하고, 그 안에 firstName과 lastName이 존재합니다. 그때, Response에는 Name이라는 객체 없이 firstName, lastName 필드가 존재합니다. 

이 경우 Standard, Strict 경우에는 매핑이 되지 않지만 Loose를 이용한다면 유연하게 매핑이 가능합니다. 단 가장 마지막의 필드 이름이 동일해야 합니다.

* 토큰 순서에 상관없이 매핑을 해준다.
* 마지막 목적지의 필드 이름의 **모든** 토큰들은 매치되어야 한다. 
* 마지막 근원지의 필드 이름들에는 적어도 하나의 매치되는 토큰이 있어야 한다.

이 방식은 원치 않은 방법으로 매핑되는 경우가 종종 발생하기 때문에 잘 사용되지 않습니다.

#### STRICT
이름 그대로 엄격하게 매핑을 하고자 할 때 사용합니다.

잘못 매핑되는 경우를 엄격히 방지하고자 할 때 사용합니다.

* 토큰 순서가 일치해야 한다. (동일한 이름이어야 한다.)
* 모든 목적지의 필드 이름 토큰들은 매치되어야 한다. 
* 모든 근원지의 필드 이름은 **모든** 토큰들과 매치되어야 한다. 

*****

### 끝
Converter와 일부 속성 스킵 등 더 다양한 기능이 있지만 이번 글은 설정과 기초 사용법을 안내하고 이만 마무리 하겠습니다.

추가적인 설명은 아래 링크를 참조해주세요!

<a href="http://modelmapper.org/user-manual/property-mapping/">http://modelmapper.org/user-manual/property-mapping/</a>

*****

> 참고
 * <a href="http://modelmapper.org/getting-started/">http://modelmapper.org/getting-started/</a>

*****

감사합니다.

<p class = "placeholder">Text by Chaelin. Photographs by Chaelin, Unsplash.</p>
