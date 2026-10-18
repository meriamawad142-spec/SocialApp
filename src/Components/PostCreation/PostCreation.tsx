import { FiImage, FiSend } from "react-icons/fi";
import { MdCancel } from "react-icons/md";

import { useRef, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";

export default function PostCreation() {
  const [isUploaded, setisUploaded] = useState("");
  const queryClient = useQueryClient();

  const textInput = useRef<HTMLTextAreaElement>(null);
  const imgInput = useRef<HTMLInputElement>(null);
  function CreatePost(formData: FormData) {
    return axios.post(`https://route-posts.routemisr.com/posts`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }
  function clearForm() {
    if (textInput.current) {
      textInput.current.value = "";
    }

    if (imgInput.current) {
      imgInput.current.value = "";
    }

    setisUploaded("");
  }
  const { isPending, mutate } = useMutation({
    mutationFn: CreatePost,
    onSuccess: () => {
      console.log("success");
      clearForm();
      queryClient.invalidateQueries({
        queryKey: ["getAllPosts"],
      });
    },
    onError: () => {
      console.log("error");
    },
    onSettled: () => {},
  });
  function handleCreatePost() {
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
  function handleImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const path = URL.createObjectURL(file);
    setisUploaded(path);
  }
  return (
    <div className="w-full mx-auto my-4  max-w-xl rounded-2xl  border border-gray-200 bg-white p-4 shadow-sm">
      {/* Input 1: text */}
      <textarea
        ref={textInput}
        rows={3}
        dir="auto"
        placeholder="What's on your mind?"
        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
      />
      {isUploaded && (
        <div className="relative">
          <img src={isUploaded} alt="" />

          <MdCancel
            onClick={() => setisUploaded("")}
            className="absolute top-[10px] end-[10px]  size-8 text-black cursor-pointer"
          />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        {/* Input 2: image */}
        <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-blue-600">
          <FiImage size={18} />
          Add image
          <input
            ref={imgInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImagePreview}
          />
        </label>

        <button
          disabled={isPending}
          type="submit"
          onClick={handleCreatePost}
          className="flex items-center cursor-pointer gap-2 disabled:bg-slate-900 disabled:cursor-not-allowed rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {isPending ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <>
              <FiSend size={16} />
              Post
            </>
          )}
        </button>
      </div>
    </div>
  );
}
