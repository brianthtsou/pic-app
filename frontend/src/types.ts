export interface Comment {
  user_id: number;
  comment_id: number;
  comment_text: string;
  created_at: string;
  users: {
    username: string;
  };
}

export interface Post {
  title: string;
  username: string;
  id: number;
}

export interface Image {
  image_id: number;
  signed_url: string;
}
