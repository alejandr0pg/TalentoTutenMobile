import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../providers/auth.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  token: string;
  user: User;
  items: any;
  itemsFiltered = [];
  searchControl: FormControl;
  searchTerm: string = '';
  searching: any = false;
  filterBy = 'bookingId';
  filterType;
  
  constructor(
    private auth: AuthService,
    private http: HttpClient
  ) {
    this.searchControl = new FormControl();

    this.user = this.auth.currentUserValue;
    this.token = this.user.sessionTokenBck;
  }

  ngOnInit() {
    this.getItems();
  }

  sort(type, key) {
    if(type === "asc") {
      this.itemsFiltered.sort((a, b) => a[key] - b[key]);
    } else if(type=== " desc") {
      this.itemsFiltered.sort((a, b) => b[key] - a[key]);
    }

    console.log('sort items', this.itemsFiltered);
  }

  getItems() {
    const email = "contacto@tuten.cl";

    const headers = new HttpHeaders({
      'Content-Type':'application/json; charset=utf-8',
      'app': 'APP_BCK',
      'adminemail': this.user.email,
      'email': email,
      'token': this.token
    });
    
    this.http.get(
      `${environment.apiUrl}/user/${email}/bookings?current=true`, { headers: headers }
    ).pipe(map((booking: any) => {
      return booking.map((array) => {
        const cliente = array['tutenUserClient'];
        array['nameClient'] = cliente['firstName'] + ' ' + cliente['lastName'];
        return array;
      });
    })).subscribe(async (res: any) => {
      console.log('booking', res);
      this.items = res;
      this.itemsFiltered = res;
    });
  }

  async setFilteredItems(e) {
    this.itemsFiltered = this.filterItems(e.target.value);
  }

  filterItems(searchTerm){
    return this.items.filter((item) => {
      return item.bookingId.toString().indexOf(
        searchTerm.toLowerCase()) > -1 ||
          // Filtrar por nameClient
          item.nameClient.toLowerCase().
          indexOf(searchTerm.toLowerCase()) > -1 ||
            // Filtrar por BookingPrice
            item.bookingPrice.toString().toLowerCase().
            indexOf(searchTerm.toLowerCase()) > -1 ||
              // Filtrar por streetAddress
              item.locationId.streetAddress.toLowerCase().
              indexOf(searchTerm.toLowerCase()) > -1
      });
  }

  logout() {
    this.auth.logout();
  }


}
