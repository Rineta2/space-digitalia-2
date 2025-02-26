import React from 'react'

export default function FeaturedSkelaton() {
    return (
        <section className='min-h-full p-4 sm:p-6 lg:p-8'>
            {/* Header Section Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="h-12 w-full sm:w-40 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>

            {/* Featured Content Grid Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                    >
                        {/* Image Skeleton */}
                        <div className="relative aspect-[4/3] w-full bg-gray-200 animate-pulse"></div>

                        {/* Content Skeleton */}
                        <div className="p-5 space-y-3">
                            <div className="h-6 w-3/4 bg-gray-200 rounded-lg animate-pulse"></div>
                            <div className="h-4 w-full bg-gray-200 rounded-lg animate-pulse"></div>

                            {/* Action Buttons Skeleton */}
                            <div className="pt-3 flex justify-end gap-2">
                                <div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                                <div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}