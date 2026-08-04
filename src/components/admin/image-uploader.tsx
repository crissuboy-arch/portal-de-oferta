"use client"

import { useState, useRef } from "react"
import { Upload, X, Link as LinkIcon, Eye } from "lucide-react"

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  label?: string
  allowedTypes?: string[]
  maxSize?: number // em bytes
}

export default function ImageUploader({
  value,
  onChange,
  label = "Imagem Principal",
  allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  maxSize = 5 * 1024 * 1024 // 5MB
}: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false)
  const [imageUrlInput, setImageUrlInput] = useState("")
  const [showUrlInput, setShowUrlInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      alert(`Tipo de arquivo não permitido. Tipos permitidos: ${allowedTypes.join(", ")}`)
      return
    }

    if (file.size > maxSize) {
      alert(`Arquivo muito grande. Tamanho máximo: ${maxSize / (1024 * 1024)}MB`)
      return
    }

    // Para desenvolvimento: usar URL local
    // Em produção, enviar para servidor e obter URL
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      onChange(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleUrlSubmit = () => {
    if (imageUrlInput.trim()) {
      onChange(imageUrlInput.trim())
      setImageUrlInput("")
      setShowUrlInput(false)
    }
  }

  const handleClearImage = () => {
    onChange("")
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      
      {value ? (
        <div className="relative">
          <div className="border-2 border-gray-700 rounded-lg overflow-hidden">
            <img
              src={value}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="absolute top-2 right-2 flex space-x-2">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-300 hover:text-white"
              title="Visualizar imagem"
            >
              <Eye className="h-4 w-4" />
            </a>
            <button
              onClick={handleClearImage}
              className="p-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
              title="Remover imagem"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 ${dragOver ? 'border-orange-500 bg-orange-500/10' : 'border-gray-700 border-dashed'} rounded-lg p-8 text-center transition-colors`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Arraste e solte uma imagem aqui</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Selecionar do computador
            </button>
            
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <LinkIcon className="h-4 w-4 inline mr-2" />
              Usar URL externa
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            Tipos permitidos: JPG, PNG, WebP • Máximo: 5MB
          </p>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={allowedTypes.join(",")}
        className="hidden"
      />

      {showUrlInput && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <LinkIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-300">URL da imagem</span>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleUrlSubmit}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
            >
              Usar
            </button>
            <button
              onClick={() => setShowUrlInput(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}