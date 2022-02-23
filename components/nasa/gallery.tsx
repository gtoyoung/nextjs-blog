import { NasaPicture } from "services/nasa.types";
import React, { useEffect, useState } from "react";
import "./style.css";

interface NasaPhoto {
  original: string;
  width: number;
  height: number;
}

type NasaGalleryProps = {
  pictures: Array<NasaPicture>;
};

const NasaGallery = (props: NasaGalleryProps) => {
  const [photos, setPhotos] = useState([] as Array<NasaPhoto>);

  useEffect(() => {
    props.pictures.map((pic) => {
      const photo: NasaPhoto = {
        original: pic.hdurl,
        width: getRandom(500),
        height: getRandom(500),
      };
      photos.push(photo);
    });
    setPhotos(photos);
  }, []);

  const getRandom = (size) => {
    return Math.floor(Math.random() * size) + 1;
  };

  return (
    <>
      <div className="row">
        <div className="column">
          {photos.map((photo) => {
            return (
              <img
                src={photo.original}
                width={photo.width}
                height={photo.height}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default NasaGallery;
