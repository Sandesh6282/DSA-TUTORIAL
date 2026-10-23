export interface TopicOperation {
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TopicConfig {
  id: string;
  name: string;
  order: number;
  enabled: boolean;
  initialUnlocked: boolean;
  prerequisites: string[]; // topic IDs required
  summary: string;
  explanation: string;
  operations: TopicOperation[];
  starterCode: {
    cpp: string;
    python: string;
    java: string;
    javascript: string;
    typescript: string;
    c: string;
    go: string;
  };
  passingScore: number; // e.g. 1 or 2 correct answers to pass
  quizzes: QuizQuestion[];
}

export const DEFAULT_TOPICS: TopicConfig[] = [
  {
    id: "arrays",
    name: "Arrays",
    order: 1,
    enabled: true,
    initialUnlocked: true,
    prerequisites: [],
    summary: "Contiguous memory blocks offering O(1) random access by index.",
    explanation:
      "Arrays are the most fundamental data structure. Elements are stored in contiguous memory locations, allowing instant O(1) element retrieval using numerical indexing. However, insertions and deletions (except at the end of dynamic arrays) require shifting elements, yielding O(n) worst-case time.",
    operations: [
      { name: "Access by Index", timeComplexity: "O(1)", spaceComplexity: "O(1)", description: "Direct memory calculation: base_addr + (index * size)." },
      { name: "Search (Unsorted)", timeComplexity: "O(n)", spaceComplexity: "O(1)", description: "Linear scan through elements." },
      { name: "Search (Sorted)", timeComplexity: "O(log n)", spaceComplexity: "O(1)", description: "Binary search on sorted array." },
      { name: "Insert (End)", timeComplexity: "O(1)*", spaceComplexity: "O(1)", description: "Amortized O(1) for dynamic arrays." },
      { name: "Insert / Delete (Middle)", timeComplexity: "O(n)", spaceComplexity: "O(1)", description: "Requires shifting subsequent elements." }
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Declare and initialize an array/vector\n    vector<int> arr = {10, 20, 30, 40, 50};\n    \n    // Access element at index 2\n    cout << "Element at index 2: " << arr[2] << endl;\n    \n    // Append an element\n    arr.push_back(60);\n    \n    // Iterate through elements\n    cout << "Array elements: ";\n    for (int x : arr) {\n        cout << x << " ";\n    }\n    cout << endl;\n    return 0;\n}`,
      python: `# Python List (Dynamic Array)\narr = [10, 20, 30, 40, 50]\n\n# Access element by index\nprint(f"Element at index 2: {arr[2]}")\n\n# Append an element\narr.append(60)\n\n# Iteration\nprint("Array elements:", arr)\nprint(f"Array length: {len(arr)}")`,
      java: `import java.util.ArrayList;\nimport java.util.Arrays;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Fixed-size primitive array\n        int[] numbers = {10, 20, 30, 40, 50};\n        System.out.println("Element at index 2: " + numbers[2]);\n        \n        // Dynamic list\n        ArrayList<Integer> list = new ArrayList<>(Arrays.asList(10, 20, 30, 40, 50));\n        list.add(60);\n        System.out.println("List: " + list);\n    }\n}`,
      javascript: `// JavaScript Dynamic Array\nconst arr = [10, 20, 30, 40, 50];\n\nconsole.log("Element at index 2:", arr[2]);\n\narr.push(60);\nconsole.log("Array elements:", arr.join(" "));\nconsole.log("Total length:", arr.length);`,
      typescript: `// TypeScript Typed Array\nconst arr: number[] = [10, 20, 30, 40, 50];\n\nconsole.log("Element at index 2:", arr[2]);\narr.push(60);\nconsole.log("Array elements:", arr);\nconsole.log("Length:", arr.length);`,
      c: `#include <stdio.h>\n\nint main() {\n    int arr[5] = {10, 20, 30, 40, 50};\n    printf("Element at index 2: %d\\n", arr[2]);\n    printf("Total size: %lu bytes\\n", sizeof(arr));\n    return 0;\n}`,
      go: `package main\n\nimport "fmt"\n\nfunc main() {\n    arr := []int{10, 20, 30, 40, 50}\n    fmt.Printf("Element at index 2: %d\\n", arr[2])\n    arr = append(arr, 60)\n    fmt.Printf("Array elements: %v\\n", arr)\n}`
    },
    passingScore: 1,
    quizzes: [
      {
        id: "arr-1",
        question: "What is the time complexity of accessing an element in an array by index?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n^2)"],
        correctIndex: 1,
        explanation: "Because array elements are stored contiguously in memory, the memory address of any element is computed in O(1) constant time: BaseAddress + (Index * ElementSize)."
      },
      {
        id: "arr-2",
        question: "What is the worst-case time complexity of inserting an element at the beginning of an unsorted array of size n?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
        correctIndex: 1,
        explanation: "Inserting at the beginning requires shifting all n existing elements one position to the right, which takes O(n) time."
      }
    ]
  },
  {
    id: "linked-lists",
    name: "Linked Lists",
    order: 2,
    enabled: true,
    initialUnlocked: false,
    prerequisites: ["arrays"],
    summary: "Linear collection of data nodes linked via memory pointers.",
    explanation:
      "A Linked List is a linear data structure where each element (node) contains a data value and a pointer (reference) to the next node in sequence. Unlike arrays, linked lists do not require contiguous memory and provide O(1) insertions/deletions when a pointer to the location is known, but sacrifice O(1) random indexing.",
    operations: [
      { name: "Access by Index", timeComplexity: "O(n)", spaceComplexity: "O(1)", description: "Sequential traversal from head node." },
      { name: "Insert at Head", timeComplexity: "O(1)", spaceComplexity: "O(1)", description: "Update new node next pointer to head, set head = new node." },
      { name: "Delete at Head", timeComplexity: "O(1)", spaceComplexity: "O(1)", description: "Advance head pointer to head.next." },
      { name: "Search Value", timeComplexity: "O(n)", spaceComplexity: "O(1)", description: "Traverse list comparing data value." }
    ],
    starterCode: {
      cpp: `#include <iostream>\nusing namespace std;\n\nstruct Node {\n    int val;\n    Node* next;\n    Node(int v) : val(v), next(nullptr) {}\n};\n\nint main() {\n    Node* head = new Node(10);\n    head->next = new Node(20);\n    head->next->next = new Node(30);\n\n    cout << "Linked List: ";\n    Node* curr = head;\n    while (curr) {\n        cout << curr->val << " -> ";\n        curr = curr->next;\n    }\n    cout << "NULL" << endl;\n    return 0;\n}`,
      python: `class Node:\n    def __init__(self, val, next=None):\n        self.val = val\n        self.next = next\n\n# Create linked nodes: 10 -> 20 -> 30\nhead = Node(10, Node(20, Node(30)))\n\nprint("Linked list traversal:")\ncurr = head\nwhile curr:\n    print(f"{curr.val} ->", end=" ")\n    curr = curr.next\nprint("None")`,
      java: `class Node {\n    int val;\n    Node next;\n    Node(int val) { this.val = val; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Node head = new Node(10);\n        head.next = new Node(20);\n        head.next.next = new Node(30);\n\n        System.out.print("Linked List: ");\n        for (Node curr = head; curr != null; curr = curr.next) {\n            System.out.print(curr.val + " -> ");\n        }\n        System.out.println("null");\n    }\n}`,
      javascript: `class Node {\n  constructor(val, next = null) {\n    this.val = val;\n    this.next = next;\n  }\n}\n\nconst head = new Node(10, new Node(20, new Node(30)));\nlet curr = head;\nconst vals = [];\nwhile (curr) {\n  vals.push(curr.val);\n  curr = curr.next;\n}\nconsole.log(vals.join(" -> ") + " -> null");`,
      typescript: `class ListNode<T> {\n  constructor(public val: T, public next: ListNode<T> | null = null) {}\n}\n\nconst head = new ListNode(10, new ListNode(20, new ListNode(30)));\nlet curr: ListNode<number> | null = head;\nwhile (curr) {\n  console.log("Node value:", curr.val);\n  curr = curr.next;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node {\n    int val;\n    struct Node* next;\n};\n\nint main() {\n    struct Node* n1 = malloc(sizeof(struct Node));\n    struct Node* n2 = malloc(sizeof(struct Node));\n    n1->val = 10; n1->next = n2;\n    n2->val = 20; n2->next = NULL;\n    printf("Node 1: %d -> Node 2: %d\\n", n1->val, n2->val);\n    free(n1); free(n2);\n    return 0;\n}`,
      go: `package main\nimport "fmt"\n\ntype Node struct {\n    val  int\n    next *Node\n}\n\nfunc main() {\n    head := &Node{val: 10, next: &Node{val: 20, next: nil}}\n    fmt.Printf("%d -> %d -> nil\\n", head.val, head.next.val)\n}`
    },
    passingScore: 1,
    quizzes: [
      {
        id: "ll-1",
        question: "Which of the following data structures provides dynamic size without contiguous memory allocation?",
        options: ["Array", "Linked List", "Matrix", "Tuple"],
        correctIndex: 1,
        explanation: "Linked lists allocate individual nodes dynamically on the heap anywhere in memory, linking them through pointers."
      },
      {
        id: "ll-2",
        question: "What is the time complexity of deleting a node at the head of a singly linked list?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        correctIndex: 0,
        explanation: "Deleting the head node only requires updating head = head.next, which takes O(1) constant time."
      }
    ]
  },
  {
    id: "stacks",
    name: "Stacks",
    order: 3,
    enabled: true,
    initialUnlocked: false,
    prerequisites: ["arrays"],
    summary: "LIFO (Last-In-First-Out) data structure for function calls and backtracking.",
    explanation:
      "A Stack is a restricted linear data structure following the Last-In, First-Out (LIFO) protocol. Elements can only be added (push) and removed (pop) from one end, designated as the top. Common use cases include expression parsing, call stacks, syntax bracket matching, and undo buffers.",
    operations: [
      { name: "Push (Insert Top)", timeComplexity: "O(1)", spaceComplexity: "O(1)", description: "Place item on top of stack." },
      { name: "Pop (Remove Top)", timeComplexity: "O(1)", spaceComplexity: "O(1)", description: "Extract and return the topmost element." },
      { name: "Peek / Top", timeComplexity: "O(1)", spaceComplexity: "O(1)", description: "Inspect topmost element without removal." },
      { name: "IsEmpty", timeComplexity: "O(1)", spaceComplexity: "O(1)", description: "Check if size == 0." }
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <stack>\nusing namespace std;\n\nint main() {\n    stack<int> s;\n    s.push(10);\n    s.push(20);\n    s.push(30);\n\n    cout << "Top element: " << s.top() << endl;\n    s.pop();\n    cout << "New top after pop: " << s.top() << endl;\n    cout << "Stack size: " << s.size() << endl;\n    return 0;\n}`,
      python: `# Stack using Python list (LIFO)\nstack = []\n\n# Push\nstack.append("Page 1")\nstack.append("Page 2")\nstack.append("Page 3")\n\nprint("Current top:", stack[-1])\n\n# Pop\npopped = stack.pop()\nprint(f"Popped: {popped}")\nprint("Remaining stack:", stack)`,
      java: `import java.util.Stack;\n\npublic class Main {\n    public static void main(String[] args) {\n        Stack<Integer> s = new Stack<>();\n        s.push(100);\n        s.push(200);\n        System.out.println("Top: " + s.peek());\n        System.out.println("Popped: " + s.pop());\n        System.out.println("New Top: " + s.peek());\n    }\n}`,
      javascript: `// Stack implementation in JavaScript\nconst stack = [];\nstack.push("A");\nstack.push("B");\nstack.push("C");\n\nconsole.log("Top:", stack[stack.length - 1]);\nconsole.log("Popped:", stack.pop());\nconsole.log("Current stack:", stack);`,
      typescript: `class Stack<T> {\n  private items: T[] = [];\n  push(item: T) { this.items.push(item); }\n  pop(): T | undefined { return this.items.pop(); }\n  peek(): T | undefined { return this.items[this.items.length - 1]; }\n  get size(): number { return this.items.length; }\n}\n\nconst s = new Stack<number>();\ns.push(10); s.push(20);\nconsole.log("Top:", s.peek());\nconsole.log("Popped:", s.pop());`,
      c: `#include <stdio.h>\n#define MAX 100\nint stack[MAX], top = -1;\nvoid push(int x) { stack[++top] = x; }\nint pop() { return stack[top--]; }\nint main() {\n    push(10); push(20);\n    printf("Popped: %d\\n", pop());\n    return 0;\n}`,
      go: `package main\nimport "fmt"\n\nfunc main() {\n    var stack []int\n    stack = append(stack, 10, 20, 30)\n    top := stack[len(stack)-1]\n    stack = stack[:len(stack)-1]\n    fmt.Printf("Top was %d, stack size is now %d\\n", top, len(stack))\n}`
    },
    passingScore: 1,
    quizzes: [
      {
        id: "stk-1",
        question: "Which principle governs the addition and removal of elements in a Stack?",
        options: ["First In First Out (FIFO)", "Last In First Out (LIFO)", "Random Access", "Priority Based"],
        correctIndex: 1,
        explanation: "Stacks adhere to LIFO (Last In First Out): the most recently pushed element is the first one popped."
      },
      {
        id: "stk-2",
        question: "What is the time complexity of the push and pop operations in an array-backed stack?",
        options: ["O(1) amortized", "O(n)", "O(log n)", "O(n^2)"],
        correctIndex: 0,
        explanation: "Pushing and popping at the top index does not require shifting elements, operating in O(1) constant time."
      }
    ]
  },
  {
    id: "queues",
    name: "Queues",
    order: 4,
    enabled: true,
    initialUnlocked: false,
    prerequisites: ["stacks"],
    summary: "FIFO (First-In-First-Out) structure for job scheduling and BFS traversal.",
    explanation:
      "A Queue operates on the First-In, First-Out (FIFO) rule. Elements are enqueued at the back (rear) and dequeued from the front. Queues are essential for breadth-first search (BFS), task scheduling, printer queues, and streaming buffers.",
    operations: [
      { name: "Enqueue", timeComplexity: "O(1)", spaceComplexity: "O(1)", description: "Add element to the rear of the queue." },
      { name: "Dequeue", timeComplexity: "O(1)", spaceComplexity: "O(1)", description: "Remove and return front element." },
      { name: "Front / Peek", timeComplexity: "O(1)", spaceComplexity: "O(1)", description: "Inspect front element without removal." }
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    queue<string> q;\n    q.push("Task 1");\n    q.push("Task 2");\n    q.push("Task 3");\n\n    cout << "Front task: " << q.front() << endl;\n    q.pop();\n    cout << "Next task in queue: " << q.front() << endl;\n    return 0;\n}`,
      python: `from collections import deque\n\nq = deque()\nq.append("Task A")\nq.append("Task B")\nq.append("Task C")\n\nprint("Processing:", q.popleft())  # O(1) FIFO pop\nprint("Next in line:", q[0])\nprint("Remaining:", list(q))`,
      java: `import java.util.LinkedList;\nimport java.util.Queue;\n\npublic class Main {\n    public static void main(String[] args) {\n        Queue<String> q = new LinkedList<>();\n        q.offer("Doc1.pdf");\n        q.offer("Doc2.pdf");\n        System.out.println("Printing: " + q.poll());\n        System.out.println("Next up: " + q.peek());\n    }\n}`,
      javascript: `class Queue {\n  constructor() { this.items = []; }\n  enqueue(item) { this.items.push(item); }\n  dequeue() { return this.items.shift(); }\n  peek() { return this.items[0]; }\n}\n\nconst q = new Queue();\nq.enqueue("Request 1");\nq.enqueue("Request 2");\nconsole.log("Served:", q.dequeue());\nconsole.log("Next:", q.peek());`,
      typescript: `class Queue<T> {\n  private items: T[] = [];\n  enqueue(val: T) { this.items.push(val); }\n  dequeue(): T | undefined { return this.items.shift(); }\n  peek(): T | undefined { return this.items[0]; }\n}\nconst q = new Queue<number>();\nq.enqueue(10); q.enqueue(20);\nconsole.log("Dequeued:", q.dequeue());`,
      c: `#include <stdio.h>\nint queue[10], front = 0, rear = 0;\nvoid enqueue(int x) { queue[rear++] = x; }\nint dequeue() { return queue[front++]; }\nint main() {\n    enqueue(42); enqueue(99);\n    printf("Dequeued: %d\\n", dequeue());\n    return 0;\n}`,
      go: `package main\nimport "fmt"\n\nfunc main() {\n    q := []string{"Job1", "Job2"}\n    item := q[0]\n    q = q[1:]\n    fmt.Printf("Processed %s, remaining: %v\\n", item, q)\n}`
    },
    passingScore: 1,
    quizzes: [
      {
        id: "que-1",
        question: "Which traversal algorithm relies on a Queue to explore adjacent nodes level by level?",
        options: ["Depth-First Search (DFS)", "Breadth-First Search (BFS)", "Binary Search", "Quick Sort"],
        correctIndex: 1,
        explanation: "Breadth-First Search (BFS) explores vertices level-by-level using a FIFO queue."
      }
    ]
  },
  {
    id: "hash-tables",
    name: "Hash Tables",
    order: 5,
    enabled: true,
    initialUnlocked: false,
    prerequisites: ["arrays"],
    summary: "Associative key-value map delivering average O(1) lookups via hash functions.",
    explanation:
      "A Hash Table maps keys to values using a mathematical hash function that computes an index into an array of buckets. Under good distribution, insertion, deletion, and search are average O(1). Collisions are typically handled via chaining (linked lists) or open addressing (linear/quadratic probing).",
    operations: [
      { name: "Insert (key, value)", timeComplexity: "O(1) avg", spaceComplexity: "O(1)", description: "Hash key and store in computed bucket." },
      { name: "Search (key)", timeComplexity: "O(1) avg", spaceComplexity: "O(1)", description: "Lookup value associated with key in O(1)." },
      { name: "Delete (key)", timeComplexity: "O(1) avg", spaceComplexity: "O(1)", description: "Remove entry from bucket." }
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    unordered_map<string, int> ages;\n    ages["Alice"] = 28;\n    ages["Bob"] = 24;\n    ages["Charlie"] = 32;\n\n    cout << "Bob's age: " << ages["Bob"] << endl;\n    cout << "Has Alice? " << (ages.count("Alice") ? "Yes" : "No") << endl;\n    return 0;\n}`,
      python: `# Python Dictionary (Hash Map)\nstock = {"apple": 50, "banana": 30, "orange": 20}\n\n# Lookup by key\nprint("Apple price:", stock.get("apple"))\n\n# Insert / update\nstock["mango"] = 45\n\nprint("Inventory:", stock)`,
      java: `import java.util.HashMap;\n\npublic class Main {\n    public static void main(String[] args) {\n        HashMap<String, Integer> map = new HashMap<>();\n        map.put("Alice", 95);\n        map.put("Bob", 88);\n        System.out.println("Alice score: " + map.get("Alice"));\n        System.out.println("Contains Charlie: " + map.containsKey("Charlie"));\n    }\n}`,
      javascript: `const map = new Map();\nmap.set("id_101", { name: "Antigravity", role: "AI" });\nmap.set("id_102", { name: "Dev", role: "Engineer" });\n\nconsole.log("Lookup id_101:", map.get("id_101"));\nconsole.log("Size:", map.size);`,
      typescript: `const counts: Record<string, number> = {};\ncounts["hits"] = 42;\ncounts["misses"] = 3;\nconsole.log("Hit ratio:", counts["hits"] / (counts["hits"] + counts["misses"]));`,
      c: `#include <stdio.h>\n// Hash tables in C typically use custom bucket arrays\nint main() {\n    printf("Hash table concept: Key -> Hash(Key) %% Buckets -> Value\\n");\n    return 0;\n}`,
      go: `package main\nimport "fmt"\n\nfunc main() {\n    scores := map[string]int{"Alice": 98, "Bob": 85}\n    fmt.Printf("Alice: %d\\n", scores["Alice"])\n}`
    },
    passingScore: 1,
    quizzes: [
      {
        id: "ht-1",
        question: "What is the average time complexity for searching a key in a well-balanced Hash Table?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        correctIndex: 2,
        explanation: "With a uniform hash function and low load factor, hashing directly locates the bucket in O(1) average time."
      }
    ]
  },
  {
    id: "trees",
    name: "Trees",
    order: 6,
    enabled: true,
    initialUnlocked: false,
    prerequisites: ["linked-lists"],
    summary: "Hierarchical non-linear structure consisting of root and child nodes.",
    explanation:
      "A Tree is an acyclic connected graph where one node is designated as the root and every other node has exactly one parent. Trees naturally represent hierarchies such as file systems, DOM trees, and decision paths.",
    operations: [
      { name: "Pre-order Traversal", timeComplexity: "O(n)", spaceComplexity: "O(h)", description: "Visit: Root -> Left -> Right." },
      { name: "In-order Traversal", timeComplexity: "O(n)", spaceComplexity: "O(h)", description: "Visit: Left -> Root -> Right." },
      { name: "Post-order Traversal", timeComplexity: "O(n)", spaceComplexity: "O(h)", description: "Visit: Left -> Right -> Root." }
    ],
    starterCode: {
      cpp: `#include <iostream>\nusing namespace std;\n\nstruct TreeNode {\n    int val;\n    TreeNode *left, *right;\n    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}\n};\n\nvoid inorder(TreeNode* root) {\n    if (!root) return;\n    inorder(root->left);\n    cout << root->val << " ";\n    inorder(root->right);\n}\n\nint main() {\n    TreeNode* root = new TreeNode(1);\n    root->left = new TreeNode(2);\n    root->right = new TreeNode(3);\n    cout << "Inorder: ";\n    inorder(root);\n    cout << endl;\n    return 0;\n}`,
      python: `class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef preorder(node):\n    if not node: return\n    print(node.val, end=" ")\n    preorder(node.left)\n    preorder(node.right)\n\nroot = TreeNode("Root", TreeNode("Left Child"), TreeNode("Right Child"))\nprint("Preorder traversal:")\npreorder(root)\nprint()`,
      java: `class TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int v) { val = v; }\n}\npublic class Main {\n    static void printInorder(TreeNode root) {\n        if (root == null) return;\n        printInorder(root.left);\n        System.out.print(root.val + " ");\n        printInorder(root.right);\n    }\n    public static void main(String[] args) {\n        TreeNode root = new TreeNode(10);\n        root.left = new TreeNode(5);\n        root.right = new TreeNode(15);\n        printInorder(root);\n    }\n}`,
      javascript: `const tree = {\n  val: 1,\n  left: { val: 2, left: null, right: null },\n  right: { val: 3, left: null, right: null }\n};\nconsole.log("Root value:", tree.val);\nconsole.log("Left child:", tree.left.val);`,
      typescript: `interface TreeNode<T> {\n  val: T;\n  left?: TreeNode<T>;\n  right?: TreeNode<T>;\n}\nconst root: TreeNode<number> = { val: 10, left: { val: 5 } };\nconsole.log(root.val, root.left?.val);`,
      c: `#include <stdio.h>\nstruct Node { int val; struct Node *left, *right; };\nint main() { printf("Binary Tree representation with pointer nodes\\n"); return 0; }`,
      go: `package main\nimport "fmt"\ntype Node struct { val int; left, right *Node }\nfunc main() { r := &Node{val: 1}; fmt.Println(r.val) }`
    },
    passingScore: 1,
    quizzes: [
      {
        id: "tr-1",
        question: "In an in-order traversal of a binary search tree, in what sequence are values visited?",
        options: ["Random order", "Sorted ascending order", "Sorted descending order", "Level by level"],
        correctIndex: 1,
        explanation: "Because in-order visits Left -> Root -> Right, a BST in-order traversal always produces sorted ascending values."
      }
    ]
  },
  {
    id: "binary-search-trees",
    name: "Binary Search Trees",
    order: 7,
    enabled: true,
    initialUnlocked: false,
    prerequisites: ["trees"],
    summary: "Ordered binary tree enabling O(log n) search, insertion, and deletion.",
    explanation:
      "A Binary Search Tree (BST) enforces the property that for every node X, all values in its left subtree are strictly less than X.val, and all values in its right subtree are strictly greater. In balanced BSTs (like AVL or Red-Black), search, insertion, and deletion take O(log n) time.",
    operations: [
      { name: "Search", timeComplexity: "O(log n) avg", spaceComplexity: "O(1)", description: "Compare and branch left or right." },
      { name: "Insert", timeComplexity: "O(log n) avg", spaceComplexity: "O(1)", description: "Traverse to null leaf and attach node." },
      { name: "Delete", timeComplexity: "O(log n) avg", spaceComplexity: "O(1)", description: "Replace with in-order predecessor/successor." }
    ],
    starterCode: {
      cpp: `#include <iostream>\nusing namespace std;\n\nstruct Node {\n    int val;\n    Node *left = nullptr, *right = nullptr;\n    Node(int v) : val(v) {}\n};\n\nNode* insert(Node* root, int val) {\n    if (!root) return new Node(val);\n    if (val < root->val) root->left = insert(root->left, val);\n    else root->right = insert(root->right, val);\n    return root;\n}\n\nint main() {\n    Node* root = nullptr;\n    root = insert(root, 50);\n    insert(root, 30);\n    insert(root, 70);\n    cout << "BST root: " << root->val << ", Left: " << root->left->val << ", Right: " << root->right->val << endl;\n    return 0;\n}`,
      python: `class BSTNode:\n    def __init__(self, val):\n        self.val = val\n        self.left = None\n        self.right = None\n\ndef search(root, target):\n    if not root or root.val == target:\n        return root\n    if target < root.val:\n        return search(root.left, target)\n    return search(root.right, target)\n\nroot = BSTNode(50)\nroot.left = BSTNode(30)\nroot.right = BSTNode(70)\n\nfound = search(root, 70)\nprint("Found 70 in BST:", found is not None)`,
      java: `public class Main {\n    static class Node { int val; Node left, right; Node(int v) { val = v; } }\n    public static void main(String[] args) {\n        Node root = new Node(50);\n        root.left = new Node(20);\n        root.right = new Node(80);\n        System.out.println("BST Root: " + root.val);\n    }\n}`,
      javascript: `class BST {\n  constructor(val) { this.val = val; this.left = null; this.right = null; }\n}\nconst root = new BST(50);\nroot.left = new BST(25);\nconsole.log("Root:", root.val, "Left:", root.left.val);`,
      typescript: `type BSTNode = { val: number; left?: BSTNode; right?: BSTNode };\nconst root: BSTNode = { val: 50, left: { val: 20 }, right: { val: 80 } };\nconsole.log(root.val);`,
      c: `#include <stdio.h>\nint main() { printf("BST maintains Left < Root < Right invariant.\\n"); return 0; }`,
      go: `package main\nimport "fmt"\nfunc main() { fmt.Println("Binary Search Tree") }`
    },
    passingScore: 1,
    quizzes: [
      {
        id: "bst-1",
        question: "What is the worst-case search time complexity in an unbalanced, skewed BST?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctIndex: 2,
        explanation: "When nodes are inserted in sorted order, an unbalanced BST degenerates into a linked list with O(n) worst-case search."
      }
    ]
  },
  {
    id: "heaps",
    name: "Heaps",
    order: 8,
    enabled: true,
    initialUnlocked: false,
    prerequisites: ["trees"],
    summary: "Complete binary tree maintaining the heap property for Priority Queues.",
    explanation:
      "A Heap is a complete binary tree where every parent node satisfies the heap property: in a Min-Heap, parent <= children; in a Max-Heap, parent >= children. Heaps are typically implemented using flat arrays with parent/child index arithmetic.",
    operations: [
      { name: "Peek Max/Min", timeComplexity: "O(1)", spaceComplexity: "O(1)", description: "Root element at index 0." },
      { name: "Insert (Push)", timeComplexity: "O(log n)", spaceComplexity: "O(1)", description: "Append at end and sift-up." },
      { name: "Extract Max/Min", timeComplexity: "O(log n)", spaceComplexity: "O(1)", description: "Swap root with last, pop, and sift-down." }
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    // Max-heap by default in C++\n    priority_queue<int> maxHeap;\n    maxHeap.push(30);\n    maxHeap.push(10);\n    maxHeap.push(50);\n\n    cout << "Top element: " << maxHeap.top() << endl;\n    maxHeap.pop();\n    cout << "Next top: " << maxHeap.top() << endl;\n    return 0;\n}`,
      python: `import heapq\n\n# Python heapq provides Min-Heap by default\nnums = [50, 20, 80, 10, 30]\nheapq.heapify(nums)\n\nprint("Smallest element (Min-Heap root):", heapq.heappop(nums))\nprint("Second smallest:", heapq.heappop(nums))`,
      java: `import java.util.PriorityQueue;\n\npublic class Main {\n    public static void main(String[] args) {\n        PriorityQueue<Integer> pq = new PriorityQueue<>();\n        pq.add(40);\n        pq.add(10);\n        pq.add(25);\n        System.out.println("Min element: " + pq.poll());\n    }\n}`,
      javascript: `// Priority queue / heap demonstration\nconst heap = [10, 20, 30];\nconsole.log("Min heap root:", heap[0]);`,
      typescript: `const pq: number[] = [5, 15, 25];\nconsole.log("Peek min:", pq[0]);`,
      c: `#include <stdio.h>\nint main() { printf("Heap is stored in an array: parent=(i-1)/2, left=2i+1, right=2i+2\\n"); return 0; }`,
      go: `package main\nimport "fmt"\nfunc main() { fmt.Println("Heaps / Priority Queue") }`
    },
    passingScore: 1,
    quizzes: [
      {
        id: "hp-1",
        question: "What is the time complexity to extract the minimum element from a Min-Heap of size n?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctIndex: 1,
        explanation: "Extracting the root requires swapping with the last element and sifting down through tree height log(n)."
      }
    ]
  },
  {
    id: "graphs",
    name: "Graphs",
    order: 9,
    enabled: true,
    initialUnlocked: false,
    prerequisites: ["trees", "queues"],
    summary: "Networks of vertices connected by edges (directed, undirected, weighted).",
    explanation:
      "A Graph G = (V, E) consists of a set of vertices (V) and edges (E). Graphs model social networks, transportation maps, and internet routing. Fundamental graph traversal algorithms include BFS (shortest path in unweighted graphs) and DFS (cycle detection, topological sort).",
    operations: [
      { name: "BFS (Breadth-First)", timeComplexity: "O(V + E)", spaceComplexity: "O(V)", description: "Queue-based level traversal." },
      { name: "DFS (Depth-First)", timeComplexity: "O(V + E)", spaceComplexity: "O(V)", description: "Recursion/stack-based depth exploration." },
      { name: "Dijkstra Algorithm", timeComplexity: "O((V + E) log V)", spaceComplexity: "O(V)", description: "Single-source shortest path with non-negative weights." }
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n = 4;\n    vector<vector<int>> adj(n);\n    adj[0] = {1, 2};\n    adj[1] = {0, 2, 3};\n    adj[2] = {0, 1};\n    adj[3] = {1};\n\n    cout << "Neighbors of node 1: ";\n    for (int v : adj[1]) cout << v << " ";\n    cout << endl;\n    return 0;\n}`,
      python: `# Graph adjacency list representation\ngraph = {\n    "A": ["B", "C"],\n    "B": ["A", "D"],\n    "C": ["A", "D"],\n    "D": ["B", "C"]\n}\n\n# BFS Traversal\nfrom collections import deque\nvisited = set(["A"])\nq = deque(["A"])\nprint("BFS Order:", end=" ")\nwhile q:\n    node = q.popleft()\n    print(node, end=" ")\n    for neighbor in graph[node]:\n        if neighbor not in visited:\n            visited.add(neighbor)\n            q.append(neighbor)\nprint()`,
      java: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Map<Integer, List<Integer>> adj = new HashMap<>();\n        adj.put(1, Arrays.asList(2, 3));\n        System.out.println("Node 1 edges: " + adj.get(1));\n    }\n}`,
      javascript: `const graph = { 0: [1, 2], 1: [0, 3], 2: [0], 3: [1] };\nconsole.log("Graph adjacency:", graph);`,
      typescript: `type Graph = Map<number, number[]>;\nconst g: Graph = new Map();\ng.set(0, [1, 2]);\nconsole.log("Node 0 neighbors:", g.get(0));`,
      c: `#include <stdio.h>\nint main() { printf("Graph represented via adjacency matrix or adjacency list\\n"); return 0; }`,
      go: `package main\nimport "fmt"\nfunc main() { fmt.Println("Graphs") }`
    },
    passingScore: 1,
    quizzes: [
      {
        id: "gr-1",
        question: "What is the time complexity of Breadth-First Search (BFS) using an adjacency list?",
        options: ["O(V)", "O(E)", "O(V + E)", "O(V * E)"],
        correctIndex: 2,
        explanation: "BFS visits every vertex once O(V) and traverses each edge once O(E), yielding O(V + E)."
      }
    ]
  },
  {
    id: "trie",
    name: "Trie",
    order: 10,
    enabled: true,
    initialUnlocked: false,
    prerequisites: ["trees", "hash-tables"],
    summary: "Prefix tree optimized for fast string retrieval and autocomplete.",
    explanation:
      "A Trie (pronounced 'try') is a tree-like data structure used to store a dynamic set of strings where keys are usually strings. Unlike a binary search tree, no node in the tree stores the key associated with that node; instead, its position in the tree defines the key. Searching for a string of length L takes O(L) time regardless of the number of strings stored.",
    operations: [
      { name: "Insert (word)", timeComplexity: "O(L)", spaceComplexity: "O(L)", description: "Where L is length of word." },
      { name: "Search (word)", timeComplexity: "O(L)", spaceComplexity: "O(1)", description: "Check if exact word exists." },
      { name: "StartsWith (prefix)", timeComplexity: "O(L)", spaceComplexity: "O(1)", description: "Autocomplete and prefix matching." }
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <unordered_map>\nusing namespace std;\n\nstruct TrieNode {\n    unordered_map<char, TrieNode*> children;\n    bool isEnd = false;\n};\n\nint main() {\n    TrieNode* root = new TrieNode();\n    string word = "cat";\n    TrieNode* curr = root;\n    for (char c : word) {\n        if (!curr->children.count(c)) curr->children[c] = new TrieNode();\n        curr = curr->children[c];\n    }\n    curr->isEnd = true;\n    cout << "Word 'cat' inserted into Trie successfully!" << endl;\n    return 0;\n}`,
      python: `class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n    \n    def insert(self, word):\n        curr = self.root\n        for ch in word:\n            if ch not in curr.children:\n                curr.children[ch] = TrieNode()\n            curr = curr.children[ch]\n        curr.is_end = True\n\nt = Trie()\nt.insert("apple")\nprint("Trie built with word: apple")`,
      java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Trie prefix tree demonstration");\n    }\n}`,
      javascript: `console.log("Trie: O(L) prefix search structure");`,
      typescript: `console.log("Trie implementation");`,
      c: `#include <stdio.h>\nint main() { printf("Trie prefix tree\\n"); return 0; }`,
      go: `package main\nimport "fmt"\nfunc main() { fmt.Println("Trie") }`
    },
    passingScore: 1,
    quizzes: [
      {
        id: "trie-1",
        question: "What is the time complexity of searching a word of length L in a Trie containing N words?",
        options: ["O(N)", "O(L)", "O(N * L)", "O(log N)"],
        correctIndex: 1,
        explanation: "In a Trie, search depends only on the length of the string L, completely independent of the total number of words N."
      }
    ]
  },
  {
    id: "union-find",
    name: "Union Find",
    order: 11,
    enabled: true,
    initialUnlocked: false,
    prerequisites: ["graphs"],
    summary: "Disjoint-set structure with near O(1) union and connected component queries.",
    explanation:
      "Disjoint Set Union (DSU / Union-Find) keeps track of elements partitioned into non-overlapping subsets. It provides two operations: Find (determine which subset an element belongs to) and Union (join two subsets). With path compression and union by rank, operations run in nearly O(1) amortized time (inverse Ackermann function α(n)).",
    operations: [
      { name: "Find(x)", timeComplexity: "O(α(n))", spaceComplexity: "O(1)", description: "Path compression flattens tree." },
      { name: "Union(x, y)", timeComplexity: "O(α(n))", spaceComplexity: "O(1)", description: "Union by rank merges smaller tree under larger." },
      { name: "Connected(x, y)", timeComplexity: "O(α(n))", spaceComplexity: "O(1)", description: "Check if Find(x) == Find(y)." }
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nstruct DSU {\n    vector<int> parent;\n    DSU(int n) : parent(n) {\n        for (int i = 0; i < n; ++i) parent[i] = i;\n    }\n    int find(int x) {\n        if (parent[x] == x) return x;\n        return parent[x] = find(parent[x]); // Path compression\n    }\n    void unite(int x, int y) {\n        parent[find(x)] = find(y);\n    }\n};\n\nint main() {\n    DSU dsu(5);\n    dsu.unite(0, 1);\n    dsu.unite(1, 2);\n    cout << "Are 0 and 2 connected? " << (dsu.find(0) == dsu.find(2) ? "Yes" : "No") << endl;\n    return 0;\n}`,
      python: `class DSU:\n    def __init__(self, n):\n        self.parent = list(range(n))\n    def find(self, x):\n        if self.parent[x] != x:\n            self.parent[x] = self.find(self.parent[x])\n        return self.parent[x]\n    def union(self, x, y):\n        self.parent[self.find(x)] = self.find(y)\n\nd = DSU(5)\nd.union(0, 1)\nd.union(1, 2)\nprint("Connected 0 and 2:", d.find(0) == d.find(2))\nprint("Connected 0 and 3:", d.find(0) == d.find(3))`,
      java: `public class Main { public static void main(String[] args) { System.out.println("Disjoint Set Union"); } }`,
      javascript: `console.log("Union-Find / Disjoint Set");`,
      typescript: `console.log("Union-Find");`,
      c: `#include <stdio.h>\nint main() { printf("Disjoint Set Union\\n"); return 0; }`,
      go: `package main\nimport "fmt"\nfunc main() { fmt.Println("Union Find") }`
    },
    passingScore: 1,
    quizzes: [
      {
        id: "uf-1",
        question: "What optimizations reduce Union-Find operation complexity to nearly O(1) amortized?",
        options: ["Sorting and Binary Search", "Path Compression and Union by Rank", "Memoization and Hashing", "Depth-First Search"],
        correctIndex: 1,
        explanation: "Combining Path Compression with Union by Rank yields amortized O(α(n)) where α is the inverse Ackermann function."
      }
    ]
  },
  {
    id: "sorting",
    name: "Sorting",
    order: 12,
    enabled: true,
    initialUnlocked: false,
    prerequisites: ["arrays"],
    summary: "Algorithms for ordering elements: QuickSort, MergeSort, HeapSort.",
    explanation:
      "Sorting arranges data in a specified sequence. Comparison-based sorting algorithms have a lower bound of O(n log n) time. Key algorithms include QuickSort (fast in-place divide and conquer), MergeSort (stable O(n log n)), and HeapSort (guaranteed O(n log n) in-place).",
    operations: [
      { name: "QuickSort", timeComplexity: "O(n log n) avg", spaceComplexity: "O(log n)", description: "Divide and conquer via pivot partitioning." },
      { name: "MergeSort", timeComplexity: "O(n log n)", spaceComplexity: "O(n)", description: "Stable divide, sort, and merge." },
      { name: "Bubble/Insertion Sort", timeComplexity: "O(n^2)", spaceComplexity: "O(1)", description: "Simple quadratic sorts for small arrays." }
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> nums = {42, 12, 88, 3, 27};\n    sort(nums.begin(), nums.end());\n    cout << "Sorted: ";\n    for (int x : nums) cout << x << " ";\n    cout << endl;\n    return 0;\n}`,
      python: `def quicksort(arr):\n    if len(arr) <= 1: return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)\n\nnums = [42, 12, 88, 3, 27]\nprint("QuickSort Result:", quicksort(nums))`,
      java: `import java.util.Arrays;\npublic class Main {\n    public static void main(String[] args) {\n        int[] arr = {42, 12, 88, 3, 27};\n        Arrays.sort(arr);\n        System.out.println("Sorted: " + Arrays.toString(arr));\n    }\n}`,
      javascript: `const nums = [42, 12, 88, 3, 27];\nnums.sort((a, b) => a - b);\nconsole.log("Sorted:", nums);`,
      typescript: `const arr: number[] = [42, 12, 88, 3, 27];\narr.sort((a, b) => a - b);\nconsole.log("Sorted:", arr);`,
      c: `#include <stdio.h>\n#include <stdlib.h>\nint cmp(const void* a, const void* b) { return (*(int*)a - *(int*)b); }\nint main() {\n    int arr[] = {42, 12, 88, 3, 27};\n    qsort(arr, 5, sizeof(int), cmp);\n    printf("Sorted: %d %d %d %d %d\\n", arr[0], arr[1], arr[2], arr[3], arr[4]);\n    return 0;\n}`,
      go: `package main\nimport ("fmt"; "sort")\nfunc main() {\n    s := []int{42, 12, 88, 3, 27}\n    sort.Ints(s)\n    fmt.Println(s)\n}`
    },
    passingScore: 1,
    quizzes: [
      {
        id: "sort-1",
        question: "What is the worst-case time complexity of MergeSort?",
        options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
        correctIndex: 1,
        explanation: "MergeSort always divides the list into halves and merges them, guaranteeing O(n log n) even in the worst case."
      }
    ]
  },
  {
    id: "searching",
    name: "Searching",
    order: 13,
    enabled: true,
    initialUnlocked: false,
    prerequisites: ["sorting"],
    summary: "Techniques for finding items: Linear Search, Binary Search, Two Pointers.",
    explanation:
      "Searching algorithms locate targets within collections. Linear search requires O(n) for unstructured data. Binary search operates on sorted arrays in O(log n) by repeatedly halving the search window. Two-pointer patterns and sliding windows extend search capabilities.",
    operations: [
      { name: "Binary Search", timeComplexity: "O(log n)", spaceComplexity: "O(1)", description: "Halves search interval on sorted array." },
      { name: "Linear Search", timeComplexity: "O(n)", spaceComplexity: "O(1)", description: "Sequential scan of all elements." }
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint binarySearch(const vector<int>& arr, int target) {\n    int low = 0, high = arr.size() - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}\n\nint main() {\n    vector<int> sortedArr = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};\n    int index = binarySearch(sortedArr, 23);\n    cout << "Target 23 found at index: " << index << endl;\n    return 0;\n}`,
      python: `def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\narr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\nidx = binary_search(arr, 23)\nprint(f"Index of 23: {idx}")`,
      java: `public class Main {\n    public static void main(String[] args) {\n        int[] arr = {1, 3, 5, 7, 9};\n        System.out.println("Binary search index for 7: " + java.util.Arrays.binarySearch(arr, 7));\n    }\n}`,
      javascript: `const arr = [10, 20, 30, 40, 50];\nconsole.log("Index of 30:", arr.indexOf(30));`,
      typescript: `const arr = [1, 2, 4, 8, 16];\nconsole.log("Found 8 at:", arr.indexOf(8));`,
      c: `#include <stdio.h>\nint main() { printf("Binary search O(log n)\\n"); return 0; }`,
      go: `package main\nimport "fmt"\nfunc main() { fmt.Println("Binary Search") }`
    },
    passingScore: 1,
    quizzes: [
      {
        id: "srch-1",
        question: "What prerequisite must be satisfied before Binary Search can be applied to an array?",
        options: ["All values must be unique", "The array must be sorted", "Size must be a power of 2", "Elements must be integers"],
        correctIndex: 1,
        explanation: "Binary search relies on ordering to discard half the search space with each comparison."
      }
    ]
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    order: 14,
    enabled: true,
    initialUnlocked: false,
    prerequisites: ["searching", "trees"],
    summary: "Optimization method breaking problems into overlapping subproblems with memoization.",
    explanation:
      "Dynamic Programming (DP) solves complex problems by breaking them down into simpler subproblems, solving each subproblem once, and storing their solutions (memoization or tabulation). Key properties are Optimal Substructure and Overlapping Subproblems.",
    operations: [
      { name: "Top-Down (Memoization)", timeComplexity: "O(states)", spaceComplexity: "O(states + stack)", description: "Recursion with cache table." },
      { name: "Bottom-Up (Tabulation)", timeComplexity: "O(states)", spaceComplexity: "O(states)", description: "Iterative table building from base cases." },
      { name: "Space-Optimized DP", timeComplexity: "O(states)", spaceComplexity: "O(1) to O(n)", description: "Keep only previous state variables." }
    ],
    starterCode: {
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Fibonacci with DP tabulation\nint fib(int n) {\n    if (n <= 1) return n;\n    vector<int> dp(n + 1);\n    dp[0] = 0; dp[1] = 1;\n    for (int i = 2; i <= n; ++i) {\n        dp[i] = dp[i - 1] + dp[i - 2];\n    }\n    return dp[n];\n}\n\nint main() {\n    cout << "Fibonacci(10): " << fib(10) << endl;\n    return 0;\n}`,
      python: `# Top-Down DP with Memoization (Fibonacci)\ndef fib(n, memo={}):\n    if n in memo: return memo[n]\n    if n <= 1: return n\n    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)\n    return memo[n]\n\nprint("Fibonacci(10) =", fib(10))\nprint("Fibonacci(30) =", fib(30))`,
      java: `public class Main {\n    public static void main(String[] args) {\n        int n = 10;\n        int[] dp = new int[n + 1];\n        dp[0] = 0; dp[1] = 1;\n        for (int i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];\n        System.out.println("Fib(10) = " + dp[n]);\n    }\n}`,
      javascript: `// DP Tabulation\nfunction fib(n) {\n  const dp = [0, 1];\n  for (let i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];\n  return dp[n];\n}\nconsole.log("Fib(10):", fib(10));`,
      typescript: `function fib(n: number): number {\n  let a = 0, b = 1;\n  for (let i = 0; i < n; i++) [a, b] = [b, a + b];\n  return a;\n}\nconsole.log("Fib(10):", fib(10));`,
      c: `#include <stdio.h>\nint main() { printf("Dynamic Programming: Optimal Substructure + Overlapping Subproblems\\n"); return 0; }`,
      go: `package main\nimport "fmt"\nfunc main() { fmt.Println("Dynamic Programming") }`
    },
    passingScore: 1,
    quizzes: [
      {
        id: "dp-1",
        question: "Which two key properties make a problem suitable for Dynamic Programming?",
        options: [
          "Greedy choice and linear time",
          "Optimal substructure and overlapping subproblems",
          "Random access and sorted inputs",
          "Acyclic graphs and divide-and-conquer"
        ],
        correctIndex: 1,
        explanation: "Dynamic programming applies when subproblems overlap (computed multiple times) and optimal solutions to subproblems combine into optimal solutions for the overall problem."
      }
    ]
  }
];

export function getTopicById(id: string, topics: TopicConfig[] = DEFAULT_TOPICS): TopicConfig | undefined {
  return topics.find((t) => t.id === id);
}
