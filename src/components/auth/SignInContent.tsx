'use client'

import React from 'react'

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

import { useState } from 'react'

export default function SignInContent() {
    const { login, loginWithGoogle } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

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
        } catch (error) {
            console.error('Login error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true)
            await loginWithGoogle()
        } catch (error) {
            console.error('Google sign in error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
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
                                        onClick={() => { }} // TODO: Implement GitHub login if needed
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
    )
}
