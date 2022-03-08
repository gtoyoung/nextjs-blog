import { initializeApp } from "firebase/app";
import {
  Database,
  DataSnapshot,
  get,
  getDatabase,
  ref,
  set,
  serverTimestamp,
  remove,
  push,
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
  admin: boolean;
  constructor(isAdmin: boolean) {
    const app = initializeApp(firebaseConfig);
    this.db = getDatabase(app);
    // 관리자 권한이 있는 경우에 대한 처리 분기
    this.admin = isAdmin;
  }

  // 게시글 key값 부여를 위한 시퀀스 생성
  getKey(userId: string): Promise<number> {
    return get(ref(this.db, `/users/${userId}/posts`))
      .then((posts: DataSnapshot) => {
        const datas = posts.val() as Post[];
        // 게시글 아이디 max 값 구하기
        if (datas === null || datas.length === 0) {
          return 1;
        }
        const max = datas.reduce((prev, curr) => {
          return prev.postId > curr.postId ? prev : curr;
        });
        return max.postId + 1;
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
  }

  getCountKey(userId: string, target: string): Promise<number> {
    return get(ref(this.db, `/users/${userId}/${target}`)).then(
      (data: DataSnapshot) => {
        const datas = data.val() as string;
        if (datas === null || datas.length === 0) {
          return 1;
        }

        return datas.length;
      }
    );
  }

  // 게시글 작성
  writePost(userId: string, title: string, content: string): Promise<boolean> {
    // key값 자동 생성을 위한 처리
    const postListRef = ref(this.db, `/users/${userId}/posts`);
    const newPostRef = push(postListRef);
    return set(newPostRef, {
      content,
      title,
      created: serverTimestamp(),
      modified: null,
      status: "draft",
    })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  //
  getPost(userId: string, postId: number): Promise<Post> {
    return get(ref(this.db, `/users/${userId}/posts/${postId}`)).then(
      (data) => {
        return {
          postId: data.key,
          ...data.val(),
        };
      }
    );
  }

  // 사용자의 게시글 목록 조회
  getPosts(userId: string): Promise<any[]> {
    return get(ref(this.db, `/users/${userId}/posts`)).then(
      (posts: DataSnapshot) => {
        const resultList = [] as Post[];
        posts.forEach((post: DataSnapshot) => {
          resultList.push({
            postId: post.key,
            ...post.val(),
          });
        });
        return resultList;
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

  deletePost(userId: string, postId: number): Promise<boolean> {
    return remove(ref(this.db, `/users/${userId}/posts/${postId}`))
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  //토큰 정보 삽입
  writeToken(userId: string, token: string): Promise<boolean> {
    const tokenRef = ref(this.db, `/users/${userId}/token`);
    const newTokenRef = push(tokenRef);
    return set(newTokenRef, {
      token,
    })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  // 토큰 리스트 조회
  getTokens(userId: string): Promise<string[]> {
    return get(ref(this.db, `/users/${userId}/token`)).then(
      (token: DataSnapshot) => {
        if (token.size === 0) {
          return [];
        } else {
          const resultList = [] as string[];
          token.forEach((t: DataSnapshot) => {
            resultList.push(t.val().token);
          });
          const result = [...new Set(resultList)];
          return result;
        }
      }
    );
  }
}

export default FbDatabase;
