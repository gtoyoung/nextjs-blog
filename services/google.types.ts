export type FcmToken = {
  token: string;
  notification: boolean;
  _id: string;
};

export type GoogleUser = {
  displayName: string;
  email: string;
  emailVerified: boolean;
  photoURL: string;
  uid: string;
};

export type Post = {
  postId: number;
  title: string;
  content: string;
  created: Date;
  modified: Date;
  status: string;
};
