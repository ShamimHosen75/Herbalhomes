import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data, error } = await supabase.auth.admin.updateUserById(
    "49a2a26f-014f-41c2-8abb-2280f9633162",
    { password: "admin123" }
  );

  return new Response(JSON.stringify({ success: !error, error: error?.message }), {
    headers: { "Content-Type": "application/json" },
  });
});