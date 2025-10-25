import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent {
  contactForm: FormGroup;
  isSubmittingContact = false;
  contactSuccessMessage = '';
  contactErrorMessage = '';

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {
    // Initialize form with validators
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern(/^(\+27|0)[0-9]{9}$/)],
      message: ['', [Validators.required, Validators.minLength(50)]]
    });
  }

  // Submit contact form
  submitContactForm(): void {
    if (this.contactForm.valid) {
      this.isSubmittingContact = true;
      this.clearContactMessages();

      this.contactService.submitContactForm(this.contactForm.value).subscribe({
        next: (response) => {
          this.isSubmittingContact = false;
          this.contactSuccessMessage = response.message;
          this.contactForm.reset();
          console.log('Contact message sent successfully', response);

          // Auto-clear success message after 5 seconds
          setTimeout(() => {
            this.contactSuccessMessage = '';
          }, 5000);
        },
        error: (error) => {
          this.isSubmittingContact = false;
          this.contactErrorMessage = error.message || 'Failed to send message. Please try again.';
          console.error('Contact form error:', error);
        }
      });
    } else {
      this.contactErrorMessage = 'Please fill in all required fields correctly.';
      this.markFormGroupTouched(this.contactForm);
    }
  }

  // Check if form field is invalid and touched
  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Get specific error message for a field
  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.capitalize(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid phone number (+27XXXXXXXXX or 0XXXXXXXXX)';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `Message must be at least ${requiredLength} characters long`;
      }
    }
    return '';
  }

  // Get character count for message field
  getMessageCharacterCount(): number {
    const messageValue = this.contactForm.get('message')?.value || '';
    return messageValue.length;
  }

  // Get remaining characters for message field
  getRemainingCharacters(): number {
    return 50 - this.getMessageCharacterCount();
  }

  // Capitalize first letter of a string
  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Mark all form fields as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Clear success and error messages
  private clearContactMessages(): void {
    this.contactSuccessMessage = '';
    this.contactErrorMessage = '';
  }
}