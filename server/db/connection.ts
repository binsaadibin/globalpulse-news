import mongoose from 'mongoose';
import { initializeDefaultUsers } from '../modules/users/users.controller.js';

class DatabaseManager {
  private isConnected = false;
  private connectionAttempts = 0;
  private readonly maxConnectionAttempts = 3;
  private retryTimeout?: NodeJS.Timeout;

  async connect(): Promise<mongoose.Connection> {
    try {
      const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://golbalnews:zulfiqar4455@globalnews.yhhmhpy.mongodb.net/globalpulse?retryWrites=true&w=majority';
      
      console.log('🔗 Establishing MongoDB connection...');
      
      const connectionOptions: mongoose.ConnectOptions = {
        maxPoolSize: 20,
        minPoolSize: 5,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        heartbeatFrequencyMS: 10000,
        retryWrites: true,
        w: 'majority',
        retryReads: true,
      };

      const conn = await mongoose.connect(mongoURI, connectionOptions);
      
      this.isConnected = true;
      this.connectionAttempts = 0;
      
      console.log(`✅ MongoDB Connected Successfully:`);
      console.log(`   Host: ${conn.connection.host}`);
      console.log(`   Database: ${conn.connection.name}`);
      console.log(`   Port: ${conn.connection.port}`);
      console.log(`   Ready State: ${this.getReadyStateText(conn.connection.readyState)}`);

      // Initialize default users
      await initializeDefaultUsers();

      // Set up event listeners
      this.setupEventListeners(conn.connection);
      
      return conn.connection;
    } catch (error) {
      this.connectionAttempts++;
      console.error(`❌ MongoDB Connection Attempt ${this.connectionAttempts} Failed:`, error);
      
      if (this.connectionAttempts >= this.maxConnectionAttempts) {
        console.log('💥 Maximum connection attempts reached. Exiting...');
        throw error;
      }
      
      // Retry after delay with exponential backoff
      const retryDelay = Math.min(1000 * Math.pow(2, this.connectionAttempts), 30000);
      console.log(`🔄 Retrying connection in ${retryDelay}ms...`);
      
      return new Promise((resolve, reject) => {
        this.retryTimeout = setTimeout(async () => {
          try {
            const connection = await this.connect();
            resolve(connection);
          } catch (retryError) {
            reject(retryError);
          }
        }, retryDelay);
      });
    }
  }

  private setupEventListeners(connection: mongoose.Connection): void {
    connection.on('connected', () => {
      console.log('✅ MongoDB connection established');
      this.isConnected = true;
    });

    connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
      this.isConnected = false;
    });

    connection.on('disconnected', () => {
      console.log('⚠️ MongoDB connection disconnected');
      this.isConnected = false;
    });

    connection.on('reconnected', () => {
      console.log('🔄 MongoDB connection reestablished');
      this.isConnected = true;
    });

    connection.on('close', () => {
      console.log('🔒 MongoDB connection closed');
      this.isConnected = false;
    });
  }

  private getReadyStateText(readyState: number): string {
    switch (readyState) {
      case 0: return 'Disconnected';
      case 1: return 'Connected';
      case 2: return 'Connecting';
      case 3: return 'Disconnecting';
      default: return 'Unknown';
    }
  }

  getConnectionStatus(): { isConnected: boolean; readyState: string } {
    const connection = mongoose.connection;
    return {
      isConnected: this.isConnected && connection.readyState === 1,
      readyState: this.getReadyStateText(connection.readyState)
    };
  }

  async disconnect(): Promise<void> {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }

    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('✅ MongoDB connection closed gracefully');
    }
  }

  async healthCheck(): Promise<{ status: string; details: any }> {
    const status = this.getConnectionStatus();
    
    if (!status.isConnected) {
      return {
        status: 'unhealthy',
        details: {
          readyState: status.readyState,
          connectionAttempts: this.connectionAttempts
        }
      };
    }

    try {
      // Test database operation
      await mongoose.connection.db.admin().ping();
      return {
        status: 'healthy',
        details: {
          readyState: status.readyState,
          database: mongoose.connection.db.databaseName,
          host: mongoose.connection.host
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          readyState: status.readyState,
          error: error.message
        }
      };
    }
  }
}

// Create singleton instance
const databaseManager = new DatabaseManager();

export const connectDB = (): Promise<mongoose.Connection> => databaseManager.connect();
export const getDBStatus = () => databaseManager.getConnectionStatus();
export const disconnectDB = (): Promise<void> => databaseManager.disconnect();
export const healthCheckDB = (): Promise<{ status: string; details: any }> => databaseManager.healthCheck();