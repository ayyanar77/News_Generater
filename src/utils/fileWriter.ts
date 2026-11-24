import * as fs from "fs";
import * as path from "path";

export class FileWriter {
  private static readonly OUTPUT_DIR = path.resolve(process.cwd(), "output");

  public static ensureOutputDir(): void {
    if (!fs.existsSync(this.OUTPUT_DIR)) {
      fs.mkdirSync(this.OUTPUT_DIR, { recursive: true });
    }
  }

  public static saveDigest(filename: string, content: string): string {
    this.ensureOutputDir();
    const filePath = path.join(this.OUTPUT_DIR, filename);
    fs.writeFileSync(filePath, content, "utf-8");
    return filePath;
  }
}

