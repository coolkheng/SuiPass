const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, 'migrations', '001_update_wallet_address_length.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Migration SQL loaded');
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });
    
    if (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }
    
    console.log('✅ Migration completed successfully!');
    
    // Verify the changes
    const { data: columns, error: verifyError } = await supabase
      .from('information_schema.columns')
      .select('table_name, column_name, character_maximum_length')
      .eq('column_name', 'wallet_address');
    
    if (!verifyError && columns) {
      console.log('🔍 Current wallet_address column lengths:');
      columns.forEach(col => {
        console.log(`  ${col.table_name}.${col.column_name}: ${col.character_maximum_length} chars`);
      });
    }
    
  } catch (error) {
    console.error('💥 Migration error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
