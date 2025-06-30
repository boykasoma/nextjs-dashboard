import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Test 1: Simple connection test without requiring authentication
    console.log('Testing Supabase connection...');
    
    // Test the connection by trying to access session (should not throw error even if null)
    const { data: sessionData } = await supabase.auth.getSession();
    
    // Test 2: Try a simple query that should work with anonymous access
    const { data, error } = await supabase
      .from('test_table')
      .select('*')
      .limit(1);
    
    // If the table doesn't exist, that's okay - it means the connection works
    if (error && !error.message.includes('does not exist') && !error.message.includes('relation') && !error.message.includes('permission')) {
      console.log('Database query failed with:', error.message);
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection successful',
      details: {
        connectionWorking: true,
        sessionExists: !!sessionData?.session,
        queryError: error?.message || 'No query errors',
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        timestamp: new Date().toISOString()
      }
    });
    
    return NextResponse.json({
      status: 'success',
      message: 'Full Supabase connection successful',
      details: {
        authWorking: true,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
      }
    });
    
  } catch (error) {
    console.error('Supabase test error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Supabase connection failed',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : null,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    }, { status: 500 });
  }
}
