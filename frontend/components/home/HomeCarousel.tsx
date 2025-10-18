// Simple Carousel Wrapper for Home Page Sections
// Uses the existing Embla Carousel with simplified interface

"use client"

import { useState } from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi
} from "@/components/ui/carousel"

interface HomeCarouselProps {
    children: React.ReactNode[]
    itemsToShow?: number
    className?: string
    showNavigation?: boolean
}

export default function HomeCarousel({
    children,
    itemsToShow = 4,
    className = "",
    showNavigation = true
}: HomeCarouselProps) {
    const [api, setApi] = useState<CarouselApi>()

    // Generate responsive class based on itemsToShow
    const getResponsiveClass = (items: number) => {
        switch (items) {
            case 5:
                return "basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            case 4:
                return "basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            case 3:
                return "basis-full sm:basis-1/2 lg:basis-1/3"
            case 2:
                return "basis-full sm:basis-1/2"
            default:
                return "basis-full"
        }
    }

    return (
        <div className="relative">
            <Carousel
                setApi={setApi}
                opts={{
                    align: "start",
                    loop: false,
                    slidesToScroll: 1
                }}
                className={`w-full ${className}`}
            >
                <CarouselContent className="-ml-2 md:-ml-4">
                    {children.map((child, index) => (
                        <CarouselItem
                            key={index}
                            className={`pl-2 md:pl-4 ${getResponsiveClass(itemsToShow)}`}
                        >
                            {child}
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {showNavigation && children.length > itemsToShow && (
                    <>
                        <CarouselPrevious />
                        <CarouselNext />
                    </>
                )}
            </Carousel>
        </div>
    )
}