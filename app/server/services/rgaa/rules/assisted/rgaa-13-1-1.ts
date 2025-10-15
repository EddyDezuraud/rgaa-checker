import type { RgaaRule } from '../../types'

const rule: RgaaRule = {
  id: 'rgaa-13-1-1',
  label: 'Raccourcis clavier déclarés',
  theme: 'Consultation',
  type: 'assisted',
  wcag: ['2.1.4'],
  description: 'Recense les attributs accesskey et demande une vérification de cohérence.',
  remediation: 'Documenter ou supprimer les raccourcis conflictuels.',
  async isApplicable ({ page }) {
    const shortcuts = await page.$$eval('[accesskey]', nodes => nodes.length)
    return shortcuts > 0
  },
  async run ({ page }) {
    const shortcuts = await page.$$eval('[accesskey]', (nodes) => {
      return nodes.map((node, index) => ({
        index,
        key: node.getAttribute('accesskey') ?? '',
        snippet: (node as HTMLElement).outerHTML.slice(0, 160)
      }))
    })
    return {
      id: 'rgaa-13-1-1',
      auditId: '',
      criterionId: '13.1.1',
      label: 'Raccourcis clavier déclarés',
      theme: 'Consultation',
      type: 'assisted',
      wcag: ['2.1.4'],
      status: shortcuts.length === 0 ? 'needs_review' : 'needs_review',
      description: shortcuts.length === 0
        ? 'Aucun raccourci détecté.'
        : `${shortcuts.length} raccourci(s) à documenter et vérifier.`,
      remediation: 'Communiquer clairement les raccourcis ou proposer une désactivation.',
      evidence: shortcuts.map((shortcut) => ({
        id: `rgaa-13-1-1-${shortcut.index}`,
        type: 'dom',
        snippet: shortcut.snippet,
        description: `Raccourci : ${shortcut.key}`
      }))
    }
  }
}

export default rule
