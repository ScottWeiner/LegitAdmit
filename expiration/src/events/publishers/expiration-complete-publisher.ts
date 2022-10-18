import { Subjects, Publisher, ExpirationCompleteEvent } from "@legit-admit/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete
}