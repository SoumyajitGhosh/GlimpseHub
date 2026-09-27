/** Request bodies and response envelopes for the GlimpseHub API. */
import type {
  Comment,
  CommentReply,
  CurrentUser,
  Filter,
  Notification,
  Post,
  PostSummary,
  Profile,
  ProfilePost,
  SuggestedUser,
  User,
} from "./models";

export interface LoginResponse {
  user: CurrentUser;
  token: string;
}

export interface RegisterResponse {
  token: string;
}

/** `POST /api/user/:postId/bookmark` */
export interface BookmarkResponse {
  success: boolean;
  operation: "add" | "remove";
}

/** `POST /api/user/:userId/follow` */
export interface FollowResponse {
  success: boolean;
  operation: "follow" | "unfollow";
}

/** `PUT /api/user/avatar` */
export interface AvatarResponse {
  avatar: string;
}

/** `GET /api/comment/:postId/:offset/:exclude` */
export interface CommentsResponse {
  comments: Comment[];
  commentCount: number;
}

export type CommentRepliesResponse = CommentReply[];

/** `GET /api/user/:username` — the raw aggregated profile. */
export type ProfileResponse = Omit<Profile, "posts"> & {
  posts?: { data: ProfilePost[]; postCount: number } | ProfilePost[];
};

export type FeedPostsResponse = Post[];
export type PostsResponse = Post[];
export type NotificationsResponse = Notification[];
export type SearchUsersResponse = User[];
export type SuggestedUsersResponse = SuggestedUser[];
export type FollowListResponse = User[];

/** `GET /api/post/suggested/:offset` */
export type SuggestedPostsResponse = PostSummary[];

/** `GET /api/post/hashtag/:hashtag/:offset` */
export interface HashtagPostsResponse {
  posts: PostSummary[];
  postCount: number;
}

/** `GET /api/post/filters` (`backend/routes/post.js` sends `{ filters }`, not a bare array). */
export interface PostFiltersResponse {
  filters: Filter[];
}

export interface ProfileUpdates {
  fullName?: string;
  username?: string;
  bio?: string;
  website?: string;
  email?: string;
  private?: boolean;
}
