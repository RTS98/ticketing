import { Publisher, Subjects, TicketUpdatedEvent } from "@rstoia98/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
