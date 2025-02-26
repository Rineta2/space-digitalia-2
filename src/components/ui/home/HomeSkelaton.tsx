import React from 'react'

export default function HomeSkelaton() {
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
                    <div className='flex flex-col gap-6 lg:gap-8 items-center text-center xl:text-start xl:items-start'>
                        {/* Title skeleton */}
                        <div className='w-3/4 h-14 bg-gray-200 rounded-lg relative overflow-hidden'>
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                        </div>

                        {/* Description skeleton */}
                        <div className='w-full space-y-3'>
                            <div className='h-4 bg-gray-200 rounded relative overflow-hidden'>
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                            </div>
                            <div className='h-4 bg-gray-200 rounded relative overflow-hidden w-5/6'>
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                            </div>
                            <div className='h-4 bg-gray-200 rounded relative overflow-hidden w-4/6'>
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                            </div>
                        </div>

                        {/* Buttons skeleton */}
                        <div className='flex gap-4 sm:gap-6 mt-4'>
                            <div className='w-32 h-12 bg-gray-200 rounded-full relative overflow-hidden'>
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                            </div>
                            <div className='w-32 h-12 bg-gray-200 rounded-full relative overflow-hidden'>
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                            </div>
                        </div>
                    </div>

                    {/* Image skeleton */}
                    <div className="relative w-full aspect-square xl:aspect-[4/5] rounded-lg overflow-hidden">
                        <div className="w-full h-full bg-gray-200 relative overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}