import type { RgaaRule } from '../../types'

const rule: RgaaRule = {
  id: 'rgaa-1-2-1',
  label: 'Images de texte',
  theme: 'Images',
  type: 'assisted',
  wcag: ['1.4.5'],
  description: 'Identifie les images contenant du texte potentiel pour valider l’alternative.',
  remediation: 'Remplacer les images de texte par du texte stylé ou fournir une alternative accessible.',
  async isApplicable ({ page }) {
    const count = await page.$$eval('img', nodes => nodes.length)
    return count > 0
  },
  async run ({ page }) {
    const candidates = await page.$$eval('img', (nodes) => {
      return nodes
        .filter((node) => (node.getAttribute('alt') ?? '').length > 40)
        .map((node, index) => ({
          index,
          snippet: node.outerHTML.slice(0, 200),
          alt: node.getAttribute('alt') ?? ''
        }))
    })
    return {
      id: 'rgaa-1-2-1',
      auditId: '',
      criterionId: '1.2.1',
      label: 'Images de texte',
      theme: 'Images',
      type: 'assisted',
      wcag: ['1.4.5'],
      status: candidates.length === 0 ? 'needs_review' : 'failed',
      description: candidates.length === 0
        ? 'Aucune image de texte détectée. Confirmer visuellement.'
        : `${candidates.length} image(s) semblent contenir du texte.`,
      remediation: 'Utiliser du texte HTML stylé ou fournir une alternative équivalente.',
      evidence: candidates.map((item) => ({
        id: `rgaa-1-2-1-${item.index}`,
        type: 'dom',
        snippet: item.snippet,
        description: `Attribut alt long (${item.alt.length} caractères)`
      }))
    }
  }
}

export default rule
