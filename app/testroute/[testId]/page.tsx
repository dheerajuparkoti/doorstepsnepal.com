export default async function Page({
  params,
}: {
  params: Promise<{ testId: string }>
}) {
  const { testId } = await params;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Test Dynamic Route</h1>
      <p>Parameter: {testId}</p>
    </div>
  );
}