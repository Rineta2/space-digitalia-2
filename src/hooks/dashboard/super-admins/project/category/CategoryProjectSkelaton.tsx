import React from 'react'

export default function CategoryProjectSkelaton() {
    return (
        <section className='min-h-full px-0 sm:px-4'>
            {/* Header Section Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-2">
                        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="h-4 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="h-12 w-full sm:w-40 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
            </div>

            <div className="space-y-4">
                {/* Table Skeleton */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="bg-gray-50/50 px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Ditambahkan
                                    </th>
                                    <th className="bg-gray-50/50 px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="bg-gray-50/50 px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right flex justify-center gap-2">
                                            <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                                            <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Skeleton */}
                <div className="py-6 px-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-9 w-9 bg-gray-200 rounded-lg animate-pulse"></div>
                            ))}
                            <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}