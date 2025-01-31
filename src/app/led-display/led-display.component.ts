import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-led-display",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./led-display.component.html",
  styleUrls: ["./led-display.component.css"],
})
export class LedDisplayComponent {
  text = "Welcome to the LED Display!";
}
