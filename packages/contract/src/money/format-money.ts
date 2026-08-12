import type { Money } from './money';

export function formatMoney(money: Money, localeTag: string): string {
    return new Intl.NumberFormat(localeTag, {
        style: 'currency',
        currency: money.currency,
    }).format(money.amountMinor / 100);
}
