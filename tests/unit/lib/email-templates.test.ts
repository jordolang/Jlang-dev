import { describe, it, expect } from "vitest";
import {
  escapeHtml,
  reviewRequestEmail,
  reviewReceivedEmail,
  jordanResponseEmail,
  reviewPublishedEmail,
  type ReviewRequestEmailData,
  type ReviewReceivedEmailData,
  type JordanResponseEmailData,
  type ReviewPublishedEmailData,
} from "@/lib/email-templates";

describe("Email Templates", () => {
  describe("escapeHtml", () => {
    it("should escape HTML special characters", () => {
      expect(escapeHtml("<script>alert('xss')</script>")).toBe(
        "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"
      );
    });

    it("should escape ampersands", () => {
      expect(escapeHtml("Company & Co")).toBe("Company &amp; Co");
    });

    it("should escape quotes", () => {
      expect(escapeHtml('Company "Best" Ltd')).toBe("Company &quot;Best&quot; Ltd");
    });

    it("should handle strings without special characters", () => {
      expect(escapeHtml("Normal text")).toBe("Normal text");
    });
  });

  describe("reviewRequestEmail", () => {
    const data: ReviewRequestEmailData = {
      clientName: "John Doe",
      company: "Acme Corp",
      reviewUrl: "https://jlang.dev/review/token123",
    };

    it("should generate valid HTML email", () => {
      const html = reviewRequestEmail(data);
      expect(html).toBeTruthy();
      expect(html).not.toContain("<!DOCTYPE html"); // Should be fragment, not full document
    });

    it("should include client name", () => {
      const html = reviewRequestEmail(data);
      expect(html).toContain("Hi John Doe");
    });

    it("should include company name", () => {
      const html = reviewRequestEmail(data);
      expect(html).toContain("Acme Corp");
    });

    it("should include review URL in button", () => {
      const html = reviewRequestEmail(data);
      expect(html).toContain(data.reviewUrl);
      expect(html).toContain("Write your review");
    });

    it("should escape HTML in client name", () => {
      const maliciousData = {
        ...data,
        clientName: "<script>alert('xss')</script>",
      };
      const html = reviewRequestEmail(maliciousData);
      expect(html).not.toContain("<script>");
      expect(html).toContain("&lt;script&gt;");
    });

    it("should escape HTML in company name", () => {
      const maliciousData = {
        ...data,
        company: "<img src=x onerror=alert(1)>",
      };
      const html = reviewRequestEmail(maliciousData);
      expect(html).not.toContain("<img src");
      expect(html).toContain("&lt;img");
    });

    it("should have consistent email styling", () => {
      const html = reviewRequestEmail(data);
      expect(html).toContain("font-family:Arial,sans-serif");
      expect(html).toContain("max-width:600px");
      expect(html).toContain("color:#172033");
    });
  });

  describe("reviewReceivedEmail", () => {
    const data: ReviewReceivedEmailData = {
      clientName: "Jane Smith",
      company: "Tech Solutions Inc",
      role: "CTO",
      rating: 5,
      testimonial: "Outstanding work! Exceeded all expectations.",
      dashboardUrl: "https://jlang.dev/studio/reviews",
    };

    it("should generate valid HTML email", () => {
      const html = reviewReceivedEmail(data);
      expect(html).toBeTruthy();
    });

    it("should include client name and company", () => {
      const html = reviewReceivedEmail(data);
      expect(html).toContain("Jane Smith");
      expect(html).toContain("Tech Solutions Inc");
    });

    it("should display star rating", () => {
      const html = reviewReceivedEmail(data);
      expect(html).toContain("⭐⭐⭐⭐⭐");
      expect(html).toContain("5/5");
    });

    it("should display correct number of stars for different ratings", () => {
      const threeStarData = { ...data, rating: 3 };
      const html = reviewReceivedEmail(threeStarData);
      expect(html).toContain("⭐⭐⭐");
      expect(html).toContain("3/5");
    });

    it("should include testimonial text", () => {
      const html = reviewReceivedEmail(data);
      expect(html).toContain("Outstanding work! Exceeded all expectations.");
    });

    it("should include role", () => {
      const html = reviewReceivedEmail(data);
      expect(html).toContain("CTO");
    });

    it("should include dashboard link", () => {
      const html = reviewReceivedEmail(data);
      expect(html).toContain(data.dashboardUrl);
      expect(html).toContain("View in Dashboard");
    });

    it("should escape HTML in testimonial", () => {
      const maliciousData = {
        ...data,
        testimonial: "<script>alert('xss')</script>",
      };
      const html = reviewReceivedEmail(maliciousData);
      expect(html).not.toContain("<script>");
      expect(html).toContain("&lt;script&gt;");
    });
  });

  describe("jordanResponseEmail", () => {
    const baseData: JordanResponseEmailData = {
      clientName: "Bob Johnson",
      message: "Thank you for the wonderful review!",
      action: "publish",
      reviewUrl: "https://jlang.dev/review/token456",
    };

    it("should generate valid HTML email for publish action", () => {
      const html = jordanResponseEmail(baseData);
      expect(html).toBeTruthy();
    });

    it("should show published title when action is publish", () => {
      const html = jordanResponseEmail(baseData);
      expect(html).toContain("Your review has been published!");
    });

    it("should show response title when action is request_revision", () => {
      const data = { ...baseData, action: "request_revision" as const };
      const html = jordanResponseEmail(data);
      expect(html).toContain("Jordan has responded to your review");
    });

    it("should include client name", () => {
      const html = jordanResponseEmail(baseData);
      expect(html).toContain("Hi Bob Johnson");
    });

    it("should include Jordan's message", () => {
      const html = jordanResponseEmail(baseData);
      expect(html).toContain("Thank you for the wonderful review!");
    });

    it("should preserve whitespace in message", () => {
      const data = {
        ...baseData,
        message: "Line 1\nLine 2\n\nLine 3",
      };
      const html = jordanResponseEmail(data);
      expect(html).toContain("white-space:pre-wrap");
    });

    it("should include review URL for request_revision", () => {
      const data = { ...baseData, action: "request_revision" as const };
      const html = jordanResponseEmail(data);
      expect(html).toContain(data.reviewUrl);
      expect(html).toContain("View Your Review");
    });

    it("should not include review URL button for publish", () => {
      const html = jordanResponseEmail(baseData);
      expect(html).not.toContain("View Your Review");
    });

    it("should show thank you message for publish", () => {
      const html = jordanResponseEmail(baseData);
      expect(html).toContain("Your review is now live on the JLang Development website");
    });

    it("should escape HTML in message", () => {
      const maliciousData = {
        ...baseData,
        message: "<script>alert('xss')</script>",
      };
      const html = jordanResponseEmail(maliciousData);
      expect(html).not.toContain("<script>");
      expect(html).toContain("&lt;script&gt;");
    });
  });

  describe("reviewPublishedEmail", () => {
    const data: ReviewPublishedEmailData = {
      clientName: "Alice Williams",
      company: "Digital Ventures",
      websiteUrl: "https://jlang.dev/#testimonials",
    };

    it("should generate valid HTML email", () => {
      const html = reviewPublishedEmail(data);
      expect(html).toBeTruthy();
    });

    it("should include client name", () => {
      const html = reviewPublishedEmail(data);
      expect(html).toContain("Hi Alice Williams");
    });

    it("should include company name", () => {
      const html = reviewPublishedEmail(data);
      expect(html).toContain("Digital Ventures");
    });

    it("should include website URL", () => {
      const html = reviewPublishedEmail(data);
      expect(html).toContain(data.websiteUrl);
      expect(html).toContain("See your review");
    });

    it("should have celebratory tone", () => {
      const html = reviewPublishedEmail(data);
      expect(html).toContain("Your review is live!");
    });

    it("should escape HTML in company name", () => {
      const maliciousData = {
        ...data,
        company: "<script>alert('xss')</script>",
      };
      const html = reviewPublishedEmail(maliciousData);
      expect(html).not.toContain("<script>");
      expect(html).toContain("&lt;script&gt;");
    });
  });

  describe("Email consistency", () => {
    it("all emails should use consistent base styling", () => {
      const reviewRequest = reviewRequestEmail({
        clientName: "Test",
        company: "Test Co",
        reviewUrl: "https://test.com",
      });
      const reviewReceived = reviewReceivedEmail({
        clientName: "Test",
        company: "Test Co",
        role: "CEO",
        rating: 5,
        testimonial: "Great",
        dashboardUrl: "https://test.com",
      });
      const jordanResponse = jordanResponseEmail({
        clientName: "Test",
        message: "Thanks",
        action: "publish",
        reviewUrl: "https://test.com",
      });
      const reviewPublished = reviewPublishedEmail({
        clientName: "Test",
        company: "Test Co",
        websiteUrl: "https://test.com",
      });

      // All should have the same base wrapper styles
      const baseStyles = [
        "font-family:Arial,sans-serif",
        "max-width:600px",
        "margin:auto",
        "color:#172033",
        "line-height:1.65",
      ];

      for (const style of baseStyles) {
        expect(reviewRequest).toContain(style);
        expect(reviewReceived).toContain(style);
        expect(jordanResponse).toContain(style);
        expect(reviewPublished).toContain(style);
      }
    });

    it("all buttons should use consistent styling", () => {
      const buttonStyle = "background:#4f46e5;color:white;padding:13px 22px;border-radius:10px";

      const reviewRequest = reviewRequestEmail({
        clientName: "Test",
        company: "Test Co",
        reviewUrl: "https://test.com",
      });
      expect(reviewRequest).toContain(buttonStyle);

      const reviewReceived = reviewReceivedEmail({
        clientName: "Test",
        company: "Test Co",
        role: "CEO",
        rating: 5,
        testimonial: "Great",
        dashboardUrl: "https://test.com",
      });
      expect(reviewReceived).toContain(buttonStyle);

      const reviewPublished = reviewPublishedEmail({
        clientName: "Test",
        company: "Test Co",
        websiteUrl: "https://test.com",
      });
      expect(reviewPublished).toContain(buttonStyle);
    });
  });
});
