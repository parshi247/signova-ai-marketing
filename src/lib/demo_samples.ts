// Sample document content for demo mode
export const getDemoDocumentContent = (documentType: string): string => {
  const type = documentType.toLowerCase();
  
  if (type.includes('nda') || type.includes('non-disclosure')) {
    return `# NON-DISCLOSURE AGREEMENT

**This Non-Disclosure Agreement** (the "Agreement") is entered into as of [DATE], by and between:

**Disclosing Party:** [COMPANY NAME]  
**Receiving Party:** [RECIPIENT NAME]

## 1. PURPOSE

The parties wish to explore a business opportunity of mutual interest and benefit (the "Purpose"). In connection with this Purpose, each party may disclose to the other certain confidential technical and business information that the disclosing party desires the receiving party to treat as confidential.

## 2. CONFIDENTIAL INFORMATION

"Confidential Information" means any information disclosed by either party to the other party, either directly or indirectly, in writing, orally or by inspection of tangible objects, including without limitation:

- Business plans, strategies, and financial information
- Technical data, trade secrets, and know-how
- Customer lists and supplier information
- Product specifications and designs
- Marketing plans and strategies
- Any other proprietary information marked as "Confidential"

## 3. OBLIGATIONS

The Receiving Party agrees to:

a) Hold and maintain the Confidential Information in strict confidence  
b) Not disclose the Confidential Information to third parties without prior written consent  
c) Use the Confidential Information solely for the Purpose stated above  
d) Protect the Confidential Information with the same degree of care used to protect its own confidential information

## 4. EXCLUSIONS

Confidential Information shall not include information that:

- Is or becomes publicly available through no breach of this Agreement
- Is rightfully received from a third party without breach of any confidentiality obligation
- Is independently developed without use of the Confidential Information
- Was known prior to disclosure under this Agreement

## 5. TERM

This Agreement shall remain in effect for a period of [TERM] years from the date of execution, unless earlier terminated by either party with thirty (30) days written notice.

## 6. RETURN OF MATERIALS

Upon termination or at the Disclosing Party's request, the Receiving Party shall promptly return or destroy all Confidential Information and certify such destruction in writing.

## 7. GOVERNING LAW

This Agreement shall be governed by and construed in accordance with the laws of [JURISDICTION], without regard to its conflict of law provisions.

---

**IN WITNESS WHEREOF**, the parties have executed this Agreement as of the date first written above.

**DISCLOSING PARTY:**

Signature: _____________________  
Name: _____________________  
Title: _____________________  
Date: _____________________

**RECEIVING PARTY:**

Signature: _____________________  
Name: _____________________  
Title: _____________________  
Date: _____________________`;
  }
  
  if (type.includes('employment') || type.includes('employee')) {
    return `# EMPLOYMENT AGREEMENT

**This Employment Agreement** (the "Agreement") is made and entered into as of [DATE], by and between:

**Employer:** [COMPANY NAME] ("Company")  
**Employee:** [EMPLOYEE NAME] ("Employee")

## 1. POSITION AND DUTIES

The Company hereby employs the Employee in the position of [JOB TITLE]. The Employee agrees to perform the duties and responsibilities customarily associated with this position, including:

- [Primary Responsibility 1]
- [Primary Responsibility 2]
- [Primary Responsibility 3]
- Such other duties as may be reasonably assigned

## 2. COMPENSATION

**Base Salary:** The Employee shall receive an annual base salary of $[AMOUNT], payable in accordance with the Company's standard payroll practices.

**Benefits:** The Employee shall be entitled to participate in all employee benefit plans maintained by the Company, subject to the terms and conditions of such plans.

## 3. TERM OF EMPLOYMENT

This Agreement shall commence on [START DATE] and shall continue until terminated by either party in accordance with Section 6 below.

## 4. WORKING HOURS

The Employee's regular working hours shall be [HOURS] per week, Monday through Friday, [START TIME] to [END TIME], with such variations as the needs of the Company may require.

## 5. CONFIDENTIALITY

The Employee acknowledges that during employment, they will have access to confidential and proprietary information. The Employee agrees to maintain the confidentiality of such information both during and after employment.

## 6. TERMINATION

Either party may terminate this Agreement:
- With [NOTICE PERIOD] days written notice
- Immediately for cause (including breach of duties, misconduct, or violation of company policies)

## 7. GOVERNING LAW

This Agreement shall be governed by the laws of [JURISDICTION].

---

**SIGNATURES:**

**EMPLOYER:**

Signature: _____________________  
Name: _____________________  
Title: _____________________  
Date: _____________________

**EMPLOYEE:**

Signature: _____________________  
Name: _____________________  
Date: _____________________`;
  }
  
  if (type.includes('freelance') || type.includes('consulting') || type.includes('contractor')) {
    return `# FREELANCE SERVICES AGREEMENT

**This Freelance Services Agreement** (the "Agreement") is entered into as of [DATE], by and between:

**Client:** [CLIENT NAME] ("Client")  
**Freelancer:** [FREELANCER NAME] ("Freelancer")

## 1. SERVICES

The Freelancer agrees to provide the following services to the Client:

**Scope of Work:**
[DETAILED DESCRIPTION OF SERVICES]

**Deliverables:**
- [Deliverable 1]
- [Deliverable 2]
- [Deliverable 3]

## 2. COMPENSATION

**Total Project Fee:** $[AMOUNT]

**Payment Terms:**
- [PERCENTAGE]% upon signing this Agreement
- [PERCENTAGE]% upon completion of [MILESTONE]
- [PERCENTAGE]% upon final delivery and acceptance

## 3. TIMELINE

**Project Start Date:** [START DATE]  
**Expected Completion Date:** [END DATE]

The Freelancer shall use reasonable efforts to complete the Services by the expected completion date. Any delays caused by the Client shall extend the completion date accordingly.

## 4. INTELLECTUAL PROPERTY

Upon receipt of full payment, all intellectual property rights in the deliverables shall transfer to the Client. The Freelancer retains the right to use the work in their portfolio.

## 5. REVISIONS

The project fee includes [NUMBER] rounds of revisions. Additional revisions beyond this scope shall be billed at $[RATE] per hour.

## 6. INDEPENDENT CONTRACTOR

The Freelancer is an independent contractor and not an employee of the Client. The Freelancer is responsible for all taxes, insurance, and other obligations.

## 7. TERMINATION

Either party may terminate this Agreement with [NOTICE PERIOD] days written notice. Upon termination, the Client shall pay for all work completed to date.

## 8. CONFIDENTIALITY

Both parties agree to maintain the confidentiality of any proprietary information shared during the course of this engagement.

---

**SIGNATURES:**

**CLIENT:**

Signature: _____________________  
Name: _____________________  
Date: _____________________

**FREELANCER:**

Signature: _____________________  
Name: _____________________  
Date: _____________________`;
  }
  
  // Default generic document
  return `# ${documentType.toUpperCase()}

**This Agreement** is entered into as of [DATE], by and between the parties identified below.

## 1. PARTIES

**Party A:** [NAME]  
**Party B:** [NAME]

## 2. PURPOSE

This document sets forth the terms and conditions governing [PURPOSE OF AGREEMENT].

## 3. TERMS AND CONDITIONS

The parties agree to the following terms:

- **Term 1:** [Description of first major term]
- **Term 2:** [Description of second major term]
- **Term 3:** [Description of third major term]

## 4. OBLIGATIONS

Each party shall:
- Fulfill their respective obligations in good faith
- Comply with all applicable laws and regulations
- Maintain confidentiality where appropriate

## 5. GOVERNING LAW

This Agreement shall be governed by the laws of [JURISDICTION].

---

**SIGNATURES:**

**PARTY A:**

Signature: _____________________  
Name: _____________________  
Date: _____________________

**PARTY B:**

Signature: _____________________  
Name: _____________________  
Date: _____________________`;
};
