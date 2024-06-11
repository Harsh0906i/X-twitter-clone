'use client'
import { app } from '@/firebase'
import { collection, getFirestore, onSnapshot, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import Comment from './Comment';
import EachComment from './EachComment';

export default function ShowComments({ id }) {
    const db = getFirestore(app);
    const [comments, setcomments] = useState([]);
    useEffect(() => {
        onSnapshot(query(collection(db, 'posts', id, 'comments'), orderBy('timestamp', 'desc')), (snapshot) => {
            setcomments(snapshot.docs);
        })
    }, [db, id]);
    return (
        <div>{
            comments.map((comment) => (
                <EachComment key={comment.id} comment={comment.data()} commentid={comment.id} postid={id} />
            ))
        }</div>
    )
}
