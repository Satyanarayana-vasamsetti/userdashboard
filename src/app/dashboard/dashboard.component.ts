import { Component } from '@angular/core';
import { YogaService } from '../services/yoga.service';
import { Yoga } from '../models/yoga';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  details: Yoga[] = [];
  fg!: FormGroup;
  selectedRecord: Yoga | null = null;

  constructor(private fb: FormBuilder, private service: YogaService) {}

  ngOnInit(): void {
    this.loadDetails();
    this.initializeForm();
  }

  // Load all records from the backend
  loadDetails(): void {
    this.service.getAll().subscribe((data) => (this.details = data));
  }

  // Initialize the reactive form with validation
  initializeForm(): void {
    this.fg = this.fb.group({
      id: [null],
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email,Validators.pattern("")]],
    });
  }

  // Add a new record
  add(): void {
    if (this.fg.valid) {
      const newRecord: Yoga = { ...this.fg.value };
      this.service.add(newRecord).subscribe(() => {
        this.loadDetails();
        this.resetForm();
      });
    }
  }

  // Delete a record
  delete(id: number | undefined): void {
    if (id !== undefined) {
      this.service.delete(id).subscribe(
        () => {
        this.loadDetails();
      },
    (error)=>{
      console.error('Error deleting record:', error);
    });
    }
    else {
      console.warn('Invalid ID for deletion.');
    }
  }

  // Populate form for editing
  populateForm(record: Yoga): void {
    this.fg.patchValue(record);
    this.selectedRecord = record;
  }

  // Update an existing record
  update(): void {
    if (this.selectedRecord && this.fg.valid) {
      const updatedRecord: Yoga = { ...this.fg.value };
      const id = this.selectedRecord.id!;
      this.service.update(id, updatedRecord).subscribe(() => {
        this.loadDetails();
        this.resetForm();
        this.selectedRecord = null;
      });
    }
  }

  // Reset the form
  resetForm(): void {
    this.fg.reset();
    this.selectedRecord = null;
  }

  // Search by email
  searchByEmail(email: string): void {
    if (email) {
      this.service.getByEmail(email).subscribe((foundRecords) => {
        if (foundRecords && foundRecords.length > 0) {
          this.details = foundRecords;
        } else {
          console.log(`No records found for email: ${email}`);
          this.details = [];
        }
      });
    }
  }
  deleteByEmail(email: string): void {
    console.log('Email provided:', email);
    if (email) {
      this.service.deleteByEmail(email).subscribe({
        next: () => {
          console.log('Record deleted successfully.');
          this.loadDetails();
        },
        error: (error) => {
          console.error('Error deleting record:', error);
        },
      });
    } else {
      console.warn('Invalid email for deletion.');
    }
  }
  deleteByName(name: string): void {
    console.log('Name provided:', name);
    
    if (name) {
      this.service.deleteByName(name).subscribe({
        next: () => {
          console.log('Record deleted successfully.');
          this.loadDetails(); // Reloads the data after deletion
        },
        error: (error) => {
          console.error('Error deleting record:', error);
        },
      });
    } else {
      console.warn('Invalid name for deletion.');
    }
  }

}
