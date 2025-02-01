import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule], // Include CommonModule here
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  // Define the list of categories.
  categoriesList: string[] = ['All', 'News', 'Sports', 'Tech', 'Business'];

  // Event emitter to notify the parent when a category is selected.
  @Output() categorySelected = new EventEmitter<string>();

  /**
   * Called when a category link is clicked.
   * Emits the selected category.
   *
   * @param category The chosen category.
   */
  onSelect(category: string): void {
    // You can also add a console log here for debugging.
    console.log('Selected category:', category);
    this.categorySelected.emit(category);
  }
}
