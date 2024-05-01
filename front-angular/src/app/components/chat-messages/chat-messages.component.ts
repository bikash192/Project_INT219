import { Component, type OnDestroy, type OnInit } from '@angular/core'
import { Subject, combineLatest, takeUntil } from 'rxjs'
import { type Message, type ServerConnectionState, SocketService } from '../../services/socket.service'
import { MessageComponent } from '../message/message.component'

@Component({
  selector: 'chat-messages',
  standalone: true,
  templateUrl: './chat-messages.component.html',
  imports: [MessageComponent]
})
export class ChatMessagesComponent implements OnInit, OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>()
  messages: Message[] = []
  connectionState: ServerConnectionState = 'disconnected'

  constructor (
    private readonly socketService: SocketService
  ) {}

  ngOnInit (): void {
    const obs = {
      connectionState: this.socketService.connectionState,
      messages: this.socketService.messages
    }
    combineLatest(obs)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(({ connectionState, messages }) => {
        this.connectionState = connectionState
        this.messages = messages
      })
  }

  ngOnDestroy (): void {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }
}
