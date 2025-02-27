"use client";

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';

import { FetchService } from '@/components/ui/service/lib/FetchService'

import { ServiceType } from '@/components/ui/service/lib/schema'

import ServiceSkelaton from '@/hooks/dashboard/super-admins/layout/service/ServiceSkelaton';

import Image from 'next/image'

export default function Service() {
    const [service, setService] = useState<ServiceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [visibleSections, setVisibleSections] = useState<number[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = parseInt(entry.target.getAttribute('data-index') || '0');
                    if (entry.isIntersecting) {
                        setVisibleSections(prev => [...new Set([...prev, index])]);
                    } else {
                        setVisibleSections(prev => prev.filter(i => i !== index));
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: "-100px 0px"
            }
        );

        const elements = document.querySelectorAll('.service-section');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [service]);

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
        <section className='min-h-full px-4 xl:px-12 py-12 sm:py-16 xl:py-24 bg-gradient-to-b from-white via-gray-50 to-white'>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col gap-4 sm:gap-6 items-center justify-center mb-16 text-center"
                >
                    <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900'>
                        Lorem Ipsum is simply dummy text of the printing.
                    </h1>
                    <p className='text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl leading-relaxed px-4'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s
                    </p>
                </motion.div>

                <div className="flex flex-col gap-10 relative">
                    <div className="absolute left-[50px] top-[60px] h-[calc(100%-120px)] w-full hidden md:block">
                        <svg
                            className="absolute top-0 left-0 h-full w-full"
                            viewBox="0 0 1000 1000"
                            preserveAspectRatio="none"
                        >
                            {service.length > 1 && (
                                <motion.path
                                    d="M 50,60 Q 50,190 50,250 T 500,320 T 950,320 Q 950,400 950,450"
                                    strokeDasharray="8,12"
                                    stroke="url(#gradient1)"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0, opacity: 0.3 }}
                                    animate={{
                                        pathLength: visibleSections.includes(1) ? 1 : 0,
                                        opacity: visibleSections.includes(1) ? 1 : 0.3,
                                        stroke: "url(#gradient1)"
                                    }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                />
                            )}
                            {service.length > 2 && (
                                <motion.path
                                    d="M 950,450 Q 950,520 950,580 T 500,640 T 50,640 Q 50,700 50,720"
                                    strokeDasharray="8,12"
                                    stroke="url(#gradient2)"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0, opacity: 0.3 }}
                                    animate={{
                                        pathLength: visibleSections.includes(2) ? 1 : 0,
                                        opacity: visibleSections.includes(2) ? 1 : 0.3,
                                        stroke: "url(#gradient2)"
                                    }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                />
                            )}
                            {service.length > 2 && (
                                <motion.path
                                    d="M 50,720 Q 50,780 50,820 T 500,900 T 950,900 Q 950,920 950,980"
                                    strokeDasharray="8,12"
                                    stroke="url(#gradient3)"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0, opacity: 0.3 }}
                                    animate={{
                                        pathLength: visibleSections.includes(3) ? 1 : 0,
                                        opacity: visibleSections.includes(3) ? 1 : 0.3,
                                        stroke: "url(#gradient3)"
                                    }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                />
                            )}

                            <defs>
                                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#2563EB" />
                                    <stop offset="100%" stopColor="#7C3AED" />
                                </linearGradient>
                                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#7C3AED" />
                                    <stop offset="100%" stopColor="#DB2777" />
                                </linearGradient>
                                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#DB2777" />
                                    <stop offset="100%" stopColor="#F59E0B" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {service.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 relative service-section
                            ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                            data-index={index}
                        >
                            <div className="flex-1 flex flex-col gap-6 md:gap-8">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className='flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100'
                                >
                                    <Image
                                        src={item.profile.image}
                                        alt={item.profile.title}
                                        width={80}
                                        height={80}
                                        className='w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl object-cover shadow-md'
                                    />
                                    <div>
                                        <h3 className='font-bold text-lg sm:text-xl mb-1 sm:mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800'>
                                            {item.profile.title}
                                        </h3>
                                        <p className='text-sm sm:text-base text-gray-600'>{item.profile.text}</p>
                                    </div>
                                </motion.div>

                                <h1 className='font-bold text-2xl sm:text-3xl md:text-4xl leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600'>
                                    {item.title}
                                </h1>
                                <p className='text-base sm:text-lg text-gray-600 leading-relaxed'>{item.description}</p>
                            </div>

                            <motion.div className="flex-1 w-full">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    width={600}
                                    height={600}
                                    className='w-full h-auto'
                                />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
