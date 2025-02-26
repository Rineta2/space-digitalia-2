import React from 'react'

import { Metadata } from 'next'

import ProjectLayout from "@/hooks/dashboard/super-admins/project/project/ProjectLayout"

export const metadata: Metadata = {
    title: 'Security | SPACE DIGITALIA',
    description: 'Security Page for Super Admin',
}

export default function Security() {
    return (
        <ProjectLayout />
    )
}

