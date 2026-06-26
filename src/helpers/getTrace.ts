import { relative } from "path";

const cwd = process.cwd();

export interface Trace {
  relativePath: string;
  lineNumber: number;
}

/**
 * Trace the caller of this function and return the relative path and line number.
 */
export const getTrace = (): Trace => {
  // Use a custom Error to capture the stack trace
  const stack = new Error().stack;

  if (!stack) {
    throw new Error("Could not capture stack trace");
  }

  // Parse the stack trace string (more reliable than prepareStackTrace shenanigans)
  const stackLines = stack.split("\n");
  const callerLine = stackLines[2]; // [0] is "Error", [1] is trace(), [2] is actual caller

  // Extract file and line info with regex
  const match =
    callerLine.match(/at .* \((.+):(\d+):(\d+)\)/) ||
    callerLine.match(/at (.+):(\d+):(\d+)/);

  if (match) {
    const [, filepath, lineNumber] = match;
    const relativePath = relative(cwd, filepath.replace("file://", ""));
    return {
      relativePath,
      lineNumber: parseInt(lineNumber, 10),
    };
  } else {
    throw new Error(`Could not parse stack trace: ${callerLine}`);
  }
};
