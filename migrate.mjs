import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load Supabase URL and Key from .env
const SUPABASE_URL = "https://pgzkvausyxyojzvctmcy.supabase.co"; // From your .env
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnemt2YXVzeXh5b2p6dmN0bWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MTAxNzMsImV4cCI6MjA5MTQ4NjE3M30.T7Et9PNvTMmVM81r_27sW-sbehVxpEecT_ip7BSX-pA"; // From your .env

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const data = JSON.parse(fs.readFileSync('migration_data.json', 'utf-8'));

async function migrate() {
  console.log("Starting data migration...");

  try {
    // 1. Categories
    if (data.categories?.length) {
      console.log(`Upserting ${data.categories.length} categories...`);
      const { error } = await supabase.from('categories').upsert(data.categories);
      if (error) throw error;
    }

    // 2. Products
    if (data.products?.length) {
      console.log(`Upserting ${data.products.length} products...`);
      const { error } = await supabase.from('products').upsert(data.products);
      if (error) throw error;
    }

    // 3. Product Variants
    if (data.product_variants?.length) {
      console.log(`Upserting ${data.product_variants.length} product variants...`);
      const { error } = await supabase.from('product_variants').upsert(data.product_variants);
      if (error) throw error;
    }

    // 4. Customer Video Reviews
    if (data.customer_video_reviews?.length) {
      console.log(`Upserting ${data.customer_video_reviews.length} customer video reviews...`);
      const { error } = await supabase.from('customer_video_reviews').upsert(data.customer_video_reviews);
      if (error) throw error;
    }

    // 5. BSTI Certificates
    if (data.bsti_certificates?.length) {
      console.log(`Upserting ${data.bsti_certificates.length} bsti certificates...`);
      const { error } = await supabase.from('bsti_certificates').upsert(data.bsti_certificates);
      if (error) throw error;
    }

    // 6. Sliders
    if (data.sliders?.length) {
      console.log(`Upserting ${data.sliders.length} sliders...`);
      const { error } = await supabase.from('sliders').upsert(data.sliders);
      if (error) throw error;
    }

    // 7. Site Settings
    if (data.site_settings?.length) {
      console.log(`Upserting ${data.site_settings.length} site settings...`);
      const { error } = await supabase.from('site_settings').upsert(data.site_settings);
      if (error) throw error;
    }

    // 8. Payment Methods
    if (data.payment_methods?.length) {
      console.log(`Upserting ${data.payment_methods.length} payment methods...`);
      const { error } = await supabase.from('payment_methods').upsert(data.payment_methods);
      if (error) throw error;
    }

    // 9. Courier Settings
    if (data.courier_settings?.length) {
      console.log(`Upserting ${data.courier_settings.length} courier settings...`);
      const { error } = await supabase.from('courier_settings').upsert(data.courier_settings);
      if (error) throw error;
    }

    // 10. Admin Users (staff_users)
    if (data.staff_users?.length) {
      console.log(`Upserting ${data.staff_users.length} staff users...`);
      const { error } = await supabase.from('staff_users').upsert(data.staff_users);
      if (error) throw error;
    }

    // 11. Orders
    if (data.orders?.length) {
      console.log(`Upserting ${data.orders.length} orders...`);
      const { error } = await supabase.from('orders').upsert(data.orders);
      if (error) throw error;
    }

    // 12. Order Items
    if (data.order_items?.length) {
      console.log(`Upserting ${data.order_items.length} order items...`);
      const { error } = await supabase.from('order_items').upsert(data.order_items);
      if (error) throw error;
    }

    console.log("✅ All data migrated successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
  }
}

migrate();
