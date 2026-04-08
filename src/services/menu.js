// src/services/menu.js
import { supabase } from "../lib/supabase";

export async function fetchMenu() {
  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      id,
      name,
      "order",
      menu_items (
        id,
        name,
        description,
        price,
        image_url,
        is_available,
        "order"
      )
    `,
    )
    .order("order", { ascending: true });

  if (error) throw error;

  // normalize
  return data.map((category) => ({
    ...category,
    menu_items: (category.menu_items || [])
      .filter((item) => item.is_available) // hide unavailable
      .sort((a, b) => a.order - b.order),
  }));
}
