import React from 'react';
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';
import { app } from '@/firebase';
import Post from './Post';

export default async function Feed() {
    const db = getFirestore(app);
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const querySnapShot = await getDocs(q);  // Use getDocs here
    let data = [];
    querySnapShot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
    });
    // console.log('data', data);
    return (
        <div>
            {data.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    );
}
