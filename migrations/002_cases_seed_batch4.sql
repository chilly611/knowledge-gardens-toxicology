-- Batch 4: folders 66-82 + root files

INSERT INTO case_documents (case_id, name, category, file_type, drive_folder_path) VALUES
('55021415-8769-4abe-93ba-5b0887110b74', 'Report', 'expert_report'::document_category, 'folder', 'Sky Valley PCB Case/Report'),
('55021415-8769-4abe-93ba-5b0887110b74', 'Reports for Attorney', 'expert_report'::document_category, 'folder', 'Sky Valley PCB Case/Reports for Attorney'),
('55021415-8769-4abe-93ba-5b0887110b74', 'Response to defendants', 'rebuttal'::document_category, 'folder', 'Sky Valley PCB Case/Response to defendants'),
('55021415-8769-4abe-93ba-5b0887110b74', 'Response to Defense Experts', 'rebuttal'::document_category, 'folder', 'Sky Valley PCB Case/Response to Defense Experts'),
('55021415-8769-4abe-93ba-5b0887110b74', 'Savory family PCB results from Ayxx', 'blood_data'::document_category, 'folder', 'Sky Valley PCB Case/Savory family PCB results from Ayxx'),
('55021415-8769-4abe-93ba-5b0887110b74', 'School district letters closing school and symptom index of SVEC subjects 2016', 'correspondence'::document_category, 'folder', 'Sky Valley PCB Case/School district letters closing school and symptom index of SVEC subjects 2016'),
('55021415-8769-4abe-93ba-5b0887110b74', 'School Issues for PCBs', 'article'::document_category, 'folder', 'Sky Valley PCB Case/School Issues for PCBs'),
('55021415-8769-4abe-93ba-5b0887110b74', 'Sky Valley Files August 27 2021', 'other'::document_category, 'folder', 'Sky Valley PCB Case/Sky Valley Files August 27 2021'),
('55021415-8769-4abe-93ba-5b0887110b74', 'Soley Deposition Prep', 'deposition'::document_category, 'folder', 'Sky Valley PCB Case/Soley Deposition Prep'),
('55021415-8769-4abe-93ba-5b0887110b74', 'Spring 2016 records', 'medical_record'::document_category, 'folder', 'Sky Valley PCB Case/Spring 2016 records'),
('55021415-8769-4abe-93ba-5b0887110b74', 'State levels for PCB', 'regulation'::document_category, 'folder', 'Sky Valley PCB Case/State levels for PCB'),
('55021415-8769-4abe-93ba-5b0887110b74', 'TEQs', 'testing_data'::document_category, 'folder', 'Sky Valley PCB Case/TEQs'),
('55021415-8769-4abe-93ba-5b0887110b74', 'transportation', 'travel'::document_category, 'folder', 'Sky Valley PCB Case/transportation'),
('55021415-8769-4abe-93ba-5b0887110b74', 'Treatment for SVEC', 'medical_record'::document_category, 'folder', 'Sky Valley PCB Case/Treatment for SVEC'),
('55021415-8769-4abe-93ba-5b0887110b74', 'Trial', 'trial_doc'::document_category, 'folder', 'Sky Valley PCB Case/Trial'),
('55021415-8769-4abe-93ba-5b0887110b74', 'Trial Planning', 'trial_doc'::document_category, 'folder', 'Sky Valley PCB Case/Trial Planning'),
('55021415-8769-4abe-93ba-5b0887110b74', 'Trial Prep', 'trial_doc'::document_category, 'folder', 'Sky Valley PCB Case/Trial Prep');

-- Root-level files
INSERT INTO case_documents (case_id, name, category, file_type, file_size_bytes, drive_folder_path, date_created) VALUES
('55021415-8769-4abe-93ba-5b0887110b74', 'Dahlgren Retainer, Sky Valley PCB Case.pdf', 'correspondence'::document_category, 'pdf', 173056, 'Sky Valley PCB Case/', '2019-11-07'),
('55021415-8769-4abe-93ba-5b0887110b74', 'Sky Valley Neuroimaging Data Sheet.xlsx', 'neuroimaging'::document_category, 'xlsx', 17408, 'Sky Valley PCB Case/', '2024-05-21');
