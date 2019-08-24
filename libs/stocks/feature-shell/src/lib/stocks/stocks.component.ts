import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { elementEnd } from '@angular/core/src/render3';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  symbol: string;
  period: string;

  quotes$ = this.priceQuery.priceQueries$;

  timePeriods = [
    { viewValue: 'All available data', value: 'max' },
    { viewValue: 'Five years', value: '5y' },
    { viewValue: 'Two years', value: '2y' },
    { viewValue: 'One year', value: '1y' },
    { viewValue: 'Year-to-date', value: 'ytd' },
    { viewValue: 'Six months', value: '6m' },
    { viewValue: 'Three months', value: '3m' },
    { viewValue: 'One month', value: '1m' }
  ];

  maxDate = new Date();

  toFilter = (d: Date): boolean => {
    return d > this.stockPickerForm.get('fromDate').value;
  };

  fromFilter = (d: Date): boolean => {
    if (this.stockPickerForm.get('toDate').value !== ' ') {
      return d < this.stockPickerForm.get('toDate').value;
    }
    return d <= this.maxDate;
  };

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = this.fb.group({
      symbol: [' ', Validators.required],
      period: ['max', Validators.required],
      fromDate: [' ', Validators.required],
      toDate: [' ', Validators.required]
    });
  }

  ngOnInit() {
    this.stockPickerForm.valueChanges.subscribe(() => this.fetchQuote);
  }

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const { symbol, period } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, period);
      this.quotes$.subscribe(response => {
        const dateRangePrices = response.filter(element => {
          const from = this.stockPickerForm.get('fromDate').value.getTime();
          const to = this.stockPickerForm.get('toDate').value.getTime();
          const elementDate = new Date(element[0]).getTime();

          if (elementDate >= from && elementDate <= to) {
            return true;
          }
        });
        console.log(dateRangePrices);
      });
    }
  }
}
