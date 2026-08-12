import { Money } from "../money/money";

export type Pricing =
  | { 
      model: "fixed"; 
      price: Money }
  | { 
      model: "hourly"; 
      hourlyRate: Money; 
      minimumHours: number }
  | { 
      model: "quote"; 
      startingFrom?: Money };
