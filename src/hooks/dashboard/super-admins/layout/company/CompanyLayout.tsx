"use client"

import React, { useState, useEffect } from 'react'

import { toast } from 'react-hot-toast'

import { db } from '@/utils/firebase'

import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'

import imagekitInstance from '@/utils/imagekit'

import Image from 'next/image'

import { compressImage } from "@/base/helper/ImageCompression";

import CompanySkeleton from '@/hooks/dashboard/super-admins/layout/company/CompanySkelaton'

interface CompanyContent {
    id?: string;
    imageUrl: string;
}

export default function CompanyLayout() {
    const [isLoading, setIsLoading] = useState(true)
    const [contents, setContents] = useState<CompanyContent[]>([])
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [formData, setFormData] = useState<CompanyContent>({
        imageUrl: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // Fetch data
    useEffect(() => {
        fetchContents()
    }, [])

    const fetchContents = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_COMPANY as string))
            const contentArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as CompanyContent[]
            setContents(contentArray)
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching contents:', error)
            setIsLoading(false)
        }
    }

    const handleImageUpload = async (file: File) => {
        try {
            const compressedFile = await compressImage(file);
            const reader = new FileReader();

            const base64Promise = new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(compressedFile);
            });

            const base64 = await base64Promise;
            const result = await imagekitInstance.upload({
                file: base64,
                fileName: `company${Date.now()}`,
                folder: "/company",
            });

            return result.url;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Failed to upload image');
        }
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true)
            let imageUrl = formData.imageUrl
            if (selectedImage) {
                imageUrl = await handleImageUpload(selectedImage)
            }

            if (isEditMode && formData.id) {
                // Update existing document
                const docRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_COMPANY as string, formData.id);
                await updateDoc(docRef, {
                    imageUrl,
                    updatedAt: new Date()
                });
                toast.success('Image updated successfully!')
            } else {
                // Create new document
                await addDoc(collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_COMPANY as string), {
                    imageUrl,
                    createdAt: new Date()
                })
                toast.success('Image uploaded successfully!')
            }

            // Reset form and states
            setFormData({ imageUrl: '' })
            setSelectedImage(null)
            setImagePreview(null)
            setIsEditMode(false)
            fetchContents()

            // Close modal
            const modal = document.getElementById('content_modal') as HTMLDialogElement | null
            modal?.close()
        } catch (error) {
            console.error('Error submitting content:', error)
            toast.error(isEditMode ? 'Failed to update image. Please try again.' : 'Failed to upload image. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const docRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_COMPANY as string, id)
            await deleteDoc(docRef)
            fetchContents()
            toast.success('Image deleted successfully!')
            // Close the delete modal after successful deletion
            const deleteModal = document.getElementById('delete_modal') as HTMLDialogElement | null
            deleteModal?.close()
        } catch (error) {
            console.error('Error deleting image:', error)
            toast.error('Failed to delete image. Please try again.')
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    useEffect(() => {
        return () => {
            if (selectedImage) {
                URL.revokeObjectURL(URL.createObjectURL(selectedImage));
            }
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [selectedImage, imagePreview]);

    if (isLoading) {
        return <CompanySkeleton />
    }

    return (
        <section className='min-h-full py-0 px-0 sm:py-4 sm:px-4'>
            {/* Header Section */}
            <div className="flex justify-start items-start flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
                <div className="space-y-1.5">
                    <h1 className='text-2xl sm:text-3xl font-bold text-slate-800'>
                        Company Gallery
                    </h1>
                    <p className='text-sm text-slate-600'>Manage and showcase your company images</p>
                </div>

                <button
                    className="w-fit px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-sm hover:shadow-primary/20 hover:shadow-lg font-medium"
                    onClick={() => {
                        const modal = document.getElementById('content_modal') as HTMLDialogElement | null
                        modal?.showModal()
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Upload Image
                </button>
            </div>
            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-24">Image</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">URL</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {contents.map((content) => (
                                <tr key={content.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex justify-center">
                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden">
                                                <Image
                                                    src={content.imageUrl}
                                                    alt="Company image"
                                                    fill
                                                    className="object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="text-sm text-slate-700 truncate max-w-[300px] sm:max-w-md mx-auto">
                                            {content.imageUrl}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => {
                                                    setFormData({
                                                        id: content.id,
                                                        imageUrl: content.imageUrl
                                                    });
                                                    setIsEditMode(true);
                                                    setSelectedImage(null);
                                                    setImagePreview(null);
                                                    const modal = document.getElementById('content_modal') as HTMLDialogElement | null;
                                                    modal?.showModal();
                                                }}
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors duration-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeleteId(content.id || null);
                                                    const deleteModal = document.getElementById('delete_modal') as HTMLDialogElement | null;
                                                    deleteModal?.showModal();
                                                }}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Upload Modal */}
            <dialog id="content_modal" className="modal">
                <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-[90%] max-w-2xl p-8">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {isEditMode ? 'Edit Image' : 'Upload Image'}
                                    </h3>
                                    <p className="text-sm text-gray-500">Add a new image to your company gallery</p>
                                </div>
                                <button
                                    onClick={() => {
                                        const modal = document.getElementById('content_modal') as HTMLDialogElement | null
                                        modal?.close()
                                        setIsEditMode(false)
                                        setFormData({ imageUrl: '' })
                                        setSelectedImage(null)
                                        setImagePreview(null)
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form method="dialog" onSubmit={(e) => {
                                e.preventDefault()
                                handleSubmit()
                            }} className="space-y-8">
                                {/* Form Fields */}
                                <div className="flex items-center justify-center w-full">
                                    <label className={`w-full flex flex-col items-center px-4 py-6 bg-white rounded-xl border-2 ${imagePreview ? 'border-primary' : 'border-gray-300 border-dashed'} cursor-pointer hover:bg-gray-50 transition-colors duration-200`}>
                                        {imagePreview ? (
                                            <div className="relative w-full max-w-[300px] aspect-video">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    width={500}
                                                    height={500}
                                                    className="object-contain rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedImage(null);
                                                        setImagePreview(null);
                                                    }}
                                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </label>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium"
                                        disabled={isSubmitting}
                                        onClick={() => {
                                            setFormData({ imageUrl: '' })
                                            const modal = document.getElementById('content_modal') as HTMLDialogElement | null
                                            modal?.close()
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 font-medium flex items-center gap-2"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                <span>Uploading...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Upload</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </dialog>

            {/* Delete Confirmation Modal */}
            <dialog id="delete_modal" className="modal">
                <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
                        <h3 className="text-xl font-bold text-slate-800 mb-3">Confirm Deletion</h3>
                        <p className="text-sm text-slate-600 mb-8">Are you sure you want to delete this image? This action cannot be undone.</p>
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-5 py-2.5 text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-300 font-medium"
                                onClick={() => {
                                    const deleteModal = document.getElementById('delete_modal') as HTMLDialogElement | null
                                    deleteModal?.close()
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 font-medium"
                                onClick={() => deleteId && handleDelete(deleteId)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </dialog>
        </section>
    )
}
