import { randomUUID } from 'crypto'
import { writeFile } from 'fs/promises'

type FileFromTypeBufferReturn = Promise<ReturnType<Awaited<typeof import('file-type')>['fromBuffer']>>
const fileTypeFromBuffer = async (buffer: Buffer): FileFromTypeBufferReturn => {
  const { fromBuffer } = await import('file-type')
  const fileType = await fromBuffer(buffer)
  return fileType
}

export async function uploadFile (buffer: Buffer | null): Promise<string | null> {
  if (buffer == null) return null
  const idForImage = randomUUID()
  const fileType = await fileTypeFromBuffer(buffer)
  if (fileType == null) return null
  const tmpFolder = fileType.mime.split('/')[0]
  await writeFile(`./public/tmp/${tmpFolder}/${idForImage}.${fileType.ext}`, buffer)
  return `${idForImage}.${fileType.ext}`
}
