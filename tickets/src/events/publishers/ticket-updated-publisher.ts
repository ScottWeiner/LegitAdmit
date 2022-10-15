import { Publisher, Subjects, TicketUpdatedEvent } from '@legit-admit/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated
}
