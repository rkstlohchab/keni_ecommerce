import { backendClient } from "@/sanity/lib/backendClient";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = headers();
  const signature = headersList.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature found for Razorpay" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.log("Razorpay webhook secret is not set");
    return NextResponse.json(
      {
        error: "Razorpay webhook secret is not set",
      },
      { status: 400 }
    );
  }

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const event = JSON.parse(body);

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const order = event.payload.payment.entity.order_id;

    try {
      // Create order in Sanity
      const orderData = await backendClient.create({
        _type: "order",
        orderNumber: payment.receipt,
        razorpayOrderId: order,
        razorpayPaymentId: payment.id,
        customerName: payment.notes.customerName,
        email: payment.notes.customerEmail,
        clerkUserId: payment.notes.clerkUserId,
        currency: payment.currency,
        totalPrice: payment.amount / 100,
        status: "paid",
        orderDate: new Date().toISOString(),
        address: payment.notes.address ? JSON.parse(payment.notes.address) : null,
      });

      return NextResponse.json({ success: true, order: orderData });
    } catch (error) {
      console.error("Error creating order in Sanity:", error);
      return NextResponse.json(
        {
          error: `Error creating order: ${error}`,
        },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({ received: true });
} 