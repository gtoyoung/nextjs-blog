import { NasaPicture } from "services/nasa.types";
import React, { useEffect, useState } from "react";
import { useImgIObserver } from "hook/useImgIObserver";
import Lightbox from "react-image-lightbox";
import InfiniteScroll from "react-infinite-scroll-component";
import "react-image-lightbox/style.css";
import "./style.css";
import { NasaApi } from "services/nasa";

interface NasaPhoto {
  index: number;
  original: string;
  width: number;
  height: number;
}

type NasaGalleryProps = {
  pictures: Array<NasaPicture>;
};

const NasaGallery = (props: NasaGalleryProps) => {
  //TODO: 추후에 dominant color를 추가하여 이미지를 자동으로 색상으로 설정하도록 한다.(사용가 경험을 개선하기 위한 이미지 lazy로딩)

  // img 태그 자체를 콜백형태로 useImgIObserver로 전달한다.
  const [target, setTarget] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [clickPhoto, setClickPhoto] = useState(null as NasaPhoto | null);
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
      });
    });
    return photos;
  };

  const getMorePhotos = async () => {
    const api = new NasaApi();
    const result = await api.getNasaPicture(10);
    const convertDatas = convertNasaPhoto(result, photos.length);
    setPhotos((photo) => [...photo, ...convertDatas]);
  };

  useEffect(() => {
    const temp = [];
    props.pictures.map((pic, i) => {
      if (pic.hdurl) {
        const photo: NasaPhoto = {
          index: i,
          original: pic.hdurl,
          width: 1000,
          height: 1000,
        };

        temp.push(photo);
      }
    });
    setPhotos(temp);
  }, []);

  const imgLoadError = (e) => {
    e.target.style.display = "none";
  };

  useImgIObserver(target);

  return (
    <>
      <div className="row">
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
            onCloseRequest={() => setIsOpen(false)}
            onMovePrevRequest={() => {
              setClickPhoto(
                photos[(clickPhoto.index + photos.length - 1) % photos.length]
              );
            }}
            onMoveNextRequest={() => {
              setClickPhoto(photos[(clickPhoto.index + 1) % photos.length]);
            }}
          />
        )}
      </div>
    </>
  );
};

export default NasaGallery;
