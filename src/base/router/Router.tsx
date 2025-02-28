import React, { Fragment } from 'react'

import Home from '@/components/ui/home/Home'

import Featured from '@/components/ui/featured/Featured'

import Service from "@/components/ui/service/Service"

import Project from "@/components/ui/project/Project"

export default function Router() {
    return (
        <Fragment>
            <Home />
            <Featured />
            <Service />
            <Project />
        </Fragment>
    )
}
