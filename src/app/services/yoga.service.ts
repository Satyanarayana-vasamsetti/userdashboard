import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YogaService {
  private baseurl = "http://localhost:8086/api/dashboard";
  
  constructor(private http: HttpClient) { }

  // ✅ Get all users
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseurl);
  }

  // ✅ Add user
  add(record: any): Observable<any> {
    return this.http.post<any>(this.baseurl, record);
  }

  // ✅ Get user by ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseurl}/search?id=${id}`);
  }

  // ✅ Get user by Email
  getByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.baseurl}/search?email=${email}`);
  }
  

  // ✅ Delete by ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseurl}/${id}`);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseurl}/${id}`);
  }
  
  // ✅ Update user
  update(id: number, record: any): Observable<any> {
    return this.http.put<any>(`${this.baseurl}/${id}`, record);
  }

  // ✅ Delete by Email
  deleteByEmail(email: string): Observable<any> {
    return this.http.delete<any>(`${this.baseurl}/email/${email}`);
  }
}
