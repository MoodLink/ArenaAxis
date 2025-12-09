"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MessageSquare } from "lucide-react"

export default function QuickContactBar() {
    return (

        <div className="container mx-auto px-4 py-3">
            <div className="flex justify-center gap-4">
                <Button variant="outline" size="sm" className="flex-1 max-w-40">
                    <Phone className="w-4 h-4 mr-2" />
                    Gọi ngay
                </Button>
                <Button variant="outline" size="sm" className="flex-1 max-w-40">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                </Button>
                <Button className="flex-1 max-w-40 bg-green-600 hover:bg-green-700" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                </Button>
            </div>
        </div>

    )
}