# ChromaDB Success Timeline Analysis

This script analyzes attack data from ChromaDB and generates a success timeline graph.

## Prerequisites

1. Install required Python packages:
```bash
pip install -r requirements.txt
```

2. Set up environment variables (create a `.env` file in the project root or set them in your environment):
```bash
CHROMA_HOST=https://api.trychroma.com  # Your ChromaDB host URL
CHROMA_API_KEY=your_api_key_here      # Your ChromaDB API key (if required)
CHROMA_TENANT=your_tenant             # Optional: ChromaDB tenant
CHROMA_DATABASE=your_database         # Optional: ChromaDB database name
```

## Usage

Run the analysis script:

```bash
cd pharma-attack-sim/analysis
python chromadb_success_timeline.py
```

## Output

The script will:
1. Connect to ChromaDB and fetch all attack logs from the `attack_logs` collection
2. Process the data and calculate statistics
3. Generate a `success_timeline.png` graph showing:
   - Success rate over time (rolling average)
   - Individual attack outcomes (success/failure points)
   - Cumulative success/failure counts over time

The graph will be saved in the `pharma-attack-sim/analysis/` directory.

## Graph Features

The success timeline graph includes:
- **Top panel**: Success rate over time with a rolling average line and individual attack points
- **Bottom panel**: Cumulative count of successful vs failed attacks
- **Statistics**: Overall success rate, total attacks, and vector-specific success rates

## Troubleshooting

### Connection Issues
- Make sure `CHROMA_HOST` is set correctly
- For ChromaDB cloud, ensure `CHROMA_API_KEY` is provided
- For local ChromaDB, use `CHROMA_HOST=http://localhost:8000`

### No Data Found
- Verify the collection name is `attack_logs`
- Check that attacks have been logged to ChromaDB
- Ensure your ChromaDB credentials have read access

### Import Errors
- Make sure all dependencies are installed: `pip install -r requirements.txt`
- Verify you're using Python 3.7 or higher

