"use client"

import { useState, useEffect } from "react";

import { createPortal } from 'react-dom';

import Image from "next/image";

import { motion } from "framer-motion";

import { FetchProject } from "@/components/ui/project/lib/FetchProject";

import ProjectSkelaton from "@/components/ui/project/ProjectSkelaton";

import { ProjectType, Framework } from "@/components/ui/project/lib/schema";

import { useRouter } from "next/navigation";

import toast, { Toaster } from 'react-hot-toast';

export default function Portfolio() {
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPausedLeft, setIsPausedLeft] = useState(false);
    const [isPausedRight, setIsPausedRight] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = FetchProject((newProjects) => {
            setProjects(newProjects);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <ProjectSkelaton />;
    }

    // Split projects into two specific ranges (1-5 and 6-10)
    const firstFive = [...projects.slice(0, 5), ...projects.slice(0, 5)];
    const secondFive = [...projects.slice(5, 10), ...projects.slice(5, 10)];

    const handleSeeMore = () => {
        router.push("/project");
    }

    return (
        <>
            <section className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                        <div className="text-left lg:order-2 space-y-8">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 tracking-tight leading-tight">
                                Teknologi, Efisiensi, dan Inovasi dalam Satu Solusi
                            </h2>
                            <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl">
                                Kami menghadirkan sebuah proyek yang menggabungkan teknologi canggih, desain modern, dan kemudahan akses dalam satu solusi. Dibangun dengan standar tinggi dan diciptakan untuk memberikan pengalaman yang seamless.
                            </p>
                            <button
                                onClick={handleSeeMore}
                                className="group relative inline-flex items-center justify-center px-8 py-3 font-medium tracking-wide text-white transition-all duration-300 bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 rounded-full hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
                            >
                                <span>Lihat lebih banyak</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>

                        <div className="lg:order-1">
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                {/* Left Column - Projects 6-10 Scrolling Down */}
                                <motion.div
                                    className="flex flex-col overflow-hidden rounded-3xl shadow-[0_0_40px_rgba(100,100,255,0.15)] backdrop-blur-sm bg-gradient-to-b from-gray-900/60 to-black/60 border border-gray-800/50"
                                    style={{ height: "600px", maxHeight: "70vh" }}
                                    onHoverStart={() => setIsPausedLeft(true)}
                                    onHoverEnd={() => setIsPausedLeft(false)}
                                >
                                    <motion.div
                                        className="flex flex-col gap-4 sm:gap-8 p-3 sm:p-4"
                                        initial={{ y: 0 }}
                                        animate={{ y: isPausedLeft ? "auto" : "-50%" }}
                                        transition={{
                                            y: {
                                                duration: 40,
                                                repeat: Infinity,
                                                repeatType: "mirror",
                                                ease: "linear",
                                            },
                                        }}
                                    >
                                        {secondFive.map((project, index) => (
                                            <ProjectCard key={`down-${project.title}-${index}`} project={project} />
                                        ))}
                                    </motion.div>
                                </motion.div>

                                {/* Right Column - Projects 1-5 Scrolling Up */}
                                <motion.div
                                    className="flex flex-col overflow-hidden rounded-3xl shadow-[0_0_40px_rgba(100,100,255,0.15)] backdrop-blur-sm bg-gradient-to-b from-gray-900/60 to-black/60 border border-gray-800/50"
                                    style={{ height: "600px", maxHeight: "70vh" }}
                                    onHoverStart={() => setIsPausedRight(true)}
                                    onHoverEnd={() => setIsPausedRight(false)}
                                >
                                    <motion.div
                                        className="flex flex-col gap-4 sm:gap-8 p-3 sm:p-4"
                                        initial={{ y: "-50%" }}
                                        animate={{ y: isPausedRight ? "auto" : "0%" }}
                                        transition={{
                                            y: {
                                                duration: 40,
                                                repeat: Infinity,
                                                repeatType: "mirror",
                                                ease: "linear",
                                            },
                                        }}
                                    >
                                        {firstFive.map((project, index) => (
                                            <ProjectCard key={`up-${project.title}-${index}`} project={project} />
                                        ))}
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

const ProjectCard = ({ project }: { project: ProjectType }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(project.linkPreview);
            setIsCopied(true);
            toast.success('URL copied to clipboard!', {
                style: {
                    background: '#333',
                    color: '#fff',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                },
                iconTheme: {
                    primary: '#4ade80',
                    secondary: '#333',
                },
            });
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy URL', {
                style: {
                    background: '#333',
                    color: '#fff',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                },
            });
        }
    };

    // Add useEffect to handle ESC key and body scroll
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsModalOpen(false);
            }
        };

        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
            // Add event listener for ESC key
            document.addEventListener('keydown', handleEsc);
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isModalOpen]);

    const modalContent = isModalOpen && createPortal(
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/95 backdrop-blur-md z-[9999] overflow-y-auto scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-gray-600/40"
                onClick={() => setIsModalOpen(false)}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="container mx-auto min-h-screen p-4 md:p-6 lg:p-8 flex items-center justify-center"
                    onClick={(e) => {
                        e.stopPropagation(); // Only stop propagation if clicking on the modal content
                        if (e.target === e.currentTarget) {
                            setIsModalOpen(false); // Close if clicking on the container padding
                        }
                    }}
                >
                    <div className="relative w-full max-w-7xl bg-gradient-to-b from-gray-900/80 to-black/80 rounded-2xl shadow-2xl border border-gray-800/50 backdrop-blur-xl">
                        {/* URL Bar */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800/50">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            </div>
                            <div className="flex-1 flex items-center gap-2">
                                <div className="flex-1 flex items-center px-4 py-1.5 bg-gray-900/50 rounded-lg border border-gray-700/50">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                                        </svg>
                                        <span className="opacity-75 truncate">{project.linkPreview}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCopyUrl}
                                    className="px-3 py-1.5 flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
                                >
                                    {isCopied ? (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                            </svg>
                                            <span>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-gray-600/40">
                            {/* Hero Image */}
                            <div className="relative aspect-video w-full overflow-hidden">
                                <Image
                                    src={project.imageUrl}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 1280px) 100vw, 1280px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                            </div>

                            {/* Gallery Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 md:p-6">
                                {project.images.map((image, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.02 }}
                                        className="relative aspect-video rounded-xl overflow-hidden group"
                                    >
                                        <Image
                                            src={image}
                                            alt={`${project.title} - ${index + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 320px"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Content Section with Glass Morphism */}
                            <div className="grid md:grid-cols-2 gap-6 md:gap-8 p-4 md:p-6 bg-gradient-to-b from-gray-900/60 to-black/60 backdrop-blur-md">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Author Info with Glass Effect */}
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/20 border border-gray-700/30 backdrop-blur-md">
                                        <Image
                                            src={project.author.photoURL}
                                            alt={project.author.name}
                                            width={56}
                                            height={56}
                                            className="rounded-full ring-2 ring-indigo-500/30"
                                        />
                                        <div>
                                            <h3 className="text-lg text-white font-medium">{project.author.name}</h3>
                                            <p className="text-sm text-gray-400 capitalize">{project.author.role}</p>
                                        </div>
                                    </div>

                                    {/* Description and Details with Enhanced Typography */}
                                    <div className="space-y-4 p-4 rounded-xl bg-gray-800/20 border border-gray-700/30">
                                        <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">Description</h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>

                                    <div className="space-y-4 p-4 rounded-xl bg-gray-800/20 border border-gray-700/30">
                                        <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                                            Details
                                        </h3>
                                        <div
                                            className="prose prose-invert prose-sm max-w-none
                                            prose-h1:text-2xl prose-h1:font-bold prose-h1:text-white prose-h1:mb-4
                                            prose-h3:text-lg prose-h3:font-semibold prose-h3:text-cyan-400 prose-h3:mt-6
                                            prose-p:text-gray-300 prose-p:leading-relaxed
                                            prose-strong:text-white
                                            prose-ol:mt-4 prose-ol:space-y-2
                                            prose-li:text-gray-300
                                            [&_li_strong]:text-cyan-400 text-gray-300 flex flex-col gap-2"
                                            dangerouslySetInnerHTML={{ __html: project.content }}
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Technologies with Modern Cards */}
                                    <div className="p-4 rounded-xl bg-gray-800/20 border border-gray-700/30">
                                        <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">Technologies</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {project.frameworks?.map((fw: Framework, index: number) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 bg-gray-800/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700/30 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105"
                                                >
                                                    <Image
                                                        src={fw.imageUrl}
                                                        alt={fw.title}
                                                        width={20}
                                                        height={20}
                                                        className="rounded-full"
                                                    />
                                                    <span className="text-gray-300 text-sm">{fw.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stats Grid with Glass Effect */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: "Downloads", value: project.downloads },
                                            { label: "Stock", value: project.stock },
                                            { label: "Sold", value: project.sold },
                                            { label: "Delivery", value: `${project.delivery} days` }
                                        ].map((stat, index) => (
                                            <div key={index} className="bg-gray-800/30 backdrop-blur-sm p-4 rounded-lg border border-gray-700/30 hover:border-indigo-500/30 transition-all duration-300">
                                                <p className="text-gray-400">{stat.label}</p>
                                                <p className="text-xl font-semibold text-white">{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* License Options with Enhanced Cards */}
                                    <div>
                                        {project.licenseDetails?.map((license, index) => (
                                            <div key={index} className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-xl p-5 mb-4 border border-gray-700/30 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
                                                <div className="flex flex-col space-y-4">
                                                    {/* Header Section */}
                                                    <div className="flex justify-between items-start">
                                                        <div className="space-y-1">
                                                            <h4 className="text-lg font-medium text-white capitalize">{license.title}</h4>
                                                            <p className="text-sm text-gray-400">{license.licenseTitle}</p>
                                                        </div>
                                                        <span className="px-4 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-medium text-sm">
                                                            {license.price === 0 ? "Free" : `Rp ${license.price.toLocaleString('id-ID')}`}
                                                        </span>
                                                    </div>

                                                    {/* Action Button */}
                                                    <div className="pt-2">
                                                        {license.price > 0 ? (
                                                            <button
                                                                onClick={() => {
                                                                    // Here you can add your Midtrans payment logic
                                                                    console.log('Initiating Midtrans payment for:', license.title);
                                                                }}
                                                                className="w-full inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-sm font-medium rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/25 focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
                                                            >
                                                                <span>Pay Now</span>
                                                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                                </svg>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    // Handle free download logic here
                                                                    console.log('Processing free download for:', license.title);
                                                                }}
                                                                className="w-full inline-flex items-center justify-center px-6 py-2.5 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
                                                            >
                                                                <span>Download</span>
                                                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#333',
                        color: '#fff',
                        zIndex: 10000, // Memastikan toast muncul di atas modal
                    }
                }}
            />
        </>,
        document.body
    );

    return (
        <>
            <motion.div
                className="relative w-full aspect-video md:aspect-[16/10] flex-shrink-0 overflow-hidden rounded-xl sm:rounded-2xl group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                }}
            >
                <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90 group-hover:via-black/40 group-hover:to-black/95 transition-all duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                            onClick={() => setIsModalOpen(true)}
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                        </svg>
                    </div>
                </div>
            </motion.div>
            {modalContent}
        </>
    );
};