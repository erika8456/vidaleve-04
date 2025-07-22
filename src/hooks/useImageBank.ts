import { useState, useEffect, useCallback } from 'react'

interface StoredImage {
  id: string
  name: string
  size: number
  url: string
  timestamp: number
}

export function useImageBank() {
  const [images, setImages] = useState<StoredImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load images from localStorage on mount
  useEffect(() => {
    try {
      const storedImages = localStorage.getItem('uploadedImages')
      if (storedImages) {
        const parsedImages = JSON.parse(storedImages)
        setImages(parsedImages)
      }
    } catch (error) {
      console.error('Error loading images from localStorage:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Add a new image to the bank
  const addImage = useCallback((image: Omit<StoredImage, 'timestamp'>) => {
    const newImage: StoredImage = {
      ...image,
      timestamp: Date.now()
    }

    const updatedImages = [...images, newImage]
    setImages(updatedImages)
    localStorage.setItem('uploadedImages', JSON.stringify(updatedImages))
  }, [images])

  // Remove an image from the bank
  const removeImage = useCallback((imageId: string) => {
    const imageToRemove = images.find(img => img.id === imageId)
    if (imageToRemove && imageToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url)
    }

    const updatedImages = images.filter(img => img.id !== imageId)
    setImages(updatedImages)
    localStorage.setItem('uploadedImages', JSON.stringify(updatedImages))
  }, [images])

  // Clear all images
  const clearAllImages = useCallback(() => {
    // Revoke all blob URLs
    images.forEach(image => {
      if (image.url.startsWith('blob:')) {
        URL.revokeObjectURL(image.url)
      }
    })

    setImages([])
    localStorage.removeItem('uploadedImages')
  }, [images])

  // Get an image by ID
  const getImage = useCallback((imageId: string) => {
    return images.find(img => img.id === imageId)
  }, [images])

  // Get all images sorted by timestamp (newest first)
  const getSortedImages = useCallback(() => {
    return [...images].sort((a, b) => b.timestamp - a.timestamp)
  }, [images])

  // Calculate total storage used
  const getTotalSize = useCallback(() => {
    return images.reduce((total, image) => total + image.size, 0)
  }, [images])

  // Format bytes to human readable
  const formatSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }, [])

  return {
    images: getSortedImages(),
    isLoading,
    addImage,
    removeImage,
    clearAllImages,
    getImage,
    totalSize: getTotalSize(),
    formatSize,
    count: images.length
  }
}