import axios from "axios";
import { useEffect, useState } from "react";
import type { PostType } from "../../Types/Post.type";
import Post from "../../Components/Post/Post";

import Loader from "../../Components/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import PostCreation from './../../Components/PostCreation/PostCreation';

export default function Home() {
  // const [allProducts, setallProducts] = useState([]);
  // const [isLoading, setisLoading] = useState(true);
  // const [isError, setisError] = useState(false);
  function getAllPosts() {
    return axios.get(`https://route-posts.routemisr.com/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
    // .then((res) => {
    //   console.log(res.data.data.posts);
    //   setallProducts(res.data.data.posts);
    // })
    // .catch((err) => {
    //   console.log(err);
    //   setisError(true);
    // })
    // .finally(() => {
    //   setisLoading(false);
    // });
  }
  // useEffect(() => {
  //   getAllPosts();
  // }, []);
  // if (isLoading) {
  //   return (
  //    <Loader/>
  //   );
  // }
  // if (isError) {
  //   return <h1> Error... </h1>;
  // }
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["getAllPosts"],
    queryFn: getAllPosts,  
  });

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <p>{error.message}</p>;
  }
  return (
    <>
    
    <PostCreation/>
      <div className="my-8">
        {data?.data.data.posts.map((post: PostType) => (
          <Post post={post} isPostDetails={false}  key={post.id} />
        ))}
      </div>
    </>
  );
}
