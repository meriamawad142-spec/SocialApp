import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";

import {  FaPen } from "react-icons/fa";

import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EditComment from "./../EditComment/EditComment";
export interface CommentType {
  commentCreator: CommentCreator;
  content: string;
  createdAt: string;
  likes: any[];
  parentComment: any;
  post: string;
  _id: string;
  image: string;
}

export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export default function Comment({
  comment,
  postId,
}: {
  comment: CommentType;
  postId: string;
}) {
  const { userId: loginUserId } = useContext(AuthContext);
  const [showEdit, setShowEdit] = useState(false);
  const userId = comment.commentCreator._id;
  const commentId = comment._id;
  const query = useQueryClient();
  const [isOpen, setisOpen] = useState(false);
  const navigate = useNavigate();
  function deleteComment() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  const {
    
    isPending,
    mutate,
  } = useMutation({
    mutationFn: deleteComment,
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

  return (
    <div className="my-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex justify-between items-center gap-3">
        <div className="flex gap-3">
          <img
            src={comment?.commentCreator.photo}
            className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
            alt={comment?.commentCreator.name}
          />
          <div>
            <div>
              <p className="font-semibold text-slate-800">
                {comment?.commentCreator.name}
              </p>

              <p className="text-xs text-slate-400">{comment?.createdAt}</p>
            </div>
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
                      Edit
                      <FaPen />
                    </button>
                  </li>
                  {showEdit && (
                    <EditComment
                      comment={comment}
                      postId={postId}
                      closeModal={() => setShowEdit(false)}
                    />
                  )}
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

      <div className="mt-3 ml-13">
        {comment?.content && (
          <p className="text-sm leading-6 text-slate-700">{comment?.content}</p>
        )}

        {comment.image && (
          <img
            src={comment.image}
            className="mt-3 max-h-72 max-w-full rounded-lg object-cover"
            alt=""
          />
        )}
      </div>
    </div>
  );
}
