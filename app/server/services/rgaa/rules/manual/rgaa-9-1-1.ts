import type { RgaaRule } from '../../types'

const rule: RgaaRule = {
  id: 'rgaa-9-1-1',
  label: 'Structuration de la page par les titres',
  theme: 'Structuration de l’information',
  type: 'manual',
  wcag: ['1.3.1'],
  description: 'Propose une extraction des titres pour vérification humaine de la hiérarchie.',
  remediation: 'Respecter une hiérarchie logique (h1 unique, niveaux successifs).',
  async isApplicable ({ page }) {
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', nodes => nodes.length)
    return headings > 0
  },
  async run ({ page }) {
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', (nodes) => {
      return nodes.map((node) => ({
        level: Number((node as HTMLElement).tagName.substring(1)),
        text: (node.textContent ?? '').trim(),
        snippet: (node as HTMLElement).outerHTML.slice(0, 160)
      }))
    })

    return {
      id: 'rgaa-9-1-1',
      auditId: '',
      criterionId: '9.1.1',
      label: 'Structuration de la page par les titres',
      theme: 'Structuration de l’information',
      type: 'manual',
      wcag: ['1.3.1'],
      status: 'needs_review',
      description: 'Vérifier la cohérence de la hiérarchie des titres ci-dessous.',
      remediation: 'Réordonner les niveaux de titres pour refléter la structure logique du contenu.',
      evidence: headings.map((heading, index) => ({
        id: `rgaa-9-1-1-${index}`,
        type: 'note',
        description: `H${heading.level} – ${heading.text}`,
        snippet: heading.snippet
      }))
    }
  }
}

export default rule
