import Demo from "@/registry/convex/examples/realtime-cursor-demo";

const RealtimeCursorDemoPage = async (props: {
  searchParams: Promise<{ roomName?: string; userId?: string }>;
}) => {
  const searchParams = await props.searchParams;
  const roomName =
    searchParams["roomName"] ||
    `cursor-room-${Math.floor(Math.random() * 1000)}`;
  const userId = searchParams["userId"];

  return <Demo roomName={roomName} userId={userId} />;
};

export default RealtimeCursorDemoPage;
