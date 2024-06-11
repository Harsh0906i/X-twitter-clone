'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { HiOutlinePhotograph } from "react-icons/hi";
import { app } from '@/firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore'

export default function Input() {
    const imagePickRef = useRef(null);
    const [imageurl, setimageUrl] = useState(null);
    const [selectedimage, setselectedimage] = useState(null);
    const [loading, setloading] = useState(false);
    const [text, settext] = useState('');
    const [postload, setpostload] = useState(false);
    const db = getFirestore(app);
    const { data: session } = useSession();

    useEffect(() => {
        if (selectedimage) {
            uploadImage();
        }
    }, [selectedimage]);

    function addImage(e) {
        const file = e.target.files[0];
        if (file) {
            setselectedimage(file);
            setimageUrl(URL.createObjectURL(file));
        }
    }

    async function uploadImage() {
        setloading(true);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + '_' + selectedimage.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, selectedimage);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
                console.log(error);
                setloading(false);
                setselectedimage(null);
                setimageUrl(null);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setimageUrl(downloadURL);
                    setloading(false);
                });
            }
        );
    }
    async function submitPost() {
        setpostload(true);
        const docRef = await addDoc(collection(db, 'posts'), {
            username: session.user.username,
            name: session.user.name,
            uid: session.user.uid,
            text,
            profileImg: session.user.image,
            image: imageurl,
            timestamp: serverTimestamp()
        });
        setloading(false);
        settext('');
        setpostload(false);
        setimageUrl(null);
        location.reload();
    }
    if (!session) {
        return null;
    }
    return (
        <div className='flex border-b border-gray-200 space-x-3 p-3'>
            <img src={session.user.image} className='h-11 w-11 rounded-full cursor-pointer hover:brightness-95' alt="" />
            <div className="w-full divide-y divide-gray-200">
                <textarea rows={2} placeholder='Whats happening' className='w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700' value={text} onChange={(e) => settext(e.target.value)} ></textarea>
                {
                    selectedimage && (
                        <img src={imageurl} alt="" className={`max max-h-[250px] object-cover cursor-pointer w-full ${loading ? 'animate-pulse' : ''}`} />
                    )

                }
                <div className="flex items-center justify-between pt-0.5">
                    <HiOutlinePhotograph onClick={() => imagePickRef.current.click()} className='h-10 w-10 p-2 text-sky-500 hover:bg-sky-100 rounded-full cursor-pointer' />
                    <input type="file" className='hidden' ref={imagePickRef} accept='image/*' onChange={addImage} />

                    <button className='bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95  disabled:opacity-50' disabled={text.trim() === '' || loading || postload} onClick={submitPost}>Post</button>
                </div>
            </div>
        </div>
    );
}
