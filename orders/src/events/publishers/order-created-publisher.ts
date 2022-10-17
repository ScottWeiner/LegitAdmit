import { Publisher, Subjects, OrderCreatedEvent } from '@legit-admit/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated
}