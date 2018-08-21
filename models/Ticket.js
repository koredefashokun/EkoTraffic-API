import mongoose, { Schema } from 'mongoose';

const TicketSchema = new Schema ({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  dates: {
    purchased: {
      type: Date,
      default: Date.now
    },
    expiry: {
      type: Date
    }
  }
})


export const Ticket = mongoose.model('Ticket', TicketSchema);