import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { YogaService } from '../services/yoga.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  fg!: FormGroup;
  details: any[] = [];
  selectedRecord: any = null;

  constructor(private fb: FormBuilder, private yogaService: YogaService) {}

  ngOnInit() {
    this.fg = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
    this.getAll();
  }

  // ✅ Fetch all records
  getAll() {
    this.yogaService.getAll().subscribe(
      (data) => {
        console.log("Fetched data:", data);
        this.details = data;
      },
      (error) => console.error("Error fetching records:", error)
    );
  }

  // ✅ Add a new user
  add() {
    if (this.fg.valid) {
      this.yogaService.add(this.fg.value).subscribe(
        (response) => {
          console.log("User added:", response);
          this.getAll(); // Refresh list
          this.resetForm();
        },
        (error) => console.error("Error adding user:", error)
      );
    }
  }

  // ✅ Update user details
  update() {
    if (this.fg.valid && this.selectedRecord) {
      this.yogaService.update(this.selectedRecord.id, this.fg.value).subscribe(
        (response) => {
          console.log("User updated:", response);
          this.getAll();
          this.resetForm();
        },
        (error) => console.error("Error updating user:", error)
      );
    }
  }

  // ✅ Delete user by email
  deleteByEmail(email: string) {
    this.yogaService.deleteByEmail(email).subscribe(
      () => {
        console.log("User deleted:", email);
        this.getAll();
      },
      (error) => console.error("Error deleting user:", error)
    );
  }

  // ✅ Search user by email
  searchByEmail(email: string) {
    if (!email) {
      alert("Please enter an email!");
      return;
    }
  
    this.yogaService.getByEmail(email).subscribe(
      (data) => {
        if (data) {
          this.details = [data]; // Display only the searched user
        } else {
          alert("User not found!");
        }
      },
      (error) => {
        console.error("Error fetching user:", error);
        alert("User not found!");
      }
    );
  }
  

  // ✅ Populate form for edit
  populateForm(record: any) {
    this.selectedRecord = record;
    this.fg.patchValue(record);
  }

  // ✅ Reset form
  resetForm() {
    this.fg.reset();
    this.selectedRecord = null;
  }
  deleteById(id: number) {
    this.yogaService.deleteById(id).subscribe(
      () => {
        console.log(`User deleted: ${id}`);
        this.getAll(); // Refresh the list after deletion
      },
      (error) => console.error("Error deleting user:", error)
    );
  }
  
}
