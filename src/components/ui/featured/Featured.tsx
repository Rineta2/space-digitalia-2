"use client";

import React, { useEffect, useState } from 'react'

import { FetchFeatured } from '@/components/ui/featured/lib/FetchFeatured'

import { FeaturedType } from './lib/schema'

import FeaturedSkelaton from '@/hooks/dashboard/super-admins/layout/featured/FeaturedSkelaton';

import Image from 'next/image'

export default function Featured() {
    const [featured, setFeatured] = useState<FeaturedType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = FetchFeatured((newFeatured) => {
            setFeatured(newFeatured);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <FeaturedSkelaton />;
    }

    return (
        <section className='min-h-full px-4 xl:px-10 py-4 sm:py-6'>
            <div className="container grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                {
                    featured.map((item) => {
                        return (
                            <div key={item.id} className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-lg hover:bg-gray-50'>
                                <div className="w-full max-w-14 sm:w-auto sm:max-w-20">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title}
                                        width={500}
                                        height={500}
                                        className='w-full h-auto object-cover rounded-md'
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <h3 className='text-md font-bold line-clamp-2'>{item.title}</h3>
                                    <p className='text-sm text-gray-600 line-clamp-3'>{item.text}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </section>
    )
}
