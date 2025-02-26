import React from 'react'

export default function ServiceSkelaton() {
    return (
        <section className='min-h-full px-4 xl:px-12 py-10 sm:py-10 xl:py-20'>
            <div className="container">
                {/* Header skeleton */}
                <div className="flex flex-col gap-4 items-center justify-center mb-20 text-center">
                    <div className='h-10 bg-gray-200 rounded relative overflow-hidden w-3/4 max-w-2xl'>
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                    </div>
                    <div className='h-4 bg-gray-200 rounded relative overflow-hidden w-2/3 max-w-2xl'>
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                    </div>
                </div>

                {/* Service items skeleton */}
                <div className="flex flex-col gap-20">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className={`flex flex-col md:flex-row items-center gap-10 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                            <div className="flex-1 flex flex-col gap-6">
                                {/* Profile skeleton */}
                                <div className='flex gap-4 items-center'>
                                    <div className='w-16 h-16 rounded-full bg-gray-200 relative overflow-hidden'>
                                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                                    </div>
                                    <div>
                                        <div className='h-6 bg-gray-200 rounded relative overflow-hidden w-32 mb-2'>
                                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                                        </div>
                                        <div className='h-4 bg-gray-200 rounded relative overflow-hidden w-40'>
                                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content skeleton */}
                                <div className='h-8 bg-gray-200 rounded relative overflow-hidden w-3/4'>
                                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                                </div>
                                <div className='space-y-2'>
                                    <div className='h-4 bg-gray-200 rounded relative overflow-hidden w-full'>
                                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                                    </div>
                                    <div className='h-4 bg-gray-200 rounded relative overflow-hidden w-5/6'>
                                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                                    </div>
                                    <div className='h-4 bg-gray-200 rounded relative overflow-hidden w-4/5'>
                                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Image skeleton */}
                            <div className="flex-1">
                                <div className='w-full aspect-square bg-gray-200 rounded-lg relative overflow-hidden'>
                                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}