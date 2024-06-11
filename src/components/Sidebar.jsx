'use client'
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { FaXTwitter } from 'react-icons/fa6';
import { GoHomeFill } from 'react-icons/go';
import { BsThreeDots } from "react-icons/bs";
export default function Sidebar() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div className='flex flex-col p-3 justify-between h-screen'>
      <div className='flex flex-col gap-4 p-3'>
        <Link href={'/'}>
          <FaXTwitter className='w-16 h-16 cursor-pointer p-3 hover:bg-gray-100 rounded-full transition-all duration-200' />
        </Link>
        <Link href={'/'} className='flex items-center p-3 hover:bg-gray-100 rounded-full'>
          <GoHomeFill className='w-7 h-7' />
          <span className='font-bold hidden xl:inline'>Home</span>
        </Link>
        {session ? (
          <button onClick={() => signOut()} className='bg-blue-500 text-white font-semibold rounded-full hover:opacity-95 px-4 w-48 p-1'>
            Sign Out
          </button>
        ) : (
          <button onClick={() => signIn()} className='bg-blue-500 text-white font-semibold rounded-full hover:opacity-95 px-4 w-48 p-1'>
            Sign In
          </button>
        )}
      </div>
      {session && (
        <div className='text-gray-700 text-sm flex items-center cursor-pointer p-3 hover:bg-gray-100 rounded-full'>
          <img src={session.user.image} className='h-10 w-10 rounded-full xl:mr-2' alt="" />
          <div className='hidden xl:inline'>
            <h4 className='font-bold'>{session.user.name}</h4>
            <p className='text-gray-500'>@{session.user.username}</p>
          </div>
          <BsThreeDots className='h-5 xl:ml-8 hidden xl:inline' />
        </div>
      )}
    </div>
  );
}
