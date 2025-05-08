import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-animated-counter',
  template: `<span class="counter">{{ displayValue }}</span>`,
  standalone: false,
  styles: [`
    .counter {
      font-weight: bold;
      display: inline-block;
    }
  `],
  animations: [
    trigger('countAnimation', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition(':enter', [
        animate('0.5s cubic-bezier(0.35, 0, 0.25, 1)')
      ]),
      transition('* => *', [
        style({ opacity: 0.8, transform: 'translateY(-10px)' }),
        animate('0.3s cubic-bezier(0.35, 0, 0.25, 1)')
      ])
    ])
  ]
})
export class AnimatedCounterComponent implements OnInit, OnChanges {
  @Input() value: number = 0;
  @Input() duration: number = 1000; // Duration of animation in ms
  @Input() steps: number = 20; // Number of steps in the animation
  
  displayValue: number = 0;
  interval: any;
  
  ngOnInit() {
    this.animateCount();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      // Clear any existing animation
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.animateCount();
    }
  }
  
  animateCount() {
    const start = this.displayValue;
    const end = this.value;
    const stepValue = (end - start) / this.steps;
    const stepDuration = this.duration / this.steps;
    let current = start;
    
    this.interval = setInterval(() => {
      current += stepValue;
      
      if ((stepValue > 0 && current >= end) || (stepValue < 0 && current <= end)) {
        this.displayValue = end;
        clearInterval(this.interval);
      } else {
        this.displayValue = Math.floor(current);
      }
    }, stepDuration);
  }
  
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}