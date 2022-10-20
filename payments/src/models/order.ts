import mongoose, { Schema } from 'mongoose'
import { OrderStatus } from '@legit-admit/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export { OrderStatus }

//interface describing properties that describe requirements for an new order model
interface OrderAttrs {
    id: string;
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
}

//Interface that describes properties & methods that a order model has
interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    price: number;
    version: number;
}

//interface that describes the properties that a order document has
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
})

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        userId: attrs.userId,
        price: attrs.price,
        status: attrs.status
    })
}

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }