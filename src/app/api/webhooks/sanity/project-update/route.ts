import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";
import { sanityClient, sanityIsConfigured } from "@/sanity/lib/client";

interface ClientProjectDocument {
  _id: string;
  _type: string;
  client: {
    _ref: string;
  };
  project: {
    _ref: string;
  };
  status: string;
  startDate?: string;
  endDate?: string;
}

interface ClientData {
  _id: string;
  name: string;
  email: string;
  company?: string;
  loginEnabled: boolean;
}

interface ProjectData {
  _id: string;
  title: string;
  subtitle?: string;
}

export async function POST(request: Request) {
  const expectedSecret = process.env.SANITY_WEBHOOK_SECRET;
  const suppliedSecret = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expectedSecret || suppliedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!sanityIsConfigured || !process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ error: "Sanity is not configured" }, { status: 503 });
  }

  const document = (await request.json()) as ClientProjectDocument;
  if (document._type !== "clientProject") {
    return NextResponse.json({ ignored: true });
  }

  try {
    // Fetch client data
    const clientData = await sanityClient.fetch<ClientData>(
      `*[_type == "client" && _id == $clientId][0] { _id, name, email, company, loginEnabled }`,
      { clientId: document.client._ref }
    );

    if (!clientData || !clientData.loginEnabled) {
      return NextResponse.json({ ignored: true, reason: "Client not found or login disabled" });
    }

    // Fetch project data
    const projectData = await sanityClient.fetch<ProjectData>(
      `*[_type == "project" && _id == $projectId][0] { _id, title, subtitle }`,
      { projectId: document.project._ref }
    );

    if (!projectData) {
      return NextResponse.json({ ignored: true, reason: "Project not found" });
    }

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://jlang.dev").replace(/\/$/, "");
    const portalUrl = `${siteUrl}/portal/dashboard`;

    // Map status to readable text
    const statusDisplay = {
      active: "Active",
      completed: "Completed",
      "on-hold": "On Hold",
      archived: "Archived",
    }[document.status] || document.status;

    const { error } = await getResend().emails.send({
      from: process.env.REVIEW_EMAIL_FROM || "JLang Development <reviews@jlang.dev>",
      to: clientData.email,
      subject: `Project Update: ${projectData.title}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#172033;line-height:1.65">
          <h1 style="font-size:28px">Your project has been updated</h1>
          <p>Hi ${escapeHtml(clientData.name)},</p>
          <p>Your project <strong>${escapeHtml(projectData.title)}</strong> has been updated.</p>
          <div style="background:#f3f4f6;padding:20px;border-radius:10px;margin:20px 0">
            <p style="margin:0;font-size:14px;color:#6b7280">Current Status</p>
            <p style="margin:8px 0 0 0;font-size:20px;font-weight:700;color:#4f46e5">${escapeHtml(statusDisplay)}</p>
          </div>
          ${document.endDate ? `<p style="color:#6b7280;font-size:14px">Expected completion: ${new Date(document.endDate).toLocaleDateString("en-US", { timeZone: "UTC" })}</p>` : ""}
          <p><a href="${portalUrl}" style="display:inline-block;background:#4f46e5;color:white;padding:13px 22px;border-radius:10px;text-decoration:none;font-weight:700">View Project Details</a></p>
          <p style="font-size:13px;color:#667085">Log in to your client portal to see the full project timeline and communicate with Jordan.</p>
        </div>`,
    });

    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true, sentTo: clientData.email });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Email failed" },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}
