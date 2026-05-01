import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.password) {
          throw new Error('No password provided');
        }

        if (!ADMIN_PASSWORD_HASH) {
          throw new Error('Admin password not configured');
        }

        const isValid = await compare(
          credentials.password as string,
          ADMIN_PASSWORD_HASH
        );

        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: 'admin',
          name: 'Admin',
          email: 'admin@hgmanager.local',
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
});
