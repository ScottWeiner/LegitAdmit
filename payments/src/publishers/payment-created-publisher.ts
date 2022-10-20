import { Subjects, Publisher, PaymentCreatedEvent } from "@legit-admit/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated
}