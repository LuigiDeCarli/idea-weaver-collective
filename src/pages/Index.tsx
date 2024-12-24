import { MindMap } from "@/components/MindMap";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b flex items-center px-6">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          MindFlow
        </h1>
      </header>
      <main>
        <MindMap />
      </main>
    </div>
  );
};

export default Index;