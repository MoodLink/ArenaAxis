import 'package:flutter/material.dart';
import 'package:mobile/models/sport_category.dart';

class SportCategoryItem extends StatefulWidget {
  final SportCategory category;
  final bool isSelected;
  final VoidCallback? onTap;
  final Size screenSize;

  const SportCategoryItem({
    Key? key,
    required this.category,
    this.isSelected = false,
    this.onTap,
    required this.screenSize,
  }) : super(key: key);

  @override
  State<SportCategoryItem> createState() => _SportCategoryItemState();
}

class _SportCategoryItemState extends State<SportCategoryItem>
    with SingleTickerProviderStateMixin {
  bool _isPressed = false;
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 150),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _handleTapDown(TapDownDetails details) {
    setState(() => _isPressed = true);
    _animationController.forward();
  }

  void _handleTapUp(TapUpDetails details) {
    setState(() => _isPressed = false);
    _animationController.reverse();
  }

  void _handleTapCancel() {
    setState(() => _isPressed = false);
    _animationController.reverse();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: _handleTapDown,
      onTapUp: _handleTapUp,
      onTapCancel: _handleTapCancel,
      onTap: widget.onTap,
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: Container(
          width: widget.screenSize.width * 0.19,
          margin: EdgeInsets.only(right: widget.screenSize.width * 0.032),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildIconContainer(),
              SizedBox(height: widget.screenSize.height * 0.01),
              _buildLabel(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildIconContainer() {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      curve: Curves.easeInOut,
      padding: EdgeInsets.all(widget.screenSize.width * 0.035),
      decoration: BoxDecoration(
        color: widget.isSelected
            ? widget.category.color
            : widget.category.color.withOpacity(0.12),
        borderRadius: BorderRadius.circular(18),
        boxShadow: widget.isSelected
            ? [
                BoxShadow(
                  color: widget.category.color.withOpacity(0.3),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ]
            : [],
      ),
      child: Icon(
        widget.category.icon,
        color: widget.isSelected ? Colors.white : widget.category.color,
        size: widget.screenSize.width * 0.068,
      ),
    );
  }

  Widget _buildLabel() {
    return Text(
      widget.category.name,
      style: TextStyle(
        fontSize: widget.screenSize.width * 0.03,
        fontWeight: widget.isSelected ? FontWeight.w600 : FontWeight.w500,
        color: widget.isSelected ? Colors.grey[900] : Colors.grey[600],
      ),
      textAlign: TextAlign.center,
      maxLines: 1,
      overflow: TextOverflow.ellipsis,
    );
  }
}