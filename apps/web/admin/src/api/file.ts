import { createFileApi as createFileApiFactory } from '@vellastra/api-core'
import request from '@/utils/request'

const fileApi = createFileApiFactory(request)

/** 单文件上传 */
export function uploadFileApi(file: File | Blob, category: 'image' | 'doc' = 'image') {
  return fileApi.upload(file, category)
}

/** 分块上传初始化 */
export function initChunkUploadApi(data: { fileName: string; totalSize: number; totalChunks: number }) {
  return fileApi.initChunkUpload(data)
}

/** 上传分块 */
export function uploadChunkApi(uploadId: string, chunkIndex: number, chunk: Blob) {
  return fileApi.uploadChunk(uploadId, chunkIndex, chunk)
}

/** 合并分块 */
export function completeChunkUploadApi(uploadId: string, fileName: string) {
  return fileApi.completeChunkUpload(uploadId, fileName)
}

/** 取消分块上传 */
export function cancelChunkUploadApi(uploadId: string) {
  return fileApi.cancelChunkUpload(uploadId)
}
