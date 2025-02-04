import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-led-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './led-display.component.html',
  styleUrls: ['./led-display.component.css']
})
export class LedDisplayComponent {
  category: string = 'Новини';
  partnerImage: string = 'images/partnerlogo.png';

  // Each ticker item includes text and a link URL
  tickerItems = [
    {
      text: 'Най-доброто от Йордания - 5 нощувки, с полет от София на Aegean Airlines!- Цени от 2099 лв. за ранни записвания!',
      link: 'https://bit.ly/4aQpqcr'
    },
    // You can include more items
    {
      text: 'Още една страхотна оферта за пътуване!',
      link: 'https://example.com'
    }
    // etc.
  ];
}
