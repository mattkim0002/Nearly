/**
 * Field-related types and utilities.
 * DetectedField is the serializable representation of a scanned form field.
 */

export type FieldType = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file'
export type Confidence = 'high' | 'medium' | 'low'

export interface DetectedField {
  selector: string
  fieldType: FieldType
  label: string
  fieldName: string
  mappedProfileKey?: string
  currentValue?: string
  confidence: Confidence
  isOpenEnded: boolean
  filledValue?: string
}

/** Generate a stable CSS selector for a DOM element */
export function buildSelector(el: HTMLElement): string {
  if (el.id) return `#${CSS.escape(el.id)}`
  if (el.getAttribute('name')) {
    const name = el.getAttribute('name')!
    const tag = el.tagName.toLowerCase()
    return `${tag}[name="${CSS.escape(name)}"]`
  }
  // Fallback: walk up the DOM building a path
  const parts: string[] = []
  let node: HTMLElement | null = el
  while (node && node !== document.body) {
    let selector = node.tagName.toLowerCase()
    if (node.id) {
      selector = `#${CSS.escape(node.id)}`
      parts.unshift(selector)
      break
    }
    const siblings = node.parentElement
      ? Array.from(node.parentElement.children).filter(
          (c) => c.tagName === node!.tagName
        )
      : []
    if (siblings.length > 1) {
      const idx = siblings.indexOf(node) + 1
      selector += `:nth-of-type(${idx})`
    }
    parts.unshift(selector)
    node = node.parentElement
  }
  return parts.join(' > ')
}

export function getFieldType(el: HTMLElement): FieldType {
  const tag = el.tagName.toLowerCase()
  if (tag === 'textarea') return 'textarea'
  if (tag === 'select') return 'select'
  const type = (el.getAttribute('type') ?? 'text').toLowerCase()
  if (type === 'file') return 'file'
  if (type === 'radio') return 'radio'
  if (type === 'checkbox') return 'checkbox'
  return 'text'
}

export function mapLabelToProfileKey(label: string, name: string): string | undefined {
  const l = label.toLowerCase()
  const n = name.toLowerCase()

  if (l.includes('first name') || n.includes('first_name') || n === 'firstname') return 'firstName'
  if (l.includes('last name') || n.includes('last_name') || n === 'lastname') return 'lastName'
  if (l.includes('full name') || n === 'name') return 'fullName'
  if (l.includes('email') || n.includes('email')) return 'email'
  if ((l.includes('phone') || n.includes('phone')) && !l.includes('company')) return 'phone'
  if (l.includes('city')) return 'address.city'
  if (l.includes('state') || l.includes('province')) return 'address.state'
  if (l.includes('zip') || l.includes('postal')) return 'address.zip'
  if (l.includes('country')) return 'address.country'
  if (l.includes('street') || l.includes('address line 1')) return 'address.street'
  if (l.includes('linkedin')) return 'linkedinUrl'
  if (l.includes('portfolio') || l.includes('personal website') || l.includes('github')) return 'portfolioUrl'
  if (l.includes('authorized') && l.includes('work')) return 'authorizedToWork'
  if (l.includes('sponsorship') || l.includes('visa')) return 'visaSponsorship'
  if (l.includes('relocat')) return 'willingToRelocate'
  if (l.includes('salary') || l.includes('compensation')) return 'expectedSalary'
  if (l.includes('gender')) return 'gender'
  if (l.includes('race') || l.includes('ethnicity')) return 'ethnicity'
  if (l.includes('veteran')) return 'veteranStatus'
  if (l.includes('disability')) return 'disabilityStatus'

  return undefined
}
