# 이벤트 리워드 플랫폼 개발 고민 과정
이 문서는 Event-reward-platform 개발 과정에서의 기술적 결정과 고민 사항들을 정리한 것입니다. 서버 구현과 아키텍처 설계에 관한 의사결정 과정을 공유합니다.

## 1. Monorepo 아키텍처 선택 이유

프로젝트의 기본 요구사항은 MSA(Microservice Architecture) 구조였습니다. 이를 효율적으로 구현하면서도 개발 생산성을 높이기 위해 Turbo를 활용한 Monorepo 아키텍처를 선택했습니다.

#### 장점
- **MSA와 Monorepo의 조화**: 코드 레벨에서는 Monorepo로 통합 관리하지만, 각 서비스별로 독립적인 Docker 이미지를 생성할 수 있어 실제 배포 환경에서는 MSA 구조로 구현이 가능합니다.
- **공통 모듈 공유**: 인증, 데이터베이스 연결, 환경 설정 등 여러 서비스에서 공통으로 사용하는 코드를 패키지로 분리하여 재사용성 향상 되었습니다.
- **일관된 개발 경험**: 단일 저장소에서 모든 서비스를 관리하므로 개발자 경험과 코드 품질 관리가 용이 합니다.
- **빌드 최적화**: Turbo를 통한 캐싱 및 빌드 시간 단축 (turbo prune) 및 의존성 관리 개선 되었습니다. 특히 이 과정에서 ESM 모듈을 함께 사용하여, 정적으로 import가 이뤄지기 때문에, build 타임때, 정확하게 사용되는 모듈이 추적 가능 해집니다. 이로 인해 최적화 되었다고 말씀 드릴 수 있습니다.

#### 구체적인 구현
- `packages/` 디렉토리에 공통 기능을 모듈화하여 여러 서비스에서 재사용
- `@packages/database`: 데이터베이스 연결 및 스키마 관리
- `@packages/guards`: 인증 및 권한 검사 기능
- `@packages/env-config`: 환경 변수 설정 관리
- `@packages/filters`: 예외 처리 필터
- 그외 packages/* 경로에 있는 모듈은 어느 app에서나 재활용 가능

- `apps/` 디렉토리에 독립적인 마이크로서비스 구현
    - `gateway`: API 게이트웨이 역할
    - `auth`: 인증 관련 기능 담당
    - `event`: 이벤트 및 리워드 관리

## 2. 가장 많이 고민한 보상 요청 조건 검증
보상 지급 요청 시, 사용자가 해당 이벤트의 조건을 실제로 달성했는지 검증하는 로직은 플랫폼의 핵심 기능 중 하나이며, 가장 많은 고민을 한 부분입니다. 이 검증 로직은 `apps/event-server/src/modules/reward-request/reward-request.service.ts` 파일 내의 `verifyTaskConditions` private 메서드에 상세히 구현되어 있습니다.

-   **이벤트 조건 타입 정의**: 이벤트 생성 시, 조건의 유형(예: 맵 입장, 몬스터 사냥, 아이템 수집 등)을 `packages/interface/src/event.interface.ts`에 정의된 특정 타입에 따라 지정하도록 설계했습니다. 이를 통해 각 이벤트는 자신에게 맞는 조건 타입을 명확히 가질 수 있습니다.
-   **타입 가드를 활용한 조건 검증**: 보상 요청이 들어오면, 해당 이벤트에 설정된 조건 타입을 기반으로 타입 가드(Type Guards)를 사용하여 각 조건에 맞는 검증 로직 플로우를 실행합니다. 예를 들어, '몬스터 사냥' 조건이라면 실제 인게임 서버에 해당 유저의 몬스터 사냥 카운트를 요청하여 달성 여부를 확인하는 방식입니다. (현재는 `fakeAxios`를 통해 외부 API 호출을 시뮬레이션하고 있습니다.)
-   **조건 확장성**: 새로운 유형의 이벤트 조건이 추가되더라도, 기존에 정의된 조건 타입이나 검증 로직에는 영향을 주지 않도록 설계했습니다. 새로운 조건 타입과 그에 따른 검증 로직만 추가하면 되므로, 시스템의 유지보수성과 확장성을 높였습니다. 예를 들어, '보스 몬스터 처치'라는 새로운 조건이 생긴다면, `TaskType`에 'bossHunt'를 추가하고, `verifyTaskConditions` 내에서 해당 타입에 대한 검증 로직을 구현하면 됩니다.
-   **비동기 처리 및 병렬 검증**: 다수의 태스크 조건이 있을 경우, `Promise.allSettled`를 사용하여 각 조건 검증 API 호출을 병렬로 처리합니다. 이를 통해 검증 시간 지연을 최소화하고, 모든 조건이 성공적으로 완수되었는지 여부를 효율적으로 판단합니다.

이러한 접근 방식을 통해 다양한 이벤트 조건에 유연하게 대응하고, 정확한 보상 지급을 보장하며, 향후 새로운 조건 추가 시에도 시스템 변경의 영향을 최소화할 수 있도록 구현했습니다.

## 3. MSA 구조를 위한 Gateway Proxy 사용 이유 및 구현

마이크로서비스 아키텍처(MSA)로 시스템을 구성하면서, 각 서비스들의 엔드포인트를 단일화하고 관리의 효율성을 높이기 위해 API 게이트웨이 패턴을 적용했습니다. 특히 NestJS 환경에서 HTTP 요청을 다른 서비스로 전달(proxy)하는 기능을 구현하여 MSA 구조를 완성했습니다.

#### Gateway Proxy 사용 이유

-   **단일 진입점(Single Entry Point)**: 클라이언트는 게이트웨이라는 단일 엔드포인트하고만 통신합니다. 이를 통해 각 마이크로서비스의 복잡한 내부 구조를 클라이언트로부터 숨길 수 있습니다.
-   **라우팅 및 로드 밸런싱**: 게이트웨이는 들어오는 요청을 적절한 마이크로서비스로 라우팅하며, 필요에 따라 로드 밸런싱 기능도 수행할 수 있습니다. (현재 프로젝트에서는 기본적인 라우팅에 중점을 두었습니다.)
-   **공통 관심사 처리**: 인증, 로깅, 모니터링, 요청/응답 변환 등 여러 마이크로서비스에 공통적으로 필요한 기능을 게이트웨이에서 중앙 집중적으로 처리할 수 있습니다. 본 프로젝트에서는 JWT 토큰 검증 및 역할(Role) 기반 권한 검사를 게이트웨이에서 수행합니다. 이는 앞에서 설명 드린 Turbo에 있는 기능과 잘 어울립니다. [참고](../apps/gateway-server/Dockerfile)

#### 구체적인 구현 (`apps/gateway/src/main.ts` 및 `apps/gateway/src/proxy/`)

-   **Fastify 기반 프록시 설정**: `apps/gateway/src/main.ts` 파일의 `bootstrap` 함수 내에서 `ProxyService`를 가져와 `registerProxies` 메서드를 호출합니다. 이 메서드는 Fastify 애플리케이션 인스턴스에 프록시 설정을 등록합니다.
-   **동적 라우트 설정**: `apps/gateway/src/proxy/proxy.config.ts` 파일에는 각 마이크로서비스(예: `auth-server`, `event-server`)의 API 호스트 정보를 기반으로 프록시 라우트를 정의하는 함수들이 있습니다. 예를 들어, `authRoutes` 함수는 `authApiHost`를 인자로 받아 인증 및 사용자 관련 API 경로에 대한 프록시 규칙을 반환합니다.
    ```typescript
    // proxy.config.ts 예시
    export const authRoutes = (authApiHost: string): ProxyRoute[] => [
      {
        upstream: authApiHost, // 실제 auth-server 주소
        prefix: '/api/v1/auth', // 게이트웨이에서 받을 경로
        rewritePrefix: '/api/v1/auth', // auth-server로 전달될 때의 경로 (필요시 변경 가능)
      },
      // ... 기타 라우트
    ];
    ```
-   **프록시 모듈화**: 프록시 관련 로직은 `ProxyModule` (`apps/gateway/src/proxy/proxy.module.ts`) 및 `ProxyService` (`apps/gateway/src/proxy/proxy.service.ts`)로 모듈화하여 관리합니다. `ProxyService`는 환경 설정(`ConfigModule`)을 통해 각 서비스의 호스트 정보를 주입받아 실제 프록시 설정을 수행합니다.

이를 통해 클라이언트는 게이트웨이의 `/api/v1/auth/**` 경로로 요청을 보내면, 게이트웨이가 이를 실제 `auth-server`로 전달하여 MSA 구조에서의 통신을 효율적으로 관리할 수 있게 됩니다.

## 4. Prisma ORM 활용

MongoDB와의 연동을 위해 Prisma ORM을 사용했습니다:

- **타입 안전성**: MongoDB의 스키마리스 특성에도 불구하고, Prisma를 통해 TypeScript와의 강력한 타입 통합을 이루어냈습니다.
- **일관된 쿼리 API**: 다양한 서비스에서 일관된 방식으로 데이터베이스에 접근할 수 있습니다. (확장성 고려)
- **관계 관리**: 이벤트-보상, 유저-이벤트 참여 등의 관계를 직관적으로 관리할 수 있습니다.
- [MongoService](../packages/database/src/mongo/mongo.service.ts) 클래스를 통해 Prisma 클라이언트를 확장하고, NestJS 라이프사이클에 통합했습니다


## 5. 아쉬운 점

- NestJS를 선택하는 여러 이유 중에 한 가지는, 역할과 책임을 각기 다른 모듈별로 분리하기 용이 하고, 이를 통해서 메소드가 하나의 역할만을 한다면, 이는 테스트 코드를 작성하기에 매우 용이한 코드가 될 것 입니다. 실제로도 항상 테스트를 염두해두고 코드를 작성하는데 ([파일](../apps/event-server/src/modules/reward-request/reward-request.controller.ts) 참고) 역량이 부족하여 테스트 코드를 작성하지 못 하였습니다.
- 그 외에도 하고 싶었으나 하지 못한 리스트를 적어 드립니다.
  - [ ] Swagger
  - [ ] API limit