## AI 퀴즈 생성 및 검증 플랫폼

단어 3개를 기반으로 AI 그림 퀴즈를 생성하고, 사용자가 직접 검증할 수 있는 웹 애플리케이션입니다.
gemini api를 사용하였으며, Google API Key가 필요합니다. 
프론트엔드는 React + TypeScript + MUI Joy, 백엔드는 Spring Boot를 사용하며, JWT 기반 인증 시스템과 관리자 검증 로직이 구현되어 있습니다.


## 주요 기능

- 퀴즈 생성 (단어 3개 입력 기반)
- 퀴즈 검증 기능 (검증 팝업 포함)
- 퀴즈 풀기
- 사용자 인증 및 로그인/회원가입
- 퀴즈 랭킹 조회
- 관리자 검증 및 권한 제어 (생성자만 삭제/검증 가능)

## 동작 방식

## 🛠 기술 스택

### Frontend
- React (Vite + TypeScript)
- MUI Joy UI
- React Router DOM

### Backend
- Spring Boot
- Spring Security + JWT
- Gradle
- MySQL


## 데이터베이스 초기화 및 사용자 권한 설정 안내

### 데이터베이스 초기화 (backend/init.sql)
- 프로젝트 실행에 필요한 데이터베이스와 테이블 구조를 정의합니다.

- init.sql 파일은 Git 저장소에 포함되어 있으며,
도커 컨테이너 초기 실행 시 자동으로 실행됩니다.

- 별도의 사용자 계정 생성이나 권한 부여는 포함하지 않습니다.

### 개발용 사용자 및 권한 설정
- 개발 환경에서 사용할 데이터베이스 사용자 계정과 권한 설정은 별도 스크립트로 관리합니다.

- 보안상의 이유로 이 스크립트는 Git 저장소에 포함하지 않습니다.

- 사용자 생성 및 권한 부여 SQL 예시는 아래와 같습니다:

DROP USER IF EXISTS 'dev'@'%';
CREATE USER 'dev'@'%' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON ai_quizpic.* TO 'dev'@'%';
FLUSH PRIVILEGES;
각 개발자는 자신의 환경에 맞게 직접 실행하여 사용자 계정을 생성해야 합니다.

- 환경 변수 관리
데이터베이스 접속 정보(사용자명, 비밀번호 등)는 .env 파일이나 환경 변수로 관리합니다.

- .env 파일은 .gitignore에 등록되어 있어 저장소에 포함되지 않습니다.

.env는 Frontend/.env와 루트 디렉토리의 .env 파일 두가지가 필요합니다. 예시는 아래와 같습니다.

Frontend/.env
VITE_SERVER_URL='your_backend_url'

/.env
GOOGLE_API_KEY='your_gemini_api_key'
JWT_SECRET='your_JWT_KEY'
BACKEND_SERVICE_URL='your_backend_url'
MYSQL_ROOT_PASSWORD='your_root_password'
MYSQL_USER='your_db_user_name'
MYSQL_PASSWORD='your_db_password'

## 기타 사항
- 본 어플리케이션은 Docker 환경에서 실행됩니다.
- 로컬 환경의 /Backend/images 폴더와 Docker의 볼륨이 마운트 되어 이곳에 이미지가 저장됩니다.