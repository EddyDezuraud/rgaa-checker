import type { RgaaRule } from '../../types'

const rule: RgaaRule = {
  id: 'rgaa-10-1-1',
  label: 'Listes correctement structurées',
  theme: 'Présentation de l’information',
  type: 'assisted',
  wcag: ['1.3.1'],
  description: 'Détecte les listes construites sans balises <ul>/<ol>.',
  remediation: 'Utiliser les balises de liste appropriées ou les rôles ARIA.',
  async isApplicable ({ page }) {
    const paragraphs = await page.$$eval('p', nodes => nodes.length)
    return paragraphs > 0
  },
  async run ({ page }) {
    const suspects = await page.$$eval('p', (nodes) => {
      return nodes
        .filter((node) => /^[-•\d]/.test((node.textContent ?? '').trim()))
        .map((node, index) => ({
          index,
          snippet: node.outerHTML.slice(0, 160)
        }))
    })
    return {
      id: 'rgaa-10-1-1',
      auditId: '',
      criterionId: '10.1.1',
      label: 'Listes correctement structurées',
      theme: 'Présentation de l’information',
      type: 'assisted',
      wcag: ['1.3.1'],
      status: suspects.length === 0 ? 'needs_review' : 'failed',
      description: suspects.length === 0
        ? 'Aucune liste non structurée détectée. Vérifier visuellement.'
        : `${suspects.length} paragraphe(s) ressemblent à une liste sans balises.`,
      remediation: 'Remplacer ces paragraphes par des listes <ul>/<ol> ou ajouter role="list".',
      evidence: suspects.map((item) => ({
        id: `rgaa-10-1-1-${item.index}`,
        type: 'dom',
        snippet: item.snippet
      }))
    }
  }
}

export default rule
