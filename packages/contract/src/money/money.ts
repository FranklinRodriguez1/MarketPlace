export type CurrencyCode = 'COP' | 'USD' | 'EUR'

export interface Money {
    readonly amountMinor: number;
    readonly currency: CurrencyCode;
}