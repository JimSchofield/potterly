import type { Context, Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { v4 as uuidv4 } from "uuid";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async (req: Request, _context: Context) => {
  const { method } = req;
  const url = new URL(req.url);

  console.log(`[user-images] ${method} ${url.pathname}`);
  console.log(`[user-images] Full URL: ${url.href}`);
  console.log(`[user-images] Search params: ${url.search}`);

  // Get user ID from query parameters
  const userId = url.searchParams.get("userId");
  console.log(`[user-images] Extracted userId: ${userId}`);

  // For GET requests to specific images, we can extract userId from the path instead of requiring it as a query param
  let actualUserId = userId;
  if (!actualUserId && method === "GET" && !url.pathname.includes("/list") && !url.pathname.includes("/upload")) {
    // Extract userId from path like /api/user-images/userId/imageId.ext
    const pathParts = url.pathname.split("/").filter(part => part);
    if (pathParts.length >= 3) {
      actualUserId = pathParts[2]; // /api/user-images/[userId]/imageId.ext
      console.log(`[user-images] Extracted userId from path: ${actualUserId}`);
    }
  }

  if (!actualUserId) {
    console.log("[user-images] Missing userId parameter");
    console.log(`[user-images] Available search params:`, Object.fromEntries(url.searchParams.entries()));
    return new Response(
      JSON.stringify({ error: "userId parameter is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  console.log(`[user-images] Processing request for user: ${actualUserId}`);

  // Get blob store for user images
  const store = getStore("user-images");

  try {
    if (method === "POST" && url.pathname.includes("/upload")) {
      console.log("[user-images] POST: Starting image upload");
      // Upload a new user image
      const contentType = req.headers.get("content-type");
      console.log(`[user-images] Content-Type: ${contentType}`);

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
      console.log(`[user-images] Storing blob with key: ${imageKey}`);
      console.log(`[user-images] Metadata:`, metadata);
      await store.set(imageKey, imageBuffer, { metadata });
      console.log("[user-images] Blob stored successfully");

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
        console.log("[user-images] GET request received");
        
        if (url.pathname.includes("/list")) {
          console.log("[user-images] GET: Listing user images");
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
                  new Date(b.uploadedAt).getTime() -
                  new Date(a.uploadedAt).getTime(),
              ),
            }),
            {
              headers: { "Content-Type": "application/json" },
            },
          );
        } else {
          console.log("[user-images] GET: Fetching specific image");
          console.log(`[user-images] Full pathname: ${url.pathname}`);
          // Get specific image
          const pathParts = url.pathname.split("/").filter(part => part);
          console.log(`[user-images] Path parts:`, pathParts);
          const imageKey = pathParts.slice(2).join("/"); // Everything after /api/user-images/
          console.log(`[user-images] Reconstructed image key: ${imageKey}`);
          
          const result = await store.getWithMetadata(imageKey);
          console.log(`[user-images] Blob retrieval result:`, result ? 'Found' : 'Not found');

          if (!result) {
            console.log(`[user-images] Image not found for key: ${imageKey}`);
            return new Response(JSON.stringify({ error: "Image not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Check if user has permission to view this image
          console.log(`[user-images] Retrieved metadata:`, result.metadata);
          console.log(`[user-images] Comparing userId: metadata=${result.metadata?.metadata?.userId} vs actual=${actualUserId}`);
          if (result.metadata?.metadata?.userId !== actualUserId) {
            console.log(`[user-images] Authorization failed - userId mismatch`);
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 403,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Return the image
          const contentType = result.metadata?.metadata?.contentType || result.metadata?.contentType || "image/jpeg";
          console.log(`[user-images] Returning image with content-type: ${contentType}`);
          console.log(`[user-images] Image data size: ${result.data?.byteLength || 'unknown'} bytes`);
          return new Response(result.data, {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=31536000", // Cache for 1 year
              ETag: result.etag,
            },
          });
        }
    }

    if (method === "DELETE") {
        // Delete a specific image
        const pathParts = url.pathname.split("/").filter(part => part);
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

        if (result.metadata?.userId !== actualUserId) {
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

