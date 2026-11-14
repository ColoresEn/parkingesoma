"use client";

import { SafeComment, SafeUser } from "@/types/type";
import axios from "axios";
import { useRouter } from "next/navigation";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsFillPencilFill } from "react-icons/bs";


interface CommentProps {
  key: string;
  data: SafeComment;
  currentUser?: SafeUser | null;
  email: string;
 
}

export default function SingleComment({ key, data, currentUser }: CommentProps) {
 
  const router = useRouter();

  const onLike = () => {
    axios
      .post(`/api/like/${data.id}`)
      .then(() => {
        router.refresh();
      })
      .catch((error) => {})
      .finally(() => {});
  };

  const onDelete = () => {
    if (confirm("Are you sure you want to delete it?")){ 
       axios
      .delete(`/api/comments/${data.id}`)
      .then(() => {
        router.refresh();
      })
      .catch((error) => {})
      .finally(() => {});
    
    }
  
  };

 
  return (
    <div className="bg-zinc-900 min-w-300  w-full  max-w-xs sm:max-w-xs  mx-auto border border-sky-300">
     
      <div className="items-center justify-between flex m-4">
        <div className="w-[530px] flex flex-col  leading-[1.5]">
          <h3>{data.title}</h3>
          <p>{data.description}</p>
          <p>{data.email}</p>
        </div>

     
          <div className="flex items-center gap-4 mt-4  ">
            <RiDeleteBin5Line
              onClick={onDelete}
              className=" cursor-pointer text-[1.5rem] text-red-700"
            />
            <BsFillPencilFill
              onClick={() => router.push(`/comments/${data.id}`)}
              className=" cursor-pointer text-[1.2rem] text-green-500"
            />
         {/*    <button className="bg-red-400 px-6 py-2" onClick={onDelete}>Delete</button>
            <button className="bg-yellow-400 px-6 py-2" onClick={() => router.push(`/comments/${data.id}`)}>Edit</button> */}
          </div>
       
   
  
      </div>
    </div>
  );
}
