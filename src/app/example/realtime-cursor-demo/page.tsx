import Demo from "@/registry/convex/examples/realtime-cursor-demo";

const RealtimeCursorDemoPage = () => {
  // Use a fixed room name so ALL users see each other's cursors
  return <Demo roomName="cursor-demo" />;
};

export default RealtimeCursorDemoPage;
