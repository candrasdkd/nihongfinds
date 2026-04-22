const NIHONG_FINDS_CONTEXT = {
    metadata: {
        name: "Nihong Finds",
        version: "2.3.1",
        founders: ["Candra Sidik Dermawan", "Diny Kumala Firdaus"],
        tech_stack: {
            frontend: "Next.js 16.2.4 (App Router)",
            backend: "Supabase (PostgreSQL)",
            storage: "Supabase Storage (Bucket: product-images)",
            payment: "Midtrans (QRIS only — DP & Pelunasan)",
            image_lib: "Sharp (Compression & Resizing)"
        }
    },
    database_schema: {
        profiles: {
            desc: "User profile linked to auth.users.",
            columns: ["id (FKey)", "full_name", "whatsapp_number", "address", "updated_at"]
        },
        categories: {
            desc: "Grouping product dinamis.",
            columns: ["id", "name", "slug", "updated_at"]
        },
        products: {
            desc: "Master data katalog jastip dengan manajemen stok.",
            columns: [
                "id", "name", "description", "price_jpy", "estimated_weight_gram",
                "stock_quantity", "is_active", "condition", "image_urls", "category_id", "updated_at"
            ]
        },
        orders: {
            desc: "Transaksi jastip dengan sistem DP, Pelunasan, dan Dual Tracking.",
            status_enum: ["WAITING_DP", "PURCHASED", "SHIPPED_TO_INDO", "SHIPPED_LOCAL", "COMPLETED"],
            columns: [
                "id", "user_id", "status", "total_amount", "dp_amount", "shipping_fee",
                "total_weight_gram", "exchange_rate", "midtrans_order_id_dp",
                "midtrans_order_id_pelunasan", "tracking_number_intl", "tracking_number_local",
                "courier_name", "updated_at"
            ]
        },
        order_items: {
            desc: "Detail item per transaksi.",
            columns: [
                "id", "order_id (FKey)", "product_id (FKey)",
                "item_name", "price_jpy", "quantity", "image_url", "source_url"
            ]
        },
        midtrans_webhook_logs: {
            desc: "Log raw payload Midtrans untuk idempotency check.",
            columns: [
                "id", "midtrans_order_id", "transaction_status", "fraud_status",
                "gross_amount", "raw_payload (JSONB)", "processed_at"
            ],
            constraints: ["UNIQUE (midtrans_order_id, transaction_status)"]
        }
    },
    db_functions: {
        checkout_order: {
            desc: "Atomic checkout: validasi stok + decrement + create order + insert order_items dalam satu transaction.",
            params: ["p_user_id", "p_items (JSONB)", "p_exchange_rate", "p_shipping_fee", "p_dp_amount"],
            returns: "JSONB { order_id, total_amount }"
        },
        process_midtrans_webhook: {
            desc: "Handle Midtrans QRIS webhook dengan idempotency. Hanya proses 'settlement' (QRIS). Update status order atau rollback stok via product_id jika payment gagal (deny/cancel/expire).",
            params: ["p_payload (JSONB)"],
            returns: "JSONB { status: 'processed' | 'skipped' }"
        },
        handle_new_user: {
            desc: "Trigger function: auto-insert ke profiles saat user baru register via auth.users.",
            params: [],
            returns: "TRIGGER"
        }
    },
    rls_policies: {
        categories: { SELECT: "public" },
        midtrans_webhook_logs: { ALL: "blocked — SECURITY DEFINER function only" },
        order_items: { SELECT: "owner only", INSERT: "authenticated + ownership check" },
        orders: { SELECT: "owner only", INSERT: "authenticated + ownership check", UPDATE: "authenticated + status immutable" },
        products: { SELECT: "public", INSERT: "admin only", UPDATE: "admin only" },
        profiles: { SELECT: "public", INSERT: "ownership check", UPDATE: "ownership check" }
    },
    business_rules: {
        logic_weight: "Order 'total_weight_gram' dihitung dari sum (product.weight * quantity).",
        logic_audit: "Setiap perubahan data (Update) akan otomatis memperbarui 'updated_at' via Trigger.",
        logic_payment: "Pembayaran hanya via QRIS (Midtrans). Split payment: Order ID DP suffix '-DP', Pelunasan suffix '-PELUNASAN'. Webhook hanya proses transaction_status = 'settlement'.",
        logic_images: "Multi-upload di Admin dikompres ke WebP 80% kualitas, max width/height 1000px.",
        logic_stock: "Decrement stok atomically via checkout_order() dengan FOR UPDATE lock. Concurrent order tidak bisa oversell. Stok di-rollback via product_id jika payment gagal.",
        logic_webhook: "Midtrans QRIS webhook diproses via process_midtrans_webhook(). Duplikat notif di-skip via ON CONFLICT DO NOTHING pada midtrans_webhook_logs."
    },
    security_and_roles: {
        admin_auth: "RBAC via auth.users user_metadata { role: 'admin' }. Dicek via auth.jwt() -> 'user_metadata' ->> 'role'.",
        rls_storage: "Bucket 'product-images': Public Read | Admin-only Insert/Delete."
    }
};

export default NIHONG_FINDS_CONTEXT;