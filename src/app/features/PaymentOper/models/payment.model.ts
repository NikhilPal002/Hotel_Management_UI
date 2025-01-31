import { Billing } from "../../BillingOper/models/billing.model";

export interface Payment{
    paymentId?:number,
    paymentAmount:number,
    paymentDate:Date,
    paymentMethod:string,
    transactionId:string,
    billingId:number;
}

export interface PaymentDetails{
    paymentId?:number,
    paymentAmount:number,
    paymentDate:Date,
    paymentMethod:string,
    transactionId:string,
    billing?:Billing;
}