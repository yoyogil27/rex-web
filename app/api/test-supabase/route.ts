// app/api/test-supabase/route.ts
import { supabase } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test 1: Check connection
    console.log('Testing Supabase connection...');
    
    // Test 2: Try to fetch from places table
    const { data: places, error: placesError } = await supabase
      .from('places')
      .select('*')
      .limit(5);

    if (placesError) {
      console.error('Places error:', placesError);
      return NextResponse.json({
        success: false,
        error: placesError.message,
        details: placesError,
        message: 'Failed to fetch from places table'
      }, { status: 500 });
    }

    // Test 3: Try to fetch from organizations table
    const { data: organizations, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .limit(5);

    if (orgError) {
      console.error('Organizations error:', orgError);
      return NextResponse.json({
        success: false,
        error: orgError.message,
        details: orgError,
        message: 'Failed to fetch from organizations table'
      }, { status: 500 });
    }

    // Test 4: Try to fetch from experiences table
    const { data: experiences, error: expError } = await supabase
      .from('experiences')
      .select('*')
      .limit(5);

    if (expError) {
      console.error('Experiences error:', expError);
      return NextResponse.json({
        success: false,
        error: expError.message,
        details: expError,
        message: 'Failed to fetch from experiences table'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful!',
      data: {
        places: places?.length || 0,
        organizations: organizations?.length || 0,
        experiences: experiences?.length || 0,
        samplePlace: places?.[0] || null,
        sampleOrg: organizations?.[0] || null,
        sampleExp: experiences?.[0] || null,
      }
    });
  } catch (error: any) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      details: error
    }, { status: 500 });
  }
}