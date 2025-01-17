import { Guest } from "../../GuestOper/models/guest.model"
import { Room } from "../../RoomsOpr/models/room.model"

export interface Booking{
    bookingId:number,
    numberOfAdults:number
    numberOfChildren:number,
    checkIn:Date,
    checkOut:Date,
    numberOfNights:number,
    totalCost:number,
    bookingStatus:string,
    paymentStatus:string,
    guest?:Guest,
    room?:Room
}

