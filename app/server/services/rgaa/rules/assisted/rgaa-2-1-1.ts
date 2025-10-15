import type { RgaaRule } from '../../types'

const rule: RgaaRule = {
  id: 'rgaa-2-1-1',
  label: 'Titres des cadres',
  theme: 'Cadres',
  type: 'assisted',
  wcag: ['2.4.1'],
  description: 'Repère les iframes sans titre accessible.',
  remediation: 'Ajouter un titre décrivant le contenu de chaque frame.',
  async isApplicable ({ page }) {
    const frames = await page.$$eval('iframe', nodes => nodes.length)
    return frames > 0
  },
  async run ({ page }) {
    const frames = await page.$$eval('iframe', (nodes) => {
      return nodes.map((node, index) => ({
        index,
        title: node.getAttribute('title') ?? '',
        snippet: node.outerHTML.slice(0, 200)
      }))
    })
    const missing = frames.filter(frame => frame.title.trim().length === 0)
    return {
      id: 'rgaa-2-1-1',
      auditId: '',
      criterionId: '2.1.1',
      label: 'Titres des cadres',
      theme: 'Cadres',
      type: 'assisted',
      wcag: ['2.4.1'],
      status: missing.length === 0 ? 'needs_review' : 'failed',
      description: missing.length === 0
        ? 'Tous les cadres possèdent un titre. Vérifier sa pertinence.'
        : `${missing.length} cadre(s) sans titre détecté(s).`,
      remediation: 'Ajouter un attribut title explicite décrivant le contenu ou la fonction du cadre.',
      evidence: frames.map((frame) => ({
        id: `rgaa-2-1-1-${frame.index}`,
        type: 'dom',
        snippet: frame.snippet,
        description: frame.title ? `Titre: ${frame.title}` : 'Aucun titre'
      }))
    }
  }
}

export default rule
