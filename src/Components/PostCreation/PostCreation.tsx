import { FiImage, FiSend } from "react-icons/fi";
import { MdCancel } from "react-icons/md";

import bird from "../../assets/bird.webp";
import {  useRef, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";

export default function PostCreation() {
  const [isUploaded, setisUploaded] = useState("");
  const queryClient = useQueryClient();

  const formData = new FormData();
  const textInput = useRef(null);
  const imgInput = useRef(null);
  function CreatePost() {
    return axios.post(`https://route-posts.routemisr.com/posts`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }
  function clearForm() {
    textInput.current.value = "";
    imgInput.current.value = "";
    setisUploaded("");
  }
  const { data, isPending, mutate } = useMutation({
    mutationFn: CreatePost,
    onSuccess: (res) => {
      console.log("success");
      clearForm();
      queryClient.invalidateQueries({
        queryKey: ["getAllPosts"],
      });
    },
    onError: (err) => {
      console.log("error");
    },
    onSettled: () => {},
  });
  function handleCreatePost() {
    if (textInput.current.value === "" && imgInput.current.value === "") {
      return;
    }
    if (textInput.current.value) {
      formData.append("body", textInput.current?.value);
    }
    if (imgInput.current.value) {
      formData.append("image", imgInput.current.files[0]);
    }
    mutate();
  }
  function handleImagePreview(e) {
    console.log(e.target.files[0]);
    //img to back end
    const path = URL.createObjectURL(e.target.files[0]);
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
