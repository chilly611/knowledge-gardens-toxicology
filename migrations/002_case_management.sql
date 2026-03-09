-- Case Management Schema Migration
-- Applied: 2026-03-09 Session 13
-- Adds litigation case tracking to the Toxicology Knowledge Garden

-- Enum types
CREATE TYPE case_type AS ENUM ('toxic_tort','environmental','product_liability','occupational','class_action','mdi','other');
CREATE TYPE case_status AS ENUM ('intake','active','discovery','trial_prep','trial','settlement','closed','appeal');
CREATE TYPE party_role AS ENUM ('plaintiff','defendant','expert_plaintiff','expert_defense','counsel_plaintiff','counsel_defense','judge','mediator');
CREATE TYPE document_category AS ENUM ('medical_records','expert_reports','depositions','motions','correspondence','evidence','trial_docs','administrative','research','other');

-- Tables: experts, cases, case_parties, case_documents, case_substances, case_events
-- All with RLS, auto-updated timestamps, proper indexes
-- See Supabase dashboard for full schema

-- Key IDs:
-- Case: 55021415-8769-4abe-93ba-5b0887110b74 (Sky Valley PCB Case)
-- Expert: 3e5b00a1-0756-4065-9738-407444514106 (Dr. James Dahlgren)
