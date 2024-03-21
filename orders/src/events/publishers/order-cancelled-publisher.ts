import { Publisher, OrderCancelledEvent, Subjects } from "@rstoia98/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
