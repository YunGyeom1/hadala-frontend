export const CENTER_CONSTANTS = {
  // 폼 검증 규칙
  VALIDATION: {
    NAME_MAX_LENGTH: 100,
    PHONE_REGEX: /^[0-9-+\s()]+$/,
    LATITUDE_MIN: -90,
    LATITUDE_MAX: 90,
    LONGITUDE_MIN: -180,
    LONGITUDE_MAX: 180,
  },
  
  // 상태 텍스트
  STATUS: {
    OPERATIONAL: '운영중',
    NON_OPERATIONAL: '운영중지',
  },
  
  // 기본값
  DEFAULTS: {
    IS_OPERATIONAL: true,
  },
  
  // 에러 메시지
  ERRORS: {
    NAME_REQUIRED: '센터명은 필수입니다',
    NAME_TOO_LONG: '센터명은 100자 이하여야 합니다',
    INVALID_PHONE: '올바른 전화번호 형식이 아닙니다',
    INVALID_LATITUDE: '위도는 -90에서 90 사이의 숫자여야 합니다',
    INVALID_LONGITUDE: '경도는 -180에서 180 사이의 숫자여야 합니다',
    INVALID_OPERATING_HOURS: '종료 시간은 시작 시간보다 늦어야 합니다',
    FETCH_FAILED: '센터 목록을 불러오는데 실패했습니다',
    CREATE_FAILED: '센터 생성에 실패했습니다',
    UPDATE_FAILED: '센터 수정에 실패했습니다',
    DELETE_FAILED: '센터 삭제에 실패했습니다',
  },
  
  // 플레이스홀더
  PLACEHOLDERS: {
    NAME: '센터명을 입력하세요',
    ADDRESS: '서울시 강남구...',
    REGION: '강남구',
    PHONE: '010-1234-5678',
    LATITUDE: '37.5665',
    LONGITUDE: '126.9780',
    SEARCH: '센터명으로 검색...',
    COMPANY_SEARCH: '해당 회사 센터 검색...',
  },
}; 