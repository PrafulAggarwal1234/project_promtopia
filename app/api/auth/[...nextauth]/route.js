import NextAuth from "next-auth/next";
import GoogleProvider from  'next-auth/providers/google';

import User from "@models/user";
import { connectToDB } from "@utils/database";

console.log({
    clientId: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
})

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks:{
        async session({session}){
            const sessionUser = await User.findOne({
                email: session.user.email
            })
            session.user.id=sessionUser._id.toString();
            return session;
        },
        async signIn({profile}){
            //every nextjs route is something known as a server less route
            try{
                await connectToDB();
                //check if user already exits
                const userExists = await User.findOne({
                    email: profile.email,
                    username: profile.name.replace(" ","").toLowerCase(),
                    image: profile.picture
                })
                //if not create a new user and save it to database

                if(!userExists){
                    await User.create({
                        email:profile.email,
                        username:profile.name.replace(" ","").toLowerCase(),
                        image: profile.picture
                    })
                }

                return true;
            }catch(error){
                console.log(error);
                return false;
            }
        }
    }
})

export {handler as GET, handler as POST};