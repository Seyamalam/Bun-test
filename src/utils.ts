/**
 * utils.ts - Bun Utilities Module
 * Demonstrates: Bun.hash, Bun.deepEquals, Bun.sleep, Bun.randomUUID, Bun.gzipSync
 */

export class Utils {
  /**
   * Hash a string using Bun's built-in hasher
   */
  static hash(input: string | Uint8Array, algorithm: "sha256" | "sha512" | "sha1" = "sha256"): string {
    const hasher = new Bun.CryptoHasher(algorithm);
    hasher.update(input);
    return hasher.digest("hex");
  }

  /**
   * Deep equality check
   */
  static deepEquals(a: any, b: any): boolean {
    return Bun.deepEquals(a, b);
  }

  /**
   * Sleep for specified milliseconds
   */
  static async sleep(ms: number): Promise<void> {
    await Bun.sleep(ms);
  }

  /**
   * Generate a random UUID
   */
  static uuid(): string {
    return crypto.randomUUID();
  }

  /**
   * Compress data using gzip
   */
  static compress(data: string | Uint8Array): Uint8Array {
    return Bun.gzipSync(data);
  }

  /**
   * Decompress gzip data
   */
  static decompress(data: Uint8Array): Uint8Array {
    return Bun.gunzipSync(data);
  }

  /**
   * Escape HTML characters
   */
  static escapeHTML(str: string): string {
    return Bun.escapeHTML(str);
  }

  /**
   * Get nanosecond timestamp
   */
  static nanoseconds(): number {
    return Bun.nanoseconds();
  }

  /**
   * Demo function to showcase utilities
   */
  static async demo(): Promise<void> {
    console.log("\n🛠️  Utilities Demo");
    console.log("=".repeat(50));

    // Hashing
    console.log("\n🔐 Hashing:");
    const testString = "Hello, Bun!";
    const sha256Hash = this.hash(testString, "sha256");
    const sha512Hash = this.hash(testString, "sha512");
    console.log(`  Input: "${testString}"`);
    console.log(`  SHA-256: ${sha256Hash}`);
    console.log(`  SHA-512: ${sha512Hash}`);

    // Deep equality
    console.log("\n⚖️  Deep Equality:");
    const obj1 = { name: "Bun", features: ["fast", "modern"], version: 1 };
    const obj2 = { name: "Bun", features: ["fast", "modern"], version: 1 };
    const obj3 = { name: "Bun", features: ["fast"], version: 1 };
    console.log(`  obj1 === obj2: ${this.deepEquals(obj1, obj2)}`);
    console.log(`  obj1 === obj3: ${this.deepEquals(obj1, obj3)}`);

    // UUID generation
    console.log("\n🎲 UUID Generation:");
    for (let i = 0; i < 3; i++) {
      console.log(`  UUID ${i + 1}: ${this.uuid()}`);
    }

    // Compression
    console.log("\n🗜️  Compression:");
    const originalText = "This is a test string that will be compressed using gzip! ".repeat(10);
    const compressed = this.compress(originalText);
    const decompressed = this.decompress(compressed);
    const decodedText = new TextDecoder().decode(decompressed);
    console.log(`  Original size: ${originalText.length} bytes`);
    console.log(`  Compressed size: ${compressed.length} bytes`);
    console.log(`  Compression ratio: ${((1 - compressed.length / originalText.length) * 100).toFixed(2)}%`);
    console.log(`  Decompression successful: ${originalText === decodedText}`);

    // HTML escaping
    console.log("\n🔒 HTML Escaping:");
    const htmlInput = '<script>alert("XSS")</script>';
    const escaped = this.escapeHTML(htmlInput);
    console.log(`  Input: ${htmlInput}`);
    console.log(`  Escaped: ${escaped}`);

    // Sleep demonstration
    console.log("\n⏰ Sleep Demo:");
    console.log("  Sleeping for 1 second...");
    const startTime = Date.now();
    await this.sleep(1000);
    const elapsed = Date.now() - startTime;
    console.log(`  Slept for ${elapsed}ms`);

    // Nanosecond precision
    console.log("\n⏱️  Nanosecond Timing:");
    const ns1 = this.nanoseconds();
    await this.sleep(10);
    const ns2 = this.nanoseconds();
    console.log(`  Start: ${ns1}ns`);
    console.log(`  End: ${ns2}ns`);
    console.log(`  Elapsed: ${ns2 - ns1}ns (${((ns2 - ns1) / 1_000_000).toFixed(2)}ms)`);

    console.log("=".repeat(50));
  }
}
