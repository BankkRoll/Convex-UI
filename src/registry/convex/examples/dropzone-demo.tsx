"use client";

import { DemoAuthWrapper } from "@/components/demo-auth-wrapper";
import { Dropzone } from "@/registry/convex/blocks/dropzone-nextjs/components/dropzone";
import { useConvexUpload } from "@/registry/convex/blocks/dropzone-nextjs/hooks/use-convex-upload";

export default function DropzoneDemo() {
  const upload = useConvexUpload({
    allowedMimeTypes: ["image/*", "application/pdf"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
  });

  return (
    <DemoAuthWrapper>
      <div className="w-full max-w-xl mx-auto">
        <Dropzone upload={upload} />
      </div>
    </DemoAuthWrapper>
  );
}
