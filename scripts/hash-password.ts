import { hash } from 'bcryptjs';

async function hashPassword(password: string) {
  const hashed = await hash(password, 10);
  console.log('Password hash:');
  console.log(hashed);
  console.log('\nAdd this to your .env file as ADMIN_PASSWORD_HASH');
}

const password = process.argv[2];

if (!password) {
  console.error('Usage: npx ts-node scripts/hash-password.ts <password>');
  process.exit(1);
}

hashPassword(password).catch(console.error);
