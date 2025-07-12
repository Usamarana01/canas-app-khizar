import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const filters = {
  Category: ["Standard", "Premium", "Specialty"],
  Size: ['2" x 3.5"', '2.5" x 2.5"', '1.5" x 3.5"'],
  Stock: ["14pt", "16pt", "18pt", "100lb Cover"],
  Corners: ["Standard", "Rounded"],
  Coating: ["Glossy", "Matte", "UV Coated"],
}

export function SidebarFilter() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Filter By</h3>
      <Accordion type="multiple" defaultValue={["Category", "Size"]} className="w-full">
        {Object.entries(filters).map(([title, options]) => (
          <AccordionItem value={title} key={title}>
            <AccordionTrigger>{title}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox id={`${title}-${option}`} />
                    <Label htmlFor={`${title}-${option}`} className="font-normal">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
