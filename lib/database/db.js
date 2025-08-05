import postgres from 'postgres';

const connectionString = process.env.POSTGRES_URL;

let sql = null;

if (!connectionString) {
    if (typeof window === 'undefined') {
        console.error('ERROR: POSTGRES_URL environment variable is not defined.');
    }
} else {
    try {
        const options = {
            ssl: 'require', // Neon DB requires SSL
            max: 10,
            idle_timeout: 20,
            connect_timeout: 10,
            prepare: false, // Better for Neon DB
        };

        sql = postgres(connectionString, options);
        console.log(`Database connected (${process.env.NODE_ENV || 'unknown'})`);
    } catch (error) {
        console.error('Failed to connect to database:', error.message);
        sql = null;
    }
}

export { sql };

export function isDbConnected() {
    return !!sql;
}