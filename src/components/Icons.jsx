'use client'; // Add this at the top

import { modelState, cpostId } from '@/atom/modelAtom';
import { app } from '@/firebase';
import { collection, deleteDoc, doc, getFirestore, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { FaTrashAlt, FaRocketchat } from "react-icons/fa";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { useRecoilState } from 'recoil';
export default function Icons({ id, uid }) {
    const { data: session } = useSession();
    const [IsLiked, setIsLiked] = useState(false)
    const [Likes, setLikes] = useState([]);
    const [comment, setcomment] = useState([]);
    const db = getFirestore(app);
    const [open, setopen] = useRecoilState(modelState);
    const [postId, setPostId] = useRecoilState(cpostId)
    async function likePost() {
        if (session) {
            if (IsLiked) {
                await deleteDoc(doc(db, 'posts', id, 'likes', session?.user.uid))
            } else {
                await setDoc(doc(db, 'posts', id, "likes", session.user.uid), {
                    username: session.user.username,
                    timestamp: serverTimestamp()
                });
            }
        } else {
            signIn();
        }
    }

    useEffect(() => {
        onSnapshot(collection(db, 'posts', id, 'likes'), (snapshot) => {
            setLikes(snapshot.docs)
        })
    }, [db])

    useEffect(() => {
        setIsLiked(Likes.findIndex((like) => like.id === session?.user?.uid) !== -1);
    }, [Likes])
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'posts', id, 'comments'), (snapshot) => {
            setcomment(snapshot.docs);
        })
        return () => unsubscribe()
    }, [db, id])

    async function deletePost() {
        if (session?.user?.uid === uid) {
            if (window.confirm('Are you sure you want to delete this post?')) {
                deleteDoc(doc(db, 'posts', id)).then(() => console.log('deleted!'));
                window.location.reload();
            }
        }
    }

    return (
        <div className='flex justify-start gap-5 p-2 text-gray-500'>
            <div className='flex items-center'>

                <FaRocketchat className='h-8 w-8 cursor-pointer rounded-full transition duration-200 ease-in-out p-2 hover:text-sky-400 hover:bg-sky-100' onClick={() => {
                    if (!session) {
                        signIn();
                    }
                    else {
                        setopen(!open);
                        setPostId(id)
                    }
                }
                } />
                {
                    comment.length > 0 && (
                        <span className='text-sm text-gray-600'>{comment.length}</span>
                    )
                }
            </div>

            <div className='flex items-center'>
                {IsLiked ?

                    <IoMdHeart onClick={likePost} className='h-8 w-8 text-red-600 cursor-pointer rounded-full transition duration-200 ease-in-out p-2 hover:text-red-400 hover:bg-red-100' /> :

                    <IoIosHeartEmpty onClick={likePost} className='h-8 w-8 cursor-pointer rounded-full transition duration-200 ease-in-out p-2 hover:text-red-400 hover:bg-red-100' />
                }

                {Likes.length > 0 && <span className='text-xs'>{Likes.length}</span>}

            </div>
            {session?.user.uid === uid && (
                <FaTrashAlt className='h-8 w-8 cursor-pointer rounded-full transition duration-200 ease-in-out p-2 hover:text-gray-400 hover:bg-gray-200' onClick={deletePost} />
            )}

        </div>
    );
}
