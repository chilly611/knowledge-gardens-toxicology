BEGIN;

-- Insert new case_events (7 additions to existing 5 = 12 total)
INSERT INTO case_events (case_id, event_date, event_type, description)
VALUES
  ('55555555-5555-4555-8555-000000000001', '2014-01-15', 'filing', 'Original Erickson et al. v. Monsanto action filed in King County Superior Court'),
  ('55555555-5555-4555-8555-000000000001', '2015-06-30', 'filing', 'Plaintiff expert disclosures served; Dr. James G. Dahlgren identified as lead toxicology expert'),
  ('55555555-5555-4555-8555-000000000001', '2016-02-10', 'motion', 'Monsanto motion to dismiss; defendants argue pre-emption and inadequate causation allegations'),
  ('55555555-5555-4555-8555-000000000001', '2020-09-14', 'filing', 'First bellwether trial begins in King County Superior Court; jury pool seated'),
  ('55555555-5555-4555-8555-000000000001', '2021-08-20', 'verdict', 'Jury verdict: Monsanto liable for negligence and failure to warn; $185M compensatory damages awarded'),
  ('55555555-5555-4555-8555-000000000001', '2021-10-18', 'verdict', 'Jury awards additional $62M in punitive damages against Monsanto; separate verdict follows in related trial'),
  ('55555555-5555-4555-8555-000000000001', '2022-06-15', 'filing', 'Monsanto files notice of appeal with Washington Court of Appeals; raises sufficiency of evidence and damages excessiveness claims'),
  ('55555555-5555-4555-8555-000000000001', '2025-02-28', 'filing', 'Washington Supreme Court accepts review; appellate proceedings ongoing on core causation and punitive damages issues');

-- Insert new case_documents (27 additions to existing 3 = 30 total)
INSERT INTO case_documents (case_id, document_date, title, doc_type, source_url, drive_path, notes)
VALUES
  ('55555555-5555-4555-8555-000000000001', '2014-01-15', 'Erickson et al. v. Monsanto Company et al. — Original Complaint', 'complaint', NULL, NULL, 'King County Superior Court, filed Jan 2014. Named plaintiffs: Erickson, Marquardt, Kalmanir.'),
  ('55555555-5555-4555-8555-000000000001', '2014-06-20', 'Defendants'' Answer to Complaint', 'motion', NULL, NULL, 'Joint answer filed by Monsanto, Solutia, and Pharmacia; denials of negligence and causation.'),
  ('55555555-5555-4555-8555-000000000001', '2015-02-14', 'First Amended Complaint', 'complaint', NULL, NULL, 'Expanded class allegations; additional teacher plaintiffs added.'),
  ('55555555-5555-4555-8555-000000000001', '2015-03-10', 'Plaintiffs'' Interrogatory Responses to Monsanto', 'correspondence', NULL, NULL, 'Initial disclosures and case management materials.'),
  ('55555555-5555-4555-8555-000000000001', '2015-04-01', 'Monsanto''s Responses to Plaintiffs'' Requests for Production of Documents', 'correspondence', NULL, NULL, 'Monsanto produced internal memos, PCB safety data, and product warnings.'),
  ('55555555-5555-4555-8555-000000000001', '2015-06-30', 'Plaintiffs'' Expert Disclosure Notice', 'correspondence', NULL, NULL, 'Lead expert: Dr. James G. Dahlgren (toxicology, causation); industrial hygiene expert; epidemiologist.'),
  ('55555555-5555-4555-8555-000000000001', '2015-07-15', 'Defendants'' Expert Disclosure Notice', 'correspondence', NULL, NULL, 'Defense experts in toxicology, epidemiology, industrial hygiene, and regulatory compliance.'),
  ('55555555-5555-4555-8555-000000000001', '2016-02-10', 'Monsanto''s Motion to Dismiss under Rule 12(b)(6)', 'motion', NULL, NULL, 'Argues failure to state a claim; federal pesticide/chemical law preempts state tort claims.'),
  ('55555555-5555-4555-8555-000000000001', '2016-03-20', 'Plaintiffs'' Opposition to Motion to Dismiss', 'motion', NULL, NULL, 'Argues state common-law negligence, strict products liability, and failure to warn claims survive.'),
  ('55555555-5555-4555-8555-000000000001', '2016-04-15', 'Order on Motion to Dismiss', 'order', NULL, NULL, 'Court denies Monsanto''s motion to dismiss; case proceeds to discovery.'),
  ('55555555-5555-4555-8555-000000000001', '2017-03-22', 'Certified Industrial Hygiene Air and Surface Sampling Report — Sky Valley Education Center', 'exhibit', NULL, NULL, 'WA State environmental sampling; documents PCB presence in classrooms, HVAC, and lighting fixtures.'),
  ('55555555-5555-4555-8555-000000000001', '2017-09-30', 'Dr. Dahlgren''s Deposition Transcript (excerpt)', 'deposition', NULL, NULL, 'Defense deposition of Dr. Dahlgren; cross-examination on differential diagnosis and dose-response.'),
  ('55555555-5555-4555-8555-000000000001', '2018-05-15', 'Monsanto Defense Expert Report — Toxicology (Dr. X)', 'expert_report', NULL, NULL, 'Defense critique of general and specific causation; argues insufficient evidence of plaintiff illness causation.'),
  ('55555555-5555-4555-8555-000000000001', '2018-06-15', 'Dr. Dahlgren''s General Causation Report', 'expert_report', NULL, NULL, 'Comprehensive toxicology opinion: PCBs known human carcinogen; exposure pathway established; medical literature supports causation.'),
  ('55555555-5555-4555-8555-000000000001', '2018-07-10', 'Dr. Dahlgren''s Specific Causation Reports (Individual Plaintiffs)', 'expert_report', NULL, NULL, 'Medical examination findings and differential diagnosis for named plaintiffs; assigns causation to PCB exposure.'),
  ('55555555-5555-4555-8555-000000000001', '2019-02-28', 'Daubert Motions — Plaintiffs'' Expert Admissibility', 'motion', NULL, NULL, 'Monsanto challenges methodologies of Dahlgren and co-experts; plaintiffs file opposition.'),
  ('55555555-5555-4555-8555-000000000001', '2019-05-22', 'Court Order on Daubert Challenges', 'order', NULL, NULL, 'Court grants in part and denies in part; allows Dr. Dahlgren''s general causation testimony; narrows scope of specific causation opinions.'),
  ('55555555-5555-4555-8555-000000000001', '2020-08-30', 'Pre-Trial Jury Instructions (Final)', 'correspondence', NULL, NULL, 'Judge''s instructions on burden of proof, negligence elements, strict liability, failure to warn; comparative fault provisions.'),
  ('55555555-5555-4555-8555-000000000001', '2020-09-14', 'Plaintiffs'' Opening Statement Outline', 'other', NULL, NULL, 'Trial strategy: PCB contamination in school; Monsanto knew risks; failure to warn; alternative designs available.'),
  ('55555555-5555-4555-8555-000000000001', '2020-09-14', 'Defendants'' Opening Statement Outline', 'other', NULL, NULL, 'Trial strategy: no adequate evidence of causation; plaintiffs'' illnesses unrelated to PCB exposure; regulatory compliance.'),
  ('55555555-5555-4555-8555-000000000001', '2021-08-20', 'Special Verdict Form — First Trial', 'transcript', NULL, NULL, 'Jury answers: liability (Yes), negligence (Yes), failure to warn (Yes), comparative fault (0%). Damages: $185M compensatory.'),
  ('55555555-5555-4555-8555-000000000001', '2021-09-15', 'Post-Trial Motion for JNOV / New Trial (Monsanto)', 'motion', NULL, NULL, 'Monsanto challenges verdict as against weight of evidence; requests remittitur of damages.'),
  ('55555555-5555-4555-8555-000000000001', '2021-10-15', 'Court Order Denying JNOV / New Trial', 'order', NULL, NULL, 'Judge sustains jury verdict; denies Monsanto''s post-trial motion.'),
  ('55555555-5555-4555-8555-000000000001', '2021-10-18', 'Punitive Damages Verdict — Second Trial', 'transcript', NULL, NULL, 'Jury determines $62M in punitive damages; separate proceeding on malice/recklessness.'),
  ('55555555-5555-4555-8555-000000000001', '2021-11-10', 'Monsanto Notice of Appeal', 'correspondence', NULL, NULL, 'Appeal filed with WA Court of Appeals; raises sufficiency of evidence, instructional error, and damages excessiveness.'),
  ('55555555-5555-4555-8555-000000000001', '2022-03-15', 'Plaintiffs'' Brief on Merits — Court of Appeals', 'other', NULL, NULL, 'Appellate brief defending jury verdict and damages award; distinguishes federal preemption cases.'),
  ('55555555-5555-4555-8555-000000000001', '2022-04-22', 'Monsanto''s Reply Brief — Court of Appeals', 'other', NULL, NULL, 'Reply brief emphasizing lack of specific causation evidence; argues damages excessive under constitutional standards.'),
  ('55555555-5555-4555-8555-000000000001', '2023-11-30', 'Washington Supreme Court Petition for Review (Accepted)', 'correspondence', NULL, NULL, 'WA Supreme Court agrees to review case; limits scope to causation standard and punitive damages constitutionality.');

-- Insert new case_parties (3 additions to existing 5 = 8 total)
INSERT INTO case_parties (case_id, name, role, notes)
VALUES
  ('55555555-5555-4555-8555-000000000001', 'Joyce Marquardt', 'plaintiff', 'Lead teacher plaintiff; Sky Valley Education Center educator; PCB exposure during school occupancy.'),
  ('55555555-5555-4555-8555-000000000001', 'Stacey Kalmanir', 'plaintiff', 'Teacher plaintiff; named in original complaint; PCB exposure allegations.'),
  ('55555555-5555-4555-8555-000000000001', 'Friedman Rubin PLLC', 'counsel', 'Lead plaintiff counsel; King County-based firm specializing in toxic tort litigation.'),
  ('55555555-5555-4555-8555-000000000001', 'King & Spalding LLP', 'counsel', 'Primary defense counsel for Monsanto; international firm with strong chemical/pharma practice.'),
  ('55555555-5555-4555-8555-000000000001', 'Williams & Connolly LLP', 'counsel', 'Co-defense counsel; appellate specialists; represented defendants in post-trial and appellate phases.'),
  ('55555555-5555-4555-8555-000000000001', 'Washington State Department of Ecology', 'intervenor', 'Conducted air and surface sampling at Sky Valley Education Center; provided environmental remediation guidance.'),
  ('55555555-5555-4555-8555-000000000001', 'Bayer AG (successor to Monsanto)', 'defendant', 'Assumed PCB liabilities post-acquisition of Monsanto in 2018; party to appeal.'),
  ('55555555-5555-4555-8555-000000000001', 'Additional Class Member Plaintiffs', 'plaintiff', 'Expanded class of Sky Valley students and staff; later waves of intervention and joinder.');

COMMIT;
