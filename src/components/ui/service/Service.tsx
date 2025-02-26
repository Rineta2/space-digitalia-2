"use client";

import React, { useEffect, useState } from 'react'

import { FetchService } from '@/components/ui/service/lib/FetchService'

import { ServiceType } from '@/components/ui/service/lib/schema'

import ServiceSkelaton from '@/hooks/dashboard/super-admins/layout/service/ServiceSkelaton';

import Image from 'next/image'

export default function Service() {
    const [service, setService] = useState<ServiceType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = FetchService((newService) => {
            setService(newService);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <ServiceSkelaton />;
    }

    return (
        <section className='min-h-full px-4 xl:px-12 py-10 sm:py-10 xl:py-20'>
            <div className="container">
                <div className="flex flex-col gap-4 items-center justify-center mb-20 text-center">
                    <h1 className='text-2xl md:text-4xl font-bold max-w-2xl'>Lorem Ipsum is simply dummy text of the printing.</h1>
                    <p className='text-md text-sm text-gray-600 max-w-2xl'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s</p>
                </div>

                <div className="flex flex-col gap-20">
                    {service.map((item, index) => (
                        <div key={item.id} className={`flex flex-col md:flex-row items-center gap-10 relative ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                            <div className="flex-1 flex flex-col gap-6">
                                <div className='flex gap-4 items-center'>
                                    <Image
                                        src={item.profile.image}
                                        alt={item.profile.title}
                                        width={64}
                                        height={64}
                                        className='w-16 h-16 rounded-full'
                                    />
                                    <div>
                                        <h3 className='font-bold text-lg'>{item.profile.title}</h3>
                                        <p className='text-gray-600'>{item.profile.text}</p>
                                    </div>
                                </div>

                                <h1 className='font-bold text-2xl md:text-3xl'>{item.title}</h1>
                                <p className='text-gray-600 leading-relaxed'>{item.description}</p>
                            </div>

                            <div className="flex-1">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    width={500}
                                    height={500}
                                    className='w-full h-auto'
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
