import { Modal } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Box from "@mui/material/Box";
import FbStorage from "services/firebase/storage";
import ImgList from "./imglist";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const FileModal = ({ uid, onClose }) => {
  const [open, setOpen] = useState(true);
  const [pictures, setPictures] = useState([] as any[]);
  const storage = new FbStorage();
  useEffect(() => {
    setOpen(true);
    storage.getUserFileList(uid).then((result) => {
      setPictures(result);
    });
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      storage.upload(file, uid).then((file) => {
        const fileMetaData = {
          fileName: file.name,
          url: URL.createObjectURL(file),
        };
        setPictures([...pictures, fileMetaData]);
      });
    });
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...style, width: 450 }}>
        <div style={{ borderBlock: "5px solid red", textAlign: "center" }}>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? <p>등록합니다.</p> : <p>이미지 파일 올려주쇼</p>}
          </div>
        </div>

        <ImgList items={pictures} uid={uid} />
      </Box>
    </Modal>
  );
};

export default FileModal;
