'use client'

import React, { useEffect, useState } from 'react'

import Image from 'next/image'

import signInImage from '@/base/assets/auth/bg.jpg'

import Link from 'next/link'

import googleIcon from '@/base/assets/auth/google.png'

import githubIcon from "@/base/assets/auth/github.svg"

import dotImg from "@/base/assets/auth/dot.png"

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { signInSchema, type SignInFormData } from '@/components/auth/lib/auth'

import { useAuth } from '@/utils/context/AuthContext'

export default function SignInContent() {
    const { login, loginWithGoogle, loginWithGithub, showInactiveModal, setShowInactiveModal } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    // Add useEffect to handle body scroll
    useEffect(() => {
        if (showInactiveModal) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [showInactiveModal])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    })

    const onSubmit = async (data: SignInFormData) => {
        try {
            setIsLoading(true)
            await login(data.email, data.password)
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true)
            await loginWithGoogle()
        } finally {
            setIsLoading(false)
        }
    }

    const handleGithubSignIn = async () => {
        try {
            setIsLoading(true)
            await loginWithGithub()
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <section className='min-h-screen flex items-center justify-center p-4 relative overflow-hidden'>
                {/* Background pattern */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#2563eb33_1px,transparent_1px),linear-gradient(to_bottom,#2563eb33_1px,transparent_1px)] bg-[size:24rem_24rem] [mask:linear-gradient(to_right,white,transparent_20%,transparent_80%,white)]"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#2563eb33_1px,transparent_1px),linear-gradient(to_bottom,#2563eb33_1px,transparent_1px)] bg-[size:6rem_6rem] [mask:linear-gradient(to_right,white,transparent_20%,transparent_80%,white)]"></div>
                </div>

                <div className='w-full container relative z-10'>
                    {/* Add Back to Home link outside the form */}
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2 px-4 py-2 rounded-full text-gray-600 hover:text-primary bg-white/90 hover:bg-gray-100 transition-all duration-300 mb-4"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
                        >
                            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                        </svg>
                        Back to Home
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
                        {/* Left side - Image */}
                        <div className="relative h-[400px] lg:h-[700px]">
                            <Image
                                src={signInImage}
                                alt='sign in image'
                                className='w-full h-full object-cover'
                                priority
                            />

                            <div className='absolute bottom-0 left-0 w-full p-6 lg:p-10'>
                                <div className='text-white bg-black/30 backdrop-blur-md p-6 rounded-xl flex flex-col items-center justify-center gap-4'>
                                    <h3 className='text-2xl lg:text-3xl font-semibold mb-2'>Welcome to the space digitalia</h3>
                                    <p className='text-gray-100'>Login to explore</p>
                                    <Image src={dotImg} alt='dot image' className='w-20 lg:w-24 object-contain mt-4' />
                                </div>
                            </div>
                        </div>

                        {/* Right side - Form */}
                        <div className='flex items-center justify-center p-6 lg:p-12'>
                            <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-md space-y-8'>
                                <div>
                                    <h2 className='text-3xl lg:text-4xl font-bold text-gray-900'>Login your account!</h2>
                                </div>

                                <div className='space-y-6'>
                                    <div className='flex gap-4 border-b border-gray-200'>
                                        <Link
                                            href="/auth/signin"
                                            className={`flex-1 py-4 font-medium text-center ${true ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/auth/signup"
                                            className={`flex-1 py-4 font-medium text-center text-gray-500 hover:text-gray-700`}
                                        >
                                            Sign Up
                                        </Link>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="relative block">
                                            <span className="absolute inset-y-0 left-4 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400">
                                                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                                                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                                                </svg>
                                            </span>
                                            <input
                                                {...register('email')}
                                                type="email"
                                                className={`w-full pl-12 pr-4 py-4 bg-white border-2 rounded-xl outline-none transition-all
                                                    ${errors.email
                                                        ? 'border-red-300 focus:border-red-500'
                                                        : 'border-gray-100 focus:border-primary'
                                                    }`}
                                                placeholder="Email"
                                            />
                                        </label>
                                        {errors.email && (
                                            <div className="flex items-center gap-1 px-1">
                                                <div className="w-1 h-1 rounded-full bg-red-500"></div>
                                                <span className="text-sm text-red-500">
                                                    {errors.email.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="relative block">
                                            <span className="absolute inset-y-0 left-4 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400">
                                                    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                            <input
                                                {...register('password')}
                                                type="password"
                                                className={`w-full pl-12 pr-4 py-4 bg-white border-2 rounded-xl outline-none transition-all
                                                    ${errors.password
                                                        ? 'border-red-300 focus:border-red-500'
                                                        : 'border-gray-100 focus:border-primary'
                                                    }`}
                                                placeholder="Password"
                                            />
                                        </label>
                                        {errors.password && (
                                            <div className="flex items-center gap-1 px-1">
                                                <div className="w-1 h-1 rounded-full bg-red-500"></div>
                                                <span className="text-sm text-red-500">
                                                    {errors.password.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className='flex justify-end'>
                                        <Link href='/auth/forgot-password' className='text-sm text-primary hover:text-primary/80 font-medium'>
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>

                                <button
                                    disabled={isLoading}
                                    className="w-full py-4 bg-primary hover:bg-primary/90 text-white text-lg font-medium rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Loading...' : 'Continue'}
                                </button>

                                <div className='space-y-6'>
                                    <div className='relative text-center'>
                                        <div className='absolute inset-0 flex items-center'>
                                            <div className='w-full border-t border-gray-200'></div>
                                        </div>
                                        <span className='relative inline-block px-4 bg-white text-sm text-gray-500'>
                                            Sign in With
                                        </span>
                                    </div>

                                    <div className='flex justify-center gap-4'>
                                        <button
                                            type="button"
                                            onClick={handleGithubSignIn}
                                            className='p-3 hover:bg-gray-50 rounded-lg transition-colors'
                                        >
                                            <Image src={githubIcon} alt='github icon' className='w-6 h-6' />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleGoogleSignIn}
                                            className='p-3 hover:bg-gray-50 rounded-lg transition-colors'
                                        >
                                            <Image src={googleIcon} alt='google icon' className='w-6 h-6' />
                                        </button>
                                    </div>

                                    <div className='text-center text-gray-500'>
                                        Don&apos;t have an account? {' '}
                                        <Link href="/auth/sign-up" className='text-primary hover:text-primary/80 font-medium'>
                                            Sign up
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Inactive Account Modal */}
            {showInactiveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] transition-all">
                    <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl max-w-md w-full mx-auto shadow-2xl border border-white/20 transform transition-all duration-300 scale-100 animate-fade-in">
                        <div className="flex flex-col items-center text-center">
                            {/* Modern Warning Icon with Soft Glow */}
                            <div className="w-20 h-20 bg-gradient-to-tl from-amber-50 to-amber-100 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-amber-100/50 relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-200/20 to-transparent rounded-3xl"></div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-10 h-10 text-amber-500 relative z-10"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                            </div>

                            {/* Modern Title with Gradient */}
                            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4">
                                Account Inactive
                            </h3>

                            {/* Description with better typography */}
                            <p className="text-gray-600 mb-8 text-base leading-relaxed max-w-sm">
                                Your account is currently inactive. Please contact our support team for assistance in reactivating your account.
                            </p>

                            {/* Modern Contact Options */}
                            <div className="flex flex-col w-full gap-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-100"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-4 bg-white text-sm text-gray-500 font-medium">
                                            Contact Support Via
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Link
                                        href="mailto:spacedigitalia@gmail.com"
                                        className="group relative overflow-hidden rounded-2xl border border-gray-100 p-4 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative flex flex-col items-center gap-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors duration-300"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors duration-300">Email</span>
                                        </div>
                                    </Link>

                                    <Link
                                        href="https://wa.me/6281398632939?text=Hello%20Admin,%20I%20need%20help%20with%20my%20inactive%20account."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative overflow-hidden rounded-2xl border border-gray-100 p-4 hover:border-green-600/20 hover:shadow-lg hover:shadow-green-600/5 transition-all duration-300"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative flex flex-col items-center gap-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-6 h-6 text-gray-400 group-hover:text-green-600 transition-colors duration-300"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors duration-300">WhatsApp</span>
                                        </div>
                                    </Link>
                                </div>

                                <button
                                    onClick={() => setShowInactiveModal(false)}
                                    className="relative w-full py-4 bg-gradient-to-r from-primary to-primary/90 text-white font-medium rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-full duration-700 transition-all"></div>
                                    <div className="relative flex items-center justify-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span>Close Message</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
