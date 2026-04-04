import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { order_id } = await req.json();
    if (!order_id) {
      return new Response(JSON.stringify({ error: "order_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get courier settings
    const { data: settings, error: settingsErr } = await supabase
      .from("courier_settings")
      .select("*")
      .eq("id", "steadfast")
      .single();

    if (settingsErr || !settings) {
      return new Response(JSON.stringify({ error: "Courier settings not found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!settings.enabled) {
      return new Response(JSON.stringify({ error: "Courier is not enabled" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get order details
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderErr || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get order items for note
    const { data: items } = await supabase
      .from("order_items")
      .select("name, quantity, variant_label")
      .eq("order_id", order_id);

    const itemsNote = (items || [])
      .map((i: any) => `${i.name}${i.variant_label ? ` (${i.variant_label})` : ""} x${i.quantity}`)
      .join(", ");

    // Build address string
    const addr = order.address as any;
    const addressStr = typeof addr === "string"
      ? addr
      : [addr?.address, addr?.area, addr?.city, addr?.district].filter(Boolean).join(", ");

    // Determine COD amount
    const codAmount = order.payment_method === "cod" ? Number(order.total) : 0;

    // Call Steadfast API
    const steadfastUrl = `${settings.api_base_url}/create_order`;
    const payload = {
      invoice: order.id,
      recipient_name: order.customer_name,
      recipient_phone: order.customer_phone,
      recipient_address: addressStr,
      cod_amount: codAmount,
      note: itemsNote,
    };

    console.log("Sending to Steadfast:", JSON.stringify(payload));

    const response = await fetch(steadfastUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": settings.api_key,
        "Secret-Key": settings.api_secret,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log("Steadfast response:", responseText);

    let result: any;
    try {
      result = JSON.parse(responseText);
    } catch {
      return new Response(
        JSON.stringify({
          error: responseText || `Steadfast API error (HTTP ${response.status})`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!response.ok || result.status !== 200) {
      return new Response(
        JSON.stringify({
          error: result.message || "Failed to create parcel",
          details: result,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update order with tracking info
    const consignment = result.consignment || {};
    const trackingCode = consignment.tracking_code || "";

    await supabase
      .from("orders")
      .update({
        tracking_number: trackingCode,
        courier_name: "Steadfast",
        status: "shipped",
      } as any)
      .eq("id", order_id);

    // Add status history
    await supabase.from("order_status_history").insert({
      order_id: order_id,
      status: "shipped",
      date: new Date().toISOString(),
      note: `Steadfast courier এ পাঠানো হয়েছে। Tracking: ${trackingCode}`,
    } as any);

    return new Response(
      JSON.stringify({
        success: true,
        tracking_code: trackingCode,
        consignment_id: consignment.consignment_id,
        message: "Order sent to Steadfast successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
