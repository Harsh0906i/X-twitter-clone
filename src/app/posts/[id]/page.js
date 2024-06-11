import { app } from '@/firebase'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { HiArrowLeft } from 'react-icons/hi'

import React from 'react'
import Link from 'next/link'
import Post from '@/components/Post'
import ShowComments from '@/components/ShowComments'
export default async function postPage({params}) {
  const db=getFirestore(app)
  const querySnapshot=await getDoc(doc(db,'posts',params.id));
  let data={};
  data={...querySnapshot.data(),id:querySnapshot.id};
  return (
    <div className='max-w-xl mx-auto border-r border-l min-h-screen'>
      <div className='flex items-center sticky top-0 space-x-2 px-3 py-2 z-50 bg-white border-b border-gray-200'>
        <Link href={'/'} className='hover:bg-gray-200'>
        <HiArrowLeft className='h-5 w-5'/>
        </Link>
        <h2 className='sm:text-lg cursor-pointer'>Back</h2>
      </div>
      <Post post={data} id={data.id}/>
      <ShowComments id={params.id}/>
    </div>
  )
}
