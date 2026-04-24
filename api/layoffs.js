import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// These variables must be set in the Vercel Dashboard -> Settings -> Environment Variables
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  try {
    // Fetch top impacted companies from Supabase
    // We order by layoff_count descending to get the "top" impacted
    const { data: companies, error } = await supabase
      .from('companies')
      .select('*')
      .order('layoff_count', { ascending: false })
      .limit(10);

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    // Return the formatted payload
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate'); // Cache for 1 min
    res.status(200).json({
      topCompanies: companies || []
    });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: 'Failed to fetch layoffs data from Supabase' });
  }
}
