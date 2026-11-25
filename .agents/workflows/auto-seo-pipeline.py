"""
Multi-Agent Auto-SEO Workflow for gofpt.vn
Orchestrates:
1. Research & Keyword Spy Agent
2. SEO Content Writer Agent (Clean & Minimal Editorial)
3. Google Ads Compliance & Technical Auditor Agent
4. Build & Verification Step
"""

topic = args.get("topic", "Lắp mạng FPT Quận Ninh Kiều Cần Thơ tốc độ Wi-Fi 6")
region = args.get("region", "Cần Thơ")

phase("1. Research & Keyword Spy")
research = await agent(
    f"""You are the Research & Keyword Spy Agent for gofpt.vn.
Read `/Users/macbookairm2/.gemini/antigravity/scratch/fpt-sieutoc/src/data/articles.json` to inspect existing articles and avoid keyword cannibalization.
Also read `/Users/macbookairm2/.gemini/antigravity/scratch/fpt-sieutoc/AGENTS.md`.
Target topic: {topic}
Target region: {region}

Return a structured SEO brief with:
- primary_keyword
- secondary_keywords (list of 4-5)
- title (55-65 chars, Vietnamese, engaging, Google Ads compliant)
- slug (lowercase Vietnamese without accents, hyphenated)
- excerpt (150-160 chars, with CTA)
- h2_outline (list of 4-5 numbered H2 headings)
- faq_questions (list of 2-3 realistic customer questions)
""",
    schema={
        "type": "object",
        "properties": {
            "primary_keyword": {"type": "string"},
            "secondary_keywords": {"type": "array", "items": {"type": "string"}},
            "title": {"type": "string"},
            "slug": {"type": "string"},
            "excerpt": {"type": "string"},
            "h2_outline": {"type": "array", "items": {"type": "string"}},
            "faq_questions": {"type": "array", "items": {"type": "string"}},
        },
        "required": ["primary_keyword", "title", "slug", "excerpt", "h2_outline", "faq_questions"],
    },
    role="Keyword Spy Agent",
    model="flash",
)
log("SEO Brief ready:", research.get("title"), "-> slug:", research.get("slug"))

phase("2. SEO Content Writer (Clean Editorial)")
draft = await agent(
    f"""You are the SEO Content Writer Agent for gofpt.vn.
Read `/Users/macbookairm2/.gemini/antigravity/scratch/fpt-sieutoc/AGENTS.md` and `/Users/macbookairm2/.gemini/antigravity/scratch/fpt-sieutoc/src/lib/seoAuditor.ts`.

Write a complete Vietnamese SEO article in Clean & Minimal Editorial HTML format based on this brief:
- Title: {research['title']}
- Slug: {research['slug']}
- Excerpt: {research['excerpt']}
- Primary Keyword: {research['primary_keyword']}
- Secondary Keywords: {research.get('secondary_keywords', [])}
- H2 Outline: {research['h2_outline']}
- FAQ Questions: {research['faq_questions']}

STRICT RULES:
1. Follow Google Ads Policy 100%: NO 'tuyệt đối', 'bảo hành trọn đời', 'số 1', 'tốt nhất', 'giảm 99%', 'duy nhất', 'hoàn toàn miễn phí' without conditions. Clearly act as FPT Telecom authorized sales/consultation channel.
2. Clean light-mode HTML ONLY (no dark boxes, no duplicate cover image inside body, no giant landing page cards).
3. Include internal links to `/lap-mang-fpt`, `/bang-gia`, `/combo-ngoai-hang-anh`.
4. End with the locked contact block:
   - Địa chỉ: Số 10 Phan Văn Trị, Phường Ninh Kiều, Thành phố Cần Thơ
   - Hotline: 0878 800 400
   - Zalo: https://zalo.me/0878800400
   - Email: PhucNT51@fpt.com

Save the article into `/Users/macbookairm2/.gemini/antigravity/scratch/fpt-sieutoc/src/data/articles.json`, `/Users/macbookairm2/.gemini/antigravity/scratch/fpt-sieutoc/data/articles.json`, and `INITIAL_ARTICLES` in `src/lib/articleStorage.ts`. Return the saved slug.""",
    schema={"type": "string"},
    role="SEO Writer Agent",
)
log("Draft saved for slug:", draft)

phase("3. Compliance & Technical Audit + SSG Build")
audit = await agent(
    f"""You are the Compliance & Technical Auditor Agent for gofpt.vn.
1. Scan `/Users/macbookairm2/.gemini/antigravity/scratch/fpt-sieutoc/src/data/articles.json` for all prohibited Google Ads patterns defined in `src/lib/seoAuditor.ts`.
2. Verify valid JSON in `src/data/articles.json` and `data/articles.json`.
3. Run `/Users/macbookairm2/.gemini/antigravity/bin/node ./node_modules/next/dist/bin/next build` inside `/Users/macbookairm2/.gemini/antigravity/scratch/fpt-sieutoc` and verify `/tin-tuc/{research['slug']}` is generated as static SSG.
Report pass/fail and any issues found.""",
    schema={
        "type": "object",
        "properties": {
            "passed": {"type": "boolean"},
            "build_ok": {"type": "boolean"},
            "notes": {"type": "string"},
        },
        "required": ["passed", "build_ok", "notes"],
    },
    role="Compliance & Build Auditor",
    model="flash",
)
log("Audit result:", audit)
