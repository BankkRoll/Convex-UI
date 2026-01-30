"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { componentPages, frameworkTitles } from "@/config/docs";
import { usePathname, useRouter } from "next/navigation";

import { useFramework } from "@/context/framework-context";

const frameworks = Object.keys(frameworkTitles) as Array<
  keyof typeof frameworkTitles
>;

export function SidebarFrameworkSelector() {
  const pathname = usePathname();
  const router = useRouter();
  const { framework, setFramework } = useFramework();

  const onSelect = (value: string) => {
    const newFramework = value as keyof typeof frameworkTitles;
    setFramework(newFramework);

    // If we're on a component doc page, navigate to the same component with the new framework
    const pathParts = pathname.split("/");
    if (pathParts.length >= 4 && pathParts[1] === "docs") {
      const currentFramework = pathParts[2];
      const docTitle = pathParts[3];

      // Check if current path has a framework segment
      if (
        frameworks.includes(currentFramework as keyof typeof frameworkTitles)
      ) {
        // Find if this component supports the new framework
        const componentItem = componentPages.items.find(
          (item) => item.href?.split("/").pop() === docTitle.toLowerCase(),
        );

        if (
          componentItem?.supportedFrameworks?.includes(
            newFramework as (typeof componentItem.supportedFrameworks)[number],
          )
        ) {
          // Navigate to the same doc with new framework
          const newPath = `/docs/${newFramework}/${docTitle}`;
          router.push(newPath);
        }
      }
    }
  };

  const options = frameworks.map((f) => ({
    label: frameworkTitles[f],
    value: f,
  }));

  return (
    <Select value={framework} onValueChange={onSelect}>
      <SelectTrigger className="w-full h-9 text-sm">
        <SelectValue placeholder="Select framework" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((f) => (
            <SelectItem key={f.value} value={f.value}>
              {f.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
