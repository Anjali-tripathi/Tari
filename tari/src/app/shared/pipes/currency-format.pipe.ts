import { Pipe, PipeTransform } from '@angular/core';

// ===== currency-format.pipe.ts =====
@Pipe({ name: 'currencyFormat' })
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null) return '₹0';
    return '₹' + value.toLocaleString('en-IN');
  }
}

// ===== time-ago.pipe.ts =====
@Pipe({ name: 'timeAgo' })
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    const now = new Date();
    const date = new Date(value);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }
}
