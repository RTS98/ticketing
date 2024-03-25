import { useEffect, useState } from "react";
import useRequest from "../../hooks/use-request";
import StripeCheckout from "react-stripe-checkout";
import Router from "next/router";

function OrderDetails({ order, currentUser }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSucces: () => Router.push("/orders"),
  });

  useEffect(() => {
    const id = setInterval(() => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

  if (timeLeft < 0) {
    return <div>OrderExpired</div>;
  }

  return (
    <div>
      {timeLeft} seconds until order expires
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51Oy5nVFqTYLcijit9Pp45LPpGMieOBH1GAzmX8g5C7ToitPWYS27LlNWs1Xau8K5pjiUUhzAll23bFBp6IBFZWox00cSSa0NcS"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      ></StripeCheckout>
      {errors.length > 0 && (
        <div className="alert alert-danger">
          <h4>Errors</h4>
          <ul className="my-0">
            {errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

OrderDetails.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderDetails;
