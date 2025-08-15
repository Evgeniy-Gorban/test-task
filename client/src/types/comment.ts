export interface CommentFile {
  id: number;
  filePath: string;
  fileType: "text" | "image";
  originalName?: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  homePage: string;
}

export interface Comment {
  id: number;
  text: string;
  createdAt: string;
  parentId: number | null;
  userId: number | null;
  userName: string | null;
  email: string | null;
  homePage: string | null;
  children?: Comment[];
  user?: User;
  file?: CommentFile;
}
export interface CreateComment {
  text: string;
  userName?: string;
  email?: string;
  homePage?: string;
  parentId?: number | null;
  captcha?: string;
  captchaId?: string;
  filePath?: string;
  fileType?: "text" | "image";
  originalName?: string;
}
