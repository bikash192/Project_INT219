import { createServer } from 'http'
import { Server } from 'socket.io'
import { type UserData, deleteId, getInMemoUsers, register } from './services/users'
import { type Message, addMessage, getInMemoMessages } from './services/messages'
import { readFile } from 'fs/promises'
import { readdirSync, unlinkSync } from 'fs'
import path from 'path'
import { uploadFile } from './services/image'

const imagesFolder = './public/tmp/image'
const videosFolder = './public/tmp/video'
const port = process.env.PORT ?? 8080

const imageUrlMatcher = /^\/public\/tmp\/image\/([a-z0-9-]+)\.(png|jpg|jpeg|gif|webp)$/
const audioUrlMatcher = /^\/public\/tmp\/video\/([a-z0-9-]+)\.(mp3|wav|ogg|flac|aac|webm)$/

const server = createServer((req, res) => {
  const { url } = req
  if (url == null) return
  const imageMatch = url.match(imageUrlMatcher)
  if (imageMatch != null) {
    const [, id, ext] = imageMatch;
    (async function (): Promise<void> {
      const image = await readFile(`${imagesFolder}/${id}.${ext}`)
      res.writeHead(200, { 'Content-Type': `image/${ext}` })
      res.end(image)
    })().then().catch(console.error)
    return
  }
  const audioMatch = url.match(audioUrlMatcher)
  if (audioMatch != null) {
    const [, id, ext] = audioMatch;
    (async function (): Promise<void> {
      const audio = await readFile(`${videosFolder}/${id}.${ext}`)
      res.writeHead(200, { 'Content-Type': `audio/${ext}` })
      res.end(audio)
    })().then().catch(console.error)
  }
})

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  const data = socket.handshake.auth as UserData
  register({ id: socket.id, socket, data })
  socket.emit('old-messages', getInMemoMessages())

  socket.on('disconnect', () => {
    const user = getInMemoUsers().find((user) => user.id === socket.id)
    if (user != null) {
      deleteId(socket.id)
    }
  })

  socket.on('message', (text: string) => {
    const user = getInMemoUsers().find((user) => user.id === socket.id)
    if (user != null) {
      const message: Message = { from: user.data.username, text, image: null, audio: null }
      addMessage(message)
      getInMemoUsers()
        .forEach(({ socket }) => {
          socket.emit('message', message)
        })
    }
  })

  socket.on('upload', async ({ image, audio, text }: { image: Buffer, audio: Buffer, text: string }) => {
    const user = getInMemoUsers().find((user) => user.id === socket.id)
    if (user != null) {
      const imageSrc = await uploadFile(image)
      const audioSrc = await uploadFile(audio)
      const message: Message = { from: user.data.username, text, image: imageSrc, audio: audioSrc }
      addMessage(message)
      getInMemoUsers()
        .forEach(({ socket }) => {
          socket.emit('message', message)
        })
    }
  })
})

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

const exitEvents = ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'] as const

exitEvents.forEach((eventType) => {
  process.on(eventType, () => {
    const files = [...readdirSync(imagesFolder), ...readdirSync(videosFolder)]
    files.forEach((file) => {
      unlinkSync(path.join(imagesFolder, file))
    })
  })
})
