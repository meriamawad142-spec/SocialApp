import React, { useContext, useState } from "react";
import type { PostType } from "../../Types/Post.type";
import Comment, { type CommentType } from "./../Comment/Comment";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CommentCreation from "../CommentCreation/CommentCreation";
import { AiOutlineLike } from "react-icons/ai";
import { FaComment, FaPen } from "react-icons/fa";
import { FaShare } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { AuthContext } from "./../../Context/AuthContext";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import EditPost from "./../EditPost/EditPost";

export default function Post({
  post,
  isPostDetails = false,
}: {
  post: PostType;
  isPostDetails?: boolean;
}) {
  const { body, createdAt, image, user, topComment, _id } = post;
  const { name, photo, _id: userId } = user;
  const { userId: loginUserId } = useContext(AuthContext);
  const query = useQueryClient();
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  function getPostComments() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${_id}/comments?page=1&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["getPostComments"],
    queryFn: getPostComments,
    enabled: isPostDetails,
  });

  function handleDeletPost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }
  const {
    data: deleteMutationData,
    isPending,
    mutate,
  } = useMutation({
    mutationFn: handleDeletPost,
    onSuccess: (res) => {
      toast.success(res.data.message);
      query.invalidateQueries({
        queryKey: ["getAllPosts"],
      });
      navigate("/");
    },
    onError: (err) => {
      console.log(err);
    },
    onSettled: () => {},
  });
  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <div className="w-[600px] mx-auto my-6  rounded-2xl bg-white shadow-lg border border-slate-200">
      {/* Post Header */}
      <div className="flex justify-between items-center gap-4 p-5">
        <div className="flex gap-3 itmes-center">
          <img
            src={photo}
            className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover"
            alt=""
          />

          <div>
            <p className="font-bold text-slate-800 text-lg">{name}</p>
            <p className="text-sm text-slate-400">{createdAt}</p>
          </div>
        </div>

        {loginUserId === userId && (
          <div className="relative">
            <BsThreeDotsVertical
              className="cursor-pointer "
              onClick={() => {
                setisOpen(!isOpen);
              }}
            />
            {isOpen && (
              <div className="absolute bg-blue-300 p-4 rounded-lg top-[20px] -end-[100px]">
                <ul className="flex flex-col gap-2">
                  <li>
                    <button
                      className="flex items-center gap-2 cursor-pointer bg-white p-1 rounded-sm "
                      onClick={() => {
                        setShowEdit(true);
                      }}
                    >
                      edit
                      <FaPen />
                    </button>
                    {showEdit && (
                      <EditPost   post={post} closeModal={() => setShowEdit(false)} />
                    )}
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        mutate();
                      }}
                      disabled={isPending}
                      className="flex items-center disabled:bg-slate-900 disabled:text-white disabled:cursor-not-allowed gap-2 cursor-pointer bg-white p-1 rounded-sm  "
                    >
                      {isPending ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <>
                          {" "}
                          Delete
                          <FaTrash />{" "}
                        </>
                      )}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div>
        <p className="px-5 pb-4 text-slate-700 text-[16px] leading-7">{body}</p>

        <img src={image} className="w-full max-h-[500px] object-cover" alt="" />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-slate-200 text-slate-600">
        <div className="cursor-pointer flex items-center gap-2 hover:text-blue-600 transition">
          <AiOutlineLike />
          likes
        </div>

        <Link
          to={`/PostDetails/${_id}`}
          className="hover:text-blue-600  flex items-center gap-2 transition"
        >
          <FaComment />
          Comments
        </Link>

        <div className="flex items-center gap-2  cursor-pointer hover:text-blue-600 transition">
          <FaShare />
          Shares
        </div>
      </div>

      {/* Create Comment */}
      <div className="px-5">
        <CommentCreation
          postId={_id}
          queryKey={isPostDetails ? ["getPostComments"] : ["getAllPosts"]}
        />
      </div>

      {/* Top Comment */}
      {topComment && (
        <div className="px-5 pb-3">
          <Comment comment={topComment} postId={post._id} />
        </div>
      )}

      {/* All Comments */}
      {isPostDetails &&
        data?.data.data.comments &&
        data?.data.data.comments.map((comment: CommentType) => {
          return (
            <Comment comment={comment} postId={post._id} key={comment._id} />
          );
        })}
    </div>
  );
}
