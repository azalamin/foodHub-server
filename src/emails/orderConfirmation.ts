export function orderConfirmationEmail({
	email,
	orderId,
	totalPrice,
	address,
}: {
	email: string;
	orderId: string;
	totalPrice: number;
	address: string;
}) {
	return {
		from: `"FoodHub" <no-reply@foodhub.com>`,
		to: email,
		subject: "🍱 Order Confirmed – FoodHub",
		html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2>Order Confirmed 🎉</h2>
        <p>Your order has been placed successfully.</p>

        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Total:</strong> ৳${totalPrice}</p>
        <p><strong>Delivery Address:</strong> ${address}</p>

        <p>Payment Method: <strong>Cash on Delivery</strong></p>

        <br/>
        <p>Thanks for ordering with FoodHub ❤️</p>
      </div>
    `,
	};
}
