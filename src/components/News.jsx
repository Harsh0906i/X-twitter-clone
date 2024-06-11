'use client'
import React, { useEffect, useState } from 'react'

export default function News() {
    const [news, setnews] = useState([])
    const [article, setarticle] = useState(3);
    useEffect(() => {
        fetch('https://saurav.tech/NewsAPI/top-headlines/category/business/us.json')
            .then((res) => res.json())
            .then((data) => { setnews(data.articles) })
    }, [])
    return (
        <div className='tex tex-gray-700 space-y-3 pt-2 bg-gray-100 rounded-xl mt-3'>
            <h4 className='font-semibold text-xl px-4'>whats happening</h4>
            {
                news.slice(0, article).map((articles) => (
                    <div>
                        <a href={articles.url}>
                            <div className='flex items-center justify-center'>
                                <div className='p-2 mt-2'>
                                    <h6 className='f font-semibold text-sm'>{articles.title}</h6>
                                </div>
                                <img src={articles.urlToImage} alt="" className='rounded-full p-2 w-48' />
                            </div>
                        </a>
                    </div>
                ))
            }
            <button onClick={() => setarticle(article + 3)} className='text-blue-400 pl-4 pb-3 hover:text-blue-500'>load more</button>
        </div>
    )
}
