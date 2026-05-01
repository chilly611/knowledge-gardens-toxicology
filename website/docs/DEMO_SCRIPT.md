# Toxicology Knowledge Garden — Demo Script

A presenter's guide for a 30-second elevator pitch through seven evidence-backed surfaces. Use this script when internet is unavailable, or pair it with the autoplay tour at `/demo`.

---

## Opening (30 seconds)

Three evidence systems — consumer, clinician, counsel — all rooted in one claim: every assertion requires three sources, verified by an automated evidence engine. No marketing. No cherry-picking. The same 10 claims, 26 sources, and one landmark case play forward across three workflows, each producing a filing-grade PDF in under 90 seconds. The garden grows as evidence accrues. Contested claims stay contested. Regulatory disagreement (IARC vs EPA on glyphosate) lives side-by-side.

---

## Stage 1: Tidepool — The Front Door (3 seconds)

**Click or scroll the hero section.**

Show the bioluminescent organisms drifting. Explain: "Each organism is a substance — glyphosate, microplastics, PCBs. The floating orbs around them are claims tied to that substance. The manifesto appears as you scroll down. This is where wonder meets rigor."

**Objection to anticipate:** "Why bioluminescence?" Answer: "Evidence glows. We wanted the interface to feel alive, not like a database. The animation respects reduced-motion settings too."

---

## Stage 2: Loom — The Grid (5 seconds)

**Navigate to the homepage grid. Click on a cell or hover.**

Point to the grid structure. Explain: "Each cell is a claim. The color tells you the status: teal = certified, peach = provisional, crimson = contested. Substances are the warp; endpoints (health effects) are the weft. Every cell is backed by at least three sources. Click any cell to see what the sources say. It's a visual index of all verified toxicological relationships."

**Objection:** "Why not just a table?" Answer: "A table with 10 claims × 39 endpoints would be 390 rows. Visual proximity reveals patterns — you see clusters of teal around glyphosate, patches of crimson where IARC and EPA disagree. You understand the landscape faster."

---

## Stage 3: Contested Claims — Honest Disagreement (3 seconds)

**Click on the glyphosate × non-Hodgkin lymphoma cell (or use the deep-link cell parameter).**

Explain the side-by-side rendering. "Glyphosate and non-Hodgkin lymphoma is contested. IARC says probable carcinogen. EPA says safe. We don't pick a winner. We show both supporting sources (left, teal) and contradicting sources (right, crimson). A clinician, lawyer, or parent can read both and make their own call. This is the opposite of a search engine or a lobbied database."

**Objection:** "Won't this confuse people?" Answer: "It will if they're looking for a simple yes/no. But honest toxicology is rarely simple. Our users are researchers, healthcare providers, and litigators — people who need the full picture."

---

## Stage 4: Substance Detail — Four Tabs (4 seconds)

**Navigate to glyphosate (or another substance). Flip through the tabs.**

Tab 1: Overview — plain-language summary, key facts panel (CAS number, molecular formula), status breakdown.

Tab 2: Mechanism — how does it work? Hover over the EPSPS pathway diagram to see effect summaries.

Tab 3: Regulatory — here's where IARC vs EPA appears. Contested claims render side-by-side; non-contested claims show a single regulatory position card. Each source shows the publisher, year, and tier badge (Regulatory, Systematic Review, Peer-Reviewed, Industry/News).

Tab 4: Evidence — full source list, grouped by tier. Click any DOI to read the paper. Quotes are vetted and marked "pending verbatim verification" where they're still being fact-checked.

**Objection:** "This is a lot of data." Answer: "It is. But consumers can stop at the Overview tab. Clinicians might dive into Mechanism + Evidence. Counsel needs all four. The structure scales with expertise."

---

## Stage 5: Counsel Flow with Sky Valley — Five Stages (8 seconds)

**Navigate to `/flow/counsel?case=sky-valley`.**

"This is the killer app. Five stages: frame the case, assemble the parties and documents, argue with a Daubert table, witness the experts, and file a packet. We've preloaded the Sky Valley PCB case — Erickson v. Monsanto, 2016, Washington. Dr. Dahlgren is the lead toxicology expert."

Walk through each stage briefly:
- **Frame:** Substance checklist (PCBs + Dioxin pre-selected), jurisdiction (WA), theory of harm (carcinogenicity).
- **Assemble:** Parties, documents, and timeline from the case.
- **Argue:** A Daubert table — rows are claims, columns are regulatory sources, peer-review sources, and cross-exam risk.
- **Witness:** Expert cards. Dr. Dahlgren gets highlighted.
- **File:** Counsel name, firm, filing ref. Button opens the PDF preview.

"The PDF it generates is filing-grade. It has a TOC, theory-of-harm narrative, substance dossiers with verbatim quotes and DOI links, the Daubert table, expert bios, and a case timeline. Exhibit-ready. 90 seconds to generate."

**Objection:** "Can I use this for real litigation?" Answer: "The PDF is a starting point — an exhibit packet shell. You'll want a lawyer to customize the narrative and add case-specific evidence. But the heavy lifting — substance research, source vetting, Daubert prep — is done."

---

## Stage 6: PDF Generation — Filing Grade (3 seconds)

**Load `/pdf-preview/counsel?case=sky-valley`. Show the print layout.**

"Here's what the download looks like. Cover page with caduceus watermark. TOC. Theory-of-harm narrative (pulled from the case or constructed from the substances). Substance dossiers — one page per substance, all certified and contested claims, sources grouped by tier, quotes with DOI links. Daubert table. Expert credentials. Case timeline. Exhibit certification page — a disclaimer that quotes are pending final verbatim verification, confidence scores are computed, not attorney work product."

Print to PDF or show the print preview. "Partners download this and drop it into their case management system. No retyping. No source hunting. The evidence is already there."

**Objection:** "What about liability?" Answer: "The footer of every page says the evidence is automatically derived from TOX and should be verified against primary sources. It's a research tool, not a final brief."

---

## Stage 7: Cross-Garden Context — The Umbrella (3 seconds)

**Navigate to `/substance/glyphosate`. Scroll to the Evidence tab or the cross-garden links section.**

"The Toxicology Garden is one node in a larger umbrella. Health Knowledge Garden (HKG) links to clinical biomarkers and endpoints. NatureMark links to ecological data. Every substance in TKG is wired to these siblings. When you're researching glyphosate, you can jump to its cardiovascular biomarkers in HKG, or its aquatic persistence scores in NatureMark."

Point to the visual links (colored emblems, garden names, relation types).

"This is the proof-of-concept for a federated evidence network. No central authority. Each garden is maintained independently. Toxicology, Health, Nature, Builders — they're all verified, all transparent, all linked."

**Objection:** "When will the other gardens launch?" Answer: "Sequentially. The architecture is here. HKG is next."

---

## Closing (60 seconds)

**Summarize and ask.**

"What we've built is a three-part system. First, an automated evidence engine that pulls from regulatory, peer-reviewed, and industry sources, auto-tags them by tier, and flags contested claims when they exist. Second, three audience-specific workflows — consumer, clinician, counsel — that let you extract evidence for your use case in under five minutes. Third, a filing-grade PDF generator that's 90-second fast and defensible because it sources everything and marks what's still pending verification.

The ask: we want to work with you to fold in your domain expertise. If you're a toxicologist, help us expand the substance library and vet the mechanism diagrams. If you're a healthcare provider, tell us what data points clinicians actually need in the differential stage. If you're a lawyer, use the PDF and tell us what's missing for a real case.

This is evidence-first, not advocacy-first. Contested claims stay contested. Regulatory disagreement is transparent. Sources are always linked. That's the commitment.

Are you interested in a 30-minute deep dive on the Sky Valley case, or in connecting with the team on a specific integration?"

**Partner-Specific URLs (if they want to take next steps):**
- Dr. Dahlgren preset: `{baseURL}/flow/counsel?case=sky-valley&from=dahlgren`
- Clinician preset (John Bou): `{baseURL}/flow/clinician?from=bou`
- Full demo tour: `{baseURL}/demo`

---

## Notes for offline use

- Print this document.
- Memorize the opening (30 sec) and closing (60 sec).
- Use the stage numbers and descriptions to navigate manually if the internet drops.
- Each stage lasts 2–8 seconds on the autoplay tour; you can pause or skip with the controls at `/demo`.
