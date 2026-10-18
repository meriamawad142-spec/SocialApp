import { useRef, useState } from "react";
import type { CommentType } from "../Comment/Comment";
import { FaTimes } from "react-icons/fa";

import axios from "axios";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiImage } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

type EditCommentProps = {
  closeModal: () => void;
  comment: CommentType;
  postId: string;
};
export default function EditComment({
  closeModal,
  comment,
  postId,
}: EditCommentProps) {
  const imgInput = useRef<HTMLInputElement>(null);
  const textInput = useRef<HTMLTextAreaElement>(null);
  const [imagePreview, setImagePreview] = useState(comment.image);

  const queryClient = useQueryClient();
  function handleUpdateComment(formData: FormData) {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  function handleImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const path = URL.createObjectURL(file);
    setImagePreview(path);
  }
  const { mutate, isPending } = useMutation({
    mutationFn: handleUpdateComment,

    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries({
        queryKey: ["getAllPosts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getUserPosts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getPostDetails", postId],
      });

      closeModal();
    },

    onError: (error) => {
      toast.error("Failed to update comment");
      console.log(error);
    },
  });

  function handleEditComment() {
    const content = textInput.current?.value ?? "";
    const image = imgInput.current?.files?.[0];

    if (!content.trim() && !image) {
      return;
    }

    const formData = new FormData();

    formData.append("content", content);

    if (image) {
      formData.append("image", image);
    }

    mutate(formData);
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-2xl font-bold text-slate-800">Edit Comment</h2>

          <button
            className="cursor-pointer rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
            onClick={closeModal}
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-6 overflow-y-auto px-6 py-5">
          <div>
            <label className="mb-2 block font-semibold text-slate-700">
              Comment Content
            </label>

            <textarea
              rows={5}
              maxLength={280}
              placeholder={"Write your comment..."}
              className="w-full resize-y rounded-xl border border-slate-300 p-4 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              ref={textInput}
            >
              {comment.content}
            </textarea>
          </div>
        </div>
        <div>
          <p className="mb-3 font-semibold text-slate-700">Image</p>
          {imagePreview && (
            <div className="relative mb-4 w-fit max-w-full">
              <img
                src={imagePreview}
                alt="Post preview"
                className="h-44 max-w-full rounded-xl border border-slate-200 object-cover"
              />

              <button
                className="absolute right-2 top-2 cursor-pointer rounded-full bg-slate-900/80 p-2 text-white transition hover:bg-red-600"
                onClick={() => setImagePreview("")}
              >
                <FaTimes size={14} />
              </button>
            </div>
          )}

          <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-blue-600">
            <FiImage size={18} />
            Change Image
            <input
              ref={imgInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImagePreview}
            />
          </label>

          <p className="mt-2 text-sm text-slate-500">
            Choose an image from your device.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
          <button
            className="cursor-pointer rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-200"
            onClick={closeModal}
          >
            Cancel
          </button>

          <button
            disabled={isPending}
            className="cursor-pointer divide-slate-900 disabled:cursor-pointer rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            onClick={handleEditComment}
          >
            {isPending ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <>Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
