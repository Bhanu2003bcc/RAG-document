import { useCallback, useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { documentService } from '../../services/documentService'
import toast from 'react-hot-toast'

interface Props { onUploaded: () => void }

export default function UploadZone({ onUploaded }: Props) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const upload = async (file: File) => {
    setUploading(true)
    setProgress(0)
    try {
      await documentService.upload(file, setProgress)
      toast.success(`${file.name} uploaded! Processing started.`)
      onUploaded()
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }, [])

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) upload(file)
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragging ? 'border-blue-400 bg-blue-400/10' : 'border-slate-600 hover:border-slate-500'}`}>
      {uploading ? (
        <div className="space-y-3">
          <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto" />
          <p className="text-slate-300">Uploading...</p>
          <div className="w-48 mx-auto bg-slate-700 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-slate-500">{progress}%</p>
        </div>
      ) : (
        <>
          <Upload className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-300 font-medium mb-1">Drop a file here</p>
          <p className="text-sm text-slate-500 mb-4">PDF, DOCX, PPTX, TXT supported · Max 50MB</p>
          <label className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white transition-colors">
            Choose File
            <input type="file" className="hidden" accept=".pdf,.docx,.pptx,.txt,.html" onChange={onFileInput} />
          </label>
        </>
      )}
    </div>
  )
}
