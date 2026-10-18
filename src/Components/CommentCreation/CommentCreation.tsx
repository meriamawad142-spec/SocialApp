

import { FaImage } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
export default function CommentCreation({
  postId,
  queryKey,
}: {
  postId: string;
  queryKey: string[];
}) {
  const form = useForm({
    defaultValues: {
      content: "",
      image: "",
    },
  });

  const query = useQueryClient();

  const { register, handleSubmit, reset } = form;

  const formdata = new FormData();

  function createComment() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      formdata,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { isPending, mutate } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
   
      reset();
      query.invalidateQueries({
        queryKey: queryKey,
      });
    },
    onError: (err) => {
      console.log(err);
    },
    onSettled: () => {},
  });

  function handleCreateComment(values: {
    content: string;
    image: string;
  }) {
    if (values.content) {
      formdata.append("content", values.content);
    }

    if (values.image) {
      formdata.append("image", values.image[0]);
    }

    if (!values.content && !values.image) {
      return;
    }

    mutate();
  }

  return (
    <div className="my-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <form
        className="mx-auto"
        onSubmit={handleSubmit(handleCreateComment)}
      >
        <div className="relative flex items-center">

          <input
            {...register("content")}
            type="text"
            id="search"
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-4 pr-14 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Write a comment..."
          />

          <button
            type="submit"
            disabled={isPending}
            className="absolute right-2 flex  items-center justify-center cursor-pointer  text-blue-600 transition disabled:cursor-not-allowed"
          >
            {isPending ? (
              <FaSpinner className="animate-spin" />
            ) : (
            
              <IoIosSend size={20}  />

            )}
          </button>

        </div>

        <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600">
          <FaImage className="text-blue-500" />
          <span>Add image</span>

          <input
            type="file"
            hidden
            {...register("image")}
          />
        </label>
      </form>
    </div>
  );
}

