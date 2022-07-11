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
  postId: string;
  post: PostDetail;
};

export type PostDetail = {
  postId: string;
  title: string;
  content: string;
  created: Date;
  modified: Date;
  status: string;
};
