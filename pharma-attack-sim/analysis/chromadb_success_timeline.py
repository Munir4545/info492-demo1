"""
ChromaDB Success Timeline Analysis
Analyzes attack data from ChromaDB and generates a success timeline graph.
"""
import os
import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
from dotenv import load_dotenv
import chromadb
from chromadb.config import Settings

# Load environment variables
load_dotenv()

# Set visualization style
sns.set_theme(style="whitegrid", context="talk", palette="deep")
plt.rcParams['figure.figsize'] = (14, 8)
plt.rcParams['font.size'] = 11
plt.rcParams['savefig.dpi'] = 300

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

# Fix for Windows encoding issues
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except AttributeError:
        pass


def get_chromadb_connection():
    """Establishes a connection to ChromaDB."""
    chroma_host = os.getenv('CHROMA_HOST', 'https://api.trychroma.com')
    chroma_api_key = os.getenv('CHROMA_API_KEY')
    chroma_tenant = os.getenv('CHROMA_TENANT')
    chroma_database = os.getenv('CHROMA_DATABASE')
    
    try:
        # Parse URL
        if not chroma_host.startswith('http://') and not chroma_host.startswith('https://'):
            chroma_host = f"https://{chroma_host}"
        
        chroma_host = chroma_host.strip().rstrip('/')
        
        # Extract host and port from URL
        if chroma_host.startswith('https://'):
            url_parts = chroma_host.replace('https://', '').split(':')
            host = url_parts[0]
            port = int(url_parts[1]) if len(url_parts) > 1 else 443
            use_ssl = True
        elif chroma_host.startswith('http://'):
            url_parts = chroma_host.replace('http://', '').split(':')
            host = url_parts[0]
            port = int(url_parts[1]) if len(url_parts) > 1 else 8000
            use_ssl = False
        else:
            host = chroma_host
            port = 8000
            use_ssl = False
        
        # Create client with proper authentication
        # For ChromaDB cloud with API key, use headers for authentication
        if chroma_api_key:
            # Build headers for authentication
            # ChromaDB Python client uses X-Chroma-Token header
            headers = {"X-Chroma-Token": chroma_api_key}
            
            # Create client - only pass tenant/database if explicitly provided
            # Passing them when not needed causes permission errors
            try:
                if chroma_tenant and chroma_database:
                    # Both tenant and database provided
                    client = chromadb.HttpClient(
                        host=host,
                        port=port,
                        ssl=use_ssl,
                        headers=headers,
                        tenant=chroma_tenant,
                        database=chroma_database
                    )
                elif chroma_tenant:
                    # Only tenant provided
                    client = chromadb.HttpClient(
                        host=host,
                        port=port,
                        ssl=use_ssl,
                        headers=headers,
                        tenant=chroma_tenant
                    )
                elif chroma_database:
                    # Only database provided (unlikely without tenant, but handle it)
                    client = chromadb.HttpClient(
                        host=host,
                        port=port,
                        ssl=use_ssl,
                        headers=headers,
                        database=chroma_database
                    )
                else:
                    # No tenant/database - use default
                    client = chromadb.HttpClient(
                        host=host,
                        port=port,
                        ssl=use_ssl,
                        headers=headers
                    )
            except Exception as e:
                # If connection fails, try without tenant/database
                print(f"[WARN] Connection with tenant/database failed, trying without: {e}")
                client = chromadb.HttpClient(
                    host=host,
                    port=port,
                    ssl=use_ssl,
                    headers=headers
                )
        else:
            # For local ChromaDB (no authentication)
            if chroma_tenant and chroma_database:
                client = chromadb.HttpClient(
                    host=host,
                    port=port,
                    ssl=use_ssl,
                    tenant=chroma_tenant,
                    database=chroma_database
                )
            elif chroma_tenant:
                client = chromadb.HttpClient(
                    host=host,
                    port=port,
                    ssl=use_ssl,
                    tenant=chroma_tenant
                )
            else:
                # No tenant/database - simplest case
                client = chromadb.HttpClient(
                    host=host,
                    port=port,
                    ssl=use_ssl
                )
        
        # Test connection by listing collections
        # This will fail if authentication is wrong
        _ = client.list_collections()
        
        print(f"[OK] Successfully connected to ChromaDB at {chroma_host}")
        if chroma_tenant:
            print(f"[INFO] Using tenant: {chroma_tenant}")
        if chroma_database:
            print(f"[INFO] Using database: {chroma_database}")
        return client
    except Exception as e:
        error_msg = str(e)
        print(f"[ERROR] ChromaDB Connection failed: {error_msg}")
        print("\n" + "="*60)
        print("TROUBLESHOOTING:")
        print("="*60)
        print(f"1. Connection URL: {chroma_host}")
        print(f"2. API Key provided: {'Yes' if chroma_api_key else 'No (REQUIRED for cloud)'}")
        if chroma_api_key:
            print(f"   API Key length: {len(chroma_api_key)} characters")
        print(f"3. Tenant: {chroma_tenant if chroma_tenant else 'Not set (using default)'}")
        print(f"4. Database: {chroma_database if chroma_database else 'Not set (using default)'}")
        print("\nCommon Issues:")
        print("- 'Permission denied': Usually means API key is missing, incorrect, or expired")
        print("- For ChromaDB cloud: You MUST set CHROMA_API_KEY environment variable")
        print("- For local ChromaDB: Use CHROMA_HOST=http://localhost:8000 (no API key needed)")
        print("\nRequired Environment Variables:")
        print("  CHROMA_HOST=https://api.trychroma.com  (or your ChromaDB URL)")
        print("  CHROMA_API_KEY=your_api_key_here      (REQUIRED for cloud)")
        print("  CHROMA_TENANT=your_tenant             (optional)")
        print("  CHROMA_DATABASE=your_database         (optional)")
        print("\nTo set environment variables:")
        print("  Windows PowerShell: $env:CHROMA_API_KEY='your_key'")
        print("  Windows CMD: set CHROMA_API_KEY=your_key")
        print("  Linux/Mac: export CHROMA_API_KEY='your_key'")
        print("  Or create a .env file in the project root")
        print("="*60)
        import traceback
        traceback.print_exc()
        sys.exit(1)


def fetch_data(client):
    """Fetches all attack logs from ChromaDB."""
    collection_name = 'attack_logs'
    
    try:
        collection = client.get_collection(name=collection_name)
        count = collection.count()
        print(f"[OK] Found collection '{collection_name}' with {count} documents")
        
        if count == 0:
            print("[WARN] No data found in ChromaDB collection")
            return []
        
        # Get all documents with metadata
        results = collection.get(
            include=['metadatas', 'documents']
        )
        
        print(f"[OK] Fetched {len(results['ids'])} records from ChromaDB")
        return results
    except Exception as e:
        print(f"[ERROR] Failed to fetch data from ChromaDB: {e}")
        print(f"[INFO] Available collections: {client.list_collections()}")
        sys.exit(1)


def process_data(chromadb_results):
    """Processes ChromaDB results into a DataFrame."""
    if not chromadb_results or not chromadb_results.get('ids'):
        return pd.DataFrame()
    
    records = []
    
    for i, metadata in enumerate(chromadb_results.get('metadatas', [])):
        if not metadata:
            continue
            
        # Convert metadata to record
        record = {}
        
        # Extract timestamp
        timestamp_str = metadata.get('timestamp', '')
        if timestamp_str:
            try:
                record['timestamp'] = pd.to_datetime(timestamp_str)
            except:
                record['timestamp'] = pd.NaT
        else:
            record['timestamp'] = pd.NaT
        
        # Extract success (convert string 'true'/'false' to boolean)
        success_str = metadata.get('success', 'false')
        record['success'] = success_str.lower() == 'true' if isinstance(success_str, str) else bool(success_str)
        
        # Extract attack ID
        record['attackId'] = metadata.get('attackId', f'unknown_{i}')
        
        # Extract status
        record['status'] = metadata.get('status', 'unknown')
        
        # Extract target info
        record['targetDriver'] = metadata.get('targetDriver', 'unknown')
        record['targetTier'] = metadata.get('targetTier', 'unknown')
        
        # Extract numeric metrics
        numeric_fields = [
            'duration_seconds', 'compromised_deliveries', 'affected_patients',
            'financial_impact', 'phishing_effectiveness', 'gps_effectiveness',
            'api_effectiveness'
        ]
        
        for field in numeric_fields:
            value = metadata.get(field, 0)
            try:
                record[field] = float(value) if value else 0.0
            except (ValueError, TypeError):
                record[field] = 0.0
        
        # Extract vector success flags (convert string 'true'/'false' to boolean)
        vector_fields = ['phishing_success', 'gps_success', 'api_success']
        for field in vector_fields:
            value = metadata.get(field, 'false')
            if isinstance(value, str):
                record[field] = value.lower() == 'true'
            else:
                record[field] = bool(value)
        
        # Derive attempted flags from success flags
        record['phishing_attempted'] = record.get('phishing_success', False)
        record['gps_attempted'] = record.get('gps_success', False)
        record['api_attempted'] = record.get('api_success', False)
        
        records.append(record)
    
    df = pd.DataFrame(records)
    
    if df.empty:
        return df
    
    # Sort by timestamp
    if 'timestamp' in df.columns:
        df = df.sort_values('timestamp').reset_index(drop=True)
    
    # Fill any remaining NaNs
    df = df.fillna({
        'financial_impact': 0,
        'compromised_deliveries': 0,
        'affected_patients': 0,
        'duration_seconds': 0
    })
    
    return df


def analyze_and_visualize(df):
    """Performs statistical analysis and generates visualizations."""
    if df.empty:
        print("[WARN] No data to analyze.")
        return
    
    print("\n" + "="*50)
    print("       CHROMADB STATISTICAL ANALYSIS REPORT       ")
    print("="*50)
    
    # --- 1. General Statistics ---
    total_impact = df['financial_impact'].sum()
    avg_impact = df['financial_impact'].mean()
    success_count = df['success'].sum()
    total_attacks = len(df)
    success_rate = (success_count / total_attacks * 100) if total_attacks > 0 else 0
    
    print(f"\n[STATS] Overview:")
    print(f"  - Total Attacks: {total_attacks}")
    print(f"  - Successful Attacks: {success_count}")
    print(f"  - Failed Attacks: {total_attacks - success_count}")
    print(f"  - Overall Success Rate: {success_rate:.1f}%")
    print(f"  - Total Financial Impact: ${total_impact:,.2f}")
    print(f"  - Avg Impact per Attack: ${avg_impact:,.2f}")
    
    # --- 2. Vector Effectiveness ---
    vectors = ['phishing', 'gps', 'api']
    vector_stats = []
    for v in vectors:
        succ_col = f'{v}_success'
        att_col = f'{v}_attempted'
        
        attempts = df[att_col].sum() if att_col in df.columns else 0
        successes = df[succ_col].sum() if succ_col in df.columns else 0
        
        rate_attempt = (successes / attempts * 100) if attempts > 0 else 0.0
        rate_overall = (successes / total_attacks * 100) if total_attacks > 0 else 0.0
        
        vector_stats.append({
            'Vector': v.upper(),
            'Attempts': attempts,
            'Successes': successes,
            'Success Rate (Attempt)': rate_attempt,
            'Success Rate (Overall)': rate_overall
        })
    
    if vector_stats:
        stats_df = pd.DataFrame(vector_stats)
        print("\n[VECTORS] Vector Effectiveness:")
        print(stats_df.to_string(index=False))
    
    # --- Visualizations ---
    
    # 1. SUCCESS TIMELINE GRAPH (Main focus)
    if 'timestamp' in df.columns and not df['timestamp'].isna().all():
        df_timeline = df[df['timestamp'].notna()].copy()
        df_timeline = df_timeline.sort_values('timestamp')
        
        if len(df_timeline) > 0:
            # Create figure with two subplots
            fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10), sharex=True)
            
            # --- Top Panel: Success Rate Over Time ---
            df_timeline['success_int'] = df_timeline['success'].astype(int)
            
            # Calculate rolling success rate
            window_size = max(5, int(len(df_timeline) * 0.1))
            df_timeline['rolling_rate'] = df_timeline['success_int'].rolling(
                window=window_size, min_periods=1
            ).mean() * 100
            
            # Plot individual attack outcomes
            success_mask = df_timeline['success'] == True
            ax1.scatter(
                df_timeline[success_mask]['timestamp'],
                df_timeline[success_mask]['success_int'] * 100,
                color='green', alpha=0.6, s=60, label='Successful Attacks', zorder=3
            )
            ax1.scatter(
                df_timeline[~success_mask]['timestamp'],
                df_timeline[~success_mask]['success_int'] * 100,
                color='red', alpha=0.6, s=60, label='Failed Attacks', zorder=3
            )
            
            # Plot rolling average trend line
            ax1.plot(
                df_timeline['timestamp'],
                df_timeline['rolling_rate'],
                color='blue', linewidth=2.5, label=f'Success Rate Trend (Mov Avg {window_size})', zorder=2
            )
            
            ax1.set_ylabel('Success Rate (%)', fontsize=12, fontweight='bold')
            ax1.set_title('Attack Success Rate Over Time', fontsize=14, fontweight='bold', pad=15)
            ax1.set_ylim(-5, 105)
            ax1.axhline(y=50, color='gray', linestyle='--', alpha=0.3, linewidth=1)
            ax1.grid(True, alpha=0.3)
            ax1.legend(loc='best', fontsize=10)
            
            # --- Bottom Panel: Cumulative Success/Failure Counts ---
            df_timeline['cumulative_success'] = df_timeline['success_int'].cumsum()
            df_timeline['cumulative_failure'] = (1 - df_timeline['success_int']).cumsum()
            
            ax2.fill_between(
                df_timeline['timestamp'],
                0,
                df_timeline['cumulative_success'],
                color='green', alpha=0.4, label='Cumulative Successful'
            )
            ax2.fill_between(
                df_timeline['timestamp'],
                df_timeline['cumulative_success'],
                df_timeline['cumulative_success'] + df_timeline['cumulative_failure'],
                color='red', alpha=0.4, label='Cumulative Failed'
            )
            
            ax2.plot(
                df_timeline['timestamp'],
                df_timeline['cumulative_success'],
                color='darkgreen', linewidth=2, label='Total Successful'
            )
            ax2.plot(
                df_timeline['timestamp'],
                df_timeline['cumulative_success'] + df_timeline['cumulative_failure'],
                color='darkred', linewidth=2, label='Total Attacks'
            )
            
            ax2.set_xlabel('Timestamp', fontsize=12, fontweight='bold')
            ax2.set_ylabel('Cumulative Count', fontsize=12, fontweight='bold')
            ax2.set_title('Cumulative Attack Outcomes Over Time', fontsize=14, fontweight='bold', pad=15)
            ax2.grid(True, alpha=0.3)
            ax2.legend(loc='best', fontsize=10)
            
            # Format x-axis
            plt.setp(ax2.xaxis.get_majorticklabels(), rotation=45, ha='right')
            
            plt.tight_layout()
            save_plot('success_timeline.png')
            print(f"\n[SAVED] Success timeline graph saved: success_timeline.png")
    
    # 2. Financial Impact Distribution
    impact_df = df[df['financial_impact'] > 0]
    if not impact_df.empty:
        plt.figure(figsize=(10, 6))
        sns.histplot(data=impact_df, x='financial_impact', kde=True, bins=4, color='teal')
        plt.title('Distribution of Financial Impact (Excluding $0)', fontsize=13, fontweight='bold')
        plt.xlabel('Financial Impact ($)', fontsize=11)
        plt.ylabel('Frequency', fontsize=11)
        plt.tight_layout()
        save_plot('financial_impact_dist.png')
    
    # 3. Vector Success Rates
    if vector_stats:
        stats_df = pd.DataFrame(vector_stats)
        plt.figure(figsize=(8, 6))
        bp = sns.barplot(data=stats_df, x='Vector', y='Success Rate (Overall)', palette='viridis')
        plt.title('Vector Success Rate (% of Total Attacks)', fontsize=13, fontweight='bold')
        plt.ylabel('Success Rate (%)', fontsize=11)
        plt.ylim(0, 105)
        
        for i, row in stats_df.iterrows():
            label = f"{row['Success Rate (Overall)']:.1f}%"
            bp.text(i, row['Success Rate (Overall)'] + 2, label, ha='center', 
                   color='black', fontweight='bold')
            count_label = f"{int(row['Successes'])}/{total_attacks}"
            bp.text(i, row['Success Rate (Overall)'] / 2, count_label, ha='center', 
                   color='white', fontsize=10)
        
        plt.tight_layout()
        save_plot('vector_success_rates.png')
    
    # 4. Impact vs Duration
    if 'duration_seconds' in df.columns:
        plt.figure(figsize=(10, 6))
        sns.scatterplot(
            data=df, x='duration_seconds', y='financial_impact',
            hue='success', style='success', s=100, palette='deep'
        )
        plt.title('Financial Impact vs. Duration', fontsize=13, fontweight='bold')
        plt.xlabel('Duration (seconds)', fontsize=11)
        plt.ylabel('Financial Impact ($)', fontsize=11)
        plt.tight_layout()
        save_plot('impact_vs_duration.png')
    
    # 5. Correlation Matrix
    corr_cols = ['financial_impact', 'duration_seconds', 'compromised_deliveries', 
                 'affected_patients']
    existing_cols = [c for c in corr_cols if c in df.columns]
    if len(existing_cols) > 1:
        plt.figure(figsize=(8, 7))
        corr = df[existing_cols].corr()
        sns.heatmap(corr, annot=True, cmap='coolwarm', vmin=-1, vmax=1, center=0, 
                   fmt='.2f', square=True)
        plt.title('Correlation of Key Metrics', fontsize=13, fontweight='bold')
        plt.tight_layout()
        save_plot('correlation_matrix.png')
    
    # 6. Financial Impact Timeline
    if 'timestamp' in df.columns and not df['timestamp'].isna().all():
        df_impact = df[(df['timestamp'].notna()) & (df['financial_impact'] > 0)].copy()
        df_impact = df_impact.sort_values('timestamp')
        
        if not df_impact.empty:
            plt.figure(figsize=(12, 6))
            sns.scatterplot(
                data=df_impact, x='timestamp', y='financial_impact',
                color='orange', s=50, alpha=0.5, label='Raw Impact'
            )
            
            if len(df_impact) >= 5:
                window_size = max(3, int(len(df_impact) * 0.15))
                df_impact['rolling_impact'] = df_impact['financial_impact'].rolling(
                    window=window_size, min_periods=1
                ).mean()
                sns.lineplot(
                    data=df_impact, x='timestamp', y='rolling_impact',
                    color='darkred', linewidth=3, label=f'Trend (Mov Avg {window_size})'
                )
            
            plt.title('Financial Impact Over Time (Non-Zero Attacks)', fontsize=13, fontweight='bold')
            plt.ylabel('Financial Impact ($)', fontsize=11)
            plt.xlabel('Timestamp', fontsize=11)
            plt.xticks(rotation=45)
            plt.tight_layout()
            save_plot('financial_impact_timeline.png')


def save_plot(filename):
    """Saves the current plot to file."""
    path = os.path.join(OUTPUT_DIR, filename)
    plt.savefig(path, bbox_inches='tight')
    print(f"[SAVED] Saved plot: {filename}")
    plt.close()


def main():
    print("[START] Starting ChromaDB Attack Analysis...")
    print("="*50)
    
    client = get_chromadb_connection()
    
    try:
        chromadb_results = fetch_data(client)
        df = process_data(chromadb_results)
        
        if df.empty:
            print("\n[WARN] No data found in ChromaDB. Please ensure attacks have been logged.")
            return
        
        analyze_and_visualize(df)
        print("\n" + "="*50)
        print("[OK] Analysis complete. Visualizations saved to current directory.")
        print("="*50)
    except Exception as e:
        print(f"\n[ERROR] Analysis failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
