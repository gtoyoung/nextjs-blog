import { Modal } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Box from "@mui/material/Box";
import FbStorage from "services/firebase/storage";
import ImgList from "./imglist";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import GiphyGrid from "./giphy";
import useTheme from "hook/useTheme";

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

const FileModal = ({ uid, onClose, customClick }) => {
  const [theme] = useTheme();
  const [value, setValue] = useState(customClick ? 2 : 1);
  const [open, setOpen] = useState(true);
  const [pictures, setPictures] = useState([] as any[]);
  const storage = new FbStorage();
  useEffect(() => {
    setOpen(true);
    storage.getUserFileList(uid).then((result) => {
      setPictures(result);
    });
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      style.bgcolor = "#41403e";
    } else {
      style.bgcolor = "#fff";
    }
  }, [theme]);

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
    acceptedFiles.forEach((file) => {
      storage.upload(file, uid).then((file) => {
        const fileMetaData = {
          fileName: file.name,
          url: URL.createObjectURL(file),
          status: "loading",
        };
        setPictures((prev) => [...prev, fileMetaData]);
      });
    });
    // Do something with the files
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/jpeg,image/png,image/jpg,image/gif",
  });

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...style, width: 450 }}>
        <TabContext value={value + ""}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
              <Tab
                label="이미지 직접 선택"
                value="1"
                style={theme === "dark" ? { color: "white" } : { color: "black" }}
                disabled={customClick}
              />
              <Tab label="GIPHY" value="2" style={theme === "dark" ? { color: "white" } : { color: "black" }} />
            </TabList>
          </Box>
          <TabPanel value="1">
            <div className="imgDiv">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? <p>등록합니다.</p> : <p>이미지 파일만 올려주세요(ex).jpg, .gif etc...)</p>}
              </div>
            </div>
            <ImgList items={pictures} uid={uid} />
          </TabPanel>
          <TabPanel value="2">
            <div className="giphyDiv">
              <GiphyGrid uid={uid} customClick={customClick} />
            </div>
            powered by <span style={{ fontWeight: "bold" }}>Giphy</span>
          </TabPanel>
        </TabContext>
      </Box>
    </Modal>
  );
};

export default FileModal;
