import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { UserProfileType } from "../../Types/ProfileUser.type";
import Loader from "./../../Components/Loader/Loader";
import Post from "./../../Components/Post/Post";
import type { PostType } from "../../Types/Post.type";
import ChangePassword from './../../Components/ChangePassword/ChangePassword';

export default function () {
  function getMyProfile() {
    return axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }
  const[isOpen, setisOpen] = React.useState(false);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getMyProfile"],
    queryFn: getMyProfile,
  });
  const user: UserProfileType = data?.data.data.user;

  console.log("data", data?.data.data.user);

  //el function el fo2 hya el 3ndha el id lzmn nkhly el tanya tstna el ola 3shan el etnen async w momken wahda tt3ml abl el tanya
  function getmyPosts() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${user._id}/posts`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  const { data: postUserData, isLoading: loadingUserData } = useQuery({
    queryKey: ["getUserPosts"],
    queryFn: getmyPosts,
    enabled: !isLoading && !isError && !!data,
  });
  console.log("full response", postUserData?.data.data.posts);
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <p>{error.message}</p>;
  }

  if (!user) {
    return <p>User data not found</p>;
  }
  return (
    <>
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Cover */}
          <div className="relative h-56 bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600">
            {user.cover && (
              <img
                src={user.cover}
                alt="Cover"
                className="h-full w-full  object-cover"
              />
            )}
          </div>

          {/* Profile Header */}
          <div className="px-6 pb-6 sm:px-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <img
                src={user.photo}
                alt={user.name}
                className="-mt-16 h-32 w-32 relative z-20 rounded-full border-4 border-white bg-white object-cover shadow-md"
              />

              <div className="pb-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  {user.name}
                </h1>

                <p className="mt-1 text-slate-500">@{user.username}</p>
              </div>
            </div>

            {/* Statistics */}
            <div className="mt-8 grid grid-cols-3 gap-3 border-y border-slate-200 py-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">
                  {user.followersCount}
                </p>
                <p className="mt-1 text-sm text-slate-500">Followers</p>
              </div>

              <div className="border-x border-slate-200 text-center">
                <p className="text-2xl font-bold text-slate-900">
                  {user.followingCount}
                </p>
                <p className="mt-1 text-sm text-slate-500">Following</p>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">
                  {user.bookmarksCount}
                </p>
                <p className="mt-1 text-sm text-slate-500">Bookmarks</p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="mt-8">
              <h2 className="text-lg font-bold text-slate-900">
                Personal Information
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Email Address</p>
                  <p className="mt-2 break-all font-medium text-slate-800">
                    {user.email}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Gender</p>
                  <p className="mt-2 font-medium capitalize text-slate-800">
                    {user.gender}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Date of Birth</p>
                  <p className="mt-2 font-medium text-slate-800">
                    {new Date(user.dateOfBirth).toLocaleDateString("en-GB")}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Member Since</p>
                  <p className="mt-2 font-medium text-slate-800">
                    {new Date(user.createdAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>
            </div>
            {/* Account Settings */}
            <div className="mt-8 border-t border-slate-200 pt-6">
              <h2 className="text-lg font-bold text-slate-900">
                Account Settings
              </h2>

              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Change Password
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Update your password to keep your account secure.
                  </p>
                </div>

                <button
                  type="button"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
                  onClick={() => {
                    setisOpen(true)

                  }
                  }
                >

                  Change Password
                </button>
                {isOpen && <ChangePassword closeModal={() => setisOpen(false)} />}
              </div>
            </div>
          </div>
        </div>
      </div>
      {postUserData?.data.data.posts.map((currentPost: PostType) => {
        return <Post post={currentPost} key={currentPost._id} />;
      })}
    </>
  );
}
