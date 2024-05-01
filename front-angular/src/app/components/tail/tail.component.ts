import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-tail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tail.component.html',
  styleUrl: './tail.component.css'
})
export class TailComponent {
  @Input() dir: 'in' | 'out' = 'in'
}
