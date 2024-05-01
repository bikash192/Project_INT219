"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const users_1 = require("./services/users");
const messages_1 = require("./services/messages");
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const image_1 = require("./services/image");
const imagesFolder = './public/tmp/image';
const videosFolder = './public/tmp/video';
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8080;
const imageUrlMatcher = /^\/public\/tmp\/image\/([a-z0-9-]+)\.(png|jpg|jpeg|gif|webp)$/;
const audioUrlMatcher = /^\/public\/tmp\/video\/([a-z0-9-]+)\.(mp3|wav|ogg|flac|aac|webm)$/;
const server = (0, http_1.createServer)((req, res) => {
    const { url } = req;
    if (url == null)
        return;
    const imageMatch = url.match(imageUrlMatcher);
    if (imageMatch != null) {
        const [, id, ext] = imageMatch;
        (function () {
            return __awaiter(this, void 0, void 0, function* () {
                const image = yield (0, promises_1.readFile)(`${imagesFolder}/${id}.${ext}`);
                res.writeHead(200, { 'Content-Type': `image/${ext}` });
                res.end(image);
            });
        })().then().catch(console.error);
        return;
    }
    const audioMatch = url.match(audioUrlMatcher);
    if (audioMatch != null) {
        const [, id, ext] = audioMatch;
        (function () {
            return __awaiter(this, void 0, void 0, function* () {
                const audio = yield (0, promises_1.readFile)(`${videosFolder}/${id}.${ext}`);
                res.writeHead(200, { 'Content-Type': `audio/${ext}` });
                res.end(audio);
            });
        })().then().catch(console.error);
    }
});
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:4200',
        methods: ['GET', 'POST']
    }
});
io.on('connection', (socket) => {
    const data = socket.handshake.auth;
    (0, users_1.register)({ id: socket.id, socket, data });
    socket.emit('old-messages', (0, messages_1.getInMemoMessages)());
    socket.on('disconnect', () => {
        const user = (0, users_1.getInMemoUsers)().find((user) => user.id === socket.id);
        if (user != null) {
            (0, users_1.deleteId)(socket.id);
        }
    });
    socket.on('message', (text) => {
        const user = (0, users_1.getInMemoUsers)().find((user) => user.id === socket.id);
        if (user != null) {
            const message = { from: user.data.username, text, image: null, audio: null };
            (0, messages_1.addMessage)(message);
            (0, users_1.getInMemoUsers)()
                .forEach(({ socket }) => {
                socket.emit('message', message);
            });
        }
    });
    socket.on('upload', (_a) => __awaiter(void 0, [_a], void 0, function* ({ image, audio, text }) {
        const user = (0, users_1.getInMemoUsers)().find((user) => user.id === socket.id);
        if (user != null) {
            const imageSrc = yield (0, image_1.uploadFile)(image);
            const audioSrc = yield (0, image_1.uploadFile)(audio);
            const message = { from: user.data.username, text, image: imageSrc, audio: audioSrc };
            (0, messages_1.addMessage)(message);
            (0, users_1.getInMemoUsers)()
                .forEach(({ socket }) => {
                socket.emit('message', message);
            });
        }
    }));
});
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
const exitEvents = ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'];
exitEvents.forEach((eventType) => {
    process.on(eventType, () => {
        const files = [...(0, fs_1.readdirSync)(imagesFolder), ...(0, fs_1.readdirSync)(videosFolder)];
        files.forEach((file) => {
            (0, fs_1.unlinkSync)(path_1.default.join(imagesFolder, file));
        });
    });
});
