const fs = require("fs");
fs.writeFileSync("android/app/google-services.json", process.env.GOOGLE_SERVICES_JSON);
console.log("✅ google-services.json written from env!");
