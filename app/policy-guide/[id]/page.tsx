import PolicyGuideVideoLayout from "@/sections/policy-guide/PolicyGuideVideoLayout";

export default function PolicyGuideVideoPage({
  params,
}: {
  params: { id: string };
}) {
  return <PolicyGuideVideoLayout id={params.id} />;
}
