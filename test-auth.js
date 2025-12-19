const bcrypt = require("bcryptjs");

// Lire les variables d'environnement
require("dotenv").config({ path: ".env.local" });

const username = "admin";
const password = "admin123";

console.log("=== Test Authentification ===");
console.log("Username testé:", username);
console.log("Password testé:", password);
console.log("\nVariables d'environnement:");
console.log("ADMIN_USERNAME:", process.env.ADMIN_USERNAME);
console.log("ADMIN_PASSWORD_HASH:", process.env.ADMIN_PASSWORD_HASH);

// Test de comparaison
bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH).then((result) => {
  console.log("\n✅ Résultat du test bcrypt.compare:", result);

  if (result) {
    console.log("✅ Le mot de passe est correct !");
  } else {
    console.log("❌ Le mot de passe ne correspond pas au hash");

    // Générer un nouveau hash
    bcrypt.hash(password, 10).then((newHash) => {
      console.log('\nNouveau hash généré pour "admin123":');
      console.log(newHash);
    });
  }
});
