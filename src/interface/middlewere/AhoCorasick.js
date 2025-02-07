
class Trie {
    constructor() {
        this.nodes = {}; // Root node of the trie
        this.output = {}; // Stores matching patterns
    }

    addPattern(pattern, index) {
        let currentNode = 0;

        for (const char of pattern) {
            if (!this.nodes[currentNode]) this.nodes[currentNode] = {};
            if (!(char in this.nodes[currentNode])) {
                this.nodes[currentNode][char] = ++index;
            }
            currentNode = this.nodes[currentNode][char];
        }

        if (!this.output[currentNode]) this.output[currentNode] = [];
        this.output[currentNode].push(pattern);

        return index;
    }
}

class AhoCorasick {
    constructor(patterns) {
        this.trie = new Trie(); // Use the Trie class
        this.fail = {}; // Stores failure links

        this.buildTrie(patterns);
        this.buildFailureLinks();
    }

    // Build the trie from the patterns
    buildTrie(patterns) {
        let nodeCount = 0;

        for (const pattern of patterns) {
            nodeCount = this.trie.addPattern(pattern, nodeCount);
        }
    }

    // Build the failure links
    buildFailureLinks() {
        const queue = [];
        this.fail[0] = 0;

        // Initialize fail links for depth-1 nodes
        for (const char in this.trie.nodes[0]) {
            const child = this.trie.nodes[0][char];
            this.fail[child] = 0;
            queue.push(child);
        }

        // BFS to set fail links for deeper nodes
        while (queue.length > 0) {
            const currentNode = queue.shift();

            for (const char in this.trie.nodes[currentNode]) {
                const child = this.trie.nodes[currentNode][char];
                let fallback = this.fail[currentNode];

                while (fallback !== 0 && !(char in this.trie.nodes[fallback])) {
                    fallback = this.fail[fallback];
                }

                if (char in this.trie.nodes[fallback]) {
                    fallback = this.trie.nodes[fallback][char];
                }

                this.fail[child] = fallback;

                if (!this.trie.output[child]) this.trie.output[child] = [];
                this.trie.output[child] = this.trie.output[child].concat(this.trie.output[fallback] || []);

                queue.push(child);
            }
        }
    }

    // Search for patterns in the given text
    search(text) {
        if(!text) return [false, []]
        let currentNode = 0;
        const results = new Set();
        for (const char of text){
            // Follow fail links if no match
            while (currentNode !== 0 && !(char in this.trie.nodes[currentNode])) {
                currentNode = this.fail[currentNode];
            }

            // Follow trie edge if match found
            if (char in this.trie.nodes[currentNode]) {
                currentNode = this.trie.nodes[currentNode][char];
            } else {
                currentNode = 0; // Reset to root if no match
            }

            // If a pattern ends here, return true
            if (this.trie.output[currentNode] && this.trie.output[currentNode].length > 0) {
                results.add(...this.trie.output[currentNode]);
                currentNode = 0;
            }
        }
        if(results.size > 0) return [true,Array.from(results.values())]
        return [false, []]; // No pattern found
    }
}


module.exports = AhoCorasick