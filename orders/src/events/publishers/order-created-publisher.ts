import { Publisher, OrderCreatedEvent, Subjects } from "@rstoia98/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

