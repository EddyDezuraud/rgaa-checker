import type { RgaaRule } from '../../types'

const rule: RgaaRule = {
  id: 'rgaa-7-1-1',
  label: 'Gestion des événements souris/clavier',
  theme: 'Scripts',
  type: 'assisted',
  wcag: ['2.1.1'],
  description: 'Signale les éléments qui réagissent uniquement à la souris.',
  remediation: 'Ajouter des équivalents clavier (keydown/keyup) et tabindex appropriés.',
  async isApplicable ({ page }) {
    const interactive = await page.$$eval('[onclick]', nodes => nodes.length)
    return interactive > 0
  },
  async run ({ page }) {
    const elements = await page.$$eval('[onclick]', (nodes) => {
      return nodes.map((node, index) => ({
        index,
        hasKeydown: node.hasAttribute('onkeydown') || node.hasAttribute('onkeyup'),
        tabIndex: (node as HTMLElement).tabIndex,
        snippet: (node as HTMLElement).outerHTML.slice(0, 160)
      }))
    })
    const missing = elements.filter(element => !element.hasKeydown)
    return {
      id: 'rgaa-7-1-1',
      auditId: '',
      criterionId: '7.1.1',
      label: 'Gestion des événements souris/clavier',
      theme: 'Scripts',
      type: 'assisted',
      wcag: ['2.1.1'],
      status: missing.length === 0 ? 'needs_review' : 'failed',
      description: missing.length === 0
        ? 'Les événements souris semblent complétés. Vérifier les alternatives clavier.'
        : `${missing.length} élément(s) ne gèrent pas le clavier.`,
      remediation: 'Ajouter les événements clavier (keydown/keyup) et assurer la focusabilité.',
      evidence: elements.map((element) => ({
        id: `rgaa-7-1-1-${element.index}`,
        type: 'dom',
        snippet: element.snippet,
        description: element.hasKeydown ? 'Événements clavier présents' : 'Clavier absent'
      }))
    }
  }
}

export default rule
