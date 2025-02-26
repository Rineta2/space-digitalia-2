import React from 'react'

export default function FeaturedSkelaton() {
    return (
        <section className='min-h-full px-4 xl:px-10 py-4 sm:py-6'>
            <div className="container grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-lg'>
                        {/* Image skeleton */}
                        <div className="w-full max-w-14 sm:w-auto sm:max-w-20">
                            <div className='w-full aspect-square bg-gray-200 rounded-md relative overflow-hidden'>
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                            </div>
                        </div>

                        {/* Content skeleton */}
                        <div className="flex flex-col gap-2 w-full">
                            <div className='h-5 bg-gray-200 rounded relative overflow-hidden w-3/4'>
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                            </div>
                            <div className='space-y-2'>
                                <div className='h-3 bg-gray-200 rounded relative overflow-hidden w-full'>
                                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                                </div>
                                <div className='h-3 bg-gray-200 rounded relative overflow-hidden w-5/6'>
                                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}