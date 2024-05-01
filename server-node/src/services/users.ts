import { type Socket } from 'socket.io'

export interface UserData {
  username: string
}
interface User {
  id: string
  data: UserData
  socket: Socket
}

const inMemoUsers: User[] = []

export const getInMemoUsers = (): User[] => inMemoUsers

export const register = ({
  id, socket, data
}: { id: string, socket: Socket, data: UserData }): void => {
  const user = { id, socket, data }
  inMemoUsers.push(user)
}

export const deleteId = (id: string): void => {
  const index = inMemoUsers.findIndex((user) => user.id === id)
  if (index !== -1) {
    inMemoUsers.splice(index, 1)
  }
}

export const printInMemoUsers = (): void => {
  console.log('inMemoUsers ->', inMemoUsers.map((user) => user.id))
}
