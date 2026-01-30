import Demo from "@/registry/convex/examples/realtime-chat-demo";

const RealtimeChatDemoPage = () => {
  // Use a fixed room name so ALL users see each other's messages
  return <Demo roomName="chat-demo" />;
};

export default RealtimeChatDemoPage;
