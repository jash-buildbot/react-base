// guard.js
import { HumanMessage } from "@langchain/core/messages";
import promptTemplates from "./promptTemplates.js";
import addFormats from "ajv-formats";
import fs from "fs";
import Ajv from "ajv";

// Create and configure the AJV instance with custom keywords
function createAjvInstance(fullText) {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);
  return ajv;
}

// Function to validate output against the schema
function validateOutput(output, schema, fullText) {
  const ajv = createAjvInstance(fullText);
  const validate = ajv.compile(schema);
  const valid = validate(output);
  if (!valid) {
    return { isValid: false, errors: validate.errors };
  }
  return { isValid: true, errors: [] };
}

// Preprocesses the response for validation
function preprocessResponse(response) {
  return response;
}

// Main guardrail function with refactored structure
async function guardrail({
  runnable,
  systemPrompt,
  userPrompt,
  schema,
  maxRetries = 3,
  fullText,
  defaultPayload,
}) {
  let attempt = 0;
  let result = defaultPayload;
  let validation = { isValid: false, errors: [] };

  while (!validation.isValid && attempt < maxRetries) {
    const messages = [systemPrompt, userPrompt];
    if (validation.errors.length > 0) {
      messages.push(
        new HumanMessage(
          promptTemplates.errorCorrectionPrompt(result, validation.errors)
        )
      );
    }

    const response = await runnable.invoke(messages);
    result = { ...result, ...response };

    // Add missing fields to the response
    preprocessResponse(result);

    fs.writeFileSync("output.json", JSON.stringify({result,schema}, null, 2));

    validation = validateOutput(result, schema, fullText);
    if (validation.isValid) {
      fs.writeFileSync("validated_output.json", JSON.stringify(result, null, 2));
      return result;
    } else {
      console.log(validation.errors);
      attempt++;
    }
  }

  throw new Error("Validation failed after maximum retries.");
}

export default guardrail;