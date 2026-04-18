<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { createClient } from "@supabase/supabase-js";

const router = useRouter();
const SESSION_DURATION = 6 * 60 * 60 * 1000; // 6 hours in ms

const supabase = createClient(
  "https://gruipgmcxdqkzdxhdfgd.supabase.co",
  "sb_publishable_dVjAQ8UTVDB7mUel7Xlorg_GdTiBybG",
);

const dishes = ref([]);
const categories = ref([]);
const isEditing = ref(false);
const isUploading = ref(false);
const activeTab = ref("products");

// --- AUTH STATE ---
const user = ref(null);
const authEmail = ref("");
const authPassword = ref("");

const form = ref({
  id: null,
  name: "",
  price: null,
  category_id: "",
  image_url: "",
  is_available: true,
});

const handleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: authEmail.value,
    password: authPassword.value,
  });
  if (error) alert("Access Denied: " + error.message);
  else { user.value = data.user; localStorage.setItem("adminLoginAt", Date.now()); fetchData(); }
};

const handleLogout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem("adminLoginAt");
  user.value = null;
};

const checkUser = async () => {
  const loginAt = localStorage.getItem("adminLoginAt");
  if (loginAt && Date.now() - Number(loginAt) > SESSION_DURATION) {
    await supabase.auth.signOut();
    localStorage.removeItem("adminLoginAt");
    return;
  }
  const { data } = await supabase.auth.getUser();
  user.value = data.user;
};

const fetchData = async () => {
  const { data: catData } = await supabase.from("categories").select("*");
  const { data: dishData } = await supabase
    .from("dishes")
    .select("*")
    .order("created_at", { ascending: false });
  categories.value = catData;
  dishes.value = dishData;
};

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  isUploading.value = true;
  const fileName = `${Date.now()}_${file.name}`;

  try {
    const { data, error } = await supabase.storage
      .from("menu-items")
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("menu-items")
      .getPublicUrl(fileName);
    form.value.image_url = urlData.publicUrl;
  } catch (err) {
    alert("Upload failed: " + err.message);
  } finally {
    isUploading.value = false;
  }
};

const handleSave = async () => {
  if (!form.value.name || !form.value.price)
    return alert("Please add Name and Price!");

  const payload = { ...form.value };
  const id = payload.id;
  delete payload.id;

  const { error } = isEditing.value
    ? await supabase.from("dishes").update(payload).eq("id", id)
    : await supabase.from("dishes").insert([payload]);

  if (!error) {
    resetForm();
    fetchData();
  }
};

const deleteDish = async (id) => {
  if (confirm("Are you sure you want to delete this dish?")) {
    const { error } = await supabase.from("dishes").delete().eq("id", id);
    if (!error) fetchData();
  }
};

const startEdit = (dish) => {
  form.value = { ...dish };
  isEditing.value = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const resetForm = () => {
  form.value = {
    id: null,
    name: "",
    price: null,
    category_id: "",
    image_url: "",
    is_available: true,
  };
  isEditing.value = false;
};

// --- CATEGORY MANAGEMENT ---
const categoryForm = ref({ id: null, label: "", label_am: "", icon: "", display_order: 0 });
const isEditingCategory = ref(false);

const saveCategory = async () => {
  if (!categoryForm.value.label) return alert("Please add an English label!");
  const payload = { ...categoryForm.value };
  if (!isEditingCategory.value) payload.id = payload.label.toLowerCase().trim().replace(/\s+/g, "_");
  const { error } = isEditingCategory.value
    ? await supabase.from("categories").update(payload).eq("id", payload.id)
    : await supabase.from("categories").insert([payload]);
  if (error) alert(error.message);
  else { resetCategoryForm(); fetchData(); }
};

const deleteCategory = async (id) => {
  if (confirm("Delete this category? Dishes linked to it will lose their category.")) {
    await supabase.from("categories").delete().eq("id", id);
    fetchData();
  }
};

const startEditCategory = (cat) => {
  categoryForm.value = { ...cat };
  isEditingCategory.value = true;
};

const resetCategoryForm = () => {
  categoryForm.value = { id: null, label: "", label_am: "", icon: "", display_order: 0 };
  isEditingCategory.value = false;
};

onMounted(async () => {
  await checkUser();
  if (user.value) fetchData();
});
</script>

<template>
  <div class="min-h-screen bg-[#121212] text-white font-sans pb-20">
    <template v-if="user">
      <header
        class="sticky top-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-md border-b border-white/5 p-5"
      >
        <div class="flex justify-between items-center max-w-2xl mx-auto">
          <div class="flex items-center gap-3">
            <button
              @click="router.push('/')"
              class="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 active:scale-95 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 class="text-xl font-black text-[#DB7C2E] tracking-tight">
              Z PARK <span class="text-white/20">ADMIN</span>
            </h1>
          </div>
          <button
            v-if="isEditing && activeTab === 'products'"
            @click="resetForm"
            class="text-[10px] font-black bg-white/5 border border-white/10 px-4 py-2 rounded-full uppercase tracking-widest active:scale-95 transition-all"
          >
            Cancel Edit
          </button>
        </div>
        <div class="flex gap-2 max-w-2xl mx-auto mt-4">
          <button
            @click="activeTab = 'products'"
            :class="activeTab === 'products' ? 'bg-[#DB7C2E] text-black' : 'bg-white/5 text-white/50 hover:text-white'"
            class="flex-1 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
          >
            Products
          </button>
          <button
            @click="activeTab = 'categories'"
            :class="activeTab === 'categories' ? 'bg-[#DB7C2E] text-black' : 'bg-white/5 text-white/50 hover:text-white'"
            class="flex-1 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
          >
            Categories
          </button>
        </div>
      </header>

      <main class="max-w-2xl mx-auto p-5 space-y-8">
        <!-- PRODUCTS TAB -->
        <template v-if="activeTab === 'products'">
        <section
          class="bg-[#1A1A1A] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden"
        >
          <div class="p-6 md:p-8">
            <div class="mb-8 space-y-4">
              <label
                class="text-[10px] text-white/30 uppercase tracking-[0.2em] ml-1"
                >Dish Visual</label
              >

              <div
                class="w-full h-52 rounded-[2rem] bg-black/40 border-2 border-dashed border-white/5 overflow-hidden flex items-center justify-center relative"
              >
                <img
                  v-if="form.image_url"
                  :src="form.image_url"
                  class="w-full h-full object-cover"
                />
                <div v-else class="flex flex-col items-center opacity-20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-12 w-12 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span class="text-[10px] uppercase tracking-widest font-bold"
                    >No Image Preview</span
                  >
                </div>
              </div>

              <label
                class="flex items-center justify-center gap-3 w-full bg-[#DB7C2E]/10 border border-[#DB7C2E]/30 py-5 rounded-2xl cursor-pointer hover:bg-[#DB7C2E]/20 active:scale-95 transition-all group"
              >
                <input
                  type="file"
                  @change="handleImageUpload"
                  class="hidden"
                  accept="image/*"
                />

                <div
                  v-if="isUploading"
                  class="w-5 h-5 border-2 border-[#DB7C2E] border-t-transparent rounded-full animate-spin"
                ></div>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-[#DB7C2E] group-hover:scale-110 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                <span
                  class="text-xs font-black uppercase tracking-widest text-[#DB7C2E] p-5"
                >
                  {{
                    isUploading
                      ? "Uploading Image..."
                      : form.image_url
                        ? "Change Photo"
                        : "Upload Dish Photo"
                  }}
                </span>
              </label>
            </div>

            <div class="grid gap-6">
              <div class="space-y-2">
                <label
                  class="text-[10px] text-white/30 uppercase tracking-widest ml-1 font-bold"
                  >Dish Name</label
                >
                <input
                  v-model="form.name"
                  type="text"
                  class="w-full bg-[#1A1A1A] text-white border border-white/10 p-5 rounded-2xl focus:border-[#DB7C2E] outline-none transition-all placeholder:text-white/20 appearance-none"
                  placeholder="Chechebsa, Pizza, etc."
                />
              </div>

              <div class="grid grid-cols-2 gap-4 mb-8">
                <div class="space-y-2">
                  <label
                    class="text-[10px] text-white/30 uppercase tracking-widest ml-1 font-bold"
                    >Price (ETB)</label
                  >
                  <input
                    v-model.number="form.price"
                    type="number"
                    class="w-full bg-[#1A1A1A] border border-white/10 p-5 rounded-2xl outline-none focus:border-[#DB7C2E]"
                    placeholder="0"
                  />
                </div>
                <div class="space-y-2">
                  <label
                    class="text-[10px] text-white/30 uppercase tracking-widest ml-1 font-bold"
                    >Category</label
                  >
                  <div class="relative">
                    <select
                      v-model="form.category_id"
                      class="w-full bg-[#1A1A1A] border border-white/10 p-5 rounded-2xl outline-none appearance-none focus:border-[#DB7C2E]"
                    >
                      <option v-for="c in categories" :key="c.id" :value="c.id">
                        {{ c.label }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div
                v-if="false"
                @click="form.is_available = !form.is_available"
                class="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all"
              >
                <div>
                  <span class="block text-sm font-bold">Available Now</span>
                  <span
                    class="text-[10px] text-white/30 uppercase tracking-widest"
                    >Show item to customers</span
                  >
                </div>
                <div
                  :class="
                    form.is_available
                      ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                      : 'bg-white/10'
                  "
                  class="w-14 h-7 rounded-full relative transition-all duration-300"
                >
                  <div
                    :class="
                      form.is_available ? 'translate-x-7' : 'translate-x-1'
                    "
                    class="absolute top-1 bg-white w-5 h-5 rounded-full transition-transform shadow-md"
                  ></div>
                </div>
              </div>
            </div>

            <button
              @click="handleSave"
              class="w-full mt-10 bg-[#DB7C2E] hover:bg-[#ff9d4d] text-black font-black py-5 rounded-2xl shadow-2xl transition-all active:scale-95 uppercase tracking-[0.2em] text-xs"
            >
              {{ isEditing ? "Save Updated Details" : "Add Item to Menu" }}
            </button>
          </div>
        </section>

        <!-- DISH LIST -->
        <section class="space-y-5">
          <div class="flex items-center gap-4 px-2 my-4">
            <div class="h-[1px] flex-1 bg-white/50"></div>
            <h2 class="text-[12px] font-black uppercase tracking-[0.3em] text-white/60 whitespace-nowrap">
              ያሉ የምግብ ዝርዝር
            </h2>
            <div class="h-[1px] flex-1 bg-white/50"></div>
          </div>
          <div class="grid gap-3">
            <div v-for="d in dishes" :key="d.id" class="bg-[#1A1A1A] p-3 rounded-[1.8rem] flex items-center gap-4 border border-white/5 hover:border-white/10 transition-all">
              <img :src="d.image_url" class="w-16 h-16 rounded-2xl object-cover bg-black shadow-inner" />
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-sm truncate leading-tight">{{ d.name }}</h3>
                <p class="text-[#DB7C2E] text-[10px] font-black tracking-widest mt-1">{{ d.price }} ETB</p>
              </div>
              <div class="flex gap-2 pr-1">
                <button @click="startEdit(d)" class="p-3 bg-white/5 rounded-xl hover:bg-[#DB7C2E] hover:text-black transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button @click="deleteDish(d.id)" class="p-3 bg-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
        </template>

        <!-- CATEGORIES TAB -->
        <template v-if="activeTab === 'categories'">
        <section class="space-y-5">
          <section class="bg-[#1A1A1A] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
            <div class="p-6 md:p-8 grid gap-5">
              <div class="space-y-2 w-1/2">
                <label class="text-[10px] text-white/30 uppercase tracking-widest ml-1 font-bold">Icon (emoji)</label>
                <input v-model="categoryForm.icon" type="text" placeholder="🍔" class="w-full bg-[#1A1A1A] border border-white/10 p-5 rounded-2xl outline-none focus:border-[#DB7C2E] text-white placeholder:text-white/20" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-[10px] text-white/30 uppercase tracking-widest ml-1 font-bold">English Label</label>
                  <input v-model="categoryForm.label" type="text" placeholder="Burgers" class="w-full bg-[#1A1A1A] border border-white/10 p-5 rounded-2xl outline-none focus:border-[#DB7C2E] text-white placeholder:text-white/20" />
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] text-white/30 uppercase tracking-widest ml-1 font-bold">Amharic Label</label>
                  <input v-model="categoryForm.label_am" type="text" placeholder="በርገር" class="w-full bg-[#1A1A1A] border border-white/10 p-5 rounded-2xl outline-none focus:border-[#DB7C2E] text-white placeholder:text-white/20" />
                </div>
              </div>
              <div class="space-y-2 w-1/2">
                <label class="text-[10px] text-white/30 uppercase tracking-widest ml-1 font-bold">Display Order</label>
                <input v-model.number="categoryForm.display_order" type="number" placeholder="1" class="w-full bg-[#1A1A1A] border border-white/10 p-5 rounded-2xl outline-none focus:border-[#DB7C2E] text-white" />
              </div>
              <div class="flex gap-3 mt-2">
                <button @click="saveCategory" class="flex-1 bg-[#DB7C2E] hover:bg-[#ff9d4d] text-black font-black py-4 rounded-2xl transition-all active:scale-95 uppercase tracking-[0.2em] text-xs">
                  {{ isEditingCategory ? "Update Category" : "Add Category" }}
                </button>
                <button v-if="isEditingCategory" @click="resetCategoryForm" class="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          </section>

          <div class="grid gap-3">
            <div v-for="c in categories" :key="c.id" class="bg-[#1A1A1A] p-4 rounded-[1.8rem] flex items-center gap-4 border border-white/5 hover:border-white/10 transition-all">
              <div class="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center text-2xl flex-shrink-0">{{ c.icon }}</div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-sm truncate leading-tight">{{ c.label }}</h3>
                <p class="text-white/30 text-[10px] tracking-widest mt-1">{{ c.label_am }}</p>
              </div>
              <div class="flex gap-2 pr-1">
                <button @click="startEditCategory(c)" class="p-3 bg-white/5 rounded-xl hover:bg-[#DB7C2E] hover:text-black transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button @click="deleteCategory(c.id)" class="p-3 bg-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
        </template>
      </main>
    </template>

    <!-- Login  -->
    <template v-else>
      <div
        class="max-w-2xl mx-auto flex items-center justify-center min-h-screen p-6"
      >
        <div
          class="w-full max-w-md bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-2"
        >
          <div class="text-center mb-10">
            <h1 class="text-3xl font-black text-[#DB7C2E] mb-2">THE PARK</h1>
            <p
              class="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold"
            >
              Authorized Access Only
            </p>
          </div>

          <div class="space-y-4">
            <input
              v-model="authEmail"
              type="email"
              placeholder="Admin Email"
              class="w-full bg-[#1A1A1A] border border-white/10 p-2 rounded-2xl outline-none focus:border-[#DB7C2E] text-white mb-2"
            />
            <input
              v-model="authPassword"
              type="password"
              placeholder="Password"
              class="w-full bg-[#1A1A1A] border border-white/10 p-2 rounded-2xl outline-none focus:border-[#DB7C2E] text-white"
            />
            <button
              @click="handleLogin"
              class="w-full bg-[#DB7C2E] text-black font-black p-3 rounded-2xl shadow-xl uppercase text-xs tracking-widest mt-4 active:scale-95 transition-all"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
