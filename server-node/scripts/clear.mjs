import { readdirSync, unlinkSync } from 'fs'

const imagesFolder = './public/tmp/image'
const videosFolder = './public/tmp/video'

const tmpFiles = [
  ...readdirSync(imagesFolder).map(fName => `${imagesFolder}/${fName}`),
  ...readdirSync(videosFolder).map(fName => `${videosFolder}/${fName}`)
]

tmpFiles.forEach(fPath => { unlinkSync(fPath) })
