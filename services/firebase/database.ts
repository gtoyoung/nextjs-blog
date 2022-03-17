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
  update,
  DatabaseReference,
} from "firebase/database";
import { Post } from "../google.types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASURE_ID,
};

const TABLE = {
  POST: "posts",
  CHAT_ROOM: "chatrooms",
  TOKEN: "token",
  PROFILE_IMG: "profileImg",
  POKE_NAME: "poketmon",
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

  // 참조 객체 리턴
  getRef(path: string): DatabaseReference {
    return ref(this.db, path);
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
    const postListRef = ref(this.db, `/users/${userId}/${TABLE.POST}`);
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
    return get(ref(this.db, `/users/${userId}/${TABLE.POST}/${postId}`)).then(
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
    return get(ref(this.db, `/users/${userId}/${TABLE.POST}`)).then(
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
    status: string
  ): Promise<boolean> {
    return update(ref(this.db, `/users/${userId}/${TABLE.POST}/${postId}`), {
      title,
      content,
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
    return remove(ref(this.db, `/users/${userId}/${TABLE.POST}/${postId}`))
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  //토큰 정보 삽입
  writeToken(userId: string, token: string): Promise<boolean> {
    const tokenRef = ref(this.db, `/users/${userId}/${TABLE.TOKEN}`);
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
    return get(ref(this.db, `/users/${userId}/${TABLE.POST}`)).then(
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

  saveProfileImg(userId: string, imgUrl: string): Promise<boolean> {
    return set(ref(this.db, `/users/${userId}/${TABLE.PROFILE_IMG}`), {
      url: imgUrl,
    })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  getProfileImg(userId: string): Promise<string> {
    return get(ref(this.db, `/users/${userId}/${TABLE.PROFILE_IMG}`))
      .then((data: DataSnapshot) => {
        if (data.size === 0) {
          return "";
        }
        return data.val().url;
      })
      .catch(() => {
        return "";
      });
  }

  // 채팅 방 리스트 조회
  getChatRooms(): Promise<any[]> {
    const roomsRef = ref(this.db, `/${TABLE.CHAT_ROOM}`);
    return get(roomsRef).then((rooms: DataSnapshot) => {
      const resultList = [] as any[];
      if (rooms != null && rooms.size !== 0) {
        rooms.forEach((room: DataSnapshot) => {
          resultList.push({
            ...room.val(),
          });
        });
        return resultList;
      } else {
        return [];
      }
    });
  }

  // 채팅방 삭제
  deleteChatRoom(userId: string, roomId: string): Promise<boolean> {
    const roomRef = ref(this.db, `/${TABLE.CHAT_ROOM}/${roomId}`);
    const ownerRef = ref(this.db, `/${TABLE.CHAT_ROOM}/${roomId}/owner`);
    return get(ownerRef).then((owner: DataSnapshot) => {
      // 채팅방의 주인일 경우에만 채팅방 삭제 가능
      if (owner.val() === userId) {
        return remove(roomRef).then(() => {
          return true;
        });
      } else {
        return false;
      }
    });
  }

  // 채팅 방 생성
  createRoom(userId: string, roomName: string): Promise<boolean> {
    const roomRef = ref(this.db, `/${TABLE.CHAT_ROOM}`);
    const newRoomRef = push(roomRef);
    return set(newRoomRef, {
      roomId: newRoomRef.key,
      roomName,
      created: serverTimestamp(),
      modified: null,
      participants: [userId],
      owner: userId,
    })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  // 참여자 추가
  participantJoin(userId: string, roomId: string): Promise<boolean> {
    const roomRef = ref(this.db, `/${TABLE.CHAT_ROOM}/${roomId}`);
    const roomParticipantsRef = ref(
      this.db,
      `/${TABLE.CHAT_ROOM}/${roomId}/participants`
    );
    var userList = [];
    // 기존 참여자리스트 가져오기
    return get(roomParticipantsRef)
      .then((data: DataSnapshot) => {
        //기존 참여자 리스트와 새로운 참여자를 추가하기위한 셋팅
        userList.push(...data.val());
        userList.push(userId);

        // 참여자 리스트 업데이트
        return update(roomRef, {
          participants: userList,
        })
          .then(() => {
            return true;
          })
          .catch(() => {
            return false;
          });
      })
      .catch(() => {
        return false;
      });
  }

  getPokeNameList(): Promise<string[]> {
    return get(ref(this.db, `/${TABLE.POKE_NAME}`)).then(
      (data: DataSnapshot) => {
        const resultList = [] as string[];
        if (data.size === 0) {
          return [];
        } else {
          data.forEach((name: DataSnapshot) => {
            resultList.push(name.val());
          });
          return resultList;
        }
      }
    );
  }
}

export default FbDatabase;
