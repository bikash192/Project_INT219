import { Component, type OnDestroy, type OnInit } from '@angular/core'
import { type ServerConnectionState, SocketService } from '../../services/socket.service'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { FileInputValueAccessor } from '../../directives/file-input-value-accessor.directive'
import { ToSrcPipe } from '../../pipes/to-src.pipe'
import { AudioRecorderService } from '../../services/audio-recorder.service'
import { Subject, combineLatest, takeUntil } from 'rxjs'

@Component({
  selector: 'chat-footer',
  standalone: true,
  templateUrl: './chat-footer.component.html',
  styles: 'textarea {field-sizing: content;}',
  imports: [FormsModule, CommonModule, FileInputValueAccessor, ToSrcPipe]
})
export class ChatFooterComponent implements OnInit, OnDestroy {
  connectionState: ServerConnectionState = 'disconnected'
  recordingState: 'recording' | 'stopped' = 'stopped'
  message: string = ''
  image: File | null = null
  audio: Blob | null = null

  private readonly ngUnsubscribe = new Subject<void>()

  constructor (
    private readonly socketService: SocketService,
    private readonly audioRecorderService: AudioRecorderService
  ) {}

  ngOnInit (): void {
    combineLatest([
      this.socketService.connectionState,
      this.audioRecorderService.state,
      this.audioRecorderService.audio
    ]).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(([connectionState, recordingState, audio]) => {
      this.connectionState = connectionState
      this.recordingState = recordingState
      this.audio = audio
    })
  }

  ngOnDestroy (): void {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

  sendMessage ($event: SubmitEvent): void {
    const obj = {
      message: this.message,
      image: this.image,
      audio: this.audio == null ? null : new File([this.audio], 'audio')
    }
    console.log(obj)
    this.socketService.sendMessage(obj)
    const form = $event.target as HTMLFormElement
    form.reset()
    this.message = ''
  }

  toggleAudioRecording (): void {
    if (this.audioRecorderService.state.value === 'stopped') {
      this.audioRecorderService.start()
    } else {
      this.audioRecorderService.stop()
    }
  }
}
