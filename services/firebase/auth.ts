import {
  GoogleAuthProvider,
  EmailAuthProvider,
  getAuth,
  signInWithRedirect,
  setPersistence,
  User,
  browserLocalPersistence,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { GoogleUser } from "../../type/google.types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASURE_ID,
};

class AuthService {
  constructor() {
    // firebase 초기화
    initializeApp(firebaseConfig);
  }
  // 로그인을 진행함
  login(providername) {
    let provider = null;
    if (providername === "google") {
      provider = new GoogleAuthProvider();
    } else {
      provider = new EmailAuthProvider();
    }
    // 권한 객체를 가져옴
    const auth = getAuth();

    //현재의 세션이나 탭에서만 상태를 유지하도록 우선 설정
    //('local'로 변경할 경우에는 로그아웃을 하기전까지는 로그인 상태가 지속됨)
    return setPersistence(auth, browserLocalPersistence).then(() => {
      return signInWithRedirect(auth, provider);
    });
  }

  logout() {
    const auth = getAuth();
    return auth.signOut();
  }

  auth() {
    return getAuth();
  }

  getCurrentUser() {
    return getAuth().currentUser;
  }

  // 현재 사용자의 프로필 정보를 가져옴
  getProfile(user: User): GoogleUser {
    if (user) {
      return this.convertUser(user);
    } else {
      return null;
    }
  }

  // 구글 사용가 객체로 변환
  convertUser(user: User): GoogleUser {
    return {
      displayName: user.displayName,
      email: user.email,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL,
      uid: user.uid,
    };
  }
}

export default AuthService;
