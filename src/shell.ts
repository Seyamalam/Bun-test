/**
 * shell.ts - Bun Shell Module
 * Demonstrates: Bun's $ shell utility for command execution
 */

import { $ } from "bun";

export class Shell {
  /**
   * Execute a shell command and return output
   */
  static async exec(command: string): Promise<string> {
    const output = await $`${command}`.text();
    return output;
  }

  /**
   * Execute command and get exit code
   */
  static async execWithCode(command: string): Promise<{ code: number; output: string }> {
    try {
      const proc = await $`${command}`.quiet();
      return {
        code: proc.exitCode,
        output: await proc.text(),
      };
    } catch (error: any) {
      return {
        code: error.exitCode || 1,
        output: error.stderr?.toString() || "",
      };
    }
  }

  /**
   * List files in current directory
   */
  static async listFiles(path: string = "."): Promise<string> {
    return await $`ls -lah ${path}`.text();
  }

  /**
   * Get current working directory
   */
  static async pwd(): Promise<string> {
    return (await $`pwd`.text()).trim();
  }

  /**
   * Get system information
   */
  static async getSystemInfo(): Promise<any> {
    const uname = await $`uname -a`.text();
    const whoami = await $`whoami`.text();
    
    return {
      os: uname.trim(),
      user: whoami.trim(),
    };
  }

  /**
   * Create a directory
   */
  static async mkdir(path: string): Promise<void> {
    await $`mkdir -p ${path}`;
  }

  /**
   * Echo text (simple command)
   */
  static async echo(text: string): Promise<string> {
    return await $`echo ${text}`.text();
  }

  /**
   * Get environment variable using shell
   */
  static async getEnv(varName: string): Promise<string> {
    const result = await $`echo $${varName}`.text();
    return result.trim();
  }

  /**
   * Demo function to showcase shell operations
   */
  static async demo(): Promise<void> {
    console.log("\n🐚 Shell Execution Demo");
    console.log("=".repeat(50));

    // Echo command
    console.log("\n📢 Echo:");
    const echoResult = await this.echo("Hello from Bun shell!");
    console.log(`  ${echoResult.trim()}`);

    // Current directory
    console.log("\n📂 Current Directory:");
    const cwd = await this.pwd();
    console.log(`  ${cwd}`);

    // System info
    console.log("\n💻 System Information:");
    const sysInfo = await this.getSystemInfo();
    console.log(`  OS: ${sysInfo.os}`);
    console.log(`  User: ${sysInfo.user}`);

    // List files
    console.log("\n📋 Files in src/ directory:");
    try {
      const files = await this.listFiles("./src");
      console.log(files);
    } catch (error) {
      console.log("  Could not list files");
    }

    // Date command
    console.log("\n📅 Current Date/Time:");
    const dateOutput = await $`date`.text();
    console.log(`  ${dateOutput.trim()}`);

    // Pipe example
    console.log("\n🔄 Command Piping:");
    const pipeResult = await $`echo "Bun\nNode\nDeno" | sort`.text();
    console.log("  Sorted list:");
    console.log(pipeResult);

    console.log("=".repeat(50));
  }
}
