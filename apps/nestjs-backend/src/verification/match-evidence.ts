import type { ProductExtraction, SourceEvidence } from "../ai/ai-gateway.service";
import { isOfficialSource } from "../ai/ai-gateway.service";
import type { VerificationResponse, VerificationStatus } from "./verification.types";

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("vi").replace(/[^a-z0-9]+/g, " ").trim();

function claimAppears(claim: string | null, text: string): boolean {
  if (!claim?.trim()) return false;
  const normalizedClaim = normalize(claim);
  const normalizedText = normalize(text);
  if (normalizedText.includes(normalizedClaim)) return true;
  const words = normalizedClaim.split(/\s+/).filter((word) => word.length > 2);
  return words.length > 1 && words.filter((word) => normalizedText.includes(word)).length >= Math.ceil(words.length * 0.8);
}

function starsIn(text: string): number | null {
  const match = text.match(/(?:ocop\s*)?([3-5])\s*(?:sao|star)|([3-5])\s*[-–]?\s*sao\s*ocop/i);
  return match ? Number(match[1] ?? match[2]) : null;
}

export function buildVerification(extracted: ProductExtraction, evidence: SourceEvidence[], sourceError?: string): VerificationResponse {
  const officialEvidence = evidence.filter((item) => isOfficialSource(item.url));
  const candidate = officialEvidence.find((item) => {
    const text = `${item.title} ${item.excerpt}`;
    const entityClaims = [extracted.brand, extracted.manufacturer].filter((claim): claim is string => Boolean(claim?.trim()));
    return claimAppears(extracted.productName, text) && entityClaims.some((claim) => claimAppears(claim, text));
  });
  const candidateText = candidate ? `${candidate.title} ${candidate.excerpt}` : "";
  const locationMatches = !extracted.location || claimAppears(extracted.location, candidateText);
  const officialStars = candidate ? starsIn(candidateText) : null;
  let status: VerificationStatus = "unverified";
  if (candidate && locationMatches && officialStars && extracted.claimedStars && officialStars !== extracted.claimedStars) status = "conflict";
  else if (candidate && locationMatches && officialStars && extracted.claimedStars === officialStars) status = "verified";

  const starsLabel = extracted.claimedStars ? `${extracted.claimedStars} sao ghi trên nhãn` : "không đọc được số sao OCOP trên nhãn";
  const statusTitle = status === "verified"
    ? "Có nguồn chính thức khớp thông tin OCOP"
    : status === "conflict"
      ? "Nguồn chính thức có thông tin sao khác với nhãn"
      : "Chưa đủ bằng chứng chính thức để xác minh";
  const record = status === "verified" || status === "conflict" ? candidate : undefined;
  const advice = status === "verified"
    ? "Nguồn chính thức được liên kết bên dưới. Hãy kiểm tra đơn vị sản xuất, địa chỉ và thời hạn công nhận trên bao bì thực tế trước khi mua."
    : status === "conflict"
      ? "Không nên dựa vào nhãn để kết luận. Mở nguồn chính thức bên dưới và liên hệ cơ quan công nhận nếu thông tin vẫn không rõ."
      : "Chưa tìm được bằng chứng chính thức đủ để kết luận sản phẩm có hay không có chứng nhận. Hãy kiểm tra nguồn OCOP của tỉnh hoặc liên hệ cơ quan địa phương trước khi mua.";

  const comparisonPoints = [
    { criteria: "Tên sản phẩm", on_label: extracted.productName ?? "Chưa đọc được", official_record: record?.title ?? "Chưa có hồ sơ nguồn đủ khớp", is_match: record ? true : null, note: record ? "Có trong kết quả nguồn chính thức" : "Chưa xác minh được" },
    { criteria: "Cơ sở / thương hiệu", on_label: extracted.brand ?? extracted.manufacturer ?? "Chưa đọc được", official_record: record?.excerpt ?? "Chưa có hồ sơ nguồn đủ khớp", is_match: record ? true : null, note: record ? "Tên chủ thể xuất hiện trong nguồn" : "Chưa xác minh được" },
    { criteria: "Địa chỉ cơ sở", on_label: extracted.address ?? "Chưa đọc được", official_record: record?.excerpt ?? "Chưa có hồ sơ nguồn đủ khớp", is_match: null, note: "Mở nguồn để đối chiếu địa chỉ" },
    { criteria: "Xếp hạng sao OCOP", on_label: starsLabel, official_record: officialStars ? `${officialStars} sao trong nguồn` : "Nguồn chưa hiển thị hạng sao", is_match: status === "verified" ? true : status === "conflict" ? false : null, note: status === "conflict" ? "Có sai khác cần kiểm tra" : status === "verified" ? "Khớp thông tin nhìn thấy" : "Chưa xác minh được" },
    { criteria: "Địa phương", on_label: extracted.location ?? "Chưa đọc được", official_record: record ? record.url : "Chưa có hồ sơ nguồn đủ khớp", is_match: record && extracted.location ? true : null, note: record && extracted.location ? "Địa phương xuất hiện trong nguồn" : "Mở nguồn để đối chiếu địa bàn" },
  ];

  const narrative = status === "verified"
    ? `Nhãn cho biết ${extracted.productName ?? "sản phẩm"} ${starsLabel}. Một nguồn trên miền cơ quan nhà nước có tên sản phẩm, chủ thể và số sao tương ứng.\n\nĐây là đối chiếu tự động từ thông tin đọc được và kết quả nguồn được dẫn; hãy mở nguồn gốc để kiểm tra quyết định công nhận, địa bàn và thời hạn.`
    : status === "conflict"
      ? `Nhãn ghi ${starsLabel}, trong khi nguồn chính thức được tìm thấy nêu ${officialStars} sao.\n\nĐây là sai khác cần xác minh trực tiếp với cơ quan công nhận; hệ thống không thể kết luận sản phẩm giả chỉ từ điểm khác này.`
      : `Hệ thống đọc được ${extracted.productName ?? "tên sản phẩm chưa rõ"} và ${extracted.brand ?? extracted.manufacturer ?? "chưa xác định được cơ sở"}. ${sourceError ? "Tra cứu nguồn chính thức hiện không khả dụng." : "Chưa có nguồn chính thức đủ khớp để xác nhận chứng nhận."}\n\nKhông tìm thấy hồ sơ trong lượt tra cứu này không chứng minh rằng sản phẩm không được chứng nhận.`;

  return {
    status,
    extracted: {
      brand: extracted.brand,
      manufacturer: extracted.manufacturer,
      address: extracted.address,
      product_name: extracted.productName,
      location: extracted.location,
      claimed_stars: extracted.claimedStars,
      has_ocop_logo: extracted.hasOcopLogo,
      has_qr_code: extracted.hasQrCode,
      raw_text_summary: extracted.rawTextSummary,
    },
    local_ocop_record: {
      is_certified: status === "verified" ? true : status === "conflict" ? null : null,
      official_stars: officialStars,
      official_product_name: record?.title ?? null,
      certifying_authority: null,
      district: null,
      province: null,
      recognition_details: null,
    },
    verdict: {
      code: status === "verified" ? "VERIFIED_OCOP_MATCH" : status === "conflict" ? "CONFLICTING_OFFICIAL_EVIDENCE" : "INSUFFICIENT_EVIDENCE",
      title: statusTitle,
      severity: status === "verified" ? "success" : "warning",
      confidence_score: null,
    },
    comparison_text: narrative,
    comparison_points: comparisonPoints,
    consumer_advice: advice,
    evidence: officialEvidence,
    checked_at: new Date().toISOString(),
  };
}
