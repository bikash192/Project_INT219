import { Component } from '@angular/core'
import { ChatHeaderComponent } from '../chat-header/chat-header.component'
import { ChatFooterComponent } from '../chat-footer/chat-footer.component'
import { ChatMessagesComponent } from '../chat-messages/chat-messages.component'

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [ChatHeaderComponent, ChatFooterComponent, ChatMessagesComponent]
})
export class AppComponent {}
