import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';

import { StripeService, StripePaymentElementComponent } from 'ngx-stripe';
import {
  StripeElementsOptions,
  StripeElements,
  PaymentIntent
} from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  @ViewChild(StripePaymentElementComponent)
  paymentElement: StripePaymentElementComponent;

  paymentElementForm: FormGroup;


  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  paying = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private router : Router
  ) {




  }

  ngOnInit() {
    this.createPaymentIntent(2500 )
      .subscribe(pi => {
        console.log( "hmm",pi?.client_secret);
        this.elementsOptions.clientSecret = pi?.client_secret ?? "";
      
      });
  }

  pay() {
      this.paying = true;
      this.stripeService.confirmPayment({
        elements: this.paymentElement.elements,
        // confirmParams: {
        //   payment_method_data: {
        //     billing_details: {
        //       name: this.paymentElementForm.get('name')?.value,
        //       email: this.paymentElementForm.get('email')?.value,
        //       address: {
        //         line1: this.paymentElementForm.get('address')?.value,
        //         postal_code: this.paymentElementForm.get('zipcode')?.value,
        //         city: this.paymentElementForm.get('city')?.value,
        //       }
        //     }
        //   }
        // },
        redirect: 'if_required'
      }).subscribe(result => {
        console.log("Confirmed");
        this.paying = false;
        if (result.error) {
          console.log('Result', result.error);
          // Show error to your customer (e.g., insufficient funds)
          alert(result.error.code);
        } else {
          console.log('Result', result.paymentIntent);
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            // Show a success message to your customer
            this.router.navigateByUrl('/');
          }
        }
      });

  }

  private createPaymentIntent(amount: number): Observable<PaymentIntent> {

    return this.http.post<PaymentIntent>(
      `${environment.apiURL}/api/Transactions/create-payment-intent`,
      {
        amount
      }
    );
  }
}