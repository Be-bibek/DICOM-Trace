const https = require('https');
const fs = require('fs');
const path = require('path');

const url = "https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_17.ptau";
const dest = path.join(__dirname, 'build', 'pot17_final.ptau');

console.log(`Downloading ${url} to ${dest}...`);

const file = fs.createWriteStream(dest);

https.get(url, (response) => {
    if (response.statusCode !== 200) {
        console.error(`Failed with status: ${response.statusCode}`);
        process.exit(1);
    }
    
    const total = parseInt(response.headers['content-length'], 10);
    let downloaded = 0;
    
    response.on('data', (chunk) => {
        downloaded += chunk.length;
        const pct = ((downloaded / total) * 100).toFixed(1);
        process.stdout.write(`\rProgress: ${pct}% (${downloaded}/${total} bytes)`);
    });
    
    response.pipe(file);
    
    file.on('finish', () => {
        file.close();
        console.log('\nDownload complete.');
    });
}).on('error', (err) => {
    fs.unlink(dest, () => {});
    console.error(`Error: ${err.message}`);
    process.exit(1);
});
