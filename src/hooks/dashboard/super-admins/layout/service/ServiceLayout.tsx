"use client"

import React, { useState, useEffect } from 'react';

import { useServiceData } from '@/hooks/dashboard/super-admins/layout/service/lib/FetchService';

import { ContentModal } from '@/hooks/dashboard/super-admins/layout/service/content/ContentModal';

import { DeleteModal } from '@/hooks/dashboard/super-admins/layout/service/content/DeleteModal';

import FeaturedSkelaton from '@/hooks/dashboard/super-admins/layout/featured/FeaturedSkelaton';

import { ServiceFormData } from '@/hooks/dashboard/super-admins/layout/service/lib/service';

import Image from 'next/image';

import { initialFormData } from '@/hooks/dashboard/super-admins/layout/service/lib/service';

export default function ServiceLayout() {
    const {
        isLoading,
        contents,
        isSubmitting,
        createContent,
        updateContent,
        deleteContent,
        fetchContents
    } = useServiceData();

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedProfileImage, setSelectedProfileImage] = useState<File | null>(null);
    const [formData, setFormData] = useState<ServiceFormData>(initialFormData);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Fetch data on mount
    useEffect(() => {
        fetchContents();
    }, [fetchContents]);

    useEffect(() => {
        return () => {
            if (selectedImage) {
                URL.revokeObjectURL(URL.createObjectURL(selectedImage));
            }
        };
    }, [selectedImage]);

    const handleSubmit = async () => {
        const success = isEditing && editingId
            ? await updateContent(editingId, formData, selectedImage, selectedProfileImage)
            : await createContent(formData, selectedImage, selectedProfileImage);

        if (success) {
            resetForm();
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData(initialFormData);
        setSelectedImage(null);
        setSelectedProfileImage(null);
        const modal = document.getElementById('content_modal') as HTMLDialogElement | null;
        modal?.close();
    };

    const handleDelete = async () => {
        if (deleteId) {
            await deleteContent(deleteId);
            setDeleteId(null);
            const deleteModal = document.getElementById('delete_modal') as HTMLDialogElement | null;
            deleteModal?.close();
        }
    };

    const openModal = () => {
        const modal = document.getElementById('content_modal') as HTMLDialogElement | null;
        modal?.showModal();
    };

    if (isLoading) {
        return <FeaturedSkelaton />;
    }

    return (
        <section className='min-h-full py-0 px-0 sm:py-4 sm:px-4'>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="space-y-2">
                    <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>Featured</h1>
                    <p className='text-gray-600'>Manage your featured section content</p>
                </div>

                <button
                    className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-lg"
                    onClick={openModal}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Create Content
                </button>
            </div>

            {/* Featured Content Display */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {contents.map((content) => (
                    <div
                        key={content.id}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                    >
                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                            <Image
                                src={content.imageUrl}
                                alt={content.title}
                                fill
                                className="object-cover transform hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="p-5 space-y-3">
                            <h2 className="text-xl font-semibold text-gray-800 line-clamp-1">{content.title}</h2>
                            <p className="text-gray-600 text-sm line-clamp-2">{content.description}</p>
                            <div className="pt-3 flex justify-end gap-2">
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setEditingId(content.id || null);
                                        setFormData({
                                            title: content.title,
                                            description: content.description,
                                            imageUrl: content.imageUrl,
                                            profile: content.profile
                                        });
                                        openModal();
                                    }}
                                    className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        setDeleteId(content.id || null);
                                        const deleteModal = document.getElementById('delete_modal') as HTMLDialogElement | null;
                                        deleteModal?.showModal();
                                    }}
                                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Modal */}
            <ContentModal
                isEditing={isEditing}
                formData={formData}
                setFormData={setFormData}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                selectedProfileImage={selectedProfileImage}
                setSelectedProfileImage={setSelectedProfileImage}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                onClose={resetForm}
            />

            {/* Delete Modal */}
            <DeleteModal
                onConfirm={handleDelete}
                onClose={() => setDeleteId(null)}
            />
        </section>
    );
}