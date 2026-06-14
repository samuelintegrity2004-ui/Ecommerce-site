# Setting Up Local Product Images

This guide explains how to set up local image hosting for your e-commerce site.

## What Changed

✅ **Backend** (`backend/server.js`):
- Added static file serving for `/uploads` folder
- Products now serve images from `http://localhost:5000/uploads/filename.jpg`

✅ **Database** (`backend/seed.js`):
- Created seed script with 8 sample products
- All products point to local image URLs

✅ **Frontend** (`frontend/src/components/ProductSlider.jsx`):
- Updated mock data to use local image paths

## Setup Instructions

### Step 1: Download Sample Images

Run this command in the `backend/` folder:

```bash
npm run download-images
```

This downloads 8 product images from Unsplash and saves them to `backend/uploads/`.

### Step 2: Seed the Database

With MongoDB running, execute:

```bash
npm run seed
```

This populates your database with 8 sample products with proper image URLs.

### Step 3: Restart Backend Server

```bash
npm run dev
```

The server will now serve images from the local `uploads/` folder.

## Image File Names

Images are stored as:
- `standing-fan.jpg` (45x45px placeholder)
- `mountain-bike.jpg`
- `smart-watch.jpg`
- `wireless-headphones.jpg`
- `smart-tv.jpg`
- `laptop-pro.jpg`
- `led-bulbs.jpg`
- `bluetooth-speaker.jpg`

## Adding Your Own Images

To add custom images:

1. **Add image file** to `backend/uploads/` folder (supports: jpg, png, webp)
2. **Update product in database** with URL: `/uploads/your-image.jpg`
3. **Restart server** for changes to take effect

## API Response Example

Products from the API now return image URLs like:

```json
{
  "_id": "1",
  "name": "Standing Fan",
  "image": "/uploads/standing-fan.jpg",
  "price": 45.99
}
```

Frontend can access these at: `http://localhost:5000/uploads/standing-fan.jpg`

## Troubleshooting

❌ **Images still not showing?**
- Ensure `backend/uploads/` folder exists
- Check that `download-images` script completed successfully
- Verify backend server is running on `http://localhost:5000`
- Open browser console (F12) to check for 404 errors

❌ **Download script failed?**
- Check internet connection (needs to download from Unsplash)
- Manually add images to `backend/uploads/` folder
- Use images from any source, rename to match expected filenames

❌ **Products not in database?**
- Ensure MongoDB is running
- Check `.env` file has `MONGO_URI` set correctly
- Run `npm run seed` again

## Database Backup

To clear and reseed products:

```bash
npm run seed    # Clears old products, adds new ones
```

## Production Notes

For production deployment:
- Store images in cloud storage (AWS S3, Cloudinary, etc.)
- Update image URLs in database to point to CDN
- Use `backend/uploads/` for local development only
