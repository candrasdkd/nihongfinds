// =============================================================================
// NIHONG FINDS — Master Context v3.2.0
// Aligned: Backend schema ↔ Frontend routing ↔ Business logic
// Changelog v3.2.0:
//   - order_status enum aligned ke DB: PROCESS_IN_JAPAN, SHIPPING_TO_ID, WAITING_PELUNASAN
//   - Payment & tracking logic trigger diupdate sesuai enum baru
//   - products.condition: TEXT + CHECK ('NEW'|'USED'), bukan enum
//   - products.image_url (singular) dihapus — hanya image_urls (array)
//   - orders.notes dihapus — diganti customer_notes (migrasi data selesai)
//   - NEW TABLE: settings (exchange_rate + config global)
//   - Status badge & admin flow diupdate sesuai enum baru
// =============================================================================

export const NIHONG_FINDS_BACKEND_CONTEXT = {
    metadata: {
        name: "Nihong Finds",
        version: "3.2.0",
        founders: ["Candra Sidik Dermawan", "Diny Kumala Firdaus"],
        tech_stack: {
            frontend: "Next.js 16.2.4 (App Router)",
            backend: "Supabase (PostgreSQL + RLS)",
            storage: "Supabase Storage (Bucket: product-images)",
            payment: "Midtrans (QRIS only — DP & Pelunasan)",
            image_lib: "Sharp (Compression & Resizing)",
            auth: "Supabase SSR Auth + middleware.ts",
            notification: "Fonnte (WA Gateway) + Supabase Realtime",
        },
    },

    // ---------------------------------------------------------------------------
    // DATABASE SCHEMA
    // ---------------------------------------------------------------------------
    database_schema: {
        profiles: {
            desc: "User profile linked to auth.users. Auto-created via handle_new_user() trigger.",
            columns: ["id (uuid, PK, FKey → auth.users)", "full_name", "whatsapp_number", "address", "created_at", "updated_at"],
            rls: { SELECT: "public", INSERT: "ownership check", UPDATE: "ownership check" },
            frontend_routes: ["/profile", "/admin/users"],
        },
        categories: {
            desc: "Grouping produk dinamis. Dipakai di navbar dan filter.",
            columns: ["id (uuid, PK)", "name", "slug", "created_at", "updated_at"],
            rls: { SELECT: "public" },
            frontend_routes: ["/", "/categories/[slug]", "/admin/categories"],
        },
        products: {
            desc: "Master data katalog jastip dengan manajemen stok.",
            columns: [
                "id (uuid, PK)",
                "name (text, NOT NULL)",
                "description (text, nullable)",
                "price_jpy (int, NOT NULL)",
                "estimated_weight_gram (int, nullable)",
                "stock_quantity (int, default 0)",
                "is_active (boolean, default true)",
                "condition (text, CHECK: 'NEW'|'USED', default 'NEW')", // TEXT + CHECK, bukan enum
                "image_urls (text[], default '{}')",                     // singular image_url sudah dihapus
                "category_id (uuid, FK → categories, nullable)",
                "created_at", "updated_at",
            ],
            rls: { SELECT: "public", INSERT: "admin only", UPDATE: "admin only" },
            frontend_routes: ["/", "/categories/[slug]", "/product/[id]", "/admin/products", "/admin/products/new", "/admin/products/[id]/edit"],
        },
        orders: {
            desc: "Transaksi jastip. Dual payment tracking (DP & Pelunasan). Dual shipment tracking (intl & lokal). Snapshot alamat & catatan customer saat checkout.",
            status_enum: {
                values: ["WAITING_DP", "PROCESS_IN_JAPAN", "SHIPPING_TO_ID", "WAITING_PELUNASAN", "COMPLETED"],
                flow: "WAITING_DP → PROCESS_IN_JAPAN → SHIPPING_TO_ID → WAITING_PELUNASAN → COMPLETED",
                desc: {
                    WAITING_DP: "Order dibuat, menunggu pembayaran DP",
                    PROCESS_IN_JAPAN: "DP settle, barang sedang diproses/dibeli di Jepang",
                    SHIPPING_TO_ID: "Barang dikirim dari Jepang ke Indonesia",
                    WAITING_PELUNASAN: "Barang sudah sampai Indo, menunggu pelunasan customer",
                    COMPLETED: "Pelunasan settle, barang dikirim ke customer",
                },
            },
            columns: [
                "id (uuid, PK)",
                "user_id (uuid, NOT NULL, FK → profiles)",
                "status (order_status enum, default 'WAITING_DP')",
                "total_amount (int, NOT NULL, IDR)",
                "dp_amount (int, NOT NULL, IDR)",
                "shipping_fee (int, default 0, IDR)",
                "total_weight_gram (int, default 0)",
                "exchange_rate (numeric, nullable — snapshot JPY→IDR saat transaksi)",
                "shipping_address (text, nullable — SNAPSHOT dari profiles.address saat checkout)",
                "customer_notes (text, nullable — instruksi khusus dari customer)",
                "midtrans_order_id_dp (text, nullable, unique, suffix: -DP)",
                "midtrans_order_id_pelunasan (text, nullable, unique, suffix: -PELUNASAN)",
                "tracking_number_intl (text, nullable)",
                "tracking_number_local (text, nullable)",
                "courier_name (text, nullable)",
                "created_at", "updated_at",
            ],
            rls: {
                SELECT: "owner only (user_id = auth.uid())",
                INSERT: "authenticated + ownership check",
                UPDATE: "authenticated + status immutable via CHECK constraint",
            },
            frontend_routes: ["/orders", "/orders/[id]", "/admin/orders", "/admin/orders/[id]"],
        },
        order_items: {
            desc: "Snapshot item per transaksi. item_name & image_url di-snapshot saat checkout agar tidak berubah jika produk diedit.",
            columns: [
                "id (uuid, PK)",
                "order_id (uuid, nullable, FK → orders)",
                "product_id (uuid, nullable, FK → products — nullable saat produk dihapus)",
                "source_url (text, NOT NULL)",
                "item_name (text, NOT NULL, snapshot)",
                "price_jpy (int, NOT NULL, snapshot)",
                "quantity (int, default 1)",
                "image_url (text, nullable, snapshot dari image_urls[0])",
                "updated_at",
            ],
            rls: {
                SELECT: "owner only via orders join",
                INSERT: "authenticated + ownership check",
            },
            frontend_routes: ["/orders/[id]", "/admin/orders/[id]"],
        },
        order_status_logs: {
            desc: "Audit trail setiap perubahan status order. Di-insert oleh updateOrderStatusAction() setiap kali admin update status.",
            columns: [
                "id (uuid, PK)",
                "order_id (uuid, NOT NULL, FK → orders ON DELETE CASCADE)",
                "old_status (order_status, nullable — null jika log pertama)",
                "new_status (order_status, NOT NULL)",
                "changed_by (uuid, nullable, FK → profiles ON DELETE SET NULL)",
                "note (text, nullable)",
                "created_at (timestamptz, NOT NULL, default now())",
            ],
            indexes: ["idx_order_status_logs_order_id ON (order_id, created_at DESC)"],
            rls: {
                SELECT: "owner only via orders join (customer lihat history order miliknya)",
                ALL: "admin full access",
            },
            frontend_routes: ["/orders/[id]", "/admin/orders/[id]"],
        },
        wa_notification_logs: {
            desc: "Audit log WA notifikasi yang dikirim via Fonnte. Untuk monitoring & avoid duplicate send.",
            columns: [
                "id (uuid, PK)",
                "order_id (uuid, nullable, FK → orders ON DELETE SET NULL)",
                "recipient (text, NOT NULL — nomor WA tujuan)",
                "type (text, NOT NULL — 'new_order_admin' | 'status_update_customer')",
                "message (text, NOT NULL)",
                "status (text, NOT NULL, default 'pending' — 'pending' | 'sent' | 'failed')",
                "sent_at (timestamptz, nullable)",
                "created_at (timestamptz, NOT NULL, default now())",
            ],
            rls: { ALL: "admin full access" },
            frontend_routes: ["/admin/notifications"],
        },
        midtrans_webhook_logs: {
            desc: "Log raw payload Midtrans untuk idempotency check. Tidak bisa diakses langsung — hanya via SECURITY DEFINER function.",
            columns: [
                "id (uuid, PK)",
                "midtrans_order_id (text, NOT NULL)",
                "transaction_status (text, NOT NULL)",
                "fraud_status (text, nullable)",
                "gross_amount (numeric, nullable)",
                "raw_payload (jsonb, NOT NULL)",
                "processed_at (timestamptz, default now())",
            ],
            constraints: ["UNIQUE (midtrans_order_id, transaction_status)"],
            rls: { ALL: "blocked — SECURITY DEFINER function only" },
            frontend_routes: ["/admin/payments"],
        },
        settings: {
            desc: "Config global app. Key-value store. Saat ini dipakai untuk exchange_rate aktif.",
            columns: [
                "key (text, PK)",
                "value (text, NOT NULL)",
                "updated_at (timestamptz, NOT NULL, default now())",
            ],
            seed: { exchange_rate: "105" },
            rls: { ALL: "admin full access" },
            frontend_routes: ["/admin/settings"],
            note: "exchange_rate di-snapshot ke orders.exchange_rate saat checkout. Perubahan tidak retroaktif.",
        },
    },

    // ---------------------------------------------------------------------------
    // DB FUNCTIONS
    // ---------------------------------------------------------------------------
    db_functions: {
        checkout_order: {
            desc: "Atomic checkout: validasi stok + decrement + create order + insert order_items dalam satu transaction.",
            params: [
                "p_user_id (uuid)",
                "p_items (jsonb: [{product_id, quantity}])",
                "p_exchange_rate (numeric)",
                "p_shipping_fee (int)",
                "p_dp_amount (int)",
                "p_shipping_address (text)",
                "p_customer_notes (text)",
            ],
            returns: "jsonb { order_id, total_amount }",
            caller: "Server Action: checkoutAction() di app/cart/actions.ts",
            error_cases: ["insufficient_stock", "product_not_found", "product_inactive"],
        },
        process_midtrans_webhook: {
            desc: "Handle Midtrans QRIS webhook dengan idempotency. Hanya proses 'settlement'. Update status order atau rollback stok jika payment gagal.",
            params: ["p_payload (jsonb)"],
            returns: "jsonb { status: 'processed' | 'skipped' }",
            caller: "API Route: POST /api/webhook/midtrans",
            idempotency: "ON CONFLICT DO NOTHING pada midtrans_webhook_logs",
            on_dp_settlement: "UPDATE orders SET status = 'PROCESS_IN_JAPAN'",
            on_pelunasan_settlement: "UPDATE orders SET status = 'COMPLETED'",
        },
        handle_new_user: {
            desc: "Trigger function: auto-insert ke profiles saat user baru register via auth.users.",
            returns: "TRIGGER",
            trigger_on: "AFTER INSERT ON auth.users",
        },
    },

    // ---------------------------------------------------------------------------
    // BUSINESS RULES
    // ---------------------------------------------------------------------------
    business_rules: {
        payment: {
            flow: [
                "1. Customer checkout → status: WAITING_DP",
                "2. DP settle (Midtrans webhook) → status: PROCESS_IN_JAPAN",
                "3. Admin proses & kirim dari Jepang → status: SHIPPING_TO_ID",
                "4. Barang sampai Indo → status: WAITING_PELUNASAN → tampil tombol pelunasan",
                "5. Pelunasan settle → status: COMPLETED",
            ],
            order_id_dp: "Format: {order_id}-DP",
            order_id_pelunasan: "Format: {order_id}-PELUNASAN",
            trigger_dp_button: "status === 'WAITING_DP'",
            trigger_pelunasan_button: "status === 'WAITING_PELUNASAN'",
            method: "QRIS only via Midtrans Snap",
            webhook_filter: "Hanya proses transaction_status === 'settlement'",
        },
        stock: {
            decrement: "Atomic via checkout_order() dengan FOR UPDATE lock. Concurrent order tidak bisa oversell.",
            rollback: "Stok di-rollback via product_id jika payment gagal (deny/cancel/expire) dalam process_midtrans_webhook().",
            display: "Tampilkan badge 'Habis' jika stock_quantity === 0. Disable add-to-cart.",
        },
        exchange_rate: {
            management: "Di-set admin via /admin/settings → UPDATE settings WHERE key='exchange_rate'.",
            usage: "price_idr = price_jpy × exchange_rate. Ditampilkan di ProductCard, product detail, dan cart.",
            snapshot: "Disimpan ke orders.exchange_rate saat checkout_order() dipanggil. Tidak retroaktif.",
        },
        weight: {
            calculation: "total_weight_gram = SUM(product.estimated_weight_gram × quantity) per order.",
            usage: "Dasar perhitungan shipping_fee.",
        },
        images: {
            upload: "Multi-upload di admin. Dikompres via Sharp → WebP 80% quality, max 1000×1000px.",
            storage: "Supabase bucket 'product-images'. Public Read | Admin-only Insert/Delete.",
            display: "Next/Image untuk semua render gambar. image_urls[0] sebagai thumbnail.",
            snapshot: "order_items.image_url di-snapshot dari image_urls[0] saat checkout.",
        },
        shipping_address: {
            snapshot: "Di-snapshot dari profiles.address saat checkoutAction() dipanggil. Perubahan alamat di profil tidak mempengaruhi order yang sudah ada.",
            display: "Tampil di /orders/[id] (customer) dan /admin/orders/[id] (admin).",
        },
        notifications: {
            channel: "WhatsApp via Fonnte + Supabase Realtime untuk admin dashboard.",
            wa_new_order: "Trigger: setelah checkoutAction() sukses → kirim WA ke ADMIN_WA_NUMBER.",
            wa_status_update: "Trigger: setelah updateOrderStatusAction() sukses → kirim WA ke customer.",
            wa_messages: {
                new_order: "🛍️ *Order Baru!*\n#${order_id}\nCustomer: ${full_name}\nTotal: Rp ${total_amount}",
                PROCESS_IN_JAPAN: "✅ Pesanan kamu sudah dibeli dan sedang diproses di Jepang!\nOrder #${order_id}",
                SHIPPING_TO_ID: "✈️ Pesanan kamu sedang dikirim ke Indonesia!\nOrder #${order_id}",
                WAITING_PELUNASAN: "📦 Pesanan kamu sudah sampai di Indonesia! Silakan lakukan pelunasan.\nOrder #${order_id}",
                COMPLETED: "🎉 Pesanan kamu sudah selesai dan dalam perjalanan ke alamatmu!\nOrder #${order_id}",
            },
            realtime: "AdminOrdersRealtime subscribe ke INSERT event table orders. Live badge di admin dashboard.",
            audit: "Setiap WA yang dikirim di-log ke wa_notification_logs.",
        },
        audit: "Setiap UPDATE otomatis memperbarui updated_at via DB trigger.",
    },

    // ---------------------------------------------------------------------------
    // SECURITY
    // ---------------------------------------------------------------------------
    security: {
        admin_check: "RBAC via auth.jwt() -> user_metadata ->> 'role' === 'admin'. Dicek di middleware.ts untuk /admin/* routes.",
        rls_storage: "Bucket 'product-images': Public Read | Admin-only Insert/Delete.",
        webhook_security: "Midtrans signature key verification di /api/webhook/midtrans sebelum memanggil process_midtrans_webhook().",
        fonnte_token: "FONNTE_TOKEN disimpan di .env (server-only). Tidak pernah expose ke client.",
    },

    // ---------------------------------------------------------------------------
    // ENV VARIABLES
    // ---------------------------------------------------------------------------
    env_variables: {
        FONNTE_TOKEN: "Token API Fonnte untuk kirim WA",
        ADMIN_WA_NUMBER: "Nomor WA admin format: 628xxxxxxxxxx (tanpa +)",
    },
};

// =============================================================================
// FRONTEND CONTEXT
// =============================================================================
export const NIHONG_FINDS_FRONTEND_CONTEXT = {
    metadata: {
        framework: "Next.js 16.2.4 (App Router)",
        styling: "Tailwind CSS + Custom Utilities",
        icons: "Lucide React",
        fonts: "Geist Sans (next/font/google)",
    },

    // ---------------------------------------------------------------------------
    // ROUTING
    // ---------------------------------------------------------------------------
    routing: {
        public: {
            "/": {
                desc: "Homepage / catalog",
                data: ["products (is_active=true)", "categories", "settings (exchange_rate)"],
                components: ["ProductCard", "CategoryFilter"],
                render: "RSC",
            },
            "/categories/[slug]": {
                desc: "Filter produk per kategori",
                data: ["categories WHERE slug=?", "products WHERE category_id=? AND is_active=true", "settings (exchange_rate)"],
                components: ["ProductCard", "Badge (condition, stock)"],
                render: "RSC",
            },
            "/product/[id]": {
                desc: "Detail produk",
                data: ["products WHERE id=?", "categories", "settings (exchange_rate)"],
                components: ["ProductImageGallery", "Badge (condition, stock)", "AddToCartButton"],
                render: "RSC + Client (AddToCartButton)",
            },
            "/login": { desc: "Login", render: "RSC + Server Action" },
            "/register": { desc: "Register → trigger handle_new_user()", render: "RSC + Server Action" },
        },

        protected: {
            middleware_check: "middleware.ts → redirect ke /login jika no session",
            "/profile": {
                desc: "Edit profil user",
                data: ["profiles WHERE id = auth.uid()"],
                components: ["ProfileForm"],
                mutations: ["updateProfileAction() → UPDATE profiles"],
                render: "RSC + Client",
            },
            "/cart": {
                desc: "Review cart + konfirmasi alamat + trigger checkout",
                data: ["cart items dari localStorage", "products (validasi stok terkini)", "settings (exchange_rate)", "profiles (shipping_address prefill)"],
                components: ["CartItem", "CartSummary", "AddressConfirmation", "CustomerNotesInput", "CheckoutButton"],
                mutations: ["checkoutAction() → checkout_order() DB function"],
                render: "Client Component",
                on_success: "redirect → /orders/[id]",
                on_error: "tampilkan pesan insufficient_stock / product_inactive",
            },
            "/orders": {
                desc: "Daftar order user",
                data: ["orders WHERE user_id = auth.uid() ORDER BY updated_at DESC"],
                components: ["OrderCard", "Badge (status enum)"],
                render: "RSC",
            },
            "/orders/[id]": {
                desc: "Detail order + payment gateway + status history",
                data: [
                    "orders WHERE id=? AND user_id=auth.uid()",
                    "order_items WHERE order_id=?",
                    "order_status_logs WHERE order_id=? ORDER BY created_at ASC",
                ],
                components: ["OrderDetail", "OrderItemList", "PaymentButton", "TrackingInfo", "StatusTimeline"],
                render: "RSC + Client (PaymentButton)",
                payment_logic: {
                    show_dp_button: "status === 'WAITING_DP'",
                    show_pelunasan_button: "status === 'WAITING_PELUNASAN'",
                    midtrans_dp: "{order_id}-DP",
                    midtrans_pelunasan: "{order_id}-PELUNASAN",
                },
                tracking_logic: {
                    show_intl: "status === 'SHIPPING_TO_ID' || 'WAITING_PELUNASAN' || 'COMPLETED'",
                    show_local: "status === 'COMPLETED'",
                },
                display: {
                    shipping_address: "Dari orders.shipping_address (snapshot, bukan profiles)",
                    customer_notes: "Tampil jika tidak null",
                    status_timeline: "Render order_status_logs sebagai timeline vertikal",
                },
            },
        },

        admin: {
            middleware_check: "middleware.ts → cek auth.jwt() user_metadata.role === 'admin'",
            "/admin": {
                desc: "Dashboard overview + live order notification badge",
                components: ["AdminOrdersRealtime"],
                render: "RSC + Client (AdminOrdersRealtime)",
            },
            "/admin/products": {
                desc: "List semua produk",
                data: ["products LEFT JOIN categories"],
                components: ["AdminProductTable", "Badge (is_active, stock, condition)"],
                render: "RSC",
            },
            "/admin/products/new": {
                desc: "Tambah produk baru",
                mutations: ["createProductAction()", "uploadProductImagesAction() → Sharp → Supabase Storage"],
                components: ["ProductForm", "MultiImageUpload"],
                render: "Client",
            },
            "/admin/products/[id]/edit": {
                desc: "Edit produk",
                data: ["products WHERE id=?"],
                mutations: ["updateProductAction()", "deleteProductImageAction()"],
                components: ["ProductForm", "MultiImageUpload"],
                render: "Client",
            },
            "/admin/categories": {
                desc: "CRUD kategori",
                mutations: ["createCategoryAction()", "updateCategoryAction()", "deleteCategoryAction()"],
                render: "RSC + Client",
            },
            "/admin/orders": {
                desc: "List semua order",
                data: ["orders JOIN profiles (full_name, whatsapp_number) ORDER BY updated_at DESC"],
                components: ["AdminOrderTable", "Badge (status)"],
                render: "RSC",
            },
            "/admin/orders/[id]": {
                desc: "Detail order + update status + input tracking",
                data: [
                    "orders WHERE id=?",
                    "order_items WHERE order_id=?",
                    "profiles WHERE id=orders.user_id",
                    "order_status_logs WHERE order_id=?",
                ],
                mutations: [
                    "updateOrderStatusAction() → UPDATE orders.status + INSERT order_status_logs + kirim WA customer",
                    "updateTrackingAction() → UPDATE tracking_number_intl / tracking_number_local / courier_name",
                ],
                status_flow: "WAITING_DP → PROCESS_IN_JAPAN → SHIPPING_TO_ID → WAITING_PELUNASAN → COMPLETED",
                display: {
                    shipping_address: "orders.shipping_address",
                    customer_notes: "orders.customer_notes",
                    status_timeline: "order_status_logs sebagai audit trail",
                },
                render: "RSC + Client",
            },
            "/admin/payments": {
                desc: "Monitor webhook logs Midtrans. Read-only.",
                data: ["midtrans_webhook_logs ORDER BY processed_at DESC"],
                render: "RSC",
            },
            "/admin/notifications": {
                desc: "Monitor WA notification logs. Read-only.",
                data: ["wa_notification_logs ORDER BY created_at DESC"],
                render: "RSC",
            },
            "/admin/settings": {
                desc: "Konfigurasi global: exchange_rate aktif",
                data: ["settings WHERE key='exchange_rate'"],
                mutations: ["updateExchangeRateAction() → UPDATE settings SET value=? WHERE key='exchange_rate'"],
                render: "Client",
            },
        },

        api: {
            "/api/webhook/midtrans": {
                desc: "Endpoint POST untuk Midtrans QRIS notification",
                method: "POST",
                auth: "Midtrans signature key verification (SHA-512)",
                flow: "verify signature → call process_midtrans_webhook(p_payload) → return 200",
            },
            "/auth/callback": { method: "GET", flow: "exchange code → set session → redirect ke /" },
            "/auth/signout": { method: "POST", flow: "clear session → redirect ke /login" },
        },
    },

    // ---------------------------------------------------------------------------
    // SERVER ACTIONS
    // ---------------------------------------------------------------------------
    server_actions: {
        "app/cart/actions.ts": {
            checkoutAction: {
                input: "CartItem[], exchange_rate, shipping_fee, dp_amount, shipping_address, customer_notes",
                calls: "checkout_order(p_user_id, p_items, p_exchange_rate, p_shipping_fee, p_dp_amount, p_shipping_address, p_customer_notes)",
                post_success: [
                    "redirect('/orders/{order_id}')",
                    "sendWA(ADMIN_WA_NUMBER, new_order_message) → log ke wa_notification_logs",
                ],
                on_error: "return { error: 'insufficient_stock' | 'product_inactive' }",
            },
        },
        "app/profile/actions.ts": {
            updateProfileAction: {
                input: "full_name, whatsapp_number, address",
                calls: "UPDATE profiles WHERE id = auth.uid()",
            },
        },
        "app/admin/products/actions.ts": {
            createProductAction: { calls: "INSERT products" },
            updateProductAction: { calls: "UPDATE products WHERE id=?" },
            toggleProductActiveAction: { calls: "UPDATE products SET is_active=? WHERE id=?" },
            uploadProductImagesAction: {
                desc: "Sharp compress → WebP 80% max 1000px → upload ke Supabase Storage",
                calls: "supabase.storage.from('product-images').upload()",
                returns: "image_urls[] untuk disimpan ke products.image_urls",
            },
            deleteProductImageAction: { calls: "supabase.storage.from('product-images').remove([path])" },
        },
        "app/admin/orders/actions.ts": {
            updateOrderStatusAction: {
                input: "order_id, new_status, note?",
                calls: [
                    "UPDATE orders SET status=? WHERE id=?",
                    "INSERT order_status_logs (order_id, old_status, new_status, changed_by, note)",
                    "sendWA(customer_whatsapp, status_message) → log ke wa_notification_logs",
                ],
                guard: "Validasi status transition: WAITING_DP → PROCESS_IN_JAPAN → SHIPPING_TO_ID → WAITING_PELUNASAN → COMPLETED",
            },
            updateTrackingAction: {
                input: "order_id, tracking_number_intl?, tracking_number_local?, courier_name?",
                calls: "UPDATE orders SET tracking_number_intl=?, tracking_number_local=?, courier_name=? WHERE id=?",
            },
        },
        "app/admin/settings/actions.ts": {
            updateExchangeRateAction: {
                input: "exchange_rate (numeric)",
                calls: "UPDATE settings SET value=? WHERE key='exchange_rate'",
                note: "Tidak retroaktif ke order yang sudah ada.",
            },
        },
    },

    // ---------------------------------------------------------------------------
    // COMPONENTS
    // ---------------------------------------------------------------------------
    components: {
        layout: {
            Navbar: "RSC wrapper → pass user data ke NavbarClient",
            NavbarClient: "Client: responsive menu, scroll detection, login state, cart item count",
            Footer: "Static RSC",
        },
        product: {
            ProductCard: "Tampil: image_urls[0], name, price_jpy × exchange_rate (IDR), stock badge, condition badge",
            ProductImageGallery: "Main image + thumbnails dari image_urls[]. Client component.",
            AddToCartButton: "Client. Tambah ke cart (localStorage). Disable jika stock_quantity === 0.",
        },
        cart: {
            CartItem: "Snapshot: item_name, price_jpy, quantity, image_url. Quantity adjuster.",
            CartSummary: "total_weight_gram, shipping_fee, total_amount IDR, dp_amount.",
            AddressConfirmation: "Prefill dari profiles.address. Editable sebelum checkout.",
            CustomerNotesInput: "Textarea opsional untuk instruksi khusus customer.",
            CheckoutButton: "Trigger checkoutAction(). Loading state saat proses.",
        },
        order: {
            OrderCard: "Ringkasan: id, status badge, total_amount, updated_at.",
            OrderDetail: "Full info: items, amounts, tracking, payment buttons, shipping_address, customer_notes.",
            OrderItemList: "Snapshot: item_name, price_jpy, qty, image_url.",
            PaymentButton: "Client. Midtrans Snap. Kondisional DP (WAITING_DP) vs Pelunasan (WAITING_PELUNASAN).",
            TrackingInfo: "Kondisional per status: intl ab SHIPPING_TO_ID, local ab COMPLETED.",
            StatusTimeline: "Render order_status_logs sebagai timeline vertikal. RSC.",
        },
        admin: {
            AdminProductTable: "Sortable: name, category, price_jpy, stock, is_active toggle, actions.",
            AdminOrderTable: "Sortable: id, user (full_name), status, total_amount, updated_at.",
            AdminOrdersRealtime: "Client. Supabase Realtime INSERT event table orders. Live badge di dashboard.",
            MultiImageUpload: "Drag & drop. Preview. Delete per image. Maintain urutan image_urls[].",
            ProductForm: "Semua fields + MultiImageUpload + category select.",
            ProfileForm: "full_name, whatsapp_number, address.",
            StatusBadge: {
                WAITING_DP: "gray",
                PROCESS_IN_JAPAN: "blue",
                SHIPPING_TO_ID: "yellow",
                WAITING_PELUNASAN: "orange",
                COMPLETED: "green",
            },
        },
        ui: {
            Modal: "Reusable dialog dengan backdrop + animasi Tailwind.",
            Badge: "Variant: condition (NEW/USED), stock (tersedia/habis), order status.",
        },
    },

    // ---------------------------------------------------------------------------
    // LIB HELPERS
    // ---------------------------------------------------------------------------
    lib: {
        "lib/fonnte.ts": {
            desc: "Helper kirim WA via Fonnte API. Server-only.",
            exports: ["sendWA(to: string, message: string): Promise<{status: 'sent'|'failed'}>"],
            env: "FONNTE_TOKEN",
        },
    },

    // ---------------------------------------------------------------------------
    // DESIGN SYSTEM
    // ---------------------------------------------------------------------------
    design: {
        approach: "Mobile-first. Tailwind sm: md: lg: breakpoints.",
        theme: "CSS variables di globals.css (--background, --foreground, --primary, dll).",
        feel: "Modern, clean, premium. Shadow lembut, border halus, hover transitions.",
    },

    // ---------------------------------------------------------------------------
    // FRONTEND RULES
    // ---------------------------------------------------------------------------
    rules: [
        "'use client' hanya untuk: onClick, useState, useEffect, Midtrans Snap, Supabase Realtime.",
        "Semua mutations via Server Actions (actions.ts), bukan fetch ke API routes.",
        "Gunakan Next/Image untuk semua render gambar.",
        "Validasi form: Zod client-side sebelum kirim ke Server Action.",
        "Cart state: localStorage. Di-clear setelah checkoutAction() sukses.",
        "exchange_rate selalu diambil dari settings table saat render RSC, bukan hardcode.",
        "Midtrans Snap script di-load lazy hanya di /orders/[id].",
        "Status order read-only di user-facing pages. Update hanya dari admin.",
        "shipping_address di-snapshot dari profiles.address saat checkoutAction(). Tidak re-fetch dari profiles.",
        "sendWA() hanya dari Server Action (server-only). FONNTE_TOKEN tidak boleh expose ke client.",
        "AdminOrdersRealtime subscribe Realtime hanya di /admin. Unsubscribe on unmount.",
        "products.condition value selalu uppercase: 'NEW' | 'USED'.",
    ],
};