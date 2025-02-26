"use client"

import React, { useState, useEffect } from 'react'

import { toast } from 'react-hot-toast'

import { db } from '@/utils/firebase'

import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'

import imagekitInstance from '@/utils/imagekit'

import Image from 'next/image'

import HomeSkelaton from '@/hooks/dashboard/super-admins/layout/home/HomeSkelaton'

import { compressImage } from "@/base/helper/ImageCompression";

import { HomeContent } from '@/hooks/dashboard/super-admins/layout/home/lib/home'

export default function HomeLayout() {
    const [isLoading, setIsLoading] = useState(true)

    const [contents, setContents] = useState<HomeContent[]>([])

    const [selectedImage, setSelectedImage] = useState<File | null>(null)

    const [formData, setFormData] = useState<HomeContent>({
        title: '',
        description: '',
        button1: { text: '', link: '' },
        button2: { text: '', link: '' },
        imageUrl: ''
    })

    const [isEditing, setIsEditing] = useState(false)

    const [editingId, setEditingId] = useState<string | null>(null)

    const [isSubmitting, setIsSubmitting] = useState(false)

    const [deleteId, setDeleteId] = useState<string | null>(null)

    // Fetch data
    useEffect(() => {
        fetchContents()
    }, [])

    const fetchContents = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_HOME as string))
            const contentArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as HomeContent[]
            setContents(contentArray)
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching contents:', error)
            setIsLoading(false)
        }
    }

    // Handle image upload
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
                fileName: `home-content-${Date.now()}`,
                folder: "/home-contents",
            });

            return result.url;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Failed to upload image');
        }
    };

    // Create content
    const handleSubmit = async () => {
        try {
            setIsSubmitting(true)
            let imageUrl = formData.imageUrl
            if (selectedImage) {
                imageUrl = await handleImageUpload(selectedImage)
            }

            if (isEditing && editingId) {
                await handleUpdate(editingId, {
                    ...formData,
                    imageUrl: selectedImage ? imageUrl : formData.imageUrl
                })
                toast.success('Content updated successfully!')
            } else {
                await addDoc(collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_HOME as string), {
                    ...formData,
                    imageUrl,
                    createdAt: new Date()
                })
                toast.success('Content created successfully!')
            }

            // Reset form
            setIsEditing(false)
            setEditingId(null)
            setFormData({
                title: '',
                description: '',
                button1: { text: '', link: '' },
                button2: { text: '', link: '' },
                imageUrl: ''
            })
            setSelectedImage(null)
            fetchContents()

            // Safely close modal
            const modal = document.getElementById('content_modal') as HTMLDialogElement | null
            modal?.close()
        } catch (error) {
            console.error('Error submitting content:', error)
            toast.error('Failed to save content. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdate = async (id: string, updatedData: HomeContent) => {
        try {
            const docRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_HOME as string, id)
            await updateDoc(docRef, {
                ...updatedData,
                updatedAt: new Date()
            })
            fetchContents()
        } catch (error) {
            console.error('Error updating content:', error)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const docRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_HOME as string, id)
            await deleteDoc(docRef)
            fetchContents()
            toast.success('Content deleted successfully!')
            // Close the delete modal after successful deletion
            const deleteModal = document.getElementById('delete_modal') as HTMLDialogElement | null
            deleteModal?.close()
        } catch (error) {
            console.error('Error deleting content:', error)
            toast.error('Failed to delete content. Please try again.')
        }
    }

    const openModal = () => {
        const modal = document.getElementById('content_modal') as HTMLDialogElement | null
        modal?.showModal()
    }

    useEffect(() => {
        return () => {
            if (selectedImage) {
                URL.revokeObjectURL(URL.createObjectURL(selectedImage));
            }
        };
    }, [selectedImage]);

    if (isLoading) {
        return <HomeSkelaton />
    }

    return (
        <section className='min-h-full p-4 sm:p-6 lg:p-8'>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="space-y-2">
                    <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>Home</h1>
                    <p className='text-gray-600'>Manage your home page hero section</p>
                </div>

                <button
                    className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-lg"
                    onClick={openModal}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    {contents.length === 0 ? 'Create Content' : 'Edit Content'}
                </button>
            </div>

            {/* Hero Content Display */}
            {contents.length > 0 ? (
                <div className='w-full'>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Content Section */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                            <div className="space-y-6 max-w-xl">
                                <div className="space-y-4">
                                    <h2 className='text-3xl lg:text-4xl font-bold text-gray-900'>{contents[0].title}</h2>
                                    <p className='text-lg text-gray-600'>{contents[0].description}</p>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <a
                                        href={contents[0].button1.link}
                                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 text-center min-w-[160px]"
                                    >
                                        {contents[0].button1.text}
                                    </a>
                                    <a
                                        href={contents[0].button2.link}
                                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 text-center min-w-[160px]"
                                    >
                                        {contents[0].button2.text}
                                    </a>
                                </div>

                                <div className="flex gap-3 pt-6 border-t border-gray-100">
                                    <button
                                        onClick={() => {
                                            setDeleteId(contents[0].id!)
                                            const deleteModal = document.getElementById('delete_modal') as HTMLDialogElement | null
                                            deleteModal?.showModal()
                                        }}
                                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFormData(contents[0])
                                            setIsEditing(true)
                                            setEditingId(contents[0].id || null)
                                            openModal()
                                        }}
                                        className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Image Section */}
                        <div className="relative h-[300px] lg:h-full min-h-[400px]">
                            <Image
                                src={contents[0].imageUrl}
                                alt={contents[0].title}
                                width={500}
                                height={500}
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">No Content Yet</h3>
                        <p className="text-gray-600">Create your first hero section content to get started.</p>
                    </div>
                </div>
            )}

            {/* Update Modal Styling */}
            <dialog id="content_modal" className="modal">
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {isEditing ? 'Edit Content' : 'Create New Content'}
                                    </h3>
                                    <p className="text-sm text-gray-500">Fill in the information below to {isEditing ? 'update' : 'create'} your content</p>
                                </div>
                                <button
                                    onClick={() => {
                                        const modal = document.getElementById('content_modal') as HTMLDialogElement | null
                                        modal?.close()
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
                                {/* Basic Information Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column */}
                                    <div className="space-y-8">
                                        <div className="bg-gray-50/50 p-6 rounded-2xl space-y-6 border border-gray-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="p-2 bg-indigo-100 rounded-lg">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <h4 className="font-semibold text-gray-900">Basic Information</h4>
                                            </div>

                                            <div className="space-y-5">
                                                <div className="form-control">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                                        value={formData.title}
                                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                        placeholder="Enter title"
                                                    />
                                                </div>

                                                <div className="form-control">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                                                    <textarea
                                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] resize-y transition-all duration-200"
                                                        value={formData.description}
                                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                        placeholder="Enter description..."
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Button Configuration */}
                                        <div className="bg-gray-50/50 p-6 rounded-2xl space-y-6 border border-gray-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="p-2 bg-emerald-100 rounded-lg">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                    </svg>
                                                </div>
                                                <h4 className="font-semibold text-gray-900">Button Configuration</h4>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Primary Button */}
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Primary Button Text</label>
                                                        <input
                                                            type="text"
                                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                                            value={formData.button1.text}
                                                            onChange={(e) => setFormData({
                                                                ...formData,
                                                                button1: { ...formData.button1, text: e.target.value }
                                                            })}
                                                            placeholder="Enter button text"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Primary Button Link</label>
                                                        <input
                                                            type="text"
                                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                                            value={formData.button1.link}
                                                            onChange={(e) => setFormData({
                                                                ...formData,
                                                                button1: { ...formData.button1, link: e.target.value }
                                                            })}
                                                            placeholder="Enter button link"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Secondary Button */}
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Secondary Button Text</label>
                                                        <input
                                                            type="text"
                                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                                            value={formData.button2.text}
                                                            onChange={(e) => setFormData({
                                                                ...formData,
                                                                button2: { ...formData.button2, text: e.target.value }
                                                            })}
                                                            placeholder="Enter button text"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Secondary Button Link</label>
                                                        <input
                                                            type="text"
                                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                                            value={formData.button2.link}
                                                            onChange={(e) => setFormData({
                                                                ...formData,
                                                                button2: { ...formData.button2, link: e.target.value }
                                                            })}
                                                            placeholder="Enter button link"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-8">
                                        {/* Image Upload Section */}
                                        <div className="bg-gray-50/50 p-6 rounded-2xl space-y-6 border border-gray-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="p-2 bg-orange-100 rounded-lg">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <h4 className="font-semibold text-gray-900">Content Image</h4>
                                            </div>

                                            <div className="space-y-4">
                                                {/* Image Preview */}
                                                {(selectedImage || formData.imageUrl) && (
                                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
                                                        <Image
                                                            src={selectedImage ? URL.createObjectURL(selectedImage) : formData.imageUrl}
                                                            alt="Content preview"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}

                                                {/* Upload Input */}
                                                <div className="flex items-center justify-center w-full">
                                                    <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-xl border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                            </svg>
                                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    setSelectedImage(file);
                                                                }
                                                            }}
                                                            accept="image/*"
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md font-medium"
                                        disabled={isSubmitting}
                                        onClick={() => {
                                            setIsEditing(false)
                                            setEditingId(null)
                                            setFormData({
                                                title: '',
                                                description: '',
                                                button1: { text: '', link: '' },
                                                button2: { text: '', link: '' },
                                                imageUrl: ''
                                            })
                                            const modal = document.getElementById('content_modal') as HTMLDialogElement | null
                                            modal?.close()
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50 hover:shadow-indigo-100 hover:shadow-lg font-medium flex items-center gap-2"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                <span>Saving Changes...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>{isEditing ? 'Save Changes' : 'Create'}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </dialog>

            {/* Update Delete Modal Styling */}
            <dialog id="delete_modal" className="modal">
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this content? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                onClick={() => {
                                    const deleteModal = document.getElementById('delete_modal') as HTMLDialogElement | null
                                    deleteModal?.close()
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
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
