import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";
import Section4 from "./Section4";
import Layout from "../Layout";

export default function Dashboard() {
  return (
    <Layout className="flex flex-col gap-4">
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
    </Layout>
  );
}
