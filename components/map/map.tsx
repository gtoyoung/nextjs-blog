import { useEffect } from "react";
import { Hospital } from "services/nara.types";
import styled from "styled-components";
import "./style.css";

declare global {
  interface Window {
    kakao: any;
  }
}

type MapProps = {
  latitude: number;
  longitude: number;
  hospitalInfo?: Hospital;
};

/**
 * 마커 정보창 생성
 * @param map
 * @param marker
 * @param hospital
 */
const createMapInfoWindow = (map: any, marker: any, hospital: Hospital) => {
  //TODO: 정보창 draggable하게 할 필요가있음
  var content = document.createElement("div");
  content.setAttribute("class", "paper container custom");

  var title = document.createElement("p");
  title.appendChild(document.createTextNode(`병원이름 : ${hospital.yadmNm}`));
  content.appendChild(title);

  var addr = document.createElement("p");
  addr.appendChild(document.createTextNode(`주소 : ${hospital.addr}`));
  content.appendChild(addr);

  var telno = document.createElement("p");
  telno.appendChild(document.createTextNode(`전화번호 : ${hospital.telno}`));
  content.appendChild(telno);

  var pcr = document.createElement("p");
  pcr.appendChild(
    document.createTextNode(
      `PCR : ${hospital.pcrPsblYn == "Y" ? "가능" : "불가능"}`
    )
  );
  content.appendChild(pcr);

  var rat = document.createElement("p");
  rat.appendChild(
    document.createTextNode(
      `신속항원검사 : ${hospital.ratPsblYn == "Y" ? "가능" : "불가능"}`
    )
  );
  content.appendChild(rat);

  var closeBtn = document.createElement("button");
  closeBtn.setAttribute("class", "btn-small");
  closeBtn.appendChild(document.createTextNode("X"));

  closeBtn.onclick = function () {
    overlay.setMap(null);
  };

  content.appendChild(closeBtn);

  // '<div style="padding:5px;">Hello World! <br><a href="https://map.kakao.com/link/map/Hello World!,33.450701,126.570667" style="color:blue" target="_blank">큰지도보기</a> <a href="https://map.kakao.com/link/to/Hello World!,33.450701,126.570667" style="color:blue" target="_blank">길찾기</a></div>';

  const overlay = new window.kakao.maps.CustomOverlay({
    content: content,
    map: map,
    position: new window.kakao.maps.LatLng(
      hospital.YPosWgs84 + 0.0005,
      hospital.XPosWgs84 - 0.0005
    ),
    xAnchor: 0.3,
    yAnchor: 0.91,
  });

  window.kakao.maps.event.addListener(marker, "click", function () {
    overlay.setMap(map);
  });
};

/**
 * 카카오 맵 설정 및 이벤트 바인딩
 */
const KakaoMapLauncher = (
  mapPlace: string,
  Lat: number,
  Lng: number,
  hospitalInfo: Hospital
) => {
  const mapScript = document.createElement("script");
  mapScript.async = true;
  mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APPKEY}&autoload=false`;
  document.head.appendChild(mapScript);
  const onLoadKakaoMap = () => {
    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById(mapPlace);
      const mapOption = {
        center: new window.kakao.maps.LatLng(Lat, Lng), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
      };
      const map = new window.kakao.maps.Map(mapContainer, mapOption);
      var mapTypeControl = new window.kakao.maps.MapTypeControl();

      // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
      // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
      map.addControl(
        mapTypeControl,
        window.kakao.maps.ControlPosition.TOPRIGHT
      );

      // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
      var zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      // 마커가 표시될 위치입니다
      var markerPosition = new window.kakao.maps.LatLng(Lat, Lng);

      // 마커를 생성합니다
      var marker = new window.kakao.maps.Marker({
        position: markerPosition,
        clickable: true,
      });

      // 마커가 지도 위에 표시되도록 설정합니다
      marker.setMap(map);

      // 마커 위에 표시할 인포 윈도우 내용 생성
      if (hospitalInfo) {
        createMapInfoWindow(map, marker, hospitalInfo);
      }
    });
  };
  mapScript.addEventListener("load", onLoadKakaoMap);
};

const Map = (props: MapProps) => {
  let latitude = props.latitude;
  let longitude = props.longitude;
  if (props.hospitalInfo) {
    latitude = props.hospitalInfo.YPosWgs84;
    longitude = props.hospitalInfo.XPosWgs84;
  }
  useEffect(() => {
    KakaoMapLauncher("map", latitude, longitude, props.hospitalInfo);
  }, [latitude, longitude]);

  return <MapContainer id="map" />;
};
const MapContainer = styled.div`
  aspect-ratio: 320 / 220;
`;

export default Map;
