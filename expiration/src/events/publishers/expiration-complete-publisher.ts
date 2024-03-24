import { Publisher, Subjects, ExpirationCompleteEvent } from "@rstoia98/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
