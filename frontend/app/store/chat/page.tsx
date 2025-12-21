"use client"

import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react'
import StoreLayout from '@/components/store/StoreLayout'
import { useAuth } from '@/hooks/use-auth'
import { useConversations } from '@/hooks/use-message-api'
import { useConversationMessages } from '@/hooks/use-message-api'
import { useMessageSocket } from '@/hooks/use-message-socket'
import { useGlobalNotifications } from '@/hooks/use-global-notifications'
import { useCurrentPage } from '@/hooks/use-current-page'
import { ChatMessage, ChatRoom } from '@/types'
import { WebSocketIncomingMessage, WebSocketAckMessage } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader, X, Send, Plus, Search } from 'lucide-react'

function StoreChatPageContent() {
    // Auth state
    const { user: currentUser, loading: authLoading } = useAuth()

    // Notification hooks
    const { notifyNewMessage } = useGlobalNotifications()
    const pageInfo = useCurrentPage()

    // Chat state
    const [selectedConversation, setSelectedConversation] = useState<ChatRoom | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [inputMessage, setInputMessage] = useState("")

    const [isNewChatOpen, setIsNewChatOpen] = useState(false)
    const [newChatRecipientId, setNewChatRecipientId] = useState("")
    const [isCreatingConversation, setIsCreatingConversation] = useState(false)

    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const conversationsRef = useRef<any[]>([])
    const refetchConversationsRef = useRef<(() => void) | null>(null)
    const pendingMessagesRef = useRef<WebSocketIncomingMessage[]>([])
    const selectedConversationRef = useRef<ChatRoom | null>(null)

    // API Hooks - Load conversations
    const { conversations, loading: conversationsLoading, refetch: refetchConversations } = useConversations(
        currentUser?.id,
        undefined,
        0,
        100
    )

    // API Hooks - Load messages
    const shouldFetchMessages = selectedConversation?.id && !selectedConversation.id.startsWith('new-')
    const { messages: apiMessages, loading: messagesLoading, refetch: refetchMessages } = useConversationMessages(
        shouldFetchMessages ? selectedConversation?.id : undefined,
        0,
        10000
    )

    // Update messages từ API
    useEffect(() => {
        console.log('📥 [Store Chat] API messages loaded:', apiMessages.length)
        setMessages(apiMessages)
    }, [apiMessages])

    // Reset messages khi select conversation mới
    useEffect(() => {
        if (selectedConversation?.id.startsWith('new-')) {
            console.log('📝 [Store Chat] New conversation created - resetting messages')
            setMessages([])
        }
    }, [selectedConversation?.id])

    // Log khi conversations thay đổi
    // QUAN TRỌNG: Auto-select conversation cho pending messages ngay khi conversations update
    useEffect(() => {
        console.log('📋 [Store Chat] Conversations updated:', {
            count: conversations.length,
            hasPendingMessages: pendingMessagesRef.current.length,
            conversations: conversations.map(c => ({
                id: c.id,
                name: c.name,
                participants: c.participants?.map(p => ({ id: p.id, name: p.name }))
            }))
        })

        // CRITICAL: Nếu có pending messages và conversations vừa được load, auto-select ngay
        if (
            pendingMessagesRef.current.length > 0 &&
            conversations.length > 0 &&
            !selectedConversation
        ) {
            console.log('🎯 [Store Chat] Have pending messages, auto-selecting conversation')
            const firstPendingMsg = pendingMessagesRef.current[0]

            let matchingConv = null
            if (firstPendingMsg && firstPendingMsg.type === 'message.receive') {
                const conversationId = firstPendingMsg.data.conversationId
                matchingConv = conversations.find((conv: any) => conv.id === conversationId)
            }

            if (matchingConv) {
                console.log('✅ [Store Chat] Auto-selecting conversation:', matchingConv.id)
                setSelectedConversation(matchingConv)
                selectedConversationRef.current = matchingConv
            }
        }
    }, [conversations, selectedConversation])

    // Update conversations ref
    useEffect(() => {
        conversationsRef.current = conversations || []
    }, [conversations])

    // Update refetch ref
    useEffect(() => {
        refetchConversationsRef.current = refetchConversations
    }, [refetchConversations])

    // Auto-update temporary conversation to real one when conversations loaded
    useEffect(() => {
        if (selectedConversation?.id.startsWith('new-') && conversations.length > 0 && !conversationsLoading) {
            console.log('🔄 [Store Chat] Have temporary conversation, checking for real one from API')
            console.log('   Temporary conv:', selectedConversation.id)
            console.log('   Conversations count:', conversations.length)

            // Find real conversation that matches temporary one
            const realConv = conversations.find((conv: any) => {
                const tempParticipantIds = selectedConversation.participants?.map((p: any) => p.id).sort()
                const convParticipantIds = conv.participants?.map((p: any) => p.id).sort()
                return JSON.stringify(tempParticipantIds) === JSON.stringify(convParticipantIds)
            })

            if (realConv && realConv.id !== selectedConversation.id) {
                console.log('✅ [Store Chat] Found real conversation, updating from temporary')
                console.log('   From:', selectedConversation.id)
                console.log('   To:', realConv.id)
                setSelectedConversation(realConv)
                selectedConversationRef.current = realConv
            }
        }
    }, [conversations, selectedConversation, conversationsLoading])

    // Update selectedConversation ref & save to sessionStorage
    useEffect(() => {
        selectedConversationRef.current = selectedConversation

        // Save current conversation ID to sessionStorage
        if (selectedConversation?.id) {
            sessionStorage.setItem('currentChatConversationId', selectedConversation.id)
            console.log('💾 [Store Chat] Saved conversation to sessionStorage:', selectedConversation.id)
        } else {
            sessionStorage.removeItem('currentChatConversationId')
        }

        if (selectedConversation && pendingMessagesRef.current.length > 0) {
            console.log('📥 [Store Chat] Processing pending messages:', pendingMessagesRef.current.length)

            const pendingForThisConv = pendingMessagesRef.current.filter(msg => {
                if (msg.type === 'message.receive') {
                    return msg.data.conversationId === selectedConversation.id
                }
                return false
            })

            if (pendingForThisConv.length > 0) {
                const newMessages = pendingForThisConv.map(msg => {
                    if (msg.type === 'message.receive') {
                        return {
                            id: `${Date.now()}-${Math.random()}`,
                            conversationId: msg.data.conversationId,
                            senderId: msg.data.sender.id,
                            content: msg.data.content,
                            status: 'RECEIVED',
                            timestamp: msg.data.timestamp
                        } as ChatMessage
                    }
                    return null
                }).filter((msg): msg is ChatMessage => msg !== null)

                setMessages(prev => [...prev, ...newMessages])
                pendingMessagesRef.current = pendingMessagesRef.current.filter(
                    msg => !pendingForThisConv.includes(msg)
                )
            }
        }
    }, [selectedConversation])

    // Handle nhận tin nhắn từ WebSocket
    const handleNewMessage = useCallback((wsMessage: WebSocketIncomingMessage | WebSocketAckMessage) => {
        console.log('🔔 [Store Chat] Received WebSocket message:', wsMessage)

        if (wsMessage.type === 'message.receive') {
            const incomingMsg = wsMessage as WebSocketIncomingMessage
            const senderId = incomingMsg.data.sender.id
            const conversationId = incomingMsg.data.conversationId

            console.log('📬 [message.receive] Incoming message:', {
                from: incomingMsg.data.sender.name,
                senderId: senderId,
                conversationId: conversationId,
                content: incomingMsg.data.content,
                timestamp: incomingMsg.data.timestamp
            })

            const currentSelectedConv = selectedConversationRef.current
            console.log('   Current selected conversation:', currentSelectedConv?.id)
            console.log('   🔍 COMPARISON:', {
                messageConvId: conversationId,
                selectedConvId: currentSelectedConv?.id,
                areEqual: currentSelectedConv?.id === conversationId
            })

            const isConvMatching = currentSelectedConv?.id === conversationId
            console.log('   Conversation match?', isConvMatching)

            // LOGIC THÔNG BÁO: LUÔN hiển thị thông báo khi có tin nhắn mới
            console.log('📢 [NOTIFICATION] Sending notification:', {
                isOnChatPage: pageInfo.isOnChatPage,
                isConvMatching: isConvMatching,
                senderName: incomingMsg.data.sender.name,
                content: incomingMsg.data.content
            })
            notifyNewMessage(
                incomingMsg.data.sender.name,
                senderId,
                incomingMsg.data.content,
                conversationId,
                incomingMsg.data.timestamp
            )

            // Nếu có conversation được select và khớp, thêm message
            if (currentSelectedConv && isConvMatching) {
                console.log('✅ Adding to current conversation')
                const newMessage: ChatMessage = {
                    id: `${Date.now()}-${Math.random()}`,
                    conversationId: currentSelectedConv.id,
                    senderId: senderId,
                    content: incomingMsg.data.content,
                    status: 'RECEIVED',
                    timestamp: incomingMsg.data.timestamp
                }
                setMessages(prev => [...prev, newMessage])

                // Update local conversations state ngay
                const timestamp = newMessage.timestamp
                console.log('⚡ Updating conversations list')

                const updatedConversations = conversationsRef.current.map(conv => {
                    if (conv.id === currentSelectedConv.id) {
                        return {
                            ...conv,
                            lastMessage: {
                                id: newMessage.id,
                                senderId: newMessage.senderId,
                                content: newMessage.content,
                                status: 'RECEIVED',
                                timestamp: timestamp,
                                conversationId: currentSelectedConv.id
                            },
                            lastMessageAt: timestamp
                        }
                    }
                    return conv
                })
                conversationsRef.current = updatedConversations

                // Refetch conversations để sync với backend
                if (refetchConversationsRef.current) {
                    console.log('🔄 Refetching conversations')
                    refetchConversationsRef.current()
                }
            } else {
                // Chưa select conversation hoặc conversation không khớp
                console.log('⚠️  Conversation not matched')
                console.log('   Current selected conv:', currentSelectedConv?.id)
                console.log('   Message conversation:', conversationId)

                console.log('🔍 [SEARCH] Looking for conversation:', {
                    targetConvId: conversationId,
                    availableConvIds: conversationsRef.current?.map((c: any) => c.id),
                    conversationsCount: conversationsRef.current?.length
                })
                let targetConv = conversationsRef.current?.find((conv: any) => conv.id === conversationId)

                if (!targetConv) {
                    console.log('   Not in ref, checking conversations state...')
                    console.log('   State conversations:', conversations?.map((c: any) => c.id))
                    targetConv = conversations?.find((conv: any) => conv.id === conversationId)
                }

                if (targetConv) {
                    console.log('✅ Found conversation by ID, auto-selecting')
                    setSelectedConversation(targetConv)
                    selectedConversationRef.current = targetConv

                    // Thêm message vào UI ngay
                    const newMessage: ChatMessage = {
                        id: `${Date.now()}-${Math.random()}`,
                        conversationId: targetConv.id,
                        senderId: senderId,
                        content: incomingMsg.data.content,
                        status: 'RECEIVED',
                        timestamp: incomingMsg.data.timestamp
                    }
                    setMessages(prev => [...prev, newMessage])
                } else {
                    // Không tìm thấy conversation - lưu vào pending
                    console.log('📝 No conversation found, saving to pending')
                    pendingMessagesRef.current.push(incomingMsg)

                    // Refetch conversations để load conversation mới
                    if (refetchConversationsRef.current) {
                        console.log('🔄 Refetching conversations to find/create conversation')
                        refetchConversationsRef.current()
                    }
                }
            }
        } else if (wsMessage.type === 'message.send.ack') {
            // Acknowledgment for our sent message
            const ackMsg = wsMessage as WebSocketAckMessage
            console.log('✅ [message.send.ack] Acknowledgment received:', {
                status: ackMsg.data.status,
                conversationId: ackMsg.data.conversationId,
                content: ackMsg.data.content,
                timestamp: ackMsg.data.timestamp
            })

            // CRITICAL: Nếu đang select temporary conversation, update thành real conversation ID
            const currentSelectedConv = selectedConversationRef.current
            if (currentSelectedConv?.id.startsWith('new-') && ackMsg.data.conversationId) {
                console.log('🔄 [message.send.ack] Updating temporary conversation to real one:', {
                    from: currentSelectedConv.id,
                    to: ackMsg.data.conversationId
                })

                // Update selected conversation với real ID
                const updatedConv = {
                    ...currentSelectedConv,
                    id: ackMsg.data.conversationId
                }
                setSelectedConversation(updatedConv)
                selectedConversationRef.current = updatedConv

                // Update tất cả messages trong state với conversationId mới
                setMessages(prev =>
                    prev.map(msg => ({
                        ...msg,
                        conversationId: ackMsg.data.conversationId
                    }))
                )

                // Refetch conversations để load conversation mới từ backend
                if (refetchConversationsRef.current) {
                    console.log('🔄 Refetching conversations after conversation creation')
                    refetchConversationsRef.current()
                }
            }

            // Update message status from SEND to RECEIVED
            setMessages(prev =>
                prev.map(msg => {
                    if (msg.id.startsWith('temp-') && msg.content === ackMsg.data.content) {
                        console.log('📤 Updated message status to:', ackMsg.data.status)
                        return {
                            ...msg,
                            status: ackMsg.data.status as any,
                            id: `${Date.now()}-${Math.random()}`,
                            conversationId: ackMsg.data.conversationId
                        }
                    }
                    return msg
                })
            )
        }
    }, [currentUser?.id, conversations])

    // WebSocket Hook
    const { isConnected: wsConnected, sendMessage: wsSendMessage } = useMessageSocket({
        userId: currentUser?.id,
        onMessageReceived: handleNewMessage,
        onConnectionChange: (connected) => {
            console.log('[Store Chat] WebSocket connection changed:', connected)
        }
    })

    // Auto scroll
    useEffect(() => {
        if (messagesContainerRef.current) {
            // Scroll area viewport
            const viewport = messagesContainerRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight
            } else {
                // Fallback for direct scroll
                messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
            }
        }
    }, [messages])

    // Handle select conversation
    const handleSelectConversation = (conversation: ChatRoom) => {
        console.log('📌 [Store Chat] Selected conversation:', conversation.id)
        setSelectedConversation(conversation)

        // Thêm pending messages từ conversation này vào UI
        if (pendingMessagesRef.current.length > 0) {
            const pendingForThisConv = pendingMessagesRef.current.filter(msg => {
                if (msg.type === 'message.receive') {
                    return msg.data.conversationId === conversation.id
                }
                return false
            })

            if (pendingForThisConv.length > 0) {
                const newMessages = pendingForThisConv.map(msg => {
                    if (msg.type === 'message.receive') {
                        return {
                            id: `${Date.now()}-${Math.random()}`,
                            conversationId: msg.data.conversationId,
                            senderId: msg.data.sender.id,
                            content: msg.data.content,
                            status: 'RECEIVED',
                            timestamp: msg.data.timestamp
                        } as ChatMessage
                    }
                    return null
                }).filter((msg): msg is ChatMessage => msg !== null)

                setMessages(prev => [...prev, ...newMessages])
                pendingMessagesRef.current = pendingMessagesRef.current.filter(
                    msg => !pendingForThisConv.includes(msg)
                )
            }
        }
    }

    // Handle tạo chat mới
    const handleStartNewChat = async () => {
        if (!newChatRecipientId.trim()) {
            alert('Vui lòng nhập ID hoặc email người nhận')
            return
        }

        setIsCreatingConversation(true)
        try {
            const now = new Date().toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })

            const newConversation: ChatRoom = {
                id: `new-${Date.now()}`,
                name: newChatRecipientId,
                lastMessage: null,
                lastMessageAt: now,
                createdAt: now,
                avatarUrl: null,
                seen: true,
                participants: [
                    { id: currentUser?.id || '', name: currentUser?.name || 'You', email: '', avatarUrl: null },
                    { id: newChatRecipientId, name: newChatRecipientId, email: '', avatarUrl: null }
                ]
            }

            setSelectedConversation(newConversation)
            setIsNewChatOpen(false)
            setNewChatRecipientId('')
            setMessages([])

            console.log('✅ [Store Chat] Created new conversation with:', newChatRecipientId)
        } catch (error) {
            console.error('❌ Error creating conversation:', error)
            alert('Không thể tạo cuộc trò chuyện')
        } finally {
            setIsCreatingConversation(false)
        }
    }

    // Handle gửi message
    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return
        if (!currentUser) return
        if (!selectedConversation) {
            console.warn('❌ No conversation selected')
            return
        }

        const messageContent = inputMessage.trim()
        const conversationId = selectedConversation.id
        setInputMessage("")

        try {
            const messageId = `temp-${Date.now()}`
            const optimisticMessage: ChatMessage = {
                id: messageId,
                conversationId: conversationId,
                senderId: currentUser.id,
                content: messageContent,
                status: 'SEND',
                timestamp: new Date().toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })
            }

            console.log('📤 [handleSendMessage] Sending via WebSocket:', {
                userId: currentUser.id,
                content: messageContent,
                conversationId: conversationId,
                conversationIdType: typeof conversationId,
                wsConnected: wsConnected,
                selectedConversation: {
                    id: selectedConversation.id,
                    name: selectedConversation.name,
                    participants: selectedConversation.participants?.map(p => ({ id: p.id, name: p.name }))
                }
            })

            setMessages(prev => [...prev, optimisticMessage])

            if (wsConnected && !conversationId.startsWith('new-')) {
                const receiver = selectedConversation.participants?.find(p => p.id !== currentUser.id)
                if (receiver) {
                    console.log('🔌 [WebSocket] Sending to receiverId:', {
                        receiverId: receiver.id,
                        receiverName: receiver.name,
                        conversationId: conversationId,
                        content: messageContent
                    })

                    const wsSuccess = wsSendMessage(receiver.id, messageContent, conversationId)

                    if (wsSuccess) {
                        console.log('✅ [WebSocket] Message sent successfully, waiting for backend acknowledgment...')
                    } else {
                        console.error('❌ [WebSocket] Failed to send message via WebSocket')
                    }
                } else {
                    console.error('❌ [WebSocket] No receiver found in conversation')
                }
            } else if (!wsConnected) {
                console.warn('❌ WebSocket not connected, cannot send message')
            }
        } catch (error) {
            console.error('❌ Error sending message:', error)
        }
    }

    // Filter conversations
    const filteredConversations = conversations
        .filter((conv, index, self) => {
            // Dedup: chỉ giữ conversation đầu tiên nếu có duplicate cùng ID
            return index === self.findIndex(c => c.id === conv.id)
        })
        .filter(conv => {
            const receiverName = conv.participants?.find(p => p.id !== currentUser?.id)?.name || conv.name

            return (
                conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                receiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (conv.lastMessage?.content || '').toLowerCase().includes(searchQuery.toLowerCase())
            )
        })

    if (authLoading) {
        return (
            <StoreLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            </StoreLayout>
        )
    }

    if (!currentUser) {
        return (
            <StoreLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-600">Vui lòng đăng nhập để sử dụng chat</p>
                </div>
            </StoreLayout>
        )
    }

    return (
        <StoreLayout>
            <div className="flex gap-4 bg-gray-50 h-[calc(100vh-100px)]">
                {/* Sidebar - Conversations List */}
                <div className="w-80 bg-white border border-gray-200 rounded-lg flex flex-col shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Chat</h2>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsNewChatOpen(true)}
                                className="h-8 w-8 p-0"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                            <Input
                                placeholder="Tìm kiếm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-gray-50 border-gray-200"
                            />
                        </div>
                    </div>

                    {/* Conversations List */}
                    <ScrollArea className="flex-1 w-full overflow-hidden">
                        <div className="p-2 space-y-2 pr-4">
                            {conversationsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader className="h-4 w-4 animate-spin text-blue-600" />
                                </div>
                            ) : filteredConversations.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 text-sm">
                                    Không có cuộc trò chuyện nào
                                </div>
                            ) : (
                                filteredConversations.map((conv) => {
                                    // Lấy tên người nhận (không phải currentUser)
                                    const receiverName = conv.participants?.find(p => p.id !== currentUser?.id)?.name || conv.name

                                    return (
                                        <button
                                            key={conv.id}
                                            onClick={() => handleSelectConversation(conv)}
                                            className={`w-full text-left p-3 rounded-lg transition-colors ${selectedConversation?.id === conv.id
                                                ? 'bg-blue-50 border border-blue-200'
                                                : 'hover:bg-gray-50 border border-transparent'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={conv.avatarUrl || undefined} />
                                                    <AvatarFallback>
                                                        {(receiverName?.substring(0, 2) || '?').toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 truncate text-sm">{receiverName}</p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {conv.lastMessage?.content || 'Không có tin nhắn'}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 bg-white border border-gray-200 rounded-lg flex flex-col shadow-sm overflow-hidden">
                    {selectedConversation ? (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={selectedConversation.avatarUrl || undefined} />
                                        <AvatarFallback>
                                            {((selectedConversation.participants?.find(p => p.id !== currentUser?.id)?.name || selectedConversation.name)?.substring(0, 2) || '?').toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{selectedConversation.participants?.find(p => p.id !== currentUser?.id)?.name || selectedConversation.name}</h3>
                                        <p className="text-xs text-gray-500">
                                            {wsConnected ? 'Đang hoạt động' : 'Ngoại tuyến'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <ScrollArea ref={messagesContainerRef} className="flex-1 overflow-hidden">
                                <div className="p-4 space-y-4">
                                    {messagesLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader className="h-4 w-4 animate-spin text-blue-600" />
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500 text-sm">
                                            Bắt đầu cuộc trò chuyện
                                        </div>
                                    ) : (
                                        messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-xs px-4 py-2 rounded-lg ${msg.senderId === currentUser?.id
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-200 text-gray-900'
                                                        }`}
                                                >
                                                    <p className="text-sm break-words">{msg.content}</p>
                                                    <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>

                            {/* Input */}
                            <div className="p-4 border-t border-gray-200 flex gap-2">
                                <Input
                                    placeholder="Nhập tin nhắn..."
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault()
                                            handleSendMessage()
                                        }
                                    }}
                                    className="flex-1"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!inputMessage.trim() || !wsConnected}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <p className="text-lg font-semibold">Chọn cuộc trò chuyện</p>
                                <p className="text-sm">hoặc tạo một cuộc chat mới</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* New Chat Modal */}
                {isNewChatOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Chat Mới</h3>
                                <button
                                    onClick={() => setIsNewChatOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ID hoặc Email người nhận
                                    </label>
                                    <Input
                                        placeholder="Nhập ID hoặc email..."
                                        value={newChatRecipientId}
                                        onChange={(e) => setNewChatRecipientId(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleStartNewChat()
                                            }
                                        }}
                                    />
                                </div>

                                <div className="flex gap-2 justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsNewChatOpen(false)}
                                        disabled={isCreatingConversation}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        onClick={handleStartNewChat}
                                        disabled={!newChatRecipientId.trim() || isCreatingConversation}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        {isCreatingConversation ? (
                                            <>
                                                <Loader className="h-4 w-4 animate-spin mr-2" />
                                                Đang tạo...
                                            </>
                                        ) : (
                                            'Tạo Chat'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </StoreLayout>
    )
}

export default function StoreChatPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <StoreChatPageContent />
        </Suspense>
    )
}
