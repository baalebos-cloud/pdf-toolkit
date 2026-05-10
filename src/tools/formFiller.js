import { PDFDocument } from 'pdf-lib'

export async function getFormFields(file) {
  const bytes = await file.arrayBuffer()
  const doc = await PDFDocument.load(bytes)
  const form = doc.getForm()
  const fields = form.getFields()
  return fields.map(f => ({
    name: f.getName(),
    type: f.constructor.name.replace('PDF', '').replace('Field', ''),
  }))
}

export async function fillFormFields(file, values) {
  const bytes = await file.arrayBuffer()
  const doc = await PDFDocument.load(bytes)
  const form = doc.getForm()

  for (const [name, value] of Object.entries(values)) {
    try {
      const field = form.getField(name)
      const type = field.constructor.name
      if (type.includes('TextField')) field.setText(String(value))
      else if (type.includes('CheckBox')) value ? field.check() : field.uncheck()
      else if (type.includes('RadioGroup')) field.select(String(value))
      else if (type.includes('Dropdown') || type.includes('OptionList')) field.select(String(value))
    } catch {
      // skip unknown fields
    }
  }

  form.flatten()
  return new Blob([await doc.save()], { type: 'application/pdf' })
}
