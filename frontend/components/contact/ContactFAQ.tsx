"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, Search } from "lucide-react"
import { faqData } from "@/data/mockData"

export default function ContactFAQ() {
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

    const categories = [
        { id: "all", name: "Tất cả", count: faqData.length },
        { id: "booking", name: "Đặt sân", count: faqData.filter(faq => faq.category === "booking").length },
        { id: "payment", name: "Thanh toán", count: faqData.filter(faq => faq.category === "payment").length },
        { id: "account", name: "Tài khoản", count: faqData.filter(faq => faq.category === "account").length },
        { id: "general", name: "Chung", count: faqData.filter(faq => faq.category === "general").length }
    ]

    const filteredFaqs = faqData.filter(faq => {
        const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const toggleExpanded = (id: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Câu hỏi thường gặp</CardTitle>
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Tìm kiếm câu hỏi..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                variant={selectedCategory === category.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(category.id)}
                                className="h-8"
                            >
                                {category.name}
                                <Badge variant="secondary" className="ml-2 text-xs">
                                    {category.count}
                                </Badge>
                            </Button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {filteredFaqs.map((faq) => (
                        <div key={faq.id} className="border rounded-lg">
                            <button
                                className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                                onClick={() => toggleExpanded(faq.id)}
                            >
                                <span className="font-medium">{faq.question}</span>
                                {expandedItems[faq.id] ? (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                            {expandedItems[faq.id] && (
                                <div className="px-4 pb-4 text-gray-600 border-t bg-gray-50">
                                    <p className="pt-4">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {filteredFaqs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p>Không tìm thấy câu hỏi nào phù hợp.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}