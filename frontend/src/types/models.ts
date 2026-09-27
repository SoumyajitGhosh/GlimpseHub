/**
 * Domain-model types for the shapes the GlimpseHub API returns.
 *
 * These are authored from the backend aggregation output
 * (`backend/utils/controllerUtils.js` `populatePostsPipeline`) and the
 * controllers, cross-checked against how the frontend actually reads each
 * field. Fields that only some endpoints populate are marked optional.
 */

export type Id = string;
export type IsoDateString = string;

/** A user as embedded in posts, comments, search results and suggestions. */
export interface User {
  _id: Id;
  username: string;
  avatar?: string;
  fullName?: string;
}

export interface Bookmark {
  post: Id;
}

/** The authenticated user (`user.currentUser`). Superset of {@link User}. */
export interface CurrentUser extends User {
  email?: string;
  fullName?: string;
  bio?: string;
  website?: string;
  private?: boolean;
  confirmed?: boolean;
  bookmarks?: Bookmark[];
}

export interface VoteEntry {
  author: Id;
}

export interface CommentReply {
  _id: Id;
  message: string;
  date: IsoDateString;
  author: User;
  parentComment?: Id;
  commentReplyVotes?: VoteEntry[];
  commentReplyVotesCount?: number;
  replyVoteCount?: number;
  isVoted?: boolean;
}

export interface Comment {
  _id: Id;
  message: string;
  date: IsoDateString;
  author: User;
  post?: Id;
  commentVotes?: VoteEntry[];
  commentVotesCount?: number;
  commentVoteCount?: number;
  commentReplies?: CommentReply[];
  replyCount?: number;
  isVoted?: boolean;
}

export interface Post {
  _id: Id;
  image: string;
  thumbnail?: string;
  filter?: string;
  caption?: string;
  hashtags?: string[];
  date: IsoDateString;
  author: User;
  comments?: Comment[];
  commentData?: {
    comments: Comment[];
    commentCount: number;
  };
  postVotes?: VoteEntry[];
  postVotesCount?: number;
  postVoteCount?: number;
  commentCount?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

/**
 * A post as returned by the `populatePostsPipeline`-based list endpoints
 * (`GET /post/suggested/:offset`, `GET /post/hashtag/:hashtag/:offset` —
 * `backend/controllers/postController.js` + `backend/utils/controllerUtils.js`).
 * Unlike feed's {@link Post}, `comments`/`postVotes` here are pre-aggregated
 * counts (`$size`), not raw arrays — the two pipelines produce genuinely
 * different shapes under the same field names.
 */
export interface PostSummary {
  _id: Id;
  image: string;
  thumbnail?: string;
  filter?: string;
  caption?: string;
  hashtags?: string[];
  date: IsoDateString;
  author: User;
  comments: number;
  postVotes: number;
}

export type NotificationType =
  | "follow"
  | "like"
  | "comment"
  | "commentVote"
  | "commentReply"
  | "mention";

export interface Notification {
  _id: Id;
  notificationType: NotificationType;
  sender: User;
  date: IsoDateString;
  read: boolean;
  notificationData?: {
    postId?: Id;
    image?: string;
    thumbnail?: string;
    comment?: string;
  };
}

/**
 * A persisted message document, as returned verbatim by `getMessages`/`sendMessage`
 * (`backend/models/Message.js` — `senderId`/`receiverId`, not nested `User`s;
 * `createdAt` is guaranteed by the schema's `timestamps: true`).
 */
export interface Message {
  _id: Id;
  senderId: Id;
  receiverId: Id;
  message: string;
  createdAt: IsoDateString;
  updatedAt?: IsoDateString;
}

/** A chat-eligible user (someone the viewer follows), as the sidebar lists them. */
export interface ChatUser extends User {
  fullName?: string;
}

/** A user as returned by `GET /api/user/suggested/:max` — includes preview posts. */
export interface SuggestedUser extends User {
  posts?: Post[];
}

export interface Conversation {
  _id: Id;
  participants: Id[];
  lastMessage?: Message;
}

/** An image filter, from `GET /api/post/filters`. */
export interface Filter {
  name: string;
  filter: string;
}

/** The nested `user` sub-document of a profile payload (`retrieveUser`'s user select). */
export interface ProfileUser {
  _id: Id;
  username: string;
  fullName?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  bookmarks?: Bookmark[];
}

/**
 * Aggregated user-profile payload from `GET /api/user/:username`
 * (`backend/controllers/userController.js` `retrieveUser`).
 */
export interface Profile {
  user: ProfileUser;
  followers: number;
  following: number;
  isFollowing: boolean;
  postCount?: number;
  posts?: Post[];
}
