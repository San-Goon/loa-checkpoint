# 로아 검문소
> 로스트아크 군장검사를 OCR 기능을 이용하여 자동화한 웹입니다.


![](../header.png)

## 개발 환경 실행 방법
Node v20.11.0
```sh
npm install
npm run dev
```

## 사용 예제
![-Chrome2024-03-0619-43-11-ezgif com-cut](https://github.com/San-Goon/loa-checkpoint/assets/84852012/6a265e3f-0b96-4a91-9a54-31e79268510a)

## 사용된 기술
* TypeScript
* React v18
* Next.js v14 (App Router)
* Tesseract.js v5
* Tanstack Query v5
* Zustand v4
* Shadcn/UI
* Tailwind CSS

## 폴더구조
```bash
    ├── public                  # 폰트, 이미지 등
    ├── src                     
        ├── app
           ├──_component        # 페이지 구현을 위한 컴포넌트
           ├──_lib              # fetch 함수    
        ├── components          # shadcn 으로 생성한 컴포넌트
        ├── lib                 # Global 하게 사용되는 상수, 함수 모음
        ├── model               # Type 정의 모음
        ├── store               # Zustand state store
    ├── README.md               
    └── ...
```

## 릴리즈노트
* 0.0.1
    * 작업 진행 중

## API Documentation
[Lostark OpenAPI Developer Portal](https://developer-lostark.game.onstove.com/getting-started)
