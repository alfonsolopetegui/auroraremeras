'use client'

interface VariantRowProps {
  variant: {
    id?: string
    size: 'S' | 'M' | 'L' | 'XL'
    color: string
    stock: number
  }
  onChange: (updated: any) => void
  onDelete: () => void
}

export function VariantRow({ variant, onChange, onDelete }: VariantRowProps) {
  return (
    <div className="variant-row">
      <select value={variant.size} onChange={(e) => onChange({ ...variant, size: e.target.value })}>
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="L">L</option>
        <option value="XL">XL</option>
      </select>

      <input
        type="text"
        placeholder="Color (ej: Negro)"
        value={variant.color}
        onChange={(e) => onChange({ ...variant, color: e.target.value })}
      />

      <input
        type="number"
        placeholder="Stock"
        value={variant.stock}
        onChange={(e) => onChange({ ...variant, stock: Number(e.target.value) })}
        min="0"
      />

      <button type="button" onClick={onDelete}>
        Eliminar
      </button>
    </div>
  )
}

