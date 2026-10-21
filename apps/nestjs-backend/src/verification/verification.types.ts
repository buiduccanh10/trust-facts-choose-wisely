export type VerificationStatus = "verified" | "conflict" | "unverified";

export interface EvidenceItem {
  title: string;
  url: string;
  excerpt: string;
  retrievedAt: string;
}

export interface VerificationResponse {
  status: VerificationStatus;
  extracted: {
    brand: string | null;
    manufacturer: string | null;
    address: string | null;
    product_name: string | null;
    location: string | null;
    claimed_stars: number | null;
    has_ocop_logo: boolean | null;
    has_qr_code: boolean | null;
    raw_text_summary: string;
  };
  local_ocop_record: {
    is_certified: boolean | null;
    official_stars: number | null;
    official_product_name: string | null;
    certifying_authority: string | null;
    district: string | null;
    province: string | null;
    recognition_details: string | null;
  };
  verdict: {
    code: "VERIFIED_OCOP_MATCH" | "CONFLICTING_OFFICIAL_EVIDENCE" | "INSUFFICIENT_EVIDENCE";
    title: string;
    severity: "success" | "warning" | "danger";
    confidence_score: number | null;
  };
  comparison_text: string;
  comparison_points: Array<{
    criteria: string;
    on_label: string;
    official_record: string;
    is_match: boolean | null;
    note: string;
  }>;
  consumer_advice: string;
  evidence: EvidenceItem[];
  checked_at: string;
}
