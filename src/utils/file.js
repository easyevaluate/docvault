
// Format file size
export const formatFileSize = (size) => {
    if (!size) return "";
    return size >= 1024 * 1024
        ? (size / (1024 * 1024)).toFixed(2) + " MB"
        : (size / 1024).toFixed(2) + " KB";
};


// is file a image
export const isImage = (file) => {
    return file && file.mimetype && file.mimetype.startsWith("image/");
};
