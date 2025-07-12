import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProductTabsProps {
  description: string
  specs: Record<string, string>
}

export function ProductTabs({ description, specs }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList>
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specs">Specs</TabsTrigger>
      </TabsList>
      <TabsContent value="description" className="mt-4 text-sm text-gray-700 leading-relaxed">
        {description}
      </TabsContent>
      <TabsContent value="specs" className="mt-4">
        <div className="divide-y">
          {Object.entries(specs).map(([key, value]) => (
            <div key={key} className="py-3 grid grid-cols-3 gap-4">
              <dt className="text-sm font-medium text-gray-500">{key}</dt>
              <dd className="text-sm text-gray-900 col-span-2">{value}</dd>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
