import { initializeApp } from "firebase/app";
import {
  Database,
  DataSnapshot,
  get,
  getDatabase,
  ref,
  set,
  serverTimestamp,
} from "firebase/database";
import { Post } from "./google.types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASURE_ID,
};

class FbDatabase {
  db: Database;
  constructor() {
    const app = initializeApp(firebaseConfig);
    this.db = getDatabase(app);
  }

  // 게시글 key값 부여를 위한 시퀀스 생성
  getKey(userId: string): Promise<number> {
    return get(ref(this.db, `/users/${userId}/posts`)).then(
      (posts: DataSnapshot) => {
        const datas = posts.val() as Post[];
        // 게시글 아이디 max 값 구하기
        const max = datas.reduce((prev, curr) => {
          return prev.postId > curr.postId ? prev : curr;
        });
        return max.postId + 1;
      }
    );
  }

  // 게시글 작성
  writePost(userId: string, title: string, content: string): Promise<boolean> {
    return this.getKey(userId)
      .then((postId) => {
        set(ref(this.db, `/users/${userId}/posts/${postId}`), {
          postId,
          content,
          title,
          created: serverTimestamp(),
          modified: null,
          status: "draft",
        });
      })
      .then((res) => {
        console.log(res);
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  // 타이틀로 게시글 조회
  getPost(userId: string, postId: number): Promise<Post> {
    return get(ref(this.db, `/users/${userId}/posts/${postId}`)).then(
      (data) => {
        return data.toJSON() as Post;
      }
    );
  }

  // 사용자의 게시글 목록 조회
  getPosts(userId: string): Promise<Post[]> {
    return get(ref(this.db, `/users/${userId}/posts`)).then(
      (posts: DataSnapshot) => {
        return posts.val() as Post[];
      }
    );
  }

  updatePost(
    userId: string,
    postId: number,
    title: string,
    content: string,
    created: Date,
    status: string
  ): Promise<boolean> {
    return set(ref(this.db, `/users/${userId}/posts/${postId}`), {
      postId,
      title,
      content,
      created,
      modified: serverTimestamp(),
      status,
    })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }
}

export default FbDatabase;
