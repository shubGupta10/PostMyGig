import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import { ConnectoDatabase } from "./db";
import bcrypt from "bcryptjs";
import userModel from "@/models/UserModel";

export const authOptions: NextAuthOptions = {
    providers: [
       CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: {label: "Email", type: "email"},
            password: {label: "Password", type: "password"},
        },
        async authorize(credentials, req){
            if(!credentials?.email || !credentials.password){
                throw new Error("Please fill all fields")
            }

            try {
                await ConnectoDatabase();
                const user = await userModel.findOne({email: credentials.email})
                if(!user){
                    throw new Error("No user found")
                }

                 // Check if this is a social login user trying to use credentials
                 if(user.provider === 'google' || user.provider === 'github'){
                    throw new Error(`Please use ${user.provider.charAt(0).toUpperCase() + user.provider.slice(1)} Sign-In for this account`);
                 }

                 const isPasswordValid = await bcrypt.compare(credentials.password, user.password as string);
                 if(!isPasswordValid){
                    throw new Error("Invalid password")
                 }

                 return {
                    id: user._id as string,
                    email: user.email,
                    name: user.name,
                    profilePhoto: user.profilePhoto as string,
                    provider: user.provider,
                    role: user.role || 'freelancer',
                 }
            } catch (error) {
                throw error;
            }
        }
       }),
       Google({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        authorization: {
            params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code"
            }
        }
       }),
       Github({
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string
       })
    ],
    callbacks: {
        async jwt({token, user, account}){
            if(user){
                token.id = user.id;
                token.provider = account?.provider;
                token.role = (user as any).role;
            }

            // Always fetch fresh user data from database to ensure role is up-to-date
            // This is especially important for OAuth logins where role might not be in the user object
            if(token.email && !token.role) {
                try {
                    await ConnectoDatabase();
                    const dbUser = await userModel.findOne({email: token.email});
                    if(dbUser) {
                        token.id = dbUser.id.toString();
                        token.role = dbUser.role || 'freelancer';
                        token.provider = dbUser.provider;
                    }
                } catch (error) {
                    console.error("Error fetching user role in JWT callback:", error);
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.provider = token.provider as string;
                session.user.role = token.role as string;

                // If role is still not available, fetch from database as fallback
                if (!session.user.role && session.user.email) {
                    try {
                        await ConnectoDatabase();
                        const dbUser = await userModel.findOne({email: session.user.email});
                        if(dbUser) {
                            session.user.role = dbUser.role || 'freelancer';
                            session.user.id = dbUser.id.toString();
                            session.user.provider = dbUser.provider;
                        }
                    } catch (error) {
                        console.error("Error fetching user role in session callback:", error);
                        session.user.role = 'freelancer'; 
                    }
                }
            }
            return session;
        },

        async signIn({user, account}){
            try {
                await ConnectoDatabase();
                const existingUser = await userModel.findOne({email: user.email});

                // For OAuth Sign In (Google or GitHub)
                if(account?.provider === 'google' || account?.provider === 'github'){
                    if(existingUser){
                        if(existingUser.provider === 'credentials'){
                            throw new Error("This email is already registered with password. Please use password to login.")
                        }

                        //update existing OAuth user and set role in user object
                        const updatedUser = await userModel.findByIdAndUpdate(
                            existingUser._id, 
                            {
                                name: user.name || "",
                                profilePhoto: user.image
                            },
                            { new: true } 
                        );
                        
                        // Set role in user object for OAuth login
                        if(updatedUser) {
                            (user as any).role = updatedUser.role || 'freelancer';
                            user.id = updatedUser.id.toString();
                        }
                    }else{
                        const newUser = new userModel({
                            name: user.name,
                            email: user.email,
                            role: "freelancer",
                            profilePhoto: user.image || "",
                            provider: account.provider,
                        });
                        const savedUser = await newUser.save();
                        
                        // Set role in user object for new OAuth user
                        (user as any).role = savedUser.role || 'freelancer';
                        user.id = savedUser.id.toString();
                    }
                    return true;
                }

                //for credential signin
                if(account?.provider === 'credentials'){
                    if(!existingUser){
                         throw new Error("No user found with this email");
                    }

                    if(existingUser.provider === 'google' || existingUser.provider === 'github'){
                        throw new Error(`This email is registered with ${existingUser.provider.charAt(0).toUpperCase() + existingUser.provider.slice(1)}. Please use ${existingUser.provider.charAt(0).toUpperCase() + existingUser.provider.slice(1)} Sign In.`);
                    }

                   return true;
                }
                return false;
            } catch (error) {
                 console.error("SignIn Error:", error);
                throw error;
            }
        }
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET
}