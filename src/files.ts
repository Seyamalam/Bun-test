/**
 * files.ts - Bun File I/O Module
 * Demonstrates: Bun.write(), Bun.file(), file reading/writing
 */

export class FileManager {
  /**
   * Write text to a file using Bun.write
   */
  static async writeText(filepath: string, content: string): Promise<void> {
    await Bun.write(filepath, content);
    console.log(`✅ Written text to: ${filepath}`);
  }

  /**
   * Read text from a file using Bun.file
   */
  static async readText(filepath: string): Promise<string> {
    const file = Bun.file(filepath);
    if (!(await file.exists())) {
      throw new Error(`File not found: ${filepath}`);
    }
    return await file.text();
  }

  /**
   * Write JSON data to a file
   */
  static async writeJSON(filepath: string, data: any): Promise<void> {
    const json = JSON.stringify(data, null, 2);
    await Bun.write(filepath, json);
    console.log(`✅ Written JSON to: ${filepath}`);
  }

  /**
   * Read JSON from a file
   */
  static async readJSON<T = any>(filepath: string): Promise<T> {
    const file = Bun.file(filepath);
    if (!(await file.exists())) {
      throw new Error(`File not found: ${filepath}`);
    }
    return await file.json();
  }

  /**
   * Write binary data to a file
   */
  static async writeBinary(filepath: string, data: Uint8Array): Promise<void> {
    await Bun.write(filepath, data);
    console.log(`✅ Written binary to: ${filepath}`);
  }

  /**
   * Read binary data from a file
   */
  static async readBinary(filepath: string): Promise<ArrayBuffer> {
    const file = Bun.file(filepath);
    if (!(await file.exists())) {
      throw new Error(`File not found: ${filepath}`);
    }
    return await file.arrayBuffer();
  }

  /**
   * Check if file exists
   */
  static async exists(filepath: string): Promise<boolean> {
    const file = Bun.file(filepath);
    return await file.exists();
  }

  /**
   * Get file size
   */
  static async size(filepath: string): Promise<number> {
    const file = Bun.file(filepath);
    return file.size;
  }

  /**
   * Get file type (MIME)
   */
  static getType(filepath: string): string {
    const file = Bun.file(filepath);
    return file.type;
  }

  /**
   * Demo function to show file operations
   */
  static async demo(): Promise<void> {
    console.log("\n📁 File I/O Demo");
    console.log("=".repeat(50));

    // Create test directory
    const testDir = "./data";
    await Bun.write(`${testDir}/.keep`, "");

    // Text file operations
    const textFile = `${testDir}/test.txt`;
    await this.writeText(textFile, "Hello from Bun! 🚀\nThis is a test file.");
    const textContent = await this.readText(textFile);
    console.log(`📄 Text content:\n${textContent}`);

    // JSON operations
    const jsonFile = `${testDir}/config.json`;
    const config = {
      appName: "Bun Core Backend",
      version: "1.0.0",
      features: ["http", "websocket", "database", "auth"],
      timestamp: Date.now(),
    };
    await this.writeJSON(jsonFile, config);
    const loadedConfig = await this.readJSON(jsonFile);
    console.log(`📋 Loaded config:`, loadedConfig);

    // Binary operations
    const binaryFile = `${testDir}/data.bin`;
    const binaryData = new Uint8Array([1, 2, 3, 4, 5, 255, 254, 253]);
    await this.writeBinary(binaryFile, binaryData);
    const loadedBinary = await this.readBinary(binaryFile);
    console.log(`🔢 Binary data (${loadedBinary.byteLength} bytes):`, new Uint8Array(loadedBinary));

    // File info
    const exists = await this.exists(textFile);
    const size = await this.size(textFile);
    console.log(`\n📊 File info for ${textFile}:`);
    console.log(`  - Exists: ${exists}`);
    console.log(`  - Size: ${size} bytes`);

    console.log("=".repeat(50));
  }
}
