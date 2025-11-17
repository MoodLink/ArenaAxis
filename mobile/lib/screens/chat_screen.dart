import 'package:flutter/material.dart';

const String _currentUserId = 'me';

class ChatScreen extends StatefulWidget {
  final String conversationId;
  final String conversationTitle;

  const ChatScreen({
    super.key,
    required this.conversationId,
    required this.conversationTitle,
  });

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  final List<_ChatMessage> _messages = [
    _ChatMessage(id: '1', senderId: 'store_1', text: 'Xin chào! Bạn cần hỗ trợ gì?', time: DateTime.now().subtract(const Duration(minutes: 9))),
    _ChatMessage(id: '2', senderId: _currentUserId, text: 'Tôi muốn đặt sân vào tối nay.', time: DateTime.now().subtract(const Duration(minutes: 7))),
    _ChatMessage(id: '3', senderId: 'store_1', text: 'Vâng, sân 1 còn trống khung 18:30 - 20:00.', time: DateTime.now().subtract(const Duration(minutes: 5))),
  ];

  @override
  void dispose() {
    _textController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _sendMessage() {
    final text = _textController.text.trim();
    if (text.isEmpty) return;
    final msg = _ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      senderId: _currentUserId,
      text: text,
      time: DateTime.now(),
    );
    setState(() {
      _messages.add(msg);
    });
    _textController.clear();
    _scrollToBottom();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_scrollController.hasClients) return;
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent + 80,
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeOut,
      );
    });
  }

  String _timeLabel(DateTime t) {
    final hh = t.hour.toString().padLeft(2, '0');
    final mm = t.minute.toString().padLeft(2, '0');
    return '$hh:$mm';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.conversationTitle),
        centerTitle: false,
        elevation: 1,
        actions: [
          IconButton(icon: const Icon(Icons.info_outline), onPressed: () {}),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // messages
            Expanded(
              child: ListView.builder(
                controller: _scrollController,
                padding: const EdgeInsets.symmetric(vertical: 12),
                itemCount: _messages.length,
                itemBuilder: (context, i) {
                  final m = _messages[i];
                  final isMe = m.senderId == _currentUserId;
                  final align = isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start;
                  final bg = isMe ? theme.colorScheme.primary : theme.cardColor;
                  final textColor = isMe ? theme.colorScheme.onPrimary : theme.colorScheme.onSurface;
                  final radius = BorderRadius.only(
                    topLeft: const Radius.circular(12),
                    topRight: const Radius.circular(12),
                    bottomLeft: Radius.circular(isMe ? 12 : 2),
                    bottomRight: Radius.circular(isMe ? 2 : 12),
                  );

                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    child: Column(
                      crossAxisAlignment: align,
                      children: [
                        Row(
                          mainAxisAlignment: isMe ? MainAxisAlignment.end : MainAxisAlignment.start,
                          children: [
                            if (!isMe)
                              CircleAvatar(
                                radius: 14,
                                backgroundColor: isDark ? Colors.grey[700] : Colors.grey[300],
                                child: const Icon(Icons.person, size: 16, color: Colors.white),
                              ),
                            if (!isMe) const SizedBox(width: 8),
                            Flexible(
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                                decoration: BoxDecoration(
                                  color: bg,
                                  borderRadius: radius,
                                  boxShadow: [
                                    BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 4),
                                  ],
                                ),
                                child: Text(m.text, style: TextStyle(color: textColor, fontSize: 15)),
                              ),
                            ),
                            if (isMe) const SizedBox(width: 8),
                            if (isMe)
                              CircleAvatar(
                                radius: 14,
                                backgroundColor: theme.colorScheme.primary,
                                child: const Icon(Icons.person, size: 16, color: Colors.white),
                              ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Padding(
                          padding: EdgeInsets.only(left: isMe ? 0 : 46, right: isMe ? 46 : 0),
                          child: Text(
                            _timeLabel(m.time),
                            style: TextStyle(fontSize: 11, color: theme.textTheme.bodySmall?.color?.withOpacity(0.6)),
                          ),
                        )
                      ],
                    ),
                  );
                },
              ),
            ),

            // composer
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
              decoration: BoxDecoration(
                color: theme.scaffoldBackgroundColor,
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 6)],
              ),
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.add),
                    onPressed: () {},
                  ),
                  Expanded(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxHeight: 120),
                      child: TextField(
                        controller: _textController,
                        textInputAction: TextInputAction.send,
                        minLines: 1,
                        maxLines: 5,
                        onSubmitted: (_) => _sendMessage(),
                        decoration: InputDecoration(
                          hintText: 'Nhắn tin...',
                          filled: true,
                          fillColor: theme.cardColor,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(24),
                            borderSide: BorderSide.none,
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: _sendMessage,
                    child: CircleAvatar(
                      radius: 22,
                      backgroundColor: theme.colorScheme.primary,
                      child: const Icon(Icons.send, color: Colors.white),
                    ),
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ChatMessage {
  final String id;
  final String senderId;
  final String text;
  final DateTime time;
  _ChatMessage({
    required this.id,
    required this.senderId,
    required this.text,
    required this.time,
  });
}