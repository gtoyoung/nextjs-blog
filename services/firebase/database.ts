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
import { IData } from "type/task.types";
import { Post } from "../../type/google.types";

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
  FCM_TOKEN: "fcmToken",
  TASK_DATA: "taskData",
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

  getTaskAllData(userId: string): Promise<IData> {
    return get(ref(this.db, `/users/${userId}/${TABLE.TASK_DATA}`))
      .then((datas: DataSnapshot) => {
        if (datas.val()) {
          const result: IData = {
            tasks: null,
            columnOrder: [...datas.val().columnOrder],
            columns: null,
          };

          if (datas.val().columns) {
            result.columns = {};
            for (const [key, value] of Object.entries<any>(
              datas.val().columns
            )) {
              result.columns[key] = {
                id: value.id,
                title: value.title,
                taskIds: value.taskIds ? [...value.taskIds] : [],
                type: value.type ? value.type : "",
              };
            }
          }

          if (datas.val().tasks) {
            result.tasks = {};
            for (const [key, value] of Object.entries<any>(datas.val().tasks)) {
              result.tasks[key] = {
                id: value.id,
                content: value.content,
                alertDate: value.alertDate ? value.alertDate : null,
              };
            }
          }

          return result;
        }
      })
      .catch(() => {
        return null;
      });
  }

  createColumn(
    userId: string,
    columnId: string,
    title: string
  ): Promise<boolean> {
    const taskDataRef = this.getRef(`/users/${userId}/${TABLE.TASK_DATA}`);

    return get(taskDataRef)
      .then((data: DataSnapshot) => {
        if (data.val()?.columnOrder) {
          return update(taskDataRef, {
            columns: {
              ...data.val().columns,
              [columnId]: {
                id: columnId,
                title,
                taskIds: [],
              },
            },
            columnOrder: [...data.val().columnOrder, columnId],
          })
            .then(() => {
              return true;
            })
            .catch(() => {
              return false;
            });
        } else {
          return update(taskDataRef, {
            columns: {
              [columnId]: {
                id: columnId,
                title,
                taskIds: [],
              },
            },
            columnOrder: [columnId],
          })
            .then(() => {
              return true;
            })
            .catch(() => {
              return false;
            });
        }
      })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  updateColumnTitle(
    userId: string,
    columnId: string,
    title: string
  ): Promise<boolean> {
    return update(
      ref(this.db, `/users/${userId}/${TABLE.TASK_DATA}/columns/${columnId}`),
      {
        title,
      }
    )
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  updateColumnType(
    userId: string,
    columnId: string,
    type: string
  ): Promise<boolean> {
    return update(
      ref(this.db, `/users/${userId}/${TABLE.TASK_DATA}/columns/${columnId}`),
      {
        type,
      }
    )
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  updateColumn(
    userId: string,
    columnId: string,
    taskIds: string[]
  ): Promise<boolean> {
    return update(
      ref(this.db, `/users/${userId}/${TABLE.TASK_DATA}/columns/${columnId}`),
      {
        taskIds,
      }
    )
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  createTask(
    userId: string,
    targetColumnId: string,
    taskIds: string[],
    content: string,
    alertDate: Date
  ): Promise<boolean> {
    let taskId = "task-1";
    return get(ref(this.db, `/users/${userId}/${TABLE.TASK_DATA}/tasks`)).then(
      (datas: DataSnapshot) => {
        if (datas.val()) {
          const tasks = datas.val();
          if (tasks) {
            taskId = `task-${Object.keys(tasks).length + 1}`;
          }
        }
        return set(
          ref(this.db, `/users/${userId}/${TABLE.TASK_DATA}/tasks/${taskId}`),
          {
            id: taskId,
            content,
            alertDate,
          }
        )
          .then(() => {
            return this.updateColumn(userId, targetColumnId, taskIds);
          })
          .catch(() => {
            return false;
          });
      }
    );
  }

  updateTaskIndex(
    userId: string,
    targetColumnId: string,
    destinationColumnId: string,
    targetTaskIds: string[],
    destinationTaskIds: string[]
  ): Promise<boolean> {
    if (targetColumnId === destinationColumnId) {
      return update(
        ref(
          this.db,
          `/users/${userId}/${TABLE.TASK_DATA}/columns/${targetColumnId}`
        ),
        {
          taskIds: targetTaskIds,
        }
      )
        .then(() => {
          return true;
        })
        .catch(() => {
          return false;
        });
    } else {
      return update(
        ref(
          this.db,
          `/users/${userId}/${TABLE.TASK_DATA}/columns/${targetColumnId}`
        ),
        {
          taskIds: targetTaskIds,
        }
      )
        .then(() => {
          return update(
            ref(
              this.db,
              `/users/${userId}/${TABLE.TASK_DATA}/columns/${destinationColumnId}`
            ),
            {
              taskIds: destinationTaskIds,
            }
          )
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
  }

  updateTask(
    userId: string,
    taskId: string,
    content: string
  ): Promise<boolean> {
    return update(
      ref(this.db, `/users/${userId}/${TABLE.TASK_DATA}/tasks/${taskId}`),
      {
        content,
      }
    )
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  updateTaskAlertDate(
    userId: string,
    taskId: string,
    alertDate: Date
  ): Promise<boolean> {
    return update(
      ref(this.db, `/users/${userId}/${TABLE.TASK_DATA}/tasks/${taskId}`),
      {
        alertDate,
      }
    )
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  updateColumnIndex(userId: string, columnOrders: string[]): Promise<boolean> {
    return update(ref(this.db, `/users/${userId}/${TABLE.TASK_DATA}`), {
      columnOrder: columnOrders,
    })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  updateTaskData(userId: string, data: IData): Promise<boolean> {
    const taskDataRef = this.getRef(`/users/${userId}/${TABLE.TASK_DATA}`);

    return update(taskDataRef, {
      tasks: {
        ...data.tasks,
      },
      columns: {
        ...data.columns,
      },
      columnOrder: data.columnOrder,
    })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
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
    return get(tokenRef).then((data: DataSnapshot) => {
      if (data.val()) {
        const tokenList = data.val() as string[];
        const findToken = tokenList.find((t) => {
          if (t === token) {
            return true;
          }
        });

        if (findToken) {
          return true;
        } else {
          return set(tokenRef, [...data.val(), token])
            .then(() => {
              return true;
            })
            .catch(() => {
              return false;
            });
        }
      } else {
        return set(tokenRef, [token])
          .then(() => {
            return true;
          })
          .catch(() => {
            return false;
          });
      }
    });
  }

  // 토큰 리스트 조회
  getTokens(userId: string): Promise<string[]> {
    return get(ref(this.db, `/users/${userId}/${TABLE.TOKEN}`)).then(
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

  insertToken(token: string): Promise<boolean> {
    return set(ref(this.db, `/${TABLE.FCM_TOKEN}/${token}`), {
      notification: false,
    })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  getToken(token): Promise<any> {
    const tokenRef = ref(this.db, `/${TABLE.FCM_TOKEN}/${token}`);
    return get(tokenRef)
      .then((data: DataSnapshot) => {
        if (data.size === 0) {
          return null;
        } else {
          return {
            token,
            notification: data.val().notification,
          };
        }
      })
      .catch((e) => {
        console.log(e);
        return null;
      });
  }

  updateToken(token: string, notification: boolean): Promise<boolean> {
    return update(ref(this.db, `/${TABLE.FCM_TOKEN}/${token}`), {
      notification,
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
