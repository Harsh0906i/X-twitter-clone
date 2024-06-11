import Link from 'next/link'
import React from 'react'
import Icons from './Icons'

export default function Post({ post, id }) {
    return (
        <div className='flex p-3 border-b border-gray-200 hover:bg-gray-50'>
            <img src={post?.profileImg} className='h-11 w-11 rounded-full mr-4' alt="" />
            <div className='flex-1'>
                <div className="flex items-center space-x-1 whitespace-nowrap">
                    <h4 className='font-bold text-sm truncate'>{post?.name}</h4>
                    <span className='text-xs truncate'>@{post?.username}</span>
                </div>
            <Link href={`/posts/${post.id}`}><p className='text-gray-800 text-sm my-3'>{post?.text}</p></Link>
            <Link href={`/posts/${post.id}`}><img src={post?.image} className='rounded-2xl mr-2' alt="" /></Link>
            <Icons id={post.id} uid={post.uid}/>
            </div>
        </div>
    )
}
