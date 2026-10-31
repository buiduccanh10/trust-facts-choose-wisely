export type VerificationStatus = "verified" | "conflict" | "unverified";

export type EvidenceItem = {
  title: string;
  url: string;
  excerpt: string;
  retrievedAt: string;
};

export type ExtractedProductData = {
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

export type VerifiedProductInfo = {
  product_name: string | null;
  brand: string | null;
  manufacturer: string | null;
  address: string | null;
  location: string | null;
  stars: number | null;
  stars_source: "tako" | "google" | "official" | null;
  summary: string;
};

export type LocalOcopRecord = {
  is_certified: boolean | null;
  official_stars: number | null;
  official_product_name: string | null;
  certifying_authority: string | null;
  district: string | null;
  province: string | null;
  recognition_details: string | null;
};

export type VerificationVerdict = {
  code: string;
  title: string;
  severity: "success" | "warning" | "danger";
  confidence_score: number | null;
};

export type ComparisonPoint = {
  criteria: string;
  on_label: string;
  official_record: string;
  is_match: boolean | null;
  note: string;
};

export type ArticleContext = {
  submitted_title: string;
  submitted_url: string;
  conclusion: string;
  best_match: EvidenceItem | null;
};

export type VerificationResultData = {
  status: VerificationStatus;
  extracted: ExtractedProductData;
  product_info: VerifiedProductInfo;
  local_ocop_record: LocalOcopRecord;
  verdict: VerificationVerdict;
  comparison_text: string;
  comparison_points: ComparisonPoint[];
  consumer_advice: string;
  evidence: EvidenceItem[];
  article_context?: ArticleContext;
  checked_at?: string;
};

export type VerificationMode = "image" | "url";
