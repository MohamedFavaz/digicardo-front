import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().optional(),
  inquiry_type: z.enum([
    "smart_card_order",
    "enterprise_team",
    "creator_custom_domain",
    "general_inquiry",
    "partnership",
  ]),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = contactSchema.parse(body);

    // Format & log contact lead for administration / webhook
    console.log("📬 [Contact Form Submission Received]:", {
      ...validated,
      timestamp: new Date().toISOString(),
      ip: req.headers.get("x-forwarded-for") || "direct",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your inquiry has been submitted. Our team will reach out within 24 hours.",
        received_at: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: err.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    console.error("Contact submission error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
