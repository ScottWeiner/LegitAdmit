import { Publisher, Subjects, OrderCancelledEvent } from '@legit-admit/common';


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled
}