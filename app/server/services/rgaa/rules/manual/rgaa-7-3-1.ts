import type { RgaaRule } from '../../types'

const rule: RgaaRule = {
  id: 'rgaa-7-3-1',
  label: 'Présence d’alternatives aux gestes complexes',
  theme: 'Scripts',
  type: 'manual',
  wcag: ['2.5.1'],
  description: 'Recense les éléments utilisant des gestes complexes (drag, multipoints) pour revue humaine.',
  remediation: 'Offrir une alternative clavier ou simple clic pour chaque interaction complexe.',
  async isApplicable ({ page }) {
    const candidates = await page.$$eval('[ondragstart], [data-gesture], [data-drag]', nodes => nodes.length)
    return candidates > 0
  },
  async run ({ page }) {
    const elements = await page.$$eval('[ondragstart], [data-gesture], [data-drag]', (nodes) => {
      return nodes.map((node, index) => ({
        index,
        snippet: (node as HTMLElement).outerHTML.slice(0, 160)
      }))
    })

    return {
      id: 'rgaa-7-3-1',
      auditId: '',
      criterionId: '7.3.1',
      label: 'Présence d’alternatives aux gestes complexes',
      theme: 'Scripts',
      type: 'manual',
      wcag: ['2.5.1'],
      status: 'needs_review',
      description: `${elements.length} élément(s) nécessitent une vérification de l’alternative clavier.`,
      remediation: 'Proposer une interaction simple (clic ou commande clavier) équivalente au geste complexe.',
      evidence: elements.map((item) => ({
        id: `rgaa-7-3-1-${item.index}`,
        type: 'dom',
        snippet: item.snippet,
        description: 'Interaction complexe détectée'
      }))
    }
  }
}

export default rule
