import type { Context, Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { v4 as uuidv4 } from "uuid";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async (req: Request, _context: Context) => {
  const { method } = req;
  const url = new URL(req.url);

  // Get user ID from query parameters
  const userId = url.searchParams.get("userId");

  // For GET requests to specific images, we can extract userId from the path instead of requiring it as a query param
  let actualUserId = userId;
  if (
    !actualUserId &&
    method === "GET" &&
    !url.pathname.includes("/list") &&
    !url.pathname.includes("/upload")
  ) {
    // Extract userId from path like /api/user-images/userId/imageId.ext
    const pathParts = url.pathname.split("/").filter((part) => part);
    if (pathParts.length >= 3) {
      actualUserId = pathParts[2]; // /api/user-images/[userId]/imageId.ext
    }
  }

  if (!actualUserId) {
    return new Response(
      JSON.stringify({ error: "userId parameter is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Get blob store for user images
  const store = getStore("user-images");

  try {
    if (method === "POST" && url.pathname.includes("/upload")) {
      // Upload a new user image
      const contentType = req.headers.get("content-type");

      if (!contentType || !contentType.startsWith("image/")) {
        return new Response(
          JSON.stringify({ error: "Content-Type must be an image" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Get the image data as array buffer
      const imageBuffer = await req.arrayBuffer();

      if (imageBuffer.byteLength === 0) {
        return new Response(
          JSON.stringify({ error: "No image data provided" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Check file size (limit to 5MB)
      if (imageBuffer.byteLength > 5 * 1024 * 1024) {
        return new Response(
          JSON.stringify({ error: "Image size must be less than 5MB" }),
          {
            status: 413,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Generate unique key for the image
      const imageId = uuidv4();
      const fileExtension = contentType.split("/")[1] || "jpg";
      const imageKey = `${actualUserId}/${imageId}.${fileExtension}`;

      // Store metadata about the image
      const metadata = {
        userId: actualUserId,
        contentType,
        size: imageBuffer.byteLength,
        uploadedAt: new Date().toISOString(),
      };

      // Store the image blob
      await store.set(imageKey, imageBuffer, { metadata });

      return new Response(
        JSON.stringify({
          success: true,
          imageId,
          imageKey,
          contentType,
          size: imageBuffer.byteLength,
          url: `/api/user-images/${imageKey}`,
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (method === "GET") {
      if (url.pathname.includes("/list")) {
        // List user's images
        const { blobs } = await store.list({ prefix: `${actualUserId}/` });

        const userImages = await Promise.all(
          blobs.map(async (blob) => {
            const metadata = await store.getMetadata(blob.key);
            return {
              imageKey: blob.key,
              imageId: blob.key.split("/")[1].split(".")[0],
              etag: blob.etag,
              contentType: metadata?.metadata.contentType,
              size: metadata?.metadata.size,
              uploadedAt: metadata?.metadata.uploadedAt,
              url: `/api/user-images/${blob.key}`,
            };
          }),
        );

        return new Response(
          JSON.stringify({
            images: userImages.sort(
              (a, b) =>
                // @ts-expect-error doesn't matter
                new Date(b.uploadedAt).getTime() -
                // @ts-expect-error doesn't matter
                new Date(a.uploadedAt).getTime(),
            ),
          }),
          {
            headers: { "Content-Type": "application/json" },
          },
        );
      } else {
        // Get specific image
        const pathParts = url.pathname.split("/").filter((part) => part);
        const imageKey = pathParts.slice(2).join("/"); // Everything after /api/user-images/

        const result = await store.getWithMetadata(imageKey);

        if (!result) {
          return new Response(JSON.stringify({ error: "Image not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Check if user has permission to view this image
        const metadata = result.metadata?.metadata || result.metadata || {};
        if (metadata && typeof metadata === 'object' && 'userId' in metadata && metadata.userId !== actualUserId) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Return the image
        const contentType = (metadata && typeof metadata === 'object' && 'contentType' in metadata 
          ? metadata.contentType as string 
          : "image/jpeg");
        
        const headers: HeadersInit = {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000", // Cache for 1 year
        };
        
        if (result.etag) {
          headers["ETag"] = result.etag;
        }
        
        return new Response(result.data, { headers });
      }
    }

    if (method === "DELETE") {
      // Delete a specific image
      const pathParts = url.pathname.split("/").filter((part) => part);
      const lastPart = pathParts[pathParts.length - 1];

      if (!lastPart || lastPart === "user-images" || pathParts.length <= 3) {
        return new Response(
          JSON.stringify({ error: "Image key is required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Reconstruct the full image key from the path
      const imageKey = pathParts.slice(3).join("/"); // Everything after /api/user-images/

      // Check if image exists and user has permission
      const result = await store.getMetadata(imageKey);

      if (!result) {
        return new Response(JSON.stringify({ error: "Image not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      const deleteMetadata = result.metadata?.metadata || result.metadata || {};
      if (deleteMetadata && typeof deleteMetadata === 'object' && 'userId' in deleteMetadata && deleteMetadata.userId !== actualUserId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Delete the image
      await store.delete(imageKey);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Image deleted successfully",
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Method not allowed
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Blob storage error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/user-images/*",
};
