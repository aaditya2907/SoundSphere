import { NextRequest, NextResponse } from "next/server";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { z } from "zod"
import youtubeUrl from "youtube-url";
import youtubesearchapi from "youtube-search-api"
import prisma from "@/app/lib/db";


const CreateStreamSchema = z.object({
    email: z.string(),
    url: z.string().includes("youtube")
})

const rateLimiter = new RateLimiterMemory({
    points: 5,
    duration: 60,
});

export async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') as string | undefined ?? '127.0.0.1';

    // Apply rate limiting
    try {
        await rateLimiter.consume(ip); // Deduct a point for the current request
    } catch (e) {
        return NextResponse.json({
            message: 'Rate limit exceeded. Please try again later.' + e,
        }, {
            status: 429,
        });
    }

    //Main logic
    try {
        //Zod validation
        const data = CreateStreamSchema.parse(await req.json())

        //URL Format checking
        if (!youtubeUrl.valid(data.url)) {
            return NextResponse.json({
                message: "Wrong URL"
            }, {
                status: 411
            })
        }

        const extractedId = youtubeUrl.extractId(data.url)

        //Fetching video metadata
        const YtAPIres = await youtubesearchapi.GetVideoDetails(extractedId);
        console.log(YtAPIres)
        if (!YtAPIres || !YtAPIres.thumbnail || !YtAPIres.title) {
            return NextResponse.json({
                message: "Failed to fetch video details"
            }, {
                status: 400
            });
        }
        const thumbnails = YtAPIres.thumbnail.thumbnails;
        const title: string = JSON.stringify(YtAPIres.title)
        console.log(title)
        thumbnails.sort((a: { width: number }, b: { width: number }) => a.width < b.width ? -1 : 1)

        const user = await prisma.user.findFirst({
            where: {
                email: data.email
            }
        })

        await prisma?.stream.create({
            data: {
                userId: user?.id ?? "",
                url: data.url,
                extractedId,
                title: title ?? "Title",
                smallImg: (thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url) ?? "https://pbs.twimg.com/profile_images/1619097985316708354/zzxCaMnQ_400x400.jpg",
                bigImg: thumbnails[thumbnails.length - 1].url ?? "https://pbs.twimg.com/profile_images/1619097985316708354/zzxCaMnQ_400x400.jpg"
            }
        })
        return NextResponse.json({
            message: "Stream created successfully!"
        }, {
            status: 201
        })

    } catch (e) {
        return NextResponse.json({
            message: "Error while adding Stream " + e
        }, {
            status: 411
        })
    }

}

export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email")
    const user = await prisma.user.findFirst({
        where: {
            email: email ?? ""
        }
    })
    const streams = await prisma?.stream.findMany({
        where: {
            userId: user?.id ?? ""
        }
    })
    return NextResponse.json({
        streams
    })
}

export async function DELETE(req: NextRequest) {
    const StreamId = req.nextUrl.searchParams.get("id")
    if (!StreamId) {
        return NextResponse.json({
            message: "Stream ID is required",
        }, {
            status: 400, // Bad Request
        });
    }

    try {
        await prisma.stream.delete({
            where: {
                id: StreamId
            }
        })
        return NextResponse.json({
            message: "Successfully deleted"
        })
    } catch (e) {
        return NextResponse.json({
            message: "Error while deleting Stream " + e
        }, {
            status: 500
        })
    }
}