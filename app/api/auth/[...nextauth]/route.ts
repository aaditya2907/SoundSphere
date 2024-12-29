import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    callbacks: {
        async signIn(params) {
            if (!params.user.email) {
                return false
            }
            try {
                // First, try to find existing user
                const existingUser = await prisma?.user.findUnique({
                    where: { email: params.user.email },
                });

                if (!existingUser) {
                    // If user doesn't exist, create user and add default streams
                    const newUser = await prisma?.user.create({
                        data: {
                            email: params.user.email,
                            Stream: {
                                create: defaultStreams,
                            },
                        },
                    });
                } 
            } catch (e) {
                console.log("error", e)
                return false;
            }

            return true
        },

        // async jwt({ token, account }) {
        //     if (account) {
        //         token.sub = account.providerAccountId; // Store Google User ID in JWT
        //     }
        //     return token;
        // },

        // async session({ session, token, user }: { session: any, token: any, user: any }) {
        //     session.user.id = token.sub;
        //     return session;
        // }
    }
})

export { handler as GET, handler as POST }

const defaultStreams = [
    {
        url: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
        title: "Ed Sheeran - Shape of You (Official Music Video)",
        extractedId: "JGwWNGJdvx8",
        smallImg: "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBDr2laWVr1FOfo6vsZFHCQVOlH5w",
        bigImg: "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAs8aX0ACEG9PZWCbmZtwXgSkEzng",
    },
    {
        url: "https://www.youtube.com/watch?v=TUVcZfQe-Kw",
        title: "Dua Lipa - Levitating Featuring DaBaby (Official Music Video)",
        extractedId: "TUVcZfQe-Kw",
        smallImg: "https://i.ytimg.com/vi/TUVcZfQe-Kw/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAAa8LLWzPmWOiAShtgNBWxgaH6lQ",
        bigImg: "https://i.ytimg.com/vi/TUVcZfQe-Kw/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLA7fkZaB_nmR0wo-HGjvRuxbKkMEA",
    },
    {
        url: "https://www.youtube.com/watch?v=jADTdg-o8i0",
        title: "Hass Hass (Official Video) Diljit X Sia",
        extractedId: "jADTdg-o8i0",
        smallImg: "https://i.ytimg.com/vi/jADTdg-o8i0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDu3Ffz9XKguRGCfOlyMqOqJeXZBg",
        bigImg: "https://i.ytimg.com/vi/jADTdg-o8i0/maxresdefault.jpg?v=65392560",
    }
];