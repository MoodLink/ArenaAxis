// Trang chat - nơi người dùng trao đổi tin nhắn với nhau
"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import {
  Send,
  Loader,
  Search,
  Plus,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatMessage, WebSocketIncomingMessage, ChatRoom, WebSocketAckMessage } from "@/types"
import { useMessageSocket } from "@/hooks/use-message-socket"
import { useAuth } from "@/hooks/use-auth"
import { useConversations, useConversationMessages } from "@/hooks/use-message-api"
import { useGlobalNotifications } from "@/hooks/use-global-notifications"
import { useCurrentPage } from "@/hooks/use-current-page"

export default function ChatPage() {
  // Get query params
  const searchParams = useSearchParams()
  const ownerIdParam = searchParams.get('owner_id')
  const ownerNameParam = searchParams.get('owner_name')

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

  // Nếu có owner_id từ URL, use owner name làm search query
  // Backend API tìm substring, nên chỉ cần một phần của tên (ví dụ "Phương" hoặc "Bình")
  // Extract last name từ full name (ví dụ "Nguyễn Phương Bình" → "Bình")
  const getLastNameFromFullName = (fullName: string): string => {
    const parts = fullName.trim().split(' ')
    return parts[parts.length - 1] || fullName
  }

  // Determine receiver name filter for API
  // Only include filter if explicitly searching for owner or search query exists
  const receiverNameFilter = ownerNameParam
    ? getLastNameFromFullName(decodeURIComponent(ownerNameParam))
    : (searchQuery || undefined)  // Convert empty string to undefined


  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const [newChatRecipientId, setNewChatRecipientId] = useState("")
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)


  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const conversationsRef = useRef<any[]>([])
  // Ref để access refetch function
  const refetchConversationsRef = useRef<(() => void) | null>(null)

  const pendingMessagesRef = useRef<WebSocketIncomingMessage[]>([])

  const selectedConversationRef = useRef<ChatRoom | null>(null)

  // API Hooks - Load conversations
  // Khi có owner_id, tự động search theo owner name để load conversation
  const { conversations, loading: conversationsLoading, refetch: refetchConversations } = useConversations(
    currentUser?.id,
    receiverNameFilter,
    0,
    100  // Load more để chắc có conversation
  )

  // Log khi conversations thay đổi
  // QUAN TRỌNG: Auto-select conversation cho pending messages ngay khi conversations update
  useEffect(() => {
    console.log('📋 [Chat Page] Conversations updated:', {
      count: conversations.length,
      ownerNameParam: ownerNameParam ? decodeURIComponent(ownerNameParam) : null,
      receiverNameFilter: receiverNameFilter,
      ownerIdParam: ownerIdParam,
      hasOwner: !!ownerIdParam,
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
      console.log('🎯 [Conversations update] Have pending messages, auto-selecting conversation')
      const firstPendingMsg = pendingMessagesRef.current[0]

      let matchingConv = null
      if (firstPendingMsg && firstPendingMsg.type === 'message.receive') {
        const conversationId = firstPendingMsg.data.conversationId
        matchingConv = conversations.find((conv: any) => conv.id === conversationId)
      }

      if (matchingConv) {
        console.log('✅ [Conversations update] Auto-selecting conversation:', matchingConv.id)
        setSelectedConversation(matchingConv)
        selectedConversationRef.current = matchingConv
      }
    }
  }, [conversations, receiverNameFilter, ownerNameParam, selectedConversation])

  // API Hooks - Load messages của conversation
  // Chỉ fetch nếu conversation ID không phải là temporary ID (new-{timestamp})
  const shouldFetchMessages = selectedConversation?.id && !selectedConversation.id.startsWith('new-')
  const { messages: apiMessages, loading: messagesLoading, refetch: refetchMessages } = useConversationMessages(
    shouldFetchMessages ? selectedConversation?.id : undefined,
    0,
    10000  // Load tất cả messages thay vì chỉ 50
  )

  // Update messages khi load từ API
  useEffect(() => {
    console.log('📥 [useEffect] API messages loaded:', apiMessages.length)
    setMessages(apiMessages)
  }, [apiMessages])

  // Reset messages khi select conversation mới
  useEffect(() => {
    if (selectedConversation?.id.startsWith('new-')) {
      console.log('📝 [useEffect] New conversation created - resetting messages')
      setMessages([])
    }
  }, [selectedConversation?.id])

  // Update conversations ref
  useEffect(() => {
    conversationsRef.current = conversations || []
  }, [conversations])

  // Update refetch ref
  useEffect(() => {
    refetchConversationsRef.current = refetchConversations
  }, [refetchConversations])

  // Auto-update temporary conversation to real one when conversations loaded
  // This handles case when B enters chat for first time (temporary conv)
  // and then message arrives, triggering refetch
  useEffect(() => {
    if (selectedConversation?.id.startsWith('new-') && conversations.length > 0 && !conversationsLoading) {
      console.log('🔄 [useEffect] Have temporary conversation, checking for real one from API')
      console.log('   Temporary conv:', selectedConversation.id)
      console.log('   Conversations count:', conversations.length)

      // Find real conversation that matches temporary one
      // Look for conversation with same participants
      const realConv = conversations.find((conv: any) => {
        const tempParticipantIds = selectedConversation.participants?.map((p: any) => p.id).sort()
        const convParticipantIds = conv.participants?.map((p: any) => p.id).sort()
        return JSON.stringify(tempParticipantIds) === JSON.stringify(convParticipantIds)
      })

      if (realConv && realConv.id !== selectedConversation.id) {
        console.log('✅ [useEffect] Found real conversation, updating from temporary')
        console.log('   From:', selectedConversation.id)
        console.log('   To:', realConv.id)
        setSelectedConversation(realConv)
        selectedConversationRef.current = realConv
      }
    }
  }, [conversations, selectedConversation, conversationsLoading])

  // Update selectedConversation ref & save to sessionStorage for notification logic
  useEffect(() => {
    selectedConversationRef.current = selectedConversation

    // Save current conversation ID to sessionStorage để useCurrentPage hook có thể access
    if (selectedConversation?.id) {
      sessionStorage.setItem('currentChatConversationId', selectedConversation.id)
      console.log('💾 [Chat Page] Saved conversation to sessionStorage:', selectedConversation.id)
    } else {
      sessionStorage.removeItem('currentChatConversationId')
    }

    // Process pending messages when conversation is selected
    if (selectedConversation && pendingMessagesRef.current.length > 0) {
      console.log('📥 [useEffect] Processing pending messages:', pendingMessagesRef.current.length)

      const pendingForThisConv = pendingMessagesRef.current.filter(msg => {
        if (msg.type === 'message.receive') {
          return msg.data.conversationId === selectedConversation.id
        }
        return false
      })

      if (pendingForThisConv.length > 0) {
        console.log('   Converting pending messages:', pendingForThisConv.length)
        const convertedMessages: ChatMessage[] = pendingForThisConv.map(msg => {
          if (msg.type === 'message.receive') {
            return {
              id: `${Date.now()}-${Math.random()}`,
              conversationId: selectedConversation.id,
              senderId: msg.data.sender.id,
              content: msg.data.content,
              status: msg.data.status,
              timestamp: msg.data.timestamp
            }
          }
          return null as any
        }).filter(Boolean)

        setMessages(prev => [...prev, ...convertedMessages])

        // Remove processed messages from pending
        pendingMessagesRef.current = pendingMessagesRef.current.filter(msg => {
          if (msg.type === 'message.receive') {
            return msg.data.conversationId !== selectedConversation.id
          }
          return true
        })
      }
    }
  }, [selectedConversation])

  // Auto select conversation với owner khi có owner_id param
  // Trigger khi conversations được load từ API với receiverName filter
  useEffect(() => {
    if (ownerIdParam && currentUser) {
      console.log('🔍 [autoSelectConversation] Processing owner_id:', ownerIdParam)
      console.log('   Available conversations:', conversations.length)
      console.log('   Loading:', conversationsLoading)
      console.log('   Current selected conversation:', selectedConversation?.id)

      // Nếu đang load, chờ xong
      if (conversationsLoading) {
        console.log('⏳ [autoSelectConversation] Still loading conversations...')
        return
      }

      // Nếu có temporary conversation selected, cần update khi API trả về conversation thực
      if (selectedConversation?.id.startsWith('new-')) {
        console.log('📝 [autoSelectConversation] Have temporary conversation, checking for real one from API')
      }

      // Tìm conversation với owner
      const ownerConversation = conversations.find(conv => {
        console.log('  Checking conversation:', {
          id: conv.id,
          name: conv.name,
          participants: conv.participants?.map(p => ({ id: p.id, name: p.name }))
        })
        return conv.participants?.some(p => p.id === ownerIdParam)
      })

      if (ownerConversation) {
        console.log('✅ [autoSelectConversation] Found existing conversation with owner:', ownerIdParam)
        console.log('   Conversation:', { id: ownerConversation.id, name: ownerConversation.name })

        // Nếu có temporary conversation selected, update nó
        if (selectedConversation?.id.startsWith('new-')) {
          console.log('   Updating temporary conversation to real one')
        }
        setSelectedConversation(ownerConversation)
      } else {
        // Nếu không tìm thấy trong API results (có thể conversations rỗng hoặc không có match)
        // Tạo conversation mới nếu chưa có selected
        if (!selectedConversation) {
          console.log('📝 [autoSelectConversation] Creating new conversation with owner:', ownerIdParam)
          const now = new Date().toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
          const ownerName = ownerNameParam ? decodeURIComponent(ownerNameParam) : 'Unknown Owner'
          const newConversation: ChatRoom = {
            id: `new-${Date.now()}`,
            name: ownerName,
            lastMessage: null,
            lastMessageAt: now,
            createdAt: now,
            avatarUrl: null,
            seen: true,
            participants: [
              { id: currentUser.id, name: currentUser.name || 'You', email: '', avatarUrl: null },
              { id: ownerIdParam, name: ownerName, email: '', avatarUrl: null }
            ]
          }
          console.log('   New conversation created:', { id: newConversation.id, name: newConversation.name })
          setSelectedConversation(newConversation)
        }
      }
    }
  }, [ownerIdParam, ownerNameParam, conversations, selectedConversation, currentUser, conversationsLoading])

  // Handle nhận tin nhắn từ WebSocket
  const handleNewMessage = useCallback((wsMessage: WebSocketIncomingMessage | WebSocketAckMessage) => {
    console.log('🔔 [handleNewMessage] Received WebSocket message:', wsMessage)

    // Handle different message types
    if (wsMessage.type === 'message.receive') {
      // Incoming message from another user
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

      // Dùng ref để get selectedConversation hiện tại
      const currentSelectedConv = selectedConversationRef.current
      console.log('   Current selected conversation:', currentSelectedConv?.id)
      console.log('   🔍 COMPARISON:', {
        messageConvId: conversationId,
        selectedConvId: currentSelectedConv?.id,
        areEqual: currentSelectedConv?.id === conversationId,
        messageConvType: typeof conversationId,
        selectedConvType: typeof currentSelectedConv?.id
      })

      // Check if conversation matches
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
          id: `${Date.now()}`,
          conversationId: currentSelectedConv.id,
          senderId: senderId,
          content: incomingMsg.data.content,
          status: incomingMsg.data.status,
          timestamp: incomingMsg.data.timestamp
        }
        setMessages(prev => [...prev, newMessage])

        // Update local conversations state ngay (không chờ refetch)
        const timestamp = newMessage.timestamp
        console.log('⚡ Updating conversations list')

        // Cập nhật conversations list để sidebar update liền
        const updatedConversations = conversationsRef.current.map(conv => {
          if (conv.id === currentSelectedConv.id) {
            return {
              ...conv,
              lastMessage: {
                id: newMessage.id,
                senderId: newMessage.senderId,
                content: newMessage.content,
                status: newMessage.status,
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

        // Try to find conversation by ID
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
            id: `${Date.now()}`,
            conversationId: targetConv.id,
            senderId: senderId,
            content: incomingMsg.data.content,
            status: incomingMsg.data.status,
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
              id: `${Date.now()}`,
              conversationId: ackMsg.data.conversationId // Update với real conversationId
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
      console.log('WebSocket connection changed:', connected)
    }
  })

  // Auto scroll khi có messages mới
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  // Xử lý click vào conversation
  const handleSelectConversation = (conversation: ChatRoom) => {
    console.log('📌 [handleSelectConversation] Selected:', conversation.id)
    setSelectedConversation(conversation)
    // Không xóa messages - Hook sẽ tự động refetch khi conversationId thay đổi
    console.log('📌 [handleSelectConversation] Will auto-refetch messages...')

    // Thêm pending messages từ conversation này vào UI
    if (pendingMessagesRef.current.length > 0) {
      console.log('📌 [handleSelectConversation] Found pending messages:', pendingMessagesRef.current.length)

      const pendingForThisConv = pendingMessagesRef.current.filter(msg => {
        if (msg.type === 'message.receive') {
          return msg.data.conversationId === conversation.id
        }
        return false
      })

      if (pendingForThisConv.length > 0) {
        console.log('📌 [handleSelectConversation] Adding pending messages')
        const convertedMessages: ChatMessage[] = pendingForThisConv.map(msg => {
          if (msg.type === 'message.receive') {
            return {
              id: `${Date.now()}-${Math.random()}`,
              conversationId: conversation.id,
              senderId: msg.data.sender.id,
              content: msg.data.content,
              status: msg.data.status,
              timestamp: msg.data.timestamp
            }
          }
          return null as any
        }).filter(Boolean)
        setMessages(convertedMessages)

        // Remove pending messages từ ref
        pendingMessagesRef.current = pendingMessagesRef.current.filter(msg => {
          if (msg.type === 'message.receive') {
            return msg.data.conversationId !== conversation.id
          }
          return true
        })
      }
    }
  }

  // Xử lý tạo cuộc chat mới với user
  const handleStartNewChat = async () => {
    if (!newChatRecipientId.trim()) {
      alert('Vui lòng nhập ID hoặc email người nhận')
      return
    }

    setIsCreatingConversation(true)
    try {
      // Tạo mock conversation object
      // Trong thực tế, backend sẽ tạo conversation
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

      // Select conversation mới
      setSelectedConversation(newConversation)
      setIsNewChatOpen(false)
      setNewChatRecipientId('')
      setMessages([])

      console.log('✅ [handleStartNewChat] Created conversation with:', newChatRecipientId)
    } catch (error) {
      console.error('❌ Error creating conversation:', error)
      alert('Không thể tạo cuộc trò chuyện')
    } finally {
      setIsCreatingConversation(false)
    }
  }

  // Xử lý gửi tin nhắn
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

            // Set timeout để check nếu backend không response sau 5 giây
            setTimeout(() => {
              setMessages(prev => {
                const stillPending = prev.find(m => m.id === messageId && m.status === 'SEND')
                if (stillPending) {
                  console.warn('⚠️ No acknowledgment from backend after 5s - message may not be delivered')
                  console.log('⚠️ Possible issues:')
                  console.log('   1. Backend not responding')
                  console.log('   2. WebSocket connection dropped')
                  console.log('   3. Backend error processing message')
                  console.log('💡 Check backend logs for errors')
                }
                return prev
              })
            }, 5000)
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

  // Lọc conversations theo từ khóa tìm kiếm
  // Tìm kiếm theo: tên conversation, tên người nhận, hoặc nội dung tin cuối
  const filteredConversations = conversations.filter(conv => {
    // Lấy tên người nhận (không phải currentUser)
    const receiverName = conv.participants?.find(p => p.id !== currentUser?.id)?.name || conv.name

    // Tìm kiếm trong: tên conversation, tên người nhận, hoặc nội dung
    return (
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.lastMessage?.content || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  if (authLoading) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-semibold mb-4">Vui lòng đăng nhập</h2>
          <Button className="bg-green-600 hover:bg-green-700">
            Đi tới đăng nhập
          </Button>
        </div>
      </div>
    )
  }

  // Render giao diện chat Messenger style
  return (
    <div className="h-screen bg-gray-900 text-white flex">
      {/* Sidebar - Conversations List */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">💬 {currentUser.name}</h1>
            <button
              onClick={() => setIsNewChatOpen(true)}
              className="p-2 hover:bg-gray-700 rounded-full transition"
              title="New Chat"
            >
              <Plus className="w-5 h-5 text-green-500" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm tin nhắn hoặc người dùng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-full text-sm"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversationsLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="w-6 h-6 text-green-600 animate-spin" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-center p-4">
              <p>Chưa có cuộc hội thoại nào</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation)}
                className={`w-full p-3 text-left border-b border-gray-700 hover:bg-gray-700 transition ${selectedConversation?.id === conversation.id ? 'bg-gray-700' : ''
                  }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-green-600 rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                    {conversation.avatarUrl ? (
                      <img src={conversation.avatarUrl} alt={conversation.name} className="w-12 h-12 rounded-full" />
                    ) : (
                      conversation.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {/* Hiển thị tên người nhận (không phải currentUser) */}
                      {conversation.participants?.find(p => p.id !== currentUser?.id)?.name || conversation.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {conversation.lastMessage?.content || 'Chưa có tin nhắn'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {conversation.lastMessageAt || conversation.createdAt}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Connection Status */}
        <div className="p-4 border-t border-gray-700">
          <div className={`text-sm ${wsConnected ? 'text-green-400' : 'text-red-400'}`}>
            {wsConnected ? '🟢 Kết nối' : '🔴 Mất kết nối'}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 flex-shrink-0">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center font-bold text-white">
                {selectedConversation.avatarUrl ? (
                  <img src={selectedConversation.avatarUrl} alt={selectedConversation.name} className="w-10 h-10 rounded-full" />
                ) : (
                  selectedConversation.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {/* Hiển thị tên người nhận (không phải currentUser) */}
                  {selectedConversation.participants?.find(p => p.id !== currentUser?.id)?.name || selectedConversation.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {wsConnected ? '🟢 Online' : '🔴 Offline'}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50 min-h-0 pb-16"
            >
              {messagesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader className="w-6 h-6 text-green-600 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>Chưa có tin nhắn. Hãy bắt đầu cuộc hội thoại!</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isMe = message.senderId === currentUser?.id

                  return (
                    <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isMe
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                          }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-green-100' : 'text-gray-500'}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t-2 border-gray-300 p-8 flex-shrink-0 shadow-lg">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="flex-1 p-4 text-base bg-gray-100 border-2 border-gray-200 rounded-lg focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-400 text-gray-900 transition-all"
                  disabled={!wsConnected}
                />

                <Button
                  className="bg-green-600 hover:bg-green-700 active:bg-green-800 h-12 px-8 rounded-lg font-medium transition-all shadow-md"
                  disabled={!wsConnected || !inputMessage.trim()}
                  onClick={handleSendMessage}
                >
                  <Send className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          // Empty state
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-6xl mb-6">💬</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Chào mừng đến ArenaAxis Chat
              </h3>
              <p className="text-gray-600">
                {conversationsLoading ? 'Đang tải...' : 'Chọn một cuộc trò chuyện để bắt đầu'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {isNewChatOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Bắt đầu cuộc trò chuyện mới</h2>
              <button
                onClick={() => {
                  setIsNewChatOpen(false)
                  setNewChatRecipientId('')
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID hoặc Email người nhận
              </label>
              <input
                type="text"
                placeholder="Nhập ID hoặc email..."
                value={newChatRecipientId}
                onChange={(e) => setNewChatRecipientId(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isCreatingConversation) {
                    handleStartNewChat()
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                autoFocus
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsNewChatOpen(false)
                  setNewChatRecipientId('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleStartNewChat}
                disabled={isCreatingConversation || !newChatRecipientId.trim()}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isCreatingConversation ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    Đang tạo...
                  </div>
                ) : (
                  'Bắt đầu Chat'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
