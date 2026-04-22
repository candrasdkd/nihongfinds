'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import sharp from 'sharp'

export async function createProduct(formData: FormData) {
    const supabase = await createClient()

    // 1. Ekstraksi Data Form
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const category_id = formData.get('category_id') as string
    const price_jpy = parseInt(formData.get('price_jpy') as string)
    const weight = parseInt(formData.get('weight') as string)
    const condition = formData.get('condition') as string

    const imageFiles = formData.getAll('images') as File[]
    const uploadedUrls: string[] = []

    // 2. Proses Kompresi & Upload
    for (const file of imageFiles) {
        if (file.size > 0) {
            try {
                const arrayBuffer = await file.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)

                // PROSES KOMPRESI DENGAN SHARP
                const compressedBuffer = await sharp(buffer)
                    .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true }) // Maksimal lebar/tinggi 1000px
                    .webp({ quality: 80 }) // Ubah ke WebP dengan kualitas 80%
                    .toBuffer()

                // Buat nama file unik
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`
                const filePath = `${fileName}`

                // Upload ke Supabase Storage (Bucket: product-images)
                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, compressedBuffer, {
                        contentType: 'image/webp',
                        upsert: true
                    })

                if (uploadError) {
                    console.error('Gagal upload:', uploadError.message)
                    continue
                }

                // Ambil URL Publik
                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath)

                uploadedUrls.push(publicUrl)
            } catch (err) {
                console.error('Error proses gambar:', err)
            }
        }
    }

    // 3. Simpan ke Database
    const { error } = await supabase.from('products').insert([
        {
            name,
            description,
            category_id,
            price_jpy,
            estimated_weight_gram: weight,
            condition,
            image_urls: uploadedUrls,
            is_active: true
        }
    ])

    if (error) {
        console.error('DB Error:', error.message)
        redirect(`/admin/products?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/')
    redirect('/admin/products?success=Produk berhasil diupload dengan gambar terkompresi!')
}