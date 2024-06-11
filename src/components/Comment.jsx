'use client'
import { modelState, cpostId } from '@/atom/modelAtom'
import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import Modal from 'react-modal'
import { RxCross2 } from "react-icons/rx";
import { getFirestore, onSnapshot, doc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { app } from '@/firebase'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
// import { comment } from 'postcss'
const { useSession } = require('next-auth/react');
export default function Comment() {
    const [open, setopen] = useRecoilState(modelState);
    const [postid, setpostid] = useRecoilState(cpostId);
    const [post, setpost] = useState({});
    const [input, setinput] = useState('');
    const db = getFirestore(app);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (postid !== '') {
            const postRef = doc(db, 'posts', postid);
            const unsubscribe = onSnapshot(
                postRef,
                (snapshot) => {
                    if (snapshot.exists()) {
                        setpost(snapshot.data());
                    } else {
                        console.log('No such document!')
                    }
                }
            );
            return () => unsubscribe();
        }
    }, [postid])

    async function sendcomment() {
        addDoc(collection(db, 'posts', postid, 'comments'), {
            username: session.user.username,
            userImg: session.user.image,
            comment: input,
            timestamp: serverTimestamp()
        }).then(() => {
            setinput('');
            setopen(false);
            router.push(`/posts/${postid}`)
        });
    }
    return (
        <div>
            {
                open && (
                    <Modal className="max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] bg-white border-2 border-gray-200 rounded-xl shadow-md" isOpen={open} onRequestClose={() => setopen(false)} ariaHideApp={false}>
                        <div className='p-4'>
                            <div className='border-b border-gray-200 py-2 px-1.5'>

                                <RxCross2 className='text-2xl text-gray-700 p-1 hover:bg-gray-200 rounded-full cursor-pointer' onClick={() => setopen(false)} />

                            </div>
                            <div className='p-2 flex items-center space-x-1 relative'>
                                <span className='w-0.5 h-full z-[-1] absolute left-8 top-11 bg-gray-300' />

                                <img src={post?.profileImg} className='h-11 w-11 rounded-full mr-4' alt="" />
                                <h4 className='font-bold sm:text-[16px] text-[15px] hover:underline truncate'>{post?.name}</h4>
                                <span className='text-sm sm:text-[15px] truncate'>@{post?.username}</span>
                            </div>
                            <p className='text-gray-500 text-[15px] sm:text-[16px] ml-16 mb-2'>{post?.text}</p>
                            <div className='flex p-3 space-x-3'>
                                <img src={session.user.image} className='h-11 w-11 rounded-full cursor-pointer hover:brightness-95' alt="" />
                                <div className='w-full divide-y divide-gray-200'>
                                    <div>
                                        <textarea className='w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700 placeholder:text-gray-500' placeholder='Reply...' rows={1} onChange={(e) => setinput(e.target.value)}></textarea>
                                    </div>
                                    <div className='flex items-center justify-end pt-2.5'>
                                        <button className='bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:opacity-95 disabled:opacity-50' disabled={input.trim() === ''} onClick={sendcomment}>Reply</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )
            }
        </div>
    )
}
