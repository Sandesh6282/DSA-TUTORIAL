export interface LanguageConfig {
  key: string;
  name: string;
  monacoLang: string;
  judge0Id: number;
  pistonLang: string;
  pistonVersion: string;
  extension: string;
  defaultCode: string;
  supported: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    key: "cpp",
    name: "C++ (GCC 9.2.0 / C++17)",
    monacoLang: "cpp",
    judge0Id: 54, // C++ (GCC 9.2.0)
    pistonLang: "c++",
    pistonVersion: "10.2.0",
    extension: "cpp",
    defaultCode: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    cout << "DSA AI Tutor - C++17 Online Execution" << endl;\n    vector<int> nums = {1, 2, 3, 4, 5};\n    int sum = 0;\n    for (int n : nums) sum += n;\n    cout << "Sum of elements: " << sum << endl;\n    return 0;\n}`,
    supported: true
  },
  {
    key: "python",
    name: "Python 3 (3.8.1+)",
    monacoLang: "python",
    judge0Id: 71, // Python (3.8.1)
    pistonLang: "python",
    pistonVersion: "3.10.0",
    extension: "py",
    defaultCode: `# DSA AI Tutor - Python 3\nimport sys\n\nprint("Hello from Python 3!")\nnums = [10, 20, 30, 40, 50]\nprint(f"Array: {nums}")\nprint(f"Maximum: {max(nums)}")\n\n# Standard input check\nlines = sys.stdin.read().split()\nif lines:\n    print(f"Stdin received: {lines}")\n`,
    supported: true
  },
  {
    key: "java",
    name: "Java (OpenJDK 13+)",
    monacoLang: "java",
    judge0Id: 62, // Java (OpenJDK 13.0.1)
    pistonLang: "java",
    pistonVersion: "15.0.2",
    extension: "java",
    defaultCode: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("DSA AI Tutor - Java Online Execution");\n        int[] arr = {10, 20, 30, 40, 50};\n        int sum = 0;\n        for (int x : arr) sum += x;\n        System.out.println("Array length: " + arr.length);\n        System.out.println("Sum of items: " + sum);\n    }\n}`,
    supported: true
  },
  {
    key: "javascript",
    name: "JavaScript (Node.js 18+)",
    monacoLang: "javascript",
    judge0Id: 63, // JavaScript (Node.js 12.14.0)
    pistonLang: "javascript",
    pistonVersion: "18.15.0",
    extension: "js",
    defaultCode: `// DSA AI Tutor - JavaScript Node.js\nconsole.log("Hello from JavaScript!");\nconst list = [5, 12, 8, 130, 44];\nconst found = list.find(x => x > 10);\nconsole.log("First element > 10:", found);\nconsole.log("Squared:", list.map(x => x * x));`,
    supported: true
  },
  {
    key: "typescript",
    name: "TypeScript (3.7.4+)",
    monacoLang: "typescript",
    judge0Id: 74, // TypeScript (3.7.4)
    pistonLang: "typescript",
    pistonVersion: "5.0.3",
    extension: "ts",
    defaultCode: `// DSA AI Tutor - TypeScript\ninterface Item {\n  id: number;\n  name: string;\n}\nconst items: Item[] = [\n  { id: 1, name: "Array" },\n  { id: 2, name: "Stack" }\n];\nconsole.log("TypeScript items:", items);`,
    supported: true
  },
  {
    key: "c",
    name: "C (GCC 9.2.0)",
    monacoLang: "c",
    judge0Id: 50, // C (GCC 9.2.0)
    pistonLang: "c",
    pistonVersion: "10.2.0",
    extension: "c",
    defaultCode: `#include <stdio.h>\n\nint main() {\n    printf("DSA AI Tutor - C Execution\\n");\n    int nums[5] = {1, 2, 3, 4, 5};\n    int sum = 0;\n    for(int i = 0; i < 5; i++) sum += nums[i];\n    printf("Sum: %d\\n", sum);\n    return 0;\n}`,
    supported: true
  },
  {
    key: "go",
    name: "Go (1.13.5+)",
    monacoLang: "go",
    judge0Id: 60, // Go (1.13.5)
    pistonLang: "go",
    pistonVersion: "1.16.2",
    extension: "go",
    defaultCode: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("DSA AI Tutor - Go Execution")\n    data := []int{10, 20, 30, 40}\n    fmt.Printf("Slice: %v, Length: %d\\n", data, len(data))\n}`,
    supported: true
  },
  {
    key: "csharp",
    name: "C# (Mono 6.6.0)",
    monacoLang: "csharp",
    judge0Id: 51, // C# (Mono 6.6.0.161)
    pistonLang: "csharp",
    pistonVersion: "6.12.0",
    extension: "cs",
    defaultCode: `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("DSA AI Tutor - C# Execution");\n        int[] numbers = { 1, 2, 3, 4, 5 };\n        Console.WriteLine($"Total numbers: {numbers.Length}");\n    }\n}`,
    supported: true
  },
  {
    key: "ruby",
    name: "Ruby (2.7.0+)",
    monacoLang: "ruby",
    judge0Id: 72, // Ruby (2.7.0)
    pistonLang: "ruby",
    pistonVersion: "3.0.1",
    extension: "rb",
    defaultCode: `# DSA AI Tutor - Ruby\nputs "Hello from Ruby!"\nitems = [10, 20, 30, 40, 50]\nputs "Sum: #{items.sum}"\n`,
    supported: true
  }
];

export function getLanguageConfig(key: string): LanguageConfig {
  return SUPPORTED_LANGUAGES.find((l) => l.key === key) || SUPPORTED_LANGUAGES[0];
}
