import React from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'

const CargoSettings = ({ cargoWeight, onWeightChange }) => {
  const [weight, setWeight] = React.useState(cargoWeight.toString())
  
  const handleChange = (e) => {
    setWeight(e.target.value)
  }
  
  const handleSave = () => {
    const numWeight = parseFloat(weight)
    if (!isNaN(numWeight) && numWeight > 0) {
      onWeightChange(numWeight)
    } else {
      // Reset to current value if invalid
      setWeight(cargoWeight.toString())
    }
  }
  
  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <Label htmlFor="cargo-weight" className="text-sm">
          Cargo Weight (tonnes)
        </Label>
        <Input
          id="cargo-weight"
          type="number"
          min="0.1"
          step="0.1"
          value={weight}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <Button
        size="sm"
        onClick={handleSave}
        className="mb-px"
      >
        Update
      </Button>
    </div>
  )
}

export default CargoSettings