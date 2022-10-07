import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.page.html',
  styleUrls: ['./questions.page.scss'],
})
export class QuestionsPage implements OnInit {
  firstName;
  email;
  message;
  condition;
  familyName;
  select;
  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    const data = {
      select: this.select,
      familyName: this.familyName,
      firstName: this.firstName,
      email: this.email,
      message: this.message,
      condition: this.condition
    }
  }

}
