import { createClient } from '@/utils/supabase/server';
import { db } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  const testResults = {
    vercelPostgres: {
      status: 'unknown',
      message: '',
      details: null as any
    },
    supabase: {
      status: 'unknown',
      message: '',
      details: null as any
    }
  };

  // Test Vercel Postgres connection
  try {
    const client = await db.connect();
    
    // Test basic query
    const result = await client.sql`SELECT NOW() as current_time, version() as pg_version`;
    
    client.release();
    
    testResults.vercelPostgres = {
      status: 'success',
      message: 'Vercel Postgres connection successful',
      details: {
        currentTime: result.rows[0]?.current_time,
        postgresVersion: result.rows[0]?.pg_version,
        connectionPool: 'Available'
      }
    };
  } catch (error) {
    testResults.vercelPostgres = {
      status: 'error',
      message: 'Vercel Postgres connection failed',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : null
      }
    };
  }

  // Test Supabase connection
  try {
    const supabase = await createClient();
    
    // Test basic query to check connection
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);

    if (error) {
      throw error;
    }

    // Test auth status
    const { data: authData } = await supabase.auth.getUser();
    
    testResults.supabase = {
      status: 'success',
      message: 'Supabase connection successful',
      details: {
        tablesAccessible: data ? data.length >= 0 : false,
        authStatus: authData?.user ? 'authenticated' : 'anonymous',
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    };
  } catch (error) {
    testResults.supabase = {
      status: 'error',
      message: 'Supabase connection failed',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    };
  }

  // Determine overall status
  const overallStatus = testResults.vercelPostgres.status === 'success' || testResults.supabase.status === 'success' 
    ? 'success' 
    : 'error';

  return NextResponse.json({
    overall: {
      status: overallStatus,
      message: overallStatus === 'success' 
        ? 'At least one database connection is working' 
        : 'All database connections failed'
    },
    connections: testResults,
    environment: {
      hasPostgresUrl: !!process.env.POSTGRES_URL,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      nodeEnv: process.env.NODE_ENV
    }
  }, { 
    status: overallStatus === 'success' ? 200 : 500 
  });
}
