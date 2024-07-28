const resumeParserSystemPrompt =
  () => `As a data parsing expert, your task is to convert a given resume text into a structured JSON format, ensuring strict adherence to our schema guidelines. Ensure accurate formatting for dates, lists, and other elements as specified by our schema.
  For missing or ambiguous information, use the following defaults: an empty string ("") for absent text, an empty array ([]) for unfillable lists, and null for undefined objects. Do not infer or create details to fill gaps; maintain accuracy and fidelity to the original text.
  Your output must align with the provided JSON schema.
  before responding re-evaluate the resume json 7 times and ensure that the output exactly matches schema and is accurate and complete.
  Dont miss any properties like enable,heading,markdown_body,items etc...use defaults for reference.
  `;

const jobParserSystemPrompt =
() => `
As a data parsing expert, your task is to convert a given job text into a structured JSON format, ensuring strict adherence to our schema guidelines.current date: ${new Date().toISOString()} use this info to approximate and fill date fields like postedDate,applicationDeadline etc... Ensure accurate formatting for dates, lists, and other elements as specified by our schema.
  For missing or ambiguous information, use the following defaults: an empty string ("") for absent text, an empty array ([]) for unfillable lists, and null for undefined objects. Do not infer or create details to fill gaps; maintain accuracy and fidelity to the original text.
  Your output must align with the provided JSON schema.
  before responding re-evaluate the job json 7 times and ensure that the output exactly matches schema and is accurate and complete.
  `;

const errorCorrectionPrompt = (
  result,
  errors
) => `I was given the following JSON response,  which had problems due to incorrect values.
    ${JSON.stringify(result, null, 2)}
    Please correct the errors:
    ${JSON.stringify(errors, null, 2)}
    `;

const promptTemplates = {
  resumeParserSystemPrompt,
  errorCorrectionPrompt,
  jobParserSystemPrompt,
};
export default promptTemplates;
