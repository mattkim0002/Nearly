/**
 * Injector — sets values on form fields in a way that React/Vue controlled
 * components will register (via native setter + synthetic events).
 */

export function injectValue(element: HTMLElement, value: string): boolean {
  try {
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      const proto =
        element instanceof HTMLTextAreaElement
          ? HTMLTextAreaElement.prototype
          : HTMLInputElement.prototype
      const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set
      setter?.call(element, value)

      element.dispatchEvent(new Event('input', { bubbles: true }))
      element.dispatchEvent(new Event('change', { bubbles: true }))
      element.dispatchEvent(new Event('blur', { bubbles: true }))
      return true
    }

    if (element instanceof HTMLSelectElement) {
      const options = Array.from(element.options)
      const val = value.toLowerCase()
      const match = options.find(
        (opt) =>
          opt.value.toLowerCase().includes(val) ||
          (opt.textContent?.toLowerCase().includes(val) ?? false)
      )
      if (match) {
        element.value = match.value
        element.dispatchEvent(new Event('change', { bubbles: true }))
        return true
      }
      return false
    }

    // Boolean fields (radio/checkbox)
    if (
      element instanceof HTMLInputElement &&
      (element.type === 'radio' || element.type === 'checkbox')
    ) {
      const checked = ['true', 'yes', '1'].includes(value.toLowerCase())
      element.checked = checked
      element.dispatchEvent(new Event('change', { bubbles: true }))
      return true
    }

    return false
  } catch (e) {
    console.error('[Fieldwork] Failed to inject value', e)
    return false
  }
}
