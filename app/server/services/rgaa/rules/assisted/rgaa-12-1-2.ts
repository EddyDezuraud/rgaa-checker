import type { RgaaRule } from '../../types'

const rule: RgaaRule = {
  id: 'rgaa-12-1-2',
  label: 'Ordre de tabulation cohérent',
  theme: 'Navigation',
  type: 'assisted',
  wcag: ['2.4.3'],
  description: 'Analyse l’ordre de tabulation pour détecter des ruptures et nécessite un contrôle humain.',
  remediation: 'Réordonner l’ordre de tabulation et éviter les tabindex > 0.',
  async isApplicable ({ page }) {
    const focusables = await page.$$eval('[tabindex], a, button, input, select, textarea', nodes => nodes.length)
    return focusables > 0
  },
  async run ({ page }) {
    const focusOrder = await page.$$eval('[tabindex], a, button, input, select, textarea', (nodes) => {
      const focusableElements = nodes.filter((node) => {
        const element = node as HTMLElement
        return !element.hasAttribute('disabled') && element.tabIndex >= 0
      })
      return focusableElements.slice(0, 50).map((node, index) => ({
        index,
        tabIndex: (node as HTMLElement).tabIndex,
        snippet: (node as HTMLElement).outerHTML.slice(0, 180)
      }))
    })

    const unusual = focusOrder.filter(item => item.tabIndex > 0)

    return {
      id: 'rgaa-12-1-2',
      auditId: '',
      criterionId: '12.1.2',
      label: 'Ordre de tabulation cohérent',
      theme: 'Navigation',
      type: 'assisted',
      wcag: ['2.4.3'],
      status: unusual.length === 0 ? 'needs_review' : 'failed',
      description: unusual.length === 0
        ? 'Aucun tabindex positif détecté. Vérifier la logique d’ordre.'
        : `${unusual.length} élément(s) possèdent un tabindex > 0.`,
      remediation: 'Retirer les tabindex positifs et respecter l’ordre DOM pour la navigation clavier.',
      evidence: focusOrder.map((item) => ({
        id: `rgaa-12-1-2-${item.index}`,
        type: 'dom',
        snippet: item.snippet,
        description: `tabIndex ${item.tabIndex}`
      }))
    }
  }
}

export default rule
