import { PaymentCreatedEvent, Publisher, Subjects } from "@rstoia98/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
