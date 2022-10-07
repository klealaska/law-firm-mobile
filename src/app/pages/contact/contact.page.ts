import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  firstName;
  email;
  message;
  condition;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    const data = {
      firstName: this.firstName,
      email: this.email,
      message: this.message,
      condition: this.condition
    }
  }

}
