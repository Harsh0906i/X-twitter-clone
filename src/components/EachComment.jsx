import { app } from '@/firebase';
import { getFirestore } from 'firebase/firestore';
import { signIn, useSession } from 'next-auth/react';
import React from 'react'
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { IoIosHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
export default function EachComment({ commentid, postid, comment }) {
    const [IsLiked, setIsLiked] = useState(false)
    const [Likes, setLikes] = useState([]);
    const db = getFirestore(app);
    const { data: session } = useSession();
    async function likePost() {
        if (session) {
            if (IsLiked) {
                await deleteDoc(doc(db, 'posts', postid, 'comments', commentid, 'commentlikes', session?.user.uid))
            } else {
                await setDoc(doc(db, 'posts', postid, "comments", commentid, 'commentlikes', session.user.uid), {
                    username: session.user.username,
                    timestamp: serverTimestamp()
                });
            }
        } else {
            signIn()
        }
    }
    useEffect(() => {
        onSnapshot(collection(db, 'posts', postid, 'comments', commentid, 'commentlikes'), (snapshot) => {
            setLikes(snapshot.docs)
        })
    }, [db])

    useEffect(() => {
        setIsLiked(Likes.findIndex((like) => like.id === session?.user?.uid) !== -1);
    }, [Likes])
    return (
        <div className='flex p-3 border-b border-gray-200 hover:bg-gray-50 pl-10'>
            <img src={comment?.userImg} className='h-9 w-9 rounded-full mr-4' alt="" />
            <div className='flex-1'>
                <div className="flex items-center space-x-1 whitespace-nowrap">
                    <h4 className='font-bold text-sm truncate'>{comment?.name}</h4>
                    <span className='text-xs truncate'>@{comment?.username}</span>
                </div>
                <p className='text-gray-800 text-xs my-3'>{comment?.comment}</p>
                <div className='flex items-center'>
                    {IsLiked ?

                        <IoMdHeart onClick={likePost} className='h-8 w-8 text-red-600 cursor-pointer rounded-full transition duration-200 ease-in-out p-2 hover:text-red-400 hover:bg-red-100' /> :

                        <IoIosHeartEmpty onClick={likePost} className='h-8 w-8 cursor-pointer rounded-full transition duration-200 ease-in-out p-2 hover:text-red-400 hover:bg-red-100' />
                    }

                    {Likes.length > 0 && <span className='text-xs'>{Likes.length}</span>}
                </div>
            </div>
        </div>
    )
}
