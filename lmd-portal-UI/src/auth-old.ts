// import NextAuth from "next-auth";
// import authConfig from "./auth.config";

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
//   unstable_update,
// } = NextAuth({
//   ...authConfig,
//   pages: {
//     signIn: "/auth/sign-in",
//     error: "/auth/error",
//   },
//   events: {},

//   callbacks: {
//     async signIn({ user, account, profile, email, credentials }) {
//       return true;
//     },
//     session({ token, session, user }) {
//       // console.log(">>>>>>>session", session, token);
//       if (token.sub && session.user) {
//         session.user.id = token.sub;
//       }
//       if (session.user) {
//         session.user.name = token.name;
//         session.user.email = token.email!;
//         session.user.image = token.picture!;
//         session.user.department = token.department!;
//         session.user.role = token.role as
//           | "ADMINISTRATOR"
//           | "USER"
//           | "PUBLISHER";
//         session.user.title = token.title;
//         // session.user.emailVerified = token.emailVerified;
//         session.user.accessToken = token.accessToken;
//         session.user.groups = token.groups;
//       }

//       return session;
//     },
//     async jwt({ token, user, account, profile, trigger, session }) {
//       if (trigger === "update") {
//         console.log("new session =>", session);
//         if (session.name) {
//           token.name = session.name;
//         }
//         if (session.picture) {
//           token.picture = session.picture;
//         }
//         // delete token.image
//         return {
//           ...token,
//           ...session.user,
//         };
//       }

//       if (user) {
//         token = {
//           ...token,
//           ...user,
//         };
//       }
//       // console.log("checking token", token, account);
//       if (token.isValid === false) {
//         return null;
//       }
//       // check if access token is expired and log out
//       // TODO: implement access token renewal using the refresh token
//       // i think max time of live of 1 hour, which is pretty decent
//       if (new Date(token.exp2! * 1000).getTime() < new Date().getTime()) {
//         return null;
//       }
//       // console.log("---jwt---", token);
//       delete token.image;
//       return token;
//     },
//   },

//   session: { strategy: "jwt" },
//   trustHost: true,
// debug: process.env.NODE_ENV === "development",
//   cookies: {
//     pkceCodeVerifier: {
//       name: "next-auth.pkce.code_verifier",
//       options: {
//         httpOnly: true,
//         sameSite: "lax",
//         path: "/",
//         secure: process.env.NODE_ENV === "production",
//       },
//     },
//   },
// });
