import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Firestore, doc, getDoc } from "@angular/fire/firestore";

@Component({
  selector: "app-led-display",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./led-display.component.html",
  styleUrls: ["./led-display.component.css"],
})
export class LedDisplayComponent implements OnInit {
  text = "Welcome to the LED Display!";

  constructor(private firestore: Firestore) {}

  async ngOnInit() {
    try {
      const docRef = doc(this.firestore, "led", "ledtext");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Cast the returned data to an object with a "text" property
        const data = docSnap.data() as { text: string };
        this.text = data.text;
      } else {
        console.error("No such document in the 'led' collection with ID 'Ledtext'.");
      }
    } catch (error) {
      console.error("Error fetching LED text:", error);
    }
  }
}
