import {
  ContactStoreConfigurationError,
  saveContactRequest,
  validateContactStoreConfiguration,
} from "../lib/contact-store.js";

const sendTest = process.argv.includes("--send");

function printError(error) {
  if (error instanceof ContactStoreConfigurationError) {
    console.error(`Configuration error: ${error.message}`);
    return;
  }

  console.error("Contact store operation failed.", {
    name: error?.name,
    provider: error?.provider,
    code: error?.code,
    command: error?.command,
    responseCode: error?.responseCode,
  });
}

let provider;

try {
  provider = validateContactStoreConfiguration(process.env);
} catch (error) {
  printError(error);
  process.exit(1);
}

console.log("Contact store configuration");
console.log(`  provider: ${provider}`);

if (provider === "github") {
  console.log(`  repository: ${process.env.repo_name}`);
  console.log("  git_pat_token: set");
} else {
  console.log("  transport: json (test only, no GitHub write)");
}

if (!sendTest) {
  console.log(
    "\nConfiguration present. Run `npm run contact:check -- --send` to create a test file.",
  );
  process.exit(0);
}

try {
  const result = await saveContactRequest(
    {
      name: "Contact store check",
      email: "contact-check@example.com",
      subject: "Portfolio contact store check",
      message: "This is a test file created by the contact store configuration check.",
      serviceId: "not-from-service",
    },
    process.env,
  );

  console.log(`\nContact request stored via ${provider}.`);
  console.log(`Path: ${result.path}`);
  if (result.htmlUrl) {
    console.log(`URL: ${result.htmlUrl}`);
  }
} catch (error) {
  printError(error);
  process.exit(1);
}
