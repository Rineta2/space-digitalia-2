"use client";

import React, { useEffect, useState } from 'react'

import { FetchHome } from './lib/FetchHome'

import HomeSkelaton from './HomeSkelaton'

import { HomeType } from './lib/schema'

import Link from 'next/link'

import Image from 'next/image'

import vector1 from "@/base/assets/ui/home/Vector1.png"

import vector2 from "@/base/assets/ui/home/Vector2.png"

export default function Home() {
    const [home, setHome] = useState<HomeType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = FetchHome((newHome) => {
            setHome(newHome);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <HomeSkelaton />;
    }

    return (
        <section className='min-h-screen relative bg-gradient-to-br from-white via-blue-50 to-blue-100 overflow-hidden mt-[0] xl:mt-[-8rem]'>
            {/* Glass-morphism background elements */}
            <div className='absolute -z-10 inset-0'>
                <div className='absolute top-1/4 left-1/3 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl'></div>
                <div className='absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl'></div>
                <div className='absolute top-1/2 left-1/2 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl'></div>
            </div>

            <div className='container mx-auto px-4 xl:px-10 relative z-10'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center'>
                    {home.map((item) => (
                        <div key={item.id} className='flex flex-col gap-6 lg:gap-8 items-center text-center xl:text-start xl:items-start'>
                            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
                                {item.title}
                            </h1>

                            <p className='text-lg text-gray-600/90 leading-relaxed'>
                                {item.description}
                            </p>

                            <div className='flex gap-4 sm:gap-6 mt-4'>
                                <Link
                                    href={item.button1.link}
                                    className='group relative px-8 py-4 rounded-full bg-blue-600 text-white font-semibold overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 w-fit'
                                >
                                    <span className='relative z-10'>{item.button1.text}</span>
                                    <div className='absolute inset-0 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300'></div>
                                </Link>

                                <Link
                                    href={item.button2.link}
                                    className='group px-8 py-4 rounded-full border-2 border-blue-600 text-blue-600 font-semibold transition-all duration-300 hover:bg-blue-50/50 hover:shadow-xl hover:shadow-blue-500/10 hover:scale-[1.02] w-fit'
                                >
                                    {item.button2.text}
                                </Link>
                            </div>
                        </div>
                    ))}

                    {home.map((image) => (
                        <div
                            className="relative w-full aspect-square xl:aspect-[4/5] overflow-hidden"
                            key={image.id}
                        >
                            <Image
                                fill
                                src={image.imageUrl}
                                alt={image.title}
                                className='object-cover w-full h-full'
                                priority
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className='absolute bottom-0 right-0 opacity-30 transform hover:opacity-40 transition-opacity duration-300'>
                <Image src={vector1} alt='vector-1' />
            </div>

            <div className='absolute bottom-[-10rem] left-0 opacity-30 transform hover:opacity-40 transition-opacity duration-300'>
                <Image src={vector2} alt='vector-2' />
            </div>
        </section>
    )
}
