export type Hospital = {
  yadmNm: string; // 요양병원명
  sidoNm: string; // 시도명
  sgguNm: string; // 시군구명
  recuClCd: number; // 요양종별코드(11:종합병원, 21:병원, 31:의원)
  addr: string; // 주소
  telno: string; // 전화번호
  mgtStaDd: number; // 운영시작일자
  ratPsblYn: string; // RAT(신속항원검사) 가능여부
  pcrPsblYn: string; // PCR 가능여부
  XPosWgs84: number; // 세계지구 x 좌표
  YPosWgs84: number; // 세계지구 y 좌표
};
