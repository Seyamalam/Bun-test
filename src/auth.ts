/**
 * auth.ts - Bun Authentication Module
 * Demonstrates: Bun.password.hash() and Bun.password.verify()
 */

export class Auth {
  /**
   * Hash a password using Bun's built-in password hashing
   * Uses bcrypt algorithm by default
   */
  static async hashPassword(password: string): Promise<string> {
    return await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 10, // bcrypt cost factor
    });
  }

  /**
   * Verify a password against a hash
   */
  static async verifyPassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return await Bun.password.verify(password, hash);
  }

  /**
   * Hash using argon2id (alternative algorithm)
   */
  static async hashPasswordArgon2(password: string): Promise<string> {
    return await Bun.password.hash(password, {
      algorithm: "argon2id",
      memoryCost: 65536, // 64 MiB
      timeCost: 3,
    });
  }

  /**
   * Verify argon2 password
   */
  static async verifyPasswordArgon2(
    password: string,
    hash: string
  ): Promise<boolean> {
    return await Bun.password.verify(password, hash, "argon2id");
  }

  /**
   * Demo function to show password hashing and verification
   */
  static async demo(): Promise<void> {
    console.log("\n🔐 Authentication Demo");
    console.log("=".repeat(50));

    const testPassword = "SecurePassword123!";
    
    // Bcrypt example
    console.log("\n📝 Testing bcrypt hashing...");
    const bcryptHash = await this.hashPassword(testPassword);
    console.log(`Password: ${testPassword}`);
    console.log(`Hash: ${bcryptHash}`);
    
    const bcryptValid = await this.verifyPassword(testPassword, bcryptHash);
    console.log(`✅ Verification: ${bcryptValid ? "SUCCESS" : "FAILED"}`);
    
    const bcryptInvalid = await this.verifyPassword("WrongPassword", bcryptHash);
    console.log(`❌ Wrong password: ${bcryptInvalid ? "FAILED" : "REJECTED (correct)"}`);

    // Argon2 example
    console.log("\n📝 Testing argon2id hashing...");
    const argonHash = await this.hashPasswordArgon2(testPassword);
    console.log(`Hash: ${argonHash}`);
    
    const argonValid = await this.verifyPasswordArgon2(testPassword, argonHash);
    console.log(`✅ Verification: ${argonValid ? "SUCCESS" : "FAILED"}`);
    
    console.log("=".repeat(50));
  }
}
