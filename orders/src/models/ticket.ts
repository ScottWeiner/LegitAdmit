import mongoose from 'mongoose'
import { Order, OrderStatus } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface TicketAttrs {
    id: string;
    title: string;
    price: number;
    //version: number
}

//Interface that describes properties & methods that a order model has
export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>
}

//interface that describes the properties that a order document has
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
})

ticketSchema.set('versionKey', 'version')

ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    return Ticket.findOne({ _id: event.id, version: event.version - 1 })
}

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        price: attrs.price,
        title: attrs.title
    })
}

ticketSchema.methods.isReserved = async function () {
    //this === the ticket document on which we are calling this method    

    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $nin: [OrderStatus.Cancelled]
        }
    })

    return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }