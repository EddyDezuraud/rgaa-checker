import type { RgaaRule } from '../../types'

const rule: RgaaRule = {
  id: 'rgaa-1-1-1',
  label: 'Chaque image porte un texte alternatif pertinent',
  theme: 'Images',
  type: 'auto',
  wcag: ['1.1.1'],
  description: 'Vérifie que les images non décoratives exposent un attribut alt non vide.',
  remediation: 'Fournir un attribut alt court et explicite décrivant la fonction de l’image.',
  async isApplicable ({ page }) {
    const images = await page.$$eval('img', nodes => nodes.length)
    return images > 0
  },
  async run ({ page, dom }) {
    const failing = await page.$$eval('img', (nodes) => {
      return nodes.filter((node) => !node.hasAttribute('alt') || node.getAttribute('alt')?.trim() === '').map((node) => ({
        snippet: node.outerHTML.slice(0, 180)
      }))
    })

    return {
      id: 'rgaa-1-1-1',
      auditId: '',
      criterionId: '1.1.1',
      label: 'Chaque image porte un texte alternatif pertinent',
      theme: 'Images',
      type: 'auto',
      wcag: ['1.1.1'],
      status: failing.length === 0 ? 'passed' : 'failed',
      description: failing.length === 0
        ? 'Toutes les images possèdent un attribut alt renseigné.'
        : `${failing.length} image(s) sans attribut alt pertinent.`,
      remediation: 'Ajouter un attribut alt décrivant brièvement le rôle de chaque image non décorative.',
      evidence: failing.map((item, index) => ({
        id: `rgaa-1-1-1-${index}`,
        type: 'dom',
        snippet: item.snippet
      }))
    }
  }
}

export default rule
