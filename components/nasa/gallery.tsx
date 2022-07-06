import { NasaPicture } from "services/nasa.types";
import React, { useEffect, useState } from "react";
import { useImgIObserver } from "hook/useImgIObserver";
import Lightbox from "react-image-lightbox";
import InfiniteScroll from "react-infinite-scroll-component";
import "react-image-lightbox/style.css";
import "./style.css";
import { NasaApi } from "services/nasa";
import { PapagoApi } from "services/papago";

interface NasaPhoto {
  index: number;
  original: string;
  thumbnail: string;
  width: number;
  height: number;
  description: string;
  caption: string;
}

type NasaGalleryProps = {
  pictures: Array<NasaPicture>;
};

const NasaGallery = (props: NasaGalleryProps) => {
  //TODO: 추후에 dominant color를 추가하여 이미지를 자동으로 색상으로 설정하도록 한다.(사용가 경험을 개선하기 위한 이미지 lazy로딩)

  // img 태그 자체를 콜백형태로 useImgIObserver로 전달한다.
  const [target, setTarget] = useState(null);
  // 이미지 라이트박스 열림 여부
  const [isOpen, setIsOpen] = useState(false);
  // 현재 선택된 이미지 객체
  const [clickPhoto, setClickPhoto] = useState(null as NasaPhoto | null);
  // 이미지 리스트
  const [photos, setPhotos] = useState([] as Array<NasaPhoto>);

  // 페칭된 데이터를 NasaPhoto 타입으로 변환한다.
  const convertNasaPhoto = (
    nasaPhotos: NasaPicture[],
    lastIndex: number
  ): NasaPhoto[] => {
    var photos = [] as Array<NasaPhoto>;
    nasaPhotos.map((photo, i) => {
      photos.push({
        index: lastIndex + i,
        original: photo.hdurl,
        width: 1000,
        height: 1000,
        thumbnail: photo.url,
        description: photo.title,
        caption: photo.explanation,
      });
    });
    return photos;
  };

  // 스크롤이 로딩된 데이터 끝일에 도달했을때 실행되는 비동기 함수
  // 추가로 10개의 데이터를 가져오도록 한다.
  const getMorePhotos = async () => {
    const api = new NasaApi();
    const result = await api.getNasaPicture(10);
    const convertDatas = convertNasaPhoto(result, photos.length);
    setPhotos((photo) => [...photo, ...convertDatas]);
  };

  // 처음 페이지 로드시 실행
  useEffect(() => {
    const temp = [];
    props.pictures.map((pic, i) => {
      if (pic.hdurl) {
        const photo: NasaPhoto = {
          index: i,
          original: pic.hdurl,
          width: 1000,
          height: 1000,
          thumbnail: pic.url,
          description: pic.title,
          caption: pic.explanation,
        };

        temp.push(photo);
      }
    });
    setPhotos(temp);
  }, []);

  // url로 가져온 이미지중에서 유효하지 않은 url을 가졌을 경우 숨기도록 한다.
  const imgLoadError = (e) => {
    e.target.style.display = "none";
  };

  // 이미지가 고화질이기 때문에 img의 data-src데이터를 사용하여 Observer로 인식하며 src로 값을 셋팅해준다.
  // ref로 현재의 img 객체를 참조하여 콜백형태로 hook에 전달한다.
  // 일반 NasaPhoto객체로 전달할 경우에는 Observer가 동작하지 않으므로 실제 img 참조를 넘겨야 한다.
  useImgIObserver(target);

  // 사진 오픈시 영어로 되어있는 설명을 PAPAGO API를 이용하여 한글로 번역한다.
  const setClass = async () => {
    const text = clickPhoto.caption;
    const api = new PapagoApi();

    await api
      .translateKakao(text)
      .then((data) => {
        const captionElement =
          document.activeElement.querySelector(".ril-caption");
        if (captionElement == null) {
          // alert("존재안합니다.");
          return;
        }
        captionElement.textContent = data;
        captionElement.setAttribute("style", "color:aliceblue");
      })
      .catch((err) => {
        console.log(err);
        api
          .translate(text)
          .then((data) => {
            const captionElement =
              document.activeElement.querySelector(".ril-caption");
            if (captionElement == null) {
              // alert("존재안합니다.");
              return;
            }
            captionElement.textContent = data;
            captionElement.setAttribute("style", "color:aliceblue");
          })
          .catch((err) => {
            console.log(err);
            return;
          });
      });
  };

  return (
    <>
      <div className="row_nasa">
        <div className="column">
          <InfiniteScroll
            dataLength={photos.length}
            next={getMorePhotos}
            hasMore={true}
            loader={<h1>Loading...</h1>}
            endMessage={<h4>Nothing more to show</h4>}
          >
            {photos.map((photo) => {
              return (
                <>
                  <img
                    key={photo.index}
                    ref={setTarget}
                    className="lazy"
                    data-src={photo.original}
                    width={photo.width}
                    height={photo.height}
                    onError={(e) => {
                      imgLoadError(e);
                    }}
                    loading="lazy"
                    onClick={() => {
                      setIsOpen(true);
                      setClickPhoto(photo);
                    }}
                  />
                </>
              );
            })}
          </InfiniteScroll>
        </div>
        {isOpen && (
          <Lightbox
            mainSrc={clickPhoto.original}
            nextSrc={photos[(clickPhoto.index + 1) % photos.length].original}
            prevSrc={
              photos[(clickPhoto.index + photos.length - 1) % photos.length]
                .original
            }
            prevSrcThumbnail={
              photos[(clickPhoto.index + photos.length - 1) % photos.length]
                .thumbnail
            }
            nextSrcThumbnail={
              photos[(clickPhoto.index + 1) % photos.length].thumbnail
            }
            prevLabel={
              photos[(clickPhoto.index + photos.length - 1) % photos.length]
                .description
            }
            nextLabel={
              photos[(clickPhoto.index + 1) % photos.length].description
            }
            mainSrcThumbnail={clickPhoto.thumbnail}
            imageCaption={clickPhoto.caption}
            imageTitle={clickPhoto.description}
            onCloseRequest={() => setIsOpen(false)}
            onMovePrevRequest={() => {
              setClickPhoto(
                photos[(clickPhoto.index + photos.length - 1) % photos.length]
              );
            }}
            onMoveNextRequest={() => {
              setClickPhoto(photos[(clickPhoto.index + 1) % photos.length]);
            }}
            onImageLoad={() => {
              setClass();
            }}
          />
        )}
      </div>
    </>
  );
};

export default NasaGallery;
