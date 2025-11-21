import os
import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pymongo import MongoClient
from dotenv import load_dotenv

# ---------------------------
# Configuration & Setup
# ---------------------------
# Load environment variables
load_dotenv()

# Set visualization style
sns.set_theme(style="whitegrid", context="talk", palette="deep")
plt.rcParams['figure.figsize'] = (12, 7)
plt.rcParams['font.size'] = 12
plt.rcParams['savefig.dpi'] = 300

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

# Fix for Windows encoding issues
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except AttributeError:
        pass

def get_db_connection():
    """Establishes a secure connection to MongoDB."""
    password = os.getenv('MONGODB_PASSWORD')
    if not password:
        print("[ERROR] MONGODB_PASSWORD environment variable not set.")
        print("Please set it in your .env file or environment.")
        sys.exit(1)

    uri = f"mongodb+srv://emammunir_db_user:{password}@cluster0.mqsnysc.mongodb.net/pharma-attack-sim?retryWrites=true&w=majority&appName=Cluster0"
    try:
        client = MongoClient(uri)
        client.admin.command('ping')
        print("[OK] Successfully connected to MongoDB.")
        return client
    except Exception as e:
        print(f"[ERROR] MongoDB Connection failed: {e}")
        sys.exit(1)

def fetch_data(client):
    """Fetches all attack logs from the database."""
    db = client['pharma-attack-sim']
    
    # Robust collection finding
    cols = db.list_collection_names()
    if 'attacklogs' in cols:
        collection = db['attacklogs']
    elif 'attack_logs' in cols:
        collection = db['attack_logs']
    else:
        print(f"[WARN] Could not find 'attacklogs' collection. Available: {cols}")
        return []

    data = list(collection.find({}))
    print(f"[OK] Fetched {len(data)} records from MongoDB.")
    return data

def process_data(raw_data):
    """Cleans and flattens the raw JSON data into a DataFrame."""
    if not raw_data:
        return pd.DataFrame()

    # Flatten nested JSON structures
    df = pd.json_normalize(raw_data)
    
    # Convert timestamp
    if 'timestamp' in df.columns:
        df['timestamp'] = pd.to_datetime(df['timestamp'])

    # Standardize column names (replace dots with underscores for easier access)
    df.columns = [c.replace('.', '_') for c in df.columns]
    
    # Ensure critical numerical columns exist and fill NaNs
    numeric_cols = [
        'financial_impact', 'compromised_deliveries', 'duration_seconds', 
        'affected_patients', 'detection_delay_seconds'
    ]
    for col in numeric_cols:
        if col not in df.columns:
            df[col] = 0
        df[col] = df[col].fillna(0)

    # Ensure boolean columns
    # CRITICAL FIX: Fill NaNs with False BEFORE converting to bool.
    # In Python, bool(np.nan) is True, which causes incorrect 100% stats if data is missing.
    bool_cols = [
        'success', 'phishing_success', 'gps_success', 'api_success', 
        'phishing_attempted', 'gps_attempted', 'api_attempted'
    ]
    for col in bool_cols:
        if col not in df.columns:
            df[col] = False
        else:
            df[col] = df[col].fillna(False)
            
        df[col] = df[col].astype(bool)

    # DATA CONSISTENCY FIX:
    # If a vector was successful, it must have been attempted.
    # This handles cases where 'attempted' might be missing in the log but 'success' is recorded.
    for v in ['phishing', 'gps', 'api']:
        succ_col = f'{v}_success'
        att_col = f'{v}_attempted'
        
        # If success is True, force attempted to True
        if succ_col in df.columns and att_col in df.columns:
            df.loc[df[succ_col] == True, att_col] = True

    return df

def analyze_and_visualize(df):
    """Performs statistical analysis and generates visualizations."""
    if df.empty:
        print("[WARN] No data to analyze.")
        return

    print("\n" + "="*40)
    print("       STATISTICAL ANALYSIS REPORT       ")
    print("="*40)

    # --- 1. General Statistics ---
    total_impact = df['financial_impact'].sum()
    avg_impact = df['financial_impact'].mean()
    success_rate = (df['success'].sum() / len(df) * 100)
    
    print(f"\n[STATS] Overview:")
    print(f"  - Total Attacks: {len(df)}")
    print(f"  - Overall Success Rate: {success_rate:.1f}%")
    print(f"  - Total Financial Impact: ${total_impact:,.2f}")
    print(f"  - Avg Impact per Attack: ${avg_impact:,.2f}")

    # --- 2. Vector Effectiveness ---
    vectors = ['phishing', 'gps', 'api']
    vector_stats = []
    for v in vectors:
        att_col = f'{v}_attempted'
        succ_col = f'{v}_success'
        
        attempts = df[att_col].sum()
        successes = df[succ_col].sum()
        
        # Calculate success rate based on ATTEMPTS (standard definition)
        rate_attempt = (successes / attempts * 100) if attempts > 0 else 0.0
        
        # Calculate success rate based on TOTAL ATTACKS (implied by user feedback)
        # "failed if it didn't reach it" -> didn't reach success = failure
        rate_overall = (successes / len(df) * 100)
        
        vector_stats.append({
            'Vector': v.upper(), 
            'Attempts': attempts, 
            'Successes': successes, 
            'Success Rate (Attempt)': rate_attempt,
            'Success Rate (Overall)': rate_overall
        })

    stats_df = pd.DataFrame(vector_stats)
    print("\n[VECTORS] Vector Effectiveness:")
    print(stats_df.to_string(index=False))

    # --- Visualizations ---

    # 1. Financial Impact Distribution (Histogram + KDE)
    plt.figure(figsize=(10, 6))
    sns.histplot(data=df, x='financial_impact', kde=True, bins=20, color='teal')
    plt.title('Distribution of Financial Impact per Attack')
    plt.xlabel('Financial Impact ($)')
    plt.ylabel('Frequency')
    plt.tight_layout()
    save_plot('financial_impact_dist.png')

    # 2. Success Rate by Vector (Bar Chart)
    if not stats_df.empty:
        plt.figure(figsize=(8, 6))
        
        # Plot Overall Success Rate (more meaningful given data structure)
        bp = sns.barplot(data=stats_df, x='Vector', y='Success Rate (Overall)', palette='viridis')
        plt.title('Vector Success Rate (% of Total Attacks)')
        plt.ylabel('Success Rate (%)')
        plt.ylim(0, 105) # slightly over 100 for labels
        
        # Add labels
        for i, row in stats_df.iterrows():
            # Show Rate
            label = f"{row['Success Rate (Overall)']:.1f}%"
            bp.text(i, row['Success Rate (Overall)'] + 2, label, ha='center', color='black', fontweight='bold')
            # Show Count (Success/Total)
            count_label = f"{int(row['Successes'])}/{len(df)}"
            bp.text(i, row['Success Rate (Overall)'] / 2, count_label, ha='center', color='white', fontsize=10)

        plt.tight_layout()
        save_plot('vector_success_rates.png')

    # 3. Impact vs Duration (Scatter + Correlation)
    plt.figure(figsize=(10, 6))
    sns.scatterplot(data=df, x='duration_seconds', y='financial_impact', hue='success', style='success', s=100, palette='deep')
    plt.title('Financial Impact vs. Duration')
    plt.xlabel('Duration (seconds)')
    plt.ylabel('Financial Impact ($)')
    plt.tight_layout()
    save_plot('impact_vs_duration.png')

    # 4. Correlation Matrix Heatmap
    corr_cols = ['financial_impact', 'duration_seconds', 'compromised_deliveries', 'affected_patients', 'detection_delay_seconds']
    existing_cols = [c for c in corr_cols if c in df.columns]
    if len(existing_cols) > 1:
        plt.figure(figsize=(8, 7))
        corr = df[existing_cols].corr()
        sns.heatmap(corr, annot=True, cmap='coolwarm', vmin=-1, vmax=1, center=0, fmt='.2f')
        plt.title('Correlation of Key Metrics')
        plt.tight_layout()
        save_plot('correlation_matrix.png')

    # 5. Success Rate Over Time
    if len(df) > 1 and 'timestamp' in df.columns:
        df_sorted = df.sort_values('timestamp')
        # Convert success to int for plotting (1=Success, 0=Fail)
        df_sorted['success_int'] = df_sorted['success'].astype(int)

        plt.figure(figsize=(12, 6))
        
        # Plot every single data point (Raw Outcomes)
        # Using scatter plot to show each attack's outcome clearly
        sns.scatterplot(data=df_sorted, x='timestamp', y='success_int', 
                        hue='success', palette={True: 'green', False: 'red'}, 
                        s=60, alpha=0.6, legend=True) # alpha helps if points overlap
        
        # Overlay a Rolling Average Trend Line to show "Rate Over Time"
        if len(df) >= 5:
            # Use a rolling window (e.g., 10% of data or fixed number)
            window_size = max(5, int(len(df) * 0.1)) 
            df_sorted['rolling_rate'] = df_sorted['success_int'].rolling(window=window_size, min_periods=1).mean()
            sns.lineplot(data=df_sorted, x='timestamp', y='rolling_rate', 
                         color='blue', label=f'Success Rate Trend (Mov Avg {window_size})', linewidth=2.5)
        
        plt.title('Attack Success Over Time (Raw Outcomes + Trend)')
        plt.ylabel('Outcome (0=Fail, 1=Success)')
        plt.yticks([0, 0.25, 0.5, 0.75, 1.0], ['Fail', '25%', '50%', '75%', 'Success'])
        plt.xticks(rotation=45)
        
        # Move legend to not obscure data
        plt.legend(loc='center right')
        
        plt.tight_layout()
        save_plot('success_timeline.png')

def save_plot(filename):
    path = os.path.join(OUTPUT_DIR, filename)
    plt.savefig(path)
    print(f"[SAVED] Saved plot: {filename}")
    plt.close()

def main():
    print("[START] Starting Pharma Attack Analysis...")
    client = get_db_connection()
    
    try:
        raw_data = fetch_data(client)
        df = process_data(raw_data)
        analyze_and_visualize(df)
        print("\n[OK] Analysis complete. Visualizations saved to current directory.")
    finally:
        client.close()

if __name__ == "__main__":
    main()
