export const EVENT_ERRORS = {
  NOT_FOUND: '찾을 수 없는 이벤트입니다.',
  START_DATE_AFTER_END_DATE: '시작일은 종료일보다 이전이어야 합니다.',
  DUPLICATE_NAME: '같은 이름의 이벤트가 이미 존재합니다.',
  MISSING_CONDITIONS: '이 이벤트 타입에는 조건이 필요합니다.',
  UNSUPPORTED_EVENT_TYPE: '지원되지 않는 이벤트 타입입니다.',

  // 이벤트 타입별 에러 메시지
  DAILY_LOGIN: {
    INVALID_CONDITION: '일일 로그인 이벤트에는 dailyReset 조건이 필요합니다.',
  },
  DAILY_TASK: {
    INVALID_CONDITION: '일일 태스크 이벤트에는 dailyReset 조건이 필요합니다.',
  },
  ITEM_COLLECTION: {
    MISSING_TASK:
      '아이템 수집 이벤트에는 최소 하나 이상의 itemCollection 태스크가 필요합니다.',
  },
};

export const REWARD_ERRORS = {
  NOT_FOUND: '찾을 수 없는 보상입니다.',
  EVENT_NOT_FOUND: '찾을 수 없는 이벤트입니다.',
};

export const REWARD_REQUEST_ERRORS = {
  EVENT_NOT_FOUND: '이벤트를 찾을 수 없습니다.',
  EVENT_NOT_ACTIVE: '현재 활성화되지 않은 이벤트입니다.',
  REWARD_NOT_FOUND: '이 이벤트에 대한 보상을 찾을 수 없습니다.',
  AUTHENTICATION_REQUIRED: '로그인이 필요합니다.',
  DAILY_LIMIT_REACHED: '이미 오늘 보상을 요청했습니다.',
  EXCHANGE_LIMIT_REACHED: '이 보상에 대한 최대 요청 횟수에 도달했습니다.',
};
