export function orderConfirmationEmail({
	email,
	orderId,
	totalPrice,
	address,
	paymentMethod = "COD",
}: {
	email: string;
	orderId: string;
	totalPrice: number;
	address: string;
	paymentMethod?: "COD" | "CARD";
}) {
	const isCard = paymentMethod === "CARD";
	const paymentLabel = isCard ? "Paid by Card" : "Cash on Delivery";
	const paymentBadgeColor = isCard ? "#16a34a" : "#d97706";
	const statusLabel = isCard ? "Payment Confirmed" : "Order Placed";

	return {
		from: `"FoodHub" <no-reply@foodhub.com>`,
		to: email,
		subject: `🍱 Order Confirmed – FoodHub (#${orderId.slice(-8).toUpperCase()})`,
		html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmed</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:100%;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#16a34a;padding:28px 32px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:900;letter-spacing:0.5px;">
                🍱 FoodHub
              </h1>
              <p style="margin:6px 0 0;color:#dcfce7;font-size:13px;font-weight:500;">
                Discover & Order Delicious Meals
              </p>
            </td>
          </tr>

          <!-- Success Icon + Title -->
          <tr>
            <td style="padding:36px 32px 24px;text-align:center;">
              <div style="display:inline-block;background:#f0fdf4;border-radius:50%;padding:20px;border:3px solid #bbf7d0;">
                <span style="font-size:40px;line-height:1;">✅</span>
              </div>
              <h2 style="margin:20px 0 6px;font-size:24px;font-weight:900;color:#111827;">${statusLabel}!</h2>
              <p style="margin:0;color:#6b7280;font-size:15px;">
                ${isCard ? "Your payment was successful and your order is confirmed." : "Your order has been received and is being prepared."}
              </p>
            </td>
          </tr>

          <!-- Order Summary Card -->
          <tr>
            <td style="padding:0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #e5e7eb;">
                    <p style="margin:0;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.1em;">Order Summary</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;color:#6b7280;font-size:14px;">Order ID</td>
                        <td style="padding:8px 0;text-align:right;font-family:monospace;font-size:13px;color:#111827;font-weight:700;">#${orderId.slice(-8).toUpperCase()}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#6b7280;font-size:14px;">Delivery Address</td>
                        <td style="padding:8px 0;text-align:right;color:#111827;font-size:14px;font-weight:600;max-width:250px;">${address}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#6b7280;font-size:14px;">Payment Method</td>
                        <td style="padding:8px 0;text-align:right;">
                          <span style="background:${paymentBadgeColor};color:#fff;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">${paymentLabel}</span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top:16px;border-top:2px solid #e5e7eb;"></td>
                      </tr>
                      <tr>
                        <td style="padding-top:4px;color:#111827;font-size:16px;font-weight:700;">Total Amount</td>
                        <td style="padding-top:4px;text-align:right;color:#16a34a;font-size:22px;font-weight:900;font-family:monospace;">৳${totalPrice.toFixed(2)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What's Next -->
          <tr>
            <td style="padding:0 32px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-radius:12px;border:1px solid #bfdbfe;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.1em;">What happens next?</p>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:4px 0;color:#1e40af;font-size:14px;">🍳 &nbsp; Provider is preparing your meal</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;color:#1e40af;font-size:14px;">🛵 &nbsp; Delivery is on its way to you</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;color:#1e40af;font-size:14px;">📦 &nbsp; Track your order in the dashboard</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding:0 32px 36px;text-align:center;">
              <a href="https://foodhubbd.vercel.app/dashboard/orders"
                style="display:inline-block;background:#16a34a;color:#ffffff;padding:14px 40px;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;">
                Track My Order
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px;text-align:center;font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb;">
              © ${new Date().getFullYear()} FoodHub. All rights reserved.<br/>
              <span style="font-size:11px;">If you didn't place this order, please contact support.</span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
	};
}
