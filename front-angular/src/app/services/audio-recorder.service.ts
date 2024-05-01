import { Injectable, NgZone } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AudioRecorderService {
  readonly supported = navigator.mediaDevices?.getUserMedia != null
  readonly state = new BehaviorSubject<'recording' | 'stopped'>('stopped')
  audio = new BehaviorSubject<Blob | null>(null)
  private mediaRecorder: MediaRecorder | null = null

  constructor (
    private readonly ngZone: NgZone
  ) { }

  start (): void {
    if (!this.supported) return
    this.state.next('recording')
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream)
        this.mediaRecorder.start()
        this.mediaRecorder.ondataavailable = (event) => {
          this.audio.next(event.data)
        }
        this.mediaRecorder.onstop = () => {
          this.ngZone.run(() => {
            this.state.next('stopped')
          })
          stream.getTracks().forEach(track => { track.stop() })
          this.mediaRecorder = null
        }
      })
      .catch(error => {
        console.error('Error accessing microphone:', error)
        this.state.next('stopped')
      })
  }

  stop (): void {
    if (!this.supported) return
    if (this.mediaRecorder != null) {
      this.mediaRecorder.stop()
    }
  }
}
