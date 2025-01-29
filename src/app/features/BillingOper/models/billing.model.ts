import { Booking } from "../../BookingOper/models/list-booking.model"
import { Service } from "./service.model"

export interface Billing{
    billingId:number,
    billingNo : string,
    bookingId:number,
    guestName:string,
    roomCost : number,
    roomNumber:number,
    taxes:number,
    serviceCost: number;
    services: Service[]
    totalCost:number,
    paymentStatus:string
}