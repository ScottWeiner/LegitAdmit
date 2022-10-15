import { Publisher, TicketCreatedEvent, Subjects } from "@legit-admit/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated
}