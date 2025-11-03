import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function DraggableItem({ id, onRemove }: { id: string; onRemove: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>
      <input
        className="flex-1 px-3 py-2 border rounded-md"
        placeholder="Item name"
      />
      <input
        className="w-20 px-3 py-2 border rounded-md"
        type="number"
        placeholder="Qty"
      />
      <input
        className="w-24 px-3 py-2 border rounded-md"
        type="number"
        placeholder="$ Price"
      />
      <Button size="icon" variant="ghost" onClick={() => onRemove(id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function InvoiceBuilder() {
  const [items, setItems] = useState<string[]>(['1', '2'])
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)
        const newItems = [...items]
        newItems.splice(oldIndex, 1)
        newItems.splice(newIndex, 0, active.id)
        return newItems
      })
    }
  }

  const addItem = () => setItems([...items, Date.now().toString()])
  const removeItem = (id: string) => setItems(items.filter(i => i !== id))

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create Invoice</h2>
      <Card className="p-6">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((id) => (
              <DraggableItem key={id} id={id} onRemove={removeItem} />
            ))}
          </SortableContext>
        </DndContext>
        <Button onClick={addItem} className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
        <div className="mt-6 text-right">
          <Button className="bg-primary">Generate PDF & Send</Button>
        </div>
      </Card>
    </div>
  )
}
