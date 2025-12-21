/**
 * Image Compression and Validation Utility
 * Handles image compression, validation, and formatting before upload
 */

export interface ImageCompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0-100, default 80
    maxSizeKB?: number; // Maximum file size in KB
}

export interface CompressionResult {
    file: File;
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
}

const DEFAULT_OPTIONS: ImageCompressionOptions = {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 80,
    maxSizeKB: 2048, // 2MB
};

/**
 * Compress a single image file
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Compressed file and compression stats
 */
export async function compressImage(
    file: File,
    options: ImageCompressionOptions = {}
): Promise<CompressionResult> {
    const config = { ...DEFAULT_OPTIONS, ...options };

    // Validate file type
    if (!isValidImageFormat(file.type)) {
        throw new Error(`Định dạng file không được hỗ trợ: ${file.type}. Vui lòng chọn JPG, PNG, hoặc WebP.`);
    }

    const originalSize = file.size;

    // If file is already small enough, no need to compress
    if (originalSize <= config.maxSizeKB! * 1024) {
        console.log(`⏭️  File ${file.name} is already small (${(originalSize / 1024).toFixed(1)}KB), skipping compression`);
        return {
            file,
            originalSize,
            compressedSize: originalSize,
            compressionRatio: 0,
        };
    }

    try {
        // Create canvas and compress
        const canvas = await createCanvasFromFile(file, config.maxWidth, config.maxHeight);
        const compressedFile = await canvasToFile(canvas, file.name, config.quality, file.type);
        const compressedSize = compressedFile.size;

        const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);

        console.log(`✅ Image compressed: ${file.name}`);
        console.log(`   Original: ${(originalSize / 1024).toFixed(1)}KB`);
        console.log(`   Compressed: ${(compressedSize / 1024).toFixed(1)}KB`);
        console.log(`   Ratio: ${ratio}%`);

        return {
            file: compressedFile,
            originalSize,
            compressedSize,
            compressionRatio: parseFloat(ratio),
        };
    } catch (error) {
        console.error(`❌ Compression failed for ${file.name}:`, error);
        throw new Error(`Lỗi nén ảnh ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Compress multiple images
 * @param files - Array of image files
 * @param options - Compression options
 * @returns Array of compressed files and compression stats
 */
export async function compressImages(
    files: File[],
    options: ImageCompressionOptions = {}
): Promise<CompressionResult[]> {
    const results: CompressionResult[] = [];

    for (const file of files) {
        try {
            const result = await compressImage(file, options);
            results.push(result);
        } catch (error) {
            console.error(`Failed to compress ${file.name}:`, error);
            // Continue with next file instead of throwing
            results.push({
                file,
                originalSize: file.size,
                compressedSize: file.size,
                compressionRatio: 0,
            });
        }
    }

    return results;
}

/**
 * Validate image before processing
 * @param file - The file to validate
 * @param maxSizeKB - Maximum file size in KB
 * @returns True if valid, throws error otherwise
 */
export function validateImage(file: File, maxSizeKB: number = 10): boolean {
    // Check file type
    if (!isValidImageFormat(file.type)) {
        throw new Error(`Định dạng file không được hỗ trợ: ${file.type}`);
    }

    // Check file size (initial validation)
    const fileSizeKB = file.size / 1024;
    if (fileSizeKB > maxSizeKB) {
        throw new Error(`File ${file.name} quá lớn (${fileSizeKB.toFixed(1)}KB). Tối đa ${maxSizeKB}MB.`);
    }

    return true;
}

/**
 * Check if file format is a valid image
 */
function isValidImageFormat(mimeType: string): boolean {
    const validFormats = ['image/jpeg', 'image/png', 'image/webp'];
    return validFormats.includes(mimeType.toLowerCase());
}

/**
 * Create a canvas from an image file and resize if needed
 */
function createCanvasFromFile(
    file: File,
    maxWidth?: number,
    maxHeight?: number
): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions while maintaining aspect ratio
                if (maxWidth && width > maxWidth) {
                    const ratio = maxWidth / width;
                    width = maxWidth;
                    height = height * ratio;
                }

                if (maxHeight && height > maxHeight) {
                    const ratio = maxHeight / height;
                    height = maxHeight;
                    width = width * ratio;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Cannot get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas);
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };

            img.src = e.target?.result as string;
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Convert canvas to File object
 */
function canvasToFile(
    canvas: HTMLCanvasElement,
    fileName: string,
    quality: number = 80,
    mimeType: string = 'image/jpeg'
): Promise<File> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error('Canvas to Blob conversion failed'));
                    return;
                }

                // Get file extension
                let extension = 'jpg';
                if (mimeType.includes('png')) {
                    extension = 'png';
                } else if (mimeType.includes('webp')) {
                    extension = 'webp';
                }

                // Create new filename with compression indicator
                const baseName = fileName.replace(/\.[^/.]+$/, '');
                const newFileName = `${baseName}_compressed.${extension}`;

                const file = new File([blob], newFileName, { type: mimeType });
                resolve(file);
            },
            mimeType,
            quality / 100 // Convert 0-100 to 0-1 range
        );
    });
}

/**
 * Get image dimensions without loading into memory
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };

            img.src = e.target?.result as string;
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
