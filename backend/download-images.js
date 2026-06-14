const fs = require('fs');
const path = require('path');
const https = require('https');

const uploadsDir = path.join(__dirname, 'uploads');

// Unsplash image URLs that match product descriptions
const imageUrls = {
  'standing-fan.jpg': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'mountain-bike.jpg': 'https://images.unsplash.com/photo-1558618047-3d45e7f2b12a?w=400&q=80',
  'smart-watch.jpg': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
  'wireless-headphones.jpg': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
  'smart-tv.jpg': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80',
  'laptop-pro.jpg': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
  'led-bulbs.jpg': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80',
  'bluetooth-speaker.jpg': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
};

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(uploadsDir, filename);
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
};

const downloadAllImages = async () => {
  try {
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    console.log('📥 Downloading product images...\n');
    
    const promises = Object.entries(imageUrls).map(([filename, url]) =>
      downloadImage(url, filename)
        .catch(err => console.error(`❌ Failed to download ${filename}:`, err.message))
    );

    await Promise.all(promises);
    console.log('\n✨ All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
    process.exit(1);
  }
};

downloadAllImages();
