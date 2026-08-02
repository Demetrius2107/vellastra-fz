import type { AxiosInstance } from 'axios'

/** 文件管理 API（file 服务） */
export function createFileApi(request: AxiosInstance) {
  return {
    /** 单文件上传 */
    upload(file: File | Blob, category: 'image' | 'doc' = 'image') {
      const formData = new FormData()
      formData.append('file', file)
      return request.post('/api/file/upload', formData, {
        params: { category },
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },

    /** 分块上传初始化 */
    initChunkUpload(data: { fileName: string; totalSize: number; totalChunks: number }) {
      return request.post('/api/file/upload/init', null, { params: data })
    },

    /** 上传分块 */
    uploadChunk(uploadId: string, chunkIndex: number, chunk: Blob) {
      const formData = new FormData()
      formData.append('chunk', chunk)
      return request.post('/api/file/upload/chunk', formData, {
        params: { uploadId, chunkIndex },
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },

    /** 合并分块 */
    completeChunkUpload(uploadId: string, fileName: string) {
      return request.post('/api/file/upload/complete', null, { params: { uploadId, fileName } })
    },

    /** 取消分块上传 */
    cancelChunkUpload(uploadId: string) {
      return request.post('/api/file/upload/cancel', null, { params: { uploadId } })
    }
  }
}
