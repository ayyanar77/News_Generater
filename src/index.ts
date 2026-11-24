import { DigestService } from "./services/digestService";

async function main() {
  try {
    const result = await DigestService.generate(10);
    console.log(`\n🎉 All done! Processed ${result.total} news stories.`);
  } catch (err) {
    console.error("Fatal error generating news digest:", err);
    process.exit(1);
  }
}

main();
