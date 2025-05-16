import { EventStatus, EventType } from '../../src/generated/mongo/client.js';

const generateRandomObjectIdString = (): string => {
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
  return (
    timestamp +
    'xxxxxxxxxxxxxxxx'
      .replace(/[x]/g, () => {
        return ((Math.random() * 16) | 0).toString(16);
      })
      .toLowerCase()
  );
};

const eventOneRewards = [
  {
    name: '메이프릴 리프',
    type: 'EVENT_CURRENCY',
    quantity: 50,
    rewardOrder: null,
  },
  {
    name: '경험치 2배 쿠폰(30분)',
    type: 'ITEM_COUPON_EXP',
    quantity: 1,
    rewardOrder: null,
  },
  {
    name: '특별 의자 (7일 누적)',
    type: 'COSMETIC_CHAIR',
    quantity: 1,
    rewardOrder: 7,
  },
  {
    name: '특별 데미지 스킨 (14일 누적)',
    type: 'COSMETIC_SKIN',
    quantity: 1,
    rewardOrder: 14,
  },
  {
    name: '이벤트링 선택권 (21일 누적)',
    type: 'ITEM_CHOICE_BOX',
    quantity: 1,
    rewardOrder: 21,
  },
];

const eventTwoRewards = [
  {
    rewardOrder: 1,
    name: '[3성]텔레포트 월드맵(7일)',
    type: 'ITEM',
    quantity: 1,
  },
  {
    rewardOrder: 2,
    name: '경험치 2배 쿠폰(15분)',
    type: 'ITEM_COUPON_EXP',
    quantity: 3,
  },
  {
    rewardOrder: 3,
    name: '정령의 펜던트(7일)',
    type: 'EQUIPMENT_PENDANT',
    quantity: 1,
  },
  { rewardOrder: 4, name: '수상한 큐브 10개', type: 'ITEM_CUBE', quantity: 10 },
  {
    rewardOrder: 5,
    name: '주문의 흔적 500개',
    type: 'ITEM_ENHANCE',
    quantity: 500,
  },
  {
    rewardOrder: 6,
    name: '스페셜 명예의 훈장',
    type: 'ITEM_HONOR',
    quantity: 1,
  },
  {
    rewardOrder: 7,
    name: '마일리지 500',
    type: 'POINT_MILEAGE',
    quantity: 500,
  }, // 포인트는 itemId가 없을 수도 있음
  {
    rewardOrder: 8,
    name: '마스터리 북 20 & 30 세트',
    type: 'ITEM_MASTERY_BOOK_SET',
    quantity: 1,
  },
  {
    rewardOrder: 9,
    name: '경험치 2배 쿠폰(15분)',
    type: 'ITEM_COUPON_EXP',
    quantity: 5,
  },
  {
    rewardOrder: 10,
    name: '의문의 메소 주머니 3개',
    type: 'ITEM_MESO_POUCH',
    quantity: 3,
  },
  {
    rewardOrder: 11,
    name: '강력한 환생의 불꽃 3개',
    type: 'ITEM_FLAME_REBIRTH',
    quantity: 3,
  },
  {
    rewardOrder: 12,
    name: '선택 슬롯 8칸 확장권',
    type: 'ITEM_SLOT_EXPANSION_SELECT',
    quantity: 1,
  },
  {
    rewardOrder: 13,
    name: '캐릭터 슬롯 증가 쿠폰',
    type: 'ITEM_CHARACTER_SLOT',
    quantity: 1,
  },
  {
    rewardOrder: 14,
    name: '레드 큐브 5개 교환권',
    type: 'ITEM_EXCHANGE_TICKET_CUBE',
    quantity: 1,
  },
  {
    rewardOrder: 15,
    name: '[3성]텔레포트 월드맵(14일)',
    type: 'ITEM',
    quantity: 1,
  },
  {
    rewardOrder: 16,
    name: '경험치 2배 쿠폰(30분)',
    type: 'ITEM_COUPON_EXP',
    quantity: 3,
  },
  {
    rewardOrder: 17,
    name: '정령의 펜던트(14일)',
    type: 'EQUIPMENT_PENDANT',
    quantity: 1,
  },
  {
    rewardOrder: 18,
    name: '미라클 서큘레이터 3개',
    type: 'ITEM_CIRCULATOR',
    quantity: 3,
  },
  {
    rewardOrder: 19,
    name: '주문의 흔적 1000개',
    type: 'ITEM_ENHANCE',
    quantity: 1000,
  },
  {
    rewardOrder: 20,
    name: '성향 성장의 물약',
    type: 'ITEM_TRAIT_POTION',
    quantity: 1,
  },
  {
    rewardOrder: 21,
    name: '마일리지 1000',
    type: 'POINT_MILEAGE',
    quantity: 1000,
  }, // 포인트는 itemId가 없을 수도 있음
  {
    rewardOrder: 22,
    name: '데미지 스킨 저장 슬롯 1칸 확장권',
    type: 'ITEM_DAMAGE_SKIN_SLOT',
    quantity: 1,
  },
  {
    rewardOrder: 23,
    name: '선택 아케인심볼 20개 교환권',
    type: 'ITEM_EXCHANGE_TICKET_ARCANE',
    quantity: 1,
  },
  {
    rewardOrder: 24,
    name: '의문의 메소 주머니 5개',
    type: 'ITEM_MESO_POUCH',
    quantity: 5,
  },
  {
    rewardOrder: 25,
    name: '영원한 환생의 불꽃 3개',
    type: 'ITEM_FLAME_REBIRTH_ETERNAL',
    quantity: 3,
  },
  {
    rewardOrder: 26,
    name: '에픽 잠재능력 부여 주문서 50%',
    type: 'ITEM_SCROLL_POTENTIAL_EPIC',
    quantity: 1,
  },
  {
    rewardOrder: 27,
    name: '에디셔널 큐브 3개',
    type: 'ITEM_CUBE_ADDITIONAL',
    quantity: 3,
  },
  {
    rewardOrder: 28,
    name: '블랙 큐브 5개 교환권',
    type: 'ITEM_EXCHANGE_TICKET_CUBE',
    quantity: 1,
  },
];

const eventThreeRewards = [
  {
    name: '데미지 랜덤 스킨 상자',
    type: 'ITEM_BOX',
    quantity: 1,
    rewardOrder: null,
    externalItemId: generateRandomObjectIdString(),
  },
];
export const eventsSeed = [
  {
    name: '메이프릴 아일랜드 방문 및 일일 미션',
    description:
      '매일 메이프릴 아일랜드에 방문하고 일일 미션을 완료하여 보상을 받으세요! 누적 출석 보상도 놓치지 마세요!',
    eventType: EventType.DAILY_LOGIN,
    conditions: {
      tasks: [
        {
          type: 'mapEntry',
          mapName: '메이프릴_아일랜드',
          description: '매일 메이프릴 아일랜드 입장하기',
        },
      ],
      dailyReset: true,
    },
    startDate: new Date('2025-06-01T00:00:00Z'),
    endDate: new Date('2025-06-30T23:59:59Z'),
    status: EventStatus.ACTIVE,
    npcName: '카산드라',
    rewardsToCreate: eventOneRewards.map((reward) => ({
      ...reward,
      externalItemId: generateRandomObjectIdString(),
    })),
  },
  {
    name: '데일리 기프트 (페어리 브로)',
    description:
      '매일매일 접속하고 간단한 과제를 완료하여 푸짐한 선물을 받으세요! (7월 한정)',
    eventType: EventType.DAILY_TASK,
    conditions: {
      tasks: [
        {
          type: 'monsterHunt',
          targetCount: 300,
          description: '레벨 범위 몬스터 300마리 사냥',
        },
        {
          type: 'eliteHunt',
          targetCount: 3,
          description: '엘리트 몬스터 3마리 처치',
        },
        {
          type: 'boosHunt',
          targetCount: 1,
          description: '보스 몬스터 1마리 처치',
        },
      ],
      dailyReset: true,
    },
    startDate: new Date('2025-07-01T00:00:00Z'),
    endDate: new Date('2025-07-31T23:59:59Z'),
    status: EventStatus.ACTIVE,
    npcName: '메이플 운영자',
    rewardsToCreate: eventTwoRewards.map((reward) => ({
      ...reward,
      externalItemId: generateRandomObjectIdString(),
    })),
  },
  {
    name: '20주년 기념 흔적 수집',
    description:
      '"빛나는 별의 파편" 100개를 모아 "메이플 운영자"에게 특별한 보상으로 교환하세요! (계정당 1회 한정)',
    eventType: EventType.ITEM_COLLECTION,
    conditions: {
      tasks: [
        {
          type: 'itemCollection',
          itemName: '빛나는 별의 파편',
          itemQuantity: 100,
          description: '"빛나는 별의 파편" 100개 수집',
        },
      ],
      exchangeLimitPerAccount: 1,
    },
    startDate: new Date('2025-07-01T00:00:00Z'),
    endDate: new Date('2025-07-31T23:59:59Z'),
    status: EventStatus.ACTIVE,
    npcName: '메이플 운영자',
    rewardsToCreate: eventThreeRewards.map((reward) => ({
      ...reward,
      externalItemId: generateRandomObjectIdString(),
    })),
  },
];
