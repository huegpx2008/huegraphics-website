# Hue Graphics Admin and Cloudinary Uploads

## Required environment variables

Add these variables to `.env.local` for local development and to the deployment
provider's environment-variable settings for production:

```env
ADMIN_UPLOAD_PASSWORD=replace-with-a-long-private-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

- `ADMIN_UPLOAD_PASSWORD` protects the admin pages and upload API.
- `CLOUDINARY_CLOUD_NAME` identifies the Cloudinary account.
- `CLOUDINARY_API_KEY` is used by the server to authenticate uploads.
- `CLOUDINARY_API_SECRET` signs uploads on the server and must never be exposed
  in browser code or committed to Git.

Restart the development server after changing environment variables.

## Accessing the admin

The admin is intentionally not linked from the public website.

Open `/admin` directly:

```text
http://localhost:3001/admin
```

Enter the value configured in `ADMIN_UPLOAD_PASSWORD`. A successful login
creates an HTTP-only, same-site admin cookie that lasts for 12 hours. The
password and Cloudinary credentials are never sent back to browser code.

Opening `/admin/upload` without a valid admin cookie redirects to the admin
login. The upload API also checks the cookie independently, so calling the API
without admin access returns `401`.

## How uploads work

1. An authenticated administrator selects an image, category, and optional
   title and description on `/admin/upload`.
2. The browser sends the image to `/api/admin/upload`.
3. The server validates the admin session, file type, file size, and category.
4. The server signs a Cloudinary upload with `CLOUDINARY_API_SECRET`.
5. The server sends the image directly to Cloudinary.
6. The page displays the returned secure image URL and uploaded image preview.

Images must be image MIME types and no larger than 15 MB.

## Cloudinary organization

Uploads use this base folder:

```text
hue-graphics-website/
```

Each category gets its own folder:

```text
hue-graphics-website/screen-printing
hue-graphics-website/embroidery
hue-graphics-website/dtf-transfers
hue-graphics-website/signs-banners
hue-graphics-website/vehicle-graphics
hue-graphics-website/business-printing
hue-graphics-website/shop-behind-the-scenes
```

Every upload also receives these Cloudinary tags:

- `hue-website`
- The category slug, such as `screen-printing`

The selected category, optional title, and optional description are stored in
Cloudinary context metadata.

## Future gallery integration

The current public galleries are unchanged. Uploading a photo does not publish
it to the website.

A future gallery-management tool can use Cloudinary's server-side Admin or
Search API to:

1. Retrieve assets tagged `hue-website`.
2. Filter assets by category tag or folder.
3. Let an administrator select, order, hide, or feature images.
4. Save the approved gallery selection in a database or managed content file.
5. Render only approved assets in the existing public gallery components.

Cloudinary API secrets must remain in server-only routes for that future work.
