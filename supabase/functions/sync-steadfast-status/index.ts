import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Map Steadfast delivery_status to our order status
function mapSteadfastStatus(deliveryStatus: string): string | null {
  const statusMap: Record<string, string> = {
    "pending": "shipped",
    "delivered_approval_pending": "delivered",
    "partial_delivered_approval_pending": "delivered",
    "cancelled_approval_pending": "cancelled",
    "unknown_approval_pending": "shipped",
    "delivered": "delivered",
    "partial_delivered": "delivered",
    "cancelled": "cancelled",
    "hold": "shipped",
    "in_review": "shipped",
    "unknown": "shipped",
  };
  return statusMap[deliveryStatus] || null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get courier settings
    const { data: settings, error: settingsErr } = await supabase
      .from("courier_settings")
      .select("*")
      .eq("id", "steadfast")
      .single();

    if (settingsErr || !settings || !settings.enabled) {
      return new Response(
        JSON.stringify({ error: "Courier not configured or disabled" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get all orders sent to Steadfast that are not in final status
    const { data: orders, error: ordersErr } = await supabase
      .from("orders")
      .select("id, tracking_number, status")
      .eq("courier_name", "Steadfast")
      .not("tracking_number", "is", null)
      .not("status", "in", '("delivered","cancelled","refunded")');

    if (ordersErr) {
      console.error("Error fetching orders:", ordersErr);
      return new Response(
        JSON.stringify({ error: "Failed to fetch orders" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!orders || orders.length === 0) {
      return new Response(
        JSON.stringify({ message: "No orders to sync", updated: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let updated = 0;
    const errors: string[] = [];

    for (const order of orders) {
      try {
        // Check status by invoice (order ID)
        const statusUrl = `${settings.api_base_url}/status_by_invoice/${order.id}`;
        
        const response = await fetch(statusUrl, {
          method: "GET",
          headers: {
            "Api-Key": settings.api_key,
            "Secret-Key": settings.api_secret,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        console.log(`Steadfast status for ${order.id}:`, JSON.stringify(result));

        if (response.ok && result.status === 200 && result.delivery_status) {
          const newStatus = mapSteadfastStatus(result.delivery_status);

          if (newStatus && newStatus !== order.status) {
            // Update order status
            await supabase
              .from("orders")
              .update({ status: newStatus } as any)
              .eq("id", order.id);

            // Add status history
            await supabase.from("order_status_history").insert({
              order_id: order.id,
              status: newStatus,
              date: new Date().toISOString(),
              note: `Steadfast auto-sync: ${result.delivery_status}`,
            } as any);

            updated++;
            console.log(`Updated ${order.id}: ${order.status} -> ${newStatus}`);
          }
        }
      } catch (err: any) {
        console.error(`Error syncing ${order.id}:`, err.message);
        errors.push(`${order.id}: ${err.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        total: orders.length,
        updated,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
