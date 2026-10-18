
import axios from "axios";
import Loader from "../../Components/Loader/Loader";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Post from "../../Components/Post/Post";

export default function PostDetails() {
  const {id} = useParams();
  function getPostDetails() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["getPostDetails",id],
    queryFn: getPostDetails,
  });
  console.log(data?.data.data.post);
  console.log("isLoading", isLoading);
  console.log("isError", isError);
  console.log("error", error);
  console.log("isFetching", isFetching);
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <p>{error.message}</p>;
  }

  return <Post post={data?.data.data.post} isPostDetails={true} />;
}
