import { Publisher, Subjects, TicketCreatedEvent } from "@rstoia98/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
