import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import {GoogleGenerativeAI} from '@google/generative-ai';

const TOPICS_FILE = path.join(process.cwd(), 'topics.json');
const POSTS_DIR = path.join(process.cwd(), '_posts');
const TAG_FILE = path.join(process.cwd(), '_data/tags.yml');
const FORMAT = path.join(process.cwd(), '_data/format.yml');

// 모델 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({model: 'gemini-2.5-flash'});

// 기존 주제 로드
let pastTopics = [];
try {
    const raw = await fs.readFile(TOPICS_FILE, 'utf-8');
    try {
        pastTopics = JSON.parse(raw);
    } catch (e) {
        pastTopics = [];
    }
} catch (err) {
    if (err.code !== 'ENOENT') throw err;
}
// 기존 tag 로드
let pastTags = [];
try {
    try {
        const fileContents = await fs.readFile(TAG_FILE, 'utf8');
        const tags = yaml.load(fileContents);
        pastTags = Array.isArray(tags) ? tags : [];
    } catch (err) {
        console.error('❌ Error loading tags:', err);
        pastTags = [];
    }
} catch (err) {
    if (err.code !== 'ENOENT') throw err;
}

function saveFile(file, text) {
    fs.mkdir(path.dirname(file), {recursive: true}).then(() => {
        fs.writeFile(file, text, 'utf-8');
    })
}

// 주제 저장
function saveTopics(newTopic) {
    pastTopics.push(newTopic);
    saveFile(TOPICS_FILE, JSON.stringify(pastTopics, null, 2));
}

function saveTags(newTags = []) {
    if (!Array.isArray(newTags)) {
        throw new Error('newTags must be an array of strings.');
    }

    // 기존 + 신규 태그 합치기 (대소문자 구분 없이 중복 제거)
    const merged = [...pastTags, ...newTags];
    const unique = [
        ...new Map(merged.map(tag => [tag.toLowerCase(), tag])).values()
    ];

    // 파일로 저장
    try {
        const yamlContent = yaml.dump(unique, {lineWidth: -1});
        saveFile(TAG_FILE, yamlContent);
        pastTags = unique;
        console.log('✅ Tags updated successfully!');
    } catch (err) {
        console.error('❌ Error writing tags:', err);
    }
}

// 중복 체크
const isDuplicate = (topic) =>
    pastTopics.some(t => t.topic.toLowerCase() === topic.toLowerCase());

// Gemini로 주제 생성
async function generateTopic() {
    let topic, tags;
    let attempts = 0;

    do {
        attempts++;

        const result = await model.generateContent(`
            웹개발, java 관련 기술, db 관련 기술 중 하루 1개 포스트 주제를 한 문장으로 제안해줘. 20자 이내로 한 개만 줘 한개만.
            
            이미 선별한 주제와 겹치지 않게 해줘. 
            => [${pastTopics}]
            
            응답 형식은 
            '{
              topic: {주제},
              tags: [관련 tag]  
            }' 
            으로 바로 응답 전체를 json으로 파싱 될 수 있게 text 형식으로 반환.
            코드 블록에 넣지 말고!
            
            * tag는 한국어거나 영어(소문자)
            * 영어로 표현 가능하면 영어로 하고 tag 간 중복 없이 (java면 java, 자바 이렇게 두개가 아니라 java 하나만)
        `);

        // 결과 텍스트 추출
        const jsonResult = JSON.parse(result.response.text());
        topic = jsonResult.topic;
        tags = jsonResult.tags;

        if (attempts > 5) {
            console.warn('중복 방지를 위해 재시도 최대 횟수 초과. 주제 확정!');
            break;
        }
    } while (isDuplicate(topic));

    return {topic, tags};
}

// 포스트 생성
async function generatePost(topic, tags) {
    const dateString = new Date().toISOString().split('T');
    const date = dateString[0];
    const time = dateString[1];

    const prompt = `
오늘 날짜(${date}) 기준으로 ${topic}에 대해 조사하고 블로그용 글을 작성하세요.
연관 키워드 태그는 [${tags}]

- Markdown 형식
- 제목/부제목 정리
- 서론, 본문, 결론 포함
- 코드 예시 가능
- 코드 블록 언어 지정
- 문장 다듬기
- 반복 표현 최소화
- 작성자 명은 chaelin1211
- 기술적 정확도 검증
- 분량 조회 시간 1분 내외
- 내용에 날짜 언금은 자제

상위에 아래의 내용을 넣고 만들어줘. 
(title, subtitle은 포스트 내용에 맞게 변경)
---
layout: post
title: "title 내용"
subtitle: "subtitle 내용"
date: ${date} ${time} +0900
background: '/img/posts/pattern01.jpg'
category: Study
tags: [${tags}]
---

가장 아래에는 
<p class = "placeholder">Text by Chaelin & Gemini. Photographs by Chaelin, Unsplash.</p>
를 추가해줘.

대답 없이 블로그 포스트에 넣을 md 파일 내용만 줘.
코드 블록에 넣지 말고.
`;

    console.log('🧠 Generating post...');

    const result = await model.generateContent(prompt);
    const text = result.response.text();


    const filename = `${date}-tech-report.md`;
    const filepath = path.join(POSTS_DIR, filename);
    saveFile(filepath, `${text}`);

    saveTopics({date, topic});
    saveTags(tags);
}

// 실행
(async () => {
    try {
        const {topic, tags} = await generateTopic();
        console.log('Selected topic:', topic);

        await generatePost(topic, tags);
        console.log('✅ Post generated successfully');
    } catch (err) {
        console.error('❌ Error:', err);
    }
})();
