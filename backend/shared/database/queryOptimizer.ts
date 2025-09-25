import mongoose from 'mongoose';
import { logger } from '../utils/logger';

interface QueryOptions {
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
  select?: string | Record<string, 1 | 0>;
  populate?: string | Array<{ path: string; select?: string }>;
  lean?: boolean;
  explain?: boolean;
}

interface IndexSuggestion {
  collection: string;
  index: Record<string, 1 | -1 | 'text'>;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

class QueryOptimizer {
  private static instance: QueryOptimizer;
  private queryCache: Map<string, any> = new Map();
  private slowQueryThreshold: number = 100; // milliseconds

  static getInstance(): QueryOptimizer {
    if (!QueryOptimizer.instance) {
      QueryOptimizer.instance = new QueryOptimizer();
    }
    return QueryOptimizer.instance;
  }

  // Optimized query execution with caching and performance monitoring
  async executeQuery<T>(
    model: mongoose.Model<T>,
    query: any,
    options: QueryOptions = {}
  ): Promise<{
    data: T[];
    executionTime: number;
    explain?: any;
    suggestions?: IndexSuggestion[];
  }> {
    const startTime = Date.now();
    const queryId = this.generateQueryId(model.modelName, query, options);
    
    try {
      // Check cache first
      const cached = this.queryCache.get(queryId);
      if (cached && !options.explain) {
        logger.debug(`Query cache hit for ${model.modelName}`);
        return {
          data: cached,
          executionTime: 0,
        };
      }

      // Build optimized query
      let mongoQuery = model.find(query);

      // Apply optimizations
      mongoQuery = this.applyQueryOptimizations(mongoQuery, options);

      // Execute query
      const data = await mongoQuery.exec();
      const executionTime = Date.now() - startTime;

      // Log slow queries
      if (executionTime > this.slowQueryThreshold) {
        logger.warn(`Slow query detected: ${model.modelName}`, {
          query,
          options,
          executionTime,
        });
      }

      // Cache result if appropriate
      if (!options.explain && data.length > 0) {
        this.queryCache.set(queryId, data);
        // Set cache expiration
        setTimeout(() => {
          this.queryCache.delete(queryId);
        }, 300000); // 5 minutes
      }

      // Get query explanation if requested
      let explain: any;
      if (options.explain) {
        explain = await this.getQueryExplanation(model, query, options);
      }

      // Analyze query for optimization suggestions
      const suggestions = await this.analyzeQuery(model, query, options);

      return {
        data,
        executionTime,
        explain,
        suggestions,
      };
    } catch (error) {
      logger.error(`Query execution error for ${model.modelName}:`, error);
      throw error;
    }
  }

  // Apply query optimizations
  private applyQueryOptimizations(query: any, options: QueryOptions): any {
    // Apply limit
    if (options.limit) {
      query = query.limit(options.limit);
    }

    // Apply skip
    if (options.skip) {
      query = query.skip(options.skip);
    }

    // Apply sort
    if (options.sort) {
      query = query.sort(options.sort);
    }

    // Apply select
    if (options.select) {
      query = query.select(options.select);
    }

    // Apply populate
    if (options.populate) {
      query = query.populate(options.populate);
    }

    // Apply lean for better performance
    if (options.lean !== false) {
      query = query.lean();
    }

    return query;
  }

  // Get query explanation
  private async getQueryExplanation(
    model: mongoose.Model<any>,
    query: any,
    options: QueryOptions
  ): Promise<any> {
    try {
      const mongoQuery = model.find(query);
      this.applyQueryOptimizations(mongoQuery, options);
      
      const explanation = await mongoQuery.explain('executionStats');
      return explanation;
    } catch (error) {
      logger.error('Query explanation error:', error);
      return null;
    }
  }

  // Analyze query for optimization suggestions
  private async analyzeQuery(
    model: mongoose.Model<any>,
    query: any,
    options: QueryOptions
  ): Promise<IndexSuggestion[]> {
    const suggestions: IndexSuggestion[] = [];
    const collection = model.collection;

    try {
      // Analyze query fields
      const queryFields = this.extractQueryFields(query);
      const sortFields = options.sort ? Object.keys(options.sort) : [];
      
      // Check for missing indexes
      const existingIndexes = await collection.indexes();
      const existingIndexFields = existingIndexes.map(index => 
        Object.keys(index.key).join(',')
      );

      // Suggest compound indexes
      if (queryFields.length > 1) {
        const compoundIndex = this.createCompoundIndex(queryFields, sortFields);
        if (!this.indexExists(compoundIndex, existingIndexFields)) {
          suggestions.push({
            collection: model.modelName,
            index: compoundIndex,
            reason: 'Compound index for query fields',
            priority: 'high',
          });
        }
      }

      // Suggest sort indexes
      if (sortFields.length > 0) {
        const sortIndex = this.createSortIndex(sortFields, queryFields);
        if (!this.indexExists(sortIndex, existingIndexFields)) {
          suggestions.push({
            collection: model.modelName,
            index: sortIndex,
            reason: 'Index for sort fields',
            priority: 'medium',
          });
        }
      }

      // Suggest text indexes
      const textFields = this.findTextFields(query);
      if (textFields.length > 0) {
        const textIndex = this.createTextIndex(textFields);
        if (!this.indexExists(textIndex, existingIndexFields)) {
          suggestions.push({
            collection: model.modelName,
            index: textIndex,
            reason: 'Text index for search fields',
            priority: 'medium',
          });
        }
      }

    } catch (error) {
      logger.error('Query analysis error:', error);
    }

    return suggestions;
  }

  // Extract query fields from MongoDB query
  private extractQueryFields(query: any): string[] {
    const fields: string[] = [];
    
    const extractFields = (obj: any, prefix = '') => {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          if (key === '$or' || key === '$and') {
            // Handle logical operators
            (value as any[]).forEach(condition => {
              fields.push(...extractFields(condition, prefix));
            });
          } else if (key.startsWith('$')) {
            // Handle comparison operators
            fields.push(prefix + key);
          } else {
            // Recursively extract from nested objects
            extractFields(value, prefix + key + '.');
          }
        } else {
          fields.push(prefix + key);
        }
      }
    };

    extractFields(query);
    return [...new Set(fields)]; // Remove duplicates
  }

  // Find fields that might benefit from text indexes
  private findTextFields(query: any): string[] {
    const textFields: string[] = [];
    
    const findTextFields = (obj: any, prefix = '') => {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
          if (key === '$text') {
            // Direct text search
            textFields.push('$text');
          } else if (key === '$regex') {
            // Regex search - might benefit from text index
            textFields.push(prefix + key);
          } else {
            findTextFields(value, prefix + key + '.');
          }
        }
      }
    };

    findTextFields(query);
    return textFields;
  }

  // Create compound index
  private createCompoundIndex(queryFields: string[], sortFields: string[]): Record<string, 1 | -1> {
    const index: Record<string, 1 | -1> = {};
    
    // Add query fields first
    queryFields.forEach(field => {
      index[field] = 1;
    });
    
    // Add sort fields
    sortFields.forEach(field => {
      if (!index[field]) {
        index[field] = 1;
      }
    });
    
    return index;
  }

  // Create sort index
  private createSortIndex(sortFields: string[], queryFields: string[]): Record<string, 1 | -1> {
    const index: Record<string, 1 | -1> = {};
    
    // Add query fields first for better performance
    queryFields.forEach(field => {
      index[field] = 1;
    });
    
    // Add sort fields
    sortFields.forEach(field => {
      if (!index[field]) {
        index[field] = 1;
      }
    });
    
    return index;
  }

  // Create text index
  private createTextIndex(textFields: string[]): Record<string, 'text'> {
    const index: Record<string, 'text'> = {};
    textFields.forEach(field => {
      index[field] = 'text';
    });
    return index;
  }

  // Check if index exists
  private indexExists(index: Record<string, any>, existingIndexes: string[]): boolean {
    const indexString = Object.keys(index).join(',');
    return existingIndexes.includes(indexString);
  }

  // Generate query ID for caching
  private generateQueryId(modelName: string, query: any, options: QueryOptions): string {
    const queryString = JSON.stringify({ modelName, query, options });
    return Buffer.from(queryString).toString('base64');
  }

  // Bulk operations optimization
  async bulkWrite<T>(
    model: mongoose.Model<T>,
    operations: any[],
    options: { ordered?: boolean; writeConcern?: any } = {}
  ): Promise<mongoose.mongo.BulkWriteResult> {
    try {
      const startTime = Date.now();
      
      // Group operations by type for better performance
      const groupedOps = this.groupBulkOperations(operations);
      
      // Execute operations in batches
      const results = await this.executeBulkOperations(model, groupedOps, options);
      
      const executionTime = Date.now() - startTime;
      logger.info(`Bulk write completed for ${model.modelName}`, {
        operationCount: operations.length,
        executionTime,
      });
      
      return results;
    } catch (error) {
      logger.error(`Bulk write error for ${model.modelName}:`, error);
      throw error;
    }
  }

  // Group bulk operations by type
  private groupBulkOperations(operations: any[]): Record<string, any[]> {
    const grouped: Record<string, any[]> = {
      insertOne: [],
      updateOne: [],
      updateMany: [],
      deleteOne: [],
      deleteMany: [],
      replaceOne: [],
    };

    operations.forEach(op => {
      const opType = Object.keys(op)[0];
      if (grouped[opType]) {
        grouped[opType].push(op[opType]);
      }
    });

    return grouped;
  }

  // Execute grouped bulk operations
  private async executeBulkOperations(
    model: mongoose.Model<any>,
    groupedOps: Record<string, any[]>,
    options: any
  ): Promise<mongoose.mongo.BulkWriteResult> {
    const operations: any[] = [];
    
    // Convert grouped operations back to bulk operations
    Object.entries(groupedOps).forEach(([opType, ops]) => {
      ops.forEach(op => {
        operations.push({ [opType]: op });
      });
    });

    return await model.bulkWrite(operations, options);
  }

  // Database connection optimization
  async optimizeConnection(): Promise<void> {
    try {
      // Set connection pool options
      mongoose.connection.on('connected', () => {
        logger.info('MongoDB connected with optimized settings');
      });

      // Configure connection options
      const options = {
        maxPoolSize: 10, // Maximum number of connections
        minPoolSize: 5,  // Minimum number of connections
        maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
        serverSelectionTimeoutMS: 5000, // How long to try selecting a server
        socketTimeoutMS: 45000, // How long to wait for a response
        bufferMaxEntries: 0, // Disable mongoose buffering
        bufferCommands: false, // Disable mongoose buffering
      };

      await mongoose.connection.db.admin().command({
        setParameter: 1,
        maxIndexBuildMemoryUsageMegabytes: 200,
      });

      logger.info('Database connection optimized');
    } catch (error) {
      logger.error('Database optimization error:', error);
    }
  }

  // Clear query cache
  clearCache(): void {
    this.queryCache.clear();
    logger.info('Query cache cleared');
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.queryCache.size,
      keys: Array.from(this.queryCache.keys()),
    };
  }
}

export const queryOptimizer = QueryOptimizer.getInstance();

