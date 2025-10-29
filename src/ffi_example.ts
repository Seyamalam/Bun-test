/**
 * ffi_example.ts - Bun FFI Module
 * Demonstrates: bun:ffi for calling native C functions
 */

import { dlopen, FFIType, suffix } from "bun:ffi";

export class FFIExample {
  /**
   * Demo FFI with standard C library functions
   * We'll use libc functions that are available on most systems
   */
  static demo(): void {
    console.log("\n🔧 FFI (Foreign Function Interface) Demo");
    console.log("=".repeat(50));

    try {
      // Try to load the C standard library
      // On Linux: libc.so.6, on macOS: libSystem.B.dylib
      const libPath = process.platform === "darwin" 
        ? "/usr/lib/libSystem.B.dylib"
        : "libc.so.6";

      console.log(`\n📚 Loading library: ${libPath}`);

      // Open the library with FFI
      const lib = dlopen(libPath, {
        // strlen: returns the length of a string
        strlen: {
          args: [FFIType.cstring],
          returns: FFIType.i32,
        },
        // abs: returns absolute value
        abs: {
          args: [FFIType.i32],
          returns: FFIType.i32,
        },
        // atoi: converts string to integer
        atoi: {
          args: [FFIType.cstring],
          returns: FFIType.i32,
        },
      });

      console.log("✅ Library loaded successfully");

      // Test strlen
      console.log("\n📏 Testing strlen():");
      const testString = "Hello from Bun FFI!";
      const encoder = new TextEncoder();
      const encodedString = encoder.encode(testString + "\0"); // null-terminated
      const ptr = Bun.allocUnsafe(encodedString.length);
      ptr.set(encodedString);
      const length = lib.symbols.strlen(ptr);
      console.log(`  String: "${testString}"`);
      console.log(`  Length: ${length}`);
      console.log(`  JS length: ${testString.length}`);
      console.log(`  Match: ${length === testString.length ? "✅" : "❌"}`);

      // Test abs
      console.log("\n🔢 Testing abs():");
      const negativeNum = -42;
      const absoluteValue = lib.symbols.abs(negativeNum);
      console.log(`  Input: ${negativeNum}`);
      console.log(`  Absolute value: ${absoluteValue}`);
      console.log(`  Expected: ${Math.abs(negativeNum)}`);
      console.log(`  Match: ${absoluteValue === Math.abs(negativeNum) ? "✅" : "❌"}`);

      // Test atoi
      console.log("\n🔤 Testing atoi():");
      const numString = "42";
      const encodedNum = encoder.encode(numString + "\0");
      const numPtr = Bun.allocUnsafe(encodedNum.length);
      numPtr.set(encodedNum);
      const atoiResult = lib.symbols.atoi(numPtr);
      console.log(`  Input: "${numString}"`);
      console.log(`  Converted to int: ${atoiResult}`);
      console.log(`  Expected: ${parseInt(numString)}`);
      console.log(`  Match: ${atoiResult === parseInt(numString) ? "✅" : "❌"}`);

      console.log("\n💡 FFI allows calling native C libraries directly from Bun!");
      console.log("   This enables high-performance operations and system integration.");

    } catch (error) {
      console.error("❌ FFI Demo error:", error);
      console.log("\n💡 Note: FFI requires native libraries to be available.");
      console.log("   The exact library path may vary by system.");
    }

    console.log("=".repeat(50));
  }

  /**
   * Create a simple example showing FFI structure
   */
  static showFFIStructure(): void {
    console.log("\n📖 FFI Structure Example:");
    console.log(`
import { dlopen, FFIType } from "bun:ffi";

const lib = dlopen("library.so", {
  functionName: {
    args: [FFIType.i32, FFIType.cstring],  // parameter types
    returns: FFIType.i32,                   // return type
  },
});

// Call the function
const result = lib.symbols.functionName(42, "hello");
    `);
  }
}
