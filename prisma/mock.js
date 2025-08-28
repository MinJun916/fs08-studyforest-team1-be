//////////////////////// study start ////////////////////////
export const study = [
  {
    id: 'b8f11e76-0a9e-4b3f-bccf-8d9b4fbf331e',
    nickName: '푸우', // 닉네임
    studyName: '아침 1시간 코딩 스터디', // 스터디 이름
    description: '매일 아침 7시부터 8시까지 코딩합니다.', // 스터디 소개
    backgroundImg: 'green', // 스터디 배경
    // green : #E1EDDE
    // yellow : #FFF1CC
    // blue : #E0F1F5 
    // pink : #FDE0E9
    // alvaro : 이미지1
    // mikey : 이미지2
    // andrew : 이미지3
    // chris : 이미지4
    password: '1234', // 스터디 비밀번호
    createdAt: '2025-08-27T09:00:00Z',
    updatedAt: '2025-08-27T09:00:00Z',
  },
  {
    id: '2d4c6a12-8a1b-4a1e-9be3-5a9361b7f1cd',
    nickName: '티거',
    studyName: '퇴근 후 알고리즘 스터디',
    description: '평일 저녁 8시에 알고리즘 문제를 풉니다.',
    backgroundImg: 'blue',
    password: '5678',
    createdAt: '2025-08-27T09:00:00Z',
    updatedAt: '2025-08-27T09:00:00Z',
  },
  {
    id: '9f2b64c0-31d0-4a1b-92a9-3b62a42dbfa7',
    nickName: '피글렛',
    studyName: '주말 프로젝트 스터디',
    description: '토/일 오후 2시에 사이드 프로젝트를 진행합니다.',
    backgroundImg: 'alvaro',
    password: '0000',
    createdAt: '2025-08-27T09:00:00Z',
    updatedAt: '2025-08-27T09:00:00Z',
  },
];
//////////////////////// study end ////////////////////////

//////////////////////// point start ////////////////////////
export const point = [
  {
    id: 'fd3ae0a5-8dd5-40b6-b8fd-48870f731db1',
    studyId: 'b8f11e76-0a9e-4b3f-bccf-8d9b4fbf331e', // 스터디 id
    point: 16, // 총점
    createdAt: '2025-08-27T09:00:00Z',
    updatedAt: '2025-08-27T09:00:00Z',
  },
  {
    id: 'a2b7c8d9-1234-4e5f-8a1b-2d4c6a12b7f1',
    studyId: '2d4c6a12-8a1b-4a1e-9be3-5a9361b7f1cd',
    point: 12,
    createdAt: '2025-08-27T09:00:00Z',
    updatedAt: '2025-08-27T09:00:00Z',
  },
  {
    id: 'c3d4e5f6-5678-4b9a-9f2b-64c031d04a1b',
    studyId: '9f2b64c0-31d0-4a1b-92a9-3b62a42dbfa7',
    point: 12,
    createdAt: '2025-08-27T09:00:00Z',
    updatedAt: '2025-08-27T09:00:00Z',
  },
];
//////////////////////// point end ////////////////////////

//////////////////////// habit start ////////////////////////
export const habit = [
  {
    id: '73cb9639-d8b7-4f11-9a62-53f4187f3f11',
    studyId: 'b8f11e76-0a9e-4b3f-bccf-8d9b4fbf331e', // 스터디 id
    password: '1234', // 습관 비밀번호
    name: '미라클모닝 6시 기상', // 습관 이름
    startDate: '2025-08-27', // 습관 시작일 (요일?)
    endDate: null, // 습관 종료일 
    createdAt: '2025-08-27T09:00:00Z',
    updatedAt: '2025-08-27T09:00:00Z',
  },
];
//////////////////////// habit end ////////////////////////

//////////////////////// habitCheck start ////////////////////////
export const habitCheck = [
  {
    id: '7f70481b-784d-4b0e-bc3e-f05eefc17951',
    habitId: '73cb9639-d8b7-4f11-9a62-53f4187f3f11', // 습관 id
    pointId: 'fd3ae0a5-8dd5-40b6-b8fd-48870f731db1', // 포인트 id
    studyId: 'b8f11e76-0a9e-4b3f-bccf-8d9b4fbf331e', // 스터디 id
    isCompleted: true, // 오늘 습관 완료 여부
    checkDate: '2025-01-01', // 체크한 날짜
    createdAt: '2025-08-27T09:00:00Z',
    updatedAt: '2025-08-27T09:00:00Z',
  },
];
//////////////////////// habitCheck end ////////////////////////

//////////////////////// focus start ////////////////////////
export const focus= [
  {
    id: '936f5ea4-6e6c-4e5e-91a3-78f5644e1f9a',
    studyId: 'b8f11e76-0a9e-4b3f-bccf-8d9b4fbf331e', // 스터디 id
    time: 60, // 공부시간(분)
    createdAt: '2025-08-27T09:00:00Z',
    updatedAt: '2025-08-27T09:00:00Z',
  },
  {
    id: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    studyId: 'b8f11e76-0a9e-4b3f-bccf-8d9b4fbf331e',
    time: 45,
    createdAt: '2025-08-27T10:00:00Z',
    updatedAt: '2025-08-27T10:00:00Z',
  },
  {
    id: 'b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    studyId: 'b8f11e76-0a9e-4b3f-bccf-8d9b4fbf331e',
    time: 30,
    createdAt: '2025-08-27T11:00:00Z',
    updatedAt: '2025-08-27T11:00:00Z',
  },
  {
    id: 'c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f',
    studyId: '2d4c6a12-8a1b-4a1e-9be3-5a9361b7f1cd',
    time: 50,
    createdAt: '2025-08-27T12:00:00Z',
    updatedAt: '2025-08-27T12:00:00Z',
  },
  {
    id: 'd2e3f4a5-6b7c-8d9e-0f1a-2b3c4d5e6f7a',
    studyId: '2d4c6a12-8a1b-4a1e-9be3-5a9361b7f1cd',
    time: 40,
    createdAt: '2025-08-27T13:00:00Z',
    updatedAt: '2025-08-27T13:00:00Z',
  },
  {
    id: 'e3f4a5b6-7c8d-9e0f-1a2b-3c4d5e6f7a8b',
    studyId: '9f2b64c0-31d0-4a1b-92a9-3b62a42dbfa7',
    time: 55,
    createdAt: '2025-08-27T14:00:00Z',
    updatedAt: '2025-08-27T14:00:00Z',
  },
];
//////////////////////// focus end ////////////////////////

//////////////////////// emoji start ////////////////////////
export const emoji = [
  {
    id: '70e1e61d-f2ae-4d7d-bf8f-d65eafdb6a45',
    studyId: 'b8f11e76-0a9e-4b3f-bccf-8d9b4fbf331e', // 스터디 id
    emojiType: '1f423', // unified코드 (emoji-picker-react 참고)  
    count: 1, // 해당이모지 사용 횟수
    createdAt: '2025-08-27T09:00:00Z',
    updatedAt: '2025-08-27T09:00:00Z',
  },
  {
    id: 'e2f1a3b4-5c6d-7e8f-9a0b-1c2d3e4f5a6b',
    studyId: 'b8f11e76-0a9e-4b3f-bccf-8d9b4fbf331e',
    emojiType: '1f44d', 
    count: 3,
    createdAt: '2025-08-27T10:00:00Z',
    updatedAt: '2025-08-27T10:00:00Z',
  },
  {
    id: 'b7c8d9e0-1a2b-3c4d-5e6f-7a8b9c0d1e2f',
    studyId: 'b8f11e76-0a9e-4b3f-bccf-8d9b4fbf331e',
    emojiType: '1f60a',
    count: 2,
    createdAt: '2025-08-27T11:00:00Z',
    updatedAt: '2025-08-27T11:00:00Z',
  },
  {
    id: 'd1e2f3a4-5b6c-7d8e-9f0a-1b2c3d4e5f6a',
    studyId: '2d4c6a12-8a1b-4a1e-9be3-5a9361b7f1cd',
    emojiType: '1f389', 
    count: 4,
    createdAt: '2025-08-27T12:00:00Z',
    updatedAt: '2025-08-27T12:00:00Z',
  },
  {
    id: 'a5b6c7d8-9e0f-1a2b-3c4d-5e6f7a8b9c0d',
    studyId: '2d4c6a12-8a1b-4a1e-9be3-5a9361b7f1cd',
    emojiType: '1f525', 
    count: 2,
    createdAt: '2025-08-27T13:00:00Z',
    updatedAt: '2025-08-27T13:00:00Z',
  },
  {
    id: 'f1a2b3c4-5d6e-7f8a-9b0c-1d2e3f4a5b6c',
    studyId: '9f2b64c0-31d0-4a1b-92a9-3b62a42dbfa7',
    emojiType: '1f604', 
    count: 5,
    createdAt: '2025-08-27T14:00:00Z',
    updatedAt: '2025-08-27T14:00:00Z',
  },
  {
    id: 'b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    studyId: '9f2b64c0-31d0-4a1b-92a9-3b62a42dbfa7',
    emojiType: '1f44c', 
    count: 2,
    createdAt: '2025-08-27T15:00:00Z',
    updatedAt: '2025-08-27T15:00:00Z',
  },
  {
    id: 'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
    studyId: '9f2b64c0-31d0-4a1b-92a9-3b62a42dbfa7',
    emojiType: '1f618', 
    count: 1,
    createdAt: '2025-08-27T16:00:00Z',
    updatedAt: '2025-08-27T16:00:00Z',
  },
  {
    id: 'd4e5f6a7-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
    studyId: '9f2b64c0-31d0-4a1b-92a9-3b62a42dbfa7',
    emojiType: '1f389', 
    count: 3,
    createdAt: '2025-08-27T17:00:00Z',
    updatedAt: '2025-08-27T17:00:00Z',
  },
  {
    id: 'e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
    studyId: '9f2b64c0-31d0-4a1b-92a9-3b62a42dbfa7',
    emojiType: '1f44f', 
    count: 4,
    createdAt: '2025-08-27T18:00:00Z',
    updatedAt: '2025-08-27T18:00:00Z',
  },
];
//////////////////////// emoji end ////////////////////////



