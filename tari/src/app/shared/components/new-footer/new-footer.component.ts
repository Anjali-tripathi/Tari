// ...existing code...
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-footer',
  templateUrl: './new-footer.component.html',
  styleUrls: ['./new-footer.component.scss']
})
export class NewFooterComponent implements OnInit {

  currentYear = new Date().getFullYear();
  feedbackForm: FormGroup;
  feedbackSubmitted = false;
  feedbackSuccess = false;

  socialLinks = [
    { icon: 'fa fa-facebook', url: 'https://facebook.com', label: 'Facebook' },
    { icon: 'fa fa-twitter', url: 'https://twitter.com', label: 'Twitter' },
    { icon: 'fa fa-instagram', url: 'https://instagram.com', label: 'Instagram' },
    { icon: 'fa fa-linkedin', url: 'https://linkedin.com', label: 'LinkedIn' }
  ];

  contactInfo = {
    email: 'support@tari.com',
    phone: '+91 7827325721',
    address: 'Noida sec 62 near tech'
  };

  constructor(private fb: FormBuilder) {
    this.feedbackForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      suggestions: ['']
    });
  }

  ngOnInit(): void {}

  onSubmitFeedback() {
    this.feedbackSubmitted = true;

    if (this.feedbackForm.valid) {
      const formData = this.feedbackForm.value;
      console.log('Feedback submitted:', formData);

      // TODO: Send to backend API
      // this.feedbackService.submitFeedback(formData).subscribe(...)

      this.feedbackSuccess = true;

      // Reset form after 3 seconds
      setTimeout(() => {
        this.feedbackForm.reset();
        this.feedbackSubmitted = false;
        this.feedbackSuccess = false;
      }, 3000);
    }
  }

  get name() {
    return this.feedbackForm.get('name');
  }

  get email() {
    return this.feedbackForm.get('email');
  }

  get subject() {
    return this.feedbackForm.get('subject');
  }

  get message() {
    return this.feedbackForm.get('message');
  }
}
