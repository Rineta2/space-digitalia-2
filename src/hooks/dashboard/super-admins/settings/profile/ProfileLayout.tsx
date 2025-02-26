"use client"

import React, { useState, useEffect } from 'react';

import { toast } from 'react-hot-toast';

import { useAuth } from '@/utils/context/AuthContext';

import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

import { db } from '@/utils/firebase';

import Image from 'next/image';

import imagekitInstance from '@/utils/imagekit';

import { compressImage } from '@/base/helper/ImageCompression';

import { format } from 'date-fns';

import { id } from 'date-fns/locale';

import ProfileSkelaton from '@/hooks/dashboard/super-admins/settings/profile/ProjectSkelaton';

import { UserAccount } from "@/utils/context/interface/Auth";

import { FiUser } from 'react-icons/fi';

type TimestampType = {
    seconds: number;
    nanoseconds: number;
} | Date | null;

export default function ProfileContent() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserAccount | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState<UserAccount | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user?.uid) return;

            try {
                const userRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    setProfile(userSnap.data() as UserAccount);
                } else {
                    setError('User profile not found');
                }
            } catch {
                setError('Error fetching profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [user?.uid]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedProfile(profile);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedProfile(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedProfile(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.uid || !editedProfile) return;

        setIsSaving(true);
        try {
            const userRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, user.uid);
            const updateData = {
                displayName: editedProfile.displayName,
                email: editedProfile.email,
                photoURL: editedProfile.photoURL,
                phoneNumber: editedProfile.phoneNumber,
                updatedAt: serverTimestamp()
            };
            await updateDoc(userRef, updateData);
            setProfile(editedProfile);
            setIsEditing(false);
            toast.success('Profil berhasil diperbarui');
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile');
            toast.error('Gagal memperbarui profil');
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0] || !user?.uid) return;

        setUploadingImage(true);
        try {
            // Compress the image first
            const compressedImage = await compressImage(e.target.files[0]);

            // Convert to base64
            const reader = new FileReader();
            reader.readAsDataURL(compressedImage);

            reader.onload = async () => {
                const base64Image = reader.result as string;

                // Upload to ImageKit
                const uploadResponse = await imagekitInstance.upload({
                    file: base64Image,
                    fileName: `profile-${user.uid}-${Date.now()}`,
                    folder: '/profile-images'
                });

                // Update profile with new image URL
                const userRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, user.uid);
                await updateDoc(userRef, {
                    photoURL: uploadResponse.url
                });

                // Update local state
                setProfile(prev => prev ? { ...prev, photoURL: uploadResponse.url } : null);
                if (editedProfile) {
                    setEditedProfile({ ...editedProfile, photoURL: uploadResponse.url });
                }
                toast.success('Foto profil berhasil diperbarui');
            };
        } catch (err) {
            console.error('Error uploading image:', err);
            setError('Failed to upload image');
            toast.error('Gagal mengupload foto');
        } finally {
            setUploadingImage(false);
        }
    };

    const formatTimestamp = (timestamp: TimestampType) => {
        if (!timestamp) return '-';

        // Handle Firestore Timestamp
        if ('seconds' in timestamp) {
            return format(new Date(timestamp.seconds * 1000), 'dd MMMM yyyy, HH:mm:ss', { locale: id });
        }

        // Handle Date object
        if (timestamp instanceof Date) {
            return format(timestamp, 'dd MMMM yyyy, HH:mm:ss', { locale: id });
        }

        return '-';
    };

    if (loading) {
        return <ProfileSkelaton />;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!profile) {
        return <div>No profile data available</div>;
    }

    return (
        <section className="py-2 md:py-10 min-h-screen">
            <div className="container">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                            Profil Saya
                        </h1>
                        <p className="text-sm text-gray-600">
                            Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun
                        </p>
                    </div>

                    {!isEditing && (
                        <button
                            onClick={handleEdit}
                            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-xl 
                            hover:bg-blue-700 transition-all duration-300 font-medium shadow-sm 
                            hover:shadow-blue-100 hover:shadow-lg active:transform active:scale-95"
                        >
                            Edit Profil
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 p-6 sm:p-8">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left side - Profile Image */}
                            <div className="flex flex-col items-center space-y-6 order-1 lg:order-2">
                                <div className="relative w-40 h-40 sm:w-48 sm:h-48 group">
                                    {profile.photoURL ? (
                                        <Image
                                            src={profile.photoURL}
                                            alt="Profile"
                                            width={500}
                                            height={500}
                                            className="rounded-3xl object-cover shadow-lg w-full h-full 
                                            transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-3xl bg-slate-100 flex items-center justify-center 
                                        shadow-lg transition-transform duration-300 group-hover:scale-105">
                                            <FiUser className="w-20 h-20 text-slate-500" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-center w-full">
                                    {isEditing && (
                                        <>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="profile-image-upload"
                                                disabled={uploadingImage}
                                            />
                                            <label
                                                htmlFor="profile-image-upload"
                                                className="inline-block cursor-pointer px-6 py-2.5 bg-gray-50 text-gray-700 
                                                rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium 
                                                border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md
                                                active:transform active:scale-95"
                                            >
                                                {uploadingImage ? 'Mengupload...' : 'Ubah Foto'}
                                            </label>
                                        </>
                                    )}
                                    <p className="text-sm text-gray-500 mt-3">
                                        Ukuran gambar: maks. 1 MB
                                        <br />
                                        Format gambar: JPEG, PNG
                                    </p>
                                </div>
                            </div>

                            {/* Right side - Form Fields */}
                            <div className="lg:col-span-2 order-2 lg:order-1">
                                <div className="space-y-6">
                                    {/* Form fields */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 sm:items-center p-4 
                                    hover:bg-gray-50 rounded-2xl transition-colors duration-200">
                                        <label className="text-sm font-medium text-gray-700">Nama</label>
                                        <div className="sm:col-span-2">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="displayName"
                                                    value={editedProfile?.displayName || ''}
                                                    onChange={handleChange}
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 
                                                    focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                    hover:border-blue-400"
                                                />
                                            ) : (
                                                <p className="text-gray-800 font-medium">{profile.displayName}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 sm:items-center p-4 
                                    hover:bg-gray-50 rounded-2xl transition-colors duration-200">
                                        <label className="text-sm font-medium text-gray-700">Email</label>
                                        <div className="sm:col-span-2">
                                            <p className="text-gray-800">{profile.email}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 sm:items-center p-4 
                                    hover:bg-gray-50 rounded-2xl transition-colors duration-200">
                                        <label className="text-sm font-medium text-gray-700">Nomor Telepon</label>
                                        <div className="sm:col-span-2">
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    name="phoneNumber"
                                                    value={editedProfile?.phoneNumber || ''}
                                                    onChange={handleChange}
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 
                                                    focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                                                    hover:border-blue-400"
                                                    placeholder="Contoh: 08123456789"
                                                />
                                            ) : (
                                                <p className="text-gray-800">{profile.phoneNumber || '-'}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 sm:items-center p-4 
                                    hover:bg-gray-50 rounded-2xl transition-colors duration-200">
                                        <label className="text-sm font-medium text-gray-700">Member Sejak</label>
                                        <div className="sm:col-span-2">
                                            <p className="text-gray-800">{formatTimestamp(profile.createdAt)}</p>
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 
                                                transition-all duration-300 font-medium active:transform active:scale-95"
                                                disabled={isSaving}
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 
                                                transition-all duration-300 font-medium shadow-sm hover:shadow-lg
                                                hover:shadow-blue-100 active:transform active:scale-95"
                                                disabled={isSaving}
                                            >
                                                {isSaving ? 'Menyimpan...' : 'Simpan'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}