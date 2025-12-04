/**
 * ChromaDB Client Module
 * Handles connection to Chroma vector database for storing attack embeddings
 */
const { ChromaClient } = require('chromadb');
require('dotenv').config();

const COLLECTION_NAME = 'attack_logs';

let client = null;
let collection = null;

/**
 * Initialize ChromaDB client and collection
 */
async function initChroma() {
  if (client && collection) {
    return { client, collection };
  }

  try {
    // Initialize ChromaDB client with cloud credentials
    client = new ChromaClient({
      path: process.env.CHROMA_HOST || 'https://api.trychroma.com',
      auth: {
        provider: 'token',
        credentials: process.env.CHROMA_API_KEY,
        tokenHeaderType: 'X_CHROMA_TOKEN'
      },
      tenant: process.env.CHROMA_TENANT || 'default_tenant',
      database: process.env.CHROMA_DATABASE || 'default_database'
    });

    // Get or create the attacks collection
    // Note: ChromaDB cloud may have dimension requirements
    collection = await client.getOrCreateCollection({
      name: COLLECTION_NAME,
      metadata: {
        description: 'Attack simulation logs with embeddings',
        'hnsw:space': 'cosine'
      }
      // Don't specify dimension - let ChromaDB infer from first embedding
    });
    
    // Log collection info for debugging
    const count = await collection.count();
    console.log(`[ChromaDB] Collection '${COLLECTION_NAME}' ready (${count} existing documents)`);

    console.log('✅ ChromaDB connected successfully');
    return { client, collection };
  } catch (error) {
    console.error('❌ ChromaDB connection error:', error);
    throw error;
  }
}

/**
 * Generate embedding from attack data
 * Creates a text representation of the attack for embedding
 */
function attackToEmbeddingText(attackData) {
  const parts = [];
  
  // Attack configuration
  if (attackData.config) {
    parts.push(`Target: ${attackData.config.targetDriver || 'unknown'}`);
    parts.push(`Tier: ${attackData.config.targetTier || 'unknown'}`);
    parts.push(`Vectors: ${(attackData.config.vectorPlan || []).join(', ')}`);
    parts.push(`Base Success Rate: ${attackData.config.baseSuccessRate || 0}`);
  }
  
  // Attack outcome
  parts.push(`Status: ${attackData.status}`);
  parts.push(`Success: ${attackData.success ? 'yes' : 'no'}`);
  
  // Metrics
  if (attackData.duration_seconds) parts.push(`Duration: ${attackData.duration_seconds}s`);
  if (attackData.compromised_deliveries) parts.push(`Compromised Deliveries: ${attackData.compromised_deliveries}`);
  if (attackData.affected_patients) parts.push(`Affected Patients: ${attackData.affected_patients}`);
  if (attackData.financial_impact) parts.push(`Financial Impact: $${attackData.financial_impact}`);
  
  // Vector-specific details
  if (attackData.phishing) {
    parts.push(`Phishing: ${attackData.phishing.success ? 'success' : 'failed'} (effectiveness: ${attackData.phishing.effectiveness || 0}%)`);
    if (attackData.phishing.message) parts.push(`Phishing Message: ${attackData.phishing.message}`);
  }
  
  if (attackData.gps) {
    parts.push(`GPS Spoofing: ${attackData.gps.success ? 'success' : 'failed'} (effectiveness: ${attackData.gps.effectiveness || 0}%)`);
    if (attackData.gps.diversion_distance) parts.push(`Diversion Distance: ${attackData.gps.diversion_distance}m`);
  }
  
  if (attackData.api) {
    parts.push(`API Exploit: ${attackData.api.success ? 'success' : 'failed'} (effectiveness: ${attackData.api.effectiveness || 0}%)`);
    if (attackData.api.alerts_sent) parts.push(`Alerts Buried: ${attackData.api.alerts_sent}`);
  }
  
  // Decision events summary
  if (attackData.decision_events && attackData.decision_events.length > 0) {
    const decisions = attackData.decision_events.map(e => 
      `${e.event_type}: ${e.description} -> ${e.outcome}`
    ).join('; ');
    parts.push(`Decisions: ${decisions}`);
  }
  
  return parts.join('. ');
}

/**
 * Generate a simple embedding vector from text
 * Uses a hash-based approach for consistent embeddings
 * For production, you should use an actual embedding model (OpenAI, Sentence Transformers, etc.)
 */
function generateSimpleEmbedding(text, dimensions = 384) {
  const embedding = new Array(dimensions).fill(0);
  
  // Simple hash-based embedding generation
  const words = text.toLowerCase().split(/\s+/);
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    for (let j = 0; j < word.length; j++) {
      const idx = (word.charCodeAt(j) * (i + 1) * (j + 1)) % dimensions;
      embedding[idx] += 1 / (i + 1);
    }
  }
  
  // Normalize the embedding
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < dimensions; i++) {
      embedding[i] /= magnitude;
    }
  }
  
  return embedding;
}

/**
 * Save attack to ChromaDB
 */
async function saveAttack(attackId, attackData) {
  try {
    if (!collection) {
      await initChroma();
    }

    const embeddingText = attackToEmbeddingText(attackData);
    const embedding = generateSimpleEmbedding(embeddingText);
    
    // Validate embedding dimensions
    if (!Array.isArray(embedding) || embedding.length === 0) {
      throw new Error(`Invalid embedding: expected array, got ${typeof embedding}`);
    }
    
    const id = `attack_${attackId}_${Date.now()}`;
    
    // Ensure all metadata values are strings/numbers (ChromaDB requirement)
    // Remove any null/undefined values and ensure proper types
    const metadata = {
      attackId: String(attackId),
      timestamp: new Date().toISOString(),
      status: String(attackData.status || 'unknown'),
      success: attackData.success ? 'true' : 'false',
      targetDriver: String(attackData.config?.targetDriver || 'unknown').substring(0, 100), // Limit length
      targetTier: String(attackData.config?.targetTier || 'unknown'),
      vectors: JSON.stringify(attackData.config?.vectorPlan || []).substring(0, 500), // Limit length
      duration_seconds: Number(attackData.duration_seconds || 0),
      compromised_deliveries: Number(attackData.compromised_deliveries || 0),
      affected_patients: Number(attackData.affected_patients || 0),
      financial_impact: Number(attackData.financial_impact || 0),
      phishing_success: attackData.phishing?.success ? 'true' : 'false',
      phishing_effectiveness: Number(attackData.phishing?.effectiveness || 0),
      gps_success: attackData.gps?.success ? 'true' : 'false',
      gps_effectiveness: Number(attackData.gps?.effectiveness || 0),
      api_success: attackData.api?.success ? 'true' : 'false',
      api_effectiveness: Number(attackData.api?.effectiveness || 0)
    };
    
    // Remove any NaN or Infinity values
    Object.keys(metadata).forEach(key => {
      const value = metadata[key];
      if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
        metadata[key] = 0;
      }
    });
    
    // Log what we're sending for debugging
    console.log(`[ChromaDB] Saving attack ${attackId}: embedding dim=${embedding.length}, metadata keys=${Object.keys(metadata).length}`);
    
    await collection.add({
      ids: [id],
      embeddings: [embedding],
      metadatas: [metadata],
      documents: [embeddingText.substring(0, 10000)] // Limit document length to 10k chars
    });

    console.log(`✅ Attack ${attackId} saved to ChromaDB`);
    return id;
  } catch (error) {
    console.error(`❌ Failed to save attack ${attackId} to ChromaDB:`, error.message);
    console.error(`❌ ChromaDB error details:`, {
      name: error.name,
      message: error.message,
      stack: error.stack,
      response: error.response?.data || error.response || 'No response data'
    });
    throw error;
  }
}

/**
 * Query similar attacks using semantic search
 */
async function querySimilarAttacks(queryText, nResults = 10, whereFilter = null) {
  try {
    if (!collection) {
      await initChroma();
    }

    const queryEmbedding = generateSimpleEmbedding(queryText);
    
    const queryOptions = {
      queryEmbeddings: [queryEmbedding],
      nResults,
      include: ['metadatas', 'documents', 'distances']
    };
    
    if (whereFilter) {
      queryOptions.where = whereFilter;
    }

    const results = await collection.query(queryOptions);
    
    return results;
  } catch (error) {
    console.error('❌ ChromaDB query error:', error);
    throw error;
  }
}

/**
 * Get attacks by time range
 */
async function getAttacksByTimeRange(hours = 24, limit = 100) {
  try {
    if (!collection) {
      await initChroma();
    }

    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    
    const results = await collection.get({
      where: {
        timestamp: { $gte: cutoffTime }
      },
      limit,
      include: ['metadatas', 'documents']
    });

    return results;
  } catch (error) {
    console.error('❌ ChromaDB time range query error:', error);
    throw error;
  }
}

/**
 * Get all attacks with optional filtering
 */
async function getAllAttacks(whereFilter = null, limit = 1000) {
  try {
    if (!collection) {
      await initChroma();
    }

    const options = {
      limit,
      include: ['metadatas', 'documents']
    };
    
    if (whereFilter) {
      options.where = whereFilter;
    }

    const results = await collection.get(options);
    return results;
  } catch (error) {
    console.error('❌ ChromaDB get all attacks error:', error);
    throw error;
  }
}

/**
 * Find attacks similar to a given attack pattern
 */
async function findSimilarAttackPatterns(attackPattern, nResults = 5) {
  const queryText = attackToEmbeddingText(attackPattern);
  return querySimilarAttacks(queryText, nResults);
}

/**
 * Delete an attack from ChromaDB
 */
async function deleteAttack(attackId) {
  try {
    if (!collection) {
      await initChroma();
    }

    const results = await collection.get({
      where: { attackId: attackId }
    });

    if (results.ids && results.ids.length > 0) {
      await collection.delete({
        ids: results.ids
      });
      console.log(`✅ Attack ${attackId} deleted from ChromaDB`);
    }
  } catch (error) {
    console.error(`❌ Failed to delete attack ${attackId}:`, error);
    throw error;
  }
}

/**
 * Get collection stats
 */
async function getCollectionStats() {
  try {
    if (!collection) {
      await initChroma();
    }

    const count = await collection.count();
    
    return {
      collectionName: COLLECTION_NAME,
      documentCount: count,
      connected: true
    };
  } catch (error) {
    console.error('❌ ChromaDB stats error:', error);
    return {
      collectionName: COLLECTION_NAME,
      documentCount: 0,
      connected: false,
      error: error.message
    };
  }
}

module.exports = {
  initChroma,
  saveAttack,
  querySimilarAttacks,
  getAttacksByTimeRange,
  getAllAttacks,
  findSimilarAttackPatterns,
  deleteAttack,
  getCollectionStats,
  attackToEmbeddingText,
  generateSimpleEmbedding
};

