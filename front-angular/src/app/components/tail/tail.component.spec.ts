import { type ComponentFixture, TestBed } from '@angular/core/testing'

import { TailComponent } from './tail.component'

describe('TailComponent', () => {
  let component: TailComponent
  let fixture: ComponentFixture<TailComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(TailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
