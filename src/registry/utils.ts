import type { RegistryItem } from "shadcn/schema";
import lodash from "lodash";

const { uniq, uniqBy } = lodash;

const registryItemAppend = (
  item: RegistryItem,
  items: RegistryItem[],
): RegistryItem => {
  const neededRegDependencies = [
    ...(item.registryDependencies || []),
    ...items.flatMap((i: RegistryItem) => i.registryDependencies),
  ].filter((dep: string | undefined): dep is string => dep !== undefined);

  const neededDependencies = [
    ...(item.dependencies || []),
    ...items.flatMap((i: RegistryItem) => i.dependencies),
  ].filter((dep: string | undefined): dep is string => dep !== undefined);

  const neededFiles = [
    ...(item.files || []),
    ...items.flatMap((i: RegistryItem) => i.files),
  ].filter((file): file is NonNullable<typeof file> => file !== undefined);

  const registryBlock: RegistryItem = {
    ...item,
    registryDependencies: uniq(neededRegDependencies),
    dependencies: uniq(neededDependencies),
    files: uniqBy(
      neededFiles,
      (file: (typeof neededFiles)[number]) => file.path,
    ),
    docs: [item.docs, ...items.flatMap((i: RegistryItem) => i.docs)]
      .filter(Boolean)
      .join("\n\n"),
    // merge all environment variables
    envVars: {
      ...item.envVars,
      ...items.reduce(
        (acc: Record<string, string>, i: RegistryItem) => ({
          ...acc,
          ...i.envVars,
        }),
        {},
      ),
    },
  };

  return registryBlock;
};

export { registryItemAppend };
