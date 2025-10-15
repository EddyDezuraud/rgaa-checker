import type { RgaaRule } from '../../types'

const rule: RgaaRule = {
  id: 'rgaa-11-1-1',
  label: 'Chaque champ de formulaire possède une étiquette',
  theme: 'Formulaires',
  type: 'assisted',
  wcag: ['3.3.2'],
  description: 'Détecte les champs potentiellement orphelins et propose une validation humaine.',
  remediation: 'Associer chaque champ à un label via for/id ou aria-labelledby explicite.',
  async isApplicable ({ page }) {
    const fields = await page.$$eval('input, textarea, select', nodes => nodes.length)
    return fields > 0
  },
  async run ({ page }) {
    const items = await page.$$eval('input, textarea, select', (nodes) => {
      return nodes.map((node, index) => {
        const element = node as HTMLElement
        const id = element.getAttribute('id')
        const ariaLabel = element.getAttribute('aria-label')
        const labelledby = element.getAttribute('aria-labelledby')
        const hasLabel = !!ariaLabel || !!labelledby
        if (id) {
          const label = document.querySelector(`label[for="${id}"]`)
          if (label) {
            return {
              index,
              snippet: element.outerHTML.slice(0, 160),
              labelled: true,
              labelSnippet: label.outerHTML.slice(0, 160)
            }
          }
        }
        return {
          index,
          snippet: element.outerHTML.slice(0, 160),
          labelled: hasLabel,
          labelSnippet: hasLabel ? `aria-label: ${ariaLabel ?? labelledby}` : undefined
        }
      })
    })

    const unlabeled = items.filter(item => !item.labelled)

    return {
      id: 'rgaa-11-1-1',
      auditId: '',
      criterionId: '11.1.1',
      label: 'Chaque champ de formulaire possède une étiquette',
      theme: 'Formulaires',
      type: 'assisted',
      wcag: ['3.3.2'],
      status: unlabeled.length === 0 ? 'needs_review' : 'failed',
      description: unlabeled.length === 0
        ? 'Tous les champs disposent d’une étiquette technique. Vérifier leur pertinence.'
        : `${unlabeled.length} champ(s) semblent dépourvus d’étiquette visible.`,
      remediation: 'Associer un élément label ou un attribut aria-label/aria-labelledby descriptif.',
      evidence: items.map((item) => ({
        id: `rgaa-11-1-1-${item.index}`,
        type: 'dom',
        snippet: item.snippet,
        description: item.labelled ? `Label trouvé: ${item.labelSnippet}` : 'Aucun label détecté'
      }))
    }
  }
}

export default rule
