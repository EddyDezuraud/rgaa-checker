import type { RgaaRule } from '../../types'

const rule: RgaaRule = {
  id: 'rgaa-6-1-1',
  label: 'Entêtes de tableaux de données',
  theme: 'Tableaux',
  type: 'assisted',
  wcag: ['1.3.1'],
  description: 'Recense les tableaux de données dépourvus d’entêtes th/aria.',
  remediation: 'Utiliser des éléments <th> avec scope ou aria-labelledby.',
  async isApplicable ({ page }) {
    const tables = await page.$$eval('table', nodes => nodes.length)
    return tables > 0
  },
  async run ({ page }) {
    const tables = await page.$$eval('table', (nodes) => {
      return nodes.map((node, index) => {
        const headers = Array.from(node.querySelectorAll('th'))
        return {
          index,
          headers: headers.length,
          snippet: (node as HTMLTableElement).outerHTML.slice(0, 200)
        }
      })
    })
    const missing = tables.filter(table => table.headers === 0)
    return {
      id: 'rgaa-6-1-1',
      auditId: '',
      criterionId: '6.1.1',
      label: 'Entêtes de tableaux de données',
      theme: 'Tableaux',
      type: 'assisted',
      wcag: ['1.3.1'],
      status: missing.length === 0 ? 'needs_review' : 'failed',
      description: missing.length === 0
        ? 'Les tableaux possèdent des entêtes. Vérifier la cohérence.'
        : `${missing.length} tableau(x) sans entêtes détectés.`,
      remediation: 'Ajouter des entêtes <th> et associer les cellules de données.',
      evidence: tables.map((table) => ({
        id: `rgaa-6-1-1-${table.index}`,
        type: 'dom',
        snippet: table.snippet,
        description: `${table.headers} entête(s) détectée(s)`
      }))
    }
  }
}

export default rule
