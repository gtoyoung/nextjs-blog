import { initializeApp } from "firebase/app";
import {
  deleteObject,
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASURE_ID,
};

class FbStorage {
  storage: FirebaseStorage;
  constructor() {
    const app = initializeApp(firebaseConfig);
    this.storage = getStorage(app);
  }

  // 파일 업로드
  upload(file: File, uid: string): Promise<File> {
    // 파일 이름 중복 방지를 위한 이름 커스텀
    const fileName = file.name + "_" + Date.now();
    // 파일 메타데이터
    const metadata = {
      contentType: file.type,
      size: file.size,
    };
    const storageRef = ref(this.storage, `/images/${uid}/${fileName}`);
    return uploadBytes(storageRef, file, metadata)
      .then(() => {
        return file;
      })
      .catch(() => {
        return null;
      });
  }

  // 업로드한 파일의 다운로드 url을 가져옴
  getfileUrl(uid: string, filename: string): Promise<string> {
    const storageRef = ref(this.storage, `/images/${uid}/${filename}`);
    return getDownloadURL(storageRef)
      .then((url) => {
        return url;
      })
      .catch(() => {
        return "";
      });
  }

  // 사용자의 전체 이미지 목록을 가져옴
  getUserFileList(uid: string): Promise<any[]> {
    const storageRef = ref(this.storage, `/images/${uid}`);
    const fileList = [] as any[];

    return listAll(storageRef)
      .then((result) => {
        const promiseArr = [] as Promise<any>[];
        result.items.forEach((item) => {
          promiseArr.push(
            getDownloadURL(ref(this.storage, item.fullPath)).then((url) => {
              fileList.push({
                url: url,
                fileName: item.name,
                status: "loading",
              });
            })
          );
        });
        return Promise.all(promiseArr).then(() => {
          return fileList;
        });
      })
      .catch(() => {
        return fileList;
      });
  }

  deleteFile(uid: string, filename: string): Promise<boolean> {
    const storageRef = ref(this.storage, `/images/${uid}/${filename}`);
    return deleteObject(storageRef)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }
}

export default FbStorage;
