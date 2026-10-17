"""
OCOP Database Manager and Fuzzy Matcher
Matches AI-extracted brand, location, and product type against official OCOP records.
"""

import json
from pathlib import Path
from typing import Optional, Dict, Any, List, Tuple
from rapidfuzz import fuzz

DATA_DIR = Path(__file__).resolve().parent / "data"
DATABASE_PATH = DATA_DIR / "ocop_database.json"

class OCOPDatabase:
    def __init__(self, db_path: Path = DATABASE_PATH):
        self.db_path = db_path
        self._products: List[Dict[str, Any]] = []
        self.reload()

    def reload(self):
        if self.db_path.exists():
            with open(self.db_path, "r", encoding="utf-8") as f:
                self._products = json.load(f)
        else:
            self._products = []

    def get_all(self) -> List[Dict[str, Any]]:
        return self._products

    def get_by_id(self, product_id: str) -> Optional[Dict[str, Any]]:
        for p in self._products:
            if p["id"] == product_id:
                return p
        return None

    def get_categories(self) -> List[str]:
        cats = {p.get("category_name", p.get("category", "")).strip() for p in self._products}
        return sorted([c for c in cats if c])

    def find_match(
        self,
        brand: Optional[str] = None,
        product_type: Optional[str] = None,
        location: Optional[str] = None,
        category: Optional[str] = None,
        min_score: float = 65.0
    ) -> Tuple[Optional[Dict[str, Any]], float, Dict[str, Any]]:
        """
        Match extracted information with the OCOP database.
        Returns: (best_match_product, score, details)
        """
        if not self._products:
            return None, 0.0, {"reason": "Database is empty"}

        brand_clean = (brand or "").strip().lower()
        prod_clean = (product_type or "").strip().lower()
        loc_clean = (location or "").strip().lower()
        cat_clean = (category or "").strip().lower()

        best_product = None
        highest_score = 0.0
        best_details = {}

        # Pre-filter by category if explicitly supplied (not "all")
        candidates = self._products
        if cat_clean and cat_clean not in ["tất cả", "all", "auto", "tự động"]:
            filtered = [
                p for p in self._products
                if cat_clean in p["category"].lower() or cat_clean in p.get("category_name", "").lower()
            ]
            if filtered:
                candidates = filtered

        for p in candidates:
            # Score Brand
            p_brand = p["brand"].lower()
            brand_scores = [
                fuzz.token_sort_ratio(brand_clean, p_brand),
                fuzz.partial_ratio(brand_clean, p_brand),
                fuzz.partial_ratio(p_brand, brand_clean)
            ]
            for alias in p.get("brand_aliases", []):
                alias_clean = alias.lower()
                brand_scores.append(fuzz.token_sort_ratio(brand_clean, alias_clean))
                brand_scores.append(fuzz.partial_ratio(brand_clean, alias_clean))
                brand_scores.append(fuzz.partial_ratio(alias_clean, brand_clean))

            max_brand_score = max(brand_scores) if brand_scores else 0

            # Score Product Type
            p_name = p["product_name"].lower()
            p_cat = p["category"].lower()
            prod_scores = [
                fuzz.partial_ratio(prod_clean, p_name),
                fuzz.partial_ratio(prod_clean, p_cat),
                fuzz.token_set_ratio(prod_clean, p_name)
            ] if prod_clean else [50.0]
            max_prod_score = max(prod_scores)

            # Score Location
            p_loc = p["location"].lower()
            p_prov = p.get("province", "").lower()
            loc_scores = [
                fuzz.partial_ratio(loc_clean, p_loc),
                fuzz.partial_ratio(loc_clean, p_prov),
                fuzz.token_set_ratio(loc_clean, p_loc)
            ] if loc_clean else [50.0]
            max_loc_score = max(loc_scores)

            # Weighted overall score
            # Brand is most critical (60%), Product Type (25%), Location (15%)
            if brand_clean:
                total_score = (max_brand_score * 0.60) + (max_prod_score * 0.25) + (max_loc_score * 0.15)
            else:
                total_score = (max_prod_score * 0.65) + (max_loc_score * 0.35)

            if total_score > highest_score:
                highest_score = total_score
                best_product = p
                best_details = {
                    "brand_score": round(max_brand_score, 1),
                    "product_score": round(max_prod_score, 1),
                    "location_score": round(max_loc_score, 1),
                    "total_score": round(total_score, 1)
                }

        if highest_score >= min_score and best_product:
            return best_product, round(highest_score, 1), best_details

        return None, round(highest_score, 1), best_details


# Singleton instance
ocop_db = OCOPDatabase()
