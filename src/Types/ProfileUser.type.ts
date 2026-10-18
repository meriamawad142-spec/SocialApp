export interface UserProfileType {
  _id: string;
  id: string;
  name: string;
  username: string;
  email: string;
  gender: "male" | "female";
  dateOfBirth: string;
  photo: string;
  cover: string;
  createdAt: string;
  bookmarks: string[];
  bookmarksCount: number;
  followers: string[];
  followersCount: number;
  following: string[];
  followingCount: number;
}