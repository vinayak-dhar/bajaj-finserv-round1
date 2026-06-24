// =====================================
// YOUR DETAILS
// =====================================

const USER_ID = "vinayakdhar_23092004";
const EMAIL_ID = "vinayak2243.be23@chitkara.edu.in";
const COLLEGE_ROLL_NUMBER = "2310992243";

function processHierarchy(data) {
  const invalidEntries = [];
  const duplicateEdges = [];

  const seenEdges = new Set();
  const duplicateTracker = new Set();

  const childParent = new Map();

  const adj = {};
  const indegree = {};
  const nodes = new Set();

  // ---------------------------------
  // VALIDATION + DUPLICATE CHECK
  // ---------------------------------

  for (let raw of data) {
    const entry = String(raw).trim();

    if (!/^[A-Z]->[A-Z]$/.test(entry)) {
      invalidEntries.push(raw);
      continue;
    }

    const [parent, child] = entry.split("->");

    if (parent === child) {
      invalidEntries.push(raw);
      continue;
    }

    if (seenEdges.has(entry)) {
      if (!duplicateTracker.has(entry)) {
        duplicateEdges.push(entry);
        duplicateTracker.add(entry);
      }
      continue;
    }

    seenEdges.add(entry);

    // Multi-parent rule
    if (childParent.has(child)) {
      continue;
    }

    childParent.set(child, parent);

    if (!adj[parent]) adj[parent] = [];
    if (!adj[child]) adj[child] = [];

    adj[parent].push(child);

    indegree[parent] ??= 0;
    indegree[child] ??= 0;

    indegree[child]++;

    nodes.add(parent);
    nodes.add(child);
  }

  // ---------------------------------
  // BUILD UNDIRECTED GRAPH
  // ---------------------------------

  const undirected = {};

  for (const node of nodes) {
    undirected[node] = [];
  }

  for (const parent in adj) {
    for (const child of adj[parent]) {
      undirected[parent].push(child);
      undirected[child].push(parent);
    }
  }

  // ---------------------------------
  // FIND COMPONENTS
  // ---------------------------------

  const visited = new Set();
  const components = [];

  for (const node of nodes) {
    if (visited.has(node)) continue;

    const stack = [node];
    const component = [];

    visited.add(node);

    while (stack.length) {
      const curr = stack.pop();
      component.push(curr);

      for (const next of undirected[curr]) {
        if (!visited.has(next)) {
          visited.add(next);
          stack.push(next);
        }
      }
    }

    components.push(component);
  }

  // ---------------------------------
  // PROCESS COMPONENTS
  // ---------------------------------

  const hierarchies = [];

  let totalTrees = 0;
  let totalCycles = 0;

  let largestDepth = -1;
  let largestTreeRoot = "";

  for (const component of components) {
    const componentSet = new Set(component);

    const rootCandidates = component.filter(
      node => indegree[node] === 0
    );

    let root;

    if (rootCandidates.length > 0) {
      root = rootCandidates.sort()[0];
    } else {
      root = [...component].sort()[0];
    }

    const cycle = hasCycle(root, adj, componentSet);

    if (cycle) {
      totalCycles++;

      hierarchies.push({
        root,
        tree: {},
        has_cycle: true
      });

      continue;
    }

    totalTrees++;

    const tree = {
      [root]: buildTree(root, adj)
    };

    const depth = calculateDepth(root, adj);

    if (
      depth > largestDepth ||
      (depth === largestDepth &&
        root < largestTreeRoot)
    ) {
      largestDepth = depth;
      largestTreeRoot = root;
    }

    hierarchies.push({
      root,
      tree,
      depth
    });
  }

  return {
    user_id: USER_ID,
    email_id: EMAIL_ID,
    college_roll_number: COLLEGE_ROLL_NUMBER,
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary: {
      total_trees: totalTrees,
      total_cycles: totalCycles,
      largest_tree_root: largestTreeRoot
    }
  };
}

// -------------------------------------
// CYCLE DETECTION
// -------------------------------------

function hasCycle(root, adj, componentSet) {
  const color = {};

  for (const node of componentSet) {
    color[node] = 0;
  }

  function dfs(node) {
    color[node] = 1;

    for (const child of adj[node] || []) {
      if (!componentSet.has(child)) continue;

      if (color[child] === 1) {
        return true;
      }

      if (
        color[child] === 0 &&
        dfs(child)
      ) {
        return true;
      }
    }

    color[node] = 2;

    return false;
  }

  for (const node of componentSet) {
    if (color[node] === 0) {
      if (dfs(node)) return true;
    }
  }

  return false;
}

// -------------------------------------
// TREE BUILDER
// -------------------------------------

function buildTree(node, adj) {
  const result = {};

  const children = [...(adj[node] || [])].sort();

  for (const child of children) {
    result[child] = buildTree(child, adj);
  }

  return result;
}

// -------------------------------------
// DEPTH
// -------------------------------------

function calculateDepth(node, adj) {
  const children = adj[node] || [];

  if (children.length === 0) {
    return 1;
  }

  let maxChild = 0;

  for (const child of children) {
    maxChild = Math.max(
      maxChild,
      calculateDepth(child, adj)
    );
  }

  return 1 + maxChild;
}

module.exports = processHierarchy;